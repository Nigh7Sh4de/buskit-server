const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const Session = require('koa-session')
const CORS = require('koa2-cors')

const app = function(inject) {

  const app = new Koa()

  app.use(CORS({
    origin: 'https://www.buskit.live'
  }))

  app.keys = ['buskit-secreykeyofsecrets']
  app.use(bodyParser())

  app.config = inject.config

  app.db = new inject.db()
  if (app.db.connect != null && typeof app.db.connect === 'function')
      app.db.connect(app.config.DB_CONNECTION_STRING)

  app.passport = inject.passport(app.db)
  app.use(app.passport.initialize())

  for (let router in inject.api) {
    const r = new inject.api[router](app)
    app[router] = r
    app.use(r.routes())
  }

  return app
}

app.GetDefaultInjection = function(allowConnect) {
  const inject = {
    config: require('../config'),
    db: require('./db'),
    passport: require('./lib/passport'),
    api: require('./api'),
  }

  if (!allowConnect)
    inject.db.connect = null

  return inject
}

module.exports = app