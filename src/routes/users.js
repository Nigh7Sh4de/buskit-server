const Router = require('koa-router')


module.exports = class Users extends Router {
  constructor(app) {
    super()

    this.get('/users/:id', app.passport.authenticate('jwt', { session: false}), async ctx => {
      return ctx.body = ctx.req.user
    })
  }
}