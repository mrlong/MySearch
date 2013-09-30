
/*
 * GET home page.
 */
var fs=require('fs');

module.exports = function(app) {

  //认证
  var auths;
  auths = function(req,res) {
    //debuger;
    if (req.session.user) {
      return next();
    } 
    else {
      var ejs = require('ejs')
          ,str = fs.readFileSync(app.get("views") + '/error.ejs', 'utf8');
      var ret = ejs.render(str,{
          content:"你没有登录，请登录！",
          url:"/login",
          title:app.get('title')
      });
      return res.send(ret);
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
        app.get(val.url,auths,val.func)
      }
      else if (val.auth){
        app.get(val.url,val.auth,val.func) 
      }
      else{
        app.get(val.url,val.func) 
      }
    });  
  };

};