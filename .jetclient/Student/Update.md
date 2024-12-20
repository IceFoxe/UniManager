```toml
name = 'Update'
description = 'Edytuj studenta'
method = 'PUT'
url = '{{baseUrl}}api/student/:id'
sortWeight = 3500000
id = '0e75ead8-ee05-4146-9578-7c6c1b33bf76'

[[pathVariables]]
key = 'id'
value = '1'

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
