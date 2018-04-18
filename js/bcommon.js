/*公用JS*/
(function(win, $) {
    win.Util = {
        getUrlParams: function(prop) {
            var params = {},
                query = win.location.search.substring(1),
                arr = query.split('&'),
                rt;

            $.each(arr, function(i, item) {
                var tmp = item.split('='),
                    key = tmp[0],
                    val = decodeURIComponent(tmp[1]);

                if (typeof params[key] == 'undefined') {
                    params[key] = val;
                } else if (typeof params[key] == 'string') {
                    params[key] = [params[key], val];
                } else {
                    params[key].push(val);
                }
            });

            rt = prop ? params[prop] : params;

            return rt;
        },

        // 去除html标签中的换行符和空格
        clearHtml: function(html) {
            return html.replace(/(\r\n|\n|\r)/g, "")
                .replace(/[\t ]+\</g, "<")
                .replace(/\>[\t ]+\</g, "><")
                .replace(/\>[\t ]+$/g, ">");
        }
    };
}(this, jQuery));

(function($) {
    //判断浏览器是否支持 placeholder属性  
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
                            $(this).focus(function() {
                                if ($(this).val() == $(this).attr("placeholder")) 
                                    $(this).val("");
                            });
                            $(this).blur(function() {
                                if ($(this).val() == "") 
                                    $(this).val($(this).attr("placeholder"));
                            });
                        }
                    });
                //对password框的特殊处理1.创建一个text框 2获取焦点和失去焦点的时候切换  
                var pwdField = $("input[type=password]");
                var pwdVal = pwdField.attr('placeholder');
                pwdField.after('<input id="pwdPlaceholder" type="text" value=' + pwdVal + ' autocomplete="off" />');
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


    // 顶部用户信息加载
    var userNameTemp = $("#user-name-templ").html(),
        $userNameCon = $("#user-name"),
        token = $.cookie("token");

    var getUserName = function() {
        $.ajax({
            url: path + "/developer/developer/checkLogin",
            type: 'POST',
            dataType: 'json',
            beforeSend: function(request) {
                request.setRequestHeader("auth_token", token);
            },
            success: function(data) {
                if (data.code == 1000) {
                    var html = [];
                    html.push(Mustache.render(userNameTemp, data.data));
                    $userNameCon.html(html.join(''));
                } else {
                    window.location.href = "index.html"
                }
            }
        })
    };

    getUserName();

    // 注销事件
    $("#login-out").on("click", function() {

        $.cookie('token', '', { expires: -1 });
        $.cookie('companyId', '', { expires: -1 });
        $.cookie('phone', '', { expires: -1 });
        window.location.href = "index.html";

    });

    // 首页
    $("#home").on("click", function() {
        window.location.href = "index.html";
    });

    // 左侧跳转 
    $(".left-item").on("click", function() {
        if ($(this).data("id") == "acc") {
            location.href = "account-info.html"
        } else if ($(this).data("id") == "app") {
            location.href = "app-control.html"
        }
    });
}(jQuery));
