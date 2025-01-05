```toml
name = 'Create'
description = 'Dodaj ocenę'
method = 'POST'
url = '{{baseUrl}}/api/grades/create'
sortWeight = 1000000
id = '2641fd8f-b3e4-4893-9d12-136f40febdc4'

[body]
type = 'JSON'
raw = '''
{
    "course_id": 1,
    "student_id": 2,
    "value": 3 ,
    "description": "Jakis opis"  
}'''
```
