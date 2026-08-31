import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import {
  FileText,
  Plus,
  Search,
  Trash2,
  Save,
  Copy,
  Check,
  Pin,
  Filter,
  BookOpen,
  Folder,
  Clock
} from 'lucide-react';

export const NotesView = () => {
  const { notes, addNote, updateNote, deleteNote, categories = [], setShowCategoryManagerModal } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeNote, setActiveNote] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Personal');
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const filteredNotes = useMemo(() => {
    let result = notes;

    if (selectedCategory !== 'All') {
      result = result.filter((n) => n.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((n) =>
        n.title?.toLowerCase().includes(q) ||
        n.content?.toLowerCase().includes(q) ||
        n.category?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [notes, selectedCategory, searchQuery]);

  const uniqueCategoriesCount = useMemo(() => {
    const cats = new Set(notes.map((n) => n.category || 'Personal'));
    return cats.size;
  }, [notes]);

  const handleSelectNote = (note) => {
    setActiveNote(note);
    setTitle(note.title || '');
    setContent(note.content || '');
    setCategory(note.category || 'Personal');
    setIsEditing(false);
  };

  const handleStartNew = () => {
    setActiveNote(null);
    setTitle('');
    setContent('');
    setCategory('Personal');
    setIsEditing(true);
  };

  const handleSave = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!title.trim() && !content.trim()) return;

    if (activeNote) {
      updateNote(activeNote.id, { title: title || 'Untitled Note', content, category });
      setActiveNote({ ...activeNote, title, content, category });
    } else {
      addNote({ title: title || 'Untitled Note', content, category });
      setTitle('');
      setContent('');
      setCategory('Personal');
    }
    setIsEditing(false);
  };

  const handleDelete = (id) => {
    deleteNote(id);
    if (activeNote?.id === id) {
      setActiveNote(null);
      setTitle('');
      setContent('');
      setIsEditing(false);
    }
  };

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = useMemo(() => {
    if (!content.trim()) return 0;
    return content.trim().split(/\s+/).length;
  }, [content]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-heading">Notes & Knowledge</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Quick scratchpad, study guides, and project documentation</p>
        </div>

        <Button onClick={handleStartNew} variant="primary" icon={Plus}>
          New Note
        </Button>
      </div>

      {/* Metric Stat Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase font-heading">Total Notes</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 font-heading">{notes.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-emerald-500 uppercase font-heading">Note Categories</p>
            <h3 className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 font-heading">{uniqueCategoriesCount} Folders</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Folder className="w-5 h-5" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar Notes List */}
        <div className="lg:col-span-5 space-y-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search notes or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="aura-input pl-9 text-xs py-2 bg-white dark:bg-slate-900"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {['All', ...categories.map((c) => c.name)].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all font-heading cursor-pointer ${
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
              className="px-2 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-auto cursor-pointer"
            >
              + Manage
            </button>
          </div>

          <div className="space-y-2.5 max-h-[550px] overflow-y-auto pr-1">
            {filteredNotes.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="No notes found"
                description="Create your first note to store ideas and guides."
                actionLabel="Create Note"
                onAction={handleStartNew}
              />
            ) : (
              filteredNotes.map((note) => (
                <Card
                  key={note.id}
                  onClick={() => handleSelectNote(note)}
                  className={`p-4 cursor-pointer transition-all hover:border-indigo-300 dark:hover:border-indigo-800 group border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs ${
                    activeNote?.id === note.id ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 shadow-xs' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant="blue" className="mb-1">{note.category || 'Personal'}</Badge>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 truncate font-heading">
                        {note.title || 'Untitled Note'}
                      </h4>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium shrink-0 font-heading">
                      {note.updatedAt ? new Date(note.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Recently'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5">
                    {note.content}
                  </p>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Note Reader & Editor Workspace */}
        <div className="lg:col-span-7">
          <Card className="p-6 h-full min-h-[520px] flex flex-col justify-between border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            {activeNote || isEditing ? (
              <form onSubmit={handleSave} className="flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider font-heading">
                        {activeNote ? 'Viewing Note' : 'Creating New Note'}
                      </span>
                      <select
                        value={category}
                        onChange={(e) => {
                          if (e.target.value === '__MANAGE_CATEGORIES__') {
                            setShowCategoryManagerModal(true);
                          } else {
                            setCategory(e.target.value);
                          }
                        }}
                        className="aura-input text-xs py-0.5 px-2 font-semibold text-slate-700 dark:text-slate-300"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                        <option value="__MANAGE_CATEGORIES__">+ Manage Categories...</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      {content && (
                        <button
                          type="button"
                          onClick={handleCopy}
                          className="text-xs text-slate-500 hover:text-indigo-600 flex items-center gap-1 font-semibold transition-colors"
                          title="Copy Note Content"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          {copied ? 'Copied!' : 'Copy'}
                        </button>
                      )}

                      {activeNote && (
                        <button
                          type="button"
                          onClick={() => handleDelete(activeNote.id)}
                          className="text-xs text-red-500 hover:underline flex items-center gap-1 font-semibold ml-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Note Title..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="aura-input text-xl font-bold border-0 focus:ring-0 px-0 font-heading text-slate-900 dark:text-white"
                      autoFocus
                    />
                  </div>

                  <div>
                    <textarea
                      rows={14}
                      placeholder="Write your note content here..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="aura-input text-sm leading-relaxed border-0 bg-transparent focus:ring-0 px-0 resize-none text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-slate-400 font-medium">
                    {wordCount} words • {content.length} characters
                  </span>

                  <div className="flex justify-end gap-2">
                    <Button type="submit" variant="primary" icon={Save}>
                      Save Note
                    </Button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center text-center h-full py-20 text-slate-400">
                <FileText className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-3" />
                <h4 className="text-base font-bold text-slate-700 dark:text-slate-300 font-heading">Select a note to view</h4>
                <p className="text-xs text-slate-400 max-w-xs mt-1">Choose a note from the left sidebar or click below to create a new one.</p>
                <Button onClick={handleStartNew} variant="primary" size="sm" icon={Plus} className="mt-4">
                  Create Note
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};