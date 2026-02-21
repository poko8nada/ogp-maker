---
title: RESTful API Design Best Practices
createdAt: 2024-05-18
updatedAt: 2024-05-18
version: 1
isPublished: true
tags:
  - program
  - Nextjs
  - markdown
---

## Use Correct HTTP Methods

- **GET** - Retrieve resources
- **POST** - Create new resources
- **PUT** - Replace entire resources
- **PATCH** - Partial updates
- **DELETE** - Remove resources

## Resource Naming

Use nouns, not verbs:

```
✓ /api/users
✓ /api/users/123/posts
✗ /api/getUsers
✗ /api/createPost
```

## Status Codes

```javascript
- 200: OK
- 201: Created
- 204: No Content
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error
```

## Versioning

```
/api/v1/users
/api/v2/users
```

## Pagination

```
GET /api/users?page=1&limit=10&sort=createdAt&order=desc
```

## Response Format

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe"
  },
  "error": null
}
```

## Security

- Use HTTPS only
- Implement rate limiting
- Validate input
- Use authentication tokens
- Add CORS headers
