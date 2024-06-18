"use client";

import Link from "next/link";
import { useState } from "react";

const BoardItem = ({ board, onDeleteBoard, onUpdateBoard }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(board.title);

  const handleUpdateBoard = async () => {
    await onUpdateBoard(board.id, newTitle);
    setIsEditing(false);
  };

  return (
    <div className="bg-white shadow-md rounded-md p-4">
      {isEditing ? (
        <div>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full mb-2 px-2 py-1 border border-gray-300 rounded-md"
          />
          <button
            onClick={handleUpdateBoard}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
          >
            Save
          </button>
        </div>
      ) : (
        <>
          <Link href={`/boards/${board.id}`}>
            <h2 className="text-xl font-bold mb-2">{board.title}</h2>
          </Link>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
          >
            Edit
          </button>
          <button
            onClick={() => onDeleteBoard(board.id)}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
          >
            Delete
          </button>
        </>
      )}
    </div>
  );
};

export default BoardItem;
