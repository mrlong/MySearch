
var user = require('../models/user');
var util = require('../models/util');

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
			url:'/verifymail',   //校验邮箱
			method:'post',       
			func:verifymail
		},
		{
			url:'/createuser',
			method:'post',
			func:createuser
		},
		{
			url:'/getvercode',   //获取验证码
			//method:'post',
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
		res.render('reguser',{url:'/login',title:app.get('title')});
	}

	function createuser(req,res){

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
		var options ={
			  to: 'mrlong@qzhsoft.com',
	  		subject: app.get('title')+'注册验证码',
				content: '注册验证码:' + myvercode + '\n\n\n' + '邮件是系统自动发出请不要回邮件。',
				ishtml : false
		};
		util.sendmail(options,function(err){
			if (!err){
				res.json(200,{success:true,msg:'',vercode:myvercode});		
			}
			else{
				res.json(200,{success:false,msg:'发送邮件异常出错，请联系客服。'});
			}
		})		
	}
}



