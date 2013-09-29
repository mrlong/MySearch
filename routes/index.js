
/*
 * GET home page.
 */



module.exports = function(app) {
  
  app.get('/', function (req, res) {
    res.render('index', { title: 'Express',url:'/',mrlong:'33333377766',user:null });
    return false;
  });

  app.get('/login',function (req,res){
    res.render('login', { title: 'Express',url:'/login',mrlong:'ssss' });
    return false;
  });

  app.use(function (req, res) {
    res.render("404");
  });
};