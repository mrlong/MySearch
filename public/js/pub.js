//////////////////////////////////////////////
// 作者：龙仕云
// 公共的JS文件，方法之类的集合地
//
//////////////////////////////////////////////

!function (jQuery) {
  
  var jauthor = 'mrlong';
  jQuery(function(){
    
    //轮播间隔  
    $('.carousel').carousel({
      interval: 2000
    });

    //提示tooltip
    $("[data-toggle]").tooltip({container: "body"});

  });



  //在提示成功，或失败窗口。
  // $(".panel").msgbox(data.msg);
  // $(".panel").msgbox(data.msg,false);
  $.fn.msgbox=function(msg,success){
    var jpanel = $(this).parents('.panel');

    //没有则直接提示窗口了。
    if(!jpanel){
      alert(msg);
      return false;
    };

    jpanel.find("#yunzjmsgbox").remove();

    var jtxt = $('<div class="alert " id="yunzjmsgbox">'+
      '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'+
      '<span class="glyphicon"></span></div>');
    
    if (success==undefined || success==true){
      jtxt.addClass('alert-success');
      jtxt.find('span').addClass('glyphicon-ok');
      jtxt.find('span').after(' '+msg);
    }
    else{
      jtxt.addClass('alert-danger');
      jtxt.find('span').addClass('glyphicon-remove');
      jtxt.find('span').after(' '+msg);
    };
    jpanel.after(jtxt);

    //启动定时关闭提示窗口
    setTimeout(function(){
      $("#yunzjmsgbox").remove();
    },2000);
  };  


 
  
}(window.jQuery)



