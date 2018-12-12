const mongoose = require('mongoose')
const { Schema } = mongoose
const { ObjectId } = Schema.Types

const Stream = require('./streams').schema
const Video = require('./videos').schema

const User = new Schema({
  profile: {
    display_name: String,
    description: String,
    profile_image_url: String,
  },
  authid: {
    twitch: String,
  },
  stream: Stream,
  videos: [Video],
  tags: [{
    type: ObjectId,
    ref: 'Tag',
  }],
}, {
  timestamps: true,
})

module.exports = mongoose.model('User', User)