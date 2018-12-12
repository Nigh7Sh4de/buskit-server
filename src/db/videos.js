const mongoose = require('mongoose')
const { Schema } = mongoose
const { ObjectId } = Schema.Types

const VideoSchema = new Schema({
  id: String,
  title: String,
  type: String,
  viewer_count: Number,
  thumbnail_url: String,
  description: String,
  duration: Number,
  created_at: Date,
  view_count: Number,
  tags: [{
    type: ObjectId,
    ref: 'Tag',
  }],
}, {
  _id: false,
  timestamps: true,
})

module.exports = mongoose.model('Video', VideoSchema)