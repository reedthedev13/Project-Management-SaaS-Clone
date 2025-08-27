import React from "react";
import DashboardLayout from "../components/DashboardLayout";

const CalendarPage: React.FC = () => {
  return (
    <DashboardLayout title="Calendar">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <p>See your upcoming events.</p>
      </div>
    </DashboardLayout>
  );
};

export default CalendarPage;
