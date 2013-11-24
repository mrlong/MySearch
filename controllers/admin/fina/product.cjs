
// 产品模块

var
Product = require('../../../models/product'),
Util = require('../../../services/util')
;

module.exports = function(app){
  this.route=[
    { url:'/admin/fina/product',
      auth:true,
      get:function(req,res,next){
        Product.getProductList(function(err,docs){
          if(!err && docs){
            res.render('admin/fina/product/product_list',{url:'/admin/fina',products:docs});    
          }
          else{
            Util.errBox('读取产口出错，不能维护','/admin/fina');
          }
        });
      }
    },
    //取出产品的模块
    {
      url:'/admin/fina/product/:code',
      auth:true,
      get:function(req,res,next){
        var code = req.param('code')||'';
        Product.getProductByCode(code,function(err,doc){
          if(!err && doc){
            res.render('admin/fina/product/product_module',{url:'/admin/fina',product:doc});    
          }
          else{
            Util.errBox('读取产口出错，不能维护','/admin/fina');
          };
        });
      }
    },
    //
  ]
};