import { useDroppable } from "@dnd-kit/core";
import SortableTaskCard from "./SortableTaskCard";

function Column({ column, onEditTask, onDeleteTask }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${column.id}`,
  });

  return (
    <section
      ref={setNodeRef}
      className={`board-column ${
        isOver ? "board-column-over" : ""
      }`}
    >
      <div className="column-header">
        <h2>{column.name}</h2>

        <span className="task-count">
          {column.tasks.length}
        </span>
      </div>

      <div className="column-tasks">
        {column.tasks.length === 0 ? (
          <p className="empty-column">
            Drop tasks here
          </p>
        ) : (
          column.tasks.map((task) => (
            <SortableTaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))
        )}
      </div>
    </section>
  );
}

export default Column;