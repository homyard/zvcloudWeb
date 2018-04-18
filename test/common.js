$.mockjax({
    url: tokenUrl,
    dataType: 'json',
    responseTime: [100, 300],
    response: function(settings) {

        this.responseText = [{
            "code": 1000,
            "data": {
                "username": "XXXXX",
                "token": "11002016080417473901470304059316",
                "id": "043c36a94f424cd797b357905ca779aa"
            }
        }];
    }
});

$.mockjax({
    url: loginOutUrl,
    dataType: 'json',
    responseTime: [100, 300],
    response: function(settings) {

        this.responseText = [{
            "code": 1000,
        }];
    }
});
