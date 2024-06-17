"use client";

import { useState } from "react";
import Link from "next/link";

const BoardItem = ({ board, onDeleteBoard, onUpdateBoard }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(board.title);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setTitle(board.title);
  };

  const handleSaveClick = () => {
    onUpdateBoard(board.id, title);
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-4 rounded shadow flex justify-between items-center">
      {isEditing ? (
        <>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
          />
          <div>
            <button
              onClick={handleSaveClick}
              className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
            >
              Save
            </button>
            <button
              onClick={handleCancelClick}
              className="bg-gray-500 text-white px-2 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <Link href={`/boards/${board.id}`}>
            <h2 className="text-xl font-bold">{board.title}</h2>
          </Link>
          <div>
            <button
              onClick={handleEditClick}
              className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
            >
              Edit
            </button>
            <button
              onClick={() => onDeleteBoard(board.id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BoardItem;
