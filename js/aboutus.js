(function($, win) {
	// 获取tab名称
    var cname = "#" + Func.getUrlParams('m');

    // 激活tab
    if (Func.getUrlParams('m')) {
        $(cname).click();
    }
}(jQuery, this))