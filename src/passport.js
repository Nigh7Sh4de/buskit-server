const Passport = require('koa-passport')
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt
const User = require('./db/users')

module.exports = function(db) {
  async function checkUser({sub: { id }}, cb) {
    try {
      let user = await db.users.findById(id) 
      if (!user) 
        cb(new Error('you dont exist sorry'))
      cb(null, user)
    }
    catch(err) {
      cb(err)
    }
  }

  Passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: ['buskit-thesecretestofkeys'],
    issuer: ['tv.buskit'],
  }, checkUser))
  
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
