import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar: React.FC = () => {
  const { darkMode } = useTheme();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const sidebarVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.4 } },
  };

  const linkVariants = {
    hover: { scale: 1.05 },
  };

  // Nav items and routes
  const navItems: { name: string; path: string }[] = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Projects", path: "/projects" },
    { name: "Tasks", path: "/tasks" },
    { name: "Calendar", path: "/calendar" },
    { name: "Settings", path: "/settings" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <motion.aside
      className={`
        w-64 min-h-screen p-6 flex flex-col
        bg-white dark:bg-gray-900
        border-r border-gray-200 dark:border-gray-700
        transition-colors duration-300
      `}
      initial="hidden"
      animate="visible"
      variants={sidebarVariants}
    >
      {/* User Info */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Project Management
        </h2>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
            {user?.name?.[0] || "U"}
          </div>
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            {user?.name || "User"}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col space-y-4 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-md font-medium transition-colors duration-200
               ${
                 isActive
                   ? "bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-400"
                   : "text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
               }`
            }
          >
            <motion.span whileHover="hover" variants={linkVariants}>
              {item.name}
            </motion.span>
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <motion.button
        onClick={handleLogout}
        className="mt-auto text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400 font-semibold transition-colors duration-200"
        whileHover={{ scale: 1.05 }}
      >
        Logout
      </motion.button>
    </motion.aside>
  );
};

export default Sidebar;
