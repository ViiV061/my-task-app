"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import CardItem from "@/components/CardItem";
import AddCard from "@/components/AddCard";
import {
  getCardsByBoardId,
  createCard,
  updateCard,
  deleteCard,
} from "@/lib/cardData";

const BoardPage = ({ params: { id } }) => {
  const [board, setBoard] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBoard();
    fetchCards();
  }, [id]);

  const fetchBoard = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("boards")
        .select("*")
        .eq("id", id)
        .single();
      if (error) {
        setError(error);
      } else {
        setBoard(data);
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCards = async () => {
    try {
      const data = await getCardsByBoardId(id);
      setCards(data);
    } catch (error) {
      setError(error);
    }
  };

  const handleCreateCard = async (title, description) => {
    try {
      const newCard = await createCard(id, title, description);
      setCards((prevCards) => [...prevCards, newCard]);
    } catch (error) {
      setError(error);
    }
  };

  const handleUpdateCard = async (cardId, title, description) => {
    try {
      const updatedCard = await updateCard(cardId, title, description);
      setCards((prevCards) =>
        prevCards.map((card) => (card.id === cardId ? updatedCard : card))
      );
    } catch (error) {
      setError(error);
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      await deleteCard(cardId);
      setCards((prevCards) => prevCards.filter((card) => card.id !== cardId));
    } catch (error) {
      setError(error);
    }
  };

  const handleCopyTask = async (task) => {
    try {
      await createTask(task.card_id, task.title);
    } catch (error) {
      console.error("Error copying task:", error);
    }
  };

  const handleMoveTask = async (task, newCardId) => {
    try {
      await updateTask(task.id, { card_id: newCardId });
    } catch (error) {
      console.error("Error moving task:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-4 h-full flex flex-col">
      <h1 className="text-2xl font-bold mb-8">{board.title}</h1>
      <div className="mb-4">
        <AddCard boardId={id} onAdd={handleCreateCard} />
      </div>
      <div className="flex-grow overflow-y-hidden">
        <div className="flex space-x-4 overflow-x-auto h-full">
          {cards.map((card) => (
            <div key={card.id} className="flex-shrink-0">
              <CardItem
                card={card}
                onUpdate={handleUpdateCard}
                onDelete={handleDeleteCard}
                onCopyTask={handleCopyTask}
                onMoveTask={handleMoveTask}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BoardPage;
