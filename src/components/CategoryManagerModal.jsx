import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Plus, Edit3, Trash2, Check, X, RotateCcw, Tag } from 'lucide-react';

export const CategoryManager = ({ embedded = false }) => {
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    resetCategoriesToDefault,
    tasks = [],
    habits = [],
    goals = [],
    notes = [],
    schedule = []
  } = useApp();

  // Create form state
  const [newCatName, setNewCatName] = useState('');

  // Edit form state
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const getItemCount = (categoryName) => {
    const taskCount = tasks.filter((t) => t.category === categoryName).length;
    const habitCount = habits.filter((h) => h.category === categoryName).length;
    const goalCount = goals.filter((g) => g.category === categoryName).length;
    const noteCount = notes.filter((n) => n.category === categoryName).length;
    const scheduleCount = schedule.filter((s) => s.category === categoryName).length;
    return taskCount + habitCount + goalCount + noteCount + scheduleCount;
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const result = addCategory({ name: newCatName.trim() });
    if (result) {
      setNewCatName('');
    }
  };

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  const saveEdit = (id) => {
    if (!editName.trim()) return;
    updateCategory(id, { name: editName.trim() });
    cancelEdit();
  };

  const handleDelete = (cat) => {
    if (categories.length <= 1) return;
    deleteCategory(cat.id);
  };

  return (
    <div className="space-y-6">
      {/* Create New Category Form */}
      <div className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-heading">
          Add Custom Category
        </label>
        <form onSubmit={handleAddSubmit} className="flex items-center gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Enter category name (e.g. Side Project, Fitness, Finance)..."
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="aura-input w-full text-sm py-3 px-4 text-slate-900 dark:text-white bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            icon={Plus}
            disabled={!newCatName.trim()}
            className="py-3 px-5 text-xs font-bold"
          >
            Add Category
          </Button>
        </form>
      </div>

      {/* Category List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-heading">
            Your Categories ({categories.length})
          </h4>
          {categories.length > 0 && (
            <button
              onClick={resetCategoriesToDefault}
              className="text-xs text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Defaults
            </button>
          )}
        </div>

        <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
          {categories.map((cat) => {
            const isEditing = editingId === cat.id;
            const itemUsageCount = getItemCount(cat.name);

            if (isEditing) {
              return (
                <div
                  key={cat.id}
                  className="p-3 bg-indigo-50/60 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800/60 flex items-center gap-3 animate-fade-in"
                >
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="aura-input flex-1 text-sm py-2 px-3 text-slate-900 dark:text-white"
                    autoFocus
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => saveEdit(cat.id)}
                      icon={Check}
                      disabled={!editName.trim()}
                    >
                      Save
                    </Button>
                    <Button size="sm" variant="ghost" onClick={cancelEdit} icon={X}>
                      Cancel
                    </Button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={cat.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white font-heading leading-tight">
                      {cat.name}
                    </h5>
                    <span className="text-[11px] font-medium text-slate-400">
                      {itemUsageCount} {itemUsageCount === 1 ? 'item' : 'items'} linked
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => startEdit(cat)}
                    className="p-2 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Edit category name"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(cat)}
                    disabled={categories.length <= 1}
                    className={`p-2 rounded-lg transition-colors cursor-pointer ${
                      categories.length <= 1
                        ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                        : 'text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                    }`}
                    title={categories.length <= 1 ? 'Cannot delete the only remaining category' : 'Delete category'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const CategoryManagerModal = () => {
  const { showCategoryManagerModal, setShowCategoryManagerModal } = useApp();

  return (
    <Modal
      isOpen={showCategoryManagerModal}
      onClose={() => setShowCategoryManagerModal(false)}
      title="Manage Custom Categories"
      subtitle="Add, edit, or delete custom categories across your planner"
    >
      <CategoryManager />
    </Modal>
  );
};
