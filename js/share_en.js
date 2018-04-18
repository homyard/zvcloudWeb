(function($) {
    var referee = Func.getUrlParams('m'),
        version =  Date.parse(new Date()),
        language = Func.getUrlParams('language');
    
    var str = window.location.href,
        substr = "account2.zvcloud.com";

    if (str.indexOf(substr) >= 0) {
        $("body").removeClass("hidden");
        $("#at-reg").attr("href", "athome_reg_en.html?m=" + referee + "&language=" + language + "&version=" + version);
    } else {
    	window.location.href = "athome_reg_phone.html?m=" + referee + "&language=" + language + "&version=" + version;
    }
}(jQuery));
