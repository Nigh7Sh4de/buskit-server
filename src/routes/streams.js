const Router = require('koa-router')
const axios = require('axios')

module.exports = class Users extends Router {
  constructor(app) {
    super()

    this.get('/streams', app.passport.authenticate('jwt', { session: false}), async ctx => {
      const streams = await axios.get('https://api.twitch.tv/helix/streams', {
        headers: {
          'Client-ID': 'k6zpqqplgc8nyknrnkag6qhfpesc9p'
        }
      })
      return ctx.body = {
        data: streams.data.data
      }
    })
  }
}