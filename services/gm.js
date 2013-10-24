//
// 图片处理功能
//

var gm = require("gm");
var imageMagick = gm.subClass({ imageMagick : true });

//
// 图片进行截图
// img 原图
// newimg 截取图的保存位置
// region 区域 ［x,y,width,height］
//
exports.Crop=function(img,region,newimg,callback){
  imageMagick(img)
    //.resize(150, 150, '!') //加('!')强行把图片缩放成对应尺寸150*150！
    //.autoOrient()
    .crop(region[2], region[3], region[0], region[1])
    //.crop(width, height, x, y)
    //.region(region[0],region[1], , region[3])
    //.charcoal(1)
    .write(newimg, callback);
};


