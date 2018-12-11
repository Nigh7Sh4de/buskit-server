var mongoose = require('mongoose')
var Schema = mongoose.Schema

const Tag = new Schema({
    label: String,
}, {
  timestamps: true,
})

module.exports = mongoose.model('Tag', Tag)