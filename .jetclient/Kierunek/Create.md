```toml
name = 'Create'
description = 'Dodaj kierunek'
method = 'POST'
url = '{{baseUrl}}/api/programs/create'
sortWeight = 500000
id = '964aa19f-d471-405f-ac60-0c8e34e8406f'

[body]
type = 'JSON'
raw = '''
{
  "name": "Zarzadzanie",
  "code": "ZARZ",
  "facultyId": 4,
  "description": "Jednolite studia magisterskie - Zarzadzanie",
  "degreeLevel": "Bachelor",
  "duration": 5,
  "isActive": true
}'''
```
