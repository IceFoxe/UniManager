```toml
name = 'Search'
description = 'Szukaj studentów'
method = 'GET'
url = '{{baseUrl}}api/students?name=J&facultyId=0&studentCode=0&page=1&limit=10'
sortWeight = 1250000
id = '2c476b35-e509-4caa-b0e9-474fb501561f'

[[queryParams]]
key = 'name'
value = 'J'

[[queryParams]]
key = 'facultyId'
value = '0'

[[queryParams]]
key = 'studentCode'
value = '0'

[[queryParams]]
key = 'page'
value = '1'

[[queryParams]]
key = 'limit'
value = '10'

[[headers]]
key = 'authToken'
value = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImxvZ2luIjoiQWRtaW4iLCJlbWFpbCI6ImxvbEBnbWFpbC5jb20iLCJyb2xlIjoiRW1wbG95ZWUiLCJmaXJzdE5hbWUiOiJKYWt1YiIsImxhc3ROYW1'

[auth.bearer]
token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImxvZ2luIjoiQWRtaW4iLCJlbWFpbCI6ImxvbEBnbWFpbC5jb20iLCJyb2xlIjoiRW1wbG95ZWUiLCJmaXJzdE5hbWUiOiJKYWt1YiIsImxhc3ROYW1lIjoiRyIsImlhdCI6MTczNDA4MDk2NSwiZXhwIjoxNzM0MDg4MTY1fQ.Vlhbtq5YoC4DpaD5Dc9xnvAf4Tfs5z_c8FGpbwiD8fM'
```
