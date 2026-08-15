import { useState } from "react";
import { createTask } from "../api/taskApi";

function AddTaskForm({ columns, onTaskCreated, onCancel }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [columnId, setColumnId] = useState(
    columns.length > 0 ? String(columns[0].id) : ""
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (!title.trim()) {
      setError("Task title is required");
      return;
    }

    if (!columnId) {
      setError("Please select a column");
      return;
    }

    try {
      setSaving(true);

      const response = await createTask({
        column_id: Number(columnId),
        title: title.trim(),
        description: description.trim(),
        priority,
      });

      if (!response.success) {
        throw new Error(
          response.message || "Unable to create task"
        );
      }

      setTitle("");
      setDescription("");
      setPriority("Medium");

      onTaskCreated(response.data);
    } catch (err) {
      console.error("Create task error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to create task"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="task-form-header">
        <h2>Add Task</h2>

        <button
          type="button"
          className="icon-button"
          onClick={onCancel}
          disabled={saving}
          aria-label="Close form"
        >
          ×
        </button>
      </div>

      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      <div className="form-field">
        <label htmlFor="task-title">Title</label>

        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Enter task title"
          disabled={saving}
        />
      </div>

      <div className="form-field">
        <label htmlFor="task-description">
          Description
        </label>

        <textarea
          id="task-description"
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
          placeholder="Enter task description"
          rows={4}
          disabled={saving}
        />
      </div>

      <div className="form-field">
        <label htmlFor="task-priority">Priority</label>

        <select
          id="task-priority"
          value={priority}
          onChange={(event) =>
            setPriority(event.target.value)
          }
          disabled={saving}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <div className="form-field">
        <label htmlFor="task-column">Column</label>

        <select
          id="task-column"
          value={columnId}
          onChange={(event) =>
            setColumnId(event.target.value)
          }
          disabled={saving}
        >
          {columns.map((column) => (
            <option key={column.id} value={column.id}>
              {column.name}
            </option>
          ))}
        </select>
      </div>

      <div className="task-form-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="primary-button"
          disabled={saving}
        >
          {saving ? "Creating..." : "Create Task"}
        </button>
      </div>
    </form>
  );
}

export default AddTaskForm;