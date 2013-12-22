// 
// 财务的主页
// 
// 

module.exports = function(app){
  this.route=[
    { 
      name:'财务－主页',
      url:'/admin/fina/home',
      auth:true,
      get:gethome
    },
    {
      name:'财务－主页',
      url:'/admin/fina',
      auth:true,
      get:gethome
    }
  ];

  function gethome(req,res,next){
    res.render('admin/fina/home',{url:'/admin/fina'});
  }
};