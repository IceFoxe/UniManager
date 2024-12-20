```toml
name = 'Search'
description = 'wyszukaj pracownika po filtrach'
method = 'GET'
url = '{{baseUrl}}/api/employees/search?position&name&page=1&limit=10'
sortWeight = 2000000
id = 'd24326eb-4342-469b-84d5-82b6f22bc225'

[[queryParams]]
key = 'position'

[[queryParams]]
key = 'name'

[[queryParams]]
key = 'page'
value = '1'

[[queryParams]]
key = 'limit'
value = '10'
```
