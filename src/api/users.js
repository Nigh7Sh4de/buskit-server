const Router = require('koa-router')
const axios = require('axios')

const { verifyUser } = require('./security')

module.exports = class Users extends Router {
  constructor(app) {
    super()
    const { security } = app.db
    this.app = app

    this.get('/users/:id', 
      app.passport.authenticate('jwt', { session: false}), 
      verifyUser(security.levels.admin), 
      this.getUser.bind(this),
    )
  }

  async getUser(ctx) {
    console.log(`1`)
    const user = await this.app.db.users.findById(ctx.params.id).exec()
    console.log(user)
    return ctx.body = {
      user,
    }
  }
}