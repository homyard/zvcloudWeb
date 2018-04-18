/*公用JS*/
(function(win, $) {
    win.Func = {
        path: location.protocol + "//192.168.0.172", // ajax请求路径192.168.0.172

        // 发送验证码
        sendVerifyCode: function(query) {
            $.ajax({
                url: Func.path + "/zvcloud/mobile/sendVerifyCode",
                dataType: 'json',
                type: 'POST',
                contentType: "application/json",
                data: {
                    mobile_phone: query.mobile_phone,
                    verify_type: query.verify_type,
                }
            }).done(function(data) {
                if (data.code == 1000) {
                    layer.msg("发送成功!"); // 发送成功
                    Func.setTime(60);
                } else {
                    Func.errorMsg(data.code); // 返回错误信息
                }
            }).fail(function() {
                layer.msg("请求失败,请联系管理员");
            })
        },

        // 注册功能
        register: function(query) {
            $.ajax({
                url: Func.path + "/zvcloud/company/register",
                dataType: 'json',
                type: 'POST',
                contentType: "application/json",
                data: {
                    mobile_phone: query.mobile_phone,
                    company_name: query.company_name,
                    email: query.email,
                    channel: query.channel,
                    password: query.password,
                    verify_code: query.verify_code,
                    country: query.country,
                    province: query.province,
                    city: query.city
                }
            }).done(function(data) {
                if (data.code == 1000) {
                    layer.msg("注册成功");

                    // 注册成功后触发登录
                    var loginQuery = {
                        mobile_phone: query.mobile_phone,
                        password: query.password,
                        type: 2
                    }

                    Func.login(loginQuery);
                } else {
                    Func.errorMsg(data.code); // 返回错误信息
                }

            }).fail(function() {
                layer.msg("请求失败,请联系管理员");
            })
        },

        // 发送重置邮件
        sendEmailForReset: function(query) {
            $.ajax({
                url: Func.path + "/zvcloud/company/sendEmailForFindPassword",
                dataType: 'json',
                type: 'POST',
                contentType: "application/json",
                data: {
                    "email": query.email
                }
            }).done(function(data) {
                if (data.code == 1000) {
                    var hash = {
                        'qq.com': 'http://mail.qq.com',
                        'gmail.com': 'http://mail.google.com',
                        'sina.com': 'http://mail.sina.com.cn',
                        '163.com': 'http://mail.163.com',
                        '126.com': 'http://mail.126.com',
                        'yeah.net': 'http://www.yeah.net/',
                        'sohu.com': 'http://mail.sohu.com/',
                        'tom.com': 'http://mail.tom.com/',
                        'sogou.com': 'http://mail.sogou.com/',
                        '139.com': 'http://mail.10086.cn/',
                        'hotmail.com': 'http://www.hotmail.com',
                        'live.com': 'http://login.live.com/',
                        'live.cn': 'http://login.live.cn/',
                        'live.com.cn': 'http://login.live.com.cn',
                        '189.com': 'http://webmail16.189.cn/webmail/',
                        'yahoo.com.cn': 'http://mail.cn.yahoo.com/',
                        'yahoo.cn': 'http://mail.cn.yahoo.com/',
                        'eyou.com': 'http://www.eyou.com/',
                        '21cn.com': 'http://mail.21cn.com/',
                        '188.com': 'http://www.188.com/',
                        'foxmail.coom': 'http://www.foxmail.com'
                    };

                    layer.msg("邮件发送完成,将自动跳转到邮箱(非主流邮箱暂不支持跳转)");
                    setTimeout(function() {
                        var maillo = mail.split("@")[1];
                        for (var j in hash) {
                            if (hash[maillo]) {
                                top.location.href = hash[maillo];
                            }
                        }
                    }, 3000);

                } else {
                    Func.errorMsg(data.code); // 返回错误信息
                }
            }).fail(function() {
                layer.msg("请求失败,请联系管理员");
            })
        },

        binding: function(query) {
            $.ajax({
                url: Func.path + "/zvcloud/company/bindMobilePhone",
                dataType: 'json',
                type: 'POST',
                contentType: "application/json",
                beforeSend: function(request) {
                    request.setRequestHeader("access_token", query.access_token);
                },
                data: {
                    mobile_phone: query.mobile_phone,
                    verify_code: query.verify_code,
                }
            }).done(function(data) {
                if (data.code == 1000) {
                    layer.msg("绑定成功");
                    setTimeout(function() {
                        top.location.href = "index.html"
                    }, 1000)
                } else {
                    Func.errorMsg(data.code); // 返回错误信息
                }
            }).fail(function() {
                layer.msg("请求失败,请联系管理员");
            })
        },

        // 登录功能
        login: function(query) {
            $.ajax({
                url: Func.path + "/zvcloud/company/login",
                dataType: 'json',
                type: 'POST',
                contentType: "application/json",
                data: {
                    mobile_phone: query.mobile_phone,
                    company_name: query.company_name,
                    email: query.email,
                    password: query.password,
                    type: query.type,
                    user_name: query.user_name
                }
            }).done(function(data) {
                if (data.code == 1000) {
                    layer.msg("登陆成功");
                    $.cookie('access_token', data.data.access_token);
                    $.cookie('company_id', data.data.company_id);
                    $.cookie('company_key', data.data.company_key);
                    top.location.href = "index.html";
                } else {
                    Func.errorMsg(data.code); // 返回错误信息
                }
            }).fail(function() {
                layer.msg("请求失败,请联系管理员")
            })
        },

        // 验证登陆
        checkLogin: function(query, temp, con) {
            $.ajax({
                url: Func.path + "/zvcloud/company/queryCompanyInfo",
                dataType: 'json',
                type: 'POST',
                beforeSend: function(request) {
                    request.setRequestHeader("access_token", query.access_token);
                },
                contentType: "application/json",
                data: {
                    // company_id: query.company_id,
                }
            }).done(function(data) {
                if (data.code == 1000) {

                    if (!data.data.mobile_phone || data.data.mobile_phone == "") {
                        top.location.href = "binding.html"
                    }
                    var html = [];
                    html.push(Mustache.render(temp, data.data));
                    con.html(html.join(''));

                    // 绑定注销事件
                    $("#login-out").on("click", function() {
                        $.cookie('access_token', '', { expires: -1 });
                        $.cookie('company_id', '', { expires: -1 });
                        $.cookie('company_key', '', { expires: -1 });
                        $.cookie('product_id', '', { expires: -1 });
                        $.cookie('mobile_phone', '', { expires: -1 });
                        window.location.href = "index.html"
                    });
                } else {

                    // Func.errorMsg(data.code); // 返回错误信息
                }
            }).fail(function() {
                layer.msg("请求失败,请联系管理员")
            })
        },

        // 验证验证码
        checkVerifyCode: function(query) {
            $.ajax({
                url: Func.path + "/zvcloud/mobile/checkVerifyCode",
                dataType: 'json',
                type: 'POST',
                contentType: "application/json",
                data: {
                    mobile_phone: query.mobile_phone,
                    verify_code: query.verify_code
                }
            }).done(function(data) {
                if (data.code == 1000) {
                    top.location.href = "resetpwd.html?phone=" + query.mobile_phone;
                } else {
                    Func.errorMsg(data.code); // 返回错误信息
                }
            }).fail(function() {
                layer.msg("请求失败,请联系管理员")
            })
        },

        // 修改密码
        changePwdByPhone: function(query) {
            $.ajax({
                url: Func.path + "/zvcloud/company/resetPasswordByMobilePhone",
                dataType: 'json',
                type: 'POST',
                contentType: "application/json",
                beforeSend: function(request) {
                    request.setRequestHeader("access_token", query.access_token);
                },
                data: {
                    mobile_phone: query.mobile_phone,
                    password: query.password,
                    verify_code: query.verify_code
                }
            }).done(function(data) {
                if (data.code == 1000) {
                    layer.msg("修改成功");

                    setTimeout(function() {
                        if (query.flag == 1) {
                            top.location.href = "index.html";
                        } else {
                            top.location.reload();
                        }
                    }, 1000);
                } else {
                    Func.errorMsg(data.code); // 返回错误信息
                }
            }).fail(function() {
                layer.msg("请求失败,请联系管理员")
            })
        },

        // 公司信息
        queryCompanyInfo: function(query, temp, con) {
            $.ajax({
                url: Func.path + "/zvcloud/company/queryCompanyInfo",
                dataType: 'json',
                type: 'POST',
                beforeSend: function(request) {
                    request.setRequestHeader("access_token", query.access_token);
                },
                contentType: "application/json",
                data: {
                    // company_id: query.company_id,
                }
            }).done(function(data) {
                if (data.code == 1000) {
                    if (!data.data.mobile_phone) {
                        // window.location.href = "binding.html";
                    }
                    $.cookie('mobile_phone', data.data.mobile_phone);

                    var html = [];
                    html.push(Mustache.render(temp, data.data));
                    con.html(html.join(''));

                } else {
                    Func.errorMsg(data.code); // 返回错误信息
                }
            }).fail(function() {
                layer.msg("请求失败,请联系管理员")
            })
        },

        // 产品列表信息
        queryProductListInfo: function(query, temp, con) {
            $.ajax({
                url: Func.path + "/zvcloud/product/queryProductList",
                dataType: 'json',
                type: 'POST',
                beforeSend: function(request) {
                    request.setRequestHeader("access_token", query.access_token);
                },
                contentType: "application/json",
                data: {
                    page_index: query.page_index,
                    page_size: query.page_size
                }
            }).done(function(data) {
                if (data.code == 1000) {
                    var contents = data.data.result_list;
                    var html;
                    if (contents) {
                        $.each(contents, function(index, val) {
                            switch (val.product_type) {
                                case 0:
                                    val.product_type = "监控";
                                    break;
                                case 1:
                                    val.product_type = "门铃";
                                    break;
                                case 2:
                                    val.product_type = "行车记录仪";
                                    break;
                                case 3:
                                    val.product_type = "机器人";
                                    break;
                                case 4:
                                    val.product_type = "无人机";
                                    break;
                                case 5:
                                    val.product_type = "行政执法";
                                    break;
                                case 6:
                                    val.product_type = "智能家居";
                                    break;
                                case 7:
                                    val.product_type = "其他";
                                    break;
                            }
                        })
                    }

                    html = Mustache.render(temp, { items: contents });
                    $(html).appendTo(con.empty());

                    if (data.data.total_count > 1) {
                        $("#pager").removeClass("hidden");
                        $("#pager").pagination({
                            totalCount: data.data.total_count,
                            pageSize: query.page_size,
                            pageIndex: query.page_index,
                            onSelectPage: function(pageindex, pagesize) {
                                query.page_index = pageindex;
                                Func.queryProductListInfo(query, temp, con);
                            }
                        });
                    } else {
                        $("#pager").addClass("hidden");
                    }
                } else {
                    Func.errorMsg(data.code); // 返回错误信息
                }
            }).fail(function() {
                layer.msg("请求失败,请联系管理员")
            })
        },

        // 产品列表信息
        queryProductListSelectInfo: function(query, temp, con) {
            $.ajax({
                url: Func.path + "/zvcloud/product/queryProductInfoList",
                dataType: 'json',
                type: 'POST',
                async: false,
                beforeSend: function(request) {
                    request.setRequestHeader("access_token", query.access_token);
                },
                contentType: "application/json",
                data: {}
            }).done(function(data) {
                if (data.code == 1000) {
                    var contents = data.data.result_list;
                    var html;
                    html = Mustache.render(temp, { items: contents });
                    $(html).appendTo(con.empty());
                    $.each($("#select-con option"), function() {
                        if ($.cookie("product_id")) {
                            if ($(this).val() == $.cookie("product_id")) {
                                $(this).attr("selected", true)
                            }
                        } else {
                            $.cookie("product_id", data.data.result_list[0].product_id);
                        }
                    })
                } else {
                    Func.errorMsg(data.code); // 返回错误信息
                }
            }).fail(function() {
                layer.msg("请求失败,请联系管理员")
            })
        },

        // License列表信息
        queryLicenseListInfo: function(query, temp, con) {
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
                    var contents = data.data.result_list;
                    var html;
                    if (contents) {
                        $.each(contents, function(index, val) {
                            switch (val.status) {
                                case -1:
                                    val.status_name = "无效";
                                    break;
                                case 0:
                                    val.status_name = "未激活";
                                    break;
                                case 1:
                                    val.status_name = "激活";
                                    break;
                            };

                            val.num = index + 1;
                        })
                    }
                    html = Mustache.render(temp, { items: contents });
                    $(html).appendTo(con.empty());

                    if (data.data.total_count > 1) {
                        $("#pager-l").removeClass("hidden");
                        $("#pager-l").pagination({
                            totalCount: data.data.total_count,
                            pageSize: query.page_size,
                            pageIndex: query.page_index,
                            onSelectPage: function(pageindex, pagesize) {
                                query.page_index = pageindex;
                                Func.queryLicenseListInfo(query, temp, con);
                            }
                        });
                    } else {
                        $("#pager-l").addClass("hidden");
                    }

                } else {
                    Func.errorMsg(data.code); // 返回错误信息
                }
            }).fail(function() {
                layer.msg("请求失败,请联系管理员")
            })
        },

        // Service列表信息
        queryServiceInfo: function(query, temp, con) {
            $.ajax({
                url: Func.path + "/zvcloud/deviceAvs/queryServiceInfo",
                dataType: 'json',
                type: 'POST',
                beforeSend: function(request) {
                    request.setRequestHeader("access_token", query.access_token);
                },
                contentType: "application/json",
                data: {
                    product_id: query.product_id,
                    cid: query.cid,
                    page_index: query.page_index,
                    page_size: query.page_size
                }
            }).done(function(data) {
                if (data.code == 1000) {
                    var contents = data.data.result_list;
                    var html;
                    if (contents) {
                        $.each(contents, function(index, val) {
                            val.num = index + 1;
                        })
                    }
                    html = Mustache.render(temp, { items: contents });
                    $(html).appendTo(con.empty());

                    if (data.data.total_count > 1) {
                        $("#pager-o").removeClass("hidden");
                        $("#pager-o").pagination({
                            totalCount: data.data.total_count,
                            pageSize: query.page_size,
                            pageIndex: query.page_index,
                            onSelectPage: function(pageindex, pagesize) {
                                query.page_index = pageindex;
                                Func.queryLicenseListInfo(query, temp, con);
                            }
                        });
                    } else {
                        $("#pager-o").addClass("hidden");
                    }

                } else {
                    Func.errorMsg(data.code); // 返回错误信息
                }
            }).fail(function() {
                layer.msg("请求失败,请联系管理员")
            })
        },

        // 产品详情信息
        queryProductDetail: function(query, temp, con) {
            $.ajax({
                url: Func.path + "/zvcloud/product/queryProductByKey",
                dataType: 'json',
                type: 'POST',
                beforeSend: function(request) {
                    request.setRequestHeader("access_token", query.access_token);
                },
                contentType: "application/json",
                data: {
                    product_id: query.product_id
                }
            }).done(function(data) {
                if (data.code == 1000) {
                    switch (data.data.product_type) {
                        case 0:
                            data.data.product_type_name = "监控";
                            break;
                        case 1:
                            data.data.product_type_name = "门铃";
                            break;
                        case 2:
                            data.data.product_type_name = "行车记录仪";
                            break;
                        case 3:
                            data.data.product_type_name = "机器人";
                            break;
                        case 4:
                            data.data.product_type_name = "无人机";
                            break;
                        case 5:
                            data.data.product_type_name = "行政执法";
                            break;
                        case 6:
                            data.data.product_type_name = "智能家居";
                            break;
                        case 7:
                            data.data.product_type_name = "其他";
                            break;
                    }

                    switch (data.data.auth_type) {
                        case 0:
                            data.data.auth_type_name = "总量授权";
                            break;
                        case 1:
                            data.data.auth_type_name = "license授权";
                            break;
                        case 2:
                            data.data.auth_type_name = "无限授权";
                            break;
                    }

                    if (data.data.auth_type == 2) {
                        data.data.auth_type_flag = false;
                    } else {
                        data.data.auth_type_flag = true;
                    }

                    if (data.data.auth_type != 1) {
                        $("#manual_auth").addClass("hidden");
                        $("#model_auth").addClass("hidden");
                        $("#product_detail").addClass("last-item");

                    }

                    switch (data.data.private_level) {
                        case 0:
                            data.data.private_level_name = "公开";
                            break;
                        case 1:
                            data.data.private_level_name = "半公开";
                            break;
                        case 2:
                            data.data.private_level_name = "秘密";
                            break;
                    }

                    var html = [];
                    html.push(Mustache.render(temp, data.data));
                    con.html(html.join(''));
                } else {
                    Func.errorMsg(data.code); // 返回错误信息
                }
            }).fail(function() {
                layer.msg("请求失败,请联系管理员")
            })
        },

        // 产品详情信息
        queryProductDetailForL: function(query) {
            $.ajax({
                url: Func.path + "/zvcloud/product/queryProductByKey",
                dataType: 'json',
                type: 'POST',
                async: false,
                beforeSend: function(request) {
                    request.setRequestHeader("access_token", query.access_token);
                },
                contentType: "application/json",
                data: {
                    product_id: query.product_id
                }
            }).done(function(data) {
                if (data.code == 1000) {
                    $("#flag").html(data.data.auth_type);
                    if (data.data.auth_type == 1) {
                        $(".a-num").html(data.data.total_count - data.data.used_count);
                        $("#allc").html(data.data.total_count);
                        $("#actc").html(data.data.used_count);
                        $("#surc").html(data.data.actived_count);
                    } else {
                        $(".auth-main").addClass("hidden");
                        $(".a-tips").removeClass("hidden");
                    }
                } else {
                    Func.errorMsg(data.code); // 返回错误信息
                }
            }).fail(function() {
                layer.msg("请求失败,请联系管理员")
            })
        },

        // 产品详情(for edit)
        queryProductForEdit: function(query) {
            $.ajax({
                url: Func.path + "/zvcloud/product/queryProductByKey",
                dataType: 'json',
                type: 'POST',
                async: false,
                beforeSend: function(request) {
                    request.setRequestHeader("access_token", query.access_token);
                },
                contentType: "application/json",
                data: {
                    product_id: query.product_id
                }
            }).done(function(data) {
                if (data.code == 1000) {
                    $("#pro-name").val(data.data.productName);
                    $("#productList").val(data.data.product_type);
                    $("#authList").val(data.data.auth_type);
                    $("#privacyList").val(data.data.private_level);
                    $("#logo_view").attr("src", data.data.logo_uri);
                    $("#logo_view").attr("data-id", data.data.logo_uri);
                } else {
                    Func.errorMsg(data.code); // 返回错误信息
                }
            }).fail(function() {
                layer.msg("请求失败,请联系管理员")
            })
        },

        //云存储页判断是否有产品
        hasProduct: function(query) {
            $.ajax({
                url: Func.path + "/zvcloud/product/queryProductInfoList",
                dataType: 'json',
                type: 'POST',
                async: false,
                beforeSend: function(request) {
                    request.setRequestHeader("access_token", query.access_token);
                },
                contentType: "application/json",
                data: {}
            }).done(function(data) {
                if (data.code == 1000) {
                    var contents = data.data.result_list;
                    if (contents) {
                        $("#detail").removeClass("hidden");
                    }
                } else {
                    // Func.errorMsg(data.code); // 返回错误信息
                }
            }).fail(function() {
                layer.msg("请求失败,请联系管理员")
            })
        },

        // 云存储列表信息(总)
        queryCloudAllListInfo: function(query, temp, con) {
            $.ajax({
                url: Func.path + "/zvcloud/analytics/cardcoupon/companyByMonth",
                dataType: 'json',
                type: 'POST',
                beforeSend: function(request) {
                    request.setRequestHeader("access_token", query.access_token);
                },
                contentType: "application/json",
                data: {
                    company_id: query.company_id
                }
            }).done(function(data) {
                if (data.code == 1000) {
                    var contents = data.data.result_list;
                    var html;
                    // if (contents) {
                    //     $.each(contents, function(index, val) {
                    //         switch (val.status) {
                    //             case 0:
                    //                 val.status_text = "未支付";
                    //                 break;
                    //             case 1:
                    //                 val.status_text = "已支付";
                    //                 break;
                    //         }
                    //     })
                    // }

                    html = Mustache.render(temp, { items: contents });
                    $(html).appendTo(con.empty());
                    $("#totalNum").html("¥ " + data.data.amount_total);
                    $("#foreigntotalNum").html("$ " + data.data.foreign_amount_total);
                } else {
                    Func.errorMsg(data.code); // 返回错误信息
                }
            }).fail(function() {
                layer.msg("请求失败,请联系管理员")
            })
        },

        // 云存储列表信息(国内)
        queryCloudAllDetailIn: function(query, temp, con) {
            $.ajax({
                url: Func.path + "/zvcloud/analytics/cardcoupon/list/1",
                dataType: 'json',
                type: 'POST',
                beforeSend: function(request) {
                    request.setRequestHeader("access_token", query.access_token);
                },
                contentType: "application/json",
                data: {
                    company_id: query.company_id,
                    avs_cid: query.avs_cid,
                    active_begin_date: query.active_begin_date,
                    active_end_date: query.active_end_date,
                    order_no: query.order_no,
                    page_size: query.page_size,
                    page_index: query.page_index
                }
            }).done(function(data) {
                if (data.code == 1000) {
                    var contents = data.data.result_list;
                    var html;
                    // if (contents) {
                    //     $.each(contents, function(index, val) {
                    //         switch (val.status) {
                    //             case 0:
                    //                 val.status_text = "未支付";
                    //                 break;
                    //             case 1:
                    //                 val.status_text = "已支付";
                    //                 break;
                    //         }
                    //     })
                    // }
                    if (contents) {
                        $.each(contents, function(index, val) {
                            switch (val.pay_platform) {
                                case "weixin":
                                    val.pay_platform = "微信";
                                    break;
                                case "alipay":
                                    val.pay_platform = "支付宝";
                                    break;
                                case "iospay":
                                    val.pay_platform = "苹果支付";
                                    break;
                                case "google":
                                    val.pay_platform = "Google";
                                    break;
                                case "paypal":
                                    val.pay_platform = "Pay Pal";
                                    break;
                            };
                            if (val.price) {
                                val.price = "¥" + val.price;
                            }
                        })
                    }
                    html = Mustache.render(temp, { items: contents });
                    $(html).appendTo(con.empty());
                    if (data.data.total_count > 1) {
                        $("#pager").removeClass("hidden");
                        $("#pager").pagination({
                            totalCount: data.data.total_count,
                            pageSize: query.page_size,
                            pageIndex: query.page_index,
                            onSelectPage: function(pageindex, pagesize) {
                                query.page_index = pageindex;
                                Func.queryCloudAllDetailIn(query, temp, con);
                            }
                        });
                    } else {
                        $("#pager").addClass("hidden");
                    }
                    // $("#totalNum").html(data.data.amount_total);
                } else {
                    Func.errorMsg(data.code); // 返回错误信息
                }
            }).fail(function() {
                layer.msg("请求失败,请联系管理员")
            })
        },
        // 云存储列表信息(国外)
        queryCloudAllDetailOut: function(query, temp, con) {
            $.ajax({
                url: Func.path + "/zvcloud/analytics/cardcoupon/list/2",
                dataType: 'json',
                type: 'POST',
                beforeSend: function(request) {
                    request.setRequestHeader("access_token", query.access_token);
                },
                contentType: "application/json",
                data: {
                    company_id: query.company_id,
                    avs_cid: query.avs_cid,
                    active_begin_date: query.active_begin_date,
                    active_end_date: query.active_end_date,
                    order_no: query.order_no,
                    page_size: query.page_size,
                    page_index: query.page_index
                }
            }).done(function(data) {
                if (data.code == 1000) {
                    var contents = data.data.result_list;
                    var html;
                    if (contents) {
                        $.each(contents, function(index, val) {
                            switch (val.pay_platform) {
                                case "weixin":
                                    val.pay_platform = "微信";
                                    break;
                                case "alipay":
                                    val.pay_platform = "支付宝";
                                    break;
                                case "iospay":
                                    val.pay_platform = "苹果支付";
                                    break;
                                case "google":
                                    val.pay_platform = "Google";
                                    break;
                                case "paypal":
                                    val.pay_platform = "Pay Pal";
                                    break;
                            };
                            if (val.price) {
                                val.price = "$" + val.price;
                            }

                        })
                    }
                    // if (contents) {
                    //     $.each(contents, function(index, val) {
                    //         switch (val.status) {
                    //             case 0:
                    //                 val.status_text = "未支付";
                    //                 break;
                    //             case 1:
                    //                 val.status_text = "已支付";
                    //                 break;
                    //         }
                    //     })
                    // }
                    html = Mustache.render(temp, { items: contents });
                    $(html).appendTo(con.empty());
                    // $("#totalNum").html(data.data.amount_total);
                    $(html).appendTo(con.empty());
                    if (data.data.total_count > 1) {
                        $("#pager").removeClass("hidden");
                        $("#pager").pagination({
                            totalCount: data.data.total_count,
                            pageSize: query.page_size,
                            pageIndex: query.page_index,
                            onSelectPage: function(pageindex, pagesize) {
                                query.page_index = pageindex;
                                Func.queryCloudAllDetailOut(query, temp, con);
                            }
                        });
                    } else {
                        $("#pager").addClass("hidden");
                    }
                } else {
                    Func.errorMsg(data.code); // 返回错误信息
                }
            }).fail(function() {
                layer.msg("请求失败,请联系管理员")
            })
        },

        // 云存储价格信息(国内)
        queryCloudAllPriceIn: function(query, temp, con) {
            $.ajax({
                url: Func.path + "/zvcloud/cardcoupon/price/list/1",
                dataType: 'json',
                type: 'POST',
                beforeSend: function(request) {
                    request.setRequestHeader("access_token", query.access_token);
                },
                contentType: "application/json",
                data: {
                    company_id: query.company_id,
                    section_id: query.section_id
                }
            }).done(function(data) {
                if (data.code == 1000) {
                    var contents = data.data.result_list;
                    var html;
                    console.log(contents);

                    html = Mustache.render(temp, { items: contents });
                    $(html).appendTo(con.empty());
                    // $("#totalNum").html(data.data.amount_total);
                } else {
                    Func.errorMsg(data.code); // 返回错误信息
                }
            }).fail(function() {
                layer.msg("请求失败,请联系管理员")
            })
        },

        // 云存储价格信息(国内)
        queryCloudAllPriceOut: function(query, temp, con) {
            $.ajax({
                url: Func.path + "/zvcloud/cardcoupon/price/list/2",
                dataType: 'json',
                type: 'POST',
                beforeSend: function(request) {
                    request.setRequestHeader("access_token", query.access_token);
                },
                contentType: "application/json",
                data: {
                    company_id: query.company_id,
                    section_id: query.section_id
                }
            }).done(function(data) {
                if (data.code == 1000) {
                    var contents = data.data.result_list;
                    var html;

                    html = Mustache.render(temp, { items: contents });
                    $(html).appendTo(con.empty());
                    // $("#totalNum").html(data.data.amount_total);
                } else {
                    Func.errorMsg(data.code); // 返回错误信息
                }
            }).fail(function() {
                layer.msg("请求失败,请联系管理员")
            })
        },


        // 云存储列表信息(产品)
        queryCloudListInfo: function(query, temp, con) {
            $.ajax({
                url: Func.path + "/zvcloud/analytics/cardcoupon/productByMonth",
                dataType: 'json',
                type: 'POST',
                beforeSend: function(request) {
                    request.setRequestHeader("access_token", query.access_token);
                },
                contentType: "application/json",
                data: {
                    product_id: query.product_id
                }
            }).done(function(data) {
                if (data.code == 1000) {
                    var contents = data.data.result_list;
                    var html;
                    html = Mustache.render(temp, { items: contents });
                    $(html).appendTo(con.empty());
                    $("#totalNum").html("￥ " + data.data.amount_total);
                    $("#foreigntotalNum").html("$ " + data.data.foreign_amount_total);
                } else {
                    Func.errorMsg(data.code); // 返回错误信息
                }
            }).fail(function() {
                layer.msg("请求失败,请联系管理员")
            })
        },

        // 云存储详情信息(产品)
        queryCloudDetailInfo: function(query, temp, con) {
            $.ajax({
                url: Func.path + "/zvcloud/analytics/cardcoupon/payPlatformAndPackage/1",
                dataType: 'json',
                type: 'POST',
                beforeSend: function(request) {
                    request.setRequestHeader("access_token", query.access_token);
                },
                contentType: "application/json",
                data: {
                    product_id: query.product_id,
                    company_id: query.company_id,
                    begin_date: query.begin_date,
                    end_date: query.end_date
                }
            }).done(function(data) {
                if (data.code == 1000) {
                    var html = [];
                    html.push(Mustache.render(temp, data.data));
                    con.html(html.join(''));
                } else {
                    Func.errorMsg(data.code); // 返回错误信息
                }
            }).fail(function() {
                layer.msg("请求失败,请联系管理员")
            })
        },

        // 云存储详情信息(产品)
        queryCloudDetailInfoForeign: function(query, temp, con) {
            $.ajax({
                url: Func.path + "/zvcloud/analytics/cardcoupon/payPlatformAndPackage/2",
                dataType: 'json',
                type: 'POST',
                beforeSend: function(request) {
                    request.setRequestHeader("access_token", query.access_token);
                },
                contentType: "application/json",
                data: {
                    product_id: query.product_id,
                    company_id: query.company_id,
                    begin_date: query.begin_date,
                    end_date: query.end_date
                }
            }).done(function(data) {
                if (data.code == 1000) {
                    var html = [];
                    html.push(Mustache.render(temp, data.data));
                    con.html(html.join(''));
                } else {
                    Func.errorMsg(data.code); // 返回错误信息
                }
            }).fail(function() {
                layer.msg("请求失败,请联系管理员")
            })
        },

        // 应用列表
        queryAppListInfo: function(query, temp, con) {
            $.ajax({
                url: Func.path + "/zvcloud/app/queryAppList",
                dataType: 'json',
                type: 'POST',
                async: false,
                beforeSend: function(request) {
                    request.setRequestHeader("access_token", query.access_token);
                },
                contentType: "application/json",
                data: {
                    product_id: query.product_id,
                    service: query.service
                }
            }).done(function(data) {
                if (data.code == 1000) {
                    var contents = data.data.result_list;
                    var html;
                    if (contents) {
                        if (query.service == 0) {
                            var avsList = "";
                            $.each(contents, function(index, val) {
                                avsList = avsList + "," + val.os_type;
                            });
                            $.cookie('avsList', avsList);
                        } else {
                            var clientList = "";
                            $.each(contents, function(index, val) {
                                clientList = clientList + "," + val.os_type;
                            })
                            $.cookie('clientList', clientList);
                        }

                        $.each(contents, function(index, val) {

                            switch (val.os_type) {
                                case 1:
                                    val.os_type = "Windows";
                                    val.osImg = "icon_win";
                                    break;
                                case 2:
                                    val.os_type = "iOS";
                                    val.osImg = "icon_ios";
                                    break;
                                case 3:
                                    val.os_type = "Mac";
                                    val.osImg = "icon_mac";
                                    break;
                                case 4:
                                    val.os_type = "Android";
                                    val.osImg = "icon_android";
                                    break;
                                case 5:
                                    val.os_type = "Linux";
                                    val.osImg = "icon_linux";
                                    break;
                                case 6:
                                    val.os_type = "Web";
                                    val.osImg = "icon_web";
                                    break;
                                case 7:
                                    val.os_type = "Android Tv";
                                    val.osImg = "icon_android";
                                    break;
                            }
                        })
                    } else {
                        if (query.service == 0) {
                            $.cookie('avsList', "");
                        } else {
                            $.cookie('clientList', "");
                        }
                    }

                    html = Mustache.render(temp, { items: contents });
                    $(html).appendTo(con.empty());


                } else {
                    Func.errorMsg(data.code); // 返回错误信息
                }
            }).fail(function() {
                layer.msg("请求失败,请联系管理员")
            })
        },

        queryNewCount: function(query, temp, con) {
            $.ajax({
                url: Func.path + "/zvcloud/analytics/cardcoupon/income/1",
                dataType: 'json',
                type: 'POST',
                beforeSend: function(request) {
                    request.setRequestHeader("access_token", query.access_token);
                },
                contentType: "application/json",
                data: {
                    begin_date: query.begin_date,
                    end_date: query.end_date,
                    product_id: query.product_id,
                    company_id: query.company_id
                }
            }).done(function(data) {
                if (data.code == 1000) {
                    // 基于准备好的dom，初始化echarts实例
                    var myChart = echarts.init(document.getElementById("new-quantity-chart")),
                        myChart2 = echarts.init(document.getElementById("new-amount-chart"));
                    // 指定图表的配置项和数据
                    var option = {
                        title: {
                            text: '新增收入折线图(销量)'
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data: ['数量']
                        },
                        xAxis: {
                            data: data.data.chart_data.date,
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [{
                            name: '数量',
                            type: 'line',
                            data: data.data.chart_data.quantity_data
                        }]
                    };

                    var option2 = {
                        title: {
                            text: '新增收入折线图(销售额￥)'
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data: ['金额']
                        },
                        xAxis: {
                            data: data.data.chart_data.date,
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [{
                            name: '金额',
                            type: 'line',
                            data: data.data.chart_data.amount_data
                        }]
                    };

                    // 使用刚指定的配置项和数据显示图表。
                    myChart.setOption(option);
                    myChart2.setOption(option2);
                    var contents = data.data.result_list;
                    var html;
                    html = Mustache.render(temp, { items: contents });
                    $(html).appendTo(con.empty());
                } else {
                    Func.errorMsg(data.code); // 返回错误信息
                }
            }).fail(function() {
                layer.msg("请求失败,请联系管理员")
            })
        },
        queryNewCountForeign: function(query, temp, con) {
            $.ajax({
                url: Func.path + "/zvcloud/analytics/cardcoupon/income/2",
                dataType: 'json',
                type: 'POST',
                beforeSend: function(request) {
                    request.setRequestHeader("access_token", query.access_token);
                },
                contentType: "application/json",
                data: {
                    begin_date: query.begin_date,
                    end_date: query.end_date,
                    product_id: query.product_id,
                    company_id: query.company_id
                }
            }).done(function(data) {
                if (data.code == 1000) {
                    // 基于准备好的dom，初始化echarts实例
                    var myChart = echarts.init(document.getElementById("new-quantity-chart")),
                        myChart2 = echarts.init(document.getElementById("new-amount-chart"));
                    // 指定图表的配置项和数据
                    var option = {
                        title: {
                            text: '新增收入折线图(销量)'
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data: ['数量']
                        },
                        xAxis: {
                            data: data.data.chart_data.date,
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [{
                            name: '数量',
                            type: 'line',
                            data: data.data.chart_data.quantity_data
                        }]
                    };

                    var option2 = {
                        title: {
                            text: '新增收入折线图(销售额$)'
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data: ['金额']
                        },
                        xAxis: {
                            data: data.data.chart_data.date,
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [{
                            name: '金额',
                            type: 'line',
                            data: data.data.chart_data.amount_data
                        }]
                    };

                    // 使用刚指定的配置项和数据显示图表。
                    myChart.setOption(option);
                    myChart2.setOption(option2);
                    var contents = data.data.result_list;
                    var html;
                    html = Mustache.render(temp, { items: contents });
                    $(html).appendTo(con.empty());
                } else {
                    Func.errorMsg(data.code); // 返回错误信息
                }
            }).fail(function() {
                layer.msg("请求失败,请联系管理员")
            })
        },

        queryChannelCount: function(query, temp, con) {
            $.ajax({
                url: Func.path + "/zvcloud/analytics/cardcoupon/payPlatform/1",
                dataType: 'json',
                type: 'POST',
                beforeSend: function(request) {
                    request.setRequestHeader("access_token", query.access_token);
                },
                contentType: "application/json",
                data: {
                    begin_date: query.begin_date,
                    end_date: query.end_date,
                    product_id: query.product_id,
                    company_id: query.company_id
                }
            }).done(function(data) {
                if (data.code == 1000) {

                    // 基于准备好的dom，初始化echarts实例
                    var myChart = echarts.init(document.getElementById("channel-quantity-chart"));
                    myChart2 = echarts.init(document.getElementById("channel-amount-chart"));

                    // 指定图表的配置项和数据
                    var option = {
                        title: {
                            text: '渠道收入折线图(销量)'
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data: ['支付宝', '微信', '苹果', 'Paypal', 'Google']
                        },
                        xAxis: {
                            data: data.data.chart_data.date,
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [{
                            name: '支付宝',
                            type: 'line',
                            data: data.data.chart_data.quantity_data.alipay
                        }, {
                            name: '微信',
                            type: 'line',
                            data: data.data.chart_data.quantity_data.weixin
                        }, {
                            name: '苹果',
                            type: 'line',
                            data: data.data.chart_data.quantity_data.ios
                        }, {
                            name: 'Paypal',
                            type: 'line',
                            data: data.data.chart_data.quantity_data.paypal
                        }, {
                            name: 'Google',
                            type: 'line',
                            data: data.data.chart_data.quantity_data.google
                        }]
                    };
                    var option2 = {
                        title: {
                            text: '渠道收入折线图(销售额￥)'
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data: ['支付宝', '微信', '苹果', 'Paypal', 'Google']
                        },
                        xAxis: {
                            data: data.data.chart_data.date,
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [{
                            name: '支付宝',
                            type: 'line',
                            data: data.data.chart_data.amount_data.alipay
                        }, {
                            name: '微信',
                            type: 'line',
                            data: data.data.chart_data.amount_data.weixin
                        }, {
                            name: '苹果',
                            type: 'line',
                            data: data.data.chart_data.amount_data.ios
                        }, {
                            name: 'Paypal',
                            type: 'line',
                            data: data.data.chart_data.amount_data.paypal
                        }, {
                            name: 'Google',
                            type: 'line',
                            data: data.data.chart_data.amount_data.google
                        }]
                    };

                    // 使用刚指定的配置项和数据显示图表。
                    myChart.setOption(option);
                    myChart2.setOption(option2);

                    var contents = data.data.result_list;
                    var html;
                    if (contents) {
                        $.each(contents, function(index, val) {
                            switch (val.pay_platform) {
                                case "weixin":
                                    val.pay_platform = "微信";
                                    break;
                                case "alipay":
                                    val.pay_platform = "支付宝";
                                    break;
                                case "iospay":
                                    val.pay_platform = "苹果支付";
                                    break;
                                case "google":
                                    val.pay_platform = "Google";
                                    break;
                                case "paypal":
                                    val.pay_platform = "Pay Pal";
                                    break;
                            };
                        })
                    }
                    html = Mustache.render(temp, { items: contents });
                    $(html).appendTo(con.empty());
                } else {
                    Func.errorMsg(data.code); // 返回错误信息
                }
            }).fail(function() {
                layer.msg("请求失败,请联系管理员")
            })
        },
        queryChannelCountForeign: function(query, temp, con) {
            $.ajax({
                url: Func.path + "/zvcloud/analytics/cardcoupon/payPlatform/2",
                dataType: 'json',
                type: 'POST',
                beforeSend: function(request) {
                    request.setRequestHeader("access_token", query.access_token);
                },
                contentType: "application/json",
                data: {
                    begin_date: query.begin_date,
                    end_date: query.end_date,
                    product_id: query.product_id,
                    company_id: query.company_id
                }
            }).done(function(data) {
                if (data.code == 1000) {

                    // 基于准备好的dom，初始化echarts实例
                    var myChart = echarts.init(document.getElementById("channel-quantity-chart"));
                    myChart2 = echarts.init(document.getElementById("channel-amount-chart"));

                    // 指定图表的配置项和数据
                    var option = {
                        title: {
                            text: '渠道收入折线图(销量)'
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data: ['支付宝', '微信', '苹果', 'Paypal', 'Google']
                        },
                        xAxis: {
                            data: data.data.chart_data.date,
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [{
                            name: '支付宝',
                            type: 'line',
                            data: data.data.chart_data.quantity_data.alipay
                        }, {
                            name: '微信',
                            type: 'line',
                            data: data.data.chart_data.quantity_data.weixin
                        }, {
                            name: '苹果',
                            type: 'line',
                            data: data.data.chart_data.quantity_data.ios
                        }, {
                            name: 'Paypal',
                            type: 'line',
                            data: data.data.chart_data.quantity_data.paypal
                        }, {
                            name: 'Google',
                            type: 'line',
                            data: data.data.chart_data.quantity_data.google
                        }]
                    };
                    var option2 = {
                        title: {
                            text: '渠道收入折线图(销售额$)'
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data: ['支付宝', '微信', '苹果', 'Paypal', 'Google']
                        },
                        xAxis: {
                            data: data.data.chart_data.date,
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [{
                            name: '支付宝',
                            type: 'line',
                            data: data.data.chart_data.amount_data.alipay
                        }, {
                            name: '微信',
                            type: 'line',
                            data: data.data.chart_data.amount_data.weixin
                        }, {
                            name: '苹果',
                            type: 'line',
                            data: data.data.chart_data.amount_data.ios
                        }, {
                            name: 'Paypal',
                            type: 'line',
                            data: data.data.chart_data.amount_data.paypal
                        }, {
                            name: 'Google',
                            type: 'line',
                            data: data.data.chart_data.amount_data.google
                        }]
                    };

                    // 使用刚指定的配置项和数据显示图表。
                    myChart.setOption(option);
                    myChart2.setOption(option2);

                    var contents = data.data.result_list;
                    var html;
                    if (contents) {
                        $.each(contents, function(index, val) {
                            switch (val.pay_platform) {
                                case "weixin":
                                    val.pay_platform = "微信";
                                    break;
                                case "alipay":
                                    val.pay_platform = "支付宝";
                                    break;
                                case "iospay":
                                    val.pay_platform = "苹果支付";
                                    break;
                                case "google":
                                    val.pay_platform = "Google";
                                    break;
                                case "paypal":
                                    val.pay_platform = "Pay Pal";
                                    break;
                            };
                        })
                    }
                    html = Mustache.render(temp, { items: contents });
                    $(html).appendTo(con.empty());
                } else {
                    Func.errorMsg(data.code); // 返回错误信息
                }
            }).fail(function() {
                layer.msg("请求失败,请联系管理员")
            })
        },

        queryPackageCount: function(query, temp, con) {
            $.ajax({
                url: Func.path + "/zvcloud/analytics/cardcoupon/package/1",
                dataType: 'json',
                type: 'POST',
                beforeSend: function(request) {
                    request.setRequestHeader("access_token", query.access_token);
                },
                contentType: "application/json",
                data: {
                    begin_date: query.begin_date,
                    end_date: query.end_date,
                    product_id: query.product_id,
                    company_id: query.company_id
                }
            }).done(function(data) {
                if (data.code == 1000) {
                    // 基于准备好的dom，初始化echarts实例
                    var myChart = echarts.init(document.getElementById("package-quantity-chart")),
                        myChart2 = echarts.init(document.getElementById("package-amount-chart"));

                    // 指定图表的配置项和数据
                    var option = {
                        title: {
                            text: '套餐收入折线图(销量)'
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data: ['月付', '季付', '半年付', '年付']
                        },
                        xAxis: {
                            data: data.data.chart_data.date,
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [{
                            name: '月付',
                            type: 'line',
                            data: data.data.chart_data.quantity_data.month
                        }, {
                            name: '季付',
                            type: 'line',
                            data: data.data.chart_data.quantity_data.quarter
                        }, {
                            name: '半年付',
                            type: 'line',
                            data: data.data.chart_data.quantity_data.half
                        }, {
                            name: '年付',
                            type: 'line',
                            data: data.data.chart_data.quantity_data.year
                        }]
                    };

                    // 指定图表的配置项和数据
                    var option2 = {
                        title: {
                            text: '套餐收入折线图(销售额￥)'
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data: ['月付', '季付', '半年付', '年付']
                        },
                        xAxis: {
                            data: data.data.chart_data.date,
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [{
                            name: '月付',
                            type: 'line',
                            data: data.data.chart_data.amount_data.month
                        }, {
                            name: '季付',
                            type: 'line',
                            data: data.data.chart_data.amount_data.quarter
                        }, {
                            name: '半年付',
                            type: 'line',
                            data: data.data.chart_data.amount_data.half
                        }, {
                            name: '年付',
                            type: 'line',
                            data: data.data.chart_data.amount_data.year
                        }]
                    };

                    // 使用刚指定的配置项和数据显示图表。
                    myChart.setOption(option);
                    myChart2.setOption(option2);
                    var contents = data.data.result_list;
                    var html;
                    if (contents) {
                        $.each(contents, function(index, val) {
                            switch (val.package_name) {
                                case "month":
                                    val.package_name = "月付";
                                    break;
                                case "quarter":
                                    val.package_name = "季付";
                                    break;
                                case "half":
                                    val.package_name = "半年付";
                                    break;
                                case "year":
                                    val.package_name = "年付";
                                    break;
                            };
                        })
                    }
                    html = Mustache.render(temp, { items: contents });
                    $(html).appendTo(con.empty());
                } else {
                    Func.errorMsg(data.code); // 返回错误信息
                }
            }).fail(function() {
                layer.msg("请求失败,请联系管理员")
            })
        },
        queryPackageCountForeign: function(query, temp, con) {
            $.ajax({
                url: Func.path + "/zvcloud/analytics/cardcoupon/package/2",
                dataType: 'json',
                type: 'POST',
                beforeSend: function(request) {
                    request.setRequestHeader("access_token", query.access_token);
                },
                contentType: "application/json",
                data: {
                    begin_date: query.begin_date,
                    end_date: query.end_date,
                    product_id: query.product_id,
                    company_id: query.company_id
                }
            }).done(function(data) {
                if (data.code == 1000) {
                    // 基于准备好的dom，初始化echarts实例
                    var myChart = echarts.init(document.getElementById("package-quantity-chart")),
                        myChart2 = echarts.init(document.getElementById("package-amount-chart"));

                    // 指定图表的配置项和数据
                    var option = {
                        title: {
                            text: '套餐收入折线图(销量)'
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data: ['月付', '季付', '半年付', '年付']
                        },
                        xAxis: {
                            data: data.data.chart_data.date,
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [{
                            name: '月付',
                            type: 'line',
                            data: data.data.chart_data.quantity_data.month
                        }, {
                            name: '季付',
                            type: 'line',
                            data: data.data.chart_data.quantity_data.quarter
                        }, {
                            name: '半年付',
                            type: 'line',
                            data: data.data.chart_data.quantity_data.half
                        }, {
                            name: '年付',
                            type: 'line',
                            data: data.data.chart_data.quantity_data.year
                        }]
                    };

                    // 指定图表的配置项和数据
                    var option2 = {
                        title: {
                            text: '套餐收入折线图(销售额$)'
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data: ['月付', '季付', '半年付', '年付']
                        },
                        xAxis: {
                            data: data.data.chart_data.date,
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [{
                            name: '月付',
                            type: 'line',
                            data: data.data.chart_data.amount_data.month
                        }, {
                            name: '季付',
                            type: 'line',
                            data: data.data.chart_data.amount_data.quarter
                        }, {
                            name: '半年付',
                            type: 'line',
                            data: data.data.chart_data.amount_data.half
                        }, {
                            name: '年付',
                            type: 'line',
                            data: data.data.chart_data.amount_data.year
                        }]
                    };

                    // 使用刚指定的配置项和数据显示图表。
                    myChart.setOption(option);
                    myChart2.setOption(option2);
                    var contents = data.data.result_list;
                    var html;
                    if (contents) {
                        $.each(contents, function(index, val) {
                            switch (val.package_name) {
                                case "month":
                                    val.package_name = "月付";
                                    break;
                                case "quarter":
                                    val.package_name = "季付";
                                    break;
                                case "half":
                                    val.package_name = "半年付";
                                    break;
                                case "year":
                                    val.package_name = "年付";
                                    break;
                            };
                        })
                    }
                    html = Mustache.render(temp, { items: contents });
                    $(html).appendTo(con.empty());
                } else {
                    Func.errorMsg(data.code); // 返回错误信息
                }
            }).fail(function() {
                layer.msg("请求失败,请联系管理员")
            })
        },

        // 修改公司信息
        updateCompanyInfo: function(query) {
            $.ajax({
                url: Func.path + "/zvcloud/company/update",
                dataType: 'json',
                type: 'POST',
                beforeSend: function(request) {
                    request.setRequestHeader("access_token", query.access_token);
                },
                contentType: "application/json",
                data: {
                    company_address: query.company_address,
                    company_name: query.company_name,
                    company_website: query.company_website,
                    contact_person: query.contact_person
                }
            }).done(function(data) {
                if (data.code == 1000) {
                    layer.msg("修改成功");
                    top.$(".r-frame").attr("src", top.$(".r-frame").attr("src"));
                } else {
                    Func.errorMsg(data.code); // 返回错误信息
                }
            }).fail(function() {
                layer.msg("请求失败,请联系管理员")
            })
        },

        // 修改产品信息
        updateProductInfo: function(query) {
            $.ajax({
                url: Func.path + "/zvcloud/product/update",
                dataType: 'json',
                type: 'POST',
                beforeSend: function(request) {
                    request.setRequestHeader("access_token", query.access_token);
                },
                contentType: "application/json",
                data: {
                    product_id: query.product_id,
                    product_name: query.product_name,
                    product_type: query.product_type,
                    logo_uri: query.logo_uri
                }
            }).done(function(data) {
                if (data.code == 1000) {
                    layer.msg("修改成功");
                    setTimeout(function() {
                        top.$(".r-frame").attr("src", top.$(".r-frame").attr("src"));
                        top.layer.closeAll();
                    }, 1000);

                } else {
                    Func.errorMsg(data.code); // 返回错误信息
                }
            }).fail(function() {
                layer.msg("请求失败,请联系管理员")
            })
        },

        // 修改价格信息(国内)
        updatePriceIn: function(query, temp, con) {
            $.ajax({
                url: Func.path + "/zvcloud/cardcoupon/price/update/1",
                dataType: 'json',
                type: 'POST',
                beforeSend: function(request) {
                    request.setRequestHeader("access_token", query.access_token);
                },
                contentType: "application/json",
                data: {
                    company_id: query.company_id,
                    show_price: query.show_price,
                    sales_price: query.sales_price,
                    commodity_id: query.commodity_id,
                    section_id: query.section_id
                }
            }).done(function(data) {
                if (data.code == 1000) {
                    Func.queryCloudAllPriceIn(query, temp, con);
                } else {
                    Func.errorMsg(data.code); // 返回错误信息
                }
            }).fail(function() {
                layer.msg("请求失败,请联系管理员")
            })
        },

        // 修改价格信息(国外)
        updatePriceOut: function(query, temp, con) {
            $.ajax({
                url: Func.path + "/zvcloud/cardcoupon/price/update/2",
                dataType: 'json',
                type: 'POST',
                beforeSend: function(request) {
                    request.setRequestHeader("access_token", query.access_token);
                },
                contentType: "application/json",
                data: {
                    company_id: query.company_id,
                    show_price: query.show_price,
                    sales_price: query.sales_price,
                    commodity_id: query.commodity_id,
                    section_id: query.section_id
                }
            }).done(function(data) {
                if (data.code == 1000) {
                    Func.queryCloudAllPriceOut(query, temp, con);
                } else {
                    Func.errorMsg(data.code); // 返回错误信息
                }
            }).fail(function() {
                layer.msg("请求失败,请联系管理员")
            })
        },

        // 新增产品
        addProduct: function(query) {
            $.ajax({
                url: Func.path + "/zvcloud/product/register",
                dataType: 'json',
                type: 'POST',
                beforeSend: function(request) {
                    request.setRequestHeader("access_token", query.access_token);
                },
                contentType: "application/json",
                data: {

                    auth_type: query.auth_type,
                    private_level: query.private_level,
                    product_name: query.product_name,
                    product_type: query.product_type,
                    logo_uri: query.logo_uri

                }
            }).done(function(data) {
                if (data.code == 1000) {
                    parent.location.reload();
                } else {
                    Func.errorMsg(data.code); // 返回错误信息
                }
            }).fail(function() {
                layer.msg("请求失败,请联系管理员")
            })
        },

        // 新增应用
        addApp: function(query) {
            $.ajax({
                url: Func.path + "/zvcloud/app/register",
                dataType: 'json',
                type: 'POST',
                beforeSend: function(request) {
                    request.setRequestHeader("access_token", query.access_token);
                },
                contentType: "application/json",
                data: {
                    product_id: query.product_id,
                    service: query.service,
                    os_type: query.os_type
                }
            }).done(function(data) {
                if (data.code == 1000) {
                    layer.msg("新增成功");
                    setTimeout(function() {
                        top.location.href = "productManage.html";
                        // top.layer.closeAll();
                    }, 1000);

                } else {
                    Func.errorMsg(data.code); // 返回错误信息
                }
            }).fail(function() {
                layer.msg("请求失败,请联系管理员")
            })
        },

        // 新增License
        addLicense: function(query) {
            $.ajax({
                url: Func.path + "/zvcloud/license/batchAddLicenseByManual",
                dataType: 'json',
                type: 'POST',
                beforeSend: function(request) {
                    request.setRequestHeader("access_token", query.access_token);
                },
                contentType: "application/json",
                data: {
                    product_id: query.product_id,
                    license_list: query.license_list
                }
            }).done(function(data) {
                if (data.code == 1000) {

                    layer.msg("激活完成,成功" + data.data.success_count + "个,失败" + data.data.fail_count + "个,重复" + data.data.repeat_count + "个");
                    setTimeout(function() {
                        top.$(".r-frame").attr("src", top.$(".r-frame").attr("src"));
                    }, 1000)

                } else {
                    layer.msg("激活失败");
                    setTimeout(function() {
                            top.$(".r-frame").attr("src", top.$(".r-frame").attr("src"));
                        }, 1000)
                        // Func.errorMsg(data.code); // 返回错误信息
                }
            }).fail(function() {
                layer.msg("请求失败,请联系管理员")
            })
        },

        // 手机验证倒计时
        setTime: function(time) {
            if (time == 0) {
                // $("#send").attr("disabled",false);
                $("#send").html("发送验证码");
            } else {
                // $("#send").attr("disabled", true);
                $("#send").html(time);
                time--;
                setTimeout(function() {
                    Func.setTime(time);
                }, 1000);
            }
        },

        // 删除图片
        deleteLogo: function(query) {
            $.ajax({
                url: Func.path + "/zvcloud/product/deleteProductImg",
                dataType: 'json',
                type: 'POST',
                async: false,
                beforeSend: function(request) {
                    request.setRequestHeader("access_token", query.access_token);
                },
                contentType: "application/json",
                data: {
                    logo_uri: query.logo_uri
                }
            }).done(function(data) {
                if (data.code == 1000) {
                    console.log(data);
                } else {
                    Func.errorMsg(data.code); // 返回错误信息
                }
            }).fail(function() {
                layer.msg("请求失败,请联系管理员")
            })
        },

        getUrlParams: function(prop) {
            var params = {},
                query = win.location.search.substring(1),
                arr = query.split('&'),
                rt;

            $.each(arr, function(i, item) {
                var tmp = item.split('='),
                    key = tmp[0],
                    val = decodeURIComponent(tmp[1]);

                if (typeof params[key] == 'undefined') {
                    params[key] = val;
                } else if (typeof params[key] == 'string') {
                    params[key] = [params[key], val];
                } else {
                    params[key].push(val);
                }
            });

            rt = prop ? params[prop] : params;

            return rt;
        },

        // 去除html标签中的换行符和空格
        clearHtml: function(html) {
            return html.replace(/(\r\n|\n|\r)/g, "")
                .replace(/[\t ]+\</g, "<")
                .replace(/\>[\t ]+\</g, "><")
                .replace(/\>[\t ]+$/g, ">");
        },

        errorMsg: function(code) {
            switch (code) {
                case 2008:
                    top.layer.msg("登录信息失效,请重新登陆");
                    setTimeout(function() {
                        top.location.href = "index.html";
                    }, 1000);
                    break;
                case 2001:
                    top.layer.msg("参数无效,请填写正确的参数或联系管理员");
                    break;
                case 2002:
                    top.layer.msg("验证码错误,请重新输入");
                    break;
                case 5005:
                    top.layer.msg("图片验证码错误,请重新输入");
                    break;
                case 9999:
                    top.layer.msg("系统异常,请联系管理员");
                    break;
                case 2006:
                    top.layer.msg("密码错误,请重新输入");
                    break;
                case 5001:
                    top.layer.msg("数据不存在");
                    break;
                case 5003:
                    top.layer.msg("超出剩余数量,请重新上传");
                    break;
                case 2201:
                    top.layer.msg("账户不存在");
                    break;
                case 2103:
                    top.layer.msg("账户已经存在");
                    break;
                case 2102:
                    top.layer.msg("邮箱已经存在");
                    break;
            }
        }
    };
}(this, jQuery));
