import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import LandingPage from "../pages/LandingPage";
import AuthPage from "../pages/AuthPage";
import Dashboard from "../pages/Dashboard";
import ProjectsPage from "../pages/ProjectsPage";
import TasksPage from "../pages/TasksPage";
import CalendarPage from "../pages/CalendarPage";
import SettingsPage from "../pages/SettingsPage";

import { Project } from "../types";

interface AppRoutesProps {
  projects: Project[];
  loadingProjects: boolean;
  setProjects?: React.Dispatch<React.SetStateAction<Project[]>>;
  toggleTaskCompletion: (
    projectId: number,
    taskId: number,
    completed?: boolean
  ) => Promise<void>;
}

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="p-6 text-gray-500 dark:text-gray-400">Loading...</div>
    );
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="p-6 text-gray-500 dark:text-gray-400">Loading...</div>
    );
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const AppRoutes: React.FC<AppRoutesProps> = ({
  projects,
  loadingProjects,
  setProjects,
  toggleTaskCompletion,
}) => {
  return (
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
              setProjects={setProjects!}
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
              setProjects={setProjects!}
              toggleTaskCompletion={toggleTaskCompletion}
            />
          </PrivateRoute>
        }
      />

      <Route
        path="/calendar"
        element={
          <PrivateRoute>
            <CalendarPage projects={projects} setProjects={setProjects!} />
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
  );
};

export default AppRoutes;
