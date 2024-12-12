```toml
name = 'api/auth/login'
method = 'POST'
url = '{{baseUrl}}api/auth/login'
sortWeight = 1000000
id = '52664a31-32e1-4fa0-9025-8450e7fe6045'

[body]
type = 'JSON'
raw = '''
{
  login: "Admin",
  password: "pepsi",
}'''
```
