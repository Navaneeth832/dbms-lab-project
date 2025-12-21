import React from 'react';
import { Task, TaskStatus } from '../types';
import { Calendar, User, Tag, MessageCircle, CheckSquare2, Clock, Play, Ban, CheckCircle } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  viewMode: 'grid' | 'list';
  onSelect: (task: Task) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}

const statusConfig = {
  'todo': {
    icon: Clock,
    label: 'To Do',
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-700',
  },
  'in-progress': {
    icon: Play,
    label: 'In Progress',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  'done': {
    icon: CheckCircle,
    label: 'Done',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
  },
  'blocked': {
    icon: Ban,
    label: 'Blocked',
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
  },
};

const priorityConfig = {
  low: { color: 'text-gray-600 dark:text-gray-400', bgColor: 'bg-gray-100 dark:bg-gray-700' },
  medium: { color: 'text-yellow-600 dark:text-yellow-400', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30' },
  high: { color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
  critical: { color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900/30' },
};

export const TaskCard: React.FC<TaskCardProps> = ({ task: rawTask, viewMode, onSelect, onStatusChange }) => {
  const task = {
    ...rawTask,
    subtasks: rawTask.subtasks || [],
    comments: rawTask.comments || [],
  };
  const status = statusConfig[task.status];
  const priority = priorityConfig[task.priority];
  const StatusIcon = status.icon;

  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: 'Overdue', isOverdue: true };
    if (diffDays === 0) return { text: 'Today', isOverdue: false };
    if (diffDays === 1) return { text: 'Tomorrow', isOverdue: false };
    return { text: `${diffDays} days`, isOverdue: false };
  };

  const completedSubtasks = task.subtasks.filter(subtask => subtask.completed).length;
  const dueDateInfo = task.dueDate ? formatDueDate(task.dueDate) : null;

  if (viewMode === 'list') {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onSelect(task)}
                className="text-left hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                  {task.title}
                </h3>
              </button>
              
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {status.label}
                </span>
                
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priority.bgColor} ${priority.color} capitalize`}>
                  {task.priority}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
              {task.assignee && (
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {task.assignee.name}
                </div>
              )}
              
              {task.dueDate && (
                <div className={`flex items-center ${dueDateInfo?.isOverdue ? 'text-red-600 dark:text-red-400' : ''}`}>
                  <Calendar className="w-4 h-4 mr-1" />
                  {dueDateInfo?.text}
                </div>
              )}
              
              {(task.subtasks || []).length > 0 && (
                <div className="flex items-center">
                  <CheckSquare2 className="w-4 h-4 mr-1" />
                  {completedSubtasks}/{task.subtasks.length}
                </div>
              )}
              
              {task.comments.length > 0 && (
                <div className="flex items-center">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  {task.comments.length}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <button
          onClick={() => onSelect(task)}
          className="text-left hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex-1"
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white line-clamp-2">
            {task.title}
          </h3>
        </button>
        
        <div className="ml-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priority.bgColor} ${priority.color} capitalize`}>
            {task.priority}
          </span>
        </div>
      </div>

      {task.description && (
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {task.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
          >
            <Tag className="w-3 h-3 mr-1" />
            {tag}
          </span>
        ))}
      </div>

      <div className="space-y-3">
        {task.assignee && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <User className="w-4 h-4 mr-2" />
            {task.assignee.name}
          </div>
        )}

        {task.dueDate && (
          <div className={`flex items-center text-sm ${dueDateInfo?.isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
            <Calendar className="w-4 h-4 mr-2" />
            Due {dueDateInfo?.text}
          </div>
        )}

        {task.subtasks.length > 0 && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <CheckSquare2 className="w-4 h-4 mr-2" />
            {completedSubtasks}/{task.subtasks.length} subtasks completed
          </div>
        )}

        {task.comments.length > 0 && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <MessageCircle className="w-4 h-4 mr-2" />
            {task.comments.length} comments
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.bgColor} ${status.color}`}>
            <StatusIcon className="w-4 h-4 mr-2" />
            {status.label}
          </span>

          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>
    </div>
  );
};