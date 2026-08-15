const db = require("../database");

function getBoardById(boardId) {
  const board = db
    .prepare(`
      SELECT id, name
      FROM boards
      WHERE id = ?
    `)
    .get(boardId);

  if (!board) {
    return null;
  }

  const columns = db
    .prepare(`
      SELECT id, board_id, name, position
      FROM columns
      WHERE board_id = ?
      ORDER BY position ASC
    `)
    .all(boardId);

  const getTasksForColumn = db.prepare(`
    SELECT
      id,
      column_id,
      title,
      description,
      priority,
      created_at
    FROM tasks
    WHERE column_id = ?
    ORDER BY created_at DESC
  `);

  const columnsWithTasks = columns.map((column) => ({
    ...column,
    tasks: getTasksForColumn.all(column.id),
  }));

  return {
    ...board,
    columns: columnsWithTasks,
  };
}

module.exports = {
  getBoardById,
};