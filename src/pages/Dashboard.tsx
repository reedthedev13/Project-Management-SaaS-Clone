import React from "react";
import AnimatedWrapper from "../components/AnimatedWrapper";
import DashboardLayout from "../components/DashboardLayout";
import DashboardCard from "../components/DashboardCard";

interface Task {
  id: number;
  title: string;
  completed: boolean;
  updatedAt?: string;
}

interface Project {
  id: number;
  title: string;
  tasks: Task[];
  tasksCompleted?: number;
  tasksTotal?: number;
}

interface DashboardProps {
  projects: Project[];
  loading: boolean;
  toggleTaskCompletion: (
    projectId: number,
    taskId: number,
    completed: boolean
  ) => Promise<void>;
}

const Dashboard: React.FC<DashboardProps> = ({ projects, loading }) => {
  if (loading)
    return (
      <div className="text-gray-600 dark:text-gray-300 p-6">
        Loading dashboard...
      </div>
    );

  const totalProjects = projects.length;
  const totalTasks = projects.reduce((sum, p) => sum + p.tasks.length, 0);
  const totalCompleted = projects.reduce(
    (sum, p) => sum + p.tasks.filter((t) => t.completed).length,
    0
  );

  const recentTasks = projects
    .flatMap((p) => p.tasks.map((t) => ({ ...t, projectTitle: p.title })))
    .sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""))
    .slice(0, 5);

  return (
    <AnimatedWrapper>
      <DashboardLayout title="Dashboard">
        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div className="p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base">
              Total Projects
            </h3>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
              {totalProjects}
            </p>
          </div>
          <div className="p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base">
              Total Tasks
            </h3>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
              {totalTasks}
            </p>
          </div>
          <div className="p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base">
              Tasks Completed
            </h3>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
              {totalCompleted}
            </p>
          </div>
          <div className="p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base">
              Completion %
            </h3>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
              {totalTasks > 0
                ? Math.round((totalCompleted / totalTasks) * 100)
                : 0}
              %
            </p>
          </div>
        </div>

        {/* Project Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
          {projects.map((project) => (
            <DashboardCard
              key={project.id}
              project={{
                ...project,
                tasksCompleted:
                  typeof project.tasksCompleted === "number"
                    ? project.tasksCompleted
                    : project.tasks.filter((t) => t.completed).length,
                tasksTotal:
                  typeof project.tasksTotal === "number"
                    ? project.tasksTotal
                    : project.tasks.length,
              }}
              readOnly={true}
            />
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-md">
          <h3 className="text-gray-700 dark:text-gray-300 font-semibold mb-2 text-sm sm:text-base">
            Recent Tasks
          </h3>
          {recentTasks.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
              No recent tasks.
            </p>
          ) : (
            <ul className="space-y-2">
              {recentTasks.map((task) => (
                <li
                  key={task.id}
                  className="flex justify-between items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <span className="text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                    {task.title}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    {task.projectTitle}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DashboardLayout>
    </AnimatedWrapper>
  );
};

export default Dashboard;
