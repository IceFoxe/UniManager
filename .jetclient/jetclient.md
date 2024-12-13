```toml
name = 'UniManager'
description = 'University management WebApp'
id = '4e17b256-1384-47a3-baf1-447c0772c024'

[[environmentGroups]]
name = 'Default'
environments = ['Local']

[auth.bearer]
token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImxvZ2luIjoiQWRtaW4iLCJlbWFpbCI6ImxvbEBnbWFpbC5jb20iLCJyb2xlIjoiRW1wbG95ZWUiLCJmaXJzdE5hbWUiOiJKYWt1YiIsImxhc3ROYW1lIjoiRyIsImlhdCI6MTczNDA5MzE1NSwiZXhwIjoxNzM0MTAwMzU1fQ.e7G6S4lt3vt6jVAo_-DjPQlK2gyr8ycpUnPAATwbaww'
```

#### Variables

```json5
{
  Local: {
    baseUrl: 'http://localhost:3001/'
  }
}
```
