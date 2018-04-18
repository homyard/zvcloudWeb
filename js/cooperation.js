// 合作伙伴页面 交互

(function($, win) {
	// 获取tab名称
    var cname = "#" + Func.getUrlParams('name');

    // 激活tab
    if (Func.getUrlParams('name')) {
        $(cname).click();
    }
}(jQuery, this))
