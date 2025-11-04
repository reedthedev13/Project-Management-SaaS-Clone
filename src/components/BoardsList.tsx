import { Edit2, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import DashboardCard, { Project } from "./DashboardCard";
import { apiRequest } from "../api/apiClient";

export type Board = { id: number; title: string; ownerId: number };

const BoardsList: React.FC = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  // Fetch boards
  useEffect(() => {
    async function fetchBoards() {
      try {
        const data = await apiRequest<Board[]>("/boards", { method: "GET" });
        setBoards(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load boards:", error);
        setBoards([]);
      } finally {
        setLoading(false);
      }
    }
    fetchBoards();
  }, []);

  // Create new board
  const handleCreate = async () => {
    if (!newBoardTitle.trim()) return;
    try {
      const newBoard = await apiRequest<Board>("/boards", {
        method: "POST",
        body: JSON.stringify({ title: newBoardTitle }),
      });
      setBoards((prev) => [...prev, newBoard]);
      setNewBoardTitle("");
    } catch (error) {
      console.error("Failed to create board:", error);
    }
  };

  // Update board title
  const handleUpdate = async (id: number, newTitle: string) => {
    try {
      const updated = await apiRequest<Board>(`/boards/${id}`, {
        method: "PUT",
        body: JSON.stringify({ title: newTitle }),
      });
      setBoards((prev) => prev.map((b) => (b.id === id ? updated : b)));
    } catch (error) {
      console.error("Failed to update board:", error);
    }
  };

  // Delete board
  const handleDelete = async (id: number) => {
    try {
      await apiRequest<void>(`/boards/${id}`, { method: "DELETE" });
      setBoards((prev) => prev.filter((b) => b.id !== id));
    } catch (error) {
      console.error("Failed to delete board:", error);
    }
  };

  if (loading)
    return (
      <div className="text-gray-600 dark:text-gray-300">Loading boards...</div>
    );

  return (
    <div className="space-y-6">
      {/* Create new board */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          value={newBoardTitle}
          onChange={(e) => setNewBoardTitle(e.target.value)}
          placeholder="New board title"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleCreate();
            }
          }}
          className="flex-1 p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-md transition duration-200"
        >
          Create
        </button>
      </div>

      {/* Boards list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {boards.map((board) => {
          const project: Project = {
            id: board.id,
            title: editingId === board.id ? editingTitle : board.title,
            tasksCompleted: 0,
            tasksTotal: 0,
            tasks: [],
          };

          return (
            <DashboardCard key={board.id} project={project}>
              {/* Actions */}
              <div className="flex gap-3 mt-3 justify-end">
                {editingId !== board.id && (
                  <>
                    <button
                      onClick={() => setEditingId(board.id)}
                      className="flex-1 flex justify-center items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 dark:text-gray-900 font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <Edit2 size={18} />
                      Rename
                    </button>
                    <button
                      onClick={() => handleDelete(board.id)}
                      className="flex-1 flex justify-center items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <Trash2 size={18} />
                      Delete
                    </button>
                  </>
                )}
              </div>

              {/* Inline rename input rendered in the card header */}
              {editingId === board.id && (
                <input
                  type="text"
                  value={editingTitle}
                  autoFocus
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUpdate(board.id, editingTitle);
                      setEditingId(null);
                    }
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  className="w-full mt-2 p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              )}
            </DashboardCard>
          );
        })}
      </div>
    </div>
  );
};

export default BoardsList;
