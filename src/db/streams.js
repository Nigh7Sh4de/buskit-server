const mongoose = require('mongoose')
const { Schema } = mongoose
const { ObjectId } = Schema.Types

const StreamSchema = new Schema({
  id: String,
  title: String,
  type: String,
  viewer_count: Number,
  thumbnail_url: String,
  description: String,
  started_at: Date,
  tags: [{
    type: ObjectId,
    ref: 'Tag',
  }],
}, {
  _id: false,
  timestamps: true,
})

module.exports = mongoose.model('Stream', StreamSchema)