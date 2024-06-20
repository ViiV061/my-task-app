"use client";

import { useEffect, useState } from "react";
import CardItem from "@/components/CardItem";
import AddCard from "@/components/AddCard";
import {
  fetchBoard,
  getCardsByBoardId,
  createCard,
  deleteCard,
  moveCard,
} from "@/lib/cardData";
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
        setCards(cardsData);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-4 h-full flex flex-col lg:flex-row">
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
        <div className="flex-grow overflow-y-hidden">
          <div className="flex flex-col lg:flex-row lg:space-x-4 lg:overflow-x-auto h-full">
            {cards.map((card, index) => (
              <div key={card.id} className="flex-shrink-0 mb-4 lg:mb-0">
                <CardItem
                  card={card}
                  onUpdate={handleUpdateCard}
                  onDelete={handleDeleteCard}
                  onMoveCard={handleMoveCard}
                  totalCards={cards.length}
                  currentPosition={index + 1}
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
