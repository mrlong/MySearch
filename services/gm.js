//
// 图片处理功能
//
var Util = require("./util");
var gm = require("gm");
var imageMagick = gm.subClass({ imageMagick : true });

//
// 图片进行截图
// img 原图
// region 区域 ［x,y,width,height］
//
exports.Crop=function(img,region,callback){
  var newimg = Util.getSameFile(img);
  imageMagick(img)
    //.resize(150, 150, '!') //加('!')强行把图片缩放成对应尺寸150*150！
    //.autoOrient()
    .crop(region[2], region[3], region[0], region[1])
    //.crop(width, height, x, y)
    //.region(region[0],region[1], , region[3])
    //.charcoal(1)
    .write(newimg, function(err){
      callback(err,newimg);
    });
};

//
//强制缩放大小
// Gm.Resize('./a.jpg',10,10,function(err,file){
//  if(!err){
//      //file =新的文件名,但后可保存到库内要删除掉的.
//   } 
// })
//
exports.Resize=function(img,widht,height,callback){
  var newimg = Util.getSameFile(img);
  imageMagick(img)
    .resize(widht, height, '!') //加('!')强行把图片缩放成对应尺寸150*150！
    .autoOrient()
    .write(newimg, function(err){
      callback(err,newimg);
    });
};

//
//取出图片的信息
//
exports.Info=function(img,callback){
  var data={};
  imageMagick(img)
    .size(function(err, value){
      if(err){callback(err);return false;};
      data.width = value.width;
      data.height= value.height;
      this.filesize(function(err,value){
        if(err){callback(err);return false;};
        data.size=value
        this.format(function(err,value){
          if(err){callback(err);return false;};
          data.format=value; //gif, jpeg, png, etc
          callback(err,data);
        });        
      });
    })
}

