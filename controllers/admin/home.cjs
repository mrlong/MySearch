// 
// 后台管理的主页
// 

module.exports = function(app){
  this.route=[
    { url:'/admin/home',
      auth:true,
      get:gethome
    },
    {
      url:'/admin',
      auth:true,
      get:gethome
    }
  ];

  function gethome(req,res,next){
    res.render('admin/home',{url:'/admin'});
  }
};
