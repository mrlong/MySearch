
// 产品模块

var
Product = require('../../../models/product'),
Obj  = require('../../../services/obj'),
Util = require('../../../services/util')
;

module.exports = function(app){
  this.route=[
    { 
      name:'财务－产品列表',
      url:'/admin/fina/product',
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
      name:'财务-取出产品的模块',
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
    //修改
    {
      name:'财务-修改产品模块',
      url:'/admin/fina/product/edit',
      auth:true,
      post:function(req,res,next){
        var data = new Obj({
          code : req.param('code')||'',
          name : req.param('name')||'',
          sort : parseInt(req.param('sort')||'0'),
          stop : req.param('stop')||'false'
        }).trim().xss();
      
        Product.getProductByCode(data.code,function(err,doc){
          if(!err && doc){
            doc.name = data.name;
            doc.sort = data.sort;
            doc.stop = data.stop.toLowerCase()=='true';
            doc.save(function(err){
              if(!err){
                res.json(200,{success:true,msg:'产品修改成功。'});
              }
              else{
                res.json(200,{success:false,msg:'产品修改保存到库出现异常。'});
              }
            });    
          }
          else{
            res.json(200,{success:false,msg:'产品编号不能，不能修改。'});
          };
        });
      }
    },
    //增加产品
    {
      name:'财务-增加产品',
      url:'/admin/fina/product/add',
      auth:true,
      post:function(req,res,next){
        var data = new Obj({
          code : req.param('code')||'',
          name : req.param('name')||'',
          sort : parseInt(req.param('sort')||'0'),
          stop : req.param('stop')||'false'
        }).trim().xss();

        Product.getProductByCode(data.code,function(err,doc){
          if(!err && doc){
            res.json(200,{success:false,msg:'产品编号已存。'});
          };
        });

        Product.addProduct(data.code,data.name,data.sort,function(err){
          if(!err){
            res.json(200,{success:true,msg:'增加产品成功。'});
          }
          else{
            res.json(200,{success:false,msg:'保存出现异常出错。'});
          };
        });
      },

    },

    //增加产品的模块
    {
      name:'财务－增加产品的模块',
      url:'/admin/fina/product/module/add',
      auth:true,
      post:function(req,res,next){
        var data = new Obj({
          pcode:req.param('pcode')||'',
          code :req.param('code')||'',
          name :req.param('name')||'',
          sort :parseInt(req.param('sort')||'0')
        }).trim().xss();

        Product.getProductByCode(data.pcode,function(err,doc){
          if(!err && doc){
            for(var i=0;i<doc.modules.length;i++){
              if(doc.modules[i].code==data.code){
                res.json(200,{success:false,msg:'你增加的模块编号已存在。'});
                return false;
              };
            };
            //doc.modules.push({code:data.code,name:data.name,sort:data.sort,stop:false});
            doc.modules.push(data);
            doc.save(function(err){
              res.json(200,{success:!err,msg:err?'保存到库内出错':'增加模块保成功能。'});
            });
          }
          else{
            res.json(200,{success:false,msg:'没有找到产品不能增加模块。'});  
          }
        });
      },
    },
    //修改产品的模块
    {
      name:'财务－修改产品的模块',
      url:'/admin/fina/product/module/edit',
      auth:true,
      post:function(req,res,next){
        var data = new Obj({
          pcode: req.param('pcode')||'',
          code : req.param('code')||'',
          name : req.param('name')||'',
          sort : parseInt(req.param('sort')||'0'),
          stop : req.param('stop')||'false'
        }).trim().xss();
        
        Product.getProductModuleByCode(data.pcode,data.code,function(err,doc,pro){
          if(!err && doc){
            doc.name = data.name;
            doc.sort = data.sort;
            doc.stop = data.stop;
            pro.save(function(err){
              if(!err){
                res.json(200,{success:true,msg:'保存成功。'});
              }
              else{
                res.json(200,{success:false,msg:'保存失败，无法获取原因。'});
              }
            });
          }
          else{
            res.json(200,{success:false,msg:err.message});
          }
        });
      },
    },   
    ////////
  ]
};