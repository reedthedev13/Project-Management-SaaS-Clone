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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          {[
            { label: "Total Projects", value: totalProjects },
            { label: "Total Tasks", value: totalTasks },
            { label: "Tasks Completed", value: totalCompleted },
            {
              label: "Completion %",
              value:
                totalTasks > 0
                  ? Math.round((totalCompleted / totalTasks) * 100)
                  : 0,
              suffix: "%",
            },
          ].map((metric) => (
            <div
              key={metric.label}
              className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition"
            >
              <h3 className="text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base">
                {metric.label}
              </h3>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                {metric.value}
                {metric.suffix || ""}
              </p>
            </div>
          ))}
        </div>

        {/* Project Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="transform transition hover:-translate-y-1 hover:shadow-lg"
            >
              <DashboardCard
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
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-gray-700 dark:text-gray-300 font-semibold mb-3 text-sm sm:text-base">
            Recent Tasks
          </h3>
          {recentTasks.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 italic text-sm sm:text-base">
              No recent tasks.
            </p>
          ) : (
            <ul className="space-y-2">
              {recentTasks.map((task) => (
                <li
                  key={task.id}
                  className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
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
