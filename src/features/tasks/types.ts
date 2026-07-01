export type Task = {
  id: string;
  text: string;
  completed: boolean;
  createdDate: number;
  completedDate?: number;
};

export type CreateTaskRequest = {
  text: string;
};

export type UpdateTaskRequest = {
  text: string;
};

export type TaskFilterValue = 'all' | 'active' | 'completed';
