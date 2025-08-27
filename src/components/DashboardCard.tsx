import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, Trash2 } from "lucide-react";
import { apiRequest } from "../services/apiClient";

export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export interface Project {
  id: number;
  title: string;
  tasksCompleted: number;
  tasksTotal: number;
  tasks: Task[];
}

interface DashboardCardProps {
  project: Project;
  onUpdate?: (updated: Project) => void;
  onDelete?: (id: number) => void;
  onToggleTask?: (taskId: number) => void;
  children?: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  project,
  onUpdate,
  onDelete,
  onToggleTask,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(project.title);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleRename = async () => {
    if (!newTitle.trim()) return;
    try {
      await apiRequest(`/boards/${project.id}`, {
        method: "PUT",
        body: JSON.stringify({ title: newTitle }),
      });
      onUpdate?.({ ...project, title: newTitle });
      setEditing(false);
    } catch (err) {
      console.error("Failed to rename project:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await apiRequest(`/boards/${project.id}`, { method: "DELETE" });
      onDelete?.(project.id);
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  };

  return (
    <motion.div
      className="p-6 border rounded-lg shadow-sm bg-white dark:bg-gray-900 dark:border-gray-700 flex flex-col"
      whileHover={{ scale: 1.03, boxShadow: "0 12px 24px rgba(0,0,0,0.25)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Project Title */}
      <h3
        className="font-semibold text-gray-900 dark:text-gray-100 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <input
          type="text"
          value={newTitle || ""}
          onChange={(e) => setNewTitle(e.target.value)}
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </h3>

      {/* Buttons under title */}
      <div className="flex gap-2 mt-3 flex-wrap">
        {editing ? (
          <>
            <button
              onClick={handleRename}
              className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded shadow-sm transition text-sm"
            >
              <Edit2 size={16} /> Save
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setNewTitle(project.title);
              }}
              className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded shadow-sm transition text-sm"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded shadow-sm transition text-sm"
            >
              <Edit2 size={16} /> Rename
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow-sm transition text-sm"
            >
              <Trash2 size={16} /> Delete
            </button>
          </>
        )}
      </div>

      {/* Progress */}
      <div className="text-sm text-gray-700 dark:text-gray-300 mt-2">
        {project.tasksCompleted}/{project.tasksTotal} tasks completed
      </div>

      {/* Tasks list dropdown */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.ul
            key="tasks"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="mt-2 overflow-hidden space-y-2"
          >
            {project.tasks.map((task) => (
              <li
                key={`${project.id}-${task.id}`}
                className="flex justify-between items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <span
                  className={`${
                    task.completed
                      ? "line-through text-gray-400 dark:text-gray-500"
                      : "text-gray-800 dark:text-gray-100"
                  }`}
                >
                  {task.title}
                </span>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggleTask?.(task.id)}
                  className="accent-indigo-600 dark:accent-indigo-500"
                />
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      {/* Delete modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-80">
            <p className="mb-4 text-gray-900 dark:text-gray-100">
              Are you sure you want to delete this project?
            </p>
            <div className="flex gap-2 justify-end">
              <button
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded transition"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default DashboardCard;
