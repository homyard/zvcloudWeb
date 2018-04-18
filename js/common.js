(function($) {
    // TAB切换,依赖于tabview.js组件
    $(".tabview").each(function(index, el) {
        new TabView({
            activeIndex: 0,
            dom: el,
            triggerEvent: 'click',
            activeCls: 'cur',
        });
    });

    // 解决方案
    $("body").on("click", ".solution", function() {
        layer.msg("敬请期待");
    });

    $("#top").on("click", function() {
        $("html,body").animate({ scrollTop: 0 }, 500);
    });


    // 登录按钮绑定
    $("#lo-btn").on("click", function() {
        layer.open({
            type: 2,
            title: false,
            skin: 'layui-layer-rim', //加上边框
            area: ['520px', '340px'], //宽高
            content: 'login.html'
        });

        $("#c-btn").on("click", function() {
            layer.close(index);
        });
    });
    if ($.cookie("access_token")) {
        var query = {
            access_token: $.cookie("access_token"),
            company_id: $.cookie("company_id"),
        }

        var userNameTemp = $("#user-templ").html(),
            $userNameCon = $("#user-con");

        // 用户信息加载
        Func.checkLogin(query, userNameTemp, $userNameCon);
    }


}(jQuery));
