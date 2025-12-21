import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { useToast } from './hooks/useToast';
import { ToastContainer } from './components/Toast';
import { Layout } from './components/Layout';
import { Navigation } from './components/Navigation';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { TaskListPage } from './pages/TaskListPage';
import { TaskModal } from './components/TaskModal';
import { Task } from './types';

function AppContent() {
  const { user, loading } = useAuth();
  const { toasts, removeToast } = useToast();
  const [activeView, setActiveView] = useState<'dashboard' | 'tasks'>('dashboard');
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onToggleMode={() => {}} />;
  }

  const handleAddTask = () => {
    setSelectedTask(undefined);
    setShowTaskModal(true);
  };

  const handleTaskSelect = (task: Task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleTaskModalClose = () => {
    setShowTaskModal(false);
    setSelectedTask(undefined);
  };

  const handleTaskSave = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Layout>
      <Navigation
        activeView={activeView}
        onViewChange={setActiveView}
        onAddTask={handleAddTask}
      />
      
      {activeView === 'dashboard' ? (
        <DashboardPage />
      ) : (
        <TaskListPage
          onTaskSelect={handleTaskSelect}
          refreshTrigger={refreshTrigger}
        />
      )}

      <TaskModal
        task={selectedTask}
        isOpen={showTaskModal}
        onClose={handleTaskModalClose}
        onSave={handleTaskSave}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </Layout>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;