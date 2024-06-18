"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AddCard({ boardId, onAdd }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const addCard = async () => {
    const { data, error } = await supabase
      .from("cards")
      .insert([{ title, description, board_id: boardId }])
      .select();

    if (error) {
      console.error("Error adding card:", error);
    } else {
      setTitle("");
      setDescription("");
      onAdd();
    }
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Card Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 mb-2"
      />
      <input
        type="text"
        placeholder="Card Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 mb-2"
      />
      <button onClick={addCard} className="bg-blue-500 text-white p-2">
        Add Card
      </button>
    </div>
  );
}