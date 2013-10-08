
var User = require('../models/user');
var Util = require('../services/util');
var Obj  = require('../services/obj');
var service_mail = require('../services/mail');
var Settings=require('../settings');

//var Settings=require('../Settings');

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
			get:logout
		},
		{
			url:'/fgtpwd',   //忘记密码
			get:fgtpwd
		},
		{
			url:'/reguser',
			get:reguser,
			post:createuser
		},
		{
			url:'/reguser/:mail/:name/:vercode',
			get:reguser
		},
		{
			url:'/verifymail',   //校验邮箱
			post:verifymail
		},
		{
			url:'/getvercode',   //获取验证码
			post:getvercode
		},
		{
			url:'/chagpass',
			auth:true, 
			get:function(req,res,next){res.render('chagpass',{url:'/vip/home'});},
			post:changepass
		}

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

	//忘记密码
	function fgtpwd(req,res,next){
		//
	}

	//注册用户
	function reguser(req,res,next){
		var data= new Obj({
			mail:req.param('mail')||'',
			name:req.param('name')||'',
			vercode:req.param('vercode')||''
		});
		data.trim().xss();
		res.render('reguser',{
				url:'/login',
				title:app.get('title'),
				data:data
		});
	}

	function createuser(req,res,next){
		var data= new Obj({
			mail    : req.param('mail').toLowerCase(),
		 	name    : req.param('name'),
		 	pass    : req.param('pass'),
		 	vercode : req.param('vercode'),
		});
		data.trim().xss();
		data.pass = Util.md5(data.pass); //MD5写入库。
		//写入库内
		User.userSave(data,function(err){
			if(!err){
				res.send(Util.msgBox('注册成功，请重新登录！','/login'));
			}
			else{
				res.send(Util.errBox('注册失败！','/reguser'));
			}
		})
				
	}

	//检验邮箱
	function verifymail(req,res,next){  
		var mail = req.body.mail;
		User.userFind(mail,function(err,doc){
			var data={};
			console.log(err);
			if(err==false){
				console.log('y');
				data.success = true;
				data.msg = "邮箱有效。";
			}
			else{
				console.log('x');
				data.success = false;
				data.msg = "邮箱已注册过了，不能再注册。";
			};
			
			res.json(200,data);
		});
		
	}

	function getvercode(req,res,next){
		var myvercode = Util.randomString();
		var mail = req.param('mail');
		var name = req.param('name');
		service_mail.sendVerCodeMail(req, mail,name,myvercode,function(err){
			if (!err){
				res.json(200,{success:true,msg:'验证码已发送到你的邮箱内。'});		
			}
			else{
				res.json(200,{success:false,msg:'发送邮件异常出错，请联系客服。'});
			}
		})		
	};

	//修改密码：
	function changepass(req,res,next){
		var data=new Obj({
			oldpass:req.param('pass'),
			pass:req.param('pass1')
		});
		data.trim().xss();

		if (Util.md5(data.oldpass) != req.session.user.pass){
			res.send(Util.errBox('原密码不正确，请重新输入！','/chagpass'));	
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

	//

}



