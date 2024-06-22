"use client";

import { useEffect, useState } from "react";
import CardItem from "@/components/CardItem";
import AddCard from "@/components/AddCard";
import {
  fetchBoard,
  getCardsByBoardId,
  createCard,
  deleteCard,
  updateCard,
  moveCard,
} from "@/lib/cardData";
import { getTasksByCardId, moveTaskToAnotherCard } from "@/lib/taskData";
import { FiPlus } from "react-icons/fi";

const BoardPage = ({ params: { id } }) => {
  const [board, setBoard] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddCard, setShowAddCard] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const boardData = await fetchBoard(id);
        setBoard(boardData);
        const cardsData = await getCardsByBoardId(id);
        const cardsWithTasks = await Promise.all(
          cardsData.map(async (card) => {
            const tasks = await getTasksByCardId(card.id);
            return { ...card, tasks };
          })
        );
        setCards(cardsWithTasks);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    console.log("Cards state updated:", cards);
  }, [cards]);

  const handleCreateCard = async (title, description) => {
    if (!title || title.trim() === "") {
      return;
    }

    try {
      const newCard = await createCard(id, title.trim(), description || null);
      setCards((prevCards) => [...prevCards, newCard]);
    } catch (error) {
      setError(error);
    }
  };

  const handleUpdateCard = async (cardId, newTitle, newDescription) => {
    try {
      const updatedCard = await updateCard(cardId, newTitle, newDescription);
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

  const handleMoveCard = async (cardId, newPosition) => {
    try {
      await moveCard(cardId, newPosition);
      setCards(reorderCards(cards, cardId, newPosition));
    } catch (error) {
      console.error("Error moving card:", error);
    }
  };

  const reorderCards = (cards, cardId, newPosition) => {
    const updatedCards = [...cards];
    const cardIndex = updatedCards.findIndex((card) => card.id === cardId);
    const [card] = updatedCards.splice(cardIndex, 1);
    updatedCards.splice(newPosition - 1, 0, card);
    return updatedCards;
  };

  const handleMoveTaskToAnotherCard = async (taskId, fromCardId, toCardId) => {
    console.log(
      `Moving task ${taskId} from card ${fromCardId} to card ${toCardId}`
    );
    try {
      const movedTask = await moveTaskToAnotherCard(taskId, toCardId, 1);
      if (!movedTask) {
        throw new Error("Failed to move task: No data returned");
      }
      setCards((prevCards) => {
        const newCards = prevCards.map((card) => {
          if (card.id === fromCardId) {
            return {
              ...card,
              tasks: card.tasks.filter((task) => task.id !== taskId),
            };
          }
          if (card.id === toCardId) {
            return {
              ...card,
              tasks: [...card.tasks, movedTask].sort(
                (a, b) => a.position - b.position
              ),
            };
          }
          return card;
        });
        console.log("Updated cards:", newCards);
        return newCards;
      });
    } catch (error) {
      console.error("Error moving task to another card:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-4 flex flex-col lg:flex-row min-h-screen">
      <div className="lg:flex-1 lg:pr-4">
        <div className="flex items-center mb-8">
          <h1 className="text-2xl font-bold">{board.title}</h1>
          <button
            onClick={() => setShowAddCard(!showAddCard)}
            className="ml-4 text-xl font-bold text-white bg-gray-500 border border-gray-700 rounded-full p-2 focus:outline-none transition duration-200 hover:bg-gray-700"
          >
            <FiPlus />
          </button>
        </div>
        {showAddCard && (
          <div className="mb-4 ">
            <AddCard
              boardId={id}
              onAdd={handleCreateCard}
              onClose={() => setShowAddCard(false)}
              className="rounded-md"
            />
          </div>
        )}
        <div className="flex-grow">
          <div className="flex flex-col lg:flex-row lg:space-x-4 lg:overflow-x-auto">
            {cards.map((card, index) => (
              <div key={card.id} className="flex-shrink-0 mb-4 lg:mb-0">
                <CardItem
                  card={card}
                  onUpdate={handleUpdateCard}
                  onDelete={handleDeleteCard}
                  onMoveCard={handleMoveCard}
                  onMoveTaskToAnotherCard={handleMoveTaskToAnotherCard}
                  totalCards={cards.length}
                  currentPosition={index + 1}
                  menuClassName="overflow-y-auto max-h-screen"
                  cards={cards}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardPage;
