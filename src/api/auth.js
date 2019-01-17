const Router = require('koa-router')
const Passport = require('koa-passport')
const axios = require('axios')
const jsonwebtoken = require('jsonwebtoken')

const redirect_uri = 'https://www.buskit.live/redirect'
const client_id = 'zeod52e6vf639p7ztytpuekmyucm2n'
const client_secret = 'n5i3yuhfki8u9mllimmk9l6hetvgvt'

module.exports = class Auth extends Router {
  constructor(app) {
    super()
    this.app = app
    
    this.get('/auth/twitch/redirect', this.authWithTwitch.bind(this))
  }

  async authWithTwitch(ctx) {
    try {
      const codeResponse = await axios.post(`https://id.twitch.tv/oauth2/token?client_id=${client_id}&client_secret=${client_secret}&code=${ctx.request.query.code}&grant_type=authorization_code&redirect_uri=${redirect_uri}`)
      const userResponse = await axios.get('https://api.twitch.tv/helix/users', {
        headers: { Authorization: 'Bearer ' + codeResponse.data.access_token }
      })

      const user = await this.findOrCreateTwitchUser(userResponse.data.data[0])
      await this.subscribeToStreamChanges(user.id)

      const token = jsonwebtoken.sign({
        display_name: user.profile.display_name,
        id: user.id,
      }, 'buskit-thesecretestofkeys', {
        issuer: 'tv.buskit'
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
    return await axios.post('https://api.twitch.tv/helix/webhooks/hub', {
      'hub.mode': 'subscribe',
      'hub.topic': `https://api.twitch.tv/helix/streams?user_id=${id}`,
      'hub.callback': `https://www.buskit.live/streams/sub?user_id=${id}`,
      'hub.lease_seconds': 300,
      'hub.secret': 'buskit-twitchsecret',
    }, {
      headers: { 'Client-ID': 'zeod52e6vf639p7ztytpuekmyucm2n' },
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