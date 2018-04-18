/**
 * Created by ichano-pc on 2016/6/16.
 */


/*轮播*/
$(function() {
    var bannerSlider = new Slider($('#banner_tabs'), {
        time: 5000,
        delay: 400,
        event: 'hover',
        auto: true,
        mode: 'fade',
        controller: $('#bannerCtrl'),
        activeControllerCls: 'active'
    });
    $('#banner_tabs .flex-prev').click(function() {
        bannerSlider.prev()
    });
    $('#banner_tabs .flex-next').click(function() {
        bannerSlider.next()
    });
});


$(function() {
    var bannerSlider = new Slider($('#banner_tabs_bottom'), {
        time: 5000,
        delay: 400,
        event: 'hover',
        auto: true,
        mode: 'fade',
        controller: $('#bannerCtrl_bottom'),
        activeControllerCls: 'active'
    });
    $('#banner_tabs_bottom .flex-prev').click(function() {
        bannerSlider.prev();
    });
    $('#banner_tabs_bottom .flex-next').click(function() {
        bannerSlider.next();
    });
});

(function($) {

    $(".solution-a").on("click", function() {
        $("html,body").animate({ scrollTop: $("#solution-block").offset().top }, 1000);
    });

    $(".solve-case-list").on("click", "a", function() {
        var id = "#" + $(this).data("id");
        $(id).click();
        $("html,body").animate({ scrollTop: $("#solution-block").offset().top }, 500);
    });

    $("#join").on("click", function() {
        $("#lo-btn").click();
    });

    $(".news-img").on("mouseover",function(){
        $(this).find(".shadow").removeClass("hidden");
    }).on("mouseout",function(){
        $(this).find(".shadow").addClass("hidden");
    })
}(jQuery))
