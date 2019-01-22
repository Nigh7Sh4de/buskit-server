const Router = require('koa-router')
const Passport = require('koa-passport')
const axios = require('axios')
const jsonwebtoken = require('jsonwebtoken')

module.exports = class Auth extends Router {
  constructor(app) {
    super()
    this.app = app
    
    this.get('/auth/twitch/redirect', this.authWithTwitch.bind(this))
  }

  async authWithTwitch(ctx) {
    const { SECRET_KEY } = this.app.config
    const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = this.app.config.twitch

    try {
      const codeResponse = await axios.post(`${api.token}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${ctx.request.query.code}&grant_type=authorization_code&redirect_uri=${REDIRECT_URI}`)
      const userResponse = await axios.get(api.GET_USER, {
        headers: { Authorization: 'Bearer ' + codeResponse.data.access_token }
      })

      const user = await this.findOrCreateTwitchUser(userResponse.data.data[0])
      await this.subscribeToStreamChanges(user.id)

      const token = jsonwebtoken.sign({
        display_name: user.profile.display_name,
        id: user.id,
      }, SECRET_KEY, {
        issuer: ISSUER,
      })

      ctx.body = { 
        user: user.toJSON(),
        token,
      }

    }
    catch(err) {
      const error = err.response ? err.response.data : err
      console.error(error)
      return ctx.throw(error.status, error)
    }
  }

  async subscribeToStreamChanges(id) {
    const { PUBLIC_URI } = this.app.config
    const { CLIENT_ID, CLIENT_SECRET } = this.app.config.twitch

    return await axios.post(api.webhooks, {
      'hub.mode': 'subscribe',
      'hub.topic': `${api.streams}?user_id=${id}`,
      'hub.callback': `${PUBLIC_URI}/streams/sub?user_id=${id}`,
      'hub.lease_seconds': 864000,
      'hub.secret': CLIENT_SECRET,
    }, {
      headers: { 'Client-ID': CLIENT_ID },
    })
  }
  
  async findOrCreateTwitchUser(twitchProfile) {
    let user = await this.app.db.users.find({ ['authid.twitch']: twitchProfile.id })
    
    if (user.length) {
      user = user[0]
    }
    else {
      const profile = { 
        display_name: twitchProfile.display_name,
        description: twitchProfile.description,
        profile_image_url: twitchProfile.profile_image_url,
      }
      const twitch = twitchProfile.id
      user = await new this.app.db.users({
        profile,
        authid: {
          twitch,
        },
      }).save()
    }
  
    return user
  }
}