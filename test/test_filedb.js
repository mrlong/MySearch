var 
Filedb = require('../services/filedb'),
assert = require('assert');

console.log('==writefile==');
Filedb.writefile('./test_filedb.js',function(err,data){
  if(!err){
    console.log(data._id);
    console.log(data.filename);
    console.log(data.md5);
    console.log('====readfile===');
    var fileid = data._id;
    console.log('要取出的fileid='+fileid);
    Filedb.readfile(fileid,function(err,data2){
      if(!err){
        assert.notEqual('',data2.toString('base64'));
        //assert.equal(data.toString('base64'), data2.toString('base64'));
      }
      else{
        console.log('error');
      }
    });
  }
  else{
    console.log('error');
  }
});


