const Router = require('koa-router')
const axios = require('axios')

module.exports = class Users extends Router {
  constructor(app) {
    super()

    this.get('/streams', app.passport.authenticate('jwt', { session: false}), this.getStreams)
  }

  async getStreams(ctx) {
    const streams = await this.db.streams.find({}).exec()
    return ctx.body = {
      streams,
    }
  }
}