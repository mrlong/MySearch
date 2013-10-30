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
        console.log(data2.length);
        // console.log(data2.toString());
        assert.notEqual('',data2.toString('base64'));
        //assert.equal(data.toString('base64'), data2.toString('base64'));
      }
      else{
        console.log('writefile error');
      }
    });

    Filedb.existfile(fileid,function(err,data){
      if (data==true){
        console.log('文件存在的');
        //文件存在，这时才要删除掉
        console.log('====removefile====');
        Filedb.removefile(fileid,function(err,data){
          if(!err){
            console.log(data.fileId);
            Filedb.existfile(fileid,function(err,data){
              if(data==true){
                console.log('removefile error 没有删除掉，还是有错');
              }
              else {
                console.log('文件已删除掉了，不存在了');
              }
            });
          }
          else{
            console.log('removefile error');
          }
        });
      }
    });
  }
  else{
    console.log('error');
  }
});


