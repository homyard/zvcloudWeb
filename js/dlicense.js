(function($) {

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
        access_token: $.cookie("access_token"),
        product_id: $.cookie("product_id"),
        license: "",
        begin_time: startTime,
        end_time: endTime,
        cid: "",
        status: "",
        page_index: 1,
        page_size: 10
    }

    $("#search_l").on("click", function() {
        query.begin_time = $("#startTime").val();
        query.end_time = $("#endTime").val();

        $.ajax({
            url: Func.path + "/zvcloud/license/queryLicenses",
            dataType: 'json',
            type: 'POST',
            beforeSend: function(request) {
                request.setRequestHeader("access_token", query.access_token);
            },
            contentType: "application/json",
            data: {
                product_id: query.product_id,
                license: query.license,
                cid: query.cid,
                status: query.status,
                begin_time: query.begin_time,
                end_time: query.end_time,
                page_index: query.page_index,
                page_size: query.page_size
            }
        }).done(function(data) {
            if (data.code == 1000) {
                if (data.data.total_count > 0) {
                    if (query.begin_time > query.end_time) {
                        layer.msg("起始时间不得大于结束时间");
                    } else if (DateDiff(query.begin_time, query.end_time) > 90) {
                        layer.msg("起始时间和结束时间相差不得超过三个月");
                    } else {
                        var a = document.createElement('a');
                        a.setAttribute('href', Func.path + "/zvcloud/license/exportLicenseExcel?productId=" + $.cookie("product_id") + "&authToken=" + $.cookie("access_token") + "&begin_time=" + $('#startTime').val() + "&end_time=" + $('#endTime').val());
                        a.setAttribute('target', '_blank');
                        a.setAttribute('id', 'aid');
                        // 防止反复添加  
                        if (!document.getElementById('aid')) {
                            document.body.appendChild(a);
                        }
                        a.click();
                        // window.showModalDialog(Func.path + "/zvcloud/license/exportLicenseExcel?productId=" + $.cookie("product_id") + "&authToken=" + $.cookie("access_token") + "&begin_time=" + $('#startTime').val() + "&end_time=" + $('#endTime').val());
                    }
                } else {
                    layer.msg("当前时段没有数据")
                }
            } else {
                Func.errorMsg(data.code); // 返回错误信息
            }
        }).fail(function() {
            layer.msg("请求失败,请联系管理员")
        })
    });

    function DateDiff(sDate1, sDate2) { //sDate1和sDate2是2006-12-18格式  
        var aDate, oDate1, oDate2, iDays
        aDate = sDate1.split("-")
        oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]) //转换为12-18-2006格式  
        aDate = sDate2.split("-")
        oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
        iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24) //把相差的毫秒数转换为天数  
        return iDays
    }

}(jQuery));