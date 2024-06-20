"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AddCard({ boardId, onAdd }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const addCard = async () => {
    if (!title || title.trim() === "") {
      //
      return;
    }

    const { data, error } = await supabase
      .from("cards")
      .insert([
        {
          title: title.trim(),
          description: description || null,
          board_id: boardId,
        },
      ])
      .select("id, title, description, board_id")
      .single();

    if (error) {
      console.error("Error adding card:", error);
    } else {
      setTitle("");
      setDescription("");
      onAdd(data);
    }
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
        onClick={addCard}
        disabled={!title || title.trim() === ""}
        className="bg-gray-700 text-white p-2 rounded-md disabled:opacity-50"
      >
        Add Card
      </button>
    </div>
  );
}
