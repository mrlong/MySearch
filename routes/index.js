
/*
 * GET home page.
 */

// exports.index = function(req, res){
//   res.render('index', { title: 'Express',mrlong:'33333377766' });
// };

module.exports = function(app) {
  app.get('/', function (req, res) {
    res.render('index', { title: 'Express',mrlong:'33333377766' });
  });
};