/*
 * aliyun 的 SEC 的API
 * 用于统计分析服务器的状态信息。
 * 
 * 参考：https://github.com/xiaoshan5733/aliyun-ecs
 *  
 × 作者：龙仕云 2014－1－4
 *
 *
 * example
 * var ECS = require('aliyun-ecs');
 * var ecs = new ECS('your_accessKeyId', 'your_accessKeySecret');
 * ecs.describeRegions(function(json){
 *   console.log(json)
 * });
 */

var crypto = require('crypto');
var request = require('request');


//签名编码
function percentEncode(str){
  var res = encodeURIComponent(str);
  res = res.replace(/\+/g, '%20');
  res = res.replace(/\*/g, '%2A');
  res = res.replace(/%7E/g, '~');
  return res;
}

//签名
function getSignature(params, secret){
  var keys = Object.keys(params).sort();
  var _keys = [];
  for( var i = 0, len = keys.length; i < len; i ++){
    _keys.push(percentEncode(keys[i]) + '=' + percentEncode(params[keys[i]]));
  }
  var queryString = _keys.join('&');
  var stringToSign = 'GET&%2F&' + percentEncode(queryString);
  var hmac = crypto.createHmac('sha1', secret + '&');
  hmac.update(stringToSign);
  return hmac.digest('base64');
}

//api接口
var ECS = function(accessKeyId, accessKeySecret){
  this.accessKeyId = accessKeyId;
  this.accessKeySecret = accessKeySecret;
  this.CONFIG = {
    Format: 'JSON',
    Version: '2013-01-10',
    AccessKeyId: this.accessKeyId,
    SignatureVersion: '1.0',
    SignatureMethod: 'HMAC-SHA1'
  };
};

ECS.prototype.doRequest=function(params, callback){
  var data = {};
  for(var i in this.CONFIG){
    data[i] = this.CONFIG[i];
  }
  data['SignatureNonce'] = Math.random().toString(36).substring(2);
  data['TimeStamp'] = new Date().toISOString();
  for(var j in params){
    data[j] = params[j];
  }
  data['Signature'] = getSignature(data, this.accessKeySecret);
  var paramString = [];
  for(var p in data){
    paramString.push(encodeURIComponent(p) + '=' + encodeURIComponent(data[p]));
  }
  sign = paramString.join('&');
  console.log(sign);
  request('http://ecs.aliyuncs.com/?' + sign, function(err, response, body){
    //console.log(body)
    var json = {};
    try{
      json = JSON.parse(body);
    }catch(e){
      json.Status = false;
      json.Sessage = 'response error';
    }

    if(json.Code && json.Message){
      json.Status = false;
    }else{
      json.Status = true;
    }
    callback.call(null, err, response, json/*JSON.stringify(json)*/);
  })
};

//查询可用数据中心
ECS.prototype.describeRegions = function(callback){
  this.doRequest({
    Action: 'DescribeRegions'
    }, function(err, response, body){
      callback.call(null, body);
    })
};

//查看云服务器监控信息
ECS.prototype.getMonitorData = function(RegionId, InstanceId, callback){
  this.doRequest({
    Action: 'GetMonitorData',
    RegionId: RegionId,
    InstanceId: InstanceId
  }, function(err, response, body){
    callback.call(null, body);
  })
};

module.exports = ECS;


