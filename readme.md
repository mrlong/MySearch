作者：龙仕云 2013-9-29


controllers 控制器的增加

浏览器从 / 或 /login 进来会先从controllers内查找
有没有我的应用，这个是路由先有作用.

browes -> routes -> controllers -> view  + models = html 

所以 controllers 内就包括了view -> xxx.ejs 
                           models -> 用到哪个models了。

所以 view 与 models 只爆露给controllers , 
     routes 不必知道是哪个 view 以及 models , 只要知道 controllers



命名规格:

  1.modules 内是表示出库的结构.

     类型必须采用 {type:String} 来写，不能写成 : String
 例如:
    var userSchema=new Schema({
 			name   : {type:String},   //用户名 
  		pw     : {type:String},   //密码 md5.base64
 
		});
		db.model('user',userSchema);

		user必须是小写, 这时的module名一样是小写 如:db.model('user',userSchema);
		还有这个modules的命名必须是user.js文件。

 2.所有文件名都是小写包括目录名.

 
 3.控制器的书写规则
   扩展为: cjs ， 注意只能支持二级目录结构.

   module.exports = function(app){
      this.route=[
        {
          url:  '',      //路由,如是二级目录则要写/xxx/xxx, 尽量定的路由与目录结构一样
          auth: true,    //=true表示要认证, 可以是 function(req,res,next){}  
          get: myfunc,   //表示使用get方法
          post:myfunc2   //post方法
        },
        ...
      ]

      //get
      function myfunc(req,res,next){
        ...
      };

      //post
      function myfunc2(req,res,next){
        ...
      };

    }
  }  


4.目录规则
   services 存放集成第三方的服务，如邮件服务，信息服务等
   models
   Views
   controllers
   


                                    