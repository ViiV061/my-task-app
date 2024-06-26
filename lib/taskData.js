import { supabase } from "./supabase";

export async function getTasksByCardId(cardId) {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("card_id", cardId)
    .order("position", { ascending: true });

  if (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }

  console.log(`Tasks for card ${cardId}:`, data);
  return data;
}

export async function createTask(cardId, title) {
  const { count, error: countError } = await supabase
    .from("tasks")
    .select("id", { count: "exact" })
    .eq("card_id", cardId);

  if (countError) {
    console.error("Error counting tasks:", countError);
    throw countError;
  }

  const { data, error } = await supabase
    .from("tasks")
    .insert({ card_id: cardId, title, position: count + 1 })
    .select()
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
    .eq("id", taskId)
    .select()
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
    .eq("id", taskId);

  if (error) {
    console.error("Error deleting task:", error);
    throw error;
  }

  return data;
}

export async function moveTaskWithinCard(taskId, newPosition) {
  const { data: task, error: fetchError } = await supabase
    .from("tasks")
    .select("card_id, position")
    .eq("id", taskId)
    .single();

  if (fetchError) throw fetchError;

  const { data: tasks, error: fetchTasksError } = await supabase
    .from("tasks")
    .select("*")
    .eq("card_id", task.card_id)
    .order("position", { ascending: true });

  if (fetchTasksError) throw fetchTasksError;

  const taskIndex = tasks.findIndex((t) => t.id === taskId);

  if (taskIndex === -1) throw new Error("Task not found");

  const direction = newPosition > task.position ? 1 : -1;
  const updatedTasks = tasks.map((t) => {
    if (t.id === taskId) {
      return { ...t, position: newPosition };
    } else if (
      direction === 1 &&
      t.position > task.position &&
      t.position <= newPosition
    ) {
      return { ...t, position: t.position - 1 };
    } else if (
      direction === -1 &&
      t.position < task.position &&
      t.position >= newPosition
    ) {
      return { ...t, position: t.position + 1 };
    }
    return t;
  });

  const { error: updateError } = await supabase
    .from("tasks")
    .upsert(updatedTasks);

  if (updateError) throw updateError;

  return updatedTasks;
}

export async function moveTaskToAnotherCard(taskId, newCardId, newPosition) {
  console.log(
    `Moving task ${taskId} to card ${newCardId} at position ${newPosition}`
  );
  const { data, error } = await supabase
    .from("tasks")
    .update({ card_id: newCardId, position: newPosition })
    .eq("id", taskId)
    .select("*")
    .single();

  if (error) {
    console.error("Supabase error:", error); // see what the error is
    throw error;
  }
  console.log("Moved task data:", data); //  check the data
  return data;
}
