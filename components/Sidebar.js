"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { FiClipboard } from "react-icons/fi";

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

  return (
    <aside className="bg-gray-700 text-white border-r border-gray-800  w-64 p-4 flex flex-col">
      <Link
        href="/boards"
        className="text-xl font-semibold mb-4 cursor-pointer hover:text-gray-900 hover:"
      >
        All Boards
      </Link>

      <ul className="mb-4 space-y-2">
        {boards.map((board) => (
          <li key={board.id} className="group">
            <Link
              href={`/boards/${board.id}`}
              className="block px-4 py-2 rounded-md hover:bg-gray-400 group-hover:bg-gray-200 hover:text-black transition duration-200 ease-in-out"
            >
              <div className="flex items-center space-x-2">
                <FiClipboard />
                <span className="group-hover:font-semibold">{board.title}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
