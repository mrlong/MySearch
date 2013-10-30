var 
Gm = require('../services/gm'),
assert = require('assert');

var file = './a.jpg';

Gm.Resize(file,640,418,function(err,file){
  if(!err){
    console.log(file);
  }
  else {
    console.log('Gm.Resize error');
  }
});

Gm.Info(file,function(err,info){
  console.log(info);
});