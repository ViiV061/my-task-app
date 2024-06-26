import { useState, useEffect } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import {
  getTasksByCardId,
  createTask,
  updateTask,
  deleteTask,
  moveTaskWithinCard,
  moveTaskToAnotherCard,
} from "@/lib/taskData";
import TaskItem from "./TaskItem";

const CardItem = ({
  card,
  onUpdate,
  onDelete,
  onMoveCard,
  onMoveTaskToAnotherCard,
  totalCards,
  currentPosition,
  menuClassName,
  cards,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description);
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showTaskInput, setShowTaskInput] = useState(false);
  const [showMoveListMenu, setShowMoveListMenu] = useState(false);

  useEffect(() => {
    setTasks(card.tasks || []);
  }, [card]);

  const fetchTasks = async () => {
    try {
      const data = await getTasksByCardId(card.id);
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
    }
  };

  const handleUpdate = async () => {
    await onUpdate(card.id, title, description);
    setIsEditing(false);
  };

  const handleCreateTask = async () => {
    try {
      const newTask = await createTask(card.id, newTaskTitle);
      setTasks([...tasks, newTask]);
      setNewTaskTitle("");
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleUpdateTask = async (taskId, title) => {
    try {
      const updatedTask = await updateTask(taskId, title);
      setTasks(tasks.map((task) => (task.id === taskId ? updatedTask : task)));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleCopyTask = async (task) => {
    try {
      const newTask = await createTask(card.id, task.title);
      if (newTask) {
        setTasks([...tasks, newTask]);
      }
    } catch (error) {
      console.error("Error copying task:", error);
    }
  };

  const handleMoveTask = async (taskId, newPosition) => {
    try {
      const updatedTasks = await moveTaskWithinCard(taskId, newPosition);
      setTasks(updatedTasks.sort((a, b) => a.position - b.position));
    } catch (error) {
      console.error("Error moving task:", error);
    }
  };

  const handleMoveTaskToAnotherCard = (taskId, newCardId) => {
    onMoveTaskToAnotherCard(taskId, card.id, newCardId);
  };

  const moveCard = async (newPosition) => {
    try {
      await onMoveCard(card.id, newPosition);
    } catch (error) {
      console.error("Error moving card:", error);
    }
  };

  return (
    <div
      className="bg-white shadow-md rounded-md p-4 mb-2 flex-shrink-0 w-80"
      style={{ minHeight: "400px" }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-center w-full mb-4">
          {card.title}
        </h3>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none transition duration-200 ease-in-out transform hover:scale-125"
          >
            <FiMoreHorizontal />
          </button>
          {showMenu && (
            <div
              className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 ${menuClassName}`}
              onMouseLeave={() => {
                if (!showMoveListMenu) {
                  setShowMenu(false);
                }
              }}
            >
              <button
                onClick={() => {
                  setShowTaskInput(true);
                  setShowMenu(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Add Task
              </button>
              <button
                onClick={() => {
                  setIsEditing(true);
                  setShowMenu(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  setShowMoveListMenu(true);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Move List
              </button>
              {showMoveListMenu && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10"
                  onMouseLeave={() => setShowMoveListMenu(false)}
                >
                  {Array.from({ length: totalCards }, (_, i) => i + 1).map(
                    (position) => (
                      <button
                        key={position}
                        onClick={() => {
                          moveCard(position);
                          setShowMoveListMenu(false);
                          setShowMenu(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {position} {position === currentPosition && "(current)"}
                      </button>
                    )
                  )}
                </div>
              )}
              <button
                onClick={() => {
                  onDelete(card.id);
                  setShowMenu(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-100"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      {isEditing ? (
        <div className="mb-4 p-2 bg-gray-100 rounded">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mb-2 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mb-2 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          ></textarea>
          <button
            onClick={handleUpdate}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-1 px-2 rounded transition duration-200 ease-in-out"
          >
            Save
          </button>
        </div>
      ) : (
        <p className="text-gray-600 mb-4">{card.description}</p>
      )}
      <div>
        <ul>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
              onCopy={handleCopyTask}
              onMove={handleMoveTask}
              onMoveToAnotherCard={handleMoveTaskToAnotherCard}
              cards={cards}
              currentCardId={card.id}
              tasksCount={tasks.length}
            />
          ))}
        </ul>
        {showTaskInput && (
          <div className="mt-2 flex">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="New task"
              className="flex-grow border border-gray-300 rounded px-2 py-1 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={() => {
                handleCreateTask();
                setShowTaskInput(false);
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-2 rounded transition duration-200 ease-in-out"
            >
              Add
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardItem;
