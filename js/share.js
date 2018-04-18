(function($) {
    var referee = Func.getUrlParams('m'),
        language = Func.getUrlParams('language'),
        version =  Date.parse(new Date()),
        country = "";

    if (language != 1) {
        window.location.href = "share_en.html?m=" + referee + "&language=" + language;
    } else {
        var str = window.location.href,
            substr = "account2.zvcloud.com";

        if (str.indexOf(substr) >= 0) {
            $("body").removeClass("hidden");
            $("#at-reg").attr("href", "athome_reg.html?m=" + referee + "&language=" + language + "&version=" + version);
        } else {
            window.location.href = "athome_reg_phone.html?m=" + referee + "&language=" + language + "&version=" + version;
            // $("body").removeClass("hidden");
        }
    }
}(jQuery));
