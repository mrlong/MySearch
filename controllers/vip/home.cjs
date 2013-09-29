
var user = require('../../models/user');


//用户登录
exports.index = function(req, res) {
  res.render('vip/home.ejs', { title: 'Express',url:'/vip',mrlong:'33333377766',user:null });
};


