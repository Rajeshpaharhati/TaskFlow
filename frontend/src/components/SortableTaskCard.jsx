import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableTaskCard({ task, onEdit, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
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
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                onEdit(task);
              }}
            >
              Edit
            </button>

            <button
              type="button"
              className="task-action-button delete-action"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                onDelete(task);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}

export default SortableTaskCard;