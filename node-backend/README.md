# Task Tracker Backend

This project contains a simple backend for a task tracking and collaboration application.

## Features

- User registration and login with JWT authentication
- Profile management
- Task creation, listing, updating, deleting
- Team/project creation and membership management
- Comments on tasks
- File attachments for tasks

## Getting Started

1. Copy `.env.example` to `.env` and update values.
2. Install dependencies:

```bash
npm install
```

3. Start MongoDB locally or configure a hosted database.
4. Run the server:

```bash
npm run dev
```

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users/me`
- `PUT /api/users/me`
- `POST /api/tasks`
- `GET /api/tasks`
- `GET /api/tasks/:id`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `POST /api/teams`
- `GET /api/teams`
- `GET /api/teams/:id`
- `PUT /api/teams/:id`
- `DELETE /api/teams/:id`
- `POST /api/comments`
- `GET /api/comments/task/:taskId`
- `POST /api/attachments`
- `GET /api/attachments/task/:taskId`

## Notes

- Use `Authorization: Bearer <token>` for protected endpoints.
- Attach files using multipart/form-data on the attachments route.
