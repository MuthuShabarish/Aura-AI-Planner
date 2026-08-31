import React from 'react';
import { useApp } from '../context/AppContext';
import { Search, Bell, Plus, Trash2, Sun, Moon, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from './ui/Button';

export const TopBar = ({ onOpenQuickAdd }) => {
  const {
    userProfile,
    searchQuery,
    setSearchQuery,
    notifications,
    showNotifications,
    setShowNotifications,
    markNotificationAsRead,
    clearNotifications,
    theme,
    toggleTheme
  } = useApp();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = userProfile?.name?.split(' ')[0] || 'Muthu';
  const unreadCount = notifications.filter((n) => !n.read).length;

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <header className="aura-topbar">
      {/* Greeting & Header Subtitle */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight truncate font-heading">
            {getGreeting()}, {firstName} <span className="inline-block">👋</span>
          </h2>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <CalendarIcon className="w-3.5 h-3.5 text-primary" />
            {todayFormatted}
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
          Here's your personal space for today. Stay focused and make progress.
        </p>
      </div>

      {/* Utilities */}
      <div className="flex items-center gap-3">
        {/* Search Input */}
        <div className="relative hidden md:block w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
          <input
            type="text"
            placeholder="Search tasks, notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="aura-input text-xs pr-4 py-2"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="aura-btn-icon flex items-center justify-center transition-transform active:scale-95"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-primary" />}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="aura-btn-icon flex items-center justify-center relative transition-transform active:scale-95"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 p-4 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 font-heading">
                  Notifications
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-primary-light text-primary">
                      {unreadCount} new
                    </span>
                  )}
                </h4>
                {notifications.length > 0 && (
                  <button
                    onClick={clearNotifications}
                    className="text-[11px] font-medium text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Clear
                  </button>
                )}
              </div>

              <div className="py-2 max-h-64 overflow-y-auto space-y-1.5">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">No notifications right now.</p>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => markNotificationAsRead(item.id)}
                      className={`p-2.5 rounded-xl text-xs flex items-start justify-between gap-2 cursor-pointer transition-colors ${
                        item.read
                          ? 'bg-transparent text-slate-500 dark:text-slate-400'
                          : 'bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white font-medium'
                      }`}
                    >
                      <p className="flex-1 leading-relaxed">{item.message}</p>
                      {!item.read && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1 flex-shrink-0" />}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick New Button */}
        <Button
          onClick={onOpenQuickAdd}
          variant="primary"
          size="md"
          icon={Plus}
        >
          Quick New
        </Button>
      </div>
    </header>
  );
};