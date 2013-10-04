
var settings=require('../settings');
var nodemailer = require("nodemailer");

//发送邮箱
// 
// options={
//  to:  多个以，分开
//  subject:  标题
//  content:  发送内容 
//  ishtml : true //表示使用html格式，否则是txt
// }
//
//
exports.sendmail=function(options,callback){
  var transport = nodemailer.createTransport("SMTP",settings.smtp_opts);

  var mailOptions = {
    from: settings.smtp_opts.auth.user, // 发送的邮箱与账号的邮箱一定一样，否则是505错误。 sender address
    to: options.to,
    subject: options.subject
  }
  if (options.ishtml){
    mailOptions.html = options.content;
  }
  else {
    mailOptions.text = options.content;
  }
  
  // send mail with defined transport object
  console.log(mailOptions);
  transport.sendMail(mailOptions, function(error, res){
    if(error){
      console.log(error.message);
      if(callback){
        callback(error);
      }
    }else{
      if(callback){
        callback(null);
      }
    }

    // if you don't want to use this transport object anymore, uncomment following line
    //smtpTransport.close(); // shut down the connection pool, no more messages
    transport.close();
  });
}

//生成随机码
// size 长度，如不写是6
//
exports.randomString=function(size) {
  size = size || 6;
  var code_string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var max_num = code_string.length + 1;
  var new_pass = '';
  while (size > 0) {
    new_pass += code_string.charAt(Math.floor(Math.random() * max_num));
    size--;
  }
  return new_pass;
}
 