# TaskFlow

TaskFlow is a full-stack task management application inspired by a Kanban board.

It allows users to create, view, update, delete, search, filter, and move tasks between different workflow columns using drag and drop.

## Features

- Kanban-style task board
- Create tasks
- Edit tasks
- Delete tasks
- Move tasks between columns using drag and drop
- Search tasks by title
- Filter tasks by priority
- Task priority levels
- SQLite database persistence
- REST API backend
- Automated backend tests using Jest
- Isolated in-memory database for automated tests

## Tech Stack

### Frontend

- React
- Vite
- JavaScript
- CSS
- `@dnd-kit` for drag and drop

### Backend

- Node.js
- Express.js
- SQLite
- better-sqlite3
- Jest

## Project Structure

```text
TaskFlow/
│
├── backend/
│   ├── database/
│   │   ├── schema.sql
│   │   ├── seed.js
│   │   └── check-board.js
│   │
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── app.js
│   │   ├── database.js
│   │   └── server.js
│   │
│   ├── tests/
│   │   ├── database.test.js
│   │   └── task.service.test.js
│   │
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
└── README.md