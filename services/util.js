
var settings=require('../settings');
var fs=require('fs');

//生成随机码
// size 长度，如不写是6
//
exports.randomString=function(size) {
  size = size || 6;
  var code_string = 'ABCDEFGHIJKL3MNO2PQRST1U9VWX8YZ7ab6cde5fghi4jklm0nopqrstuvwxyz';
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
 