var 
User = require('../../models/user'),
Util = require('../../services/util'),
settings = require('../../settings'),
Obj  = require('../../services/obj');

//用户登录
module.exports = function(app){
  this.route=[
    {
      url:'/vip/skill',
      auth:true, 
      get:function(req,res,next){res.render('vip/skill',{url:'/vip/home'});},
      post:skill
    }
    
  ];


  function skill(req,res,next){

  };

};