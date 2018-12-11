var mongoose = require('mongoose')
var Schema = mongoose.Schema

const Stream = new Schema({
  profile: {
    display_name: String,
    description: String,
    profile_image_url: String,
  },
  authid: {
    twitch: String,
  },
  subscriptions: {
    
  },
}, {
  timestamps: true,
})

module.exports = mongoose.model('Stream', Stream)