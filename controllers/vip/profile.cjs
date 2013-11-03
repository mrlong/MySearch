// 修改个人资料
// 作者：龙仕云  2013－11－2

var 
User = require('../../models/user'),
Util = require('../../services/util'),
settings = require('../../settings'),
Obj  = require('../../services/obj');

//用户登录
module.exports = function(app){
  this.route=[
    {
      url:'/vip/profile',
      auth:true, 
      get:function(req,res,next){res.render('vip/profile',{url:'/vip/home'});},
      post:profile
    },
    
  ];

  function profile(req,res,next){
    var data = new Obj({
      sex:req.param('sex'),
      birthday:req.param('birthday'),
      province:req.param('province'),
      city:req.param('city'),
      signature:req.param('signature')
    });

    data.trim().xss();
    User.getUserById(req.session.user._id, function (err, user){
      if(!err && user){
        user.sex = data.sex;
        user.birthday = data.birthday;
        user.province = data.province;
        user.city = data.city;
        user.signature = data.signature;
        user.save(function(err){
          if(!err){
            req.session.user=user;
            res.json(200,{success:true,msg:'个人资料保存成功。'});
          }
          else{
            res.json(200,{success:false,msg:'用户信息保存出错。'});
          }
        });
      }
      else{
        res.json(200,{success:false,msg:'读取用户信息出错，无法保存。'});
      };
    });
  };

}