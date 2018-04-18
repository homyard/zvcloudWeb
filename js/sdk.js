(function($, win) {
	// 获取tab名称
    var cname = "#" + Func.getUrlParams('name');

    // 激活tab
    if (Func.getUrlParams('name')) {
        $(cname).click();
    }

    $("#qq").on("click",function(){
        window.open ( "http://shang.qq.com/wpa/qunwpa?idkey=fe7dce50a00c8501751e92f6d44dfee6ac5c7c75b623c2fa92a2dba180133059")
    });
}(jQuery, this))
