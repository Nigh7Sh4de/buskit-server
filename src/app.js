const app = function(inject) {


  const Koa = require('koa')
  const Router = require('koa-router')
  const bodyParser = require('koa-bodyparser')
  const Passport = require('koa-passport')

  const app = new Koa()

  app.keys = ['buskit-secreykeyofsecrets']
  app.use(bodyParser())

  app.config = inject.config

  app.db = new inject.db()
  if (app.db.connect != null && typeof app.db.connect === 'function')
      app.db.connect(app.config.DB_CONNECTION_STRING)

  app.passport = require('passport')
  const strategies = new inject.strategies(app.db, app.config)
  for (var strat in strategies) {
    app.passport.use(strategies[strat])
  }

  const AuthRouter = new Router()
  AuthRouter.get('/auth/twitch/', ctx => ctx.login())
  AuthRouter.get('/auth/twitch/redirect', ctx => {
    ctx.isAuthenticated()
    console.log('You made it!')
    ctx.body = "You made it!"
  })

  app.use(Passport.initialize())

  app.use(AuthRouter.routes())
  app.use(AuthRouter.allowedMethods())

  // app.use(Router.post('/users', async ctx => {
  //   if (!ctx.request.body)
  //     return ctx.throw(400, 'No request body')
  //   if (!ctx.request.body.name)
  //     return ctx.throw(400, 'No request body')

  //   const new_user = new User({ name: ctx.request.body.name })
  //   const result = await new_user.save()
  //   ctx.body = result
  // }))

  return app
}

app.GetDefaultInjection = function(allowConnect) {
  const inject = {
    config: require('../config'),
    db: require('./db'),
    strategies: require('./strategies'),
  }

  if (!allowConnect)
    inject.db.connect = null

  return inject
}

module.exports = app