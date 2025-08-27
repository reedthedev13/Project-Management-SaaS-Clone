import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import AnimatedWrapper from "./components/AnimatedWrapper";

import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import ProjectsPage from "./pages/ProjectsPage";
import TasksPage from "./pages/TasksPage";
import CalendarPage from "./pages/CalendarPage";
import SettingsPage from "./pages/SettingsPage";
import { apiRequest } from "./services/apiClient";
import { Project } from "./types";

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // Fetch projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
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
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        setProjects([]);
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchProjects();
  }, []);

  // Toggle task completion globally
  const toggleTaskCompletion = async (projectId: number, taskId: number) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;
    const task = project.tasks.find((t) => t.id === taskId);
    if (!task) return;

    const newCompleted = !task.completed;

    // Optimistic UI
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

    // Update backend
    try {
      await apiRequest(`/tasks/${taskId}`, {
        method: "PUT",
        body: JSON.stringify({ completed: newCompleted }),
      });
    } catch (err) {
      console.error("Failed to toggle task:", err);
    }
  };

  return (
    <AnimatedWrapper>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />

            <Route
              path="/auth"
              element={
                <PublicRoute>
                  <AuthPage />
                </PublicRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard
                    projects={projects}
                    loading={loadingProjects}
                    toggleTaskCompletion={toggleTaskCompletion}
                  />
                </PrivateRoute>
              }
            />

            <Route
              path="/projects"
              element={
                <PrivateRoute>
                  <ProjectsPage
                    projects={projects}
                    setProjects={setProjects}
                    toggleTaskCompletion={toggleTaskCompletion}
                  />
                </PrivateRoute>
              }
            />

            <Route
              path="/tasks"
              element={
                <PrivateRoute>
                  <TasksPage
                    projects={projects}
                    setProjects={setProjects}
                    toggleTaskCompletion={toggleTaskCompletion}
                  />
                </PrivateRoute>
              }
            />

            <Route
              path="/calendar"
              element={
                <PrivateRoute>
                  <CalendarPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <SettingsPage />
                </PrivateRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </AnimatedWrapper>
  );
};

export default App;
