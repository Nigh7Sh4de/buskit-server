const Router = require('koa-router')
const axios = require('axios')


module.exports = class Users extends Router {
  constructor(app) {
    super()

    this.get('/users/:id', app.passport.authenticate('jwt', { session: false}), this.getUser)
  }

  async getUser(ctx) {
    const user = await this.db.users.findById(ctx.request.query.id).exec()
    return ctx.body = {
      user,
    }
  }
}