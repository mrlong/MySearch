//首页
module.exports = function(app){
	this.route=[
		{ url:'/',
			get:index
		}
	];

	function index(req,res,next){
    debugger;
    res.render('index', {url:'/'});	
	}

}

/*exports.index = function(req, res) {
	
};*/

