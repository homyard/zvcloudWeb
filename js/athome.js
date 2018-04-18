(function($) {

    var uuid = UUID.create().toString(),
        referee = Func.getUrlParams('m');

    $("#img-yzm").attr("src", Func.path + "/zvcloud/captcha/img?uuid=" + uuid);

    $("#img-yzm").on("click", function() {
        $("#img-yzm").attr("src", Func.path + "/zvcloud/captcha/img?uuid=" + uuid);
    });

    $("#c-confirm").on("click", function() {
        var mail = $("#mail").val(),
            mailcheck = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
            pwd = $("#pwd").val(),
            pwdcheck = /^[A-Za-z0-9]+$/,
            repwd = $("#repwd").val(),
            yzm = $("#yzm").val();

        if (!mailcheck.test(mail)) {
            layer.msg("请输入正确格式的邮箱");
        } else if (pwd.length > 20 || pwd.length < 6) {
            layer.msg("密码长度应当为6~20位");
        } else if (!pwdcheck.test(pwd)) {
            layer.msg("密码仅能由数字和字母构成");
        } else if (pwd != repwd) {
            layer.msg("两次输入的密码不一致");
        } else if (yzm == "") {
            layer.msg("请输入验证码");
        } else {
            $.ajax({
                url: Func.path + "/zvcloud/client/recommandRegister",
                type: "POST",
                dataType: "json",
                contentType: "application/json",
                data: {
                    account: mail,
                    type: 1,
                    language: 1,
                    referee: referee,
                    password: pwd,
                    captcha: yzm,
                    uuid: uuid
                },
            }).done(function(data) {
                if (data.code == 1000) {
                    layer.confirm('注册成功!', {
                        btn: ['确定'],    //按钮
                    }, function() {
                        top.location.href = "success.html";
                    });
                } else {
                    $("#img-yzm").attr("src", Func.path + "/zvcloud/captcha/img?uuid=" + uuid);
                    if (data.code == 2106) {
                        layer.msg("账号已经存在！");
                    } else if (data.code == 5005) {
                        layer.msg("验证码有误！");
                    } else {
                        layer.msg(data.desc);
                    }
                }
            });
        }
    });
}(jQuery))
