// 
// 用户
// 
// 

var db=require('./db');

var UserSchema=new db.Schema({
  qq : string,
  name : string,
  pw : string,
  point : Number,
  regdate: date
});

var User = db.model('User',UserSchema);

// user_qq char(50)  NOT NULL,     #QQ
//   user_name char(50) NOT NULL,    #姓名
//   user_pw char(100) NOT NULL,     #密码，是MD5码
//   user_headimage blob,            #头像
//   user_point int default 0,       #积分
//   user_regdate datetime NOT NULL, #注册时间
//   user_issoft bit default 0,      #=1表示这个用户是登录过软件的