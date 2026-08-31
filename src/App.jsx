import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { QuickAddModal } from './components/QuickAddModal';
import { MyDayView } from './pages/MyDayView';
import { ScheduleView } from './pages/ScheduleView';
import { TasksView } from './pages/TasksView';
import { HabitsView } from './pages/HabitsView';
import { GoalsView } from './pages/GoalsView';
import { JournalView } from './pages/JournalView';
import { NotesView } from './pages/NotesView';
import { InsightsView } from './pages/InsightsView';
import { IntegrationsView } from './pages/IntegrationsView';
import { SettingsView } from './pages/SettingsView';
import { AuraAIView } from './pages/AuraAIView';
import { LandingPage } from './pages/LandingPage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { FocusPanel } from './components/FocusPanel';
import { OnboardingModal } from './components/OnboardingModal';
import { AuthModal } from './components/AuthModal';
import { Toast } from './components/Toast';

import { CategoryManagerModal } from './components/CategoryManagerModal';

const MainContent = ({ onOpenQuickAdd }) => {
  const { activeTab } = useApp();

  return (
    <div className="aura-main-workspace">
      <TopBar onOpenQuickAdd={onOpenQuickAdd} />
      <main className="aura-page-container">
        {(activeTab === 'today' || activeTab === 'my-day') && <MyDayView />}
        {(activeTab === 'schedule' || activeTab === 'calendar') && <ScheduleView />}
        {activeTab === 'tasks' && <TasksView />}
        {activeTab === 'habits' && <HabitsView />}
        {activeTab === 'goals' && <GoalsView />}
        {activeTab === 'journal' && <JournalView />}
        {activeTab === 'notes' && <NotesView />}
        {activeTab === 'insights' && <InsightsView />}
        {activeTab === 'ai' && <AuraAIView />}
        {activeTab === 'integrations' && <IntegrationsView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>
    </div>
  );
};

const AppRouter = () => {
  const { isAuthenticated } = useApp();
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname;
      return p === '/sign-in' || p === '/sign-up' || p === '/app' ? p : '/';
    }
    return '/';
  });

  const navigate = (path) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
  };

  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== 'undefined') {
        const p = window.location.pathname;
        setCurrentPath(p === '/sign-in' || p === '/sign-up' || p === '/app' ? p : '/');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Route protection and automatic redirection
  useEffect(() => {
    if (!isAuthenticated) {
      if (currentPath === '/app') {
        navigate('/');
      }
    } else {
      if (currentPath === '/' || currentPath === '/sign-in' || currentPath === '/sign-up') {
        navigate('/app');
      }
    }
  }, [isAuthenticated, currentPath]);

  if (!isAuthenticated) {
    if (currentPath === '/sign-in') {
      return <SignInPage navigate={navigate} />;
    }
    if (currentPath === '/sign-up') {
      return <SignUpPage navigate={navigate} />;
    }
    return <LandingPage navigate={navigate} />;
  }

  // Authenticated: render existing AURA planner workspace
  return (
    <div className="aura-app-shell">
      <Sidebar />
      <MainContent onOpenQuickAdd={() => setIsQuickAddOpen(true)} />
      <QuickAddModal isOpen={isQuickAddOpen} onClose={() => setIsQuickAddOpen(false)} />
      <CategoryManagerModal />
      <OnboardingModal />
      <AuthModal />
      <FocusPanel />
      <Toast />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}

export default App;