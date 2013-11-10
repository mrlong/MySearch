//
//
//

var 
mongodb = require('mongodb'),
GridStore= mongodb.GridStore,
ObjectID = mongodb.ObjectID,
settings=require('../settings');

//
//filepath 文件路径
// var filedb = require('./filedb');
// filedb.savefile('./filedb.js',function(err,data){
//   data._id  
// });
//
exports.writefile=function(filepath,callback){
  var server = new mongodb.Server(settings.mongodb.host, settings.mongodb.dbport),
      connect = new mongodb.Db(settings.mongodb.db, server,{safe:false});
  connect.open(function (err, db) {
    if(err){
      callback(err);
      return false;
    };
    var fileId = new ObjectID();
    var filename = filepath.substring(filepath.lastIndexOf('/')+1,filepath.length);
    var gridStore = new GridStore(connect,fileId,filename,'w');//创建文件
    gridStore.open(function(err,gridStore){
      console.log(err);
      if(!err && gridStore){
        gridStore.writeFile(filepath,function(err,gridStore){
          if(!err && gridStore){
            gridStore.close(function(err,result){
              //console.log(result._id);
              callback(err,result);
              db.close();
            });
          }
          else{
            callback(err);
          }
        });
      }
      else{
        callback(err);
      }
    });
    
  });
};

exports.readfile=function(id,callback){
  var server = new mongodb.Server(settings.mongodb.host, settings.mongodb.dbport),
      connect = new mongodb.Db(settings.mongodb.db, server,{safe:false});
  connect.open(function (err, db) {
    if(err){
      callback(err);
      return false;
    };
    var gridStore = new GridStore(connect,id,'r');//创建文件
    gridStore.open(function(err,gridStore){
      if(!err){
        gridStore.seek(0, function() {
          gridStore.read(function(err, fileData) {
            if(!err){
              callback(err,fileData);
            }    
            else{
              callback(err);
            }
            db.close();
          });
        });
      }
      else{
        callback(err);
      }
    });
    
  });
};   

// 删除文件
// id = ObjectID
exports.removefile=function(id,callback){
  var server = new mongodb.Server(settings.mongodb.host, settings.mongodb.dbport),
      connect = new mongodb.Db(settings.mongodb.db, server,{safe:false});
  connect.open(function (err, db) {
    if(err){
      if(callback){callback(err);};
      return false;
    };
    var gridStore = new GridStore(connect,id,'r');
    gridStore.open(function(err,gridStore){
      if(!err && gridStore){
        gridStore.unlink(function(err, result) {
          if(callback){callback(err,result);};
          db.close();
        });
      }
      else{
        if(callback){callback(err);};
      }
    });
  });
};

//确定文件是否存在
//
// Filedb.existfile(id,function(err,exist){
//   if(exist==true){
//      ...存在。。。 
//    } 
// });
//
exports.existfile=function(id,callback){
  var server = new mongodb.Server(settings.mongodb.host, settings.mongodb.dbport),
      connect = new mongodb.Db(settings.mongodb.db, server,{safe:false});
  connect.open(function (err, db) {
    if(err){
      callback(err);
      return false;
    };
    GridStore.exist(db,id, function(err, result){
      callback(err,result);
      db.close();
      // assert.equal(null, err);
      // assert.equal(true, result);
    });

  });
};
