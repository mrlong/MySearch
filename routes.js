
/*
 * 路由功能
 */
var fs=require('fs');
var util = require('./services/util');

module.exports = function(app) {

  //认证
  var auths;
  auths = function(req,res) {
    //debuger;
    if (req.session.user) {
      return next();
    } 
    else {
      return res.send(util.errBox("你没有登录，请登录！",'/login'));
    }
  };
  
  //路由加载
  fs.readdir(app.get("controllers"), function(err, files){
    if(!err){
      files.forEach(function(item) {  
        var tmpPath = app.get("controllers") + '/' + item;
        debugger;
        if (fs.statSync(tmpPath).isFile()){
          loadcontrollers(tmpPath);
        } //isFile()  
        //二级目录
        else{
          fs.readdir(tmpPath,function(err,files){
            if(!err){
              files.forEach(function(item) {
                var tmpPath2 = tmpPath + '/' + item; 
                if (fs.statSync(tmpPath2).isFile()){
                  loadcontrollers(tmpPath2);
                }
              })
            }
          });
        }//end 二级目录
      });
    }
  });
  //end 路由加载

  //错误
  app.use(function (req, res) {
    res.render("404");
  });

  function loadcontrollers(filepath){
    var a =  require(filepath);
    new a(app).route.forEach(function(val){
      if (val.auth && val.auth===true){
        if (val.method && val.method=='post'){
          app.post(val.url,auths,val.func);
        }
        else{
          app.get(val.url,auths,val.func);
        }
      }
      else if (val.auth){
        if(val.method && val.method=='post'){
          app.post(val.url,val.auth,val.func);
        }
        else{
          app.get(val.url,val.auth,val.func);
        } 
      }
      else{
        if(val.method && val.method=='post'){
          app.post(val.url,val.func);
        }
        else{
          app.get(val.url,val.func);
        }
      }
    });  
  };

};