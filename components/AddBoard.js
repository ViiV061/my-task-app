"use client";

import { useState } from "react";

const AddBoard = ({ onAddBoard }) => {
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onAddBoard(title.trim());
      setTitle("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border border-gray-300 rounded px-2 py-1"
        placeholder="Enter board title"
      />
      <button
        type="submit"
        className="bg-gray-700 text-white px-4 py-2 rounded ml-2 mt-4"
      >
        Add
      </button>
    </form>
  );
};

export default AddBoard;
