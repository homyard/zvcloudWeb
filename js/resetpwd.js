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
                $.each(pwdField, function(index) {
                    var val = $(this).attr('placeholder');
                    $(this).after('<input class="pwdPlaceholder info-input" type="text" value=' + val + ' autocomplete="off" index="' + index + '"/>');
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
    if (navigator.userAgent.toLowerCase().indexOf("chrome") >= 0) {
        $('input:-webkit-autofill').each(function() {
            var text = $(this).val();
            var id = $(this).attr('id');
            $(this).after(this.outerHTML).remove();
            $('input[id=' + id + ']').val(text);
        });
    };

    var token = Func.getUrlParams('access_token');

    if (token) {
        console.log(token);
        $("#c-confirm").on("click", function() {

            var pwdcheck = /^[A-Za-z0-9]+$/;

            if ($("#newpwd").val().length > 20 || $("#newpwd").val().length < 6) {
                layer.msg("密码长度为6 ~ 20位,请重新输入");
            } else if ($("#newpwd").val() == "") {
                layer.msg("请输入密码");
            } else if (!pwdcheck.test($("#newpwd").val())) {
                layer.msg("密码只能由数字或字母组成");
            } else if ($("#newpwd").val() != $("#repwd").val()) {
                layer.msg("两次输入密码不一致");
            } else {
                $.ajax({
                    url: Func.path + "/zvcloud/company/resetPasswordByEmail",
                    type: 'POST',
                    dataType: 'json',
                    contentType: "application/json",
                    beforeSend: function(request) {
                        request.setRequestHeader("access_token", token);
                    },
                    data: {
                        password: $("#newpwd").val()
                    }
                }).done(function(data) {
                    if (data.code == 1000) {
                        layer.msg("修改成功");

                        setTimeout(function() {

                            top.location.href = "index.html";

                        }, 1000);
                    } else {
                        Func.errorMsg(data.code); // 返回错误信息
                    }
                }).fail(function() {
                    layer.msg("未知的错误");
                })
            }
        })
    } else {
        var phone = Func.getUrlParams('phone');

        $("#c-confirm").on("click", function() {
            if ($("#newpwd").val().length > 20 || $("#newpwd").val().length < 6) {
                layer.msg("密码长度为6 ~ 20位,请重新输入");
            } else if ($("#newpwd").val() == "") {
                layer.msg("请输入密码");
            } else if ($("#newpwd").val() != $("#repwd").val()) {
                layer.msg("两次输入密码不一致");
            } else {
                var query = {
                    flag: 1,
                    mobile_phone: phone,
                    password: $("#newpwd").val(),
                    verify_code: "has_checked_verify_code"
                }

                console.log(query);
                Func.changePwdByPhone(query);
            }
        })
    }
}(jQuery));
