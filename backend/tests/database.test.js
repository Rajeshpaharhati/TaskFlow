// Use an isolated in-memory database for Jest
process.env.TASKFLOW_DB_PATH = ":memory:";

const db = require("../src/database");

describe("Database Layer", () => {
  beforeAll(() => {
    // Create test data directly through the database
    const board = db
      .prepare(`
        INSERT INTO boards (name)
        VALUES (?)
      `)
      .run("Database Test Board");

    const boardId = board.lastInsertRowid;

    const column = db
      .prepare(`
        INSERT INTO columns (
          board_id,
          name,
          position
        )
        VALUES (?, ?, ?)
      `)
      .run(
        boardId,
        "To Do",
        1
      );

    db.prepare(`
      INSERT INTO tasks (
        column_id,
        title,
        description,
        priority
      )
      VALUES (?, ?, ?, ?)
    `).run(
      column.lastInsertRowid,
      "Database Test Task",
      "Task for database layer testing.",
      "High"
    );
  });

  afterAll(() => {
    db.close();
  });

  test("should directly query tasks from the database", () => {
    const tasks = db
      .prepare(`
        SELECT
          id,
          column_id,
          title,
          priority
        FROM tasks
        ORDER BY id
      `)
      .all();

    expect(Array.isArray(tasks)).toBe(true);
    expect(tasks.length).toBeGreaterThan(0);

    expect(tasks[0]).toHaveProperty("id");
    expect(tasks[0]).toHaveProperty("column_id");
    expect(tasks[0]).toHaveProperty("title");
    expect(tasks[0]).toHaveProperty("priority");
  });
});