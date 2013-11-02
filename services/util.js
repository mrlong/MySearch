
var settings=require('../settings');
var fs=require('fs');
var crypto = require('crypto');

//生成随机码
// size 长度，如不写是6
//
exports.randomString=function(size) {
  size = size || 6;
  var code_string = 'ABCDEFGHIJKL3MN2PQRST1U9VWX8YZ7ab6cde5fghi4jklm0npqrstuvwxyz';
  var max_num = code_string.length + 1;
  var new_pass = '';
  while (size > 0) {
    new_pass += code_string.charAt(Math.floor(Math.random() * max_num));
    size--;
  }
  return new_pass;
};

//
// 提示窗口
// @param {string} msg 提示内容
// @param {url} url 自动转向到
// 返回提示的字符串内容
//
exports.msgBox=function(msg,url){
  var ejs = require('ejs')
      ,str = fs.readFileSync(settings.viewdir + '/error.html', 'utf8');
  var ret = ejs.render(str,{
        content:msg,
        url:url,
        title:settings.title
      });
  return ret;
};

//
// 提示错误窗口
// @param {string} msg 提示内容
// @param {url} url 自动转向到
// 返回提示的字符串内容
//
exports.errBox=function(msg,url){
  var ejs = require('ejs')
      ,str = fs.readFileSync(settings.viewdir + '/error.html', 'utf8');
  var ret = ejs.render(str,{
        content:msg,
        url:url,
        title:settings.title
      });
  return ret;
};

//字符串加密
exports.encrypt=function(str, secret) {
  var cipher = crypto.createCipher('aes192', secret);
  var enc = cipher.update(str, 'utf8', 'hex');
  enc += cipher.final('hex');
  return enc;
}

//字符串解密
exports.decrypt=function(str, secret) {
  var decipher = crypto.createDecipher('aes192', secret);
  var dec = decipher.update(str, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}

//
// 提示错误窗口
// @param {string} str 
// 返回提示的字符串内容
//
exports.md5=function (str) {
  var md5sum = crypto.createHash('md5');
  md5sum.update(str);
  str = md5sum.digest('hex');
  return str;
}

//
// 日期格式处理。
//
//
exports.format_date = function (date, friendly) {
  var year  = date.getFullYear();
  var month = date.getMonth() + 1;
  var day   = date.getDate();
  var hour  = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();

  if (friendly) {
    var now = new Date();
    var mseconds = -(date.getTime() - now.getTime());
    var time_std = [ 1000, 60 * 1000, 60 * 60 * 1000, 24 * 60 * 60 * 1000 ];
    if (mseconds < time_std[3]) {
      if (mseconds > 0 && mseconds < time_std[1]) {
        return Math.floor(mseconds / time_std[0]).toString() + ' 秒前';
      }
      if (mseconds > time_std[1] && mseconds < time_std[2]) {
        return Math.floor(mseconds / time_std[1]).toString() + ' 分钟前';
      }
      if (mseconds > time_std[2]) {
        return Math.floor(mseconds / time_std[2]).toString() + ' 小时前';
      }
    }
  }

  //month = ((month < 10) ? '0' : '') + month;
  //day = ((day < 10) ? '0' : '') + day;
  hour = ((hour < 10) ? '0' : '') + hour;
  minute = ((minute < 10) ? '0' : '') + minute;
  second = ((second < 10) ? '0': '') + second;

  //var thisYear = new Date().getFullYear();
  //year = (thisYear === year) ? '' : (year + '-');
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
};

//
// 获取文件的扩展名
//
exports.getFileExt = function(file){ 
  var d=/\.[^\.]+$/.exec(file); 
  return d[0]; 
};

//
// 当前文件随意生成一个同扩展名的文件
//
exports.getSameFile=function(file){
  var ext = exports.getFileExt(file);
  var name = file.substring(0,file.length-ext.length);
  return name + exports.randomString(6) + ext;
}
