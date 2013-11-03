var 
Util = require('../services/util'),
User = require('../models/user'),
Obj  = require('../services/obj'),
Gm   = require('../services/gm'),
Mail = require('../services/mail'),
Settings=require('../settings');


module.exports = function(app){

  this.route=[
    {
      url:'/fgtpwd',   //忘记密码
      auth:true,
      get:function(req,res,next){res.render('forgetpwd',{url:'/login'});},
      post:function(req,res,next){
        var data= new Obj({
          mail:req.param('mail').toLowerCase(),
          vercode:req.param('vercode').toLowerCase()
        });
        data.trim().xss();

        if (req.session.fptpwd_vercode && data.vercode==req.session.fptpwd_vercode.toLowerCase()){
          User.getUserByMail(data.mail,function(err,user){
            if(!err&&user){
              var passwd = Util.randomString(6);
              user.pass = Util.md5(passwd);
              user.save(function(err){
                if(!err){
                  Mail.sendPasswdMail(req,passwd,data.mail,function(err){
                    if(!err){
                      res.send(Util.errBox('已新密码发达到你邮箱。','/login'));
                    }
                    else{
                      res.send(Util.errBox('将密码发达到邮箱出错。','/fgtpwd'));
                    }
                  });
                }
                else{
                  res.send(Util.errBox('更新数据出错。','/fgtpwd'));
                }
              });
            }
            else{
              res.send(Util.errBox('邮箱没有注册过。','/fgtpwd'))
            };
          });          
        }
        else{
          res.send(Util.errBox('验证码出错。','/fgtpwd'))
        }
      },
    },
    ///////
    {
      url:'/fptpwd/getvercode',  //获取验证码
      auth:true,
      get:function(req,res,next){
        var vercode = Util.randomString(6);
        req.session.fptpwd_vercode = vercode;
        Gm.ImgNumber(vercode,function(err, stdout){
          if(!err){
            //返回默认的图片
            // res.set({
            //  'Content-Type': 'imge/jpg',
            //  'Content-Length': stdout.length,
            // });
            stdout.pipe(res);
          }
          else{
            next(err);
          };
        });
      }
    },
    //


]};