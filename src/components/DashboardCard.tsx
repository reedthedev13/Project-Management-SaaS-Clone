import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

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

interface DashboardCardProps {
  project: Project;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ project }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      className="p-6 border rounded shadow-md bg-white dark:bg-gray-800"
      whileHover={{ scale: 1.03, boxShadow: "0 10px 20px rgba(0,0,0,0.12)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Header */}
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
          {project.title}
        </h3>

        {/* Rotating & Hoverable Chevron */}
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          whileHover={{ scale: 1.2 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
        >
          <ChevronDown size={20} className="text-gray-600 dark:text-gray-300" />
        </motion.div>
      </div>

      {/* Progress */}
      <div className="text-sm mt-2 text-gray-700 dark:text-gray-300">
        {project.tasksCompleted}/{project.tasksTotal} tasks completed
      </div>

      {/* Smooth Slide Dropdown */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.ul
            key="tasks"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="mt-2 overflow-hidden space-y-1"
          >
            {project.tasks.map((task) => (
              <li
                key={`${project.id}-${task.id}`}
                className="flex justify-between items-center p-1 border rounded"
              >
                <span
                  className={task.completed ? "line-through text-gray-400" : ""}
                >
                  {task.title}
                </span>
                <input type="checkbox" checked={task.completed} readOnly />
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DashboardCard;
