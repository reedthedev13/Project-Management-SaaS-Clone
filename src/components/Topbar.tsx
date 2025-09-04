import React from "react";
import { motion } from "framer-motion";
import { User, Moon, Sun } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";

interface TopbarProps {
  title?: string;
  toggleSidebar?: () => void; // <-- add optional prop
}

const Topbar: React.FC<TopbarProps> = ({
  title = "Dashboard",
  toggleSidebar,
}) => {
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-black/20 transition-colors duration-300"
    >
      {/* Left Section: Mobile Hamburger */}
      <div className="flex items-center gap-3">
        {toggleSidebar && (
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md md:hidden bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            {/* Simple Hamburger Icon */}
            <svg
              className="w-5 h-5 text-gray-600 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        )}

        {/* Page Title */}
        <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {title || "Dashboard"}
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-3">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          {darkMode ? (
            <Sun size={18} className="text-yellow-400" />
          ) : (
            <Moon size={18} className="text-gray-600" />
          )}
        </button>

        {/* User Button */}
        <button
          onClick={() => navigate("/settings")}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          <User size={18} className="text-gray-600 dark:text-gray-300" />
        </button>
      </div>
    </motion.header>
  );
};

export default Topbar;
