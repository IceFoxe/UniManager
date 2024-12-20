```toml
name = 'Update'
description = 'Edytuj Pracownika'
method = 'PUT'
url = '{{baseUrl}}/api/employees/update/:id'
sortWeight = 4500000
id = 'ba3d025c-0e12-4730-b45a-37b721720f2e'

[[pathVariables]]
key = 'id'
value = '1'

[body]
type = 'JSON'
raw = '''
{
    "position": "Professor",
    "employment_date": "2024-01-01T00:00:00.000Z"
}'''
```
