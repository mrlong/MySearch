//
// 图片处理功能
//
var Util = require("./util");
var gm = require("gm");
var fs=require('fs');
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
    .resize(widht, height, '!') //加('!')强行把图片缩放成对应尺寸150*150！还有 > >! < <!
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

//
//生成验证码
//
//直接生成一个图片到前台
// Gm.ImgNumber('23143',function(err,stdout){}
//  if(!err){stdout.pipe(res)}
// ); 
//

exports.ImgNumber=function(text,callback){
  var img=imageMagick(214, 44, "#fff")
  .fill("#fff")
  .stroke("black", 1)
  .drawRectangle(2, 2, 210, 40)
  .autoOrient();

  var imgcolor=["green","blue","black","red"];
  for (var i=0;i<20;i++){
    img.stroke(imgcolor[parseInt(Math.random()*4)], 1);
    img.drawLine(
      parseInt(Math.random()*210+1),
      parseInt(Math.random()*40+1), 
      parseInt(Math.random()*210+1), 
      parseInt(Math.random()*40+1));
  };

  img.fontSize(30);
  img.stroke("#ffffff");
  for (var i=0;i<text.length;i++)
  {
    img.stroke(imgcolor[parseInt(Math.random()*4)], 1);
    img.drawText(20+i*30, 30, text[i]);  
  };
  var filename = './in' + text + '.jpg';
  img.write(filename,function(err){
    if(!err){
      var readStream = fs.createReadStream(filename,{flags : 'r',
        encoding : null,
        mode : 0666,
        autoClose: true
      });
      callback(err,readStream); 
      fs.unlink(filename); 
    }
    else{
      callback(err);
    };
  });
  //img.stream(callback);
  //img.toBuffer(callback);

  //.write(writeStream, function (err) {
  //  if (!err) console.log(' hooray! ');
  //});
}

