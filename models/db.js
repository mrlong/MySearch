//
//
//
//
//

var settings = require('../settings'),
var mongoose = require('mongoose');

var opts = { 
  server: { auto_reconnect: false }, 
  user: 'username', 
  pass: 'mypassword' 
}
db = mongoose.createConnection(settings.host, settings.db, settings.dbport,opts);

module.exports = db;

