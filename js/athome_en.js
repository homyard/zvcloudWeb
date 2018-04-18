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
            layer.msg("Please type in a valid email address.");
        } else if (pwd.length > 20 || pwd.length < 6) {
            layer.msg("Password length should be 6~20");
        } else if (!pwdcheck.test(pwd)) {
            layer.msg("Passwords can only be composed of numbers and letters");
        } else if (pwd != repwd) {
            layer.msg("Two times the password is not consistent");
        } else if (yzm == "") {
            layer.msg("please input verification code");
        } else {
            $.ajax({
                url: Func.path + "/zvcloud/client/recommandRegister",
                type: "POST",
                dataType: "json",
                contentType: "application/json",
                data: {
                    account: mail,
                    type: 1,
                    language:2,
                    referee: referee,
                    password: pwd,
                    captcha: yzm,
                    uuid: uuid
                },
            }).done(function(data) {
                if (data.code == 1000) {
                    layer.confirm('Registration successful!', {
                        btn: ['confirm'], //按钮
                    }, function() {
                        top.location.href = "success_en.html";
                    });
                } else {
                    $("#img-yzm").attr("src", Func.path + "/zvcloud/captcha/img?uuid=" + uuid)
                    layer.msg(data.desc)
                }
            })
        }
    });
}(jQuery))