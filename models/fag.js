// 
// 技术支持 Fag
// 
// 问题编号： 编号规则 13 11 02 0001   年+月+日+流水号0001
// 问题标题
// 问题类型：
// 产品类型： 这个要从后台读取出来。是财务的模板内容
// 
// 

var db=require('./db');
var Schema=require('mongoose').Schema;
var ObjectId = Schema.Types.ObjectId;

var fagitemSchame = new Schema({
	text : {type:String},                 //问题内容
	date : {type:Date,default:Date.now},  //问题时间            
	file1 : {type:ObjectId},              //附件1
	file2 : {type:ObjectId},              //附件2
	file3 : {type:ObjectId}               //附件3 
});

var  fagSchema = new Schema({
  code  : {type:String,index:true,required:true},  //编号,这个流水号是自动生成的 年+月+日+流水号0001
  title : {type:String},                           //标题
  date  : {type:Date,default:Date.now},            //创建时间
  user_qq : {type:ObjectId},                       //谁创建的
  status :  {type:Number,default:0},               //状态 ＝0 创建，＝1 指派中  ＝2 在正处理中 ＝9 完成  
  product : {type:String},                         //产品编号
  producemodule : {type:String},                   //产品模块
  assign_qq : {type:String},                       //指派给
  solve_qq  : {type:String},                       //解决人  
  solve_date :{type:Date},                         //解决时间
  solve_score :{type:Number},                      //打分
  content : [fagitemSchame]                        //问题内容
});


var Fag = db.model('fag',fagSchema); 

//生成问题的编号
buildFagcode = function(){
  var date = Date.now();
  var year   = date.getFullYear();
  var month  = date.getMonth() + 1;
  var day    = date.getDate();
  var hour   = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();


}


/**
 * 取出所有的产品列表
 * Callback:
 * 回调函数参数列表：
 * - err, 数据库错误
 * - docs, 产品列表
 * @param {Function} callback 
 */
exports.getFagList = function(callback){
	Fag.find({},null,{ sort: {date: 1 }},callback);
};

/**
 *  取出我的个人的没有处理完的问题列表。
 *  Callback:
 * 回调函数参数列表：
 * - err, 数据库错误
 * - docs, 产品列表
 *  qq 为我的QQ号
 *
 *
 *
 */
exports.getFagByQQ = function(qq,callback){
	Fag.find({},null,callback);
};

/**
 * 增加问题
 * Callback:
 * 回调函数参数列表：
 * - err, 数据库错误
 * @param {String} code 产品编号
 * @param {String} name 产品名称
 * @param {Number} name 产品名称
 * @param {Function} callback 获取消息数量
 */
exports.addFag = function(code,name,sort,callback){
  var newFag = new Fag();
  newProduct.code = code;
  newProduct.name = name;
  newProduct.sort = sort;
  
  //确定是否存在
  Product.findOne({code:code},function(err,doc){
    if(!err && !doc){
      newProduct.save(function(err){
        callback(err);
      });    
    }
    else{
      callback({suceess:false,msg:'产品已存在，不能创建。'});
    }
  });
};
