
var user = require('../../models/user');

//用户登录
module.exports = function(app){
	this.route=[
		{ url:'/vip/home',
			auth:true,
			func:home
		}
	];

	function home(req,res){
		res.render('vip/home.ejs', {url:'/vip',mrlong:'33333377766',user:null });
	}
}