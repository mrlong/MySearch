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

var productmoduleSchema = new Schema({
  code : {type:String,index:true,required:true},  //编号
  name : {type:String},                           //名称
  sort : {type:Number,default:0},                 //排号
  stop : {type:Boolean,default:false}             //是否禁用
});

var productSchema = new Schema({
  code :{type:String,index: true,required:true},  //编号
  name :{type:String},                            //名称
  sort :{type:Number,default:0},                  //排序号
  stop :{type:Boolean,default:false},             //是否禁用
  modules:[productmoduleSchema]                   //模块数组，格式： code : String , name : String,stop:Boolean
});


var Product = db.model('product',productSchema); 

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
 * @param {Number} name 产品名称
 * @param {Function} callback 获取消息数量
 */
exports.addProduct = function(code,name,sort,callback){
  var newProduct = new Product();
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

/**
 * 增加产品的模块
 * Callback:
 * 回调函数参数列表：
 * - err, 数据库错误
 * @param {ObjectID} Pid 产品_Id
 * @param {String} code 产品模块的编号
 * @param {String} name 产品模块的名称
 * @param {Number} sort 产品模块的排号
 * @param {Function} callback 
 */
exports.addProductModule = function(Pid,code,name,sort,callback){
  Product.findById(Pid,function(err,doc){
    if(!err && doc){
      for(var i=0;i<doc.modules.length;i++){
        if (doc.modules[i].code == code){
          callback({success:false,msg:'模块号已不存，不能增加'})
          return false;
        }
      };
      doc.modules[doc.modules.length]={code:code,name:name,sort:sort,stop:false};
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
 * @param {Number} sort 产品模块的排号
 * @param {Function} callback 
 */
exports.addProductModule2 = function(Pcode,code,name,sort,callback){
  Product.findOne({code:Pcode},function(err,doc){
    if(!err && doc){
      addProductModule(doc._id,code,name,sort,callback);
    }
    else{
      callback({success:false,msg:'没有找到产品，不能增加模块'})
    }
  });
};

/**
 * 取出产品的模块
 * Callback:
 * 回调函数参数列表：
 * - err, 数据库错误
 * - doc, 表示取出的模块
 * - product, 表示取出的产品 
 * @param {ObjectID} Pcode 产品编号
 * @param {String} code 产品模块的编号
 * @param {Function} callback 
 */
exports.getProductModuleByCode = function(pcode,code,callback){
  Product.findOne({code:pcode},function(err,doc){
    if(!err && doc){
      var hasfind = false;
      for (var i=0;i<doc.modules.length;i++){
        if(doc.modules[i].code==code){
          callback(null,doc.modules[i],doc);
          hasfind = true;
          return true;
        };
      };
      if(hasfind==false){
        callback(new Error('没有找到模块号，不能修改。'));
      };
    }
    else{
      callback(err?err:new Error('没有找到产品无法修改产品的模块。'));
    }
  });
};


