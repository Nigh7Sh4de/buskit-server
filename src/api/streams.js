const Router = require('koa-router')
const axios = require('axios')

module.exports = class Streams extends Router {
  constructor(app) {
    super()
    this.app = app

    this.get('/streams', this.getStreams.bind(this))
    this.patch('/streams/:id', this.updateStream.bind(this))
    this.get('/streams/sub', this.verifyStreamSub.bind(this))
    this.post('/streams/sub', this.processStreamSub.bind(this))
  }

  async getStreams(ctx) {
    const query = {}
    for (let prop in ctx.request.query) {
      switch (prop) {
        case 'tags':
          query[`stream.${prop}`] = { 
            $in: await this.app.db.tags
              .find({
                label: { $in: ctx.request.query[prop].split(',') }
              }) 
              .exec()
          }
          break;
        default: query[`stream.${prop}`] = ctx.request.query[prop]
      }
    }
    let users

    try {
      users = await this.app.db.users
      .find(query)
      .exec()
      if (!users.length) {
        const e = new Error('Streams not found')
        e.status = 404
        throw e
      }
    }
    catch(e) {
      return ctx.throw(e.status || 500, e)
    }

    const streams = users.map(user => ({
      ...user.stream.toJSON(),
      user_id: user.id,
    }))

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
    const tags = [ ...user.stream.tags ]
    const videosResponse = axios.get('https://api.twitch.tv/helix/videos', {
      params: {
        user_id: user.authid.twitch,
      }
    })
    const video = { ...videosResponse.data.data[0], tags }
    this.app.videos.addVideoToUser(user, video)
  }
}