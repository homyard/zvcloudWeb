(function($) {

    $(".tabview").each(function(index, el) {
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


    // 日期控件初始化
    $('#startTime').flatpickr();

    $('#endTime').flatpickr();


    $('#startTime').val(startTime);
    $('#endTime').val(endTime);

    var query = {
        page_size: 20,
        end_date: endTime,
        page_index: 1,
        begin_date: startTime,
        order_no: ""
    }

    var statisticTemp = $("#statistic-templ").html(),
        listTemp = $("#list-templ").html(),
        domesticStatistic = $("#domestic-statistic"),
        domesticCon = $("#domestic-con"),
        abroadStatistic = $("#abroad-statistic"),
        abroadCon = $("#abroad-con");

    function domestic() {
        $.ajax({
            url: Func.path + "/zvcloud/order/thirdparty/yuemian/1",
            dataType: 'json',
            type: 'POST',
            contentType: "application/json",
            data: {
                page_size: query.page_size,
                end_date: query.end_date,
                page_index: query.page_index,
                begin_date: query.begin_date,
                order_no: query.order_no
            }
        }).done(function(data) {
            if (data.code == 1000) {
                var html;
                html = Mustache.render(statisticTemp, data.data.statistic_data);
                $(html).appendTo(domesticStatistic.empty());
                html = Mustache.render(listTemp, { items: data.data.result_list });
                $(html).appendTo(domesticCon.empty());
                if (data.data.total_count > 1) {
                    $("#domestic-pager").removeClass("hidden");
                    $("#domestic-pager").bs_pagination({
                        currentPage: query.page_index,
                        rowsPerPage: query.page_size,
                        totalRows: data.data.total_count,
                        totalPages: Math.ceil(data.data.total_count / query.page_size),
                        onChangePage: function(event, data) {
                            // your code here e.g.
                            query.page_index = data.currentPage;
                            query.page_size = data.rowsPerPage;
                            domestic();
                        }
                    });
                } else {
                    $("#domestic-pager").addClass("hidden");
                }
            } else {
                // Func.errorMsg(data.code); // 返回错误信息
            }
        }).fail(function() {
            layer.msg("请求失败,请联系管理员")
        })
    };

    function abroad() {
        $.ajax({
            url: Func.path + "/zvcloud/order/thirdparty/yuemian/2",
            dataType: 'json',
            type: 'POST',
            contentType: "application/json",
            data: {
                page_size: query.page_size,
                end_date: query.end_date,
                page_index: query.page_index,
                begin_date: query.begin_date,
                order_no: query.order_no
            }
        }).done(function(data) {
            if (data.code == 1000) {
                var html;
                html = Mustache.render(statisticTemp, data.data.statistic_data);
                $(html).appendTo(abroadStatistic.empty());
                html = Mustache.render(listTemp, { items: data.data.result_list });
                $(html).appendTo(abroadCon.empty());
                if (data.data.total_count > 1) {

                    $("#abroad-pager").removeClass("hidden");
                    $("#abroad-pager").bs_pagination({
                        currentPage: query.page_index,
                        rowsPerPage: query.page_size,
                        totalRows: data.data.total_count,
                        totalPages: Math.ceil(data.data.total_count / query.page_size),
                        onChangePage: function(event, data) {
                            // your code here e.g.
                            query.page_index = data.currentPage;
                            query.page_size = data.rowsPerPage;
                            abroad();
                        }
                    });
                } else {
                    $("#abroad-pager").addClass("hidden");
                }
            } else {
                // Func.errorMsg(data.code); // 返回错误信息
            }
        }).fail(function() {
            layer.msg("请求失败,请联系管理员")
        })
    };

    domestic();
    abroad();

    $("#detail_search").on("click", function() {
        query.page_index = 1;
        query.begin_date = $("#startTime").val();
        query.end_date = $("#endTime").val();
        if (query.begin_date > query.end_date) {
            layer.msg("起始时间不得大于结束时间");
        } else if (DateDiff(query.begin_date, query.end_date) > 90) {
            layer.msg("起始时间和结束时间相差不得超过三个月");
        } else {
            domestic();
            abroad();
        }
    });

    //计算天数差的函数，通用  
    function DateDiff(sDate1, sDate2) { //sDate1和sDate2是2006-12-18格式  
        var aDate, oDate1, oDate2, iDays
        aDate = sDate1.split("-")
        oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]) //转换为12-18-2006格式  
        aDate = sDate2.split("-")
        oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
        iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24) //把相差的毫秒数转换为天数  
        return iDays
    }



}(jQuery))