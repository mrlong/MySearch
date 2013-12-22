// 
// 后台管理的主页
// 

module.exports = function(app){
  this.route=[
    { 
      name:'后台管理－主页',
      url:'/admin/home',
      auth:true,
      get:gethome
    },
    {
      name:'后台管理－主页',
      url:'/admin',
      auth:true,
      get:gethome
    }
  ];

  function gethome(req,res,next){
    res.render('admin/home',{url:'/admin'});
  }
};
