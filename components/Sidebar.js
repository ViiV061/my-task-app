"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const Sidebar = () => {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    const { data, error } = await supabase.from("boards").select("*");
    if (error) {
      console.error("Error fetching boards:", error);
      return;
    }
    setBoards(data);
  };

  const handleAddBoard = async () => {
    const title = prompt("Enter board title:");
    if (title) {
      const { data, error } = await supabase
        .from("boards")
        .insert({ title })
        .single();
      if (error) {
        console.error("Error creating board:", error);
        return;
      }
      setBoards([...boards, data]);
    }
  };

  return (
    <aside className="bg-white border-r border-gray-300 w-64 p-4 flex flex-col">
      <Link href="/boards">
        <h2 className="text-xl font-semibold mb-4">Boards</h2>
      </Link>

      <ul className="mb-4 space-y-2">
        {boards.map((board) => (
          <li key={board.id}>
            <Link
              href={`/boards/${board.id}`}
              className="block px-4 py-2 rounded-md hover:bg-gray-100"
            >
              {board.title}
            </Link>
          </li>
        ))}
      </ul>

      <button onClick={handleAddBoard} className="btn btn-primary mt-auto">
        Add Board
      </button>
    </aside>
  );
};

export default Sidebar;
