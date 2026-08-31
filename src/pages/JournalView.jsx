import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  BookOpen,
  Save,
  Trash2,
  Plus,
  Sparkles,
  Search,
  PenTool,
  Calendar as CalendarIcon,
  Smile,
  Flame
} from 'lucide-react';

export const JournalView = () => {
  const { timeline, addTimelineEntry, updateTimelineEntry, deleteTimelineEntry } = useApp();

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [entryTitle, setEntryTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState('😊 Focused');
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const moods = ['😃 Productive', '😊 Focused', '😐 Calm', '😔 Tired', '🏃 Active', '💡 Inspired'];

  const reflectionPrompts = [
    '✨ What made today special?',
    '🎯 What did I achieve today?',
    '🙏 What am I grateful for?',
    '💡 What lesson did I learn?'
  ];

  const journalEntries = useMemo(() => {
    return timeline.filter((e) => e.type === 'Journal' || e.type === 'Note');
  }, [timeline]);

  const currentMonthStr = useMemo(() => new Date().toISOString().slice(0, 7), []);

  const entriesThisMonth = useMemo(() => {
    return journalEntries.filter((e) => e.date?.startsWith(currentMonthStr)).length;
  }, [journalEntries, currentMonthStr]);

  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return journalEntries;
    const q = searchQuery.toLowerCase();
    return journalEntries.filter((e) =>
      e.title?.toLowerCase().includes(q) ||
      e.content?.toLowerCase().includes(q) ||
      e.mood?.toLowerCase().includes(q)
    );
  }, [journalEntries, searchQuery]);

  const wordCount = useMemo(() => {
    if (!content.trim()) return 0;
    return content.trim().split(/\s+/).length;
  }, [content]);

  const handleSave = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!content.trim() && !entryTitle.trim()) return;

    if (editingEntryId) {
      updateTimelineEntry(editingEntryId, {
        title: entryTitle || 'Daily Thoughts',
        content,
        mood: selectedMood,
        date: selectedDate
      });
      setEditingEntryId(null);
    } else {
      addTimelineEntry({
        type: 'Journal',
        title: entryTitle || "Today's Thoughts",
        content,
        mood: selectedMood,
        date: selectedDate
      });
    }

    setEntryTitle('');
    setContent('');
  };

  const loadEntryForEdit = (entry) => {
    setEditingEntryId(entry.id);
    setEntryTitle(entry.title || '');
    setContent(entry.content || '');
    setSelectedMood(entry.mood || '😊 Focused');
    setSelectedDate(entry.date || new Date().toISOString().slice(0, 10));
  };

  const startNewEntry = () => {
    setEditingEntryId(null);
    setEntryTitle('');
    setContent('');
    setSelectedMood('😊 Focused');
    setSelectedDate(new Date().toISOString().slice(0, 10));
  };

  const applyPrompt = (promptText) => {
    const textToInsert = `\n### ${promptText}\n`;
    setContent((prev) => prev + textToInsert);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Date Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-heading">Journal & Reflections</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Record daily thoughts, reflect on progress, and cultivate mindfulness</p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="aura-input py-1.5 text-xs w-36 text-slate-900 dark:text-white"
          />
          <Button onClick={startNewEntry} variant="primary" icon={Plus}>
            New Entry
          </Button>
        </div>
      </div>

      {/* Metric Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase font-heading">Total Journal Entries</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 font-heading">{journalEntries.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-amber-500 uppercase font-heading">Active Reflection Mood</p>
            <h3 className="text-lg font-bold text-amber-600 dark:text-amber-400 mt-1 font-heading">{selectedMood}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Smile className="w-5 h-5" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Writing Canvas */}
        <div className="lg:col-span-8">
          <Card className="p-6 space-y-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-heading">
                {editingEntryId ? 'Edit Journal Entry' : 'Writing Workspace'}
              </span>
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 font-heading">
                {selectedDate}
              </span>
            </div>

            {/* Reflection Starters */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 font-heading flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Quick Reflection Prompts:
              </label>
              <div className="flex flex-wrap gap-2">
                {reflectionPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => applyPrompt(prompt)}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/60 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Mood Selector Pills */}
            <div className="space-y-1.5 pt-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 font-heading">How are you feeling today?</label>
              <div className="flex flex-wrap gap-2">
                {moods.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setSelectedMood(m)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      selectedMood === m
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Entry Form */}
            <form onSubmit={handleSave} className="space-y-4 pt-2">
              <div>
                <input
                  type="text"
                  placeholder="Today's Thoughts Title..."
                  value={entryTitle}
                  onChange={(e) => setEntryTitle(e.target.value)}
                  className="aura-input text-lg font-bold py-2 border-0 border-b border-slate-200 dark:border-slate-800 rounded-none focus:ring-0 px-0 font-heading text-slate-900 dark:text-white"
                  autoFocus
                />
              </div>

              <div>
                <textarea
                  rows={10}
                  placeholder="Write your journal thoughts here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="aura-input text-sm leading-relaxed border-0 bg-transparent focus:ring-0 px-0 resize-none text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-400 font-medium">
                  {wordCount} words • ~{Math.ceil(wordCount / 200) || 1} min read
                </span>

                <div className="flex items-center gap-3">
                  {editingEntryId && (
                    <Button variant="ghost" onClick={startNewEntry}>Cancel Edit</Button>
                  )}
                  <Button type="submit" variant="primary" icon={Save}>
                    {editingEntryId ? 'Update Entry' : 'Save Entry'}
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </div>

        {/* Previous Journal Entries Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 font-heading">
              <BookOpen className="w-4 h-4 text-indigo-600" /> Past Entries ({filteredEntries.length})
            </h3>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search entries or moods..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="aura-input pl-9 text-xs py-2 bg-white dark:bg-slate-900"
            />
          </div>

          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {filteredEntries.length === 0 ? (
              <Card className="p-6 text-center text-xs text-slate-400 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                No matching journal entries found.
              </Card>
            ) : (
              filteredEntries.map((entry) => (
                <Card
                  key={entry.id}
                  onClick={() => loadEntryForEdit(entry)}
                  className={`p-4 cursor-pointer transition-all hover:border-indigo-300 dark:hover:border-indigo-800 group border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs ${
                    editingEntryId === entry.id ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 block font-heading">{entry.date}</span>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 group-hover:text-indigo-600 font-heading">
                        {entry.title || 'Journal Entry'}
                      </h4>
                    </div>
                    {entry.mood && (
                      <span className="text-[11px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md font-semibold text-slate-600 dark:text-slate-300">
                        {entry.mood}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-2">
                    {entry.content}
                  </p>

                  <div className="flex justify-end pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTimelineEntry(entry.id);
                      }}
                      className="text-[11px] text-red-500 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};