```toml
name = 'Create'
description = 'Dodaj kierunek'
method = 'POST'
url = '{{baseUrl}}api/programs/create'
sortWeight = 500000
id = '964aa19f-d471-405f-ac60-0c8e34e8406f'

[auth.bearer]
token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImxvZ2luIjoiQWRtaW4iLCJlbWFpbCI6ImxvbEBnbWFpbC5jb20iLCJyb2xlIjoiRW1wbG95ZWUiLCJmaXJzdE5hbWUiOiJKYWt1YiIsImxhc3ROYW1lIjoiRyIsImlhdCI6MTczNDEwMTQ4NSwiZXhwIjoxNzM0MTA4Njg1fQ.SxoWcY7hWFyqSPMT4uaIy7sTGXjz7O2QvCQBzXVxKZk'

[body]
type = 'JSON'
raw = '''
{
  "name": "Technologie Informacyjne",
  "code": "TIA",
  "facultyId": 1,
  "description": "Jednolite studia magisterskie - Cyberbezpieczeństwo",
  "degreeLevel": "Bachelor",
  "duration": 5,
  "isActive": true
}'''
```
