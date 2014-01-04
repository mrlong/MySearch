//
// 系统设置
//
//

module.exports = { 
  debug: false,
  title: 'yunzj',
  port : 3000,             //web服务端口
  sessionSecret: 'myblog', //session 串加密key
  cookieSecret:  'myblog', 
  //
  mongodb:{
    db: 'blog', 
    host: 'localhost',
    dbport: 27017
  },  
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
  },
  //下载目录,在发布的根目录下
  uploaddir:'/upload',

  //aliyun key
  aliyun:{
    Access_Key_ID : 'F1BCUXVzwzc9Wl1Z',
    Access_Key_Secret : 'BrwpYtC6fo1kDr1mJKYUg04ONVKFho',
    RegionId : 'cn-hangzhou',   //云服务器所属于的 Region ID
    InstanceId : 'AY1309251503212494ed'  //如果指定，则查询指定实例的监控信息
  },
  
}; 