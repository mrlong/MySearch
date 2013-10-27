
var 
user = require('../../models/user'),
Util = require('../../services/util'),
fs=require('fs'),
settings = require('../../settings'),
Mg = require('../../services/gm'),
Filedb=require('../../services/filedb');


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
			url:'/vip/upload_usericon',  //上传原始图片
			auth:true,
      post:uploadusericon
		},
    {
      url:'/vip/save_usericon',  //全图保存为头象
      auth:true,
      post:save_usericon
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
      var sz = req.files.codecsv.size;
      if (sz > 2*1024*1024) {
        fs.unlink(temp_path);
        res.send({success:false,msg:'上传文件超过指定大小'});
        return false;
      } 
      else if (req.files.codecsv.type.split('/')[0] != 'image') {
        fs.unlink(temp_path);
        res.send({success:false,msg:'上传文件不是图片文件'});
        return false;
      } 
    	var imgname=Util.randomString(10) + Util.getFileExt(req.files.codecsv.name);
    	var imgdir = settings.publicdir + '/img/user_icon';
    	if (!fs.existsSync(imgdir)) {
      	fs.mkdirSync(imgdir);
      };
    	var new_path = imgdir + '/' + imgname;
      if (temp_path) {
      	fs.rename(temp_path,new_path,function(err){  
            if(err){  
            	res.send({success:false,msg:'上传异常出错。'});  
            }
            else{
              // Mg.Crop(new_path,[0,0,100,100],settings.publicdir+'/'+imgname,function(err){
              //   if (err) return console.log('img error');
              // });
            	res.send({success:true,img:'/img/user_icon/'+imgname,imgpath:new_path});
            }
        });  
      }  
    }  
	}

	//全保存图片为头象
  function save_usericon(req,res,next){
    var data= new Obj({
      imgpath:req.param('imgpath')
    });   
    data.trim().xss();
    //当前用户
    User.getUserById(req.session.user._id, function (err, user) {
      if (err) {
        return next(err);
      };
      //文件保存到mongodb内
      Filedb.writefile(data.imgpath,function(err,data){
        if (err){
          res.send({success:false,msg:'图片保存到库内出错。'});
          return false;
        };
        user.icon = data._id;
        user.save(function (err){
          if (err) {
            return next(err);
          };
          res.send(Util.msgBox('修改密码功能!','/vip/home'));
        });  
      });
    });
  };

  //
}