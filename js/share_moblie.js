(function($){
	var referee = Util.getUrlParams('m'),
		language = Util.getUrlParams('language');

	if(language != 1) {
		window.location.href = "share_moblie_en.html?m=" + referee;
	} else {
		$("body").removeClass("hidden");
	}
	
	$("#at-reg").attr("href","athome_reg_moblie.html?m=" + referee);
}(jQuery));