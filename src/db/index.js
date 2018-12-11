var mongoose = require('mongoose');

var User = require('./users')
var Tag = require('./tags')

module.exports = class db {
  constructor() {
    this.users = User
    this.tags = Tag
  }

  connect(connection_string) {
    this.connection = mongoose.connect(connection_string)
  }
}