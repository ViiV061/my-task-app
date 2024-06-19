"use client";

import { useEffect, useState } from "react";
import CardItem from "@/components/CardItem";
import AddCard from "@/components/AddCard";
import {
  fetchBoard,
  getCardsByBoardId,
  createCard,
  updateCard,
  deleteCard,
  moveCard,
} from "@/lib/cardData";

const BoardPage = ({ params: { id } }) => {
  const [board, setBoard] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <div className="container mx-auto p-4 h-full flex flex-col">
      <h1 className="text-2xl font-bold mb-8">{board.title}</h1>
      <div className="mb-4">
        <AddCard boardId={id} onAdd={handleCreateCard} />
      </div>
      <div className="flex-grow overflow-y-hidden">
        <div className="flex space-x-4 overflow-x-auto h-full">
          {cards.map((card, index) => (
            <div key={card.id} className="flex-shrink-0">
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
  );
};

export default BoardPage;
