import React from "react";
import Sidebar from "../components/Sidebar";

const Dashboard: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <button
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md shadow transition"
            // onClick={() => logout()} // you can wire this up later
          >
            Logout
          </button>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card example */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Projects</h2>
            <p className="text-gray-600">You have 5 active projects</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Tasks</h2>
            <p className="text-gray-600">12 tasks pending</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Notifications</h2>
            <p className="text-gray-600">You have 3 new notifications</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
