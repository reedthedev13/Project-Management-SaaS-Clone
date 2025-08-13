import React from "react";

import AnimatedWrapper from "../components/AnimatedWrapper";

import DashboardLayout from "../components/DashboardLayout";

const Dashboard: React.FC = () => {
  return (
    <AnimatedWrapper>
      <DashboardLayout title="Dashboard">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 transition-colors duration-300">
          Welcome to your dashboard!
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-black/20 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Section 1
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Some description or content for this section.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-black/20 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Section 2
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Some description or content for this section.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-black/20 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Section 3
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Some description or content for this section.
            </p>
          </div>
        </div>
      </DashboardLayout>
    </AnimatedWrapper>
  );
};

export default Dashboard;
