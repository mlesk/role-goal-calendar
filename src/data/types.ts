
export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  goalId: string;
  scheduledDate?: string; // ISO date string
  scheduledHour?: number; // Hour of the day (0-23)
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  roleId: string;
  tasks: Task[];
}

export interface Role {
  id: string;
  title: string;
  description: string;
  goals: Goal[];
}
