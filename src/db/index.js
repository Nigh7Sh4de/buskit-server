const mongoose = require('mongoose');

const User = require('./users')
const Tag = require('./tags')
const Security = require('./security')

module.exports = class db {
  constructor() {
    this.users = User
    this.tags = Tag
    this.security = Security
  }

  connect(connection_string) {
    this.connection = mongoose.connect(connection_string)
  }
}