const Router = require('koa-router')
const axios = require('axios')

module.exports = class Users extends Router {
  constructor(app) {
    super()
    this.app = app

    this.get('/streams', app.passport.authenticate('jwt', { session: false}), this.getStreams.bind(this))
    this.get('/streams/sub', this.verifyStreamSub.bind(this))
    this.post('/streams/sub', this.processStreamSub.bind(this))
  }

  async getStreams(ctx) {
    const streams = await this.db.streams.find({}).exec()
    return ctx.body = {
      streams,
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

    user.streams = data
    user.save()
  }
}