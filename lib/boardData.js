"use client";

import { supabase } from "./supabase";

export const getBoards = async () => {
  const { data, error } = await supabase.from("boards").select("*");
  if (error) {
    console.error("Error fetching boards:", error);
    return [];
  }
  return data;
};

export const createBoard = async (title) => {
  const { data, error } = await supabase
    .from("boards")
    .insert({ title })
    .single();
  if (error) {
    console.error("Error creating board:", error);
    return null;
  }
  return data;
};

export const updateBoard = async (id, title) => {
  const { data, error } = await supabase
    .from("boards")
    .update({ title })
    .eq("id", id)
    .single();
  if (error) {
    console.error("Error updating board:", error);
    return null;
  }
  return data;
};

export const deleteBoard = async (id) => {
  const { error } = await supabase.from("boards").delete().eq("id", id);
  if (error) {
    console.error("Error deleting board:", error);
    return false;
  }
  return true;
};
