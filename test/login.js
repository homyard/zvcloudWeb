$.mockjax({
    url: loginUrl,
    dataType: 'json',
    responseTime: [100, 300],
    response: function(settings) {

        this.responseText = [{
            "code": 1000,
            "data":{
                "token":"11002016080320161301470226573461"
            },
            "desc":"登录成功！"
        }];
    }
});