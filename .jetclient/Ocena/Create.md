```toml
name = 'Create'
description = 'Dodaj ocenę'
method = 'POST'
url = '{{baseUrl}}api/grade/create'
sortWeight = 1000000
id = '2641fd8f-b3e4-4893-9d12-136f40febdc4'

[body]
type = 'JSON'
raw = '''
{
    "student_id": 2,
    "value": 4.5,  
    "description": "Jakis opis"  
}'''
```
