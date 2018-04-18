(function($) {
    $(".pager-item").on("click", function() {
        $(".pager-item").removeClass("cur");
        $(this).addClass("cur");
        $(".block").addClass("hidden");
        if ($(this).html() == 1) {
            $("#pager1").removeClass("hidden");
            $("body").animate({ scrollTop: 0 });
        } else if ($(this).html() == 2) {
            $("#pager2").removeClass("hidden");
            $("body").animate({ scrollTop: 0 });
        } else if ($(this).html() == 3) {
            $("#pager3").removeClass("hidden");
            $("body").animate({ scrollTop: 0 });
        }
    })
}(jQuery));
