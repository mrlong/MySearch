// 
// 用户
// 
var db=require('./db');
var Schema=require('mongoose').Schema;
var ObjectId = Schema.Types.ObjectId;

var userSchema=new Schema({
 	mail   : {type:String,trim: true},   //邮箱
  name   : {type:String,trim: true},   //用户名 
  pass   : {type:String,trim: true},   //密码 md5.base64
  point  : {type:Number,default:0},   //积分
  regdate: {type:Date,default:Date.now},    //注册日期
  logincount:{type:Number, default: 0},  //登录次数
  lastlogin: {type:Date,default:Date.now}, //最后登录的时间
  icon :{type:ObjectId}
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