import { Task, TaskFilters, DashboardOverview, User } from '../types';
import { mockAuthService, mockTaskService, mockDashboardService } from './mockApi';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true' || !import.meta.env.VITE_API_BASE_URL;

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new ApiError(response.status, errorData.message || 'Request failed');
  }
  return response.json();
};

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });
  return handleResponse(response);
};

export const authService = {
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    if (USE_MOCK_API) {
      return mockAuthService.login(email, password);
    }

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await handleResponse(response);
    localStorage.setItem('auth_token', data.access_token);

    const user = await fetchWithAuth(`${API_BASE_URL}/users/me`);
    return { token: data.access_token, user };
  },

  async register(name: string, email: string, password: string): Promise<{ token: string; user: User }> {
    if (USE_MOCK_API) {
      return mockAuthService.register(name, email, password);
    }

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await handleResponse(response);
    localStorage.setItem('auth_token', data.access_token);

    const user = await fetchWithAuth(`${API_BASE_URL}/users/me`);
    return { token: data.access_token, user };
  },
};

export const taskService = {
  async getTasks(filters: TaskFilters = {}): Promise<Task[]> {
    if (USE_MOCK_API) {
      return mockTaskService.getTasks(filters);
    }

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, String(value));
      }
    });

    return fetchWithAuth(`${API_BASE_URL}/tasks?${params}`);
  },

  async getTask(id: string): Promise<Task> {
    if (USE_MOCK_API) {
      return mockTaskService.getTask(id);
    }
    return fetchWithAuth(`${API_BASE_URL}/tasks/${id}`);
  },

  async createTask(task: Partial<Task>): Promise<Task> {
    if (USE_MOCK_API) {
      return mockTaskService.createTask(task);
    }
    return fetchWithAuth(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      body: JSON.stringify(task),
    });
  },

  async updateTask(id: string, task: Partial<Task>): Promise<Task> {
    if (USE_MOCK_API) {
      return mockTaskService.updateTask(id, task);
    }
    return fetchWithAuth(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(task),
    });
  },

  async updateTaskStatus(id: string, status: string, assignee?: string): Promise<Task> {
    if (USE_MOCK_API) {
      return mockTaskService.updateTaskStatus(id, status, assignee);
    }
    return fetchWithAuth(`${API_BASE_URL}/tasks/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, assignee }),
    });
  },

  async deleteTask(id: string): Promise<void> {
    if (USE_MOCK_API) {
      return mockTaskService.deleteTask(id);
    }
    await fetchWithAuth(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
    });
  },

  async addComment(taskId: string, content: string): Promise<void> {
    if (USE_MOCK_API) {
      return mockTaskService.addComment(taskId, content);
    }
    await fetchWithAuth(`${API_BASE_URL}/tasks/${taskId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },
};

export const dashboardService = {
  async getOverview(): Promise<DashboardOverview> {
    if (USE_MOCK_API) {
      return mockDashboardService.getOverview();
    }
    return fetchWithAuth(`${API_BASE_URL}/dashboard/overview`);
  },
};
