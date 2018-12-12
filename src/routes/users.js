const Router = require('koa-router')
const axios = require('axios')


module.exports = class Users extends Router {
  constructor(app) {
    super()
    this.app = app

    this.get('/users/:id', this.getUser.bind(this))
  }

  async getUser(ctx) {
    const user = await this.app.db.users.findById(ctx.params.id).exec()
    return ctx.body = {
      user,
    }
  }
}