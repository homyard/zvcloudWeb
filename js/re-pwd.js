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
                $.each(pwdField, function() {
                    var val = $(this).attr('placeholder');
                    $(this).after('<input class="pwdPlaceholder info-input" type="text" value=' + pwdVal + ' autocomplete="off" />');
                });

                var pwdPlaceholder = $('.pwdPlaceholder');
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

    var uuid = UUID.create().toString();

    $("#img-code").attr("src", Func.path + "/zvcloud/captcha/img?uuid=" + uuid);

    $("#img-code").on("click", function() {
        $("#img-code").attr("src", Func.path + "/zvcloud/captcha/img?uuid=" + uuid);
    });

    // 发送按钮
    $("#send").on("click", function() {
        if ($("#send").html() == "发送验证码") {
            // ..此处写发送方法
            var phone = $("#phone").val(),
                phonecheck = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;

            if (!phonecheck.test(phone)) {
                layer.msg("请先输入正确的手机号");
                return 0;
            } else if ($("#img-code-text").val() == "") {
                layer.msg("请输入图片验证码");
            } else {
                $.ajax({
                    url: Func.path + "/zvcloud/mobile/sendVerifyCode",
                    dataType: 'json',
                    type: 'POST',
                    contentType: "application/json",
                    data: {
                        mobile_phone: phone,
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

    $("#p-confirm").on("click", function() {
        var phone = $("#phone").val(),
            verifcode = $("#verif").val(),
            phonecheck = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;

        if (!phonecheck.test(phone)) {
            layer.msg("请输入正确的手机号");
        } else if (verifcode == "") {
            layer.msg("请输入验证码");
        } else {
            var query = {
                mobile_phone: phone,
                verify_code: verifcode
            }
            
            Func.checkVerifyCode(query);
        }
    });

    $("#m-confirm").on("click", function() {
        var mail = $("#mail").val(),
            mailcheck = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        if (!mailcheck.test(mail)) {
            layer.msg("请输入正确格式的邮箱");
        } else {
            var query = {
                email: mail
            }

            Func.sendEmailForReset(query);
        }
    });
}(jQuery))
