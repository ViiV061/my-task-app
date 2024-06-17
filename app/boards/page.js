"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AddBoardForm from "@/components/AddBoardForm";
import BoardItem from "@/components/BoardItem";

const BoardListPage = () => {
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
    setBoards(data || []);
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
    fetchBoards();
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

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-primary">Boards</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {boards.map((board) => (
          <BoardItem
            key={board.id}
            board={board}
            onDeleteBoard={handleDeleteBoard}
            onUpdateBoard={handleUpdateBoard}
          />
        ))}
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Create a New Board</h2>
        <AddBoardForm onAddBoard={handleAddBoard} />
      </div>
    </div>
  );
};

export default BoardListPage;
