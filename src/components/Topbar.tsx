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
      className="flex items-center justify-between px-6 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700"
    >
      <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
        Dashboard
      </h1>

      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          <Bell size={18} />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          <User size={18} />
        </button>
      </div>
    </motion.header>
  );
};

export default Topbar;
