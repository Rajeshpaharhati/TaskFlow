import Column from "./Column";

function Board({ board, onEditTask, onDeleteTask }) {
  return (
    <div className="board">
      {board.columns.map((column) => (
        <Column
          key={column.id}
          column={column}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </div>
  );
}

export default Board;