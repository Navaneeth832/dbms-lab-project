import React from 'react';
import { BarChart3, List, Plus } from 'lucide-react';

interface NavigationProps {
  activeView: 'dashboard' | 'tasks';
  onViewChange: (view: 'dashboard' | 'tasks') => void;
  onAddTask: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeView, onViewChange, onAddTask }) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <nav className="flex space-x-1">
          <button
            onClick={() => onViewChange('dashboard')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeView === 'dashboard'
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>Dashboard</span>
          </button>
          
          <button
            onClick={() => onViewChange('tasks')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeView === 'tasks'
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <List className="w-5 h-5" />
            <span>Tasks</span>
          </button>
        </nav>
        
        <button
          onClick={onAddTask}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Task</span>
        </button>
      </div>
    </div>
  );
};