
module.exports = function(app){
  this.route=[
    {
      url:'/vip/inbox',
      auth:true, 
      get:function(req,res,next){res.render('vip/inbox',{url:'/vip/home'});},
      post:showinbox
    }
    
  ];


  function showinbox(req,res,next){

  };


};