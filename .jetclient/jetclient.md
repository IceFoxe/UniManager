```toml
name = 'UniManager'
description = 'University management WebApp'
id = '4e17b256-1384-47a3-baf1-447c0772c024'

[[environmentGroups]]
name = 'Default'
environments = ['Local']

[auth.bearer]
token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImxvZ2luIjoiYWRtaW4iLCJlbWFpbCI6InJleGl2ZXIxMUBnbWFpbC5jb20iLCJyb2xlIjoiQWRtaW4iLCJmaXJzdE5hbWUiOiJKYWt1YiIsImxhc3ROYW1lIjoiRyIsInZlcnNpb24iOjE3MzcwNDk2MzcyNTEsImlhdCI6MTczNzA0OTYzNywiZXhwIjoxNzM3MDUwNTM3fQ.PpziwXYNZ0fEYbKJQ6LCR-zDkMIIUybZEqJLDPWuNbc'
```

#### Variables

```json5
{
  Local: {
    baseUrl: 'http://localhost:3001'
  }
}
```
