var settings=require('../settings');
var nodemailer = require("nodemailer");

var transport = nodemailer.createTransport('SMTP', settings.smtp_opts);

/**
 * Send an email
 * @param {Object} data 邮件对象
 */
var sendMail = function (data,callback) {
  if (settings.debug) {
    console.log('******************** 在测试环境下，不会真的发送邮件*******************');
    for (var k in data) {
      console.log('%s: %s', k, data[k]);
    };
    callback(null);
    return;
  }
  // 遍历邮件数组，发送每一封邮件，如果有发送失败的，就再压入数组，同时触发mailEvent事件
  transport.sendMail(data, function (err) {
    if(!err){
      callback(null);
    }
    else{
      callback(err);
      // 写为日志
      console.log(err);
    };
    transport.close();
  });
};

/**
 * 发送验证码到邮箱内
 *  @param {String} verCode 为验证码
 *  @param {String} to 发送到
 */
exports.sendVerCodeMail=function(req,to,name,verCode,callback){
  var REGUSER_URL = req.protocol + '://' + req.host + (settings.port !== 80 ? ':' + settings.port : '')+
      '/reguser?mail='+ to +'&name=' + name + '&vercode=' + verCode ;
  console.log(REGUSER_URL);
  var options={
    from : settings.smtp_opts.auth.user,
    to : to,
    subject: settings.title +'注册验证码', 
    html : '<p>您好：<p/>' +
      '<p>您的注册验证码为：<b>' + verCode + '</b></p>' + 
      '<p>请续继完成你的注册！请点击下面的链接完成你的注册。</p>' +
      '<a href="' + REGUSER_URL + '">进入页面完成注册</a>' + 
      '<p>' + 
      '<p>邮件是由系统自动发出，请不要直接回复邮件。</p>'
  }

  sendMail(options,callback);
};





