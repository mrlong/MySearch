// 
// 个人资料的联系方式 
// 
// 

var 
User = require('../../models/user'),
Msg  = require('../../models/msg'),
Util = require('../../services/util'),
settings = require('../../settings'),
Obj  = require('../../services/obj');

//用户登录
module.exports = function(app){
  this.route=[
    {
      url:'/vip/contact',
      auth:true, 
      get:function(req,res,next){
        var msgcount = 0;
        Msg.msgCountByUserId(res.locals.user._id,function(err,count){
          if(!err){
            msgcount = count; 
          }     
        });
        res.render('vip/contact',{url:'/vip/home',msgcount:msgcount});
      },
      post:contact
    }
    
  ];

  //保存
  function contact(req,res,next){
    var data = new Obj({
      phone:req.param('phone')||'',
      tel:req.param('tel')||'',
      openphone:req.param('openphone')||'false'
    });
    data.trim().xss();

    User.getUserById(req.session.user._id, function (err, user){
      if(!err && user){
        user.contact.phone = parseInt(data.phone);
        user.contact.tel = data.tel;
        user.contact.openphone = data.openphone.toLowerCase()=='true';
        user.save(function(err){
          if(!err){
            req.session.user=user;
            res.json(200,{success:true,msg:'联系信息保存成功。'});
          }
          else{
            res.json(200,{success:false,msg:'联系信息保存出错。'});
          }
        });
      }
      else{
        res.json(200,{success:false,msg:'读取用户信息出错，无法保存。'});
      };
    });

  };

};