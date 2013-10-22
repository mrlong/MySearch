
var user = require('../../models/user');
var Util = require('../../services/util');

//用户登录
module.exports = function(app){
	this.route=[
		{ url:'/vip/home',
			auth:true,
			get:home
		},
		{
			url:'/vip/chagusericon',
			get:function(req,res,next){res.render('vip/user_icon',{url:'/vip/home'});}
		}
	];

	function home(req,res,next){
    res.locals.user.regdate2 = Util.format_date(new Date(res.locals.user.regdate),true);
    res.locals.user.lastlogin2 = Util.format_date(new Date(res.locals.user.lastlogin),true);
		res.render('vip/home', {url:'/vip/home'});
	}
}