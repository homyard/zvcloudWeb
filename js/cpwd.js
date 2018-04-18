(function(win, $) {

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
                $.each(pwdField, function(index) {
                    var val = $(this).attr('placeholder');
                    $(this).after('<input class="pwdPlaceholder change-input" type="text" value=' + val + ' autocomplete="off" index="' + index + '"/>');
                });

                var pwdPlaceholder = $(".pwdPlaceholder");
                pwdPlaceholder.removeClass("hidden");
                pwdField.addClass("hidden");

                pwdPlaceholder.focus(function() {
                    $(this).addClass("hidden");
                    var ind = $(this).attr("index");
                    $.each(pwdField, function(index) {
                        if (index == ind) {
                            $(this).removeClass("hidden").focus();
                        }
                    });
                });

                pwdField.blur(function() {
                    if ($(this).val() == "") {
                        $(this).addClass("hidden");
                        var ind = $(this).data("id");
                        console.log(ind);
                        $.each(pwdPlaceholder, function(index) {
                            if (index == ind) {
                                console.log(111);
                                $(this).removeClass("hidden");
                            }
                        })

                    }
                });
            }
        });
    };

    var uuid = UUID.create().toString();

    $("#img-code").attr("src", Func.path + "/zvcloud/captcha/img?uuid=" + uuid);

    $("#img-code").on("click", function() {
        $("#img-code").attr("src", Func.path + "/zvcloud/captcha/img?uuid=" + uuid);
    });


    // 获取验证码
    $("#send").on("click", function() {
        if ($("#send").html() == "获取验证码") {
            if ($("#img-code-text").val() == "") {
                layer.msg("请输入图片验证码");
            } else {
                $.ajax({
                    url: Func.path + "/zvcloud/mobile/sendVerifyCode",
                    dataType: 'json',
                    type: 'POST',
                    contentType: "application/json",
                    data: {
                        mobile_phone: $.cookie("mobile_phone"),
                        verify_type: 1,
                        uuid: uuid,
                        captcha: $("#img-code-text").val()
                    }
                }).done(function(data) {
                    if (data.code == 1000) {
                        layer.msg("发送成功!"); // 发送成功
                        Func.setTime(60);
                    } else {
                        $("#img-code").attr("src", Func.path + "/zvcloud/captcha/img?uuid=" + uuid);
                        Func.errorMsg(data.code); // 返回错误信息
                    }
                }).fail(function() {
                    layer.msg("请求失败,请联系管理员");
                })
            }
        }   
    });

    
    // 提交按钮
    $(".btn-box").on("click", "#confirm", function() {

        var pwdcheck = /^[A-Za-z0-9]+$/;

        if ($("#newpwd").val().length > 20 || $("#newpwd").val().length < 6) {
            layer.msg("密码长度为6 ~ 20位,请重新输入");
        } else if ($("#newpwd").val() == "") {
            layer.msg("请输入密码");
        } else if (!pwdcheck.test($("#newpwd").val())) {
            layer.msg("密码只能由数字或字母组成");
        } else if ($("#newpwd").val() != $("#repwd").val()) {
            layer.msg("两次输入密码不一致");
        } else if ($("#yzm").val() == "") {
            layer.msg("请输入验证码");
        } else {
            var resetQuery = {
                mobile_phone: $.cookie("mobile_phone"),
                password: $("#newpwd").val(),
                verify_code: $("#yzm").val()
            }

            Func.changePwdByPhone(resetQuery);
        }

    }).on("click", "#cancel", function() {
        var index = top.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        top.layer.close(index); //再执行关闭
    });

}(this, jQuery))
