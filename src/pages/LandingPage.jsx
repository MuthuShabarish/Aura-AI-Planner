import React, { useState } from 'react';
import {
  Sparkles,
  CheckSquare,
  Zap,
  Target,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  LayoutDashboard,
  BookOpen,
  FileText,
  BarChart3,
  Check,
  Star,
  Layers,
  MousePointer,
  Lock
} from 'lucide-react';

export const LandingPage = ({ navigate }) => {
  const [activePreviewTab, setActivePreviewTab] = useState('schedule');

  const features = [
    {
      id: 'tasks',
      title: 'Tasks',
      subtitle: 'Organize what needs to get done.',
      description: 'Prioritize daily tasks, track duration, and clear your to-do list with ease.',
      icon: CheckSquare,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20'
    },
    {
      id: 'habits',
      title: 'Habits',
      subtitle: 'Build consistency one day at a time.',
      description: 'Form lasting habits with daily streak tracking and visual completion logs.',
      icon: Zap,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20'
    },
    {
      id: 'goals',
      title: 'Goals',
      subtitle: 'Track progress toward what matters.',
      description: 'Set ambitious goals, break them into milestones, and monitor your visual progress.',
      icon: Target,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20'
    },
    {
      id: 'schedule',
      title: 'Schedule',
      subtitle: 'See your day clearly.',
      description: 'Plan your day hour-by-hour with a dynamic, color-coded timeline grid.',
      icon: Calendar,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10 border-sky-500/20'
    },
    {
      id: 'focus',
      title: 'Focus Mode',
      subtitle: 'Protect your time and attention.',
      description: 'Eliminate distractions with custom Pomodoro focus timers and ambient noise.',
      icon: Clock,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0f1013] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* Ambient Radial Gradient Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-indigo-600/20 via-purple-600/10 to-transparent blur-[140px] rounded-full" />
        <div className="absolute top-[40%] -left-[10%] w-[500px] h-[500px] bg-emerald-600/10 blur-[140px] rounded-full" />
        <div className="absolute top-[60%] -right-[10%] w-[500px] h-[500px] bg-indigo-600/10 blur-[140px] rounded-full" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0f1013]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-xl text-white tracking-tight leading-none flex items-center gap-1.5 font-heading">
                AURA <span className="text-indigo-400 text-sm">✦</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-0.5 font-heading">
                Personal Planner
              </p>
            </div>
          </div>

          {/* Navigation CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/sign-in')}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-all font-heading cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/sign-up')}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2 font-heading cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center flex-1">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-8 font-heading animate-fade-in">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Quiet, Focused & Calm Productivity</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight font-heading leading-[1.1] max-w-4xl mx-auto">
          Plan your day.<br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400 bg-clip-text text-transparent">
            Focus on what matters.
          </span>
        </h1>

        {/* Supporting text */}
        <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-sans">
          Your personal planner for tasks, habits, goals, schedules and focused work, all in one calm workspace.
        </p>

        {/* Primary & Secondary CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate('/sign-up')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:brightness-110 transition-all shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-2.5 font-heading cursor-pointer"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/sign-in')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-bold text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 transition-all font-heading cursor-pointer"
          >
            Sign In to Account
          </button>
        </div>

        {/* Trust Pills */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-400 font-heading">
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Local Device Privacy
          </span>
          <span className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" /> Real-time Schedule Sync
          </span>
          <span className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-400" /> Zero Trackers or Cloud Ads
          </span>
        </div>

        {/* Visual Hero Dashboard Preview (Section 4) */}
        <div className="mt-16 max-w-5xl mx-auto relative group">
          {/* Glowing Border Backdrop */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 opacity-30 blur-xl group-hover:opacity-50 transition-opacity" />

          {/* Browser Window Card */}
          <div className="relative rounded-3xl border border-white/15 bg-[#18191c] overflow-hidden shadow-2xl shadow-indigo-950/80">
            {/* Window Top Bar */}
            <div className="px-5 py-3.5 bg-[#141518] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-3 text-xs font-bold text-slate-400 font-heading">
                  AURA Personal Planner — Workspace
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-heading">
                  Live App Workspace
                </span>
              </div>
            </div>

            {/* Inner Dashboard Layout Preview */}
            <div className="p-4 sm:p-6 bg-[#18191c] text-left grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Mini Sidebar */}
              <div className="lg:col-span-3 space-y-1.5 hidden sm:block border-r border-white/10 pr-4">
                <div className="flex items-center gap-2.5 px-3 py-2 text-white font-bold text-xs font-heading">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>AURA Planner</span>
                </div>
                <div className="space-y-1 pt-2">
                  <div className="px-3 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white flex items-center gap-2.5 font-heading">
                    <LayoutDashboard className="w-4 h-4" /> My Day
                  </div>
                  <div className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 flex items-center gap-2.5 font-heading">
                    <Calendar className="w-4 h-4" /> Schedule
                  </div>
                  <div className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 flex items-center gap-2.5 font-heading">
                    <CheckSquare className="w-4 h-4" /> Tasks <span className="ml-auto text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-bold">4</span>
                  </div>
                  <div className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 flex items-center gap-2.5 font-heading">
                    <Zap className="w-4 h-4" /> Habits <span className="ml-auto text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">4/4</span>
                  </div>
                  <div className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 flex items-center gap-2.5 font-heading">
                    <Target className="w-4 h-4" /> Goals
                  </div>
                  <div className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 flex items-center gap-2.5 font-heading">
                    <Clock className="w-4 h-4" /> Focus Mode
                  </div>
                </div>
              </div>

              {/* Main Workspace Preview */}
              <div className="lg:col-span-9 space-y-4">
                {/* Greeting Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div>
                    <h3 className="text-base font-bold text-white font-heading">Good afternoon, Alex 👋</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Here's your personal space for today. Stay focused and make progress.</p>
                  </div>
                  <span className="px-3 py-1.5 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold self-start sm:self-center font-heading">
                    ☀️ Sun, Aug 30
                  </span>
                </div>

                {/* 3 Interactive Feature Modules Preview */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Schedule Widget */}
                  <div className="p-3.5 rounded-2xl bg-[#141518] border border-white/10 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200 font-heading flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-sky-400" /> Today's Schedule
                      </span>
                      <span className="text-[10px] font-bold text-sky-400">3 Events</span>
                    </div>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-200">
                        <p className="font-bold">UI/UX Design Study</p>
                        <p className="text-[10px] opacity-80">8:30 AM – 10:00 AM</p>
                      </div>
                      <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-200">
                        <p className="font-bold">College Lecture</p>
                        <p className="text-[10px] opacity-80">10:30 AM – 12:30 PM</p>
                      </div>
                    </div>
                  </div>

                  {/* Tasks Widget */}
                  <div className="p-3.5 rounded-2xl bg-[#141518] border border-white/10 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200 font-heading flex items-center gap-1.5">
                        <CheckSquare className="w-3.5 h-3.5 text-indigo-400" /> Priority Tasks
                      </span>
                      <span className="text-[10px] font-bold text-indigo-400">4 Active</span>
                    </div>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                        <div className="w-3.5 h-3.5 rounded bg-indigo-500 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                        <span className="line-through text-slate-400 truncate">Read Atomic Habits</span>
                      </div>
                      <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                        <div className="w-3.5 h-3.5 rounded border border-indigo-400" />
                        <span className="text-slate-200 font-semibold truncate">Complete UI case study</span>
                      </div>
                    </div>
                  </div>

                  {/* Habits & Focus Widget */}
                  <div className="p-3.5 rounded-2xl bg-[#141518] border border-white/10 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200 font-heading flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-emerald-400" /> Habit Streaks
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400">4/4 Done</span>
                    </div>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 flex items-center justify-between">
                        <span className="font-bold">Morning Meditation</span>
                        <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded font-extrabold">🔥 14d</span>
                      </div>
                      <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 flex items-center justify-between">
                        <span className="font-bold">Hydrate (2L Water)</span>
                        <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded font-extrabold">🔥 8d</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section (Section 5) */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
            Everything you need for intentional work
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Designed specifically for clean, calm, and uninterrupted focus.
          </p>
        </div>

        {/* 5 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                className="p-6 rounded-3xl border border-white/10 bg-[#18191c] hover:border-indigo-500/50 transition-all duration-300 group space-y-4 shadow-lg shadow-black/20"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${feat.bg}`}>
                  <Icon className={`w-6 h-6 ${feat.color}`} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white font-heading group-hover:text-indigo-400 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs font-bold text-indigo-400 font-heading">{feat.subtitle}</p>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {feat.description}
                </p>
              </div>
            );
          })}

          {/* 6th Card: Local Storage Privacy */}
          <div className="p-6 rounded-3xl border border-emerald-500/30 bg-emerald-950/20 hover:border-emerald-500/60 transition-all duration-300 space-y-4 shadow-lg shadow-black/20">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white font-heading">
                100% Local Privacy
              </h3>
              <p className="text-xs font-bold text-emerald-400 font-heading">Zero trackers or cloud telemetry.</p>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              All tasks, habits, journal entries, and schedule entries remain strictly on your local browser.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-[#0c0d0f] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-heading">AURA Personal Planner</h4>
              <p className="text-xs text-slate-500">Designed for calm and focused productivity.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 font-heading">
            <button onClick={() => navigate('/sign-in')} className="hover:text-white transition-colors cursor-pointer">
              Sign In
            </button>
            <span>•</span>
            <button onClick={() => navigate('/sign-up')} className="hover:text-white transition-colors cursor-pointer">
              Create Account
            </button>
          </div>

          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} AURA Planner. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
