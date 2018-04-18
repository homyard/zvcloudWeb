// 后台 - 注册页交互
// author: 张智俊;

(function($) {

    // 发送验证码参数配置
    var verifyQuery = {
        mobile_phone: "",
        verify_type: 0,
    }

    // 注册参数配置
    var regQuery = {
        mobile_phone: "",
        company_name: "",
        email: "",
        channel: "",
        password: "",
        verify_code: "",
        country: "",
        province: "",
        city: ""
    }
    var uuid = UUID.create().toString();

    $("#img-code").attr("src", Func.path + "/zvcloud/captcha/img?uuid=" + uuid);

    $("#img-code").on("click", function() {
        $("#img-code").attr("src", Func.path + "/zvcloud/captcha/img?uuid=" + uuid);
    });

    // 模拟placeholder
    function isPlaceholder() {
        var input = document.createElement('input');
        return 'placeholder' in input;
    }

    function bindplace() {
        if (!isPlaceholder()) { //不支持placeholder 用jquery来完成  
            $("input").not("input[type='password']").each(
                //把input绑定事件 排除password框  
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
            var val = pwdField.attr('placeholder');
            pwdField.after('<input class="pwdPlaceholder info-input" type="text" value=' + val + ' autocomplete="off" />');

            var pwdPlaceholder = $(".pwdPlaceholder");
            pwdPlaceholder.addClass("hidden");

            if (pwdField.val() == "") {
                pwdField.addClass("hidden");
                pwdPlaceholder.removeClass("hidden");
            }

            pwdPlaceholder.focus(function() {
                $(this).addClass("hidden");
                pwdField.removeClass("hidden").focus();
            });

            pwdField.blur(function() {
                if ($(this).val() == "") {
                    $(this).addClass("hidden");
                    pwdPlaceholder.removeClass("hidden");
                }
            });
        };
        $(".pwd-input").blur(function() {
            if ($(this).val() == "") {
                $(".pwd-error").removeClass("hidden");
            } else {
                $(".pwd-error").addClass("hidden");
            }
        });
    }

    bindplace();


    // 获得注册地址
    $.getScript('http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js', function(_result) {
        if (remote_ip_info.ret == '1') {

            regQuery.country = remote_ip_info.country;
            regQuery.province = remote_ip_info.province;
            regQuery.city = remote_ip_info.city;

        } else {
            console.log('没有找到匹配的IP地址信息！');
        }
    });

    // select 初始化
    regQuery.channel = "互联网搜索";

    $("#select").selectpick({
        container: "#select-box",
        height: 55,
        width: 350,
        disabled: false,
        onSelect: function(value, text) {
            regQuery.channel = text.replace(/\ +/g, "").replace(/[\r\n]/g, "");
        },
    });


    // 若用户处于登陆状态,则跳回首页
    var token = $.cookie("token");

    if (token != null) {
        window.location.href = "index.html"
    }

    // 绑定显示密码事件
    $("#eyes").on("click", function() {
        if ($("#pwd").attr("type") == "text") {
            var val = $("#pwd").val();
            $("#pwdbox").html("<input type='password' placeholder='密码' class='info-input' autocomplete='new-password' id='pwd' data-id='0' value='" + val + "'>");
            bindplace();
        } else {
            var val = $("#pwd").val();
            $("#pwdbox").html("<input type='text' placeholder='密码' class='info-input' autocomplete='new-password' id='pwd' data-id='0' value='" + val + "'>");
            bindplace();
        }
    });

    // 控制错误信息显示隐藏
    $(".info-input").blur(function() {
        if ($(this).val() == "") {
            $(this).parent().parent().find(".error-info").removeClass("hidden");
        } else {
            $(this).parent().parent().find(".error-info").addClass("hidden");
        }
    });


    $("#phone").blur(function() {
        var phone = $("#phone").val(),
            phonecheck = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;

        if (!phonecheck.test(phone)) {
            $(this).parent().parent().find(".error-info").removeClass("hidden");
        }
    });

    $("#mail").blur(function() {
        var mail = $("#mail").val(),
            mailcheck = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        if (!mailcheck.test(mail)) {
            $(this).parent().parent().find(".error-info").removeClass("hidden");
        }
    });

    // 发送按钮
    $("#send").on("click", function() {
        if ($("#send").html() == "发送验证码") {
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
                        verify_type: 0,
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

    // 已有帐号登陆

    $("#lo").on("click", function() {
        $("#lo-btn").click();
    });

    // 注册
    var clickReg = function() {

        regQuery.mobile_phone = $("#phone").val();
        regQuery.password = $("#pwd").val();
        regQuery.company_name = $("#username").val();
        regQuery.verify_code = $("#verif").val();
        regQuery.email = $("#mail").val();

        var checkb = $("#checkb").is(':checked'),
            phonecheck = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/,
            mailcheck = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
            pwdcheck = /^[A-Za-z0-9]+$/;

        if (regQuery.mobile_phone == "" || !phonecheck.test(regQuery.mobile_phone)) {
            layer.msg("请输入正确的手机号");
        } else if (regQuery.email == "" || !mailcheck.test(regQuery.email)) {
            layer.msg("请输入正确的邮箱");
        } else if (regQuery.password == "") {
            layer.msg("请输入密码");
        } else if (regQuery.password.length < 6 || regQuery.password.length > 20) {
            layer.msg("密码长度为6 ~ 20位,请重新输入");
        } else if (!pwdcheck.test(regQuery.password)) {
            layer.msg("密码只能由数字或字母组成");
        } else if (regQuery.company_name == "") {
            layer.msg("请输入公司名称");
        } else if (regQuery.verify_code == "") {
            layer.msg("验证码不得为空");
        } else if (!checkb) {
            layer.msg("你必须同意众云服务条款");
        } else {
            $(".reg-btn").off();
            $(".reg-btn").css("background-color", "gray");
            showLoading();
            var code = Func.register(regQuery);
            if (code != 1000) {
                $(".reg-btn").on("click", clickReg);
                $(".reg-btn").css("background-color", "#f16161");
                hideLoading();
            }
        }
    }

    $(".reg-btn").on("click", clickReg);

    function showLoading() {
        $(".loading").css("height", $(document).height());
        $(".loading").css("width", $(document).width());
        $("#loading").css("top", $(document).scrollTop() + $(window).height() * 0.5 - 18);
        $(".loading").removeClass("hidden");
    }

    function hideLoading() {
        $(".loading").addClass("hidden");
    }


}(jQuery));
