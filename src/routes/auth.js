const Router = require('koa-router')
const Passport = require('koa-passport')
const axios = require('axios')
const jsonwebtoken = require('jsonwebtoken')

const private_key = '-----BEGIN RSA PRIVATE KEY-----MIICXwIBAAKBgQDgtqSRqd4svFNtTmCxk9gXEDWsfWqzDeqStdbsYC7XWOhEeQjUkpHKeWw4sLi3SwLOAHX2Y12YSMHq4C2CsntYURkNMexe9Xa/jVbEDenHEx0HhReWUvdYnj2oUynah2H2jF7cqRbk4kWFwHmE3tCufseh8JTi8L4HzwdZNNEP+QIDAQABAoGBAMeD4qIiPE1j+H64dEm2hsoTblR0FmRcGsWgBe9hhrVVDwScoiZ67E7leBzta1Pymc7lwda9asBm+SXdXQsKBVA+4KlhhrATJGLFDE1tDgN3xujzfpTmdLugpp4Vw9wcsLo+ru0Bk9LMCP73REnMgW/DEe7YdAefbF80THYaERABAkEA8qdfAtbXqYUNFmxC1pHPQ0hJduc1QqyBvRL0wI+ivttCxha6TS2ugTDFRyDAFUbu+JoPQUje/sZwjUN61o2JeQJBAO0Sqr4fE8ZERth78UHsLVrmCcUEnGHjP2OGHJi8UJggrEfDf5v7bMIQtWvVrPA0XF/A++29c98nn0dYXmIsmoECQQCopbT+Ny3KryOKexH1KYAg5iPRFR7KSTUeoQcksm/NMHz3SiKPs3k+ZxQlvFhkMVmzxPdnS2tZLbhaJhVA+zwZAkEAmSgdHHRxTv5fEo6H30HYT0gb+acv7GFmW0KSCO5n1tAM3NPlBf1ZVsp6mi7R6eC56LaBSybAy+MKGIpzd1M/gQJBAMEChiAdIZEFK7P2ghcR4IknJm1aHS8iSekhq9MeyFZCNtpNjlF+yjxlOLN7W9EkCikMB8s6McwLMiluCXz798M=-----END RSA PRIVATE KEY-----'

module.exports = class Auth extends Router {
  constructor(app) {
    super()
    // this.get('/auth/twitch/', Passport.authenticate('twitch', { forceVerify: true }))
    this.get('/auth/twitch/redirect', async ctx => {
      try {
        const codeResponse = await axios.post('https://id.twitch.tv/oauth2/token?client_id=k6zpqqplgc8nyknrnkag6qhfpesc9p&client_secret=lhkndwvkvhqgqx6yv1rulqqcpc02am&code=' + ctx.request.query.code + '&grant_type=authorization_code&redirect_uri=http://localhost:8080/redirect')
        const userResponse = await axios.get('https://api.twitch.tv/helix/users', {
          headers: { Authorization: 'Bearer ' + codeResponse.data.access_token }
        })
        const profile = userResponse.data.data[0]
        const twitch_id = profile.id
        delete profile.id

        let user = await app.db.users.find({ ['authid.twitch']: twitch_id })
        if (user.length) 
          user = user[0]
        else
          user = await new app.db.users({
            profile,
            authid: {
              twitch: profile.id
            },
          }).save()

        const token = jsonwebtoken.sign({
          display_name: user.profile.display_name,
          id: user.id,
        }, 'buskit-thesecretestofkeys', {
          issuer: 'tv.buskit'
        })

        ctx.body = { 
          ...user.toJSON(),
          token 
        }

      }
      catch(err) {
        console.error(err)
        return ctx.throw(400, err)
      }
    })
  }
}