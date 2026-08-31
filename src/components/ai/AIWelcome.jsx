import React from 'react';
import { Sparkles, CheckSquare, Calendar, LayoutDashboard, ListTodo, Zap, BookOpen, ArrowRight } from 'lucide-react';

export const AIWelcome = ({ onSelectAction }) => {
  const quickActions = [
    {
      id: 'add-task',
      title: 'Add a task',
      subtitle: 'Create a new task',
      prompt: 'Create a new high-priority task for UI study',
      icon: CheckSquare,
      color: 'text-indigo-500 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200/80 dark:border-indigo-500/20',
      glow: 'group-hover:border-indigo-500/50 group-hover:shadow-indigo-500/10'
    },
    {
      id: 'schedule-time',
      title: 'Schedule study time',
      subtitle: 'Block time for focus',
      prompt: 'Hey AURA, I want to set 1 hour time for study purpose today at 6:00 PM.',
      icon: Calendar,
      color: 'text-sky-500 dark:text-sky-400',
      bg: 'bg-sky-50 dark:bg-sky-500/10 border-sky-200/80 dark:border-sky-500/20',
      glow: 'group-hover:border-sky-500/50 group-hover:shadow-sky-500/10'
    },
    {
      id: 'plan-day',
      title: 'Plan my day',
      subtitle: 'Create a simple plan',
      prompt: 'Can you help me outline a balanced schedule for today?',
      icon: LayoutDashboard,
      color: 'text-purple-500 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-500/10 border-purple-200/80 dark:border-purple-500/20',
      glow: 'group-hover:border-purple-500/50 group-hover:shadow-purple-500/10'
    },
    {
      id: 'show-tasks',
      title: "Show today's tasks",
      subtitle: "See what's on your list",
      prompt: 'Show me all my active tasks for today.',
      icon: ListTodo,
      color: 'text-emerald-500 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200/80 dark:border-emerald-500/20',
      glow: 'group-hover:border-emerald-500/50 group-hover:shadow-emerald-500/10'
    },
    {
      id: 'add-habit',
      title: 'Add a habit',
      subtitle: 'Build a new habit',
      prompt: 'Help me set up a new daily reading habit.',
      icon: Zap,
      color: 'text-amber-500 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200/80 dark:border-amber-500/20',
      glow: 'group-hover:border-amber-500/50 group-hover:shadow-amber-500/10'
    },
    {
      id: 'write-journal',
      title: "Write today's journal",
      subtitle: 'Capture your day',
      prompt: 'Guide me through a quick end-of-day reflection.',
      icon: BookOpen,
      color: 'text-rose-500 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-500/10 border-rose-200/80 dark:border-rose-500/20',
      glow: 'group-hover:border-rose-500/50 group-hover:shadow-rose-500/10'
    }
  ];

  return (
    <div className="text-center py-4 sm:py-6 space-y-6 max-w-3xl mx-auto animate-fade-in my-auto">
      {/* Icon Badge Container */}
      <div className="relative inline-block">
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-40 blur-lg animate-pulse" />
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-indigo-500/30 ring-4 ring-white dark:ring-slate-900">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Hero Headings */}
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading">
          How can I help you today?
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto leading-relaxed">
          Tell me what you want to plan, organize, track, or get done.
        </p>
      </div>

      {/* 6 Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 text-left">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => onSelectAction(action.prompt)}
              className={`p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all duration-200 shadow-xs hover:shadow-md group flex flex-col justify-between space-y-3 cursor-pointer ${action.glow}`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-xl border ${action.bg} shadow-xs`}>
                  <Icon className={`w-4 h-4 ${action.color}`} />
                </div>
                <span className="text-xs font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-[-4px] group-hover:translate-x-0 font-heading flex items-center gap-0.5 text-primary">
                  Ask <ArrowRight className="w-3 h-3" />
                </span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 font-heading group-hover:text-primary transition-colors">
                  {action.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  {action.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

