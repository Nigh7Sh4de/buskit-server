const Router = require('koa-router')
const axios = require('axios')

const { verifyUser } = require('./security')

module.exports = class Users extends Router {
  constructor(app) {
    super()
    const { security } = app.db
    this.app = app

    this.get('/users',
      this.getAllUsers.bind(this),
    )

    this.get('/users/:id', 
      this.getUser.bind(this),
    )
  }

  async getAllUsers(ctx) {
    const users = await this.app.db.users.find({}).exec()
    return ctx.body = {
      users,
    }
  }

  async getUser(ctx) {
    const user = await this.app.db.users.findById(ctx.params.id).exec()
    return ctx.body = {
      user,
    }
  }
}