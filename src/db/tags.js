var mongoose = require('mongoose')
var Schema = mongoose.Schema

const Tags = new Schema({
    label: String,
})

module.exports = mongoose.model('Tags', Tags)