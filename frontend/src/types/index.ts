export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  assignee: User | null;
  tags: string[];
  subtasks: Subtask[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: string;
}

export interface DashboardOverview {
  taskCounts: {
    todo: number;
    inProgress: number;
    done: number;
    blocked: number;
  };
  upcomingDeadlines: Task[];
}

export type TaskStatus = 'todo' | 'in-progress' | 'done' | 'blocked';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

export interface TaskFilters {
  status?: TaskStatus;
  assignee?: string;
  tag?: string;
  sort?: 'dueDate' | 'priority' | 'createdAt';
  fields?: string[];
}