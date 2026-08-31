import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Calendar,
  CheckSquare,
  Target,
  Zap,
  BookOpen,
  FileText,
  BarChart3,
  Clock,
  Share2,
  Settings,
  Sparkles,
  ChevronDown
} from 'lucide-react';

export const Sidebar = () => {
  const { activeTab, setActiveTab, userProfile, setShowAuth, setShowFocusModePanel, tasks, habits, goals } = useApp();

  const remainingTasksCount = tasks.filter((t) => !t.completed).length;
  const todayStr = new Date().toISOString().slice(0, 10);
  const completedHabitsToday = habits.filter((h) => h.completedDates?.includes(todayStr)).length;

  const mainNavItems = [
    { id: 'ai', label: 'AURA AI', icon: Sparkles, badge: 'BETA', badgeColor: 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30' },
    { id: 'today', label: 'My Day', icon: LayoutDashboard },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, badge: remainingTasksCount > 0 ? remainingTasksCount : null, badgeColor: 'bg-indigo-500/20 text-indigo-300' },
    { id: 'goals', label: 'Goals', icon: Target, badge: goals.length > 0 ? goals.length : null, badgeColor: 'bg-amber-500/20 text-amber-300' },
    { id: 'habits', label: 'Habits', icon: Zap, badge: habits.length > 0 ? `${completedHabitsToday}/${habits.length}` : null, badgeColor: 'bg-emerald-500/20 text-emerald-300' },
    { id: 'journal', label: 'Journal', icon: BookOpen },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'insights', label: 'Insights', icon: BarChart3 }
  ];

  const secondaryNavItems = [
    { id: 'focus', label: 'Focus Mode', icon: Clock, isFocusTrigger: true },
    { id: 'integrations', label: 'Integrations', icon: Share2 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleNavClick = (item) => {
    if (item.isFocusTrigger) {
      setShowFocusModePanel(true);
    } else {
      setActiveTab(item.id);
    }
  };

  return (
    <aside className="aura-sidebar-container">
      {/* Brand Header */}
      <div className="p-6 pb-5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-lg shadow-md shadow-primary">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-extrabold text-lg text-white tracking-tight leading-none flex items-center gap-1.5 font-heading">
            AURA <span className="text-primary text-xs font-semibold">✦</span>
          </h1>
          <p className="text-[10px] text-slate-400 font-semibold tracking-wider mt-1 uppercase">
            Personal Planner
          </p>
        </div>
      </div>

      {/* Navigation Lists */}
      <div className="px-4 flex-1 overflow-y-auto space-y-6 py-2">
        {/* Main Nav */}
        <nav className="space-y-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (item.id === 'today' && activeTab === 'my-day');
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`aura-nav-btn ${isActive ? 'active' : ''}`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Secondary Nav */}
        <nav className="pt-4 border-t border-slate-800 space-y-1">
          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`aura-nav-btn ${isActive ? 'active' : ''}`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="flex-1 text-left">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={() => setShowAuth(true)}
          className="w-full flex items-center gap-3 p-2 rounded-xl text-left text-slate-300 hover:bg-slate-800/80 transition-colors group"
        >
          <img
            src={userProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
            alt={userProfile?.name || 'User'}
            className="w-8 h-8 rounded-full object-cover border border-slate-700"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-white truncate font-heading">
              {userProfile?.name || 'My Account'}
            </h4>
            <p className="text-[11px] text-slate-400 truncate">
              {userProfile?.email || userProfile?.title || 'Personal Planner'}
            </p>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
        </button>
      </div>
    </aside>
  );
};