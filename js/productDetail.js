/**
 *  众云视频管理后台 - 产品信息
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

    function proInfoLoad() {
        var productQuery = {
            access_token: $.cookie("access_token"),
            product_id: $.cookie("product_id")
        };

        // 定义容器
        var productInfoTemp = $("#product-info-templ").html(),
            $productInfoCon = $("#product-info-con");

        Func.queryProductDetail(productQuery, productInfoTemp, $productInfoCon);

        var clientQuery = {
            access_token: $.cookie("access_token"),
            product_id: $.cookie("product_id"),
            service: 1
        }

        var avsQuery = {
            access_token: $.cookie("access_token"),
            product_id: $.cookie("product_id"),
            service: 0
        }

        // 定义容器
        var osTemp = $("#os-templ").html(),
            $clientCon = $("#client-con"),
            $avsCon = $("#avs-con");

        Func.queryAppListInfo(clientQuery, osTemp, $clientCon);
        Func.queryAppListInfo(avsQuery, osTemp, $avsCon);

        var hlist1 = $("#client-con").find(".os-item"),
            hlist2 = $("#avs-con").find(".os-item");

        if (hlist1.length >= 4) {
            $("#client-con").parent().find(".os-add").addClass("hidden")
        }

        if (hlist2.length >= 4) {
            $("#avs-con").parent().find(".os-add").addClass("hidden")
        }

        // $(".os-item").zclip({
        //     path: "plugins/zclip/ZeroClipboard.swf",
        //     copy: function() {
        //         return $(this).data("id");
        //     }
        // });

        function isIE() {
            if (window.navigator.userAgent.indexOf("MSIE") >= 1)
                return true;
            else
                return false;
        }

        if (!isIE()) {
            var client = new ZeroClipboard($(".os-item"), {
                swfPath: "plugins/zclip/ZeroClipboard.swf"
            });

            client.on("aftercopy", function() {
                layer.msg("复制成功！")
            });
        }

        // $(".os-item").Client;
        $("#change-info").unbind().on("click", function() {
            top.layer.open({
                type: 2,
                area: ['800px', '520px'], //宽高
                content: 'app-edit.html'
            });
        });

        $("#g-add").unbind().on("click", function() {
            top.layer.open({
                type: 2,
                area: ['800px', '280px'], //宽高
                content: 'add-app.html?type=0'
            });
        });

        $("#v-add").unbind().on("click", function() {
            top.layer.open({
                type: 2,
                area: ['800px', '280px'], //宽高
                content: 'add-app2.html?type=1'
            });
        });
    }

    function detailLoad() {

        var productQuery = {
            access_token: $.cookie("access_token"),
            product_id: $.cookie("product_id")
        };

        Func.queryProductDetailForL(productQuery);

        if ($("#flag").html() == 1) {
            $(".type-license").removeClass("hidden");
            // 定义初始化时间
            var nowDate = new Date();
            var start = new Date(nowDate),
                end = new Date(nowDate);
            end.setDate(nowDate.getDate() - 1);
            start.setDate(nowDate.getDate() - 30);

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


            var licenseQuery = {
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

            // 定义容器
            var licenseTemp = $("#license-templ").html(),
                $licenseCon = $("#license-con");

            Func.queryLicenseListInfo(licenseQuery, licenseTemp, $licenseCon);

            $("#dl-info").unbind().on("click", function() {
                layer.open({
                    type: 2,
                    offset: '100px',
                    area: ['780px', '400px'],
                    content: 'dlicense.html'
                });
            });

            // 初始化select
            var $selects = $('#status');

            $selects.easyDropDown({
                cutOff: 10,
                wrapperClass: 'dropdown',
                onChange: function(selected) {
                    licenseQuery.status = $(this).val();
                }
            });

            $("#search_l").unbind().on("click", function() {
                licenseQuery.license = $("#license_l_s").val();
                licenseQuery.cid = $("#license_c_s").val();
                licenseQuery.begin_time = $("#startTime").val();
                licenseQuery.end_time = $("#endTime").val();
                if (licenseQuery.cid == "" || !isNaN(licenseQuery.cid)) {
                    if (licenseQuery.begin_time > licenseQuery.end_time) {
                        layer.msg("起始时间不得大于结束时间");
                    } else {
                        Func.queryLicenseListInfo(licenseQuery, licenseTemp, $licenseCon);
                    }
                } else {
                    layer.msg("CID只能为数字")
                }
            });

        } else {
            $(".type-other").removeClass("hidden");
            var serviceQuery = {
                access_token: $.cookie("access_token"),
                product_id: $.cookie("product_id"),
                cid: "",
                page_index: 1,
                page_size: 10
            }

            // 定义容器
            var otherTemp = $("#other-templ").html(),
                $otherCon = $("#other-con");

            Func.queryServiceInfo(serviceQuery, otherTemp, $otherCon);

            $("#dl-info-other").unbind().on("click", function() {
                window.open(Func.path + "/zvcloud/deviceAvs/exportServiceExcel?productId=" + serviceQuery.product_id + "&authToken=" + serviceQuery.access_token)
            });

            $("#search_s").unbind().on("click", function() {
                serviceQuery.cid = $("#service_c_s").val();
                Func.queryServiceInfo(serviceQuery, otherTemp, $otherCon);
            });

        }
    }

    function manualAuth() {
        var productQuery = {
            access_token: $.cookie("access_token"),
            product_id: $.cookie("product_id")
        };

        Func.queryProductDetailForL(productQuery);

        var allnum = $(".a-num").html();

        $("#manual-text").unbind().on("keyup", function() {
            var str = $.trim($(this).val()),
                arr = str.split(";"),
                num = arr.length - 1,
                bstr = "";
            $(".a-num").html(allnum - num);

            if (allnum - num < 0) {
                for (i = 0; i < allnum; i++) {
                    bstr = bstr + arr[i] + ";"
                }
                $(this).val(bstr);
                $(".a-num").html(0);
            }
        });

        var active = function() {
            var str = $.trim($("#manual-text").val());
            str = str.replace(/\n/g, "");
            var arr = str.split(";");

            var addQuery = {
                access_token: $.cookie("access_token"),
                product_id: $.cookie("product_id"),
                license_list: str
            }

            if (str.charAt(str.length - 1) == ";") {
                arr.pop();
            }

            if (checknull(arr)) {
                layer.msg("license不允许输入空值");
            } else if (checktype(arr)) {
                layer.msg("license仅能由数字或字母构成")
            } else if (str == "") {
                layer.msg("请至少输入一个id");
            } else if (isRepeat(arr)) {
                layer.msg("存在重复值,请重新输入");
            } else if (isOut(arr)) {
                layer.msg("单个license长度不得超过64,请重新输入")
            } else {
                $("auth-active").off();
                $("auth-active").css("background-color", "#b3b3b3");
                showLoading();
                Func.addLicense(addQuery);
            }
        };

        $("#manual-active").unbind().on("click", active);
    }

    function modelAuth() {
        var productQuery = {
            access_token: $.cookie("access_token"),
            product_id: $.cookie("product_id")
        };

        Func.queryProductDetailForL(productQuery);

        $("#dl-temp").unbind().on("click", function() {
            window.open(Func.path + "/zvcloud/license/downloadTemplate")
        });

        var allowType = ['xls', 'xlsx'];
        var uploader = WebUploader.create({
            auto: true,
            swf: '../plugins/webuploader/Uploader.swf',
            server: Func.path + "/zvcloud/license/uploadExcelData",
            pick: {
                id: '#fileUploader',
                multiple: false
            },
            formData: {
                access_token: productQuery.access_token,
                product_id: productQuery.product_id
            },
            duplicate: true,
            fileVal: "uploadLicense",
            accept: {
                extensions: allowType.join(",")
            }
        });

        // uploader.on("uploadBeforeSend", function(headers) {
        //     console.log(headers);
        //     headers.auth_token = token;
        // });

        uploader.on('beforeFileQueued', function(file) {
            var ext = file.name.substr(file.name.lastIndexOf(".") + 1).toLowerCase();
            if ($.inArray(ext, allowType) == -1) {
                layer.alert("选择的格式不正确！", {
                    title: "提示信息",
                    icon: 0,
                    skin: 'layer-ext-alert'
                })
                return false;
            }
        });

        uploader.on('uploadStart', function(file) {

        });
        uploader.on('uploadProgress', function(file, percentage) {});

        uploader.on('uploadSuccess', function(file, data) {
            if (data.code == 1000) {
                var licenseList = [],
                    listStr = "";
                licenseList = data.data.license_list;

                for (var i = 0; i < licenseList.length; i++) {
                    listStr = listStr + licenseList[i] + ";\n";
                }

                $("#model-text").val(listStr).addClass("bgf");
            } else if (data.code == 5003) {
                top.layer.msg("超过剩余数量 请重新上传");
            }
            console.log(data);
            //返回图片地址，由后台定义
            // $("#logo_view").attr("src", path + "/" + data.data.logoPath);
        });

        uploader.on('uploadError', function(file) {
            layer.alert("上传错误！", {
                title: "提示信息",
                icon: 0,
                skin: 'layer-ext-alert'
            })
        });

        var active = function() {
            var str = $.trim($("#model-text").val());
            str = str.replace(/\n/g, "");
            var arr = str.split(";");

            var addQuery = {
                access_token: $.cookie("access_token"),
                product_id: $.cookie("product_id"),
                license_list: str
            }

            if (str.charAt(str.length - 1) == ";") {
                arr.pop();
            }

            if (checknull(arr)) {
                layer.msg("license不允许输入空值");
            } else if (checktype(arr)) {
                layer.msg("license仅能由数字或字母构成")
            } else if (str == "") {
                layer.msg("请至少上传一个id");
            } else if (isRepeat(arr)) {
                layer.msg("存在重复值,请重新输入");
            } else if (isOut(arr)) {
                layer.msg("单个license长度不得超过64,请重新上传")
            } else {
                $("auth-active").off();
                $("auth-active").css("background-color", "#b3b3b3");
                showLoading();
                Func.addLicense(addQuery);
            }
        };

        $("#model-active").unbind().on("click", active);
    }

    proInfoLoad();

    function showLoading() {
        $(".loading").css("height", $(document).height());
        $(".loading").css("width", $(document).width());
        $("#loading").css("top", $(document).scrollTop() + $(window).height() * 0.5 - 18);
        $(".loading").removeClass("hidden");
    }

    function hideLoading() {
        $(".loading").addClass("hidden");
    }

    function isOut(arr) {
        var flag = false;
        $.each(arr, function(index, val) {
            if (val.length > 64) {
                flag = true;
            }
        });

        return flag;
    }

    function checktype(arr) {
        var flag = false,
            check = /^[A-Za-z0-9]+$/;

        $.each(arr, function(index, val) {
            if (!check.test(val)) {
                flag = true;
            }
        });

        return flag;
    }

    function checknull(arr) {
        var flag = 1;

        $.each(arr, function(index, val) {
            if (val == "") {
                flag = 0;
            }
        });

        if (flag == 1) {
            return false;
        } else if (flag == 0) {
            return true;
        }
    }

    function isRepeat(arr) {

        var hash = {};

        for (var i in arr) {

            if (hash[arr[i]])

                return true;

            hash[arr[i]] = true;

        }

        return false;

    }

    $(".tab-head-item").on("click", function() {
        var pagename = $(this).data("target");

        $("#manual-text").val("");
        $("#model-text").val("").removeClass("bgf");
        if (pagename == "product_info") {
            proInfoLoad();
        } else if (pagename == "product_detail") {
            detailLoad();
        } else if (pagename == "manual_auth") {
            manualAuth();
        } else if (pagename == "model_auth") {
            modelAuth();
        }
    })

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