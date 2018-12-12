const mongoose = require('mongoose')
const { Schema } = mongoose

const Tag = new Schema({
  label: String,
}, {
  timestamps: true,
})

Tag.statics.findOrCreate = async function(tags) {
  if (!(tags instanceof Array)) tags = [tags]

  let query = tags.map(async label => {
    let tag = await this
      .findOne({ label })
      .exec()
    return tag || await new this({ label }).save()
  })
  return await Promise.all(query)
}

module.exports = mongoose.model('Tag', Tag)