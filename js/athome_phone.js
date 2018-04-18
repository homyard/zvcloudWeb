(function($) {

    var uuid = UUID.create().toString(),
        referee = Func.getUrlParams('m'),
        language = Func.getUrlParams('language');

    function removeAllSpace(str) {
        return str.replace(/\s+/g, "");
    }

    $("#img-yzm").attr("src", Func.path + "/zvcloud/captcha/img?uuid=" + uuid);

    $("#img-yzm").on("click", function() {
        $("#img-yzm").attr("src", Func.path + "/zvcloud/captcha/img?uuid=" + uuid);
    });

    var $selects = $("#phone_sel");


    // $selects.easyDropDown({
    //     cutOff: 10,
    //     wrapperClass: 'dropdown',
    //     onChange: function(selected) {
    //         // query.status = $(this).val();
    //     }
    // });

    $("#c-confirm").on("click", confirm);

    function confirm() {
        $("#c-confirm").attr("style", "background-color:#b2b2b2");
        $("#c-confirm").unbind();
        var phone = removeAllSpace($("#phone").val()),
            phonecheck = /^[1][3-8]\d{9}$|^([6|9])\d{7}$|^[0][9]\d{8}$|^[6]([8|6])\d{5}$/,
            zone = $("#phone_sel").val(),
            yzm = removeAllSpace($("#yzm").val());

        console.log(zone + " " + phone + " " + yzm + " ");
        if (!phonecheck.test(phone)) {
            layer.msg("请输入正确格式的手机号");
            $("#c-confirm").on("click", confirm);
            $("#c-confirm").attr("style", "background-color:#ff4838");
            $("#phone").focus();
        } else if (yzm == "") {
            layer.msg("请输入验证码");
            $("#c-confirm").on("click", confirm);
            $("#c-confirm").attr("style", "background-color:#ff4838");
            $("#yzm").focus();
        } else {
            $.ajax({
                url: Func.path + "/zvcloud/client/recommandRegisterByMobilePhone",
                type: "POST",
                dataType: "json",
                contentType: "application/json",
                data: {
                    mobile_phone: phone,
                    language: language,
                    zone: zone,
                    captcha: yzm,
                    uuid: uuid,
                    referee: referee,
                },
            }).done(function(data) {
                if (data.code == 1000) {
                    var temp = $("#success").html();
                    var t = temp.replace("{{phone}}", " " + phone + " ");
                    $("#m-con").empty().append(t);
                    initdl();
                } else {
                    $("#c-confirm").on("click", confirm);
                    $("#c-confirm").attr("style", "background-color:#ff4838");
                    $("#img-yzm").attr("src", Func.path + "/zvcloud/captcha/img?uuid=" + uuid);
                    if (data.code == 2107) {
                        // layer.msg("账号已经存在！");
                        var temp = $("#old").html();
                        // var t = temp.replace("{{phone}}", " " + phone + " ");
                        $("#m-con").empty().append(temp);
                        $("#reset").on("click", function() {
                            window.location.reload();
                        })
                    } else if (data.code == 5005) {
                        layer.msg("验证码有误！");
                        $("#yzm").focus();
                    } else if (data.code == 2207) {
                        layer.msg("邀请人不存在！");
                    } else {
                        layer.msg(data.desc);
                    }
                }
            });
        }
    }

    function initdl() {
        if (!device.ios()) {
            $(".ad").removeClass("hidden");
            $(".dl").attr("href", "http://a.app.qq.com/o/simple.jsp?pkgname=com.ichano.athome.camera");
        } else {
            $(".dl").attr("href", "http://itunes.apple.com/cn/app/id527546011");
        }
    }

    initdl();

}(jQuery))
