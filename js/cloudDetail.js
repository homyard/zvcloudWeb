/**
 *  众云视频管理后台 - 云存储(产品)
 *  Author: zhangjungu
 *  Date: 2016.12
 */

(function($) {

    // TAB切换,依赖于tabview.js组件
    $(".tabview").each(function(index, el) {
        new TabView({
            activeIndex: 0,
            dom: el,
            triggerEvent: 'click',
            activeCls: 'cur',
        });
    });

    function allCount() {
        var allCountQuery = {
            access_token: $.cookie("access_token"),
            product_id: $.cookie("product_id")
        }

        // 定义容器
        var allCountTemp = $("#allCount-templ").html(),
            $allCountCon = $("#allCount-con");

        Func.queryCloudListInfo(allCountQuery, allCountTemp, $allCountCon);
    }

    function detailCount() {

        var nowDate = new Date();
        var start = new Date(nowDate),
            end = new Date(nowDate);
        end.setDate(nowDate.getDate() - 1);
        start.setDate(nowDate.getDate() - 8);

        var sMonth = "",
            eMonth = "",
            sDays = "",
            eDays = "";


        if (start.getMonth() + 1 < 10) {
            sMonth = "0" + (start.getMonth() + 1);
        } else {
            sMonth = start.getMonth() + 1;
        }

        if (end.getMonth() + 1 < 10) {
            eMonth = "0" + (end.getMonth() + 1);
        } else {
            eMonth = end.getMonth() + 1;
        }

        if (start.getDate() < 10) {
            sDays = "0" + start.getDate();
        } else {
            sDays = start.getDate();
        }

        if (end.getDate() < 10) {
            eDays = "0" + end.getDate();
        } else {
            eDays = end.getDate();
        }

        var startTime = start.getFullYear() + "-" + sMonth + "-" + sDays,
            endTime = end.getFullYear() + "-" + eMonth + "-" + eDays;


        var detailCountQuery = {
            access_token: $.cookie("access_token"),
            product_id: $.cookie("product_id"),
            company_id:"",
            begin_date: startTime,
            end_date: endTime
        }

        // 定义容器
        var detailCountTemp = $("#detailCount-templ").html(),
            detailCountFTemp = $("#detailCountF-templ").html(),
            $detailCountCon = $("#detailCount-con");

        var detailCountSubFlag = "";

        // 日期控件初始化
        $('#startTime').flatpickr();

        $('#endTime').flatpickr();


        $('#startTime').val(startTime);
        $('#endTime').val(endTime);

        $("#detail_search").unbind().on("click", function() {
            var d1 = new Date($('#startTime').val().replace(/-/g, "/")),
                d2 = new Date($('#endTime').val().replace(/-/g, "/"));
            if (d1.getTime() <= d2.getTime()) {
                detailCountQuery.begin_date = $('#startTime').val();
                detailCountQuery.end_date = $('#endTime').val();
                if (detailCountSubFlag == 1) {
                    Func.queryCloudDetailInfo(detailCountQuery, detailCountTemp, $detailCountCon);
                } else if (detailCountSubFlag == 2) {
                    Func.queryCloudDetailInfoForeign(detailCountQuery, detailCountFTemp, $detailCountCon);
                }
            } else {
                layer.msg("结束时间不得早于起始时间.");
            }
        });

        $("#detailCountSub").unbind().on("click", ".country-sub-item", function() {
            $('#startTime').val(startTime);
            $('#endTime').val(endTime);
            detailCountQuery.begin_date = $('#startTime').val();
            detailCountQuery.end_date = $('#endTime').val();
            $("#detailCountSub").find(".country-sub-item").removeClass("cur");
            $(this).addClass("cur");
            if ($(this).data("id") == 1) {
                detailCountSubFlag = 1;
                Func.queryCloudDetailInfo(detailCountQuery, detailCountTemp, $detailCountCon);
            } else if ($(this).data("id") == 2) {
                detailCountSubFlag = 2;
                Func.queryCloudDetailInfoForeign(detailCountQuery, detailCountFTemp, $detailCountCon);
            }
        });

        $("#dcs").click();
    }

    function newCount() {

        var nowDate = new Date();
        var start = new Date(nowDate),
            end = new Date(nowDate);
        end.setDate(nowDate.getDate() - 1);
        start.setDate(nowDate.getDate() - 8);

        var sMonth = "",
            eMonth = "",
            sDays = "",
            eDays = "";


        if (start.getMonth() + 1 < 10) {
            sMonth = "0" + (start.getMonth() + 1);
        } else {
            sMonth = start.getMonth() + 1;
        }

        if (end.getMonth() + 1 < 10) {
            eMonth = "0" + (end.getMonth() + 1);
        } else {
            eMonth = end.getMonth() + 1;
        }

        if (start.getDate() < 10) {
            sDays = "0" + start.getDate();
        } else {
            sDays = start.getDate();
        }

        if (end.getDate() < 10) {
            eDays = "0" + end.getDate();
        } else {
            eDays = end.getDate();
        }

        var startTime = start.getFullYear() + "-" + sMonth + "-" + sDays,
            endTime = end.getFullYear() + "-" + eMonth + "-" + eDays;

        var newCountQuery = {
            access_token: $.cookie("access_token"),
            product_id: $.cookie("product_id"),
            company_id: "",
            begin_date: startTime,
            end_date: endTime
        }

        // 定义容器
        var newCountTemp = $("#new-templ").html(),
            $newCountCon = $("#new-con");


        var ncFlag = "";

        // 日期控件初始化

        $('#new-amount-starttime').flatpickr();

        $('#new-amount-endtime').flatpickr();


        $('#new-amount-starttime').val(startTime);
        $('#new-amount-endtime').val(endTime);

        $("#new-search").unbind().on("click", function() {
            var d1 = new Date($('#new-amount-starttime').val().replace(/-/g, "/")),
                d2 = new Date($('#new-amount-endtime').val().replace(/-/g, "/"));
            if (d1.getTime() <= d2.getTime()) {
                newCountQuery.begin_date = $('#new-amount-starttime').val();
                newCountQuery.end_date = $('#new-amount-endtime').val();
                if (ncFlag == 1) {
                    Func.queryNewCount(newCountQuery, newCountTemp, $newCountCon);
                } else if (ncFlag == 2) {
                    Func.queryNewCountForeign(newCountQuery, newCountTemp, $newCountCon);
                }
            } else {
                layer.msg("结束时间不得早于起始时间.");
            }
        });

        $("#newCountSub").unbind().on("click", ".country-sub-item", function() {
            $('#new-amount-starttime').val(startTime);
            $('#new-amount-endtime').val(endTime);
            newCountQuery.begin_date = $('#new-amount-starttime').val();
            newCountQuery.end_date = $('#new-amount-endtime').val();
            $("#newCountSub").find(".country-sub-item").removeClass("cur");
            $(this).addClass("cur");
            if ($(this).data("id") == 1) {
                $("#n_price").html("销售额（￥）");
                ncFlag = 1;
                Func.queryNewCount(newCountQuery, newCountTemp, $newCountCon);
            } else if ($(this).data("id") == 2) {
                $("#n_price").html("销售额（$）");
                ncFlag = 2;
                Func.queryNewCountForeign(newCountQuery, newCountTemp, $newCountCon);
            }
        });

        $("#nc").click();
    }

    function channelCount() {

        var nowDate = new Date();
        var start = new Date(nowDate),
            end = new Date(nowDate);
        end.setDate(nowDate.getDate() - 1);
        start.setDate(nowDate.getDate() - 8);

        var sMonth = "",
            eMonth = "",
            sDays = "",
            eDays = "";


        if (start.getMonth() + 1 < 10) {
            sMonth = "0" + (start.getMonth() + 1);
        } else {
            sMonth = start.getMonth() + 1;
        }

        if (end.getMonth() + 1 < 10) {
            eMonth = "0" + (end.getMonth() + 1);
        } else {
            eMonth = end.getMonth() + 1;
        }

        if (start.getDate() < 10) {
            sDays = "0" + start.getDate();
        } else {
            sDays = start.getDate();
        }

        if (end.getDate() < 10) {
            eDays = "0" + end.getDate();
        } else {
            eDays = end.getDate();
        }

        var startTime = start.getFullYear() + "-" + sMonth + "-" + sDays,
            endTime = end.getFullYear() + "-" + eMonth + "-" + eDays;

        var channelQuery = {
            access_token: $.cookie("access_token"),
            product_id: $.cookie("product_id"),
            company_id: "",
            begin_date: startTime,
            end_date: endTime
        }

       // 定义容器
        var channelTemp = $("#channel-templ").html(),
            $channelCon = $("#channel-con");

        var ccFlag = "";

        // 日期控件初始化
        $('#channel-amount-starttime').flatpickr();

        $('#channel-amount-endtime').flatpickr();


        $('#channel-amount-starttime').val(startTime);
        $('#channel-amount-endtime').val(endTime);

        $("#channel-search").unbind().on("click", function() {
            var d1 = new Date($('#channel-amount-starttime').val().replace(/-/g, "/")),
                d2 = new Date($('#channel-amount-endtime').val().replace(/-/g, "/"));
            if (d1.getTime() <= d2.getTime()) {
                channelQuery.begin_date = $('#channel-amount-starttime').val();
                channelQuery.end_date = $('#channel-amount-endtime').val();
                if (ccFlag == 1) {
                    Func.queryChannelCount(channelQuery, channelTemp, $channelCon);
                } else if (ccFlag == 2) {
                    Func.queryChannelCountForeign(channelQuery, channelTemp, $channelCon);
                }
            } else {
                layer.msg("结束时间不得早于起始时间.");
            }
        });

        $("#channelsCountSub").unbind().on("click", ".country-sub-item", function() {
            $('#channel-amount-starttime').val(startTime);
            $('#channel-amount-endtime').val(endTime);
            channelQuery.begin_date = $('#channel-amount-starttime').val();
            channelQuery.end_date = $('#channel-amount-endtime').val();
            $("#channelsCountSub").find(".country-sub-item").removeClass("cur");
            $(this).addClass("cur");
            if ($(this).data("id") == 1) {
                $("#c_price").html("销售额（￥）");
                ccFlag = 1;
                Func.queryChannelCount(channelQuery, channelTemp, $channelCon);
            } else if ($(this).data("id") == 2) {
                $("#c_price").html("销售额（$）");
                ccFlag = 2;
                Func.queryChannelCountForeign(channelQuery, channelTemp, $channelCon);
            }
        });

        $("#cc").click();
    }

    function packageCount() {

        var nowDate = new Date();
        var start = new Date(nowDate),
            end = new Date(nowDate);
        end.setDate(nowDate.getDate() - 1);
        start.setDate(nowDate.getDate() - 8);

        var sMonth = "",
            eMonth = "",
            sDays = "",
            eDays = "";


        if (start.getMonth() + 1 < 10) {
            sMonth = "0" + (start.getMonth() + 1);
        } else {
            sMonth = start.getMonth() + 1;
        }

        if (end.getMonth() + 1 < 10) {
            eMonth = "0" + (end.getMonth() + 1);
        } else {
            eMonth = end.getMonth() + 1;
        }

        if (start.getDate() < 10) {
            sDays = "0" + start.getDate();
        } else {
            sDays = start.getDate();
        }

        if (end.getDate() < 10) {
            eDays = "0" + end.getDate();
        } else {
            eDays = end.getDate();
        }

        var startTime = start.getFullYear() + "-" + sMonth + "-" + sDays,
            endTime = end.getFullYear() + "-" + eMonth + "-" + eDays;

        var packageQuery = {
            access_token: $.cookie("access_token"),
            product_id: $.cookie("product_id"),
            company_id: "",
            begin_date: startTime,
            end_date: endTime
        }

         // 定义容器
        var packageTemp = $("#package-templ").html(),
            $packageCon = $("#package-con");

        var pcFlag = "";
        // 日期控件初始化
        $('#package-amount-starttime').flatpickr();

        $('#package-amount-endtime').flatpickr();


        $('#package-amount-starttime').val(startTime);
        $('#package-amount-endtime').val(endTime);

        $("#package-search").unbind().on("click", function() {
            var d1 = new Date($('#package-amount-starttime').val().replace(/-/g, "/")),
                d2 = new Date($('#package-amount-endtime').val().replace(/-/g, "/"));
            if (d1.getTime() <= d2.getTime()) {
                packageQuery.begin_date = $('#package-amount-starttime').val();
                packageQuery.end_date = $('#package-amount-endtime').val();
                if (pcFlag == 1) {
                    Func.queryPackageCount(packageQuery, packageTemp, $packageCon);
                } else if (pcFlag == 2) {
                    Func.queryPackageCountForeign(packageQuery, packageTemp, $packageCon);
                }
            } else {
                layer.msg("结束时间不得早于起始时间.");
            }
        });

        $("#packageCountSub").unbind().on("click", ".country-sub-item", function() {
            $('#package-amount-starttime').val(startTime);
            $('#package-amount-endtime').val(endTime);
            packageQuery.begin_date = $('#package-amount-starttime').val();
            packageQuery.end_date = $('#package-amount-endtime').val();
            $("#packageCountSub").find(".country-sub-item").removeClass("cur");
            $(this).addClass("cur");
            if ($(this).data("id") == 1) {
                $("#p_price").html("销售额（￥）");
                pcFlag = 1;
                Func.queryPackageCount(packageQuery, packageTemp, $packageCon);
            } else if ($(this).data("id") == 2) {
                $("#p_price").html("销售额（$）");
                pcFlag = 2;
                Func.queryPackageCountForeign(packageQuery, packageTemp, $packageCon);
            }
        });

        $("#pc").click();
    }

    allCount();

    $(".tab-head-item").on("click", function() {
        if ($(this).data("target") == "allCount") {
            allCount();
        } else if ($(this).data("target") == "detailCount") {
            detailCount();
        } else if ($(this).data("target") == "newCount") {
            newCount();
        } else if ($(this).data("target") == "channelsCount") {
            channelCount();
        } else if ($(this).data("target") == "packageCount") {
            packageCount();
        }
    });
}(jQuery))
