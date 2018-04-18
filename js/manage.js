(function($){
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

    // 左侧页面切换

    $(".left-item").on("click",function(){
    	var link = $(this).data("id");
    	$(".left-item").removeClass("cur");
    	$(this).addClass("cur");
    	$(".r-frame").attr("src",link + "?v=" + Date.parse(new Date()));
    });
    
    $("#home").on("click",function(){
        top.location.href = "index.html"
    });
}(jQuery));