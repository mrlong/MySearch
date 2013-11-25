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
  // save 为保存按钮。
  // $("#save").msgbox(data.msg);
  // $("#save").msgbox(data.msg,false);
  // $("#save").msgbox(data.msg,false,functin(){});
  // $("#save").msgbox(data.msg,function(){});
  $.fn.msgbox=function(msg,success,callabck){
    var jpanel = $(this).parents('.panel');

    //没有则直接提示窗口了。
    //查是不是有弹出窗口的编辑窗口
    if(jpanel.length==0){
      var jmodal_dialog = $(this).parents('.modal-dialog');
      if (jmodal_dialog.length>0){
        var jpanel = jmodal_dialog.find('.modal-body');
      };
      if(jpanel.length==0){
        alert(msg);
        return false;
      };
    };

    jpanel.find("#yunzjmsgbox").remove();

    var jtxt = $('<div class="alert " id="yunzjmsgbox">'+
      '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'+
      '<span class="glyphicon"></span></div>');
    
    var mysuccess = (success==undefined) || (typeof(success)=='function') || success==true;
    var func = typeof(success)=='function'?success:callabck;

    if (mysuccess==true){
      jtxt.addClass('alert-success');
      jtxt.find('span').addClass('glyphicon-ok');
      jtxt.find('span').after(' '+msg);
      jpanel.removeClass('panel-default').addClass('panel-success');
    }
    else{
      jtxt.addClass('alert-danger');
      jtxt.find('span').addClass('glyphicon-remove');
      jtxt.find('span').after(' '+msg);
      jpanel.removeClass('panel-default').addClass('panel-danger');
    };
    jpanel.after(jtxt);

    //启动定时关闭提示窗口
    setTimeout(function(){
      $("#yunzjmsgbox").remove();
      jpanel.removeClass('panel-danger').removeClass('panel-success').addClass('panel-default');
      if(func){func()};
    },2000);
  };  
 
  
}(window.jQuery)



