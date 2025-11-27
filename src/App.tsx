import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import PageTransition from "./components/PageTransition";
import AppRoutes from "./router/AppRoutes";
import { apiRequest } from "./api/apiClient";
import { Project } from "./types";

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [initialTheme, setInitialTheme] = useState<"light" | "dark" | null>(
    null
  );

  useEffect(() => {
    /*************  ✨ Windsurf Command ⭐  *************/
    /**
     * Fetches the user's theme preference from the backend and updates the local state with it.
     * If the backend request fails, it defaults to "light".
     */
    /*******  d64c8ad5-35e6-428c-93aa-cd2a76a3246a  *******/ const fetchTheme =
      async () => {
        try {
          const prefs = await apiRequest<{ theme: "light" | "dark" }>(
            "/users/preferences"
          );
          setInitialTheme(prefs.theme || "light");
        } catch {
          setInitialTheme("light");
        }
      };
    fetchTheme();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoadingProjects(true);
      try {
        const data = await apiRequest("/boards", { method: "GET" });
        const boards = Array.isArray(data) ? data : [];
        const projectsWithTasks: Project[] = boards.map((b: any) => {
          const tasks = Array.isArray(b.tasks) ? b.tasks : [];
          return {
            ...b,
            tasks,
            tasksCompleted: tasks.filter((t: any) => t.completed).length,
            tasksTotal: tasks.length,
          };
        });
        setProjects(projectsWithTasks);
      } catch {
        setProjects([]);
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchProjects();
  }, []);

  const toggleTaskCompletion = async (
    projectId: number,
    taskId: number,
    completed?: boolean
  ): Promise<void> => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;
    const task = project.tasks.find((t) => t.id === taskId);
    if (!task) return;

    const newCompleted = completed ?? !task.completed;

    setProjects((prev) =>
      prev.map((proj) =>
        proj.id === projectId
          ? {
              ...proj,
              tasks: proj.tasks.map((t) =>
                t.id === taskId ? { ...t, completed: newCompleted } : t
              ),
              tasksCompleted: proj.tasks.filter((t) =>
                t.id === taskId ? newCompleted : t.completed
              ).length,
            }
          : proj
      )
    );

    try {
      await apiRequest(`/tasks/${taskId}`, {
        method: "PUT",
        body: JSON.stringify({ completed: newCompleted }),
      });
    } catch (err) {
      console.error("Failed to toggle task:", err);
    }
  };

  if (!initialTheme) {
    return (
      <div className="p-6 text-gray-500 dark:text-gray-400">Loading...</div>
    );
  }

  return (
    <ThemeProvider initialTheme={initialTheme}>
      <AuthProvider>
        <Router>
          <PageTransition>
            <AppRoutes
              projects={projects}
              loadingProjects={loadingProjects}
              setProjects={setProjects}
              toggleTaskCompletion={toggleTaskCompletion}
            />
          </PageTransition>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
