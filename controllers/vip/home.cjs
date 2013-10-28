
var 
User = require('../../models/user'),
Util = require('../../services/util'),
fs=require('fs'),
settings = require('../../settings'),
Mg = require('../../services/gm'),
Obj  = require('../../services/obj'),
Filedb=require('../../services/filedb');


//用户登录
module.exports = function(app){
	this.route=[
		{ url:'/vip/home',
			auth:true,
			get:home
		},
		{
			url:'/vip/usericon',
			get:function(req,res,next){res.render('vip/usericon',{url:'/vip/home'});}
		},
    {
      url:'/vip/chagpass',
      auth:true, 
      get:function(req,res,next){res.render('vip/chagpass',{url:'/vip/home'});},
      post:changepass
    }
		
	];

	function home(req,res,next){
    res.locals.user.regdate2 = Util.format_date(new Date(res.locals.user.regdate),true);
    res.locals.user.lastlogin2 = Util.format_date(new Date(res.locals.user.lastlogin),true);
		res.render('vip/home', {url:'/vip/home'});
	}

  //修改密码：
  function changepass(req,res,next){
    var data = new Obj({
      oldpass:req.param('pass'),
      pass:req.param('pass1')
    });
    data.trim().xss();

    if (Util.md5(data.oldpass) != req.session.user.pass){
      res.send(Util.errBox('原密码不正确，请重新输入！','/vip/chagpass')); 
    };

    User.getUserById(req.session.user._id, function (err, user) {
      if (err) {
        return next(err);
      };
      user.pass=Util.md5(data.pass);
      user.save(function (err){
        if (err) {
          return next(err);
        };
        res.send(Util.msgBox('修改密码功能!','/vip/home'));
      });
    });
  };

}