// src/pages/Dashboard.tsx
import React from "react";
import AnimatedWrapper from "../components/AnimatedWrapper";
import DashboardLayout from "../components/DashboardLayout";
import BoardsList from "../components/BoardsList";

const Dashboard: React.FC = () => {
  return (
    <AnimatedWrapper>
      <DashboardLayout title="Dashboard">
        <BoardsList />
      </DashboardLayout>
    </AnimatedWrapper>
  );
};

export default Dashboard;
