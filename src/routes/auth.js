const Router = require('koa-router')
const Passport = require('koa-passport')
const axios = require('axios')

module.exports = class Auth extends Router {
  constructor(app) {
    super()
    this.get('/auth/twitch/', Passport.authenticate('twitch', { forceVerify: true }))
    this.get('/auth/twitch/redirect', async ctx => {
      try {
        const result = await axios.post('https://id.twitch.tv/oauth2/token?client_id=k6zpqqplgc8nyknrnkag6qhfpesc9p&client_secret=lhkndwvkvhqgqx6yv1rulqqcpc02am&code=' + ctx.request.query.code + '&grant_type=authorization_code&redirect_uri=buskit://buskit.tv/redirect')
        return ctx.body = result.data
      }
      catch(err) {
        return ctx.throw(400, err)
      }
    })
  }
}