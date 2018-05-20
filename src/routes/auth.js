const Router = require('koa-router')
const Passport = require('koa-passport')

module.exports = class Auth extends Router {
  constructor(app) {
    super()
    this.get('/auth/twitch/', Passport.authenticate('twitch', { forceVerify: true }))
    this.get('/auth/twitch/redirect', Passport.authenticate('twitch'), ctx => {
      console.log('You made it!')
      ctx.body = "You made it!"
    })
  }
}