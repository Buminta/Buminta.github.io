## Client API

`Path: ./app/controllers/client_controller.rb`

* Share marker
```sh
Method: share_marker
Route: GET http://localhost:3000/s/m/:marker_id
Success: Open application with data below
{
    "action": "MK_SHARE",
    "marker": {
        "description": {
            "address": null,
            "district": null,
            "info_review": "123",
            "number": null,
            "province": null,
            "street": null
        },
        "like_count": 0,
        "lng_lat": [
            105.73563743800008,
            20.326369529000033
        ],
        "name": "Giới hạn tốc độ 50",
        "marker_type": {
            "code": "GTD",
            "description": null,
            "name": "Giới hạn tốc độ"
        },
        "_id": "5497ec2e5468615b41000000",
        "marker_type_id": "5497ec2a5468615b3d120000",
        "user_id": "5497ec1a5468615b38000000"
    }
}
```


* Share location
```sh
Method: share_location
Route: GET http://localhost:3000/s/l/:lng/:lat(/:name)(/:user_id)
Success: Open application with data below
{
    "action": "MK_CUSTOM",
    "name": "Giới hạn tốc độ",
    "lng_lat": [
        105.73563743800008,
        20.326369529000033
    ],
    "location": {
        "success": true,
        "result": "Xã Bát Mọt, Huyện Thường Xuân, Thanh Hóa"
    },
    "user": {
        "avatar": "62feb9ac0eb43067eec9a2d4948d5e8e1a8379d4.pmint.jpg",
        "full_name": null,
        "is_banned": false,
        "total_like": 0,
        "username": "root",
        "_id": "5497ec1a5468615b38000000"
    }
}
```


* Share app
```sh
Method: install
Route: GET http://localhost:3000/s/install
Success: Open store to install application
```

* Version check
```sh
Method: check_version
Route: GET http://localhost:3000/version/check
Params: version, platform
Success:
{
    message: "Phiên bản đã được cập nhật mới nhất, v1.3 !",
    version: "1.3"
}
```
