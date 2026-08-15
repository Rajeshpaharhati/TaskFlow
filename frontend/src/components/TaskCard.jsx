function TaskCard({ task, onEdit, onDelete }) {
  return (
    <article className="task-card">
      <div className="task-card-header">
        <h3 className="task-title">{task.title}</h3>

        <span
          className={`priority-badge priority-${task.priority.toLowerCase()}`}
        >
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="task-description">
          {task.description}
        </p>
      )}

      <div className="task-card-footer">
        <span>#{task.id}</span>

        <div className="task-actions">
          <button
            type="button"
            className="task-action-button"
            onClick={() => onEdit(task)}
          >
            Edit
          </button>

          <button
            type="button"
            className="task-action-button delete-action"
            onClick={() => onDelete(task)}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

export default TaskCard;