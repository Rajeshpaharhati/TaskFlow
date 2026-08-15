import { useState } from "react";
import { updateTask } from "../api/taskApi";

function EditTaskForm({ task, columns, onTaskUpdated, onCancel }) {
  const [title, setTitle] = useState(task.title || "");
  const [description, setDescription] = useState(
    task.description || ""
  );
  const [priority, setPriority] = useState(task.priority || "Medium");
  const [columnId, setColumnId] = useState(String(task.column_id));

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

      const response = await updateTask(task.id, {
        column_id: Number(columnId),
        title: title.trim(),
        description: description.trim(),
        priority,
      });

      if (!response.success) {
        throw new Error(
          response.message || "Unable to update task"
        );
      }

      onTaskUpdated(response.data);
    } catch (err) {
      console.error("Update task error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to update task"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="task-form-header">
        <h2>Edit Task</h2>

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
        <label htmlFor="edit-task-title">Title</label>

        <input
          id="edit-task-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={saving}
        />
      </div>

      <div className="form-field">
        <label htmlFor="edit-task-description">
          Description
        </label>

        <textarea
          id="edit-task-description"
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
          rows={4}
          disabled={saving}
        />
      </div>

      <div className="form-field">
        <label htmlFor="edit-task-priority">Priority</label>

        <select
          id="edit-task-priority"
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
        <label htmlFor="edit-task-column">Column</label>

        <select
          id="edit-task-column"
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
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

export default EditTaskForm;