/**
 *	众云视频管理后台 - 产品列表
 *	Author: zhangjungu
 *	Date: 2016.12
 */


(function($){

	// 定义产品列表请求参数
	var productListQuery = {
		access_token: $.cookie("access_token"),
		page_index: 1,
		page_size: 5,
	}

	// 定义容器
	var productListTemp = $("#productList-templ").html(),
        $productListCon = $("#productList-con");
	
	// 请求产品列表
	Func.queryProductListInfo(productListQuery,productListTemp,$productListCon);


	// 绑定创建产品方法
	$("#create").on("click", function() {
        top.layer.open({
            type: 2,
            title: "创建产品",
            offset: '150px',
            area: ['820px', '500px'], //宽高
            content: 'create-app.html'
        });
    });

    // 绑定管理页面跳转方法
    $("#productList-con").on("click",".op-btn",function(){
    	$.cookie('product_id', $(this).data("id"));
 		top.location.href = "productManage.html"
    });

}(jQuery))