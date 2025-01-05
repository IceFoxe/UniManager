```toml
name = 'Create'
description = 'Dodaj kurs'
method = 'POST'
url = '{{baseUrl}}/api/courses/'
sortWeight = 1000000
id = '73f23369-f4d2-4248-b0c4-db301c76ce6b'

[body]
type = 'JSON'
raw = '''
{
  "program_id": 1,
  "teacher_id": 1,
  "name": "Bazy Danych",
  "code": "DB01",
}'''
```
