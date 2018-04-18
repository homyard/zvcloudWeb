(function($) {
    var query = {
        access_token: $.cookie("access_token"),
        product_id: $.cookie("product_id"),
        service: Func.getUrlParams("type"),
        os_type: ""
    }

    if (query.service == 0) {
        if ($.cookie('avsList')) {
            var List = [];
            List = $.cookie('avsList').split(",");

            $.each($(".app-item"), function() {
                for (i = 0; i < List.length; i++) {
                    if ($(this).data("id") == List[i]) {
                        $(this).removeClass("app-item").addClass("app-un");
                    }
                }
            })
        }
    } else if (query.service == 1) {
        console.log($.cookie('clientList'));

        if ($.cookie('clientList')) {
            var List = [];
            List = $.cookie("clientList");

            console.log($.cookie("clientList"))
            $.each($(".app-item"), function() {
                var List = $.cookie("clientList");
                for (i = 0; i < List.length; i++) {
                    if ($(this).data("id") == List[i]) {
                        $(this).removeClass("app-item").addClass("app-un");
                    }
                }
            })
        }
    }


    $(".app-item").on("click", function() {

        query.os_type = $(this).data("id");
        $('.app-item').unbind("click");
        Func.addApp(query);
    });

}(jQuery))
