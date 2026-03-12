# SplitMate – Smart Group Expense Management System

Backend API for group expense tracking, splits, settlements, and analytics.

## Tech stack

- **Java 17**, **Spring Boot 3.2**, **Maven**
- **Spring Data JPA**, **Spring Security (JWT)**
- **MySQL**
- Validation with `@Valid`, no WebSockets or microservices

## Prerequisites

- JDK 17+
- Maven 3.6+
- MySQL 8 (or compatible)

## Setup

1. **MySQL**: Create a database (or let the app create it):

   ```sql
   CREATE DATABASE splitmate;
   ```

2. **Configuration**: Edit `src/main/resources/application.properties` and set:

   - `spring.datasource.username` and `spring.datasource.password` to your MySQL user/password.

3. **Set JAVA_HOME** (if not already set):
   
   ```powershell
   # Find your JDK path (usually C:\Program Files\Java\jdk-XX)
   $env:JAVA_HOME = "C:\Program Files\Java\jdk-25"
   # Or set it permanently in System Environment Variables
   ```

4. **Build and run**:

   **Option A: Using Maven Wrapper (recommended - no Maven installation needed)**
   
   The wrapper is already set up. Just run:
   ```powershell
   .\mvnw.cmd clean install
   .\mvnw.cmd spring-boot:run
   ```

   **Option B: Using installed Maven**
   
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

   Server runs at **http://localhost:8080**.

## Project structure

```
src/main/java/com/splitmate/
├── config/           # SecurityConfig
├── controller/       # Auth, Group, Expense, Settlement, Analytics, Category
├── dto/              # Request/response DTOs
├── entity/           # JPA entities
├── exception/        # GlobalExceptionHandler, custom exceptions
├── repository/       # Spring Data JPA repositories
├── security/         # JWT filter, token provider, UserPrincipal, UserDetailsService
├── service/          # Business logic
└── SplitMateApplication.java
```

## API overview

| Module            | Endpoints |
|-------------------|-----------|
| **Auth**          | `POST /auth/register`, `POST /auth/login` |
| **Groups**        | CRUD + `POST /api/groups/{id}/members`, `DELETE .../members/{userId}` |
| **Expenses**      | `POST /api/expenses`, `GET /api/expenses/{id}`, `GET /api/expenses/group/{groupId}` |
| **Settlements**   | `POST /api/settlements`, `GET /api/settlements/group/{groupId}`, `GET .../group/{groupId}/balances` |
| **Analytics**     | `GET /api/analytics/group/{groupId}`, `GET .../group/{groupId}/period?start=&end=` |
| **Categories**    | `GET /api/categories` |

All `/api/**` endpoints require JWT: `Authorization: Bearer <token>`.

## Sample API usage

See **[docs/API_EXAMPLES.md](docs/API_EXAMPLES.md)** for request/response examples.

Quick flow:

1. **Register**: `POST /auth/register` with `name`, `email`, `password`.
2. **Login**: `POST /auth/login` with `email`, `password` → receive `token`.
3. **Create group**: `POST /api/groups` with `{"name": "Trip"}` (use `Authorization: Bearer <token>`).
4. **Add expense**: `POST /api/expenses` with `title`, `totalAmount`, `categoryId`, `groupId`, `splits`.
5. **View balances**: `GET /api/settlements/group/{groupId}/balances`.
6. **Record settlement**: `POST /api/settlements` with `payerId`, `receiverId`, `amount`, `groupId`.

## Default data

`data.sql` seeds categories: **Food**, **Travel**, **Rent**, **Shopping**, **Utilities**.

## License

MIT (or as per your project).
