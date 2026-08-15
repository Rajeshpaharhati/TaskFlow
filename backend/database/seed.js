const db = require("../src/database");

console.log("Starting database seed...");

try {
  // Clear existing data
  db.prepare("DELETE FROM tasks").run();
  db.prepare("DELETE FROM columns").run();
  db.prepare("DELETE FROM boards").run();

  // Create board
  const boardResult = db
    .prepare("INSERT INTO boards (name) VALUES (?)")
    .run("TaskFlow Board");

  const boardId = boardResult.lastInsertRowid;

  // Create columns
  const insertColumn = db.prepare(`
    INSERT INTO columns (board_id, name, position)
    VALUES (?, ?, ?)
  `);

  const todoResult = insertColumn.run(boardId, "To Do", 1);
  const inProgressResult = insertColumn.run(
    boardId,
    "In Progress",
    2
  );
  const doneResult = insertColumn.run(boardId, "Done", 3);

  const todoId = todoResult.lastInsertRowid;
  const inProgressId = inProgressResult.lastInsertRowid;
  const doneId = doneResult.lastInsertRowid;

  // Create tasks
  const insertTask = db.prepare(`
    INSERT INTO tasks (
      column_id,
      title,
      description,
      priority
    )
    VALUES (?, ?, ?, ?)
  `);

  insertTask.run(
    todoId,
    "Create React UI",
    "Build the TaskFlow board interface.",
    "High"
  );

  insertTask.run(
    todoId,
    "Write API documentation",
    "Document the backend API endpoints.",
    "Low"
  );

  insertTask.run(
    inProgressId,
    "Build REST API",
    "Implement task CRUD and move operations.",
    "High"
  );

  insertTask.run(
    doneId,
    "Setup SQLite database",
    "Create relational schema and database connection.",
    "Medium"
  );

  console.log("Database seeded successfully.");
} catch (error) {
  console.error("Database seed failed:", error);
  process.exitCode = 1;
} finally {
  db.close();
}