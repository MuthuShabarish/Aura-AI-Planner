import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { ProgressBar } from '../components/ui/ProgressBar';
import {
  Zap,
  Plus,
  CheckCircle2,
  Circle,
  Flame,
  Trash2,
  Edit3,
  Filter,
  Trophy,
  Activity
} from 'lucide-react';

const getWeekDays = () => {
  const now = new Date();
  const currentDayOfWeek = now.getDay();
  const distanceToMon = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + distanceToMon);

  const days = [];
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayStr = now.toISOString().slice(0, 10);

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = d.toISOString().slice(0, 10);
    days.push({
      name: dayNames[i],
      dateStr: dateStr,
      isToday: dateStr === todayStr
    });
  }
  return days;
};

export const HabitsView = () => {
  const { habits, addHabit, updateHabit, deleteHabit, toggleHabit, categories = [], setShowCategoryManagerModal } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [targetDays, setTargetDays] = useState(5);
  const [category, setCategory] = useState('Health');

  // Inline Quick Add
  const [quickTitle, setQuickTitle] = useState('');

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const weekDays = useMemo(() => getWeekDays(), []);

  const completedTodayCount = useMemo(() => {
    return habits.filter((h) => (h.completedDates || []).includes(todayStr)).length;
  }, [habits, todayStr]);

  const maxStreak = useMemo(() => {
    if (habits.length === 0) return 0;
    return Math.max(...habits.map((h) => h.streak || 0));
  }, [habits]);

  const filteredHabits = useMemo(() => {
    if (selectedCategory === 'All') return habits;
    return habits.filter((h) => h.category === selectedCategory);
  }, [habits, selectedCategory]);

  const openCreateModal = () => {
    setEditingHabit(null);
    setTitle('');
    setTargetDays(5);
    setCategory('Health');
    setIsModalOpen(true);
  };

  const openEditModal = (habit) => {
    setEditingHabit(habit);
    setTitle(habit.title || habit.name || '');
    setTargetDays(habit.targetDays || 5);
    setCategory(habit.category || 'Health');
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (editingHabit) {
      updateHabit(editingHabit.id, { title, targetDays: Number(targetDays), category });
    } else {
      addHabit({ title, targetDays: Number(targetDays), category, completedDates: [todayStr] });
    }
    setIsModalOpen(false);
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    addHabit({ title: quickTitle.trim(), targetDays: 5, category: 'Health', completedDates: [todayStr] });
    setQuickTitle('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-heading">Habit Tracker</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Build daily consistency and track long-term routines</p>
        </div>
        <Button onClick={openCreateModal} variant="primary" icon={Plus}>
          Add Habit
        </Button>
      </div>

      {/* Metric Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase font-heading">Total Habits</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 font-heading">{habits.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-emerald-500 uppercase font-heading">Completed Today</p>
            <h3 className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 font-heading">
              {completedTodayCount} / {habits.length}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-amber-500 uppercase font-heading">Best Active Streak</p>
            <h3 className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1 font-heading">{maxStreak} Days</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Trophy className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Category Filter Chips */}
      <Card className="p-4 flex items-center justify-between gap-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1 font-heading">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {['All', ...categories.map((c) => c.name)].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all font-heading cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-primary text-white shadow-primary'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
          <button
            onClick={() => setShowCategoryManagerModal(true)}
            className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-auto cursor-pointer"
          >
            + Manage
          </button>
        </div>
      </Card>

      {/* Quick Add Inline Form */}
      <form onSubmit={handleQuickAdd} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Zap className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Type a new habit name and press Enter to quick add..."
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            className="aura-input pl-10 text-xs py-2.5 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
          />
        </div>
        <Button type="submit" variant="secondary" size="md">
          Quick Add
        </Button>
      </form>

      {/* Habits List / Cards */}
      {filteredHabits.length === 0 ? (
        <EmptyState
          icon={Zap}
          title="No habits tracked yet"
          description="Start building positive routines today by adding your first habit!"
          actionLabel="Create Habit"
          onAction={openCreateModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredHabits.map((habit) => {
            const completedDates = habit.completedDates || [];
            const isDoneToday = completedDates.includes(todayStr);
            const streakCount = habit.streak || 0;
            const targetCount = Array.isArray(habit.targetDays)
              ? habit.targetDays.length
              : (Number(habit.targetDays) > 0 ? Number(habit.targetDays) : 5);
            
            const targetLabel = targetCount === 7 ? '7 days/week target' : `${targetCount} days/week target`;
            const weeklyProgress = Math.min(Math.round((completedDates.length / targetCount) * 100), 100);

            return (
              <Card key={habit.id} className="p-5 flex flex-col justify-between space-y-4 group border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleHabit(habit.id, todayStr)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all cursor-pointer shrink-0 ${
                        isDoneToday
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30 ring-2 ring-emerald-500/20'
                          : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40'
                      }`}
                      title={isDoneToday ? 'Mark today uncompleted' : 'Mark today completed'}
                    >
                      <Zap className="w-5 h-5" />
                    </button>
                    <div className="space-y-0.5">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading tracking-tight leading-snug">{habit.title || habit.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                        <span className="font-semibold text-slate-600 dark:text-slate-300">{habit.category || 'Health'}</span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span>{targetLabel}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={streakCount > 0 ? 'green' : 'gray'} icon={Flame}>
                      {streakCount} day streak
                    </Badge>
                    <button
                      onClick={() => openEditModal(habit)}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Edit Habit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete Habit"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-500 dark:text-slate-400 font-heading">Weekly Target Progress</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 font-heading">{completedDates.length} / {targetCount} days</span>
                  </div>
                  <ProgressBar progress={weeklyProgress} color="emerald" height="h-1.5" />
                </div>

                {/* 7-Day Completion Dots Grid */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-slate-400 text-[11px] font-heading">This Week</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-[11px]">
                      {completedDates.length} {completedDates.length === 1 ? 'completion' : 'completions'}
                    </span>
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {weekDays.map((day) => {
                      const isCompleted = completedDates.includes(day.dateStr);
                      return (
                        <div key={day.dateStr} className="flex flex-col items-center gap-1">
                          <span className={`text-[10px] font-bold font-heading ${day.isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
                            {day.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleHabit(habit.id, day.dateStr)}
                            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                              isCompleted
                                ? 'bg-emerald-500 text-white shadow-xs'
                                : day.isToday
                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-indigo-400/50 hover:bg-slate-200 dark:hover:bg-slate-700'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                            title={`${day.name} (${day.dateStr}): ${isCompleted ? 'Click to untick' : 'Click to tick'}`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              <Circle className="w-3.5 h-3.5 opacity-40" />
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add / Edit Habit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingHabit ? 'Edit Habit' : 'Add New Habit'}
        subtitle={editingHabit ? 'Modify habit name and frequency target' : 'Track a new daily or weekly routine'}
        footer={
          <>
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" form="habit-form" variant="primary">
              {editingHabit ? 'Save Changes' : 'Create Habit'}
            </Button>
          </>
        }
      >
        <form id="habit-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Habit Title</label>
            <input
              type="text"
              placeholder="e.g. Read 20 mins, Daily Meditation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="aura-input text-slate-900 dark:text-white"
              required
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Target Days / Week</label>
              <input
                type="number"
                min="1"
                max="7"
                value={targetDays}
                onChange={(e) => setTargetDays(e.target.value)}
                className="aura-input text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => {
                  if (e.target.value === '__MANAGE_CATEGORIES__') {
                    setShowCategoryManagerModal(true);
                  } else {
                    setCategory(e.target.value);
                  }
                }}
                className="aura-input text-slate-900 dark:text-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
                <option value="__MANAGE_CATEGORIES__">+ Manage Categories...</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};