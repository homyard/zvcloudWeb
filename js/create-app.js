(function($) {

    // 定义产品创建参数
    var createQuery = {
        access_token: $.cookie("access_token"),
        auth_type: 1,
        product_type: -1,
        private_level: -1,
        logo_uri:"",
        product_name:""
    }

    // 检测用户名长度
    $("#pro-name").on("keyup", function() {
        var length = $(this).val().length,
            con = $(this).val();
        if (length <= 30) {
            $("#r-num").html(length);
        } else {
            $("#r-num").html("30");
            $(this).val(con.substr(0, 30));
        }
    });

    // 强制选中license授权,服务器授权未开放
    $.each($("#authList option"), function() {
        if ($(this).val() == 1) {
            $(this).attr("selected", true);
        }
    });

    // 下拉菜单初始化
    $("#productList").selectpick({
        container: "#pro-box",
        height: 36,
        width: 317,
        disabled: false,
        onSelect: function(value, text) {
            createQuery.product_type = value;
        }
    });

    $("#authList").selectpick({
        container: "#auth-box",
        height: 36,
        width: 317,
        disabled: true,
        onSelect: function(value, text) {
            createQuery.auth_type = value;
        }
    });

    $("#privacyList").selectpick({
        container: "#pri-box",
        height: 36,
        width: 317,
        disabled: false,
        onSelect: function(value, text) {
            createQuery.private_level = value;
        }
    });



    // logo 上传
    var allowType = ['jpg', 'jpeg', 'bmp', 'png'];
    var uploader = WebUploader.create({
        auto: true,
        swf: '../plugins/webuploader/Uploader.swf',
        server: Func.path + "/zvcloud/product/uploadProductImg",
        pick: {
            id: '#logoUploader',
            multiple: false
        },
        formData: {
            access_token: createQuery.access_token,
        },
        duplicate: true,
        fileVal: "productLogo",
        accept: {
            extensions: allowType.join(",")
        }
    });

    // uploader.on("uploadBeforeSend", function(headers) {
    //     console.log(headers);
    //     headers.auth_token = token;
    // });

    uploader.on('beforeFileQueued', function(file) {
        var ext = file.name.substr(file.name.lastIndexOf(".") + 1).toLowerCase(),
            size = file.size;
        if ($.inArray(ext, allowType) == -1) {
            layer.alert("选择的格式不正确！", {
                title: "提示信息",
                icon: 0,
                skin: 'layer-ext-alert'
            })
            return false;
        }
        if (size > 1024 * 1024) {
            layer.alert("上传图片大小不能超过1M！", {
                title: "提示信息",
                icon: 0,
                skin: 'layer-ext-alert'
            })
            return false;
        }
    });

    uploader.on('uploadStart', function(file) {
        console.log("start");
    });
    uploader.on('uploadProgress', function(file, percentage) {
        console.log("progress");
    });

    uploader.on('uploadSuccess', function(file, data) {
        if (data.code == 1000) {
            //返回图片地址，由后台定义
            $("#logo_view").attr("src", data.data.logo_path);
        } else {
            Func.errorMsg(data.code); // 返回错误信息
        }

    });

    uploader.on('uploadError', function(file) {
        console.log("error")
        layer.alert("上传错误！", {
            title: "提示信息",
            icon: 0,
            skin: 'layer-ext-alert'
        })
    });

    $("#confirm").on("click", function() {

        createQuery.logo_uri = $("#logo_view").attr("src");
        createQuery.product_name = $("#pro-name").val();
        
        var nullcheck = /\s/;

        console.log(createQuery)
        if (createQuery.product_name == "") {
            layer.msg("应用名称不得为空");
        } else if (nullcheck.exec(createQuery.product_name) != null) {
            layer.msg("应用名称不允许出现空格");
        } else if (createQuery.product_type == -1) {
            layer.msg("请选择产品类型");
        } else if (createQuery.private_level == -1) {
            layer.msg("请选择隐私级别");
        } else if (createQuery.logo_uri == "") {
            layer.msg("请上传应用图标");
        } else {
            Func.addProduct(createQuery);
        }
    });

    $("#cancel").on("click", function() {
        createQuery.logo_uri = $("#logo_view").attr("src");
        if(createQuery.logo_uri != "") {
            Func.deleteLogo(createQuery);
        }
        top.layer.closeAll();
    });

}(jQuery));
