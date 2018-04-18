SrcBoot.output((function() {
    var arr = [];

    //IE9+使用2.2.3高版本
    arr.push('js/lib/jquery/' + (document.addEventListener ? 'jquery-2.2.3.min.js' : 'jquery-1.11.0.min.js'));

    //通用JS
    arr = arr.concat([
        'plugins/mustache.js',
        'plugins/layer/layer.js',
        'plugins/jquery.cookie.js'
    ]);

   /*
   * 非前后端分离删除以下json3和mockjax
   */
   
    // 对JSON API进行支持(IE7)
    // if (!window.JSON) {
    //     arr.push('js/lib/json3.min.js');
    // }

    // // 非调试阶段去掉mockjs支持
    // if (SrcBoot.debug) {
    //     arr.push('js/lib/mock/jquery.mockjax.min.js');
    // }

    return arr;
}()));
