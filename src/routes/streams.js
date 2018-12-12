const Router = require('koa-router')
const axios = require('axios')

module.exports = class Users extends Router {
  constructor(app) {
    super()
    this.app = app

    this.get('/streams', this.getStreams.bind(this))
    this.patch('/streams/:id', this.updateStream.bind(this))
    this.get('/streams/sub', this.verifyStreamSub.bind(this))
    this.post('/streams/sub', this.processStreamSub.bind(this))
  }

  async getStreams(ctx) {
    const $elemMatch = ctx.request.query
    const streams = await this.app.db.users.find({
      stream: { $elemMatch }
    }).exec()
    return ctx.body = {
      streams,
    }
  }

  async updateStream(ctx) {
    let user = null
    
    try {
      user = await this.app.db.users
        .findOne({ 'stream.id': ctx.params.id })
        .exec()
      const e = new Error('Stream not found')
      if (!user) throw e
    }
    catch(e) {
      ctx.throw(e.status || 500, e)
    }

    if (ctx.request.body.tags) {
      ctx.request.body.tags = await this.app.db.tags.findOrCreate(ctx.request.body.tags)
    }

    user.stream = {
      ...user.stream.toJSON(),
      ...ctx.request.body,
    }
    user = await user.save()

    ctx.body = {
      stream: user.stream,
    } 
  }

  async verifyStreamSub(ctx) {
    ctx.body = ctx.request.query['hub.challenge']
  }

  async processStreamSub(ctx) {
    const { query, body } = ctx.request
    const { user_id } = query
    const { data } = body

    ctx.status = 200
    
    let user = null
    try {
      user = await this.app.db.users.findById(user_id).exec()
      if (!user) throw new Error(`User not found with id ${user_id}`)
    }
    catch(e) {
      ctx.throw(404, e)
    }

    if (data[0]) {
      this.startStream(user, data[0])
    }
    else {
      this.archiveStream(user)
    }
  }

  startStream(user, stream) {
    user.stream = { ...stream,
      tags: [ ...user.tags ],
    }
    user.save()
  }

  archiveStream(user) {
    // TODO: Get video from Twitch and add tags from deleted video
    // const tags = [ ...user.stream.tags ]
    // const videosResponse = axios.get('https://api.twitch.tv/helix/videos', {
    //   params: {
    //     user_id: user.authid.twitch,
    //   }
    // })
    // const video = { ...videosResponse.data.data[0], tags }
    // user.videos = [ ...user.videos, video ]
    user.stream = {}
    user.save()
  }
}