export interface Task {
  id: number;
  title: string;
  completed: boolean;
  updatedAt?: string;
}

export interface Project {
  id: number;
  title: string;
  tasks: Task[];
  tasksCompleted: number;
  tasksTotal: number;
}
