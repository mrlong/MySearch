
var user = require('../models/user');

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
		res.json(200,{
				success:false,
				msg:"邮箱已注册过了，不能再注册。",
				mail:mail}
		);
	}
}



