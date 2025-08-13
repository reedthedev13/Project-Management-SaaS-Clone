import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react";

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
}

const DashboardCards: React.FC<DashboardCardsProps> = ({ projects }) => {
  const [expandedProjectId, setExpandedProjectId] = useState<number | null>(
    null
  );

  const toggleExpand = (id: number) => {
    setExpandedProjectId((prevExpandedProjectId) =>
      prevExpandedProjectId === id ? null : id
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => {
        const progress = (project.tasksCompleted / project.tasksTotal) * 100;
        const isExpanded = expandedProjectId === project.id;

        return (
          <motion.div
            key={project.id}
            layout // animate layout changes per card
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: project.id * 0.05 }}
            className="p-6 rounded-lg shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors"
          >
            {/* Card Header */}
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {project.title}
              </h3>
              <div className="flex items-center space-x-2">
                <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                  <Edit
                    size={16}
                    className="text-gray-600 dark:text-gray-300"
                  />
                </button>
                <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                  <Trash2
                    size={16}
                    className="text-red-600 dark:text-red-400"
                  />
                </button>
                <button
                  onClick={() => toggleExpand(project.id)}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  {isExpanded ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              {project.tasksCompleted}/{project.tasksTotal} tasks completed
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden mb-3">
              <div
                className="h-2 bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Task List */}
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.ul
                  layout // makes only this list animate
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-2 space-y-2 overflow-hidden"
                >
                  {project.tasks.map((task) => (
                    <li
                      key={task.id}
                      className="flex items-center justify-between p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      <span
                        className={`text-gray-800 dark:text-gray-100 ${
                          task.completed
                            ? "line-through text-gray-400 dark:text-gray-500"
                            : ""
                        }`}
                      >
                        {task.title}
                      </span>
                      <input
                        type="checkbox"
                        checked={task.completed}
                        className="accent-indigo-600 dark:accent-indigo-500"
                        readOnly
                      />
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};

export default DashboardCards;
