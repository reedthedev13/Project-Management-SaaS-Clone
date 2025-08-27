import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import DashboardCard, {
  Project as CardProject,
} from "../components/DashboardCard";
import { Project } from "../types";

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

  const addProject = async (title: string) => {
    if (!title.trim()) return;
    try {
      const newProject = await fetch("/boards", {
        method: "POST",
        body: JSON.stringify({ title }),
      }).then((res) => res.json());
      setProjects((prev) => [
        ...prev,
        {
          ...newProject,
          tasks: [],
          tasksCompleted: 0,
          tasksTotal: 0,
        },
      ]);
      setNewTitle("");
    } catch (err) {
      console.error("Failed to add project:", err);
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
      <div className="p-6">
        <div className="mb-6 flex gap-2">
          <input
            type="text"
            placeholder="New project title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addProject(newTitle)}
            className="border p-2 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={() => addProject(newTitle)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
          >
            Add
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const cardProject: CardProject = {
              ...project,
              tasksCompleted: project.tasks.filter((t) => t.completed).length,
              tasksTotal: project.tasks.length,
            };
            return (
              <DashboardCard
                key={project.id}
                project={cardProject}
                onUpdate={handleUpdateProject}
                onDelete={handleDeleteProject}
                onToggleTask={(taskId) =>
                  toggleTaskCompletion(project.id, taskId)
                }
              />
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProjectsPage;
