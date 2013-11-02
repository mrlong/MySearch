var 
Gm = require('../services/gm'),
fs=require('fs'),
assert = require('assert');

var gm2 = require("gm");

var file = './a.jpg';

// Gm.Resize(file,640,418,function(err,file){
//   if(!err){
//     console.log(file);
//   }
//   else {
//     console.log('Gm.Resize error');
//   }
// });

// Gm.Info(file,function(err,info){
//   console.log(info);
// });

// gm2('./a.jpg')
// .resize('200', '200')
// .stream(function (err, stdout, stderr) {
//   var writeStream = fs.createWriteStream('./resized.jpg');
//   stdout.pipe(writeStream);
// });

//测试验证码
Gm.ImgNumber('23SrsG',function(err, stdout){
  var writeStream = fs.createWriteStream('./resized.jpg');
  stdout.pipe(writeStream);
  //console.log(stdout.length);
  if(!err && stdout.length>0){
    console.log('OK');
  }
  else{
    console.log(stdout);
    console.log('Mg ImgNumber error');
  }
});