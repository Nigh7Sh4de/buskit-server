const Router = require('koa-router')


module.exports = class Security extends Router {
  constructor(app) {
    super()

    this.app = app
  }

  static verifyUser(level) {
    return (ctx, next) => {
      if (ctx.req.user.security.level === level) {
        return next()
      }
      else {
        ctx.throw(403, new Error('User not authorized'))
      }
    }
  }
}