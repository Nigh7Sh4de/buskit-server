const Router = require('koa-router')
const axios = require('axios')

module.exports = class Videos extends Router {
  constructor(app) {
    super()
    this.app = app

    this.get('/videos', this.getVideos.bind(this))
    this.post('/videos', this.createVideo.bind(this))
  }

  async getVideos(ctx) {
    const query = {}
    for (let prop in ctx.request.query) {
      switch (prop) {
        case 'tags':
          query[`tags.${prop}`] = { 
            $in: await this.app.db.tags
              .find({
                label: { $in: ctx.request.query[prop].split(',') }
              }) 
              .exec()
          }
          break;
        default: query[`tags.${prop}`] = ctx.request.query[prop]
      }
    }
    let users

    try {
      users = await this.app.db.users
      .find(query)
      .exec()
      if (!users.length) {
        const e = new Error('Videos not found')
        e.status = 404
        throw e
      }
    }
    catch(e) {
      return ctx.throw(e.status || 500, e)
    }

    const videos = users.reduce((acc, user) => acc.concat(user.videos), [])

    return ctx.body = {
      videos,
    }
  }

  async createVideo(ctx) {
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

    if (!data.length) {
      return await this.addVideoToUser(user, data)
    }
  }
  
  async addVideoToUser(user, video) {
    user.videos = [ ...user.videos,
      video,
    ]
    return await user.save()
  }
}