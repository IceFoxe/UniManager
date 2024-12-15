```toml
name = 'Search'
description = 'Szukaj studentów'
method = 'GET'
url = '{{baseUrl}}/api/students?name&facultyId&courseId&studentCode&page=1&limit=10'
sortWeight = 1250000
id = '2c476b35-e509-4caa-b0e9-474fb501561f'

[[queryParams]]
key = 'name'

[[queryParams]]
key = 'facultyId'

[[queryParams]]
key = 'courseId'

[[queryParams]]
key = 'studentCode'

[[queryParams]]
key = 'page'
value = '1'

[[queryParams]]
key = 'limit'
value = '10'

[[headers]]
key = 'authToken'
value = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImxvZ2luIjoiQWRtaW4iLCJlbWFpbCI6ImxvbEBnbWFpbC5jb20iLCJyb2xlIjoiRW1wbG95ZWUiLCJmaXJzdE5hbWUiOiJKYWt1YiIsImxhc3ROYW1'
```
