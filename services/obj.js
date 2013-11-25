var sanitize = require('validator').sanitize;

var obj=function(items){
  cloneAll(items,this);
};

obj.prototype.xss=function(){

  for (var key in this){
    if(typeof(this[key])!='function'){
      this[key] = sanitize(this[key]).xss();
      //console.log(key);
      //console.log(this[key]);
    }
  };
  return this;
};

obj.prototype.trim=function(){
  for (var key in this){
    //if(typeof(this[key])!='function'
    if( this[key] && typeof(this[key])=='string'){
      this[key] = this[key].trim();
    }
  };
  return this;
};

//对象拷贝
function cloneAll(source,dirc){
  for(var key in source){
    if(typeof source[key] == "object"){
      dirc[key]= new obj;            
      cloneAll(source[key],dirc[key]);            
      continue;        
    }
    else{         
      dirc[key] = source[key]; 
    }   
  }   
};

obj.prototype.clone=function(source){
  cloneAll(source,this);
  return this;
};

exports = module.exports = obj;

