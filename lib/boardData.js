import { supabase } from "./supabase";

export async function fetchBoards() {
  const { data, error } = await supabase.from("boards").select("*");

  if (error) {
    console.error("Error fetching boards:", error);
    throw error;
  }

  return data || [];
}

export async function createBoard(title) {
  const { data, error } = await supabase
    .from("boards")
    .insert({ title })
    .select()
    .single();

  if (error) {
    console.error("Error creating board:", error);
    throw error;
  }

  return data;
}

export async function updateBoard(id, title) {
  const { data, error } = await supabase
    .from("boards")
    .update({ title })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating board:", error);
    throw error;
  }

  return data;
}

export async function deleteBoard(id) {
  const { error } = await supabase.from("boards").delete().eq("id", id);

  if (error) {
    console.error("Error deleting board:", error);
    throw error;
  }
}
