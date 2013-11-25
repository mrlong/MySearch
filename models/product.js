// 
// 产品模块 作者：龙仕云  2013－11－24
// 
// 产品编号共两位 01
// 模块编号共两位 0101 0102 0103
// 

var 
db=require('./db'),
Schema=require('mongoose').Schema,
ObjectId = Schema.Types.ObjectId;


var productSchema=new Schema({
  code :{type:String,index: true},           //编号
  name :{type:String},           //名称
  sort :{type:Number,default:0}, //排序号
  stop :{type:Boolean,default:false}, //是否禁用
  modules:{ type: Array }        //模块数组，格式： code : String , name : String,stop:Boolean
});


db.model('product',productSchema); 
var Product=db.model('product');

/**
 * 取出所有的产品列表
 * Callback:
 * 回调函数参数列表：
 * - err, 数据库错误
 * - docs, 产品列表
 * @param {Function} callback 
 */
exports.getProductList = function(callback){
  Product.find({},null,{ sort: {sort: 1 }},callback);
};

/**
 * 取出所有的产品列表
 * Callback:
 * 回调函数参数列表：
 * - err, 数据库错误
 * - doc, 产品
 * @param {String} code 产品的编号
 * @param {Function} callback 
 */

exports.getProductByCode = function(code,callback){
  Product.findOne({code:code},callback);
};

/**
 * 增加产品
 * Callback:
 * 回调函数参数列表：
 * - err, 数据库错误
 * @param {String} code 产品编号
 * @param {String} name 产品名称
 * @param {Function} callback 获取消息数量
 */
exports.addProduct = function(code,name,callback){
  var newProduct = new Product();
  newProduct.code = code;
  newProduct.name = name;
  
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

/**
 * 增加产品的模块
 * Callback:
 * 回调函数参数列表：
 * - err, 数据库错误
 * @param {ObjectID} Pid 产品_Id
 * @param {String} code 产品模块的编号
 * @param {String} name 产品模块的名称
 * @param {Function} callback 
 */
exports.addProductModule = function(Pid,code,name,callback){
  Product.findById(Pid,function(err,doc){
    if(!err && doc){
      for(var i=0;i<doc.modules.length;i++){
        if (doc.modules[i].code == code){
          callback({success:false,msg:'模块号已不存，不能增加'})
          return false;
        }
      };
      doc.modules[doc.modules.length]={code:code,name:name,stop:false};
      doc.save(function(err){
        callback(err);
      });
    }
    else{
      callback({success:false,msg:'没有找到产品，不能增加模块'});
    }
  });
};

/**
 * 增加产品的模块
 * Callback:
 * 回调函数参数列表：
 * - err, 数据库错误
 * @param {ObjectID} Pcode 产品编号
 * @param {String} code 产品模块的编号
 * @param {String} name 产品模块的名称
 * @param {Function} callback 
 */
exports.addProductModule2 = function(Pcode,code,name,callback){
  Product.findOne({code:Pcode},function(err,doc){
    if(!err && doc){
      addProductModule(doc._id,code,name,callback);
    }
    else{
      callback({success:false,msg:'没有找到产品，不能增加模块'})
    }
  });
};



