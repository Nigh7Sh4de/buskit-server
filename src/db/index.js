var mongoose = require('mongoose');
var Schema = mongoose.Scema;

var User = require('./users')

module.exports = class db {
  constructor() {
    this.users = User
  }

  connect(connection_string) {
    this.connection = mongoose.connect(connection_string)
  }
}