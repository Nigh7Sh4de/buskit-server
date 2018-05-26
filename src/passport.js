const Passport = require('koa-passport')
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt
const User = require('./db/users')

module.exports = function(db) {
  async function checkUser(profile, cb) {
    try {
      let user = await db.users.findById(profile.id) 
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
    secretOrKey: 'buskit-thesecretestofkeys',
    issuer: ['tv.buskit'],
  }, checkUser))

  return Passport
}
