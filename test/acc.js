$.mockjax({
    url: getAccountInfoUrl,
    dataType: 'json',
    responseTime: [100, 300],
    response: function(settings) {

        this.responseText = [{
            "code": 1000,
            "data": {
                "id": "043c36a94f424cd797b357905ca779aa",
                "email": "xiaohai.zhang@ichano.com",
                "username": "hanyangwei",
                "companyname": "南京众云",
                "phone": "15062287872",
                "companywebsite": "http: //dev.ichano.cn",
                "companykey": "1434611175957",
                "companyid": "b293d1d3faa642ef8e54e44bb705bd89",
                "conperson": "wutian1964",
                "companyaddress": ""
            }

        }];
    }
});

$.mockjax({
    url: sendChangeInfoUrl,
    dataType: 'json',
    responseTime: [100, 300],
    response: function(settings) {

        this.responseText = [{
            "status": "true"
        }];
    }
})
