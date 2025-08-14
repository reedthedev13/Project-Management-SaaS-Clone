import React from "react";
import DashboardCard from "./DashboardCard";

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

interface Project {
  id: number;
  title: string;
  tasksCompleted: number;
  tasksTotal: number;
  tasks: Task[];
}

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
