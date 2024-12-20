```toml
name = 'Create'
description = 'Dodaj pracownika'
method = 'POST'
url = '{{baseUrl}}/api/employees/create'
sortWeight = 1000000
id = '1236b08d-cd63-4c48-abb5-a5800b304068'

[body]
type = 'JSON'
raw = '''
{
    "first_name": "John",
    "last_name": "Doe",
    "position": "Professor",
    "employment_date": "2024-01-01T00:00:00.000Z",
    "password": "initialPassword123" 
}'''
```
