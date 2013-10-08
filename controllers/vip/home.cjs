
var user = require('../../models/user');

//用户登录
module.exports = function(app){
	this.route=[
		{ url:'/vip/home',
			auth:true,
			get:home
		}
	];

	function home(req,res,next){
		res.render('vip/home', {url:'/vip/home'});
	}
}