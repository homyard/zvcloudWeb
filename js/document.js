// 文档交互

(function($,window) {
    $(".left-title").on("click", function() {
        if (!$(this).hasClass("current")) {
        	$(".left-title").removeClass("current");
        	$(".left-drop").addClass("hidden");
            $(".sub-l-list").addClass("hidden");
            console.log(1);
            $(this).addClass("current");
            $(this).parent().find(".left-drop").removeClass("hidden");
            $(this).parent().find(".left-drop").children(".left-item:eq(0)").click();
        } else {
            $(this).removeClass("current");
            $(this).parent().find(".left-drop").addClass("hidden");
        }
    });

    $(".left-item").bind("click",function(){
        $(".sub-l-list").addClass("hidden");
        $(this).find(".sub-l-list").removeClass("hidden");
    });

    $(".sub-l-item").on("click",function(){
        $(".sub-l-item").removeClass("cur");
        $(this).addClass("cur");
        window.location.href = $(this).data("md");
    });

    $(".doc-tab").on("click",function(){
        var did = $(this).data("target");
        console.log(did);
        var $tardom = $(".doc-con").filter('[data-id="' + did + '"]').find(".left-title:eq(0)").click();
    });
}(jQuery,this));