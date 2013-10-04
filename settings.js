//
// 系统设置
//
//

module.exports = { 
  cookieSecret: 'myblog', 
  db: 'blog', 
  host: 'localhost',
  dbport: 27017,

  //邮件发送
  smtp_opts: {
    host: 'smtp.163.com',
    port: 25,
    auth: {
      user: 'mrlong_xp@163.com',
      pass: 'mrlong7895123'
    }
  },
  //客服管理员信息
  manager:{
    email:'mrlong.com@gmail.com',
    tel:'13857121269'
  }
  
}; 