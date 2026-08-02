# Java Backend (Spring Boot)

## MySQL Setup

1. Start MySQL server.
2. Run the SQL script:

```sql
SOURCE create_mysql_db.sql;
```

3. Update `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/tasktracker?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_mysql_password
```

## Run the backend

```bash
mvn spring-boot:run
```

## Notes

- The app starts on `http://localhost:8080`
- Authentication routes are under `/api/auth`
- Protected routes require a Bearer token in `Authorization`

## Curl commands

### Register

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"Password123"}'
```

### Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"Password123"}'
```

### Use token

After login, save the returned token in a shell variable:

```bash
TOKEN="<your_jwt_token>"
```

### Create task

```bash
curl -X POST http://localhost:8080/api/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Build API","description":"Create endpoints","status":"OPEN"}'
```

### List tasks

```bash
curl http://localhost:8080/api/tasks \
  -H "Authorization: Bearer $TOKEN"
```

### Get task by ID

```bash
curl http://localhost:8080/api/tasks/<TASK_ID> \
  -H "Authorization: Bearer $TOKEN"
```

### Update task

```bash
curl -X PUT http://localhost:8080/api/tasks/<TASK_ID> \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"COMPLETED","description":"Done"}'
```

### Delete task

```bash
curl -X DELETE http://localhost:8080/api/tasks/<TASK_ID> \
  -H "Authorization: Bearer $TOKEN"
```

### Create team

```bash
curl -X POST http://localhost:8080/api/teams \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Dev Team","description":"Backend team"}'
```

### List teams

```bash
curl http://localhost:8080/api/teams \
  -H "Authorization: Bearer $TOKEN"
```
