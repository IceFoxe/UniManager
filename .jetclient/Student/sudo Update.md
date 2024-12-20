```toml
name = 'sudo Update'
description = 'Edytuj studenta przez Admina'
method = 'PUT'
url = '{{baseUrl}}/api/student/sudoupdate/:id'
sortWeight = 3750000
id = 'cd117349-8161-457f-bf30-414be99eb2a2'

[[pathVariables]]
key = 'id'

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
