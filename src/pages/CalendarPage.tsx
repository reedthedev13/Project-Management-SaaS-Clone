import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Project, Task } from "../types";

interface CalendarPageProps {
  projects: Project[];
  setProjects?: React.Dispatch<React.SetStateAction<Project[]>>;
}

interface TaskWithProject extends Task {
  projectTitle: string;
}

const CalendarPage: React.FC<CalendarPageProps> = ({ projects }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [allTasks, setAllTasks] = useState<TaskWithProject[]>([]);
  const [tasksForSelectedDate, setTasksForSelectedDate] = useState<
    TaskWithProject[]
  >([]);

  useEffect(() => {
    // Flatten tasks and attach projectTitle
    const tasks: TaskWithProject[] = projects.flatMap((p) =>
      p.tasks.map((t) => ({ ...t, projectTitle: p.title }))
    );
    setAllTasks(tasks);
  }, [projects]);

  useEffect(() => {
    // Filter tasks for selected date
    const filtered = allTasks.filter((t) => {
      if (!t.updatedAt) return false;
      const taskDate = new Date(t.updatedAt);
      return (
        taskDate.getFullYear() === selectedDate.getFullYear() &&
        taskDate.getMonth() === selectedDate.getMonth() &&
        taskDate.getDate() === selectedDate.getDate()
      );
    });
    setTasksForSelectedDate(filtered);
  }, [allTasks, selectedDate]);

  return (
    <DashboardLayout title="Calendar">
      <div className="p-6 max-w-4xl mx-auto">
        {/* Calendar Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Select a Date
          </h2>

          <Calendar
            value={selectedDate}
            onChange={(
              value: Date | [Date | null, Date | null] | null,
              event
            ) => {
              if (value instanceof Date) {
                setSelectedDate(value);
              }
            }}
            className="react-calendar border-none w-full text-gray-900 dark:text-gray-100 rounded-lg shadow-sm dark:bg-gray-800 "
          />
        </div>

        {/* Tasks for Selected Date */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Tasks for{" "}
            <span className="font-normal">{selectedDate.toDateString()}</span>
          </h3>

          {tasksForSelectedDate.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No tasks on this date.
            </p>
          ) : (
            <ul className="space-y-3">
              {tasksForSelectedDate.map((task) => (
                <li
                  key={task.id}
                  className="flex justify-between items-center p-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                  <span
                    className={`${
                      task.completed
                        ? "line-through text-gray-400 dark:text-gray-400"
                        : "text-gray-900 dark:text-gray-100"
                    } font-medium`}
                  >
                    {task.title}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {task.projectTitle}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CalendarPage;
