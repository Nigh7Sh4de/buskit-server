var mongoose = require('mongoose')
var Schema = mongoose.Schema

const User = new Schema({
  profile: {
    display_name: String,
    description: String,
    profile_image_url: String,
  },
  authid: {
    twitch: String,
  }
}, {
  timestamps: true,
})

module.exports = mongoose.model('User', User)