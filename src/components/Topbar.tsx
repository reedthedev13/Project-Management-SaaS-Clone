import React, { useContext } from "react";
import { motion } from "framer-motion";
import { Bell, Search, User, Moon, Sun } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

interface TopbarProps {
  title?: string;
}

const Topbar: React.FC<TopbarProps> = ({ title = "Dashboard" }) => {
  const { darkMode, toggleTheme } = useTheme();
  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex items-center justify-between px-6 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-black/20 transition-colors duration-300"
    >
      {/* Page Title */}
      <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
        {title || "Dashboard"}
      </h1>

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

        {/* Notifications */}
        <button className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200">
          <Bell size={18} className="text-gray-600 dark:text-gray-300" />
        </button>

        {/* User */}
        <button className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200">
          <User size={18} className="text-gray-600 dark:text-gray-300" />
        </button>
      </div>
    </motion.header>
  );
};

export default Topbar;
