(function($) {

    var infoQuery = {
        access_token: $.cookie("access_token"),
        product_id: $.cookie("product_id")
    }

    Func.queryProductForEdit(infoQuery);

    var editQuery = {
        access_token: $.cookie("access_token"),
        product_id: $.cookie("product_id"),
        product_type: $("#productList").val(),
        product_name: $("#pro-name").val(),
        logo_uri: $("#logo_view").attr("src")
    }

    $("#r-num").html($("#pro-name").val().length);

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

    // 下拉菜单初始化
    $("#productList").selectpick({
        container: "#pro-box",
        height: 36,
        width: 317,
        disabled: false,
        onSelect: function(value, text) {
            editQuery.product_type = value;
        }
    });

    $("#authList").selectpick({
        container: "#auth-box",
        height: 36,
        width: 317,
        disabled: true,
        onSelect: function(value, text) {
        }
    });

    $("#privacyList").selectpick({
        container: "#pri-box",
        height: 36,
        width: 317,
        disabled: true,
        onSelect: function(value, text) {
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
            access_token: editQuery.access_token,
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

    });
    uploader.on('uploadProgress', function(file, percentage) {});

    uploader.on('uploadSuccess', function(file, data) {
        
        //返回图片地址，由后台定义
        $("#logo_view").attr("src", data.data.logo_path);
    });

    uploader.on('uploadError', function(file) {
        layer.alert("上传错误！", {
            title: "提示信息",
            icon: 0,
            skin: 'layer-ext-alert'
        })
    });

    $("#confirm").on("click", function() {
        editQuery.logo_uri = $("#logo_view").attr("src");
        editQuery.product_name = $("#pro-name").val();

        if (editQuery.product_name == "") {
            layer.msg("应用名称不得为空");
        } else if (editQuery.product_type == -1) {
            layer.msg("请选择产品类型");
        } else {
            Func.updateProductInfo(editQuery);
        }
    });
    $("#cancel").on("click", function() {
        if($("#logo_view").attr("src") != editQuery.logo_uri) {
            Func.deleteLogo(editQuery);
        }

        top.layer.closeAll();

    });

}(jQuery));
