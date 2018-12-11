const Router = require('koa-router')
const axios = require('axios')

module.exports = class Users extends Router {
  constructor(app) {
    super()

    this.get('/tags', this.getTags.bind(app))
  }

  async getTags(ctx) {
    const tags = await this.db.tags.find({}).exec()
    return ctx.body = {
      tags,
    }
  }
}