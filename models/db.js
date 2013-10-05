
var settings=require('../settings');
var mongoose=require('mongoose');

module.exports=mongoose.createConnection(settings.mongodb.host,settings.mongodb.db);


