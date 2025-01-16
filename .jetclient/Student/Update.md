```toml
name = 'Update'
description = 'Edytuj studenta'
method = 'PUT'
url = '{{baseUrl}}/api/students/update/:id'
sortWeight = 3500000
id = '0e75ead8-ee05-4146-9578-7c6c1b33bf76'

[[pathVariables]]
key = 'id'
value = '2'

[body]
type = 'JSON'
raw = '''
{
  "first_name": "Jakub",
  "last_name": "Grych",
  "login" : "jakgry2357",
  "email" : "kuba.grych@gmail.com",
  "password": "lol",
}'''
```
