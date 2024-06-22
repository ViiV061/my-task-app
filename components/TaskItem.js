import { useState } from "react";
import {
  FiMoreHorizontal,
  FiTrash2,
  FiCopy,
  FiArrowRight,
  FiEdit,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";

const TaskItem = ({
  task,
  onUpdate,
  onDelete,
  onCopy,
  onMove,
  onMoveToAnotherCard,
  cards,
  currentCardId,
  tasksCount,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [showMoveMenu, setShowMoveMenu] = useState(false);

  const handleUpdateTask = async () => {
    try {
      await onUpdate(task.id, title);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <li
      className={`flex items-center py-2 px-2 border rounded mb-2 transition duration-200 ease-in-out ${
        isHovered
          ? "border-2 border-blue-400 shadow-md transform scale-105"
          : "border border-gray-300"
      }`}
      style={{ minHeight: "40px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isEditing ? (
        <textarea
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleUpdateTask}
          className="flex-grow border border-gray-300 rounded px-2 py-1 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          style={{ minHeight: "40px" }}
        />
      ) : (
        <span
          className="flex-grow cursor-pointer transition duration-200 ease-in-out hover:text-blue-600"
          onClick={() => setIsEditing(true)}
        >
          {task.title}
        </span>
      )}
      {isHovered && (
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="text-gray-500 hover:text-gray-700 focus:outline-none transition duration-200 ease-in-out transform hover:scale-125"
          >
            <FiMoreHorizontal />
          </button>
          {showMenu && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 transition duration-200 ease-in-out origin-top-right"
              onMouseLeave={() => setShowMenu(false)}
            >
              <button
                onClick={() => {
                  setIsEditing(true);
                  setShowMenu(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-200 ease-in-out"
              >
                <FiEdit className="inline-block mr-2" />
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task.id);
                  setShowMenu(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-100 transition duration-200 ease-in-out"
              >
                <FiTrash2 className="inline-block mr-2" />
                Delete
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCopy(task);
                  setShowMenu(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-200 ease-in-out"
              >
                <FiCopy className="inline-block mr-2" />
                Copy
              </button>
              <button
                onClick={() => setShowMoveMenu(true)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FiArrowRight className="inline-block mr-2" />
                Move
              </button>
              {showMoveMenu && (
                <div className="ml-4">
                  <button
                    onClick={() => {
                      onMove(task.id, task.position - 1);
                      setShowMenu(false);
                      setShowMoveMenu(false);
                    }}
                    disabled={task.position === 1}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <FiArrowUp className="inline-block mr-2" />
                    Move Up
                  </button>
                  <button
                    onClick={() => {
                      onMove(task.id, task.position + 1);
                      setShowMenu(false);
                      setShowMoveMenu(false);
                    }}
                    disabled={task.position === tasksCount}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <FiArrowDown className="inline-block mr-2" />
                    Move Down
                  </button>
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        onMoveToAnotherCard(task.id, e.target.value);
                        setShowMenu(false);
                        setShowMoveMenu(false);
                      }
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <option value="">Move to another card</option>
                    {cards
                      .filter((card) => card.id !== currentCardId)
                      .map((card) => (
                        <option key={card.id} value={card.id}>
                          {card.title}
                        </option>
                      ))}
                  </select>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </li>
  );
};

export default TaskItem;
