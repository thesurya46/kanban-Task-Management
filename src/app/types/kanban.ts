export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

export interface Board {
  columns: Column[];
}
