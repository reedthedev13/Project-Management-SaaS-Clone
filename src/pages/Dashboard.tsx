import React from "react";

import AnimatedWrapper from "../components/AnimatedWrapper";

import DashboardLayout from "../components/DashboardLayout";

const Dashboard: React.FC = () => {
  return (
    <AnimatedWrapper>
      <DashboardLayout title="Dashboard">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Welcome to your dashboard!
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            Section 1
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            Section 2
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            Section 3
          </div>
        </div>
      </DashboardLayout>
    </AnimatedWrapper>
  );
};

export default Dashboard;
