"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AddBoard from "@/components/AddBoard";
import BoardItem from "@/components/BoardItem";
import { FiMoreHorizontal, FiPlus } from "react-icons/fi";
import Link from "next/link";

const BoardListPage = () => {
  const [boards, setBoards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    const { data, error } = await supabase.from("boards").select("*");
    if (error) {
      console.error("Error fetching boards:", error);
      return;
    }
    setBoards(data || []);
    setIsLoading(false);
  };

  const handleAddBoard = async (title) => {
    const { data, error } = await supabase
      .from("boards")
      .insert({ title })
      .single();

    if (error) {
      console.error("Error adding board:", error);
    } else if (data) {
      setBoards((prevBoards) => [...prevBoards, data]);
    }
  };

  const handleDeleteBoard = async (id) => {
    const { error } = await supabase.from("boards").delete().eq("id", id);
    if (error) {
      console.error("Error deleting board:", error);
      return;
    }
    setBoards((prevBoards) => prevBoards.filter((board) => board.id !== id));
  };

  const handleUpdateBoard = async (id, newTitle) => {
    const { error } = await supabase
      .from("boards")
      .update({ title: newTitle })
      .eq("id", id);
    if (error) {
      console.error("Error updating board:", error);
      return;
    }
    setBoards((prevBoards) =>
      prevBoards.map((board) =>
        board.id === id ? { ...board, title: newTitle } : board
      )
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Boards</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={handleAddBoard}
          className="bg-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-300 flex items-center justify-center"
        >
          <FiPlus className="text-3xl" />
          <span className="ml-2">Create new board</span>
        </div>
        {boards.map((board) => (
          <div
            key={board.id}
            className="bg-white shadow-md rounded-lg p-4 relative"
          >
            <div className="absolute top-2 right-2">
              <button className="text-gray-500 hover:text-gray-700">
                <FiMoreHorizontal />
              </button>
            </div>
            <h2 className="text-xl font-semibold mb-2">{board.title}</h2>
            <div className="flex justify-between items-center mt-4">
              <Link href={`/boards/${board.id}`}>
                <button className="bg-blue-500 text-white py-1 px-2 rounded">
                  Open
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoardListPage;
