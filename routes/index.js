
/*
 * GET home page.
 */

var user=require('../controllers/user.cjs');
var vip_home=require('../controllers/vip/home.cjs');


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
          ,fs = require('fs')
          ,str = fs.readFileSync(app.get("views") + '/error.ejs', 'utf8');
      var ret = ejs.render(str,{content:"你没有登录，请登录！",url:"/login"});
      return res.send(ret);
    }
  };
  
  app.get('/', function (req, res) {
    res.render('index', { title: 'Express',url:'/',mrlong:'33333377766',user:null });
    return false;
  });

  app.get('/login',user.login);

  //用户中心
  app.get('/vip',auths,vip_home.index);

  //错误
  app.use(function (req, res) {
    res.render("404");
  });

};