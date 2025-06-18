export interface Task {
  id?: number;
  title: string;
  description: string;
  status: 'todo' | 'doing' | 'done';
  createdAt?: string;   // ISO date string
  updatedAt?: string;
}