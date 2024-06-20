"use client";

import { supabase } from "./supabase";

export async function fetchBoard(boardId) {
  const { data, error } = await supabase
    .from("boards")
    .select("*")
    .eq("id", boardId)
    .single();

  if (error) {
    console.error("Error fetching board:", error);
    throw error;
  }

  return data;
}

export async function getCardsByBoardId(boardId) {
  const { data, error } = await supabase
    .from("cards")
    .select("*")
    .eq("board_id", boardId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching cards:", error);
    throw error;
  }

  return data;
}

export async function createCard(boardId, title, description) {
  const { data, error } = await supabase
    .from("cards")
    .insert({ board_id: boardId, title, description })
    .single();

  if (error) {
    console.error("Error creating card:", error);
    throw error;
  }

  return data;
}

export async function deleteCard(cardId) {
  // delete all tasks with the card_id
  await supabase.from("tasks").delete().eq("card_id", cardId);
  const { data, error } = await supabase
    .from("cards")
    .delete()
    .match({ id: cardId });

  if (error) {
    console.error("Error deleting card:", error);
    throw error;
  }

  return data;
}

export async function updateCard(cardId, title, description) {
  const { data, error } = await supabase
    .from("cards")
    .update({ title, description })
    .eq("id", cardId)
    .single()
    .select("*");

  if (error) {
    console.error("Error updating card:", error);
    throw error;
  }

  return data;
}

export async function moveCard(cardId, newPosition) {
  const { data, error } = await supabase
    .from("cards")
    .update({ position: newPosition })
    .eq("id", cardId);

  if (error) {
    console.error("Error moving card:", error);
    throw error;
  }

  return data;
}
