(function($) {

    if(!$.cookie("access_token")) {
        window.location.href = "index.html"
    }
    
    // 校验登陆状态
    var loginQuery = {
        access_token: $.cookie("access_token"),
        company_id: $.cookie("company_id"),
    }

    var userNameTemp = $("#user-templ").html(),
        $userNameCon = $("#user-con");

    Func.checkLogin(loginQuery, userNameTemp, $userNameCon);


    // 请求产品列表
    var selectQuery = {
        access_token: $.cookie("access_token")
    }

    // 定义容器
    var selectTemp = $("#select-templ").html(),
        $selectCon = $("#select-con");

    Func.queryProductListSelectInfo(selectQuery, selectTemp, $selectCon);

    $("#select-con").selectpick({
        container: "#select-box",
        height: 30,
        width: 150,
        disabled: false,
        onSelect: function(value, text) {
            $.cookie("product_id", value);
            top.$(".r-frame").attr("src", top.$(".r-frame").attr("src"));
        }
    });


    $("#home").on("click",function(){
        top.location.href = "index.html"
    });


    // 左侧页面切换

    $(".left-item").on("click", function() {
        var link = $(this).data("id");
        $(".left-item").removeClass("cur");
        $(this).addClass("cur");
        $(".r-frame").attr("src", link + "?v=" + Date.parse(new Date()));
    });

    $("#back").on("click", function() {
        $.cookie('product_id', '', { expires: -1 });
        top.location.href = "zvcloudManage.html"
    });

    var type = Func.getUrlParams("type");
    if(type == "cloud") {
        $("#cloudDetail").click();
    }

}(jQuery));
