// 
// 后台管理的主页
// 

module.exports = function(app){
  this.route=[
    { url:'/admin/home',
      auth:true,
      get:function(req,res,next){res.render('admin/home',{url:'/admin/home'});},
    }
  ]
};
