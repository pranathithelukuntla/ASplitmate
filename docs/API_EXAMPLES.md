# SplitMate API Examples

Base URL: `http://localhost:8080`

All secured endpoints require header: `Authorization: Bearer <token>`

---

## 1. Auth

### Register

**POST** `/auth/register`

Request:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

Response (201):
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "userId": 1,
  "email": "john@example.com",
  "name": "John Doe",
  "role": "USER"
}
```

### Login

**POST** `/auth/login`

Request:
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

Response (200):
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "userId": 1,
  "email": "john@example.com",
  "name": "John Doe",
  "role": "USER"
}
```

---

## 2. Groups

### Create group

**POST** `/api/groups`

Headers: `Authorization: Bearer <token>`

Request:
```json
{
  "name": "Trip to Goa"
}
```

Response (201):
```json
{
  "id": 1,
  "name": "Trip to Goa",
  "createdById": 1,
  "createdByName": "John Doe",
  "createdAt": "2025-02-13T10:00:00Z",
  "members": [
    {
      "userId": 1,
      "userName": "John Doe",
      "userEmail": "john@example.com"
    }
  ]
}
```

### Get my groups

**GET** `/api/groups`

Response (200): Array of `GroupResponse`

### Get group by ID

**GET** `/api/groups/{id}`

### Update group

**PUT** `/api/groups/{id}`

Request:
```json
{
  "name": "Goa Trip 2025"
}
```

### Delete group

**DELETE** `/api/groups/{id}`

Response: 204 No Content

### Add member

**POST** `/api/groups/{id}/members`

Request:
```json
{
  "userId": 2
}
```

### Remove member

**DELETE** `/api/groups/{id}/members/{userId}`

---

## 3. Expenses

### Add expense (with splits)

**POST** `/api/expenses`

Request:
```json
{
  "title": "Dinner at restaurant",
  "totalAmount": 1200.50,
  "categoryId": 1,
  "groupId": 1,
  "expenseDate": "2025-02-12",
  "splits": [
    { "userId": 1, "amount": 600.25 },
    { "userId": 2, "amount": 600.25 }
  ]
}
```

Response (201):
```json
{
  "id": 1,
  "title": "Dinner at restaurant",
  "totalAmount": 1200.50,
  "categoryId": 1,
  "categoryName": "Food",
  "paidById": 1,
  "paidByName": "John Doe",
  "groupId": 1,
  "expenseDate": "2025-02-12",
  "splits": [
    { "userId": 1, "userName": "John Doe", "amount": 600.25 },
    { "userId": 2, "userName": "Jane Doe", "amount": 600.25 }
  ]
}
```

### Get expense by ID

**GET** `/api/expenses/{id}`

### Get expenses by group

**GET** `/api/expenses/group/{groupId}`

Response (200): Array of `ExpenseResponse`

---

## 4. Settlements

### Record settlement

**POST** `/api/settlements`

Request:
```json
{
  "payerId": 2,
  "receiverId": 1,
  "amount": 500.00,
  "groupId": 1,
  "settlementDate": "2025-02-13"
}
```

Response (201):
```json
{
  "id": 1,
  "payerId": 2,
  "payerName": "Jane Doe",
  "receiverId": 1,
  "receiverName": "John Doe",
  "amount": 500.00,
  "groupId": 1,
  "settlementDate": "2025-02-13"
}
```

### Get settlements by group

**GET** `/api/settlements/group/{groupId}`

### Get balances by group

**GET** `/api/settlements/group/{groupId}/balances`

Response (200):
```json
[
  { "userId": 1, "userName": "John Doe", "balance": 100.50 },
  { "userId": 2, "userName": "Jane Doe", "balance": -100.50 }
]
```
(positive = owed to user, negative = user owes)

---

## 5. Analytics

### Group analytics (all time)

**GET** `/api/analytics/group/{groupId}`

Response (200):
```json
{
  "totalExpense": 5000.00,
  "categoryWise": {
    "Food": 2000.00,
    "Travel": 2000.00,
    "Utilities": 1000.00
  },
  "monthlyTrends": [
    { "yearMonth": "2025-02", "total": 3000.00 },
    { "yearMonth": "2025-01", "total": 2000.00 }
  ]
}
```

### Group analytics for period

**GET** `/api/analytics/group/{groupId}/period?start=2025-01-01&end=2025-02-28`

---

## 6. Categories

### List categories

**GET** `/api/categories`

Response (200):
```json
[
  { "id": 1, "name": "Food" },
  { "id": 2, "name": "Travel" },
  { "id": 3, "name": "Rent" },
  { "id": 4, "name": "Shopping" },
  { "id": 5, "name": "Utilities" }
]
```

---

## Error responses

- **400 Bad Request**: Validation errors or business rule violation  
  Body example: `{ "message": "Email already registered", "timestamp": "..." }`  
  Validation: `{ "message": "Validation failed", "errors": { "email": "Invalid email format" }, "timestamp": "..." }`

- **401 Unauthorized**: Missing or invalid token, or invalid login  
  Body: `{ "message": "Invalid email or password", "timestamp": "..." }`

- **404 Not Found**: Resource not found  
  Body: `{ "message": "Group not found with id: 99", "timestamp": "..." }`

- **500 Internal Server Error**: Unexpected error  
  Body: `{ "message": "An unexpected error occurred", "timestamp": "..." }`
