const Router = require("koa-router");
const router = new Router();

module.exports = class Tags extends Router {
    constructor(app){
        super()
        this.get('/tags', { session: false}, this.getTags)
    }
    async getTags(ctx){
        
    }
}