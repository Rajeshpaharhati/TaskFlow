# TaskFlow

TaskFlow is a full-stack task management application built around a Kanban-style board. It allows users to create, view, edit, delete, search, filter, and move tasks between workflow columns.

The application uses a React/Vite frontend, an Express/Node.js REST API, and SQLite for persistent relational data storage.

## Features

- Kanban-style task board
- View tasks grouped by workflow column
- Create new tasks
- Edit existing tasks
- Delete tasks
- Drag and drop tasks between columns
- Search tasks by title
- Filter tasks by priority
- Priority levels: Low, Medium, High
- Backend validation for required task titles
- Persistent data using SQLite
- REST API for board and task operations
- User-friendly loading and error states
- Automated backend tests using Jest
- Isolated in-memory database for tests

## Tech Stack

### Frontend

- React
- Vite
- JavaScript
- CSS
- Axios
- React Router
- `@dnd-kit` for drag-and-drop

### Backend

- Node.js
- Express.js
- SQLite
- `better-sqlite3`
- CORS
- dotenv
- Jest
- Nodemon

## Architecture

```text
TaskFlow/
├── backend/
│   ├── database/
│   │   ├── schema.sql
│   │   ├── seed.js
│   │   └── check-board.js
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── board.controller.js
│   │   │   └── task.controller.js
│   │   ├── routes/
│   │   │   ├── board.routes.js
│   │   │   └── task.routes.js
│   │   ├── services/
│   │   │   ├── board.service.js
│   │   │   └── task.service.js
│   │   ├── app.js
│   │   ├── database.js
│   │   └── server.js
│   ├── tests/
│   │   ├── database.test.js
│   │   └── task.service.test.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
└── README.md
```

## Database Design

TaskFlow uses SQLite with three relational tables:

```text
Board
  │
  └── Column
        │
        └── Task
```

### Boards

- `id` - primary key
- `name` - required board name

### Columns

- `id` - primary key
- `board_id` - foreign key to `boards`
- `name` - required column name
- `position` - column ordering

### Tasks

- `id` - primary key
- `column_id` - foreign key to `columns`
- `title` - required task title
- `description` - optional task description
- `priority` - Low, Medium, or High
- `created_at` - task creation timestamp

Foreign keys are enabled and cascading deletes are used for related child records.

The complete schema is available in:

```text
backend/database/schema.sql
```

## Database Queries

The backend uses SQL directly through `better-sqlite3`.

### 1. Count tasks per column

```sql
SELECT
    c.id,
    c.name,
    COUNT(t.id) AS task_count
FROM columns c
LEFT JOIN tasks t
    ON t.column_id = c.id
WHERE c.board_id = ?
GROUP BY c.id, c.name
ORDER BY c.position ASC;
```

Implementation:

```text
backend/src/services/task.service.js
```

### 2. Tasks by priority, newest first

```sql
SELECT
    t.id,
    t.column_id,
    t.title,
    t.description,
    t.priority,
    t.created_at,
    c.name AS column_name
FROM tasks t
INNER JOIN columns c
    ON t.column_id = c.id
WHERE t.priority = ?
ORDER BY t.created_at DESC;
```

Implementation:

```text
backend/src/services/task.service.js
```

## API

The backend runs on:

```text
http://localhost:5000
```

### Board

```http
GET /api/boards/:id
```

Example:

```text
GET /api/boards/6
```

### Tasks

```http
GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

Task creation requires a non-empty title. Task updates can change the title, description, priority, and column, which is how drag-and-drop movement is persisted.

## Local Setup

### Prerequisites

- Node.js
- npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Rajeshpaharhati/TaskFlow.git
cd TaskFlow
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Seed the database

From the `backend` directory:

```bash
npm run seed
```

This creates a TaskFlow board with:

- To Do
- In Progress
- Done
- Sample tasks with different priorities

The SQLite database is created under:

```text
backend/data/taskflow.db
```

### 4. Check the board ID

```bash
node database/check-board.js
```

The current application is configured to use Board ID `6`.

If a completely fresh database generates a different board ID, update the board ID used by the frontend to match the ID shown by `check-board.js`.

### 5. Start the backend

From `TaskFlow/backend`:

```bash
npm run dev
```

Backend:

```text
http://localhost:5000
```

Keep this terminal running.

### 6. Install frontend dependencies

Open a second terminal:

```bash
cd TaskFlow/frontend
npm install
```

### 7. Start the frontend

```bash
npm run dev
```

Vite normally starts the frontend at:

```text
http://localhost:5173
```

Open that address in your browser.

## Running Tests

From the `backend` directory:

```bash
npm test
```

The tests use an isolated in-memory SQLite database, so they do not modify the application's normal database.

The test suite covers:

- retrieving tasks
- retrieving a task by ID
- creating a task
- rejecting a task without a title
- moving a task to another column
- database-layer behavior

## Validation and Error Handling

Task creation is validated on the backend as well as the frontend.

```javascript
if (!title || !title.trim()) {
    throw new Error("Task title is required");
}
```

API failures are handled by the frontend and displayed through user-facing loading and error states instead of leaving the page blank.

## Design Decisions and Assumptions

### SQLite

SQLite was selected because the assignment requires a real relational database without requiring a separately managed database server. It keeps local setup simple while providing relational tables, foreign keys, constraints, and direct SQL queries.

### Service-based backend

The backend separates responsibilities into:

- routes for endpoint definitions
- controllers for HTTP request/response handling
- services for database and business logic
- database module for SQLite connection and schema initialization

### Drag and drop

`@dnd-kit` is used for moving tasks between columns. The updated column is sent to the backend so the movement is persisted in SQLite.

### Single board

The application is designed around a single TaskFlow board for this assignment. Authentication, multiple users, teams, real-time collaboration, and file uploads are outside the scope of this implementation.

## What I Would Improve With More Time

- Make the board ID configurable through an environment variable instead of relying on a fixed frontend value.
- Add more API/integration tests for all CRUD endpoints.
- Add stronger validation for task priority and column IDs.
- Add task ordering within a column.
- Add production deployment configuration.
- Add automated CI checks for tests and linting.

## Development Time

Approximately one day was spent implementing, debugging, testing, and validating the application locally.

## What I Learned

This project provided practical experience with connecting a React frontend to an Express REST API, designing a relational SQLite schema, writing SQL queries with `better-sqlite3`, persisting drag-and-drop changes, and testing service/database behavior with an isolated in-memory database.

## Useful Commands

### Backend

```bash
cd backend
npm install
npm run seed
npm run dev
```

Run tests:

```bash
npm test
```

Check the board:

```bash
node database/check-board.js
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Build:

```bash
npm run build
```

Lint:

```bash
npm run lint
```
