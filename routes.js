
/*
 * 路由功能
 */
var fs=require('fs');
var util = require('./services/util');
var obj  = require('./services/obj');
var settings = require('./settings');
var user = require('./models/user');

module.exports = function(app) {
  
  // simple logger
  var logger=function(req, res, next){
    console.log('%s %s', req.method, req.url);
    next();
  };

  //全局参数，用于认引擎加入
  var resbefore=function(req,res,next){
    if (req.session.user) {
      //req.session.user.name = 'mrlong';
      res.locals.user = req.session.user;
      res.locals.path = "'" + req.path + "'";
      return next();
    }
    else{
      var cookie = req.cookies[settings.cookieSecret];
      if (!cookie) {
        return next();
      };
      var auth_token = util.decrypt(cookie, settings.sessionSecret);
      var auth = auth_token.split('\t');
      var user_id = auth[0];
      user.getUserById(user_id,function(err,user){
        if(!err && user){
          user.logincount++;
          user.lastlogin = Date.now();
          user.save();
          req.session.user = user;
          //req.session.user.name = 'mrlong'
          res.locals.user = user;

          return next();
        }
        else{
          return next(err);
        }
      });
    };
    //res.locals.user = new obj({name:'mrlong'});
  };   

  //认证
  var auths = function(req,res,next) {
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
        if (fs.statSync(tmpPath).isFile() && tmpPath.indexOf('.cjs')>0){
          loadcontrollers(tmpPath);
        } //isFile()  
        //二级目录
        else{
          fs.readdir(tmpPath,function(err,files){
            if(!err){
              files.forEach(function(item) {
                var tmpPath2 = tmpPath + '/' + item; 
                if (fs.statSync(tmpPath2).isFile()&& tmpPath2.indexOf('.cjs')>0){
                  loadcontrollers(tmpPath2);
                }
                //三级目录
                else{
                  fs.readdir(tmpPath2,function(err,files){
                    if(!err){
                      files.forEach(function(item){
                        var tmpPath3 = tmpPath2 + '/' + item;
                        if(fs.statSync(tmpPath3).isFile()&& tmpPath3.indexOf('.cjs')>0){
                          loadcontrollers(tmpPath3);
                        };
                      });
                    };
                  });
                };
                //end 三级目录
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
      var mid=[logger,resbefore];
      if (typeof(val.auth)=='function'){
        mid[mid.length]=val.auth; 
      }
      else if(val.auth===true){
        mid[mid.length]=auths;
      };
      if(val.get){app.get(val.url,mid,val.get);};
      if(val.post){app.post(val.url,mid,val.post);};
    });  
  };
  //end loadcontrollers

};