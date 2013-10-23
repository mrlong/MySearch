
var user = require('../../models/user');
var Util = require('../../services/util');
var fs=require('fs');
var settings = require('../../settings');

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
		},
		{
			url:'/vip/upload_usericon',
			post:uploadusericon
		}
	];

	function home(req,res,next){
    res.locals.user.regdate2 = Util.format_date(new Date(res.locals.user.regdate),true);
    res.locals.user.lastlogin2 = Util.format_date(new Date(res.locals.user.lastlogin),true);
		res.render('vip/home', {url:'/vip/home'});
	}

	//上传用户的头像
	function uploadusericon(req,res,next){
		if (req.files && req.files.codecsv != 'undifined') {  
    	var temp_path = req.files.codecsv.path;
    	var imgname=Util.randomString(10) + Util.getFileExt(req.files.codecsv.name);
    	var imgdir = settings.publicdir + '/img/user_icon';
    	if (!fs.existsSync(imgdir)) {
      	fs.mkdirSync(imgdir);
      };
    	var new_path = imgdir + '/' + imgname;
      if (temp_path) {
      	fs.rename(temp_path,new_path,function(err){  
            if(err){  
            	throw err;  
            }
            else{
            	res.send({img:'/img/user_icon/'+imgname,imgpath:new_path});
            }
        });  
      }  
    }  
	}

	//
}