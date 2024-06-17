import { supabase } from "./supabase";

export async function getTasksByCardId(cardId) {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("card_id", cardId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }

  return data;
}

export async function createTask(cardId, title) {
  const { data, error } = await supabase
    .from("tasks")
    .insert({ card_id: cardId, title })
    .single();

  if (error) {
    console.error("Error creating task:", error);
    throw error;
  }

  return data;
}

export async function updateTask(taskId, title) {
  const { data, error } = await supabase
    .from("tasks")
    .update({ title })
    .match({ id: taskId })
    .single();

  if (error) {
    console.error("Error updating task:", error);
    throw error;
  }

  return data;
}

export async function deleteTask(taskId) {
  const { data, error } = await supabase
    .from("tasks")
    .delete()
    .match({ id: taskId });

  if (error) {
    console.error("Error deleting task:", error);
    throw error;
  }

  return data;
}
