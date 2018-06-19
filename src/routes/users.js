const Router = require('koa-router')
const axios = require('axios')


module.exports = class Users extends Router {
  constructor(app) {
    super()

    this.get('/users/:id', app.passport.authenticate('jwt', { session: false}), this.getUser)
  }

  async getUser(ctx) {
    if (ctx.req.user.id === ctx.params.id) return ctx.body = ctx.req.user
    
    const response = await axios.get(`https://api.twitch.tv/helix/users?id=${ctx.params.id}`, {
      headers: {
        'Client-ID': 'k6zpqqplgc8nyknrnkag6qhfpesc9p'
      }
    })

    return ctx.body = {
      data: response.data.data[0] || null
    }
  }
}