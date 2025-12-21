import { User, Task, DashboardOverview } from '../types';

// Mock users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
  },
];

// Mock tasks
export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design new landing page',
    description: 'Create a modern, responsive landing page for the new product launch. Include hero section, features, testimonials, and CTA.',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2025-01-20T00:00:00Z',
    assignee: mockUsers[0],
    tags: ['design', 'frontend', 'urgent'],
    subtasks: [
      { id: '1-1', title: 'Create wireframes', completed: true },
      { id: '1-2', title: 'Design hero section', completed: true },
      { id: '1-3', title: 'Design features section', completed: false },
      { id: '1-4', title: 'Add testimonials', completed: false },
    ],
    comments: [
      {
        id: '1-c1',
        content: 'Started working on the wireframes. Should have the initial draft ready by tomorrow.',
        author: mockUsers[0],
        createdAt: '2025-01-15T10:30:00Z',
      },
      {
        id: '1-c2',
        content: 'Looks great! Make sure to include the new brand colors.',
        author: mockUsers[1],
        createdAt: '2025-01-15T14:20:00Z',
      },
    ],
    createdAt: '2025-01-14T09:00:00Z',
    updatedAt: '2025-01-15T14:20:00Z',
  },
  {
    id: '2',
    title: 'Implement user authentication',
    description: 'Set up JWT-based authentication system with login, register, and password reset functionality.',
    status: 'todo',
    priority: 'critical',
    dueDate: '2025-01-18T00:00:00Z',
    assignee: mockUsers[2],
    tags: ['backend', 'security', 'auth'],
    subtasks: [
      { id: '2-1', title: 'Set up JWT middleware', completed: false },
      { id: '2-2', title: 'Create login endpoint', completed: false },
      { id: '2-3', title: 'Create register endpoint', completed: false },
      { id: '2-4', title: 'Add password hashing', completed: false },
    ],
    comments: [],
    createdAt: '2025-01-13T11:15:00Z',
    updatedAt: '2025-01-13T11:15:00Z',
  },
  {
    id: '3',
    title: 'Write API documentation',
    description: 'Create comprehensive API documentation using OpenAPI/Swagger for all endpoints.',
    status: 'done',
    priority: 'medium',
    dueDate: '2025-01-12T00:00:00Z',
    assignee: mockUsers[1],
    tags: ['documentation', 'api'],
    subtasks: [
      { id: '3-1', title: 'Document auth endpoints', completed: true },
      { id: '3-2', title: 'Document task endpoints', completed: true },
      { id: '3-3', title: 'Add examples', completed: true },
    ],
    comments: [
      {
        id: '3-c1',
        content: 'Documentation is complete and published!',
        author: mockUsers[1],
        createdAt: '2025-01-12T16:45:00Z',
      },
    ],
    createdAt: '2025-01-10T08:30:00Z',
    updatedAt: '2025-01-12T16:45:00Z',
  },
  {
    id: '4',
    title: 'Set up CI/CD pipeline',
    description: 'Configure automated testing and deployment pipeline using GitHub Actions.',
    status: 'blocked',
    priority: 'medium',
    dueDate: '2025-01-25T00:00:00Z',
    assignee: mockUsers[3],
    tags: ['devops', 'automation'],
    subtasks: [
      { id: '4-1', title: 'Create GitHub workflow', completed: true },
      { id: '4-2', title: 'Set up testing stage', completed: false },
      { id: '4-3', title: 'Configure deployment', completed: false },
    ],
    comments: [
      {
        id: '4-c1',
        content: 'Blocked on getting access to the deployment server.',
        author: mockUsers[3],
        createdAt: '2025-01-14T13:20:00Z',
      },
    ],
    createdAt: '2025-01-11T14:00:00Z',
    updatedAt: '2025-01-14T13:20:00Z',
  },
  {
    id: '5',
    title: 'Mobile app testing',
    description: 'Comprehensive testing of the mobile application across different devices and operating systems.',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2025-01-22T00:00:00Z',
    assignee: mockUsers[0],
    tags: ['mobile', 'testing', 'qa'],
    subtasks: [
      { id: '5-1', title: 'Test on iOS devices', completed: true },
      { id: '5-2', title: 'Test on Android devices', completed: false },
      { id: '5-3', title: 'Performance testing', completed: false },
    ],
    comments: [],
    createdAt: '2025-01-12T10:00:00Z',
    updatedAt: '2025-01-15T09:30:00Z',
  },
  {
    id: '6',
    title: 'Database optimization',
    description: 'Optimize database queries and add proper indexing for better performance.',
    status: 'todo',
    priority: 'low',
    dueDate: '2025-01-30T00:00:00Z',
    assignee: mockUsers[2],
    tags: ['database', 'performance'],
    subtasks: [
      { id: '6-1', title: 'Analyze slow queries', completed: false },
      { id: '6-2', title: 'Add indexes', completed: false },
      { id: '6-3', title: 'Test performance improvements', completed: false },
    ],
    comments: [],
    createdAt: '2025-01-13T15:45:00Z',
    updatedAt: '2025-01-13T15:45:00Z',
  },
  {
    id: '7',
    title: 'Security audit',
    description: 'Conduct a comprehensive security audit of the application and fix any vulnerabilities.',
    status: 'todo',
    priority: 'critical',
    dueDate: '2025-01-28T00:00:00Z',
    assignee: null,
    tags: ['security', 'audit'],
    subtasks: [
      { id: '7-1', title: 'Run security scan', completed: false },
      { id: '7-2', title: 'Review dependencies', completed: false },
      { id: '7-3', title: 'Fix vulnerabilities', completed: false },
    ],
    comments: [],
    createdAt: '2025-01-14T12:00:00Z',
    updatedAt: '2025-01-14T12:00:00Z',
  },
  {
    id: '8',
    title: 'User onboarding flow',
    description: 'Design and implement a smooth onboarding experience for new users.',
    status: 'done',
    priority: 'medium',
    dueDate: '2025-01-10T00:00:00Z',
    assignee: mockUsers[1],
    tags: ['ux', 'onboarding'],
    subtasks: [
      { id: '8-1', title: 'Create welcome screens', completed: true },
      { id: '8-2', title: 'Add tutorial tooltips', completed: true },
      { id: '8-3', title: 'Implement progress tracking', completed: true },
    ],
    comments: [
      {
        id: '8-c1',
        content: 'Onboarding flow is complete and tested!',
        author: mockUsers[1],
        createdAt: '2025-01-10T17:30:00Z',
      },
    ],
    createdAt: '2025-01-08T09:15:00Z',
    updatedAt: '2025-01-10T17:30:00Z',
  },
];

// Mock dashboard data
export const mockDashboardOverview: DashboardOverview = {
  taskCounts: {
    todo: mockTasks.filter(t => t.status === 'todo').length,
    inProgress: mockTasks.filter(t => t.status === 'in-progress').length,
    done: mockTasks.filter(t => t.status === 'done').length,
    blocked: mockTasks.filter(t => t.status === 'blocked').length,
  },
  upcomingDeadlines: mockTasks
    .filter(task => task.dueDate && new Date(task.dueDate) > new Date())
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 5),
};

// Mock credentials for testing
export const mockCredentials = {
  email: 'demo@example.com',
  password: 'demo123',
  user: {
    id: 'demo-user',
    name: 'Demo User',
    email: 'demo@example.com',
  },
};