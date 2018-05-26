const Router = require('koa-router')
const Passport = require('koa-passport')


module.exports = class Users extends Router {
  constructor(app) {
    super()
    
    this.get('/users/:id', async ctx => {
      const auth = ctx.isAuthenticated()
      return ctx.body = { auth }
    })
  }
}