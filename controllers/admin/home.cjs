// 
// 后台管理的主页
// 
var http = require('http');
var os = require('os');
var async = require('async');
var settings = require('../../settings');
var ECS = require('../../services/aliyun-ecs');

module.exports = function(app){
  this.route=[
    { 
      name:'后台管理－主页',
      url:'/admin/home',
      auth:true,
      get:gethome
    },
    {
      name:'后台管理－主页',
      url:'/admin',
      auth:true,
      get:gethome
    },
    {
      url:'/admin/serverstatus',
      name:'获取服务器的动态情况',
      auth:true,
      get:getserverstatus

    }
  ];

  function gethome(req,res,next){
    res.render('admin/home',{url:'/admin'});
  };

  //取出服务监控信息
  function getserverstatus(req,res,next) {
    async.series([
       function(callback){
        var port = 80;
        var url = req.protocol + '://' + req.host + ':' + port + '/status';
        var html = '';
        http.get(url,function (res_http){
          res_http.on('data',function (data) {//加载数据,一般会执行多次
            html += data;
          }).on('end', function () {
            html = '操作系统:' + '<b>' + os.platform() + '</b><br>' +
            '总内存:' + '<b>' + os.totalmem()/1024/1024  + 'M </b>' + '可用内存:<b>' + Math.round(os.freemem()/1024/1024)  +'M </b><br>' +
            '操作系统:' + '<b>' + os.platform() + '</b><br>' +
            'Nginx性能:<br><b> '+html+'</b><br>' +
            '<small> 在访问效率高，请求很快被处理完毕的情况上，Waiting数比较多是正常的，<p> 如果 reading + writing数较多，则说明并发访问量非常大，正在处理过程中。<p></small>';

            callback(null,html);
          }).on('error',function(){
            return '获取服务器的nginx监控出错。';
          });
        });
      },
      function(callback){
        //aliyun
        //{"MonitorData":{"InstanceMonitorData":[{"BPSRead":0,"BPSWrite":751,"CPU":1,"InstanceId":"AY1309251503212494ed","InternetBandwidth":1,"InternetFlow":57,"InternetRX":57,"InternetTX":0,"IntranetBandwidth":0,"IntranetFlow":22,"IntranetRX":22,"IntranetTX":0,"IOPSRead":0,"IOPSWrite":0,"Memory":1536,"TimeStamp":"2014-01-04T13:56:43Z"}]},"PageNumber":1,"PageSize":10,"RegionID":"cn-hangzhou","Time":"2014-01-04T13:57:11Z","TotalCount":1,"RequestId":"FB3A4800-9E8C-434E-BD70-698B18210388","Status":true}
        var ecs = new ECS(settings.aliyun.Access_Key_ID,settings.aliyun.Access_Key_Secret);
        ecs.getMonitorData(settings.aliyun.RegionId,
          settings.aliyun.InstanceId,function(json){
            var Insdata = json.MonitorData.InstanceMonitorData[0];
            var html = '阿里云监控信息：' + '<br>' +
              '  内存(MB):<b>' + Insdata.Memory + '</b><br>' + 
              '  CPU(核):<b>'  + Insdata.CPU + '</b><br>' +
              '  接收流量(KB):<b>'  + Insdata.IntranetRX + '</b><br>' +
              '  发送流量(KB):<b>' + Insdata.IntranetTX + '</b><br>' +
              '  网络流量(KB):<b>' + Insdata.IntranetFlow  + '</b><br>' +
              '  服务器带宽(KB)<b>:' + Insdata.IntranetBandwidth  + '</b><br>' +
              '  IO 读操作(次/s)<b>:' + Insdata.IOPSRead + '</b><br>' +
              '  IO 写操作(次/s):<b>' + Insdata.IOPSWrite + '</b><br>' +
              '查询流量的时间点:<b>' + Insdata.TimeStamp + '</b><br>' ;

            callback(null,html);
        });
      }   
    ],function(err,results){
      if(!err){
        res.send(200,results[0]+results[1]);
      } 
      else {
        res.send(200,'获取服务器的监控信息出错。')
      }
    });
  };

  ///////////////////
};
