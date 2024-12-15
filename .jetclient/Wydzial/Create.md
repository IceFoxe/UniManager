```toml
name = 'Create'
description = 'Dodaj wydział'
method = 'POST'
url = '{{baseUrl}}/api/faculties/create'
sortWeight = 500000
id = '66129ef1-bc78-4e97-b9c6-f1245184ab20'

[body]
type = 'JSON'
raw = '''
{
  "name": "Wydzial Mechaniki i Budowy Maszyn",
  "code": "W07",
}'''
```
