```toml
name = 'UniManager'
description = 'University management WebApp'
id = '4e17b256-1384-47a3-baf1-447c0772c024'

[[environmentGroups]]
name = 'Default'
environments = ['Local']

[auth.bearer]
token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImxvZ2luIjoiQWRtaW4iLCJlbWFpbCI6ImxvbEBnbWFpbC5jb20iLCJyb2xlIjoiQWRtaW4iLCJmaXJzdE5hbWUiOiJKYWt1YiIsImxhc3ROYW1lIjoiRyIsInZlcnNpb24iOjE3MzU5MTc4ODE2NjEsImlhdCI6MTczNTkxNzg4MSwiZXhwIjoxNzM1OTE4NzgxfQ.52_zBpSjm4spMoSSQ-ca9weHx9hcV6vGRfgk0-ZB4zc'
```

#### Variables

```json5
{
  Local: {
    baseUrl: 'http://localhost:3001'
  }
}
```
