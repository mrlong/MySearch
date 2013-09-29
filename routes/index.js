
/*
 * GET home page.
 */

var user=require('../controllers/user.con');

module.exports = function(app) {
  
  //认证
  var auth;
  auth = function(req, res, next) {
    if (req.cookies.user) {
      return next();
    } 
    else {
      if (req.session.user) {
        return next();
      } 
      else {
        return res.redirect('/login');
      }
    }
  };

  app.get('/',function (req, res) {
    res.render('index', { title: 'Express',url:'/',mrlong:'33333377766' });
  });

  app.get('/login',user.login);

  app.get('/vip',auth,function (req,res){

  });

  app.use(function (req, res) {
    res.render("404");
  });
};