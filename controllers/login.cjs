
var user = require('../models/user');
var util = require('../services/util');
var obj  = require('../services/obj');
var service_mail = require('../services/mail');

module.exports = function(app){

	this.route=[
		{ 
			url:'/login',
			auth:false,    //需要登录才能进来,可以直接写对象
	  	func:login
		},
		{
			url:'/logout',
			func:logout
		},
		{
			url:'/fgtpwd',
			func:fgtpwd
		},
		{
			url:'/reguser',
			func:reguser
		},
		{
			url:'/reguser/:mail/:name/:vercode',
			method:'get',
			func:reguser
		},
		{
			url:'/reguser',
			method:'post',
			func:createuser
		},
		{
			url:'/verifymail',   //校验邮箱
			method:'post',       
			func:verifymail
		},
		{
			url:'/getvercode',   //获取验证码
			method:'post',
			func:getvercode
		}

	];

	//登录
	function login(req,res){
		res.render('login', {url:'/login'});
	}

	//退出
	function logout(req,res){
		//
	}

	//忘记密码
	function fgtpwd(req,res){
		//
	}

	//注册用户
	function reguser(req,res){
		var data={
			mail:req.param('mail')||'',
			name:req.param('name')||'',
			vercode:req.param('vercode')||''
		};
		res.render('reguser',{
				url:'/login',
				title:app.get('title'),
				data:data
		});
	}

	function createuser(req,res){
		var data= new obj({
			mail    : req.param('mail').toLowerCase(),
		 	name    : req.param('name'),
		 	pass    : req.param('pass'),
		 	vercode : req.param('vercode'),
		});
		data.trim().xss();
		//写入库内
		res.send(util.msgBox('注册成功，请重新登录！','/login'));		
	}

	//检验邮箱
	function verifymail(req,res){  
		var mail = req.body.mail;
		user.userFind(mail,function(err,doc){
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

	function getvercode(req,res){
		var myvercode = util.randomString();
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
	}
}



