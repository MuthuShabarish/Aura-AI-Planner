import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { CheckSquare, Zap, Target, Calendar, FileText, Plus } from 'lucide-react';

export const QuickAddModal = ({ isOpen, onClose }) => {
  const { addTask, addHabit, addGoal, addEvent, addNote, addTimelineEntry, categories = [], setShowCategoryManagerModal } = useApp();
  const [activeType, setActiveType] = useState('task'); // 'task' | 'habit' | 'goal' | 'event' | 'note'

  const handleCategorySelect = (e, setter) => {
    const val = e.target.value;
    if (val === '__MANAGE_CATEGORIES__') {
      setShowCategoryManagerModal(true);
    } else {
      setter(val);
    }
  };

  // Task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState('Personal');
  const [taskPriority, setTaskPriority] = useState('Medium');
  const [taskDueDate, setTaskDueDate] = useState(new Date().toISOString().slice(0, 10));

  // Habit form state
  const [habitName, setHabitName] = useState('');
  const [habitTargetDays, setHabitTargetDays] = useState(5);
  const [habitCategory, setHabitCategory] = useState('Health');

  // Goal form state
  const [goalTitle, setGoalTitle] = useState('');
  const [goalCategory, setGoalCategory] = useState('Personal');
  const [goalTargetDate, setGoalTargetDate] = useState('');

  // Event form state
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString().slice(0, 10));
  const [eventTime, setEventTime] = useState('10:00 AM');
  const [eventCategory, setEventCategory] = useState('Work');

  // Note form state
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeType === 'task') {
      if (!taskTitle.trim()) return;
      addTask({ title: taskTitle, category: taskCategory, priority: taskPriority, dueDate: taskDueDate });
      setTaskTitle('');
    } else if (activeType === 'habit') {
      if (!habitName.trim()) return;
      addHabit({ name: habitName, targetDays: Number(habitTargetDays), category: habitCategory });
      setHabitName('');
    } else if (activeType === 'goal') {
      if (!goalTitle.trim()) return;
      addGoal({ title: goalTitle, category: goalCategory, targetDate: goalTargetDate || '2026-12-31' });
      setGoalTitle('');
    } else if (activeType === 'event') {
      if (!eventTitle.trim()) return;
      addEvent({ title: eventTitle, date: eventDate, startTime: eventTime, category: eventCategory });
      setEventTitle('');
    } else if (activeType === 'note') {
      if (!noteTitle.trim() && !noteContent.trim()) return;
      if (addNote) {
        addNote({ title: noteTitle || 'Untitled Note', content: noteContent, category: 'Personal' });
      } else {
        addTimelineEntry({ type: 'Note', title: noteTitle || 'Untitled Note', content: noteContent });
      }
      setNoteTitle('');
      setNoteContent('');
    }
    onClose();
  };

  const types = [
    { id: 'task', label: 'Task', icon: CheckSquare },
    { id: 'habit', label: 'Habit', icon: Zap },
    { id: 'goal', label: 'Goal', icon: Target },
    { id: 'event', label: 'Event', icon: Calendar },
    { id: 'note', label: 'Note', icon: FileText }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Quick Create" subtitle="Add a new item to your planner">
      {/* Type Selector Tabs */}
      <div className="grid grid-cols-5 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-5">
        {types.map((type) => {
          const Icon = type.icon;
          const isActive = activeType === type.id;
          return (
            <button
              key={type.id}
              onClick={() => setActiveType(type.id)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-bold transition-all font-heading ${
                isActive
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4 mb-1" />
              <span>{type.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {activeType === 'task' && (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Task Title</label>
              <input
                type="text"
                placeholder="What needs to be done?"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                autoFocus
                className="aura-input text-slate-900 dark:text-white"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <select value={taskCategory} onChange={(e) => handleCategorySelect(e, setTaskCategory)} className="aura-input text-slate-900 dark:text-white">
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                  <option value="__MANAGE_CATEGORIES__">+ Manage Categories...</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                <select value={taskPriority} onChange={(e) => setTaskPriority(e.target.value)} className="aura-input text-slate-900 dark:text-white">
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Due Date</label>
                <input
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="aura-input text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </>
        )}

        {activeType === 'habit' && (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Habit Name</label>
              <input
                type="text"
                placeholder="e.g. Daily Meditation, Read 20 mins"
                value={habitName}
                onChange={(e) => setHabitName(e.target.value)}
                autoFocus
                className="aura-input text-slate-900 dark:text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Target Days / Week</label>
                <input
                  type="number"
                  min="1"
                  max="7"
                  value={habitTargetDays}
                  onChange={(e) => setHabitTargetDays(e.target.value)}
                  className="aura-input text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <select value={habitCategory} onChange={(e) => handleCategorySelect(e, setHabitCategory)} className="aura-input text-slate-900 dark:text-white">
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                  <option value="__MANAGE_CATEGORIES__">+ Manage Categories...</option>
                </select>
              </div>
            </div>
          </>
        )}

        {activeType === 'goal' && (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Goal Title</label>
              <input
                type="text"
                placeholder="e.g. Master React 19, Run 5k"
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                autoFocus
                className="aura-input text-slate-900 dark:text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <select value={goalCategory} onChange={(e) => handleCategorySelect(e, setGoalCategory)} className="aura-input text-slate-900 dark:text-white">
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
                  value={goalTargetDate}
                  onChange={(e) => setGoalTargetDate(e.target.value)}
                  className="aura-input text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </>
        )}

        {activeType === 'event' && (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Event Title</label>
              <input
                type="text"
                placeholder="e.g. Project Sync, Doctor Appointment"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                autoFocus
                className="aura-input text-slate-900 dark:text-white"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Date</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="aura-input text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Time</label>
                <input
                  type="text"
                  placeholder="10:00 AM"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="aura-input text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <select value={eventCategory} onChange={(e) => handleCategorySelect(e, setEventCategory)} className="aura-input text-slate-900 dark:text-white">
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                  <option value="__MANAGE_CATEGORIES__">+ Manage Categories...</option>
                </select>
              </div>
            </div>
          </>
        )}

        {activeType === 'note' && (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Note Title</label>
              <input
                type="text"
                placeholder="Note title..."
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                autoFocus
                className="aura-input text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Content</label>
              <textarea
                rows={3}
                placeholder="Write your note here..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="aura-input text-slate-900 dark:text-white"
              />
            </div>
          </>
        )}

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" icon={Plus}>Create {activeType}</Button>
        </div>
      </form>
    </Modal>
  );
};