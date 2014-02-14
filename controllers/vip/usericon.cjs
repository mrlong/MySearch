
var 
User = require('../../models/user'),
Msg  = require('../../models/msg'),
Util = require('../../services/util'),
fs=require('fs'),
settings = require('../../settings'),
Mg = require('../../services/gm'),
Obj  = require('../../services/obj'),
Filedb=require('../../services/filedb');


//用户登录
module.exports = function(app){
  this.route=[
    {
      url:'/vip/usericon',
      get:function(req,res,next){
        var msgcount = 0;
        Msg.msgCountByUserId(res.locals.user._id,function(err,count){
          if(!err){
            msgcount = count; 
          }     
        });
        res.render('vip/usericon',{url:'/vip/home',msgcount:msgcount});
      }
    },

    {
      url:'/vip/upload_usericon',  //上传原始图片
      auth:true,
      post:uploadusericon
    },
    {
      name:'用户中心－保存头像',
      url:'/vip/save_usericon',    //全图保存为头象
      auth:true,
      post:save_usericon
    },
    {
      url:'/vip/getusericon',   //获取用户的头像
      auth:true,
      get:getusericon
    },
    {
      name:'用户中心－保存头像',
      url:'/vip/save_usericonregion', //保存选择的区域
      auth:true,
      post:save_usericonregion
    }

  ];


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
              Mg.Info(new_path,function(err,Info){
                if(err){
                  res.send({success:false,msg:'获取图片信息异常出错。'}); 
                }
                else{
                  var w = Info.width  > 640?640:Info.width;
                  var h = Info.height > 480?480:Info.height;
                  res.send({success:true,img:'/img/user_icon/'+imgname,imgpath:new_path,
                    width:w,height:h});
                };

              });
              
            }
        });  
      }//temp_path  
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
      if (err || !user) {
        return next(err);
      };
      //文件保存到mongodb内
      var img=data.imgpath;
      Filedb.removefile(user.icon);//删除原来的。
      Filedb.writefile(img,function(err,data){
        fs.unlink(img);
        if (err){
          res.send({success:false,msg:'图片保存到库内出错。'});
          return false;
        };
        user.icon = data._id;
        user.save(function (err){
          if (err) {
            return next(err);
          };
          res.send({success:true,msg:'更换头像成功'});
        });  
      });
    });
  };

  //获取用户的头像
  function getusericon(req,res,next){
    //当前用户
    User.getUserById(req.session.user._id, function (err, user) {
      if (err) {
        return next(err);
      };
      //文件保存到mongodb内
      Filedb.readfile(user.icon,function(err,data){
        if (err){
          fs.readFile(settings.publicdir+'/img/no_head.png',function(err,data){
            if(err){
              return next(err);
            }; //throw err;
            //返回默认的图片
            res.set({
             'Content-Type': 'imge/png',
             'Content-Length': data.length,
            });
            res.send(data);
          });
          return false;
        };
        res.set({
          'Content-Type': 'imge/jpg',
          'Content-Length': data.length,
        });
        res.send(data);
        
      });
    });
  };

  //保存选择区域的文件
  function save_usericonregion(req,res,next){
    var data= new Obj({
      imgpath:req.param('imgpath'),
      left:req.param('left'),
      top:req.param('top'),
      width:req.param('width'),
      height:req.param('height')
    });   
    data.trim().xss();

    //当前用户
    User.getUserById(req.session.user._id, function (err, user) {
      if (err || !user) {
        return next(err);
      };
      //var imgname=Util.randomString(10) + Util.getFileExt(data.imgpath);
      //var img = settings.publicdir+'/'+imgname;
      Mg.Info(data.imgpath,function(err,Info){
        if(err){
          res.send({success:false,msg:'图片处理大小出错。'});
          return false;
        };
        var rx = Info.width > 640? Info.width/640:1;
        var ry = Info.height> 480? Info.height/480:1;
        console.log(rx);
        console.log(ry);
        Mg.Crop(data.imgpath,[parseInt(data.left)*rx,parseInt(data.top)*ry,
          parseInt(data.width)*rx,parseInt(data.height)*ry],function(err,img){
          fs.unlink(data.imgpath);
          if (err) {
            res.send({success:false,msg:'图片处理大小出错。'});
            return false;
          };
          
          Mg.Resize(img,parseInt(data.width),parseInt(data.height),function(err,newimg){
            Filedb.removefile(user.icon);//删除原来的。
            fs.unlink(img);
            Filedb.writefile(newimg,function(err,data){
              fs.unlink(newimg);
              if (err){
                res.send({success:false,msg:'图片保存到库内出错。'});
                return false;
              };
              user.icon = data._id;
              user.save(function (err){
                if (err) {
                  return next(err);
                };
                res.send({success:true,msg:'更换头像成功'});
              });  
            });
          });//Resize
   
        });//Crop

      }); //Info
     });
  };

  //

}