```toml
name = 'Update'
description = 'Edytuj wydział'
method = 'PUT'
url = '{{baseUrl}}/api/faculties/:id'
sortWeight = 1750000
id = '92e78cc6-bfd9-4faf-a64a-68dc3ec09ee8'

[[pathVariables]]
key = 'id'
value = '1'

[body]
type = 'JSON'
raw = '''
{
  "name": "Wydział Informatyki i Telekomunikacji",
  "code": "W4",
}'''
```
