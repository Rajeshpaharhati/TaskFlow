import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import TaskCard from "../components/TaskCard";
import { useEffect, useState } from "react";
import { getBoard } from "../api/boardApi";
import { deleteTask, updateTask } from "../api/taskApi";

import Board from "../components/Board";
import AddTaskForm from "../components/AddTaskForm";
import EditTaskForm from "../components/EditTaskForm";

function BoardPage() {
    const [board, setBoard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showAddTask, setShowAddTask] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [deletingTaskId, setDeletingTaskId] = useState(null);

    const [activeTask, setActiveTask] = useState(null);
    const [movingTaskId, setMovingTaskId] = useState(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("All");


    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    function filterTasks(tasks) {
        const query = searchQuery.trim().toLowerCase();

        return tasks.filter((task) => {
            const matchesSearch =
                query === "" ||
                task.title.toLowerCase().includes(query) ||
                (task.description || "").toLowerCase().includes(query);

            const matchesPriority =
                priorityFilter === "All" ||
                task.priority === priorityFilter;

            return matchesSearch && matchesPriority;
        });
    }

    function getFilteredBoard() {
        if (!board) {
            return null;
        }

        return {
            ...board,
            columns: board.columns.map((column) => ({
                ...column,
                tasks: filterTasks(column.tasks),
            })),
        };
    }

    const filteredBoard = getFilteredBoard();

    function findTaskById(taskId) {
        if (!board) {
            return null;
        }

        for (const column of board.columns) {
            const task = column.tasks.find(
                (item) => item.id === taskId
            );

            if (task) {
                return task;
            }
        }

        return null;
    }

    function handleDragStart(event) {
        const task = findTaskById(event.active.id);

        if (task) {
            setActiveTask(task);
        }
    }

    function handleDragCancel() {
        setActiveTask(null);
    }

   async function handleDragEnd(event) {
    const { active, over } = event;

    setActiveTask(null);

    if (!over) {
        return;
    }

    const taskId = Number(active.id);

    const overId = String(over.id);

    let newColumnId = null;

    // Case 1:
    // Task was dropped directly on the column area
    if (overId.startsWith("column-")) {
        newColumnId = Number(
            overId.replace("column-", "")
        );
    } 
    // Case 2:
    // Task was dropped on another task
    else {
        const targetTask = findTaskById(Number(overId));

        if (targetTask) {
            newColumnId = Number(targetTask.column_id);
        }
    }

    // Invalid drop target
    if (!Number.isInteger(newColumnId) || newColumnId <= 0) {
        return;
    }

    const task = findTaskById(taskId);

    if (!task) {
        return;
    }

    const currentColumnId = Number(task.column_id);

    // Already in the same column
    if (currentColumnId === newColumnId) {
        return;
    }

    try {
        setMovingTaskId(taskId);
        setError("");

        const response = await updateTask(taskId, {
            column_id: newColumnId,
            title: task.title,
            description: task.description || "",
            priority: task.priority,
        });

        if (!response.success) {
            throw new Error(
                response.message || "Unable to move task"
            );
        }

        await loadBoard();
    } catch (err) {
        console.error("Move task error:", err);

        setError(
            err.response?.data?.message ||
            err.message ||
            "Unable to move task"
        );
    } finally {
        setMovingTaskId(null);
    }
}

    async function loadBoard() {
        try {
            setLoading(true);
            setError("");

            const response = await getBoard(6);

            if (!response.success) {
                throw new Error(
                    response.message || "Unable to fetch board"
                );
            }

            setBoard(response.data);
        } catch (err) {
            console.error("Board loading error:", err);

            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to fetch board"
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadBoard();
    }, []);

    function handleTaskCreated() {
        setShowAddTask(false);
        loadBoard();
    }

    function handleTaskUpdated() {
        setEditingTask(null);
        loadBoard();
    }

    async function handleDeleteTask(task) {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${task.title}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingTaskId(task.id);
            setError("");

            const response = await deleteTask(task.id);

            if (!response.success) {
                throw new Error(
                    response.message || "Unable to delete task"
                );
            }

            await loadBoard();
        } catch (err) {
            console.error("Delete task error:", err);

            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to delete task"
            );
        } finally {
            setDeletingTaskId(null);
        }
    }

    if (loading) {
        return (
            <main className="page">
                <div className="status-message">
                    Loading board...
                </div>
            </main>
        );
    }

    if (error && !board) {
        return (
            <main className="page">
                <div className="status-message error">
                    {error}
                </div>
            </main>
        );
    }

    if (!board) {
        return (
            <main className="page">
                <div className="status-message">
                    Board not found.
                </div>
            </main>
        );
    }

    return (
        <main className="page">
            <header className="board-page-header">
                <div className="board-header-content">
                    <p className="eyebrow">Task Management</p>

                    <h1>{board.name}</h1>

                    <p className="board-subtitle">
                        Organize your work and keep your team moving.
                    </p>
                </div>

                <button
                    type="button"
                    className="primary-button add-task-button"
                    onClick={() => setShowAddTask(true)}
                >
                    + Add Task
                </button>
            </header>

            <div className="board-controls">
                <div className="search-wrapper">
                    <span className="search-icon">⌕</span>

                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="Search tasks..."
                        className="search-input"
                    />
                </div>

                <div className="filter-wrapper">
                    <label htmlFor="priority-filter">
                        Priority
                    </label>

                    <select
                        id="priority-filter"
                        value={priorityFilter}
                        onChange={(event) => setPriorityFilter(event.target.value)}
                        className="priority-filter"
                    >
                        <option value="All">All</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>
            </div>

            {error && (
                <div className="form-error page-error">
                    {error}
                </div>
            )}

            {showAddTask && (
                <div className="form-overlay">
                    <div className="form-modal">
                        <AddTaskForm
                            columns={board.columns}
                            onTaskCreated={handleTaskCreated}
                            onCancel={() => setShowAddTask(false)}
                        />
                    </div>
                </div>
            )}

            {editingTask && (
                <div className="form-overlay">
                    <div className="form-modal">
                        <EditTaskForm
                            task={editingTask}
                            columns={board.columns}
                            onTaskUpdated={handleTaskUpdated}
                            onCancel={() => setEditingTask(null)}
                        />
                    </div>
                </div>
            )}

            <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragCancel={handleDragCancel}
                onDragEnd={handleDragEnd}
            >
                <Board
                    board={filteredBoard}
                    onEditTask={setEditingTask}
                    onDeleteTask={handleDeleteTask}
                />

                <DragOverlay>
                    {activeTask ? (
                        <TaskCard
                            task={activeTask}
                            onEdit={() => { }}
                            onDelete={() => { }}
                        />
                    ) : null}
                </DragOverlay>
            </DndContext>

            {deletingTaskId !== null && (
                <div className="deleting-indicator">
                    Deleting task...
                </div>
            )}

            {movingTaskId !== null && (
                <div className="deleting-indicator">
                    Moving task...
                </div>
            )}
        </main>
    );
}

export default BoardPage;