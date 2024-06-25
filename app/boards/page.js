"use client";

import { useState, useEffect } from "react";
import { useBoards } from "@/context/BoardsContext";
import BoardItem from "@/components/BoardItem";
import { FiSearch } from "react-icons/fi";
import ConfirmationModal from "@/components/ConfirmationModal";
import { getCardsByBoardId, deleteCardsByBoardId } from "@/lib/cardData";

const BoardListPage = () => {
  const { boards, addBoard, updateExistingBoard, removeBoard, getBoards } =
    useBoards();
  const [isLoading, setIsLoading] = useState(true);
  const [showAddBoard, setShowAddBoard] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [boardToDelete, setBoardToDelete] = useState(null);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    getBoards().finally(() => setIsLoading(false));
  }, [getBoards]);

  const handleAddBoard = async () => {
    if (newBoardTitle.trim()) {
      try {
        await addBoard(newBoardTitle.trim());
        setNewBoardTitle("");
        setShowAddBoard(false);
      } catch (error) {
        console.error("Error adding board:", error);
      }
    }
  };

  const handleDeleteBoard = async () => {
    const cards = await getCardsByBoardId(boardToDelete);

    if (cards.length > 0) {
      await deleteCardsByBoardId(boardToDelete);
    }

    try {
      await removeBoard(boardToDelete);
      setShowModal(false);
      setBoardToDelete(null);
    } catch (error) {
      console.error("Error deleting board:", error);
    }
  };

  const handleShowModal = async (boardId) => {
    const cards = await getCardsByBoardId(boardId);
    if (cards.length > 0) {
      setModalMessage(
        "This board has tasks. Are you sure you want to delete it?"
      );
    } else {
      setModalMessage("Are you sure you want to delete this board?");
    }
    setBoardToDelete(boardId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setBoardToDelete(null);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    getBoards();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Boards</h1>
      <div className="flex justify-end items-center mb-4">
        <form onSubmit={handleSearch} className="flex items-center">
          <input
            type="text"
            placeholder="Search boards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border px-2 py-1 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <button
            type="submit"
            className="bg-gray-500 text-white px-4 py-1 rounded-r-md hover:bg-gray-600"
          >
            <FiSearch size={26} />
          </button>
        </form>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          onClick={() => setShowAddBoard(true)}
          className="bg-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-300 flex items-center justify-center"
        >
          {showAddBoard ? (
            <div className="w-full">
              <input
                type="text"
                value={newBoardTitle}
                onChange={(e) => setNewBoardTitle(e.target.value)}
                placeholder="Board title"
                className="w-full px-2 py-1 text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              <div className="mt-2 space-x-2">
                <button
                  onClick={handleAddBoard}
                  className="mt-2 px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  Add Board
                </button>
                <button
                  onClick={() => setShowAddBoard(false)}
                  className="ml-4 px-4 py-2 text-gray-700 bg-white rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <span className="text-xl">+ Create New Board</span>
          )}
        </div>
        {boards.map((board) => (
          <BoardItem
            key={board.id}
            board={board}
            onDeleteBoard={handleShowModal}
            onUpdateBoard={updateExistingBoard}
          />
        ))}
      </div>
      <ConfirmationModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onConfirm={handleDeleteBoard}
        message={modalMessage}
      />
    </div>
  );
};

export default BoardListPage;
