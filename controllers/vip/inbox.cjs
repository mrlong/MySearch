// 
// 站内信息
// 
// 

var 
User = require('../../models/user'),
Msg = require('../../models/msg');

module.exports = function(app){
  this.route=[
    {
      url:'/vip/inbox',
      auth:true, 
      get:getmessage,
      post:showinbox
    }
    
  ];

  //取出信息来，注意是分页的
  function getmessage(req,res,next){
    Msg.getMessagesByUserId(req.session.user._id,function(err,msgs){
      if(!err && msgs){
        res.locals.message = msgs;
      }
      else{
        res.locals.message = null;
      }
    });

    var msgcount = 0;
    Msg.msgCountByUserId(res.locals.user._id,function(err,count){
      if(!err){
        msgcount = count; 
      }     
    });
    res.render('vip/inbox',{url:'/vip/home',msgcount:msgcount});
  };

  //
  function showinbox(req,res,next){

  };


};