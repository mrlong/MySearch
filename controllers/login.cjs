
var 
User = require('../models/user'),
Util = require('../services/util'),
Obj  = require('../services/obj'),
service_mail = require('../services/mail'),
Settings=require('../settings');


module.exports = function(app){

	this.route=[
		{ 
			url:'/login',
			auth:false,    //需要登录才能进来,可以直接写对象
			get:function(req,res,next){res.render('login', {url:'/login'});},
			post:login
		},
		{
			url:'/logout',
			auth:true,
			get:logout
		},

	];


	//登录提交
	function login(req,res,next){
		var data= new Obj({
			mail:req.param('mail').toLowerCase(),
			pass:req.param('pass')
		});		
		data.trim().xss();
		data.pass = Util.md5(data.pass);
 		
 		User.getUserByMail(data.mail,function(err,user){
 			if(err){
 				return next(err);		
 			};
 			if (!user) {
      	return res.send(Util.errBox('这个用户不存在','/login'));
    	};
    	if (data.pass !== user.pass) {
      	return res.send(Util.errBox('密码错误','/login'));
    	}
    	user.logincount++;
    	user.lastlogin = Date.now();
    	user.save();
    	var auth_token = Util.encrypt(user.id + '\t' + 
    		user.name + '\t' + 
    		user.pass + '\t' + 
    		user.mail, Settings.sessionSecret);
    	console.log(auth_token);
  		res.cookie(Settings.cookieSecret,auth_token,{path:'/',maxAge: 1000 * 60 * 60 * 24 * 30});//30天
    	return res.send(Util.msgBox('登录成功。','/'));
 		});
	}

	//退出
	function logout(req,res,next){
		req.session.destroy();
  	res.clearCookie(Settings.cookieSecret, { path: '/' });
  	return res.send(Util.msgBox('您已安全退出。','/'));
	}


}



