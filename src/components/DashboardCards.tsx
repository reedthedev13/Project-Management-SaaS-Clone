// DashboardCards.tsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

interface Project {
  id: number;
  title: string;
  tasksCompleted: number;
  tasksTotal: number;
  tasks: Task[];
}

interface DashboardCardsProps {
  projects: Project[];
  expandedId: number | null;
  onToggle: (id: number) => void;
}

const DashboardCards: React.FC<DashboardCardsProps> = ({
  projects,
  expandedId,
  onToggle,
}) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => {
        const isExpanded = expandedId === project.id;
        return (
          <div
            key={project.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {project.title}
              </h3>
              <button
                onClick={() => onToggle(project.id)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ▼
              </button>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {project.tasksCompleted}/{project.tasksTotal} tasks completed
            </p>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mt-4"
                >
                  {project.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-2 py-1 border-b border-gray-200 dark:border-gray-700 last:border-0"
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        readOnly
                        className="form-checkbox"
                      />
                      <span className="text-gray-800 dark:text-gray-200">
                        {task.title}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardCards;
