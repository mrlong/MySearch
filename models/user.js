// 
// 用户
// 
var mongoose=require('mongoose');
var db=require('./db');
var Schema=mongoose.Schema;
var userSchema=new Schema({
 	mail   : {type:String},   //邮箱
  name   : {type:String},   //用户名 
  pw     : {type:String},   //密码 md5.base64
  point  : {type:Number},   //积分
  regdate: {type:date,default:Date.now()},    //注册日期
});
db.model('user',userSchema);


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
	User.findOne({mail:mail},function(err,doc){
  	if(err){
    	return callback(err,null);
     }
    callback(null,doc); // 用户名如果已经存在，将在调用函数内赋值err
  })
};