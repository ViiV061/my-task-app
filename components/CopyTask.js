import { useState } from "react";
import { supabase } from "@/lib/supabase";

const CopyTask = ({ task, cardId, onClose }) => {
  const [newTitle, setNewTitle] = useState(task.title);

  const handleCopyTask = async () => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .insert([{ title: newTitle, card_id: cardId }]);
      if (error) {
        console.error("Error copying task:", error);
      } else {
        onClose(data[0]);
      }
    } catch (error) {
      console.error("Error copying task:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Copy Task</h2>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="border p-2 mb-4 w-full"
          placeholder="Task Title"
        />
        <div className="flex justify-between">
          <button
            onClick={handleCopyTask}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Copy
          </button>
          <button
            onClick={() => onClose()}
            className="bg-gray-500 text-white p-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CopyTask;
