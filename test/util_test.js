var 
Util = require('../services/util'),
assert = require('assert');




var file = './a.jpg';
var ext = Util.getFileExt(file);
console.log(ext);
var newfile = Util.getSameFile(file);
console.log(newfile);


