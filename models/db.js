var settings=require('../settings');
var mongoose=require('mongoose');
module.exports=mongoose.createConnection(settings.host,settings.db);

