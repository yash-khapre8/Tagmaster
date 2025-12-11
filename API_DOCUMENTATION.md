# TagMaster API Documentation

Complete REST API and WebSocket event reference for TagMaster platform.

---

## Base URL

\`\`\`
http://localhost:5000/api
\`\`\`

---

## Authentication

All protected endpoints require a JWT token in the Authorization header:

\`\`\`
Authorization: Bearer <your_jwt_token>
\`\`\`

---

## REST API Endpoints

### Authentication Endpoints

#### Register User
\`\`\`http
POST /api/auth/register
\`\`\`

**Request Body:**
\`\`\`json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123",
  "role": "annotator"
}
\`\`\`

**Response:** \`201 Created\`
\`\`\`json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "annotator"
    }
  }
}
\`\`\`

---

#### Login
\`\`\`http
POST /api/auth/login
\`\`\`

**Request Body:**
\`\`\`json
{
  "email": "john@example.com",
  "password": "securepass123"
}
\`\`\`

**Response:** \`200 OK\`
\`\`\`json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "annotator",
      "stats": {
        "annotationsCreated": 42,
        "assetsCompleted": 10
      }
    }
  }
}
\`\`\`

---

#### Get Current User
\`\`\`http
GET /api/auth/me
Authorization: Bearer <token>
\`\`\`

**Response:** \`200 OK\`
\`\`\`json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "annotator",
    "stats": { }
  }
}
\`\`\`

---

### Asset Endpoints

#### Get All Assets
\`\`\`http
GET /api/assets
Authorization: Bearer <token>
\`\`\`

**Query Parameters:**
- \`status\` (optional): Filter by status (available, claimed, completed)
- \`type\` (optional): Filter by type (image, text)
- \`project\` (optional): Filter by project name

**Response:** \`200 OK\`
\`\`\`json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Cat Image #1",
      "type": "image",
      "url": "https://example.com/cat1.jpg",
      "status": "available",
      "project": "Animal Classification",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
\`\`\`

---

#### Get Asset by ID
\`\`\`http
GET /api/assets/:id
Authorization: Bearer <token>
\`\`\`

**Response:** \`200 OK\`
\`\`\`json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Cat Image #1",
    "type": "image",
    "url": "https://example.com/cat1.jpg",
    "status": "available",
    "description": "Persian cat on couch",
    "project": "Animal Classification"
  }
}
\`\`\`

---

#### Create Asset (Admin Only)
\`\`\`http
POST /api/assets
Authorization: Bearer <admin_token>
\`\`\`

**Request Body:**
\`\`\`json
{
  "title": "Dog Image #5",
  "type": "image",
  "url": "https://example.com/dog5.jpg",
  "description": "Golden retriever playing",
  "project": "Animal Classification",
  "metadata": {
    "resolution": "1920x1080",
    "format": "jpg"
  }
}
\`\`\`

**Response:** \`201 Created\`
\`\`\`json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "title": "Dog Image #5",
    "status": "available",
    ...
  }
}
\`\`\`

---

#### Claim Asset
\`\`\`http
PATCH /api/assets/:id/claim
Authorization: Bearer <token>
\`\`\`

**Response:** \`200 OK\`
\`\`\`json
{
  "success": true,
  "data": {
    "asset": {
      "_id": "507f1f77bcf86cd799439012",
      "status": "claimed",
      "claimedBy": "507f1f77bcf86cd799439011",
      "claimedAt": "2024-01-15T11:00:00Z"
    }
  }
}
\`\`\`

**Error:** \`400 Bad Request\`
\`\`\`json
{
  "success": false,
  "error": "Asset already claimed by another user"
}
\`\`\`

---

#### Release Asset
\`\`\`http
PATCH /api/assets/:id/release
Authorization: Bearer <token>
\`\`\`

**Response:** \`200 OK\`
\`\`\`json
{
  "success": true,
  "data": {
    "asset": {
      "_id": "507f1f77bcf86cd799439012",
      "status": "available",
      "claimedBy": null,
      "claimedAt": null
    }
  }
}
\`\`\`

---

#### Complete Asset
\`\`\`http
PATCH /api/assets/:id/complete
Authorization: Bearer <token>
\`\`\`

**Response:** \`200 OK\`
\`\`\`json
{
  "success": true,
  "data": {
    "asset": {
      "_id": "507f1f77bcf86cd799439012",
      "status": "completed",
      "completedBy": "507f1f77bcf86cd799439011",
      "completedAt": "2024-01-15T11:30:00Z"
    }
  }
}
\`\`\`

---

### Annotation Endpoints

#### Create Annotation
\`\`\`http
POST /api/annotations
Authorization: Bearer <token>
\`\`\`

**Request Body:**
\`\`\`json
{
  "asset": "507f1f77bcf86cd799439012",
  "type": "bounding_box",
  "label": "cat",
  "geometry": {
    "x": 100,
    "y": 150,
    "width": 200,
    "height": 180
  },
  "properties": {
    "color": "#ff0000"
  }
}
\`\`\`

**Response:** \`201 Created\`
\`\`\`json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "asset": "507f1f77bcf86cd799439012",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe"
    },
    "type": "bounding_box",
    "label": "cat",
    "version": 1,
    "geometry": { },
    "createdAt": "2024-01-15T11:05:00Z"
  }
}
\`\`\`

---

#### Get Annotations by Asset
\`\`\`http
GET /api/annotations/asset/:assetId
Authorization: Bearer <token>
\`\`\`

**Response:** \`200 OK\`
\`\`\`json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "asset": "507f1f77bcf86cd799439012",
      "user": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe"
      },
      "type": "bounding_box",
      "label": "cat",
      "version": 2,
      "lastModifiedBy": {
        "_id": "507f1f77bcf86cd799439015",
        "name": "Jane Smith"
      },
      "geometry": { },
      "createdAt": "2024-01-15T11:05:00Z",
      "updatedAt": "2024-01-15T11:10:00Z"
    }
  ]
}
\`\`\`

---

#### Update Annotation (With Conflict Detection)
\`\`\`http
PUT /api/annotations/:id
Authorization: Bearer <token>
\`\`\`

**Request Body:**
\`\`\`json
{
  "label": "persian_cat",
  "version": 2,
  "geometry": {
    "x": 105,
    "y": 155,
    "width": 195,
    "height": 175
  }
}
\`\`\`

**Response:** \`200 OK\`
\`\`\`json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "label": "persian_cat",
    "version": 3,
    "lastModifiedBy": { },
    ...
  }
}
\`\`\`

**Conflict Response:** \`409 Conflict\`
\`\`\`json
{
  "success": false,
  "error": "Annotation has been modified by another user",
  "conflict": true,
  "currentVersion": 4,
  "currentData": {
    "_id": "507f1f77bcf86cd799439014",
    "version": 4,
    ...
  }
}
\`\`\`

---

#### Delete Annotation
\`\`\`http
DELETE /api/annotations/:id
Authorization: Bearer <token>
\`\`\`

**Response:** \`200 OK\`
\`\`\`json
{
  "success": true,
  "message": "Annotation deleted successfully"
}
\`\`\`

---

## WebSocket Events

### Connection

\`\`\`javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: {
    token: 'your_jwt_token'
  }
});
\`\`\`

---

### Client → Server Events

#### Join Asset Room
\`\`\`javascript
socket.emit('join_asset', {
  assetId: '507f1f77bcf86cd799439012'
});
\`\`\`

---

#### Create Annotation
\`\`\`javascript
socket.emit('create_annotation', {
  assetId: '507f1f77bcf86cd799439012',
  annotation: {
    type: 'bounding_box',
    label: 'cat',
    geometry: { x: 100, y: 150, width: 200, height: 180 }
  }
});
\`\`\`

---

#### Update Annotation
\`\`\`javascript
socket.emit('update_annotation', {
  annotationId: '507f1f77bcf86cd799439014',
  updates: {
    label: 'persian_cat',
    version: 2
  }
});
\`\`\`

---

#### Delete Annotation
\`\`\`javascript
socket.emit('delete_annotation', {
  annotationId: '507f1f77bcf86cd799439014',
  assetId: '507f1f77bcf86cd799439012'
});
\`\`\`

---

### Server → Client Events

#### Annotation Added
\`\`\`javascript
socket.on('annotation_added', (data) => {
  console.log('New annotation:', data.annotation);
});
\`\`\`

**Data:**
\`\`\`json
{
  "annotation": {
    "_id": "507f1f77bcf86cd799439014",
    "label": "cat",
    "user": { "name": "John Doe" },
    ...
  }
}
\`\`\`

---

#### Annotation Changed
\`\`\`javascript
socket.on('annotation_changed', (data) => {
  console.log('Annotation updated:', data.annotation);
});
\`\`\`

---

#### Annotation Removed
\`\`\`javascript
socket.on('annotation_removed', (data) => {
  console.log('Annotation deleted:', data.annotationId);
});
\`\`\`

---

#### User Joined Asset
\`\`\`javascript
socket.on('user_joined_asset', (data) => {
  console.log('User joined:', data.userName);
});
\`\`\`

---

#### User Left Asset
\`\`\`javascript
socket.on('user_left_asset', (data) => {
  console.log('User left:', data.userId);
});
\`\`\`

---

## Error Responses

All API endpoints follow a consistent error response format:

\`\`\`json
{
  "success": false,
  "error": "Error message here"
}
\`\`\`

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Version conflict detected |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

---

## Rate Limiting

- **Limit**: 1000 requests per 15 minutes per IP
- **Headers**:
  - \`X-RateLimit-Limit\`: Total requests allowed
  - \`X-RateLimit-Remaining\`: Remaining requests
  - \`X-RateLimit-Reset\`: Time when limit resets

---

## Version Control & Conflict Resolution

TagMaster uses **optimistic concurrency control** to handle concurrent edits:

1. Each annotation has a \`version\` field (starts at 1)
2. When updating, send current version in request body
3. Server checks if version matches
4. If versions match: update succeeds, version increments
5. If versions don't match: return 409 Conflict with latest data
6. Client refreshes and can retry

**Example Flow:**
\`\`\`
User A loads annotation (version: 1)
User B loads annotation (version: 1)

User A updates → Success (version: 2)
User B updates with version: 1 → 409 Conflict
User B receives latest (version: 2)
User B can retry with updated data
\`\`\`

---

## Best Practices

1. **Always include version** when updating annotations
2. **Handle 409 conflicts** by refreshing data
3. **Use WebSockets** for real-time updates
4. **Implement retry logic** with exponential backoff
5. **Cache JWT tokens** but refresh when expired
6. **Join asset rooms** when viewing annotations
7. **Leave asset rooms** when navigating away

---

## Examples

### Complete Annotation Workflow

\`\`\`javascript
// 1. Login
const loginRes = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const { token } = await loginRes.json();

// 2. Get assets
const assetsRes = await fetch('/api/assets', {
  headers: { 'Authorization': \`Bearer \${token}\` }
});
const { data: assets } = await assetsRes.json();

// 3. Claim asset
const claimRes = await fetch(\`/api/assets/\${assetId}/claim\`, {
  method: 'PATCH',
  headers: { 'Authorization': \`Bearer \${token}\` }
});

// 4. Create annotation
const annotationRes = await fetch('/api/annotations', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${token}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    asset: assetId,
    type: 'bounding_box',
    label: 'cat',
    geometry: { x: 100, y: 150, width: 200, height: 180 }
  })
});

// 5. Complete asset
await fetch(\`/api/assets/\${assetId}/complete\`, {
  method: 'PATCH',
  headers: { 'Authorization': \`Bearer \${token}\` }
});
\`\`\`

---

## Support

For API questions or issues:
- Check this documentation
- Review error messages
- Contact: yashkhapre@example.com
