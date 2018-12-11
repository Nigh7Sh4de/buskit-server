const Router = require('koa-router')
const axios = require('axios')

module.exports = class Users extends Router {
  constructor(app) {
    super()
    this.app = app

    this.get('/tags', this.getTags.bind(this))
    this.post('/tags', this.addTags.bind(this))
    this.delete('/tags/:tag', this.deleteTag.bind(this))
  }

  async getTags(ctx) {
    const tags = await this.db.tags.find({}).exec()
    return ctx.body = {
      tags,
    }
  }

  async addTags(ctx) {
    if (!ctx.request.body.tags) {
      return ctx.throw(400, 'Must specify tags')
    }
    if (!(ctx.request.body.tags instanceof Array)) {
      return ctx.throw(400, 'Tags must be an array')
    }

    ctx.body = {
      tags: [],
      error: null,
    }

    try {
      ctx.body.tags = await this.app.db.tags.insertMany(
        ctx.request.body.tags.map(_id => ({ _id })),
        { ordered: false }
      )
    }
    catch(error) {
      ctx.body.tags = error.writeErrors
        .filter(e => e.code === 11000)
        .map(e => e.getOperation())
      ctx.body.error = error
    }
  }

  async deleteTag(ctx) {
    console.log(ctx.params)
    let tag = null
    try {
      tag = await this.app.db.tags.findById(ctx.params.tag).exec()
      if (!tag) throw new Error(`Tag not found: ${ctx.params.tag}`)
    }
    catch (e) {
      return ctx.throw(404, e)
    }

    tag = await tag.remove()

    ctx.body = {
      tag,
    }
  }
}