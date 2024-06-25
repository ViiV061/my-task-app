"use client";

import { useState } from "react";
import Link from "next/link";
import { FiMoreHorizontal } from "react-icons/fi";

const BoardItem = ({ board, onDeleteBoard, onUpdateBoard }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(board.title);
  const [showMenu, setShowMenu] = useState(false);

  const handleUpdateBoard = async () => {
    try {
      await onUpdateBoard(board.id, newTitle);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating board:", error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-md p-4 relative">
      <div className="absolute top-2 right-2">
        <button
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={() => setShowMenu(!showMenu)}
        >
          <FiMoreHorizontal size={20} />
        </button>
        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
            <button
              onClick={() => {
                setIsEditing(true);
                setShowMenu(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Edit Title
            </button>
            <button
              onClick={() => {
                onDeleteBoard(board.id);
                setShowMenu(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
            >
              Delete Board
            </button>
          </div>
        )}
      </div>
      {isEditing ? (
        <div>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full mb-2 px-2 py-1 text-xl border border-gray-300 rounded-md"
          />
          <button
            onClick={handleUpdateBoard}
            className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Save
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setNewTitle(board.title);
            }}
            className="ml-4 px-4 py-2 text-gray-700 bg-white rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Cancel
          </button>
        </div>
      ) : (
        <Link href={`/boards/${board.id}`}>
          <h2 className="text-xl font-bold mb-2 hover:text-gray-500 transition duration-200">
            {board.title}
          </h2>
        </Link>
      )}
    </div>
  );
};

export default BoardItem;
