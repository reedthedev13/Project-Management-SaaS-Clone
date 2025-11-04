import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import DashboardCard, {
  Project as CardProject,
} from "../components/DashboardCard";
import { Project, Task } from "../types";
import { apiRequest } from "../api/apiClient";

interface ProjectsPageProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  toggleTaskCompletion: (projectId: number, taskId: number) => void;
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({
  projects,
  setProjects,
  toggleTaskCompletion,
}) => {
  const [newTitle, setNewTitle] = useState("");
  const [loading, setLoading] = useState(false);

  // Add Project
  const addProject = async (title: string) => {
    if (!title.trim()) return;
    setLoading(true);

    try {
      const newProject: Project = await apiRequest("/boards", {
        method: "POST",
        body: JSON.stringify({ title }),
      });

      const cardProject: CardProject = {
        ...newProject,
        tasks: newProject.tasks || [],
        tasksCompleted: (newProject.tasks || []).filter(
          (t: Task) => t.completed
        ).length,
        tasksTotal: (newProject.tasks || []).length,
      };

      setProjects((prev) => [...prev, cardProject]);
      setNewTitle("");
    } catch (err) {
      console.error("Add project failed:", err);
      alert("Failed to add project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProject = (updated: Project) => {
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleDeleteProject = (id: number) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <DashboardLayout title="Projects">
      <div className="p-6 space-y-6">
        {/* Add Project */}
        <div className="flex flex-col sm:flex-row gap-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-lg shadow-sm hover:shadow-md transition">
          <input
            type="text"
            placeholder="New project title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addProject(newTitle)}
            className="flex-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
          <button
            onClick={() => addProject(newTitle)}
            disabled={loading}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm hover:shadow-md transition w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Adding..." : "Add Project"}
          </button>
        </div>

        {/* Projects List */}
        {projects.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 italic text-center py-10">
            No projects yet — start by creating your first one above!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => {
              if (!project.id) return null;

              const cardProject: CardProject = {
                ...project,
                tasks: project.tasks || [],
                tasksCompleted: (project.tasks || []).filter(
                  (t: Task) => t.completed
                ).length,
                tasksTotal: (project.tasks || []).length,
              };

              return (
                <div
                  key={project.id}
                  className="transform transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <DashboardCard
                    project={cardProject}
                    onUpdate={handleUpdateProject}
                    onDelete={handleDeleteProject}
                    onToggleTask={(taskId) =>
                      toggleTaskCompletion(project.id, taskId)
                    }
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProjectsPage;
