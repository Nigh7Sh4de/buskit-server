const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/test')

const User = mongoose.model('User', {
  name: String,
  accessToken: String,
})

const Koa = require('koa')
const Router = require('koa-route')
const bodyParser = require('koa-bodyparser')
const app = new Koa()

app.use(bodyParser())

app.use(Router.post('/users', async ctx => {
  if (!ctx.request.body)
    return ctx.throw(400, 'No request body')
  if (!ctx.request.body.name)
    return ctx.throw(400, 'No request body')

  const new_user = new User({ name: ctx.request.body.name })
  const result = await new_user.save()
  ctx.body = result
}))

app.listen(3000);
console.log('Listening on 3000')

