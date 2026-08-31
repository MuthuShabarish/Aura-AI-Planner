import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import {
  Target,
  Plus,
  CheckCircle2,
  Circle,
  Calendar as CalendarIcon,
  Trash2,
  Edit3,
  X,
  Filter,
  CheckSquare,
  TrendingUp,
  Award
} from 'lucide-react';

export const GoalsView = () => {
  const { goals, addGoal, updateGoal, deleteGoal, addMilestone, toggleMilestone, toggleGoalMilestone, deleteMilestone, categories = [], setShowCategoryManagerModal } = useApp();
  const toggleFn = toggleGoalMilestone || toggleMilestone;

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('2026-12-31');
  const [category, setCategory] = useState('Personal');

  // Inline Quick Add
  const [quickTitle, setQuickTitle] = useState('');
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [activeGoalForMilestone, setActiveGoalForMilestone] = useState(null);

  const filteredGoals = useMemo(() => {
    if (selectedCategory === 'All') return goals;
    return goals.filter((g) => g.category === selectedCategory);
  }, [goals, selectedCategory]);

  const overallProgress = useMemo(() => {
    if (goals.length === 0) return 0;
    const sum = goals.reduce((acc, g) => {
      const milestones = g.milestones || [];
      const completedM = milestones.filter((m) => m.completed).length;
      const prog = milestones.length > 0 ? Math.round((completedM / milestones.length) * 100) : (g.progress || 0);
      return acc + prog;
    }, 0);
    return Math.round(sum / goals.length);
  }, [goals]);

  const totalMilestonesCount = useMemo(() => {
    let total = 0;
    let completed = 0;
    goals.forEach((g) => {
      const ms = g.milestones || [];
      total += ms.length;
      completed += ms.filter((m) => m.completed).length;
    });
    return { total, completed };
  }, [goals]);

  const openCreateModal = () => {
    setEditingGoal(null);
    setTitle('');
    setDescription('');
    setTargetDate('2026-12-31');
    setCategory('Personal');
    setIsModalOpen(true);
  };

  const openEditModal = (goal) => {
    setEditingGoal(goal);
    setTitle(goal.title || '');
    setDescription(goal.description || '');
    setTargetDate(goal.targetDate || '2026-12-31');
    setCategory(goal.category || 'Personal');
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (editingGoal) {
      updateGoal(editingGoal.id, { title, description, targetDate, category });
    } else {
      addGoal({ title, description, targetDate, category, progress: 0 });
    }
    setIsModalOpen(false);
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    addGoal({ title: quickTitle.trim(), targetDate: '2026-12-31', category: 'Personal', progress: 0 });
    setQuickTitle('');
  };

  const handleAddMilestoneSubmit = (e, goalId) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim()) return;
    if (addMilestone) {
      addMilestone(goalId, newMilestoneTitle);
    }
    setNewMilestoneTitle('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-heading">Strategic Goals</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Set long-term objectives and track milestone execution</p>
        </div>
        <Button onClick={openCreateModal} variant="primary" icon={Plus}>
          Add Goal
        </Button>
      </div>

      {/* Metric Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase font-heading">Total Goals</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 font-heading">{goals.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-emerald-500 uppercase font-heading">Milestones Completed</p>
            <h3 className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 font-heading">
              {totalMilestonesCount.completed} / {totalMilestonesCount.total}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckSquare className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-amber-500 uppercase font-heading">Average Goal Progress</p>
            <h3 className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1 font-heading">{overallProgress}%</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Award className="w-5 h-5" />
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
          <Target className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Type a new strategic goal title and press Enter to quick add..."
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            className="aura-input pl-10 text-xs py-2.5 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
          />
        </div>
        <Button type="submit" variant="secondary" size="md">
          Quick Add
        </Button>
      </form>

      {/* Goals Grid */}
      {filteredGoals.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No goals created yet"
          description="Set ambitious targets and break them down into achievable milestones."
          actionLabel="Create Goal"
          onAction={openCreateModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGoals.map((goal) => {
            const milestoneList = goal.milestones || [];
            const completedMilestones = milestoneList.filter((m) => m.completed).length;
            const computedProgress = milestoneList.length > 0
              ? Math.round((completedMilestones / milestoneList.length) * 100)
              : (goal.progress || 0);

            return (
              <Card key={goal.id} className="p-6 space-y-5 flex flex-col justify-between group border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="purple">{goal.category || 'Personal'}</Badge>
                        <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1 font-heading">
                          <CalendarIcon className="w-3 h-3 text-amber-500" /> Target: {goal.targetDate || '2026-12-31'}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">{goal.title}</h3>
                      {goal.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{goal.description}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditModal(goal)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit Goal"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                        title="Delete Goal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-600 dark:text-slate-400 font-heading">Milestone Progress</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400 font-heading">{computedProgress}%</span>
                    </div>
                    <ProgressBar progress={computedProgress} color="emerald" />
                  </div>

                  {/* Milestones Checklist */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 font-heading">
                      Milestones ({completedMilestones}/{milestoneList.length})
                    </h4>

                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {milestoneList.map((m) => (
                        <div
                          key={m.id}
                          onClick={() => toggleFn && toggleFn(goal.id, m.id)}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer text-xs transition-colors group/item"
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            {m.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
                            )}
                            <span className={`truncate font-medium ${m.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'}`}>
                              {m.title}
                            </span>
                          </div>

                          {deleteMilestone && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteMilestone(goal.id, m.id);
                              }}
                              className="opacity-0 group-hover/item:opacity-100 p-1 text-slate-400 hover:text-red-500 rounded transition-opacity"
                              title="Delete Milestone"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Add Quick Milestone Input */}
                    <form onSubmit={(e) => handleAddMilestoneSubmit(e, goal.id)} className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="+ Add milestone step..."
                        value={activeGoalForMilestone === goal.id ? newMilestoneTitle : ''}
                        onFocus={() => setActiveGoalForMilestone(goal.id)}
                        onChange={(e) => setNewMilestoneTitle(e.target.value)}
                        className="aura-input py-1 text-xs text-slate-900 dark:text-white"
                      />
                      <Button type="submit" variant="secondary" size="sm">Add</Button>
                    </form>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingGoal ? 'Edit Goal' : 'Add New Goal'}
        subtitle={editingGoal ? 'Update goal title and target completion date' : 'Set a new strategic target objective'}
        footer={
          <>
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" form="goal-form" variant="primary">
              {editingGoal ? 'Save Changes' : 'Create Goal'}
            </Button>
          </>
        }
      >
        <form id="goal-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Goal Title</label>
            <input
              type="text"
              placeholder="e.g. Master Full Stack Development"
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
              placeholder="Why does this goal matter to you?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="aura-input text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
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
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Target Date</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="aura-input text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};