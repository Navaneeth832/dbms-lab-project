import { Task, TaskFilters, DashboardOverview, User } from '../types';
import { mockTasks, mockDashboardOverview, mockCredentials, mockUsers } from '../data/mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MockApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'MockApiError';
  }
}

// In-memory storage for tasks (simulates database)
let tasks = [...mockTasks];
let taskIdCounter = tasks.length + 1;

export const mockAuthService = {
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    await delay(800);
    
    if (email === mockCredentials.email && password === mockCredentials.password) {
      return {
        token: 'mock-jwt-token-' + Date.now(),
        user: mockCredentials.user,
      };
    }
    
    throw new MockApiError(401, 'Invalid email or password');
  },

  async register(name: string, email: string, password: string): Promise<{ token: string; user: User }> {
    await delay(1000);
    
    // Simulate email already exists
    if (email === 'existing@example.com') {
      throw new MockApiError(400, 'Email already exists');
    }
    
    const newUser: User = {
      id: 'user-' + Date.now(),
      name,
      email,
    };
    
    return {
      token: 'mock-jwt-token-' + Date.now(),
      user: newUser,
    };
  },
};

export const mockTaskService = {
  async getTasks(filters: TaskFilters = {}): Promise<Task[]> {
    await delay(500);
    
    let filteredTasks = [...tasks];
    
    // Apply filters
    if (filters.status) {
      filteredTasks = filteredTasks.filter(task => task.status === filters.status);
    }
    
    if (filters.assignee) {
      filteredTasks = filteredTasks.filter(task => 
        task.assignee?.name.toLowerCase().includes(filters.assignee!.toLowerCase())
      );
    }
    
    if (filters.tag) {
      filteredTasks = filteredTasks.filter(task =>
        task.tags.some(tag => tag.toLowerCase().includes(filters.tag!.toLowerCase()))
      );
    }
    
    // Apply sorting
    if (filters.sort) {
      filteredTasks.sort((a, b) => {
        switch (filters.sort) {
          case 'dueDate':
            if (!a.dueDate && !b.dueDate) return 0;
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          
          case 'priority':
            const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
          
          case 'createdAt':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          
          default:
            return 0;
        }
      });
    }
    
    return filteredTasks;
  },

  async getTask(id: string): Promise<Task> {
    await delay(300);
    
    const task = tasks.find(t => t.id === id);
    if (!task) {
      throw new MockApiError(404, 'Task not found');
    }
    
    return task;
  },

  async createTask(taskData: Partial<Task>): Promise<Task> {
    await delay(600);
    
    const newTask: Task = {
      id: taskIdCounter.toString(),
      title: taskData.title || '',
      description: taskData.description || '',
      status: 'todo',
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || null,
      assignee: taskData.assignee || null,
      tags: taskData.tags || [],
      subtasks: taskData.subtasks || [],
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    tasks.push(newTask);
    taskIdCounter++;
    
    return newTask;
  },

  async updateTask(id: string, taskData: Partial<Task>): Promise<Task> {
    await delay(500);
    
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      throw new MockApiError(404, 'Task not found');
    }
    
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...taskData,
      updatedAt: new Date().toISOString(),
    };
    
    return tasks[taskIndex];
  },

  async updateTaskStatus(id: string, status: string, assignee?: string): Promise<Task> {
    await delay(400);
    
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      throw new MockApiError(404, 'Task not found');
    }
    
    const updates: Partial<Task> = {
      status: status as any,
      updatedAt: new Date().toISOString(),
    };
    
    if (assignee) {
      const user = mockUsers.find(u => u.name.toLowerCase().includes(assignee.toLowerCase()));
      updates.assignee = user || null;
    }
    
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...updates,
    };
    
    return tasks[taskIndex];
  },

  async deleteTask(id: string): Promise<void> {
    await delay(400);
    
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      throw new MockApiError(404, 'Task not found');
    }
    
    tasks.splice(taskIndex, 1);
  },

  async addComment(taskId: string, content: string): Promise<void> {
    await delay(300);
    
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
      throw new MockApiError(404, 'Task not found');
    }
    
    const newComment = {
      id: `${taskId}-c${Date.now()}`,
      content,
      author: mockCredentials.user,
      createdAt: new Date().toISOString(),
    };
    
    tasks[taskIndex].comments.push(newComment);
    tasks[taskIndex].updatedAt = new Date().toISOString();
  },
};

export const mockDashboardService = {
  async getOverview(): Promise<DashboardOverview> {
    await delay(400);
    
    // Calculate current stats from tasks
    const taskCounts = {
      todo: tasks.filter(t => t.status === 'todo').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      done: tasks.filter(t => t.status === 'done').length,
      blocked: tasks.filter(t => t.status === 'blocked').length,
    };
    
    const upcomingDeadlines = tasks
      .filter(task => task.dueDate && new Date(task.dueDate) > new Date())
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
      .slice(0, 5);
    
    return {
      taskCounts,
      upcomingDeadlines,
    };
  },
};