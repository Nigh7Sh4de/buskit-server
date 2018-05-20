const Passport = require('koa-passport')
const TwitchStrategy = require('passport-twitch-new').Strategy
const User = require('./db/users')

module.exports = function(db) {
  async function checkUser(strategy, profile, cb) {
    try {
      const search = { ['authid.' + strategy]: profile.id }
      let user = await db.users.findOne(search) 
      if (!user) 
        user = await new User({
          ...search,
          profile,
        }).save()
  
      cb(null, user)
    }
    catch(err) {
      cb(err)
    }
  }

  Passport.use(new TwitchStrategy({
    clientID: "k6zpqqplgc8nyknrnkag6qhfpesc9p",
    clientSecret: "lhkndwvkvhqgqx6yv1rulqqcpc02am",
    callbackURL: "http://localhost:3000/auth/twitch/redirect",
    scope: "openid",
  }, (accessToken, refreshToken, profile, done) => {
    checkUser('twitch', profile, done)
  }))

  Passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  Passport.deserializeUser(async (id, done) => {
    try {
      const user = db.users.findById(id)
      done(null, user)
    }
    catch(err) {
      done(err)
    }
  })

  return Passport
}
