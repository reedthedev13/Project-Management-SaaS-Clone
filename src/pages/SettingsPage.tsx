import React from "react";
import DashboardLayout from "../components/DashboardLayout";

const SettingsPage: React.FC = () => {
  return (
    <DashboardLayout title="Settings">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p>Adjust your account and preferences.</p>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
