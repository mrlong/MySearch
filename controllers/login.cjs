
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
			get:logout
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
			url:'/verifyvercode', //校验验证码是否有效。
			post:verifyvercode
		},
		{
			url:'/getvercode',   //获取验证码
			post:getvercode
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

  //创建用户并写入到库内
	function createuser(req,res,next){
		var data= new Obj({
			mail    : req.param('mail').toLowerCase(),
		 	name    : req.param('name'),
		 	pass    : req.param('pass'),
		 	vercode : req.param('vercode'),
		});
		data.trim().xss();
		data.pass = Util.md5(data.pass); //MD5写入库。
		if (!req.session.vercode || !req.session.vercode.mail ){
			res.send(Util.errBox('无效的验证码，注册失败！','/reguser'));
		}
		else{
			if (req.session.vercode.mail != data.mail || req.session.vercode.vercode != data.vercode){
				res.send(Util.errBox('无效的验证码，注册失败！','/reguser'));
			};
		};

		//写入库内
		User.userSave(data,function(err){
			if(!err){
				res.send(Util.msgBox('注册成功，请重新登录！','/login'));
				req.session.vercode={}; //清空原来的值
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

	
	//获取验证码
	function getvercode(req,res,next){
		var data= new Obj({
			mail:req.param('mail'),
			name:req.param('name'),
			style:req.param('style')
		});
		data.trim().xss();
		if (req.session.vercode && req.session.vercode.mail==data.mail){
			var myvercode = req.session.vercode.vercode; //采用原来的，因为用户如多次点了获取这样就同一个了。
		}	
		else{	
			var myvercode = Util.randomString();
			req.session.vercode = {mail:data.mail,
				vercode:myvercode,style:data.style};
		};
		service_mail.sendVerCodeMail(req,data.mail,data.name,myvercode,function(err){
			if (!err){
				res.json(200,{success:true,msg:'验证码已发送到你的邮箱内。'});		
			}
			else{
				res.json(200,{success:false,msg:'发送邮件异常出错，请联系客服。'});
			}
		})		
	};

	//校验验证码是否正确
	function verifyvercode(req,res,next){
		var data = new Obj({
			style : req.param('style'),
			mail : req.param('mail'),
			vercode : req.param('vercode')
		});
		data.trim().xss();
		if (req.session.vercode){
			if (req.session.vercode.mail==data.mail && req.session.vercode.style==data.style && 
				  req.session.vercode.vercode==data.vercode){
				res.send({success:true,msg:'验证码有效。'});
			}
		  else{
		  	res.send({success:false,msg:'验证码无效。'});
		  };
		}
		else{
			res.send({success:false,msg:'请先获取验证码。'});
		};
	};

}



