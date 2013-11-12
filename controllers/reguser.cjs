// 用户注册模块，
// 作者：龙仕云  2013－11－2
// 修改
//   编号   时间          作者    修改内容
//   1    2013－11－2    龙仕云   创建文件


var 
User = require('../models/user'),
Util = require('../services/util'),
Obj  = require('../services/obj'),
service_mail = require('../services/mail'),
Settings=require('../settings');


module.exports = function(app){

  this.route=[
    {
      url:'/reguser',
      get:reguser,
      post:createuser
    },
    {
      url:'/reguser/:qq/:name/:vercode',
      get:reguser
    },
    {
      url:'/verifyqq',   //校验邮箱
      post:verifyqq
    },
    {
      url:'/verifyname',   //校验用户名
      post: verifyname
    },
    {
      url:'/verifyvercode', //校验验证码是否有效。
      post:verifyvercode
    },
    {
      url:'/getvercode',   //获取验证码
      post:getvercode
    }
    
  ];

  //注册用户
  function reguser(req,res,next){
    var data= new Obj({
      qq:req.param('qq')||'',
      name:req.param('name')||'',
      vercode:req.param('vercode')||''
    });
    data.trim().xss();
    res.render('reguser',{
        url:'/login',
        title:app.get('title'),
        data:data
    });
  }

  //创建用户并写入到库内
  function createuser(req,res,next){
    var data= new Obj({
      qq    : req.param('qq').toLowerCase(),
      name    : req.param('name'),
      pass    : req.param('pass'),
      vercode : req.param('vercode'),
    });
    data.trim().xss();
    data.pass = Util.md5(data.pass); //MD5写入库。
    if (!req.session.vercode || !req.session.vercode.qq ){
      res.send(Util.errBox('无效的验证码，注册失败！','/reguser'));
    }
    else{
      if (req.session.vercode.qq != data.qq || req.session.vercode.vercode != data.vercode){
        res.send(Util.errBox('无效的验证码，注册失败！','/reguser'));
      };
    };

    //检查邮箱与用户名是否存在
    User.getUserByQQ(data.qq,function(err,user){
      if (!err && user){
        res.send(Util.errBox('注册的QQ号已存，不能注册！','/reguser'));
        return false;
      }
    });

    User.getUserByName(data.name,function(err,user){
      if(!err && user){
        res.send(Util.errBox('用户名已有人在使用，不能注册！','/reguser'));
        return false; 
      };
    });

    //写入库内
    User.userSave(data,function(err){
      if(!err){
        res.send(Util.msgBox('注册成功，请重新登录！','/login'));
        req.session.vercode={}; //清空原来的值
      }
      else{
        res.send(Util.errBox('注册失败！','/reguser'));
      }
    })
  };

  //检验邮箱
  function verifyqq(req,res,next){  
    var qq = req.body.qq;
    User.userFind(qq,function(err,doc){
      var data={};
      console.log(err);
      if(err==false){
        console.log('y');
        data.success = true;
        data.msg = "QQ号有效。";
      }
      else{
        console.log('x');
        data.success = false;
        data.msg = "QQ号已注册过了，不能再注册。";
      };
      res.json(200,data);
    });
  };

  //检验用户名是否重复
  function verifyname(req,res,next){
    var data = new Obj({
      name : req.param('name').toLowerCase()
    });
    data.trim().xss();
    User.getUserByName(data.name,function(err,user){
      if(!err && user){
        res.json(200,{success:false,msg:'用户名已有人用，请换一个。'});
      }
      else{
        if (err){
          res.json(200,{success:false,msg:'系统异常出错。'});
        }
        else{
          res.json(200,{success:true,msg:'用户名可以使用。'});
        };
      };
    });
  };
  
  //获取验证码
  function getvercode(req,res,next){
    var data= new Obj({
      qq:req.param('qq'),
      name:req.param('name'),
      style:req.param('style')
    });
    data.trim().xss();
    if (req.session.vercode && req.session.vercode.qq==data.qq){
      var myvercode = req.session.vercode.vercode; //采用原来的，因为用户如多次点了获取这样就同一个了。
    } 
    else{ 
      var myvercode = Util.randomString();
      req.session.vercode = {qq:data.qq,
        vercode:myvercode,style:data.style};
    };
    service_mail.sendVerCodeMail(req,data.qq,data.name,myvercode,function(err){
      if (!err){
        res.json(200,{success:true,msg:'验证码已发送到你的QQ邮箱内。'});   
      }
      else{
        res.json(200,{success:false,msg:'发送邮件异常出错，请联系客服。'});
      }
    })    
  };

  //校验验证码是否正确
  function verifyvercode(req,res,next){
    var data = new Obj({
      style : req.param('style'),
      qq : req.param('qq'),
      vercode : req.param('vercode')
    });
    data.trim().xss();
    if (req.session.vercode){
      if (req.session.vercode.qq==data.qq && req.session.vercode.style==data.style && 
          req.session.vercode.vercode==data.vercode){
        res.send({success:true,msg:'验证码有效。'});
      }
      else{
        res.send({success:false,msg:'验证码无效。'});
      };
    }
    else{
      res.send({success:false,msg:'请先获取验证码。'});
    };
  };

}