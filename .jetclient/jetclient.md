```toml
name = 'UniManager'
description = 'University management WebApp'
id = '4e17b256-1384-47a3-baf1-447c0772c024'

[[environmentGroups]]
name = 'Default'
environments = ['Local']

[auth.bearer]
token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImxvZ2luIjoiYWRtaW4iLCJlbWFpbCI6InJleGl2ZXIxMUBnbWFpbC5jb20iLCJyb2xlIjoiRW1wbG95ZWUiLCJmaXJzdE5hbWUiOiJKYWt1YiIsImxhc3ROYW1lIjoiRyIsImlhdCI6MTczMzk5NDczMywiZXhwIjoxNzM0MDAxOTMzfQ.Xs_84L-3GMmI6g0Vpi5lJba7ohjx_9zn59mUdXxh-XQ'
```

#### Variables

```json5
{
  Local: {
    baseUrl: 'http://localhost:3001/'
  }
}
```
