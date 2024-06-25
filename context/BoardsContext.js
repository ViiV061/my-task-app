import { createContext, useContext, useState, useEffect } from "react";
import {
  fetchBoards,
  createBoard,
  updateBoard,
  deleteBoard,
} from "@/lib/boardData";

const BoardsContext = createContext();

export const useBoards = () => {
  return useContext(BoardsContext);
};

export const BoardsProvider = ({ children }) => {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    getBoards();
  }, []);

  const getBoards = async () => {
    try {
      const data = await fetchBoards();
      setBoards(data);
    } catch (error) {
      console.error("Error fetching boards:", error);
    }
  };

  const addBoard = async (title) => {
    try {
      const newBoard = await createBoard(title);
      setBoards((prevBoards) => [...prevBoards, newBoard]);
    } catch (error) {
      console.error("Error creating board:", error);
    }
  };

  const updateExistingBoard = async (id, title) => {
    try {
      const updatedBoard = await updateBoard(id, title);
      setBoards((prevBoards) =>
        prevBoards.map((board) => (board.id === id ? updatedBoard : board))
      );
    } catch (error) {
      console.error("Error updating board:", error);
    }
  };

  const removeBoard = async (id) => {
    try {
      await deleteBoard(id);
      setBoards((prevBoards) => prevBoards.filter((board) => board.id !== id));
    } catch (error) {
      console.error("Error deleting board:", error);
    }
  };

  return (
    <BoardsContext.Provider
      value={{ boards, addBoard, updateExistingBoard, removeBoard, getBoards }}
    >
      {children}
    </BoardsContext.Provider>
  );
};
