const Router = require('koa-router')


module.exports = class Users extends Router {
  constructor(app) {
    super()

    this.get('/users/:id', app.passport.authenticate('jwt', { session: false}), async ctx => {
      const auth = ctx.isAuthenticated()
      const user = ctx.req.user
      return ctx.body = { auth, user }
    })
  }
}