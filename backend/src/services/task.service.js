const db = require("../database");

function getAllTasks() {
  return db
    .prepare(`
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
      ORDER BY t.created_at DESC
    `)
    .all();
}

function getTasksByPriority(priority) {
  return db
    .prepare(`
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
      ORDER BY t.created_at DESC
    `)
    .all(priority);
}

function getTasksPerColumn(boardId) {
  return db
    .prepare(`
      SELECT
        c.id,
        c.name,
        COUNT(t.id) AS task_count
      FROM columns c
      LEFT JOIN tasks t
        ON t.column_id = c.id
      WHERE c.board_id = ?
      GROUP BY c.id, c.name
      ORDER BY c.position ASC
    `)
    .all(boardId);
}

function getTaskById(taskId) {
  return db
    .prepare(`
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
      WHERE t.id = ?
    `)
    .get(taskId);
}

function createTask({ columnId, title, description, priority }) {
  if (!title || !title.trim()) {
    throw new Error("Task title is required");
  }

  const result = db
    .prepare(`
      INSERT INTO tasks (
        column_id,
        title,
        description,
        priority
      )
      VALUES (?, ?, ?, ?)
    `)
    .run(columnId, title.trim(), description, priority);

  return db
    .prepare(`
      SELECT
        id,
        column_id,
        title,
        description,
        priority,
        created_at
      FROM tasks
      WHERE id = ?
    `)
    .get(result.lastInsertRowid);
}

function updateTask(
  taskId,
  { columnId, title, description, priority }
) {
  const result = db
    .prepare(`
      UPDATE tasks
      SET
        column_id = ?,
        title = ?,
        description = ?,
        priority = ?
      WHERE id = ?
    `)
    .run(
      columnId,
      title,
      description,
      priority,
      taskId
    );

  if (result.changes === 0) {
    return null;
  }

  return db
    .prepare(`
      SELECT
        id,
        column_id,
        title,
        description,
        priority,
        created_at
      FROM tasks
      WHERE id = ?
    `)
    .get(taskId);
}

function deleteTask(taskId) {
  const result = db
    .prepare(`
      DELETE FROM tasks
      WHERE id = ?
    `)
    .run(taskId);

  return result.changes > 0;
}

module.exports = {
  getAllTasks,
  getTasksByPriority,
  getTasksPerColumn,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};