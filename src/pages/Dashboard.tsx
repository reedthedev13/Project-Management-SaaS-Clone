// Dashboard.tsx
import React, { useState } from "react";
import AnimatedWrapper from "../components/AnimatedWrapper";
import DashboardLayout from "../components/DashboardLayout";
import DashboardCards from "../components/DashboardCards";

const Dashboard: React.FC = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const mockProjects = [
    {
      id: 1,
      title: "Website Redesign",
      tasksCompleted: 5,
      tasksTotal: 12,
      tasks: [
        { id: 1, title: "Create wireframes", completed: true },
        { id: 2, title: "Design UI mockups", completed: false },
        { id: 3, title: "Review with team", completed: false },
      ],
    },
    {
      id: 2,
      title: "Marketing Campaign",
      tasksCompleted: 8,
      tasksTotal: 10,
      tasks: [
        { id: 1, title: "Set up landing page", completed: true },
        { id: 2, title: "Write ad copy", completed: true },
        { id: 3, title: "Launch campaign", completed: false },
      ],
    },
  ];

  const handleToggle = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <AnimatedWrapper>
      <DashboardLayout title="Dashboard">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Your Projects
        </h2>
        <DashboardCards
          projects={mockProjects}
          expandedId={expandedId}
          onToggle={handleToggle}
        />
      </DashboardLayout>
    </AnimatedWrapper>
  );
};

export default Dashboard;
