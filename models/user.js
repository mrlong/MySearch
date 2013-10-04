// 
// 用户
// 
var db=require('./db');
var Schema=require('mongoose').Schema;
var userSchema=new Schema({
 	mail   : {type:String},   //邮箱
  name   : {type:String},   //用户名 
  pw     : {type:String},   //密码 md5.base64
  point  : {type:Number},   //积分
  regdate: {type:Date,default:Date.now()},    //注册日期
});
db.model('user',userSchema); //user 是 mongodb内的control名


var User=db.model('user');
exports.userSave=function(user,callback){
    var newUser=new User();
    newUser.mail=user.mail;
    newUser.name=user.name;
    newUser.pw = user.pw;
    newUser.point = user.point;
    newUser.regdate = user.regdate;

    newUser.save(function(err){
        if(err){
         return callback(err);
        }
        callback(null);
    })

};

exports.userFind=function(mail,callback){
  debugger;
  User.findOne({mail:mail}, null, null/*sort*/,function (err, doc) {
    debugger;
    console.log(err);
    console.log(doc);
    if(!err && doc){
      console.log('a');
      return callback(true,doc);
    }
    else{
      console.log('b');
      return callback(false,null);
    }
  });
};