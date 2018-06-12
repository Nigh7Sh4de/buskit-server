const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const Session = require('koa-session')
const CORS = require('koa2-cors')

const app = function(inject) {

  const app = new Koa()

  app.use(CORS())

  app.keys = ['buskit-secreykeyofsecrets']
  app.use(bodyParser())

  app.config = inject.config

  app.db = new inject.db()
  if (app.db.connect != null && typeof app.db.connect === 'function')
      app.db.connect(app.config.DB_CONNECTION_STRING)

  app.passport = inject.passport(app.db)
  app.use(app.passport.initialize())

  for (var router in inject.routes) {
    const r = new inject.routes[router](app)
    app.use(r.routes())
    app.use(r.allowedMethods())
  }

  return app
}

app.GetDefaultInjection = function(allowConnect) {
  const inject = {
    config: require('../config'),
    db: require('./db'),
    passport: require('./passport'),

    routes: {
      auth: require('./routes/auth'),
      users: require('./routes/users'),
      streams: require('./routes/streams'),
    }
  }

  if (!allowConnect)
    inject.db.connect = null

  return inject
}

module.exports = app