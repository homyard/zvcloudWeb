// 获取app列表
$.mockjax({
    url: getAppInfoUrl,
    dataType: 'json',
    responseTime: [100, 300],
    response: function(settings) {
        this.responseText = [{
            "code": 1000,
            "data": {
                "total": 20,
                "productList": [{
                    "allActivityNum": 164651,
                    "companyId": "039185d6e0354a47b10a5d8fe6d23248",
                    "id": "4f7ee28fd9664b53a9679a38504886e1",
                    "logo": "/developer/cloudcooperation/picture/andy_20151127125047_secondarytile.png",
                    "onLineNum": 112,
                    "productName": "掌上看家",
                    "todayActivityNum": 12
                }, {
                    "allActivityNum": 164651,
                    "companyId": "039185d6e0354a47b10a5d8fe6d23248",
                    "id": "5939d7543e3f4da682a04b5d3b9abd87",
                    "onLineNum": 112,
                    "productName": "testproduct",
                    "todayActivityNum": 12
                }, {
                    "allActivityNum": 164651,
                    "companyId": "039185d6e0354a47b10a5d8fe6d23248",
                    "id": "c09781091e69476ba314edd78aaadce0",
                    "onLineNum": 112,
                    "productName": "掌上看车",
                    "todayActivityNum": 12
                }, {
                    "allActivityNum": 164651,
                    "companyId": "039185d6e0354a47b10a5d8fe6d23248",
                    "id": "5939d7543e3f4da682a04b5d3b9abd87",
                    "onLineNum": 112,
                    "productName": "testproduct",
                    "todayActivityNum": 12
                }, {
                    "allActivityNum": 164651,
                    "companyId": "039185d6e0354a47b10a5d8fe6d23248",
                    "id": "c09781091e69476ba314edd78aaadce0",
                    "onLineNum": 112,
                    "productName": "掌上看车",
                    "todayActivityNum": 12
                }]
            },
            "desc": "查询成功！"
        }];
    }
})
