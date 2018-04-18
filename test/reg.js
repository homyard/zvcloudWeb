$.mockjax({
    url: verifcodeUrl,
    dataType: 'json',
    responseTime: [100, 300],
    response: function(settings) {

        this.responseText = [{
            "code": 1000,
            "data": {
                "verifCode": "123456"
            },
            "desc": "发送成功！"
        }];
    }
});


$.mockjax({
    url: sendUrl,
    dataType: 'json',
    responseTime: [100, 300],
    response: function(settings) {

        this.responseText = [{
            "code": 1000,
            "data": {
                "token": "11002016080417473901470304059316"
            },
            "desc": "用户注册成功！"

        }];
    }
});
