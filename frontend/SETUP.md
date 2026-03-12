# Quick Setup Guide

## Step 1: Install Dependencies

```bash
cd frontend
npm install
```

## Step 2: Start Backend

Make sure your Spring Boot backend is running on `http://localhost:8080`

```bash
# In the backend directory
.\mvnw.cmd spring-boot:run
```

## Step 3: Start Frontend

```bash
# In the frontend directory
npm start
# or
npm run dev
```

The frontend will run on **http://localhost:3000**

## Step 4: Test the Application

1. Open **http://localhost:3000** in your browser
2. Register a new account or login
3. Create a group
4. Add expenses and view analytics

## Troubleshooting

- **Port 3000 already in use**: Change port in `vite.config.js`
- **CORS errors**: Ensure backend allows `http://localhost:3000`
- **API connection failed**: Verify backend is running on port 8080
