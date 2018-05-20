const TwitchStrategy = require('passport-twitch-new').Strategy
const User = require('./db/users')

module.exports = function(db, config) {
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

  return {

    TwitchStrategy: new TwitchStrategy({
      clientID: "k6zpqqplgc8nyknrnkag6qhfpesc9p",
      clientSecret: "lhkndwvkvhqgqx6yv1rulqqcpc02am",
      callbackURL: "http://localhost:3000/auth/twitch/redirect",
      scope: "openid",
    }, (accessToken, refreshToken, profile, done) => {
      checkUser('twitch', profile, done)
    })
  }
}
