

// Use an isolated in-memory database for Jest
process.env.TASKFLOW_DB_PATH = ":memory:";

const db = require("../src/database");
const taskService = require("../src/services/task.service");

describe("Task Service", () => {
  let boardId;
  let todoColumnId;
  let inProgressColumnId;
  let doneColumnId;

  beforeAll(() => {
    // Create a test board
    const board = db
      .prepare(`
        INSERT INTO boards (name)
        VALUES (?)
      `)
      .run("Test Board");

    boardId = board.lastInsertRowid;

    // Create test columns
    const insertColumn = db.prepare(`
      INSERT INTO columns (
        board_id,
        name,
        position
      )
      VALUES (?, ?, ?)
    `);

    todoColumnId = insertColumn.run(
      boardId,
      "To Do",
      1
    ).lastInsertRowid;

    inProgressColumnId = insertColumn.run(
      boardId,
      "In Progress",
      2
    ).lastInsertRowid;

    doneColumnId = insertColumn.run(
      boardId,
      "Done",
      3
    ).lastInsertRowid;

    // Create one test task
    db.prepare(`
      INSERT INTO tasks (
        column_id,
        title,
        description,
        priority
      )
      VALUES (?, ?, ?, ?)
    `).run(
      todoColumnId,
      "Initial Test Task",
      "Task used for Jest testing.",
      "Medium"
    );
  });

  afterAll(() => {
    db.close();
  });

  test("should return all tasks", () => {
    const tasks = taskService.getAllTasks();

    expect(Array.isArray(tasks)).toBe(true);
    expect(tasks.length).toBeGreaterThan(0);
  });

  test("should return a task by ID", () => {
    const tasks = taskService.getAllTasks();

    const taskId = tasks[0].id;

    const task = taskService.getTaskById(taskId);

    expect(task).toBeDefined();
    expect(task.id).toBe(taskId);
  });

  test("should create a new task", () => {
    const task = taskService.createTask({
      columnId: todoColumnId,
      title: "Jest Create Task",
      description: "Task created during automated testing.",
      priority: "Medium",
    });

    expect(task).toBeDefined();
    expect(task.id).toBeDefined();
    expect(task.column_id).toBe(todoColumnId);
    expect(task.title).toBe("Jest Create Task");
    expect(task.description).toBe(
      "Task created during automated testing."
    );
    expect(task.priority).toBe("Medium");
  });

  test("should reject creating a task without a title", () => {
    expect(() => {
      taskService.createTask({
        columnId: todoColumnId,
        title: "",
        description: "Task without a title",
        priority: "Medium",
      });
    }).toThrow();
  });

  test("should move a task to another column", () => {
    const tasks = taskService.getAllTasks();

    const task = tasks[0];

    const newColumnId =
      task.column_id === todoColumnId
        ? inProgressColumnId
        : todoColumnId;

    const updatedTask = taskService.updateTask(
      task.id,
      {
        columnId: newColumnId,
        title: task.title,
        description: task.description,
        priority: task.priority,
      }
    );

    expect(updatedTask).toBeDefined();
    expect(updatedTask.id).toBe(task.id);
    expect(updatedTask.column_id).toBe(newColumnId);
  });
});