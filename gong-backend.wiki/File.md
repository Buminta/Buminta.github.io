## File API

`Path: ./app/controllers/file_controller.rb`

* Upload image
```sh
Method: upload
Route: POST http://localhost:3000/files
Params: file(type: file)
Success:
{
    "success": true,
    "message": "Tải lên thành công",
    "data": "62feb9ac0eb43067eec9a2d4948d5e8e1a8379d4.1pmint.jpg"
}
```
* Get image
```sh
Method: stream
Route: GET http://localhost:3000/files/:file_name
Params: file_name
Success:

(IMG DATA)

```