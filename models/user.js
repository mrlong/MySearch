// 
// 用户
// 
var db=require('./db');
var Schema=require('mongoose').Schema;
var userSchema=new Schema({
 	mail   : {type:String},   //邮箱
  name   : {type:String},   //用户名 
  pass   : {type:String},   //密码 md5.base64
  point  : {type:Number,default:0},   //积分
  regdate: {type:Date,default:Date.now()},    //注册日期
});
db.model('user',userSchema); //user 是 mongodb内的control名

var User=db.model('user');
exports.userSave=function(data,callback){
  var newUser=new User();
  newUser.mail = data.mail;
  newUser.name = data.name;
  newUser.pass = data.pass;

  //确定是否存在
  User.findOne({mail:data.mail},function(err,doc){
    if(!err && !doc){
      newUser.save(function(err){
        callback(err);
      });    
    }
    else{
      callback({suceess:false,msg:'邮箱已存在，不能创建。'});
    }
  });
};

exports.userFind=function(mail,callback){
  User.findOne({mail:mail},function (err, doc) {
    if(!err && doc){
      return callback(true,doc);
    }
    else{
      return callback(false,null);
    }
  });
};

exports.getUserByMail=function(mail,callback){
  User.findOne({mail: mail}, callback);
}

exports.getUserById=function(id,callback){
  User.findOne({_id: id}, callback);
}