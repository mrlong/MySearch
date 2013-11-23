// 
// 个人资料内的职业技能
// 
var 
User = require('../../models/user'),
Msg  = require('../../models/msg'),
Util = require('../../services/util'),
settings = require('../../settings'),
Obj  = require('../../services/obj');

//用户登录
module.exports = function(app){
  this.route=[
    {
      url:'/vip/skill',
      auth:true, 
      get:function(req,res,next){
        var msgcount = 0;
        Msg.msgCountByUserId(res.locals.user._id,function(err,count){
          if(!err){
            msgcount = count; 
          }     
        });
        res.render('vip/skill',{url:'/vip/home',msgcount:msgcount});
      },
      post:skill
    }
    
  ];


  function skill(req,res,next){
    var data = new Obj({
      job:req.param('job')||'',
      work_years:req.param('work_years'),
      job_status:req.param('job_status'),
      major:req.param('major'),
      majorother:req.param('majorother')
    });
    data.trim().xss();

    User.getUserById(req.session.user._id, function (err, user){
      if(!err && user){
        user.skill.job = parseInt(data.job);
        user.skill.work_years = parseInt(data.work_years);
        user.skill.job_status = parseInt(data.job_status);
        user.skill.major = data.major.split(',');
        user.skill.majorother  = data.majorother;
        user.save(function(err){
          if(!err){
            req.session.user=user;
            res.json(200,{success:true,msg:'职业技能保存成功。'});
          }
          else{
            res.json(200,{success:false,msg:'职业技能保存出错。'});
          }
        });
      }
      else{
        res.json(200,{success:false,msg:'读取用户信息出错，无法保存。'});
      };
    });

  };

};