const Router = require("koa-router");
const Tags = require("../db/tags");

module.exports = function(db) {
    async function getTags(ctx) {
        try {
            const tags = await db.tags.find({});
            return tags;
        }
        catch(err) {
            console.log(err);
            return null;
        }
    }
}