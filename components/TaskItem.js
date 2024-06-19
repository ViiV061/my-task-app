import { useState } from "react";
import {
  FiMoreHorizontal,
  FiTrash2,
  FiCopy,
  FiArrowRight,
  FiEdit,
} from "react-icons/fi";

const TaskItem = ({ task, onUpdate, onDelete, onCopy, onMove }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);

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
          onBlur={handleUpdateTask} // save updated task when user click outside the textarea
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
                onClick={(e) => {
                  e.stopPropagation();
                  onMove(task);
                  setShowMenu(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-200 ease-in-out"
              >
                <FiArrowRight className="inline-block mr-2" />
                Move
              </button>
            </div>
          )}
        </div>
      )}
    </li>
  );
};

export default TaskItem;
