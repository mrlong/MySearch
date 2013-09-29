
var user = require('../models/user');


//用户登录
exports.login = function(req, res) {
	res.render('login', { title: 'Express',url:'/login',mrlong:'ssss' });
};

exports.logout = function(req,res){

};

