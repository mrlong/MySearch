
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var MongoStore = require('connect-mongo')(express);
var settings = require('./settings');
var flash = require('connect-flash');
var ejs = require('ejs');



settings.appdir        = __dirname;
settings.viewdir       = __dirname + '/views';
settings.controllerdir = __dirname + '/controllers';
settings.modueldir     = __dirname + '/models';
settings.servicedir    = __dirname + '/services';
settings.publicdir     = __dirname + '/public';
settings.uploaddir     = __dirname + settings.uploaddir;

var app = express();
// all environments
// configuration in all env
app.configure(function (){
  app.set('port', settings.port);
  app.set('views', settings.viewdir);
  app.set('controllers',settings.controllerdir);
  app.set('view engine', 'html');
  app.engine('html',ejs.renderFile);
  //启用 View 缓存（在开发阶段被关闭）
  app.set('view cache', false);
  
  app.set('title', settings.title);
  app.use(express.favicon(__dirname + '/public/img/favicon.ico'));
  app.use(flash());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: settings.cookieSecret,
    key: settings.db,
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
    store: new MongoStore({
      db: settings.mongodb.db,
      host: settings.mongodb.host
    })
  }));

  app.use(app.router);
  app.use(require('stylus').middleware(settings.publicdir));
  app.use(express.static(path.join(settings.publicdir)));
  app.use(express.bodyParser({uploadDir:settings.uploaddir}));
});


// app.locals({
//   title: 'My App',
//   phone: '1-250-858-9990',
//   email: 'me@myapp.com'
// });

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

routes(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

process.on('exit', function(code) {
  // do *NOT* do this
  setTimeout(function() {
    console.log('This will not run');
  }, 0);
  console.log('About to exit with code:', code);
});
