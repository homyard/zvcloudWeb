(function($) {
    function isPlaceholder() {
        var input = document.createElement('input');
        return 'placeholder' in input;
    }

    if (!isPlaceholder()) { //不支持placeholder 用jquery来完成  
        $(document).ready(function() {
            if (!isPlaceholder()) {
                $("input").not("input[type='password']").each( //把input绑定事件 排除password框  
                    function() {
                        if ($(this).val() == "" && $(this).attr("placeholder") != "") {
                            $(this).val($(this).attr("placeholder"));
                        }

                        $(this).focus(function() {
                            if ($(this).val() == $(this).attr("placeholder"))
                                $(this).val("");
                        });
                        $(this).blur(function() {
                            if ($(this).val() == "")
                                $(this).val($(this).attr("placeholder"));
                        });
                    });
                //对password框的特殊处理1.创建一个text框 2获取焦点和失去焦点的时候切换  
                var pwdField = $("input[type=password]");
                var pwdVal = pwdField.attr('placeholder');
                pwdField.after('<input id="pwdPlaceholder" class="lo-input" type="text" value=' + pwdVal + ' autocomplete="off" />');
                var pwdPlaceholder = $('#pwdPlaceholder');
                pwdPlaceholder.show();
                pwdField.hide();

                pwdPlaceholder.focus(function() {
                    pwdPlaceholder.hide();
                    pwdField.show();
                    pwdField.focus();
                });

                pwdField.blur(function() {
                    if (pwdField.val() == '') {
                        pwdPlaceholder.show();
                        pwdField.hide();
                    }
                });
            }
        });
    };

    $("#re-pwd").on("click", function() {
        parent.location.href = "re-pwd.html"
    });

    $("#c-btn").on("click", function() {
        parent.layer.closeAll();
    });

    $(".lo-reg").on("click", function() {
        parent.location.href = "register.html"
    });

    $("#lo-user").focus();
    $("#l-btn").on("click", function() {
        var loginQuery = {
            mobile_phone: "",
            company_name: "",
            user_name: "",
            email: "",
            password: "",
            type: ""
        }
        var userName = $("#lo-user").val(), // 用户名
            userPwd = $("#lo-pwd").val(), // 密码
            type; // 用户类型

        var phone = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/, // 判断是否为手机号
            mailcheck = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        if (userName == "") {
            layer.msg("用户名不得为空");
        } else if (userPwd == "") {
            layer.msg("密码不得为空");
        } else {
            // 判断用户类型
            if (phone.test(userName)) {
                loginQuery.type = 2;
                loginQuery.mobile_phone = userName;
            } else if(mailcheck.test(userName)) {
                loginQuery.type = 1;
                loginQuery.email = userName;
            } else {
                loginQuery.type = 5;
                loginQuery.user_name = userName;
            };

            loginQuery.password = userPwd;
            // 发送登陆请求
            Func.login(loginQuery);
            
        }
    });

    document.onkeydown = function(event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode == 27) { // 按 Esc 
            //要做的事情
        }
        if (e && e.keyCode == 113) { // 按 F2 
            //要做的事情
        }
        if (e && e.keyCode == 13) { // enter 键
            $("#l-btn").click();
            return false;
        }
    };
}(jQuery));
