
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
		}
	];

	//登录
	function login(req,res){
		res.render('login', {title:app.get('title'),url:'/login',mrlong:'ssss' });
	}

	//退出
	function logout(req,res){
		//
	}


}



