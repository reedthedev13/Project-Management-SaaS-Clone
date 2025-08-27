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
                  {task.title}
                </span>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() =>
                    toggleTaskCompletion(selectedProject.id, task.id)
                  }
                  className="accent-indigo-600 dark:accent-indigo-500"
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TasksPage;
