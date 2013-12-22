
//用户登录
module.exports = function(app){
  this.route=[
    { 
      name:'小组－主页',
      url:'/group/home',
      auth:true,
      get:function(req,res,next){res.render('group/home',{url:'/group/home'});},
    },
    {
      name:'小组－主页',
      url:'/group',
      auth:true,
      get:function(req,res,next){res.render('group/home',{url:'/group/home'});},
    }
  ]
};