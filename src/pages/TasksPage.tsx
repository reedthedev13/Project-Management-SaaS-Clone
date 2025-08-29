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
      <div className="p-6">
        {/* Project Selector */}
        <div className="mb-4 flex gap-2 items-center">
          <label className="text-gray-700 dark:text-gray-300 font-medium">
            Select Project:
          </label>
          <select
            value={selectedProjectId || ""}
            onChange={(e) => setSelectedProjectId(Number(e.target.value))}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        {/* Add Task */}
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="New task title"
            value={newTaskTitle ?? ""}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            className="border p-2 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={addTask}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
          >
            Add
          </button>
        </div>

        {/* Task List */}
        {selectedProject.tasks.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No tasks yet.</p>
        ) : (
          <ul className="space-y-2">
            {selectedProject.tasks.map((task) => (
              <li
                key={task.id}
                className="flex justify-between items-center p-2 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                <span
                  className={`${
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
                      className="border p-1 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  ) : (
                    task.title
                  )}
                </span>

                <div className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() =>
                      toggleTaskCompletion(selectedProject.id, task.id)
                    }
                    className="accent-indigo-600 dark:accent-indigo-500"
                  />

                  {editingTaskId === task.id ? (
                    <button
                      onClick={() => handleRenameTask(task.id)}
                      className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded shadow-sm transition text-sm"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingTaskId(task.id);
                        setEditingTaskTitle(task.title);
                      }}
                      className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded shadow-sm transition text-sm"
                    >
                      Rename
                    </button>
                  )}

                  <button
                    onClick={() => setShowDeleteModalId(task.id)}
                    className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow-sm transition text-sm"
                  >
                    Delete
                  </button>
                </div>

                {/* Delete Modal */}
                {showDeleteModalId === task.id && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-80">
                      <p className="mb-4 text-gray-900 dark:text-gray-100">
                        Are you sure you want to delete this task?
                      </p>
                      <div className="flex gap-2 justify-end">
                        <button
                          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded transition"
                          onClick={() => setShowDeleteModalId(null)}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition"
                          onClick={() => handleDeleteTask(task.id)}
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
