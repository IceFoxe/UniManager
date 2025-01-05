```toml
name = 'Update'
description = 'Edytuj ocenę'
method = 'PUT'
url = '{{baseUrl}}/api/grades/update/:id'
sortWeight = 4500000
id = '305eba6a-860b-4173-8243-a7ebca5c130b'

[[pathVariables]]
key = 'id'
value = '1'

[body]
type = 'JSON'
raw = '''
{
  "student_id": 2,
  "value": 4.5,
  "description": "Jakis opis"
}'''
```
