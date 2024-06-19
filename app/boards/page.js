"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AddBoard from "@/components/AddBoard";
import BoardItem from "@/components/BoardItem";
import { FiMoreHorizontal } from "react-icons/fi";
import Link from "next/link";

const BoardListPage = () => {
  const [boards, setBoards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingBoardId, setEditingBoardId] = useState(null);
  const [showMenu, setShowMenu] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [showAddBoard, setShowAddBoard] = useState(false);

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
    setShowAddBoard(false);
  };

  const handleDeleteBoard = async (id) => {
    // first delete all cards associated with the board
    const { error: deleteCardsError } = await supabase
      .from("cards")
      .delete()
      .eq("board_id", id);

    if (deleteCardsError) {
      console.error("Error deleting cards:", deleteCardsError);
      return;
    }

    // then delete the board
    const { data, error: deleteBoardError } = await supabase
      .from("boards")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (deleteBoardError) {
      if (deleteBoardError.code === "PGRST116") {
        console.warn(
          "Board does not exist or multiple boards with the same ID found:",
          id
        );
      } else {
        console.error("Error deleting board:", deleteBoardError);
      }
      return;
    }

    // If the deletion was successful, remove the deleted board from the state
    if (data) {
      setBoards((prevBoards) => prevBoards.filter((board) => board.id !== id));
    }
  };

  const handleUpdateBoard = async (id) => {
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
    setEditingBoardId(null);
    setNewTitle("");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Boards</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setShowAddBoard(true)}
          className="bg-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-300 flex items-center justify-center"
        >
          <span className="text-xl">+</span>
          <span className="ml-2">Create new board</span>
        </div>
        {boards.map((board) => (
          <Link
            key={board.id}
            href={editingBoardId === board.id ? "#" : `/boards/${board.id}`}
          >
            <div className="bg-white shadow-md rounded-lg p-4 relative">
              <div className="absolute top-2 right-2">
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowMenu(board.id === showMenu ? null : board.id);
                  }}
                >
                  <FiMoreHorizontal />
                </button>
                {showMenu === board.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingBoardId(board.id);
                        setNewTitle(board.title);
                        setShowMenu(null);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Edit Title
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteBoard(board.id);
                        setShowMenu(null);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                    >
                      Delete Board
                    </button>
                  </div>
                )}
              </div>
              {editingBoardId === board.id ? (
                <div onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="border border-gray-300 rounded-md px-2 py-1 w-full"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleUpdateBoard(board.id);
                    }}
                    className="bg-bray-500 text-white px-2 py-1 rounded-md mt-2"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <h2 className="text-xl font-semibold mb-2">{board.title}</h2>
              )}
            </div>
          </Link>
        ))}
      </div>
      {showAddBoard && (
        <AddBoard
          onClose={() => setShowAddBoard(false)}
          onAddBoard={handleAddBoard}
        />
      )}
    </div>
  );
};

export default BoardListPage;
