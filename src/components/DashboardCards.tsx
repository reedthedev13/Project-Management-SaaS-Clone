// src/components/DashboardCards.tsx
import React from "react";
import DashboardCard, { Project } from "./DashboardCard";

interface DashboardCardsProps {
  projects: Project[];
}

const DashboardCards: React.FC<DashboardCardsProps> = ({ projects }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <DashboardCard key={project.id} project={project} />
      ))}
    </div>
  );
};

export default DashboardCards;
