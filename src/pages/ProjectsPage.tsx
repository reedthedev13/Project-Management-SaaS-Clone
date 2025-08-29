import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import DashboardCard, {
  Project as CardProject,
} from "../components/DashboardCard";
import { Project, Task } from "../types";

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

  // ✅ Add Project with Token
  const addProject = async (title: string) => {
    if (!title.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5001/api/boards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ title }),
      });

      if (!res.ok) {
        console.error("Add project failed:", res.status);
        return;
      }

      const newProject: Project = await res.json();

      // Build consistent project object
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
        {/* Add Project */}
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

        {/* Projects List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            if (!project.id) return null; // avoid broken items

            const cardProject: CardProject = {
              ...project,
              tasks: project.tasks || [],
              tasksCompleted: (project.tasks || []).filter(
                (t: Task) => t.completed
              ).length,
              tasksTotal: (project.tasks || []).length,
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
