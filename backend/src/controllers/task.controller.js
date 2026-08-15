const taskService = require("../services/task.service");

function createTask(req, res) {
  try {
    const { column_id, title, description, priority } = req.body;

    const columnId = Number(column_id);

    if (!Number.isInteger(columnId) || columnId <= 0) {
      return res.status(400).json({
        success: false,
        message: "A valid column_id is required",
      });
    }

    if (typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Task title is required",
      });
    }

    const allowedPriorities = ["Low", "Medium", "High"];

    if (!allowedPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: "Priority must be Low, Medium, or High",
      });
    }

    const task = taskService.createTask({
      columnId,
      title: title.trim(),
      description:
        typeof description === "string" ? description.trim() : "",
      priority,
    });

    return res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error("Create task error:", error);

    if (error.code === "SQLITE_CONSTRAINT_FOREIGNKEY") {
      return res.status(400).json({
        success: false,
        message: "Column not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to create task",
    });
  }
}

function getTasks(req, res) {
  try {
    const { priority } = req.query;

    if (priority !== undefined) {
      const allowedPriorities = ["Low", "Medium", "High"];

      if (!allowedPriorities.includes(priority)) {
        return res.status(400).json({
          success: false,
          message: "Priority must be Low, Medium, or High",
        });
      }

      const tasks = taskService.getTasksByPriority(priority);

      return res.status(200).json({
        success: true,
        data: tasks,
      });
    }

    const tasks = taskService.getAllTasks();

    return res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    console.error("Get tasks error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch tasks",
    });
  }
}

function updateTask(req, res) {
  try {
    const taskId = Number(req.params.id);

    if (!Number.isInteger(taskId) || taskId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const { column_id, title, description, priority } = req.body;

    const columnId = Number(column_id);

    if (!Number.isInteger(columnId) || columnId <= 0) {
      return res.status(400).json({
        success: false,
        message: "A valid column_id is required",
      });
    }

    if (typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Task title is required",
      });
    }

    const allowedPriorities = ["Low", "Medium", "High"];

    if (!allowedPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: "Priority must be Low, Medium, or High",
      });
    }

    const task = taskService.updateTask(taskId, {
      columnId,
      title: title.trim(),
      description:
        typeof description === "string"
          ? description.trim()
          : "",
      priority,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error("Update task error:", error);

    if (error.code === "SQLITE_CONSTRAINT_FOREIGNKEY") {
      return res.status(400).json({
        success: false,
        message: "Column not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to update task",
    });
  }
}

function deleteTask(req, res) {
  try {
    const taskId = Number(req.params.id);

    if (!Number.isInteger(taskId) || taskId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const deleted = taskService.deleteTask(taskId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete task",
    });
  }
}

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};