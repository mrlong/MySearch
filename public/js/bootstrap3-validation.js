/* ========================================================= 
 *
 * 在原作者的基础修改支持 bootstrap3
 *
 *
/* =========================================================
 * bootstrap-validation.js 
 * Original Idea: http:/www.newkou.org (Copyright 2012 Stefan Petre)
 * Updated by 不会飞的羊 (https://github.com/FateSheep/Validation-for-Bootstrap)
 * =========================================================
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */
!function($) {
    $.fn.validation = function(options) {
        return this.each(function() {
            globalOptions = $.extend({}, $.fn.validation.defaults, options);
            validationForm(this)
        });
    };

   $.fn.validation.defaults = {
        validRules : [
            {name: 'required', validate: function(value) {return ($.trim(value) == '');}, defaultMsg: '请输入内容。'},
            {name: 'number', validate: function(value) {return (!/^[0-9]\d*$/.test(value));}, defaultMsg: '请输入数字。'},
            {name: 'mail', validate: function(value) {return (!/^[a-zA-Z0-9]{1}([\._a-zA-Z0-9-]+)(\.[_a-zA-Z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+){1,3}$/.test(value));}, defaultMsg: '请输入邮箱地址。'},
            {name: 'char', validate: function(value) {return (!/^[a-z\_\-A-Z]*$/.test(value));}, defaultMsg: '请输入英文字符。'},
            {name: 'chinese', validate: function(value) {return (!/^[\u4e00-\u9fff]$/.test(value));}, defaultMsg: '请输入汉字。'}
        ]
    };

    var formState = false, fieldState = false, wFocus = false, globalOptions = {};

    // 验证字段
    var validateField = function(field, valid) { 
        var el = $(field), error = false, errorMsg = '';
        for (i = 0; i < valid.length; i++) {
            var x = true, flag = valid[i], msg = (el.attr(flag + '-message')==undefined)?null:el.attr(flag + '-message');
            if (flag.substr(0, 1) == '!') {
                x = false;
                flag = flag.substr(1, flag.length - 1);
            }

            var rules = globalOptions.validRules;
            for (j = 0; j < rules.length; j++) {
                var rule = rules[j];
                if (flag == rule.name) {
                    if (rule.validate.call(field, el.val()) == x) {
                        error = true;
                        errorMsg = (msg == null)?rule.defaultMsg:msg;
                        break;
                    }
                }
            }
            if (error) {break;}
        }

        var controlGroup = el.parents('.form-group');
        controlGroup.removeClass('has-error has-success');
        controlGroup.addClass(error==false?'has-success':'has-error');
        controlGroup.find("#valierr").remove();
        el.parent().after('<span class="help-block" id="valierr">' + errorMsg +'</span>');
        return !error;
    };



    // 表单验证方法
    var validationForm = function(obj) {

        //1. 提交时验证 
        $(obj).submit(function() { 
            if (formState) { // 重复提交则返回
                return false;
            }
            formState = true;
            var validationError = false; 

            //取出验证的
            $('input, textarea', this).each(function () {
                var el = $(this), 
                   //check-type="required chinese"  //支持多个，以空格隔开。
                    valid = (el.attr('check-type')==undefined)?null:el.attr('check-type').split(' '); 
                if (valid != null && valid.length > 0) {
                    if (!validateField(this, valid)) {
                        if (wFocus == false) {
                            scrollTo(0, el[0].offsetTop - 50);
                            wFocus = true;
                        }
                        validationError = true;
                    }
                }
            });

            wFocus = false;
            fieldState = true;

            // if (validationError) {
            //     formState = false; 

            //     $('input, textarea').each(function() {
            //         var el = $(this), 
            //             valid = (el.attr('check-type')==undefined)?null:el.attr('check-type').split(' ');
                    
            //         if (valid != null && valid.length > 0) {
            //             el.on('focus',function() { // 获取焦点时

            //             });

            //             el.on('blur',function() { // 失去焦点时
            //                 validateField(this, valid);
            //             });
            //         }
            //     });
                
            //     return false;
            // }

            return !validationError;
        });

        $(obj).find('input, textarea').each(function(){
            var el = $(this);
            el.on('blur',function(){ // 失去焦点时
                valid = (el.attr('check-type')==undefined)?null:el.attr('check-type').split(' ');
                if (valid){
                    validateField(this, valid);
                }
            });
        });
    };
}(window.jQuery);