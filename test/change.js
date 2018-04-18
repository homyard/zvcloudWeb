$.mockjax({
    url: changePwdUrl,
    dataType: 'json',
    responseTime: [100, 300],
    response: function(settings) {

        this.responseText = [{
            "code": 1000,
        }];
    }
})

$.mockjax({
    url: getYzmUrl,
    dataType: 'json',
    responseTime: [100, 300],
    response: function(settings) {

        this.responseText = [{
            "code": 1000,
            "data": {
                "verifyCode": "7412"
            }

        }];
    }
})
