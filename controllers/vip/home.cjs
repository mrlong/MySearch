// 
// 用户中心的主页
// 
// 

var 
User = require('../../models/user'),
Util = require('../../services/util'),
Msg  = require('../../models/msg'),
settings = require('../../settings'),
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
		}		
		
	];

	function home(req,res,next){
    res.locals.user.regdate2 = Util.format_date(new Date(res.locals.user.regdate),true);
    res.locals.user.lastlogin2 = Util.format_date(new Date(res.locals.user.lastlogin),true);
 		var msgcount = 0;
 		Msg.msgCountByUserId(res.locals.user._id,function(err,count){
 			if(!err){
 				msgcount = count; 
 			}			
 		});  	 
    res.render('vip/home', {url:'/vip/home',msgcount:msgcount});
	}
}