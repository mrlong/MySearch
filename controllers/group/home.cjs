
//用户登录
module.exports = function(app){
  this.route=[
    { url:'/group/home',
      auth:true,
      get:function(req,res,next){res.render('group/home',{url:'/group/home'});},
    }
  ]
};