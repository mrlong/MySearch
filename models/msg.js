//信息模型
//从哪发了来的信息，有系统，有小组，有个人向你发的。
//发信息的时间。
//信息发给谁，有没有读到了。
//发信息的内容。
//谁发出的。

var 
db=require('./db'),
Schema=require('mongoose').Schema,
ObjectId = Schema.Types.ObjectId;

var msgSchema=new Schema({
  senduser_id : {type:ObjectId,index: true},      //谁发的信息
  touser_id   : {type:ObjectId},                  //发给谁的
  isreaded    : {type:Boolean,default:false}, //=true 表示已读了。
  content     : {type:String},                //发送的内容
  source      : {type:Number,default:0},      //=0系统信息，1＝小组信息，2＝个人信息
  senddate    : {type:Date,default:Date.now}  //发送的时间
});

db.model('msg',msgSchema); //msg 是 mongodb内的control名

var Msg=db.model('msg');

/**
 * 根据用户ID，获取未读消息的数量
 * Callback:
 * 回调函数参数列表：
 * - err, 数据库错误
 * - count, 未读消息数量
 * @param {String} id 用户ID
 * @param {Function} callback 获取消息数量
 */
exports.msgCountByUserId=function(Id,callback){
  Msg.count({touser_id:Id,isreaded:false},callback);
};


/**
 * 根据用户ID，获取消息列表
 * Callback:
 * - err, 数据库异常
 * - messages, 消息列表
 * @param {String} userId 用户ID
 * @param {Function} callback 回调函数
 */
exports.getMessagesByUserId = function (Id, callback) {
  //Msg.find({touser_id: Id},[],{sort: [['senddate', 'desc']], limit: 20},callback);
  Msg.find({touser_id: Id},null,{skip:0,sort:[['senddate','desc']],limit: 20},callback);
};

