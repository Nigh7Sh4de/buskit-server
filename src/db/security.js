var mongoose = require('mongoose')
var Schema = mongoose.Schema

const levels = {
    admin: 'admin',
}

const SecuritySchema = new Schema({
    level: {
        type: String,
        enum: Object.values(levels),
    },
}, {
  _id: false,
  timestamps: true,
})

SecuritySchema.statics.levels = levels

module.exports = mongoose.model('Security', SecuritySchema)