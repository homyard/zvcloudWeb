/**
 *	众云视频管理后台 - 产品列表
 *	Author: zhangjungu
 *	Date: 2016.12
 */

(function($) {

    // 定义用户信息请求参数
    var accountQuery = {
        access_token: $.cookie("access_token")
    }

    // 定义容器
    var accountTemp = $("#account-templ").html(),
        $accountCon = $("#account-con");

    // 请求产品列表
    Func.queryCompanyInfo(accountQuery, accountTemp, $accountCon);

    // 修改密码
    $("#change-pwd").on("click", function() {
        top.layer.open({
            type: 2,
            area: ['560px', '420px'], //宽高
            content: 'cpwd.html'
        });
    });

    $("#change-info").on("click", function() {
        $(".edit-item").find("p").addClass("hidden");
        $(".edit-item").find("input").removeClass("hidden");
        $(".btn-box").removeClass("hidden");
    });

    // 信息修改
    $("#account-con").on("click", "#confirm", function() {
        var updateCompanyQuery = {
            access_token: $.cookie("access_token"),
            company_address: $("#company_address").val(),
            company_name: $("#company_name").val(),
            company_website: $("#company_website").val(),
            contact_person: $("#contact_person").val()
        }

        Func.updateCompanyInfo(updateCompanyQuery);

    }).on("click", "#cancel", function() {
    	$(".edit-item").find("p").removeClass("hidden");
        $(".edit-item").find("input").addClass("hidden");
        $(".btn-box").addClass("hidden");

    	$("#company_address").val($("#company_address").parent().find("p").html());
    	$("#company_name").val($("#company_name").parent().find("p").html());
    	$("#company_website").val($("#company_website").parent().find("p").html());
    	$("#contact_person").val($("#contact_person").parent().find("p").html());
    })

}(jQuery))
