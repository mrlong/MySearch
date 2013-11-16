// 
// 用户
// 
var db=require('./db');
var Schema=require('mongoose').Schema;
var ObjectId = Schema.Types.ObjectId;

var userSchema=new Schema({
 	qq   : {type:String,trim: true},          //邮箱
  name   : {type:String,trim: true},        //用户名 
  pass   : {type:String,trim: true},        //密码 md5.base64
  point  : {type:Number,default:0},         //积分
  regdate: {type:Date,default:Date.now},    //注册日期
  logincount:{type:Number, default: 0},     //登录次数
  lastlogin: {type:Date,default:Date.now},  //最后登录的时间
  icon :{type:ObjectId},
  sex:{type:String,trim:true},              //=nam(男) =wonam(女)
  province:{type:String,trim:true},         //省 
  city:{type:String,trim:true},             //市
  signature:{type:String,trim:true},        //个性签名
  birthday:{type:String,trim:true},         //生日，格式 2012－01－02
  //联系信息
  contact:{
    phone: {type:Number},                   //手机
    tel:{type:String},                      //座机
    openphone:{type:Boolean,default:false}  //是否公开
  },
  //专业信息
  skill:{
    job:{type:Number,default:0},            //什么工作
    work_years:{type:Number},               //工作年限 -1=在读 ＝0应届 ＝ 1 
    job_status:{type:Number},               //=0 在职，1＝学生，2＝找工作中...
    major:[String],                         //所学的专业
    majorother:{type:String},               //如选择了其他，则显示录入信息。
    company:{type:String}                   //工作单位
  }


});

db.model('user',userSchema); //user 是 mongodb内的control名

var User=db.model('user');
exports.userSave=function(data,callback){
  var newUser=new User();
  newUser.qq = data.qq;
  newUser.name = data.name;
  newUser.pass = data.pass;

  //确定是否存在
  User.findOne({qq:data.qq},function(err,doc){
    if(!err && !doc){
      newUser.save(function(err){
        callback(err);
      });    
    }
    else{
      callback({suceess:false,msg:'QQ已存在，不能创建。'});
    }
  });
};

exports.userFind=function(qq,callback){
  User.findOne({qq:qq},function (err, doc) {
    if(!err && doc){
      return callback(true,doc);
    }
    else{
      return callback(false,null);
    }
  });
};

exports.getUserByQQ=function(qq,callback){
  User.findOne({qq: qq}, callback);
}

exports.getUserById=function(id,callback){
  User.findOne({_id: id}, callback);
}

exports.getUserByName=function(name,callback){
  User.findOne({name: name}, callback);
}