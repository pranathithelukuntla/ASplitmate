# SplitMate Frontend

React.js frontend for SplitMate - Smart Group Expense Management System.

## Tech Stack

- **React 18** - UI library
- **React Router v6** - Routing
- **Context API** - State management for authentication
- **Axios** - HTTP client with JWT interceptor
- **Recharts** - Charts and visualizations
- **Tailwind CSS** - Styling (responsive design)
- **Vite** - Build tool

## Prerequisites

- Node.js 16+ and npm/yarn
- Backend API running on `http://localhost:8080`

## Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start development server:**

   ```bash
   npm start
   # or
   npm run dev
   ```

   The app will run on **http://localhost:3000**

## Project Structure

```
src/
├── api/
│   └── api.js              # Axios instance with JWT interceptor
├── components/
│   ├── Navbar.jsx          # Navigation bar
│   ├── ProtectedRoute.jsx  # Route protection wrapper
│   ├── Charts/             # Chart components (Bar, Pie, Line)
│   └── Forms/              # Form components (Login, Register, Expense, Settlement)
├── context/
│   └── AuthContext.jsx    # Authentication context provider
├── pages/
│   ├── Login.jsx           # Login page
│   ├── Register.jsx        # Registration page
│   ├── Dashboard.jsx       # Groups overview
│   ├── GroupDetails.jsx    # Group details and expenses
│   ├── AddExpense.jsx      # Add expense form
│   ├── SettlementView.jsx  # Balances and settlements
│   └── Analytics.jsx       # Analytics with charts
├── styles/
│   └── index.css           # Global styles with Tailwind
├── App.jsx                 # Main app component with routing
└── index.js                # Entry point
```

## Features

### Authentication
- **Login** - Email/password authentication
- **Register** - User registration
- **JWT Token** - Stored in localStorage, auto-added to requests
- **Protected Routes** - Redirects to login if not authenticated

### Groups
- **Dashboard** - View all groups
- **Group Details** - View members, expenses, quick actions
- **Create Group** - (Can be added via API)

### Expenses
- **Add Expense** - Form with category selection and split calculation
- **View Expenses** - List of expenses in a group
- **Expense Splits** - Automatically calculates splits among members

### Settlements
- **View Balances** - See who owes whom
- **Record Settlement** - Mark payments between members
- **Settlement History** - View all recorded settlements

### Analytics
- **Total Expense** - Overall spending
- **Category-wise** - Pie chart showing expenses by category
- **Monthly Trends** - Line chart showing spending over time
- **Bar Chart** - Category breakdown visualization

## API Integration

The frontend connects to the backend API at `http://localhost:8080`. All API calls are handled through `src/api/api.js`:

- **Auth API**: `/auth/register`, `/auth/login`
- **Groups API**: `/api/groups`
- **Expenses API**: `/api/expenses`
- **Settlements API**: `/api/settlements`
- **Analytics API**: `/api/analytics`
- **Categories API**: `/api/categories`

### JWT Authentication

The Axios interceptor automatically:
- Adds `Authorization: Bearer <token>` header to all requests
- Redirects to login on 401 (unauthorized) responses
- Stores token in localStorage on login/register

## Sample API Usage

### Register

```javascript
POST http://localhost:8080/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "userId": 1,
  "email": "john@example.com",
  "name": "John Doe",
  "role": "USER"
}
```

### Login

```javascript
POST http://localhost:8080/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "secret123"
}

Response: Same as register
```

### Create Group

```javascript
POST http://localhost:8080/api/groups
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Trip to Goa"
}
```

### Add Expense

```javascript
POST http://localhost:8080/api/expenses
Authorization: Bearer <token>
Content-Type: application/json

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

### Get Balances

```javascript
GET http://localhost:8080/api/settlements/group/1/balances
Authorization: Bearer <token>

Response:
[
  { "userId": 1, "userName": "John Doe", "balance": 100.50 },
  { "userId": 2, "userName": "Jane Doe", "balance": -100.50 }
]
```

### Get Analytics

```javascript
GET http://localhost:8080/api/analytics/group/1
Authorization: Bearer <token>

Response:
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

## Build for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

## Development Notes

- The app uses Vite for fast development and hot module replacement
- Tailwind CSS is configured for responsive design
- All API calls are centralized in `src/api/api.js`
- Authentication state is managed via Context API
- Protected routes automatically redirect to login if not authenticated

## Troubleshooting

- **CORS errors**: Make sure backend CORS is configured to allow `http://localhost:3000`
- **401 errors**: Check if token is stored in localStorage and backend is running
- **API connection**: Verify backend is running on `http://localhost:8080`

## License

MIT
