(function($) {

    var token = $.cookie("token");

    var mobilePhone = "";

    var uuid = UUID.create().toString();

    $("#img-code").attr("src", Func.path + "/zvcloud/captcha/img?uuid=" + uuid);

    $("#img-code").on("click", function() {
        $("#img-code").attr("src", Func.path + "/zvcloud/captcha/img?uuid=" + uuid);
    });

    // 绑定注销事件
    $("#login-out").on("click", function() {
        $.cookie('access_token', '', { expires: -1 });
        $.cookie('company_id', '', { expires: -1 });
        $.cookie('company_key', '', { expires: -1 });
        $.cookie('product_id', '', { expires: -1 });
        $.cookie('mobile_phone', '', { expires: -1 });
        window.location.href = "index.html"
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
    })



    // 绑定手机号
    $("#confirm").on("click", function() {
        bindQuery = {
            access_token: $.cookie("access_token"),
            mobile_phone: $("#phone").val(),
            verify_code: $("#verif").val(),
        }

        Func.binding(bindQuery);
    });


}(jQuery))