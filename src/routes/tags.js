const Router = require("koa-router");
const Tags = require("../db/tags");

module.exports = class Tags extends Router {
    constructor(app){
        super();
        this.get("/tags", this.getTags);
    }
    async getTags(ctx){
        const tags = await Tags.find({});
        ctx.body = tags;
    }
}