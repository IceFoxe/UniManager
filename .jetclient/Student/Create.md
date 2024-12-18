```toml
name = 'Create'
description = 'Dodaj studenta'
method = 'POST'
url = '{{baseUrl}}/api/students/create'
sortWeight = 1000000
id = 'fad76c65-de36-4a88-a64e-cf7cee4a4221'

[body]
type = 'JSON'
raw = '''
{
  "first_name": "Jakub",
  "last_name": "Grych",
  "student_number": "276890",
  "program_id": 1,
  "semester": 1,
  "status": "Active",
  "enrollment_date": "2024-01-15",
  "expected_graduation": "2028-01-15"
}'''
```
