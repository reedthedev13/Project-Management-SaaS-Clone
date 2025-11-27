import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, Trash2 } from "lucide-react";
import { apiRequest } from "../api/apiClient";

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
  onUpdate?: (p: Project) => void;
  onDelete?: (id: number) => void;
  onToggleTask?: (taskId: number) => void;
  readOnly?: boolean;
  children?: React.ReactNode;
}

export default function DashboardCard({
  project,
  onUpdate,
  onDelete,
  onToggleTask,
  readOnly = false,
}: DashboardCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(project.title);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const renameInputRef = useRef<HTMLInputElement>(null);
  const deleteModalRef = useRef<HTMLDivElement>(null);

  // Auto-focus rename input
  useEffect(() => {
    if (editing) renameInputRef.current?.focus();
  }, [editing]);

  // Auto-focus modal
  useEffect(() => {
    if (showDeleteModal) deleteModalRef.current?.focus();
  }, [showDeleteModal]);

  const handleRename = async () => {
    if (!newTitle.trim()) return;
    try {
      const token = localStorage.getItem("token");

      await apiRequest(`/boards/${project.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ title: newTitle }),
      });

      onUpdate?.({ ...project, title: newTitle });
      setEditing(false);
    } catch (err) {
      console.error("Rename failed:", err);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");

      await apiRequest(`/boards/${project.id}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      onDelete?.(project.id);
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <>
      {/* Card */}
      <motion.div
        className="p-6 border rounded-lg shadow-sm bg-white dark:bg-gray-900 dark:border-gray-700 flex flex-col relative"
        whileHover={{ scale: 1.03, boxShadow: "0 12px 24px rgba(0,0,0,0.25)" }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Header */}
        <h3
          className="font-semibold text-gray-900 dark:text-gray-100 cursor-pointer"
          onClick={() => setIsExpanded((s) => !s)}
        >
          {editing ? (
            <input
              ref={renameInputRef}
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRename()}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-green-400"
            />
          ) : (
            project.title
          )}
        </h3>

        {/* Action Buttons */}
        {!readOnly && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {editing ? (
              <>
                <button
                  onClick={handleRename}
                  className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                >
                  <Edit2 size={16} /> Save
                </button>

                <button
                  onClick={() => {
                    setEditing(false);
                    setNewTitle(project.title);
                  }}
                  className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded text-sm"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded text-sm"
                >
                  <Edit2 size={16} /> Rename
                </button>

                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </>
            )}
          </div>
        )}

        {/* Progress */}
        <div className="text-sm text-gray-700 dark:text-gray-300 mt-2">
          {project.tasksCompleted}/{project.tasksTotal} tasks completed
        </div>

        {/* Expandable Task List */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.ul
              key="tasks"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-2 overflow-hidden space-y-2"
            >
              {project.tasks.map((task) => (
                <li
                  key={task.id}
                  className="flex justify-between items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <span
                    className={
                      task.completed
                        ? "line-through text-gray-400 dark:text-gray-500"
                        : "text-gray-800 dark:text-gray-100"
                    }
                  >
                    {task.title}
                  </span>

                  {!readOnly && (
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => onToggleTask?.(task.id)}
                      className="accent-indigo-600 dark:accent-indigo-500"
                    />
                  )}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ========================================================= */}
      {/* FIXED MODAL — Always centered + working delete           */}
      {/* ========================================================= */}

      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              ref={deleteModalRef}
              tabIndex={0}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-80"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onKeyDown={(e) => e.key === "Enter" && handleDelete()}
            >
              <p className="mb-4 text-gray-900 dark:text-gray-100">
                Are you sure you want to delete this project?
              </p>

              <div className="flex gap-2 justify-end">
                <button
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>

                <button
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
