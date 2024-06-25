"use client";

import { useState } from "react";

export default function AddCard({ boardId, onAdd, onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    if (!title || title.trim() === "") {
      return;
    }

    await onAdd(title.trim(), description || null);
    setTitle("");
    setDescription("");
    onClose();
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Card Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 mb-2 mr-4 rounded-md"
      />
      <input
        type="text"
        placeholder="Card Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 mb-2 mr-4 rounded-md"
      />
      <button
        onClick={handleSubmit}
        disabled={!title || title.trim() === ""}
        className="bg-gray-700 text-white p-2 rounded-md disabled:opacity-50"
      >
        Add Card
      </button>
    </div>
  );
}
