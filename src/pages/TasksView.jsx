import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import {
  CheckSquare,
  CheckCircle2,
  Circle,
  Plus,
  Search,
  Trash2,
  Edit3,
  Copy,
  Calendar as CalendarIcon,
  Filter,
  ArrowUpDown,
  Clock,
  AlertCircle
} from 'lucide-react';

export const TasksView = () => {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    duplicateTask,
    toggleTask,
    categories = [],
    setShowCategoryManagerModal
  } = useApp();

  const [activeTabFilter, setActiveTabFilter] = useState('All'); // 'All' | 'Today' | 'Upcoming' | 'Completed'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Personal');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState(new Date().toISOString().slice(0, 10));

  // Quick Inline Task State
  const [quickTitle, setQuickTitle] = useState('');

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const counts = useMemo(() => {
    return {
      all: tasks.length,
      today: tasks.filter((t) => t.dueDate === todayStr && !t.completed).length,
      upcoming: tasks.filter((t) => t.dueDate > todayStr && !t.completed).length,
      completed: tasks.filter((t) => t.completed).length
    };
  }, [tasks, todayStr]);

  const openCreateModal = () => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
    setCategory('Personal');
    setPriority('Medium');
    setDueDate(todayStr);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setTitle(task.title || '');
    setDescription(task.description || '');
    setCategory(task.category || 'Personal');
    setPriority(task.priority || 'Medium');
    setDueDate(task.dueDate || todayStr);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!title.trim()) return;
    if (editingTask) {
      updateTask(editingTask.id, { title, description, category, priority, dueDate });
    } else {
      addTask({ title, description, category, priority, dueDate });
    }
    setIsModalOpen(false);
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    addTask({ title: quickTitle.trim(), category: 'Personal', priority: 'Medium', dueDate: todayStr });
    setQuickTitle('');
  };

  const visibleTasks = useMemo(() => {
    let result = tasks;

    if (activeTabFilter === 'Today') {
      result = result.filter((t) => t.dueDate === todayStr && !t.completed);
    } else if (activeTabFilter === 'Upcoming') {
      result = result.filter((t) => t.dueDate > todayStr && !t.completed);
    } else if (activeTabFilter === 'Completed') {
      result = result.filter((t) => t.completed);
    }

    if (selectedCategory !== 'All') {
      result = result.filter((t) => t.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((t) =>
        t.title?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.category?.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'priority') {
      const weight = { High: 3, Medium: 2, Low: 1 };
      result = [...result].sort((a, b) => (weight[b.priority] || 0) - (weight[a.priority] || 0));
    } else if (sortBy === 'date') {
      result = [...result].sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''));
    }

    return result;
  }, [tasks, activeTabFilter, selectedCategory, searchQuery, sortBy, todayStr]);

  const getPriorityBadgeVariant = (p) => {
    if (p === 'High') return 'pink';
    if (p === 'Medium') return 'orange';
    return 'gray';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-heading">Tasks & To-Dos</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Organize your daily tasks, set priorities, and track progress</p>
        </div>
        <Button onClick={openCreateModal} variant="primary" icon={Plus}>
          Add Task
        </Button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card
          onClick={() => setActiveTabFilter('All')}
          className={`p-4 border transition-all cursor-pointer shadow-xs ${
            activeTabFilter === 'All'
              ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/20 dark:bg-indigo-950/20'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300'
          }`}
        >
          <p className="text-[11px] font-semibold text-slate-400 uppercase font-heading">Total Tasks</p>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 font-heading">{counts.all}</h3>
        </Card>
        <Card
          onClick={() => setActiveTabFilter('Today')}
          className={`p-4 border transition-all cursor-pointer shadow-xs ${
            activeTabFilter === 'Today'
              ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/20 dark:bg-indigo-950/20'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300'
          }`}
        >
          <p className="text-[11px] font-semibold text-indigo-500 uppercase font-heading">Due Today</p>
          <h3 className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1 font-heading">{counts.today}</h3>
        </Card>
        <Card
          onClick={() => setActiveTabFilter('Upcoming')}
          className={`p-4 border transition-all cursor-pointer shadow-xs ${
            activeTabFilter === 'Upcoming'
              ? 'border-sky-500 ring-2 ring-sky-500/20 bg-sky-50/20 dark:bg-sky-950/20'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-sky-300'
          }`}
        >
          <p className="text-[11px] font-semibold text-sky-500 uppercase font-heading">Upcoming</p>
          <h3 className="text-2xl font-extrabold text-sky-600 dark:text-sky-400 mt-1 font-heading">{counts.upcoming}</h3>
        </Card>
        <Card
          onClick={() => setActiveTabFilter('Completed')}
          className={`p-4 border transition-all cursor-pointer shadow-xs ${
            activeTabFilter === 'Completed'
              ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-950/20'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-300'
          }`}
        >
          <p className="text-[11px] font-semibold text-emerald-500 uppercase font-heading">Completed</p>
          <h3 className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 font-heading">{counts.completed}</h3>
        </Card>
      </div>

      {/* Filter Toolbar & Search */}
      <Card className="p-4 space-y-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Clean Status Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            {['All', 'Today', 'Upcoming', 'Completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTabFilter(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold font-heading transition-all cursor-pointer ${
                  activeTabFilter === tab
                    ? 'bg-white dark:bg-slate-900 text-primary shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-60">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="aura-input pl-9 text-xs py-2"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="aura-input text-xs py-2 w-36"
            >
              <option value="default">Sort by Default</option>
              <option value="priority">Priority</option>
              <option value="date">Due Date</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
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
          <Plus className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Type a new task title and press Enter to quick add..."
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            className="aura-input pl-10 text-xs py-2.5 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
          />
        </div>
        <Button type="submit" variant="secondary" size="md">
          Quick Add
        </Button>
      </form>

      {/* Task List Rows */}
      {visibleTasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No tasks found"
          description="You don't have any tasks matching this filter. Create a task to get started!"
          actionLabel="Create Task"
          onAction={openCreateModal}
        />
      ) : (
        <div className="space-y-2.5">
          {visibleTasks.map((task) => (
            <Card
              key={task.id}
              className="p-4 flex items-center justify-between gap-4 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all group border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs"
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <button
                  onClick={() => toggleTask(task.id)}
                  className="text-slate-400 hover:text-indigo-600 transition-colors shrink-0 cursor-pointer"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 fill-indigo-100 dark:fill-indigo-950" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <h4 className={`text-sm font-bold truncate font-heading ${task.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                    {task.title}
                  </h4>
                  {task.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{task.description}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Badge variant={getPriorityBadgeVariant(task.priority)}>
                  {task.priority || 'Medium'}
                </Badge>
                <Badge variant="blue">{task.category || 'Personal'}</Badge>

                <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span>{task.dueDate === todayStr ? 'Today' : task.dueDate || 'No date'}</span>
                </div>

                {/* Row Actions */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(task)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Edit Task"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => duplicateTask(task.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Duplicate Task"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    title="Delete Task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTask ? 'Edit Task' : 'Add New Task'}
        subtitle={editingTask ? 'Update task details and due date' : 'Create a new task for your planner'}
        footer={
          <>
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" form="task-form" variant="primary">
              {editingTask ? 'Save Changes' : 'Create Task'}
            </Button>
          </>
        }
      >
        <form id="task-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Task Title</label>
            <input
              type="text"
              placeholder="e.g. Complete UI case study"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="aura-input text-slate-900 dark:text-white"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Description (Optional)</label>
            <textarea
              rows={2}
              placeholder="Add extra context or details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="aura-input text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
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

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)} className="aura-input text-slate-900 dark:text-white">
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="aura-input text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};