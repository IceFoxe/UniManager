```toml
name = 'Create'
description = 'Dodaj studenta'
method = 'POST'
url = '{{baseUrl}}api/students/create'
sortWeight = 1000000
id = 'fad76c65-de36-4a88-a64e-cf7cee4a4221'

[auth.bearer]
token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImxvZ2luIjoiQWRtaW4iLCJlbWFpbCI6ImxvbEBnbWFpbC5jb20iLCJyb2xlIjoiRW1wbG95ZWUiLCJmaXJzdE5hbWUiOiJKYWt1YiIsImxhc3ROYW1lIjoiRyIsImlhdCI6MTczNDA5MTY4NywiZXhwIjoxNzM0MDk4ODg3fQ.Eg7ZYXQujeTVp-enlXJNB18fVJkgW13dh0RoU6UBGHQ'

[body]
type = 'JSON'
raw = '''
{
  "first_name": "Wiktor",
  "last_name": "Siepka",
  "student_number": "272345",
  "program_id": 1,
  "semester": 1,
  "enrollment_date": "2024-01-15",
  "expected_graduation": "2028-01-15"
}'''
```
