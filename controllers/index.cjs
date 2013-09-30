
//首页
module.exports = function(app){
	this.route=[
		{ url:'/',
			func:index
		}
	];

	function index(req,res){
		res.render('index', {title:'Express',url:'/',mrlong:'33333377766',user:null});	
	}

}

/*exports.index = function(req, res) {
	
};*/

