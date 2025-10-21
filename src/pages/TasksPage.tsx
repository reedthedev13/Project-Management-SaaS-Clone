import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { Project, Task } from "../types";
import { apiRequest } from "../services/apiClient";

interface TasksPageProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  toggleTaskCompletion: (projectId: number, taskId: number) => Promise<void>;
}

const TasksPage: React.FC<TasksPageProps> = ({
  projects,
  setProjects,
  toggleTaskCompletion,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    projects.length > 0 ? projects[0].id : null
  );
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState("");
  const [showDeleteModalId, setShowDeleteModalId] = useState<number | null>(
    null
  );

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  if (!selectedProject) {
    return (
      <DashboardLayout title="Tasks">
        <div className="p-6 text-gray-500 dark:text-gray-400">
          No project selected.
        </div>
      </DashboardLayout>
    );
  }

  const addTask = async () => {
    if (!newTaskTitle.trim() || !selectedProject) return;
    try {
      const newTask: Task = await apiRequest<Task>("/tasks", {
        method: "POST",
        body: JSON.stringify({
          title: newTaskTitle,
          boardId: selectedProject.id,
        }),
      });
      if (!newTask.id) throw new Error("Task must have an ID");

      setProjects((prev) =>
        prev.map((p) =>
          p.id === selectedProject.id
            ? {
                ...p,
                tasks: [...p.tasks, newTask],
                tasksTotal: p.tasksTotal + 1,
              }
            : p
        )
      );
      setNewTaskTitle("");
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  };

  const handleRenameTask = async (taskId: number) => {
    if (!editingTaskTitle.trim()) return;
    try {
      await apiRequest(`/tasks/${taskId}`, {
        method: "PUT",
        body: JSON.stringify({ title: editingTaskTitle }),
      });

      setProjects((prev) =>
        prev.map((p) =>
          p.id === selectedProject.id
            ? {
                ...p,
                tasks: p.tasks.map((t) =>
                  t.id === taskId ? { ...t, title: editingTaskTitle } : t
                ),
              }
            : p
        )
      );
      setEditingTaskId(null);
      setEditingTaskTitle("");
    } catch (err) {
      console.error("Failed to rename task:", err);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await apiRequest(`/tasks/${taskId}`, { method: "DELETE" });
      setProjects((prev) =>
        prev.map((p) =>
          p.id === selectedProject.id
            ? {
                ...p,
                tasks: p.tasks.filter((t) => t.id !== taskId),
                tasksTotal: p.tasksTotal - 1,
              }
            : p
        )
      );
      setShowDeleteModalId(null);
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  return (
    <DashboardLayout title="Tasks">
      <div className="p-6 space-y-6">
        {/* Project Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <label className="text-gray-700 dark:text-gray-300 font-medium">
            Select Project:
          </label>
          <select
            value={selectedProjectId || ""}
            onChange={(e) => setSelectedProjectId(Number(e.target.value))}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        {/* Add Task */}
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="New task title..."
            value={newTaskTitle ?? ""}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg flex-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={addTask}
            className="px-5 py-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-medium shadow-sm hover:shadow-md transition"
          >
            Add Task
          </button>
        </div>

        {/* Task List */}
        {selectedProject.tasks.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 italic">
            No tasks yet — add your first one above!
          </p>
        ) : (
          <ul className="space-y-3">
            {selectedProject.tasks.map((task) => (
              <li
                key={task.id}
                className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-lg shadow-sm hover:shadow-md transition"
              >
                {/* Task title */}
                <span
                  className={`mb-2 sm:mb-0 text-base ${
                    task.completed
                      ? "line-through text-gray-400 dark:text-gray-500"
                      : "text-gray-900 dark:text-gray-100"
                  }`}
                >
                  {editingTaskId === task.id ? (
                    <input
                      type="text"
                      value={editingTaskTitle}
                      onChange={(e) => setEditingTaskTitle(e.target.value)}
                      className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 focus:ring-2 focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  ) : (
                    task.title
                  )}
                </span>

                {/* Buttons */}
                <div className="flex flex-wrap gap-2 items-center">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() =>
                      toggleTaskCompletion(selectedProject.id, task.id)
                    }
                    className="accent-indigo-500 scale-110"
                  />

                  {editingTaskId === task.id ? (
                    <button
                      onClick={() => handleRenameTask(task.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm shadow-sm hover:shadow-md transition"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingTaskId(task.id);
                        setEditingTaskTitle(task.title);
                      }}
                      className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 px-3 py-1 rounded-md text-sm shadow-sm hover:shadow-md transition"
                    >
                      Rename
                    </button>
                  )}

                  <button
                    onClick={() => setShowDeleteModalId(task.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm shadow-sm hover:shadow-md transition"
                  >
                    Delete
                  </button>
                </div>

                {/* Delete Modal */}
                {showDeleteModalId === task.id && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl w-80">
                      <p className="text-gray-900 dark:text-gray-100 mb-4 text-sm">
                        Are you sure you want to delete this task?
                      </p>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setShowDeleteModalId(null)}
                          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TasksPage;
