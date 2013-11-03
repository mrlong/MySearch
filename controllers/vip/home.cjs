
var 
User = require('../../models/user'),
Util = require('../../services/util'),
fs=require('fs'),
settings = require('../../settings'),
Mg = require('../../services/gm'),
Obj  = require('../../services/obj'),
Filedb=require('../../services/filedb');


//用户登录
module.exports = function(app){
	this.route=[
		{ url:'/vip/home',
			auth:true,
			get:home
		},
		{ url:'/vip',
			auth:true,
			get:home
		},
		{
			url:'/vip/usericon',
			get:function(req,res,next){res.render('vip/usericon',{url:'/vip/home'});}
		},
		
	];

	function home(req,res,next){
    res.locals.user.regdate2 = Util.format_date(new Date(res.locals.user.regdate),true);
    res.locals.user.lastlogin2 = Util.format_date(new Date(res.locals.user.lastlogin),true);
		res.render('vip/home', {url:'/vip/home'});
	}
}