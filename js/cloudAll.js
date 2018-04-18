/**
 *  众云视频管理后台 - 云存储(全部)
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

    $(".sub-tabview").each(function(index, el) {
        new TabView({
            activeIndex: 0,
            dom: el,
            triggerEvent: 'click',
            activeCls: 'cur',
        });
    });
    // 定义初始化时间
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

    var query = {
        access_token: $.cookie("access_token"),
        company_id: $.cookie("company_id")
    }

    function allCount() {
        // 定义容器
        var cloudAllTemp = $("#cloudAll-templ").html(),
            $cloudAllCon = $("#cloudAll-con");

        Func.queryCloudAllListInfo(query, cloudAllTemp, $cloudAllCon);

        Func.hasProduct(query);

        // 查看详情

        $("#detail").unbind().on("click", function() {
            top.location.href = "productManage.html?type=cloud";
        });
    }

    function detail() {

        $('#daterange-btn span').html("日期选择");
        // 定义容器
        var cloudDetailTemp = $("#cloudDetail-templ").html(),
            $cloudDetailInCon = $("#in-detail-con");

        var queryDetail = {
            access_token: $.cookie("access_token"),
            company_id: $.cookie("company_id"),
            page_size: 10,
            page_index: 1,
            avs_cid: "",
            active_begin_date: "",
            active_end_date: "",
            order_no: ""
        };

        // 日期控件初始化
        // $('#d_date').dateRangePicker({
        //     language: 'cn',
        //     format: 'YYYY-MM-DD'
        // });
        var op1 = {
            ranges: {
                '今天': [moment(), moment()],
                '本周': [moment().startOf('week'), moment().endOf('week')],
                '本月': [moment().startOf('month'), moment().endOf('month')],
                '今年': [moment().startOf('year'), moment().endOf('year')]
            },
            locale: {
                format: 'YYYY-MM-DD', //控件中from和to 显示的日期格式
                applyLabel: '确定',
                cancelLabel: '取消',
                fromLabel: '起始时间',
                toLabel: '结束时间',
                customRangeLabel: '自定义',
                daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                monthNames: ['一月', '二月', '三月', '四月', '五月', '六月',
                    '七月', '八月', '九月', '十月', '十一月', '十二月'
                ],
                firstDay: 1
            },
        }

        var cb = function(start, end) {
            if (!start._isValid || !end._isValid) {
                $('#daterange-btn span').html("日期选择");
                queryDetail.active_begin_date = "";
                queryDetail.active_end_date = "";
            } else {
                $('#daterange-btn span').html(start.format('YYYY-MM-DD') + ' ~ ' + end.format('YYYY-MM-DD'));
                queryDetail.active_begin_date = start.format('YYYY-MM-DD');
                queryDetail.active_end_date = end.format('YYYY-MM-DD');
            }
            // alert(start.format('YYYY-MM-DD') + " " + end.format('YYYY-MM-DD'));
        }

        $('#daterange-btn').daterangepicker(op1, cb)
        //Date picker
        // $('#datepicker').datepicker({
        //     autoclose: true
        // });
        // Func.queryCloudAllDetailIn(queryDetail, cloudDetailTemp, $cloudDetailInCon);
        // Func.queryCloudAllDetailOut(queryDetail, cloudDetailTemp, $cloudDetailOutCon);

        var flag = 1;

        $("#flag").unbind().on("click", "div", function() {
            $("#flag").find(".country-sub-item").removeClass("cur");
            $(this).addClass("cur");
            $(this).data("target") == "in" ? flag = 1 : flag = 2;
            queryDetail.page_index = 1;
            if (flag == 1) {
                Func.queryCloudAllDetailIn(queryDetail, cloudDetailTemp, $cloudDetailInCon);
            } else {
                Func.queryCloudAllDetailOut(queryDetail, cloudDetailTemp, $cloudDetailInCon);
            }
        });

        $("#init").click();
        $("#d-search").unbind().on("click", function() {
            queryDetail.page_index = 1;
            // queryDetail.active_begin_date = str.substring(0, 10);
            // queryDetail.active_end_date = str.substring(str.length - 10, str.length);
            queryDetail.avs_cid = $("#avs_cid").val();
            queryDetail.order_no = $("#order_no").val();
            if (!isNaN($("#avs_cid").val()) || $("#avs_cid").val() == "") {
                if (flag == 1) {
                    Func.queryCloudAllDetailIn(queryDetail, cloudDetailTemp, $cloudDetailInCon);
                } else {
                    Func.queryCloudAllDetailOut(queryDetail, cloudDetailTemp, $cloudDetailInCon);
                }
            } else {
                layer.msg("采集端CID只能是数字")
            }
        });

        $("#d-clear").unbind().on("click", function() {
            $('#daterange-btn span').html("日期选择");
            queryDetail.active_begin_date = "";
            queryDetail.active_end_date = "";
            $('#daterange-btn').daterangepicker(op1, cb);
            $("#avs_cid").val("");
            $("#order_no").val("");
        });
    }

    function price(a) {
        // 定义容器
        var cloudPriceTemp = $("#price-templ").html(),
            $cloudpriceInCon = $("#in-price-con"),
            $cloudpriceOutCon = $("#out-price-con");

        var priceQuery = {
            access_token: $.cookie("access_token"),
            company_id: $.cookie("company_id"),
            section_id: a
        }

        Func.queryCloudAllPriceIn(priceQuery, cloudPriceTemp, $cloudpriceInCon);
        Func.queryCloudAllPriceOut(priceQuery, cloudPriceTemp, $cloudpriceOutCon);

        var flagb = 1;

        $("#flagb").on("click", "div", function() {
            $(this).data("target") == "in" ? flagb = 1 : flagb = 2;
        });

        $(".list-table").unbind().on("click", ".exit", function() {
            $(this).addClass("hidden");
            $(this).parent().find(".confirm").removeClass("hidden");
            $(this).parent().find(".cancel").removeClass("hidden");
            $(this).parent().parent().find(".show-price").addClass("hidden");
            $(this).parent().parent().find(".s_p").removeClass("hidden");
            $(this).parent().parent().find(".s_p").focus();
        }).on("click", ".confirm", function() {
            if ($(this).parent().parent().find(".s_p").val() == $(this).parent().parent().find(".s_p").data("id")) {
                $(this).addClass("hidden");
                $(this).parent().find(".cancel").addClass("hidden");
                $(this).parent().find(".exit").removeClass("hidden");
                $(this).parent().parent().find(".show-price").removeClass("hidden");
                $(this).parent().parent().find(".s_p").addClass("hidden");
            } else if (parseFloat($(this).parent().parent().find(".s_p").val()) < 0 || isNaN(parseFloat($(this).parent().parent().find(".s_p").val()))) {
                layer.msg("请输入合法的价格");
                $(this).parent().parent().find(".s_p").focus();
            } else {
                queryupdate = {
                    access_token: $.cookie("access_token"),
                    company_id: $.cookie("company_id"),
                    sales_price: $(this).parent().parent().find(".s_p").val(),
                    show_price: $(this).parent().parent().find(".s_p").val(),
                    commodity_id: $(this).parent().data("id"),
                    section_id:a
                }
                console.log(queryupdate.sales_price);
                if (flagb == 1) {
                    Func.updatePriceIn(queryupdate, cloudPriceTemp, $cloudpriceInCon);
                } else {
                    Func.updatePriceOut(queryupdate, cloudPriceTemp, $cloudpriceOutCon);
                }
            }
        }).on("click", ".cancel", function() {
            $(this).parent().parent().find(".s_p").val($(this).parent().parent().find(".s_p").data("id"));
            $(this).addClass("hidden");
            $(this).parent().find(".confirm").addClass("hidden");
            $(this).parent().find(".exit").removeClass("hidden");
            $(this).parent().parent().find(".show-price").removeClass("hidden");
            $(this).parent().parent().find(".s_p").addClass("hidden");
        });
    }

    function detailCount() {
        var detailCountQuery = {
            access_token: $.cookie("access_token"),
            product_id: "",
            company_id: $.cookie("company_id"),
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
        var newCountQuery = {
            access_token: $.cookie("access_token"),
            product_id: "",
            company_id: $.cookie("company_id"),
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
        var channelQuery = {
            access_token: $.cookie("access_token"),
            company_id: $.cookie("company_id"),
            product_id: "",
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
        var packageQuery = {
            access_token: $.cookie("access_token"),
            product_id: "",
            company_id: $.cookie("company_id"),
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
        } else if ($(this).data("target") == "detailC") {
            detail();
        } else if ($(this).data("target") == "price") {
            price(15);
        }
    });

    $(".section-item").on("click",function(){
        $(".section-item").removeClass("cur");
        $(this).addClass("cur");
        price($(this).data("id"));
    });


}(jQuery))