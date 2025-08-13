import React from "react";

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white shadow-md min-h-screen p-6 flex flex-col">
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Project Management</h2>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
            JD
          </div>
          <span className="font-semibold text-gray-700">John Doe</span>
        </div>
      </div>

      <nav className="flex flex-col space-y-4">
        <a href="#" className="text-gray-700 hover:text-indigo-600 font-medium">
          Dashboard
        </a>
        <a href="#" className="text-gray-700 hover:text-indigo-600 font-medium">
          Projects
        </a>
        <a href="#" className="text-gray-700 hover:text-indigo-600 font-medium">
          Tasks
        </a>
        <a href="#" className="text-gray-700 hover:text-indigo-600 font-medium">
          Calendar
        </a>
        <a href="#" className="text-gray-700 hover:text-indigo-600 font-medium">
          Settings
        </a>
        <button className="mt-auto text-red-600 hover:text-red-800 font-semibold">
          Logout
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
