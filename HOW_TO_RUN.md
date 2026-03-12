# How to Run SplitMate Backend

Step-by-step guide to build and run the SplitMate API on your machine.

---

## 1. Prerequisites

| Requirement | Check |
|-------------|--------|
| **Java 17+** | Open a terminal and run: `java -version` |
| **MySQL 8** (or compatible) | MySQL server installed and running |
| **Maven** (optional) | Only needed if you prefer `mvn` over the wrapper |

---

## 2. MySQL Setup

### 2.1 Start MySQL

- **Windows**: Start MySQL service (Services → MySQL80, or run `net start MySQL80` as Administrator).
- **macOS**: `brew services start mysql` or start from System Preferences.
- **Linux**: `sudo systemctl start mysql` (or `mariadb`).

### 2.2 Create database (optional)

The app can create the database automatically. If you prefer to create it yourself:

```sql
CREATE DATABASE splitmate;
```

### 2.3 Note your credentials

You need the MySQL **username** and **password** (e.g. `root` / `root` or your own user).

---

## 3. Configure the application

1. Open: **`src/main/resources/application.properties`**

2. Set your MySQL username and password:

   ```properties
   spring.datasource.username=root
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ```

3. If MySQL is not on `localhost:3306`, update the URL:

   ```properties
   spring.datasource.url=jdbc:mysql://YOUR_HOST:3306/splitmate?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
   ```

4. Save the file.

---

## 4. Set JAVA_HOME (Windows)

The Maven wrapper needs Java. Set `JAVA_HOME` to your JDK folder.

**Option A – This terminal only (PowerShell):**

```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-25"
```

(Use your actual path, e.g. `jdk-17` or `jdk-21`.)

**Option B – Permanent (recommended):**

1. Press **Win + R**, type `sysdm.cpl`, Enter.
2. **Advanced** → **Environment Variables**.
3. Under **System variables**, click **New** (or edit **JAVA_HOME** if it exists).
4. Variable name: `JAVA_HOME`  
   Variable value: `C:\Program Files\Java\jdk-25` (your JDK path).
5. OK. **Restart the terminal** (and Cursor/IDE if you use it for running).

---

## 5. Build the project

In the project root (where `pom.xml` and `mvnw.cmd` are):

**Using Maven Wrapper (no Maven install needed):**

```powershell
.\mvnw.cmd clean install
```

**Using installed Maven:**

```bash
mvn clean install
```

Wait until you see `BUILD SUCCESS`.

---

## 6. Run the application

**Using Maven Wrapper:**

```powershell
.\mvnw.cmd spring-boot:run
```

**Using Maven:**

```bash
mvn spring-boot:run
```

When it's ready you'll see something like:

```text
Started SplitMateApplication in X.XXX seconds
```

The API is running at: **http://localhost:8080**

---

## 7. Verify it's working

### Quick test – Register a user

**PowerShell:**

```powershell
Invoke-RestMethod -Uri "http://localhost:8080/auth/register" -Method POST -ContentType "application/json" -Body '{"name":"Test User","email":"test@example.com","password":"secret123"}'
```

**curl (any OS):**

```bash
curl -X POST http://localhost:8080/auth/register -H "Content-Type: application/json" -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"secret123\"}"
```

If you get a JSON response with `token`, `userId`, `email`, etc., the backend is running correctly.

---

## 8. Stop the application

In the terminal where the app is running, press **Ctrl + C**.

---

## Troubleshooting

| Problem | What to do |
|--------|------------|
| `mvn` / `mvnw.cmd` not recognized | Use `.\mvnw.cmd` (with the `.\`) from the project root. |
| JAVA_HOME not set | Set it as in step 4 and restart the terminal. |
| MySQL connection refused | Check that MySQL is running and that host/port in `application.properties` are correct. |
| Access denied for user | Fix `spring.datasource.username` and `spring.datasource.password` in `application.properties`. |
| Port 8080 already in use | Change port in `application.properties`: `server.port=8081` (or another free port). |

---

## Summary

1. MySQL running + credentials in `application.properties`.
2. `JAVA_HOME` set (Windows).
3. `.\mvnw.cmd clean install`
4. `.\mvnw.cmd spring-boot:run`
5. Use **http://localhost:8080** and test with `/auth/register` or `/auth/login`.

For full API examples, see **[docs/API_EXAMPLES.md](docs/API_EXAMPLES.md)**.
