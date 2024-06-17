"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  getCardsByBoardId,
  createCard,
  updateCard,
  deleteCard,
} from "@/lib/cardData";
import { createTask, updateTask } from "@/lib/taskData";
import CardItem from "@/components/CardItem";

const BoardPage = ({ params: { id } }) => {
  const [board, setBoard] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [newCardDescription, setNewCardDescription] = useState("");

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
        .match({ id })
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

  const handleCreateCard = async () => {
    try {
      const newCard = await createCard(id, newCardTitle, newCardDescription);
      setCards([...cards, newCard]);
      setNewCardTitle("");
      setNewCardDescription("");
      fetchCards();
    } catch (error) {
      setError(error);
    }
  };

  const handleUpdateCard = async (cardId, title, description) => {
    try {
      const updatedCard = await updateCard(cardId, title, description);
      setCards(cards.map((card) => (card.id === cardId ? updatedCard : card)));
    } catch (error) {
      setError(error);
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      await deleteCard(cardId);
      setCards(cards.filter((card) => card.id !== cardId));
    } catch (error) {
      setError(error);
    }
  };

  const onCopyTask = async (task) => {
    try {
      const newTask = await createTask(task.card_id, task.title);
      // add message to notify user that task has been copied
    } catch (error) {
      console.error("Error copying task:", error);
      // add message to notify user that copying task failed
    }
  };

  const onMoveTask = async (task) => {
    // To do show a menu to select a task
    const cards = await getCardsByBoardId(board.id);
    const selectedCardId = await showCardSelection(cards);

    if (selectedCardId) {
      try {
        // To do move task to selected card
        await updateTask(task.id, { card_id: selectedCardId });
        // 可以添加一个通知,告诉用户任务已成功移动
      } catch (error) {
        console.error("Error moving task:", error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{board.title}</h1>
      <div className="mb-4">
        <input
          type="text"
          value={newCardTitle}
          onChange={(e) => setNewCardTitle(e.target.value)}
          placeholder="Card title"
          className="w-full mb-2 px-2 py-1 border border-gray-300 rounded-md"
        />
        <textarea
          value={newCardDescription}
          onChange={(e) => setNewCardDescription(e.target.value)}
          placeholder="Card description"
          className="w-full mb-2 px-2 py-1 border border-gray-300 rounded-md"
        ></textarea>
        <button
          onClick={handleCreateCard}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
        >
          Add Card
        </button>
      </div>
      <div className="cards-container flex overflow-x-auto space-x-4">
        {cards.map((card) =>
          card && card.id ? (
            <CardItem
              key={card.id}
              card={card}
              onUpdate={handleUpdateCard}
              onDelete={handleDeleteCard}
              onCopyTask={onCopyTask}
              onMoveTask={onMoveTask}
            />
          ) : null
        )}
      </div>
    </div>
  );
};

export default BoardPage;
