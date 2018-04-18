(function($) {
    var token = Func.getUrlParams('access_token'),
        company = Func.getUrlParams('company_id');

    if (company == "84xdgl07yz09") {
        $("#company-logo").removeClass("hidden");
    }

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
    var clickReg = function() {
        var pwdcheck = /^[A-Za-z0-9]+$/;

        if ($("#newpwd").val().length > 20 || $("#newpwd").val().length < 6) {
            layer.msg("Passwords must be 6 to 20 characters long, please enter again.");
        } else if ($("#newpwd").val() == "") {
            layer.msg("Please enter the password!");
        } else if (!pwdcheck.test($("#newpwd").val())) {
            layer.msg("Passwords can only contain numbers or letters.");
        } else if ($("#newpwd").val() != $("#repwd").val()) {
            layer.msg("Passwords do not match");
        } else {
            $("#c-confirm").off();
            $("#c-confirm").css("background-color", "gray");
            showLoading();
            $.ajax({
                url: Func.path + "/zvcloud/client/resetPasswordForUserByEmail",
                type: 'POST',
                dataType: 'json',
                contentType: "application/json",
                data: {
                    access_token: token,
                    password: $("#newpwd").val()
                }
            }).done(function(msg) {
                var code = msg.code;
                if (code == 1000) {
                    if (company == "84xdgl07yz09") {
                        layer.msg("Reset password success, will return to the AtHome");
                        setTimeout(function() {
                            window.location.href = "http://www.ichano.com";
                        }, 2000)
                    } else {
                        layer.msg("Reset password success, will return to the homepage");
                        setTimeout(function() {
                            window.close();
                        }, 2000)
                    }

                } else {
                    $("#c-confirm").on("click", clickReg);
                    $("#c-confirm").css("background-color", "#f16161");
                    hideLoading();
                    layer.msg("Reset link is invalid , Please try again!");
                }
            })
        }
    };

    $("#c-confirm").on("click", clickReg);

    function showLoading() {
        $(".loading").css("height", $(document).height());
        $(".loading").css("width", $(document).width());
        $("#loading").css("top", $(document).scrollTop() + $(window).height() * 0.5 - 18);
        $(".loading").removeClass("hidden");
    }

    function hideLoading() {
        $(".loading").addClass("hidden");
    }
}(jQuery))
