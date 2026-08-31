import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { initialUserProfile, initialSchedule, initialGoals, initialHabits, initialTimeline, initialTasks } from '../data/mockData';

const AppContext = createContext();
const STORAGE_KEY = 'aura-productivity-state-v1';

const createAvatarSvg = (initials) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
      <rect width="160" height="160" rx="40" fill="#4338ca"/>
      <circle cx="80" cy="66" r="32" fill="#f5f3ff"/>
      <path d="M38 132c8-26 30-38 42-38s34 12 42 38" fill="#f5f3ff"/>
      <text x="80" y="152" text-anchor="middle" font-family="Segoe UI, sans-serif" font-size="18" fill="#ffffff">${initials}</text>
    </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const createId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const toIsoDate = (date = new Date()) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
const getTodayKey = () => toIsoDate(new Date());

const computeStreak = (dates = []) => {
  const uniqueDates = [...new Set(dates.filter(Boolean))].sort().reverse();
  if (uniqueDates.length === 0) return 0;
  let streak = 0;
  const today = new Date();
  let checkDate = new Date(today);
  
  const todayStr = toIsoDate(checkDate);
  const yesterdayDate = new Date(today);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = toIsoDate(yesterdayDate);

  if (!uniqueDates.includes(todayStr) && !uniqueDates.includes(yesterdayStr)) {
    return 0;
  }

  if (uniqueDates.includes(todayStr)) {
    checkDate = new Date(today);
  } else {
    checkDate = yesterdayDate;
  }

  while (uniqueDates.includes(toIsoDate(checkDate))) {
    streak += 1;
    checkDate.setDate(checkDate.getDate() - 1);
  }
  return streak;
};

const formatRelativeTime = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const loadStoredAppState = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saveStoredAppState = (state) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage write failures.
  }
};

export const defaultCategories = [
  { id: 'cat-1', name: 'Personal', color: '#6366F1' },
  { id: 'cat-2', name: 'Work', color: '#3B82F6' },
  { id: 'cat-3', name: 'Health', color: '#10B981' },
  { id: 'cat-4', name: 'Learning', color: '#F59E0B' },
  { id: 'cat-5', name: 'Finance', color: '#8B5CF6' }
];

const buildDefaultUserProfile = () => ({
  name: '',
  email: '',
  title: 'Personal Planner',
  avatar: '',
  energyLevel: 100,
  peakHours: '9:00 AM – 12:00 PM',
  coreGoals: [],
  statusMessage: 'Focused and ready',
  createdAt: new Date().toISOString()
});

const defaultSettings = {
  displayName: '',
  timezone: 'America/New_York (EST)',
  dateFormat: 'MMM D, YYYY',
  timeFormat: '12h',
  startOfWeek: 'Monday',
  defaultTaskDuration: '30 mins',
  defaultReminderBehavior: '15 mins before',
  theme: 'light',
  density: 'comfortable',
  reduceMotion: false,

  workingHoursStart: '09:00',
  workingHoursEnd: '17:00',
  sleepTime: '23:00',
  wakeUpTime: '07:00',
  defaultPriority: 'Medium',
  carryOverMissedTasks: true,
  considerCalendarEvents: true,
  considerHabits: true,

  defaultHabitReminder: '09:00',
  streakBehavior: 'strict',
  missedHabitHandling: 'suggest_tomorrow',
  preferredHabitTime: '09:00',
  weeklyHabitReview: true,

  notificationsEnabled: true,
  taskReminders: true,
  habitReminders: true,
  calendarReminders: true,
  goalReminders: true,
  focusReminders: true,
  dailySummary: true,
  weeklyReview: true,

  dataUsage: 'local_only',
  analytics: false
};

export const ACCENT_PALETTES = {
  indigo: {
    name: 'Indigo',
    primary: '#6366F1',
    hover: '#4F46E5',
    light: '#EEF2FF',
    darkPrimary: '#818CF8',
    darkHover: '#6366F1',
    darkLight: 'rgba(99, 102, 241, 0.22)',
    glow: '0 4px 16px rgba(99, 102, 241, 0.4)'
  },
  emerald: {
    name: 'Emerald',
    primary: '#10B981',
    hover: '#059669',
    light: '#ECFDF5',
    darkPrimary: '#34D399',
    darkHover: '#10B981',
    darkLight: 'rgba(16, 185, 129, 0.22)',
    glow: '0 4px 16px rgba(16, 185, 129, 0.4)'
  },
  amber: {
    name: 'Amber',
    primary: '#F59E0B',
    hover: '#D97706',
    light: '#FFFBEB',
    darkPrimary: '#FBBF24',
    darkHover: '#F59E0B',
    darkLight: 'rgba(245, 158, 11, 0.22)',
    glow: '0 4px 16px rgba(245, 158, 11, 0.4)'
  },
  sky: {
    name: 'Sky Blue',
    primary: '#0EA5E9',
    hover: '#0284C7',
    light: '#F0F9FF',
    darkPrimary: '#38BDF8',
    darkHover: '#0EA5E9',
    darkLight: 'rgba(14, 165, 233, 0.22)',
    glow: '0 4px 16px rgba(14, 165, 233, 0.4)'
  },
  rose: {
    name: 'Rose Pink',
    primary: '#F43F5E',
    hover: '#E11D48',
    light: '#FFF1F2',
    darkPrimary: '#FB7185',
    darkHover: '#F43F5E',
    darkLight: 'rgba(244, 63, 94, 0.22)',
    glow: '0 4px 16px rgba(244, 63, 94, 0.4)'
  }
};

export const AppProvider = ({ children }) => {
  const storedState = loadStoredAppState();
  const [isAuthenticated, setIsAuthenticated] = useState(storedState?.isAuthenticated ?? false);
  const [activeTab, setActiveTab] = useState(storedState?.activeTab && storedState.activeTab !== 'chat' ? storedState.activeTab : 'today');
  const [userProfile, setUserProfile] = useState(storedState?.userProfile || buildDefaultUserProfile());
  const [schedule, setSchedule] = useState(storedState?.schedule || []);
  const [tasks, setTasks] = useState(storedState?.tasks || []);
  const [goals, setGoals] = useState(storedState?.goals || []);
  const [habits, setHabits] = useState(storedState?.habits || []);
  const [timeline, setTimeline] = useState(storedState?.timeline || []);
  const [categories, setCategories] = useState(storedState?.categories || defaultCategories);
  const [showCategoryManagerModal, setShowCategoryManagerModal] = useState(false);

  const [theme, setTheme] = useState(storedState?.theme || 'light');
  const [accentColor, setAccentColor] = useState(storedState?.accentColor || 'indigo');
  const [settings, setSettings] = useState(storedState?.settings ? { ...defaultSettings, ...storedState.settings } : defaultSettings);
  const [notes, setNotes] = useState(storedState?.notes || []);
  const [notifications, setNotifications] = useState(storedState?.notifications || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFocusModePanel, setShowFocusModePanel] = useState(storedState?.showFocusModePanel || false);
  const [focusSessions, setFocusSessions] = useState(storedState?.focusSessions || []);
  const [activeFocusSession, setActiveFocusSession] = useState(storedState?.activeFocusSession || null);
  const [toast, setToast] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(storedState?.showOnboarding || false);
  const [showAuth, setShowAuth] = useState(storedState?.showAuth || false);

  const [googleCalendarState, setGoogleCalendarState] = useState(storedState?.googleCalendarState || {
    status: 'NOT_CONNECTED',
    connectedEmail: null,
    lastSyncedAt: null,
    selectedCalendars: ['primary'],
    googleEvents: []
  });

  const connectGoogleCalendar = (email = 'user@gmail.com') => {
    setGoogleCalendarState({
      status: 'CONNECTED',
      connectedEmail: email,
      lastSyncedAt: new Date().toISOString(),
      selectedCalendars: ['primary'],
      googleEvents: [
        {
          id: 'gcal-1',
          source: 'GOOGLE',
          externalId: 'g-evt-1',
          calendarId: 'primary',
          title: 'Google Sync: Team Planning Meeting',
          date: new Date().toISOString().slice(0, 10),
          time: '14:00',
          startTime: '14:00',
          endTime: '15:00',
          timezone: 'UTC',
          isAllDay: false,
          status: 'confirmed'
        }
      ]
    });
  };

  const disconnectGoogleCalendar = () => {
    setGoogleCalendarState({
      status: 'DISCONNECTED',
      connectedEmail: null,
      lastSyncedAt: null,
      selectedCalendars: [],
      googleEvents: []
    });
  };

  const syncGoogleCalendar = () => {
    setGoogleCalendarState((prev) => ({
      ...prev,
      status: 'CONNECTED',
      lastSyncedAt: new Date().toISOString()
    }));
  };

  const [gmailState, setGmailState] = useState(storedState?.gmailState || {
    status: 'NOT_CONNECTED',
    connectedEmail: null,
    lastSyncedAt: null,
    gmailMessages: [],
    drafts: []
  });

  const connectGmail = (email = 'user@gmail.com') => {
    setGmailState({
      status: 'CONNECTED',
      connectedEmail: email,
      lastSyncedAt: new Date().toISOString(),
      gmailMessages: [
        {
          id: 'gmail-1',
          source: 'GMAIL',
          externalId: 'm-1',
          threadId: 't-1',
          sender: 'professor@college.edu',
          recipients: [email],
          subject: 'Project Report Submission Deadline',
          snippet: 'Please submit the final project report by Friday at 5 PM.',
          date: new Date().toISOString().slice(0, 10),
          timestamp: new Date().toISOString(),
          isRead: false,
          hasAttachments: true
        }
      ],
      drafts: []
    });
  };

  const disconnectGmail = () => {
    setGmailState({
      status: 'DISCONNECTED',
      connectedEmail: null,
      lastSyncedAt: null,
      gmailMessages: [],
      drafts: []
    });
  };

  const syncGmail = () => {
    setGmailState((prev) => ({
      ...prev,
      status: 'CONNECTED',
      lastSyncedAt: new Date().toISOString()
    }));
  };

  // Apply Theme & Accent Color Palette
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const body = document.body;

    let effectiveTheme = theme;
    if (theme === 'system' && typeof window !== 'undefined') {
      effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    root.setAttribute('data-theme', effectiveTheme);
    root.classList.toggle('dark', effectiveTheme === 'dark');
    body.classList.toggle('light-theme', effectiveTheme === 'light');
    body.classList.toggle('dark-theme', effectiveTheme === 'dark');
    body.classList.toggle('compact-density', settings.density === 'compact');
    body.classList.toggle('reduce-motion', !!settings.reduceMotion);
    body.style.colorScheme = effectiveTheme;

    // Apply Dynamic Accent Color Swatch
    const palette = ACCENT_PALETTES[accentColor] || ACCENT_PALETTES.indigo;
    const isDark = effectiveTheme === 'dark';
    const primaryColor = isDark ? (palette.darkPrimary || palette.primary) : palette.primary;
    const hoverColor = isDark ? (palette.darkHover || palette.hover) : palette.hover;
    const lightBg = isDark ? (palette.darkLight || 'rgba(99, 102, 241, 0.22)') : palette.light;

    root.style.setProperty('--aura-primary', primaryColor, 'important');
    root.style.setProperty('--aura-primary-hover', hoverColor, 'important');
    root.style.setProperty('--aura-primary-light', lightBg, 'important');
    root.style.setProperty('--aura-shadow-glow', palette.glow, 'important');

    body.style.setProperty('--aura-primary', primaryColor, 'important');
    body.style.setProperty('--aura-primary-hover', hoverColor, 'important');
    body.style.setProperty('--aura-primary-light', lightBg, 'important');
    body.style.setProperty('--aura-shadow-glow', palette.glow, 'important');

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('aura-theme', effectiveTheme);
      window.localStorage.setItem('aura-accent', accentColor);
    }
  }, [theme, accentColor, settings.density, settings.reduceMotion]);

  useEffect(() => {
    saveStoredAppState({
      isAuthenticated,
      activeTab: activeTab === 'chat' ? 'today' : activeTab,
      userProfile,
      schedule,
      tasks,
      goals,
      habits,
      timeline,
      theme,
      accentColor,
      settings,
      notes,
      notifications,
      showFocusModePanel,
      focusSessions,
      activeFocusSession,
      showOnboarding,
      showAuth,
      googleCalendarState,
      gmailState,
      categories
    });
  }, [isAuthenticated, activeTab, userProfile, schedule, tasks, goals, habits, timeline, theme, settings, notes, notifications, showFocusModePanel, focusSessions, activeFocusSession, showOnboarding, showAuth, googleCalendarState, gmailState, categories]);

  const showToast = (message, type = 'indigo') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const login = (email, password) => {
    setIsAuthenticated(true);
    setUserProfile((prev) => ({
      ...prev,
      email: email || prev.email,
      name: prev.name || (email ? email.split('@')[0] : 'User')
    }));
    showToast('Welcome back to AURA!', 'indigo');
    return true;
  };

  const signup = (name, email, password) => {
    setIsAuthenticated(true);
    setUserProfile((prev) => ({
      ...prev,
      name: name || prev.name,
      email: email || prev.email
    }));
    setShowOnboarding(true);
    showToast('Welcome to AURA! Account created successfully.', 'indigo');
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    showToast('Signed out of AURA.', 'indigo');
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const nextTheme = prevTheme === 'dark' ? 'light' : 'dark';
      showToast(`Switched to ${nextTheme === 'light' ? 'Light' : 'Dark'} Mode`, 'purple');
      return nextTheme;
    });
  };

  const addNotification = (message, type = 'info') => {
    if (settings.notificationsEnabled === false) return;
    const entry = {
      id: createId('notif'),
      message,
      type,
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications((prev) => [entry, ...prev].slice(0, 20));
  };

  const markNotificationAsRead = (id) => {
    setNotifications((prev) => prev.map((notification) => notification.id === id ? { ...notification, read: true } : notification));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const addTimelineEntry = (entry) => {
    const todayIso = toIsoDate(new Date());
    const nextEntry = {
      id: createId('journal'),
      time: entry.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: entry.date || todayIso,
      type: entry.type || 'Journal',
      title: entry.title || 'Journal Entry',
      content: entry.content || '',
      category: entry.category || 'Personal',
      mood: entry.mood || '',
      source: entry.source || 'manual',
      relatedTaskId: entry.relatedTaskId || '',
      relatedHabitId: entry.relatedHabitId || '',
      relatedGoalId: entry.relatedGoalId || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTimeline((prev) => [nextEntry, ...prev]);
    showToast('Saved to Journal.', 'emerald');
    return nextEntry;
  };

  const updateTimelineEntry = (id, updates) => {
    setTimeline((prev) => prev.map((entry) => entry.id === id ? { ...entry, ...updates, updatedAt: new Date().toISOString() } : entry));
    showToast('Journal entry updated.', 'indigo');
  };

  const deleteTimelineEntry = (id) => {
    setTimeline((prev) => prev.filter((entry) => entry.id !== id));
    showToast('Journal entry deleted.', 'rose');
  };

  const syncGoalProgress = (goalId) => {
    setGoals((prev) => prev.map((goal) => {
      if (goal.id !== goalId) return goal;
      const milestoneCount = goal.milestones?.length || 0;
      if (milestoneCount > 0) {
        const completedMilestones = goal.milestones.filter((m) => m.completed).length;
        const nextProgress = Math.round((completedMilestones / milestoneCount) * 100);
        return { ...goal, progress: nextProgress };
      }
      return goal;
    }));
  };

  // Category Management Actions
  const addCategory = ({ name, color = '#6366F1', icon = 'Tag' }) => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      showToast('Category name cannot be empty.', 'rose');
      return null;
    }

    if (categories.some((c) => c.name.toLowerCase() === trimmedName.toLowerCase())) {
      showToast(`Category "${trimmedName}" already exists!`, 'rose');
      return null;
    }

    const newCategory = {
      id: createId('cat'),
      name: trimmedName,
      color,
      icon
    };

    setCategories((prev) => [...prev, newCategory]);
    showToast(`Category "${trimmedName}" created successfully!`, 'emerald');
    return newCategory;
  };

  const updateCategory = (id, { name, color, icon }) => {
    const target = categories.find((c) => c.id === id);
    if (!target) return;

    const trimmedName = name.trim();
    if (!trimmedName) {
      showToast('Category name cannot be empty.', 'rose');
      return;
    }

    if (categories.some((c) => c.id !== id && c.name.toLowerCase() === trimmedName.toLowerCase())) {
      showToast(`Category "${trimmedName}" already exists!`, 'rose');
      return;
    }

    const oldName = target.name;

    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name: trimmedName, color: color || c.color, icon: icon || c.icon } : c))
    );

    if (oldName !== trimmedName) {
      setTasks((prev) => prev.map((t) => (t.category === oldName ? { ...t, category: trimmedName } : t)));
      setHabits((prev) => prev.map((h) => (h.category === oldName ? { ...h, category: trimmedName } : h)));
      setGoals((prev) => prev.map((g) => (g.category === oldName ? { ...g, category: trimmedName } : g)));
      setNotes((prev) => prev.map((n) => (n.category === oldName ? { ...n, category: trimmedName } : n)));
      setSchedule((prev) => prev.map((e) => (e.category === oldName ? { ...e, category: trimmedName } : e)));
    }

    showToast(`Category updated to "${trimmedName}"!`, 'indigo');
  };

  const deleteCategory = (id) => {
    const target = categories.find((c) => c.id === id);
    if (!target) return;

    if (categories.length <= 1) {
      showToast('Cannot delete the only remaining category.', 'rose');
      return;
    }

    const categoryNameToRemove = target.name;
    const remainingCategories = categories.filter((c) => c.id !== id);
    const fallbackCategoryName = remainingCategories[0]?.name || 'Personal';

    setCategories(remainingCategories);

    setTasks((prev) => prev.map((t) => (t.category === categoryNameToRemove ? { ...t, category: fallbackCategoryName } : t)));
    setHabits((prev) => prev.map((h) => (h.category === categoryNameToRemove ? { ...h, category: fallbackCategoryName } : h)));
    setGoals((prev) => prev.map((g) => (g.category === categoryNameToRemove ? { ...g, category: fallbackCategoryName } : g)));
    setNotes((prev) => prev.map((n) => (n.category === categoryNameToRemove ? { ...n, category: fallbackCategoryName } : n)));
    setSchedule((prev) => prev.map((e) => (e.category === categoryNameToRemove ? { ...e, category: fallbackCategoryName } : e)));

    showToast(`Category "${categoryNameToRemove}" deleted. Items reassigned to "${fallbackCategoryName}".`, 'indigo');
  };

  const resetCategoriesToDefault = () => {
    setCategories(defaultCategories);
    showToast('Categories reset to defaults.', 'indigo');
  };

  const addTask = (task) => {
    const title = task.title?.trim();
    if (!title) {
      showToast('Task title is required.', 'rose');
      return false;
    }
    const newTask = {
      id: createId('task'),
      title,
      description: task.description?.trim() || '',
      category: task.category || 'Personal',
      priority: task.priority || settings.defaultPriority || 'Medium',
      dueDate: task.dueDate || getTodayKey(),
      dueTime: task.dueTime || '',
      duration: task.duration || settings.defaultTaskDuration || '30 mins',
      goalId: task.goalId || '',
      completed: false,
      source: task.source || 'Manual',
      createdAt: new Date().toISOString(),
      completedAt: null
    };
    setTasks((prev) => [newTask, ...prev]);
    addTimelineEntry({ type: 'Task', title: `Added task: ${title}`, content: title, category: task.category || 'Personal', relatedTaskId: newTask.id });
    addNotification(`Task added: ${title}`, 'indigo');
    showToast('Task added successfully.', 'emerald');
    return true;
  };

  const updateTask = (id, updates) => {
    setTasks((prev) => prev.map((task) => task.id === id ? { ...task, ...updates } : task));
    addNotification('Task updated.', 'indigo');
    showToast('Task updated.', 'indigo');
  };

  const deleteTask = (id) => {
    const task = tasks.find((entry) => entry.id === id);
    if (!task) return;
    setTasks((prev) => prev.filter((entry) => entry.id !== id));
    addTimelineEntry({ type: 'Task', title: `Deleted task: ${task.title}`, content: task.title, category: 'Personal' });
    addNotification(`Task deleted: ${task.title}`, 'rose');
    showToast('Task deleted.', 'rose');
  };

  const duplicateTask = (id) => {
    const task = tasks.find((entry) => entry.id === id);
    if (!task) return;
    const copy = { ...task, id: createId('task'), title: `${task.title} (copy)`, createdAt: new Date().toISOString(), completed: false, completedAt: null };
    setTasks((prev) => [copy, ...prev]);
    addNotification(`Task duplicated: ${task.title}`, 'indigo');
    showToast('Task duplicated.', 'emerald');
  };

  const toggleTask = (id) => {
    setTasks((prev) => prev.map((task) => {
      if (task.id !== id) return task;
      const nextCompleted = !task.completed;
      if (nextCompleted) {
        addTimelineEntry({ type: 'Task', title: `Completed task: ${task.title}`, content: task.title, category: task.category || 'Personal', relatedTaskId: task.id });
        addNotification(`Task completed: ${task.title}`, 'emerald');
        if (task.goalId) {
          syncGoalProgress(task.goalId);
        }
      }
      return { ...task, completed: nextCompleted, completedAt: nextCompleted ? new Date().toISOString() : null };
    }));
    showToast('Task status updated.', 'indigo');
  };

  const clearTasks = () => {
    setTasks([]);
    addNotification('All tasks cleared.', 'rose');
    showToast('All tasks cleared.', 'rose');
  };

  const rescheduleTask = (id, dueDate, dueTime = '') => {
    setTasks((prev) => prev.map((task) => task.id === id ? { ...task, dueDate, dueTime } : task));
    addNotification('Task rescheduled.', 'indigo');
    showToast('Task rescheduled.', 'indigo');
  };

  const addHabit = (habit) => {
    const title = habit.title?.trim();
    if (!title) {
      showToast('Habit title is required.', 'rose');
      return false;
    }
    const newHabit = {
      id: createId('habit'),
      title,
      description: habit.description?.trim() || '',
      frequency: habit.frequency || 'Daily',
      targetDays: habit.targetDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      reminderTime: habit.reminderTime || settings.defaultHabitReminder || '09:00',
      category: habit.category || 'Health',
      goalId: habit.goalId || '',
      status: 'active',
      streak: 0,
      bestStreak: 0,
      completedDates: [],
      skippedDates: [],
      createdAt: new Date().toISOString()
    };
    setHabits((prev) => [newHabit, ...prev]);
    addTimelineEntry({ type: 'Habit', title: `Created habit: ${title}`, content: title, category: 'Wellness' });
    addNotification(`Habit added: ${title}`, 'indigo');
    showToast('Habit added.', 'emerald');
    return true;
  };

  const updateHabit = (id, updates) => {
    setHabits((prev) => prev.map((habit) => habit.id === id ? { ...habit, ...updates } : habit));
    addNotification('Habit updated.', 'indigo');
    showToast('Habit updated.', 'indigo');
  };

  const deleteHabit = (id) => {
    const habit = habits.find((entry) => entry.id === id);
    if (!habit) return;
    setHabits((prev) => prev.filter((entry) => entry.id !== id));
    addNotification(`Habit deleted: ${habit.title}`, 'rose');
    showToast('Habit deleted.', 'rose');
  };

  const completeHabit = (id) => {
    const today = getTodayKey();
    setHabits((prev) => prev.map((habit) => {
      if (habit.id !== id) return habit;
      if (habit.completedDates?.includes(today)) return habit;
      const nextCompletedDates = [...(habit.completedDates || []), today];
      const streak = computeStreak(nextCompletedDates);
      return {
        ...habit,
        completedDates: nextCompletedDates,
        streak,
        bestStreak: Math.max(habit.bestStreak || 0, streak),
        status: 'active'
      };
    }));
    const habit = habits.find((entry) => entry.id === id);
    if (habit) {
      addTimelineEntry({ type: 'Habit', title: `Completed habit: ${habit.title}`, content: habit.title, category: 'Wellness' });
      addNotification(`Habit completed: ${habit.title}`, 'emerald');
      if (habit.goalId) {
        syncGoalProgress(habit.goalId);
      }
    }
    showToast('Habit completed for today.', 'emerald');
  };

  const computeStreak = (completedDates = []) => {
    if (!completedDates || completedDates.length === 0) return 0;
    const sorted = [...new Set(completedDates)].sort().reverse();
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let checkDate = new Date(today);
    const todayKey = today.toISOString().slice(0, 10);
    if (!sorted.includes(todayKey)) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
      const key = checkDate.toISOString().slice(0, 10);
      if (sorted.includes(key)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const toggleHabit = (id, targetDateStr = null) => {
    const targetDate = targetDateStr || getTodayKey();
    setHabits((prev) => prev.map((habit) => {
      if (habit.id !== id) return habit;
      const isAlreadyCompleted = habit.completedDates?.includes(targetDate);
      let nextCompletedDates;
      if (isAlreadyCompleted) {
        nextCompletedDates = (habit.completedDates || []).filter((date) => date !== targetDate);
      } else {
        nextCompletedDates = [...(habit.completedDates || []), targetDate];
      }
      const streak = computeStreak(nextCompletedDates);
      return {
        ...habit,
        completedDates: nextCompletedDates,
        streak,
        bestStreak: Math.max(habit.bestStreak || 0, streak)
      };
    }));
    showToast('Habit status updated.', 'indigo');
  };

  const skipHabit = (id) => {
    const today = getTodayKey();
    setHabits((prev) => prev.map((habit) => {
      if (habit.id !== id) return habit;
      const existing = habit.skippedDates || [];
      if (existing.includes(today)) return habit;
      return { ...habit, skippedDates: [...existing, today] };
    }));
    const habit = habits.find((entry) => entry.id === id);
    if (habit) {
      addNotification(`Habit skipped: ${habit.title}`, 'amber');
    }
    showToast('Habit skipped for today.', 'amber');
  };

  const pauseHabit = (id) => {
    setHabits((prev) => prev.map((habit) => habit.id === id ? { ...habit, status: 'paused' } : habit));
    addNotification('Habit paused.', 'amber');
    showToast('Habit paused.', 'amber');
  };

  const resumeHabit = (id) => {
    setHabits((prev) => prev.map((habit) => habit.id === id ? { ...habit, status: 'active' } : habit));
    addNotification('Habit resumed.', 'indigo');
    showToast('Habit resumed.', 'indigo');
  };

  const getDayName = (dateStr) => {
    if (!dateStr) return 'Mon';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Mon';
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[d.getDay()];
  };

  const addEvent = (event) => {
    const title = event.title?.trim();
    if (!title) {
      showToast('Event title is required.', 'rose');
      return false;
    }
    const date = event.date || getTodayKey();
    const startTime = event.startTime || event.time || '10:00 AM';
    const endTime = event.endTime || '11:30 AM';
    const day = event.day || getDayName(date);

    const newEvent = {
      id: createId('event'),
      title,
      description: event.description?.trim() || '',
      date,
      day,
      startTime,
      endTime,
      time: event.time || `${startTime} – ${endTime}`,
      category: event.category || 'Work',
      location: event.location || 'Office / Online',
      notes: event.notes || '',
      status: 'Upcoming',
      createdAt: new Date().toISOString(),
      rescheduled: false
    };
    setSchedule((prev) => [newEvent, ...prev]);
    addTimelineEntry({ type: 'Calendar', title: `Created event: ${title}`, content: `${newEvent.date} at ${newEvent.startTime}`, category: 'Schedule' });
    addNotification(`Event added: ${title}`, 'indigo');
    showToast('Calendar event added.', 'emerald');
    return true;
  };

  const updateEvent = (id, updates) => {
    setSchedule((prev) => prev.map((event) => event.id === id ? { ...event, ...updates } : event));
    addNotification('Event updated.', 'indigo');
    showToast('Event updated.', 'indigo');
  };

  const deleteEvent = (id) => {
    const event = schedule.find((entry) => entry.id === id);
    if (!event) return;
    setSchedule((prev) => prev.filter((entry) => entry.id !== id));
    addNotification(`Event deleted: ${event.title}`, 'rose');
    showToast('Event deleted.', 'rose');
  };

  const duplicateEvent = (id) => {
    const event = schedule.find((entry) => entry.id === id);
    if (!event) return;
    const copy = { ...event, id: createId('event'), title: `${event.title} (copy)`, createdAt: new Date().toISOString() };
    setSchedule((prev) => [copy, ...prev]);
    addNotification(`Event duplicated: ${event.title}`, 'indigo');
    showToast('Event duplicated.', 'emerald');
  };

  const rescheduleEvent = (id, date, startTime, endTime) => {
    setSchedule((prev) => prev.map((event) => event.id === id ? { ...event, date, startTime, endTime, rescheduled: true } : event));
    addNotification('Event rescheduled.', 'indigo');
    showToast('Event rescheduled.', 'indigo');
  };

  const addGoal = (goal) => {
    const title = goal.title?.trim();
    if (!title) {
      showToast('Goal title is required.', 'rose');
      return false;
    }
    const newGoal = {
      id: createId('goal'),
      title,
      description: goal.description?.trim() || '',
      targetDate: goal.targetDate || '',
      category: goal.category || 'Personal',
      progress: Number(goal.progress) || 0,
      milestones: (goal.milestones || []).map((item) => ({
        id: createId('milestone'),
        title: typeof item === 'string' ? item : item.title,
        completed: typeof item === 'object' ? !!item.completed : false
      }))
    };
    setGoals((prev) => [newGoal, ...prev]);
    addTimelineEntry({ type: 'Goal', title: `Created goal: ${title}`, content: title, category: 'Learning' });
    addNotification(`Goal added: ${title}`, 'indigo');
    showToast('Goal added.', 'emerald');
    return true;
  };

  const updateGoal = (id, updates) => {
    setGoals((prev) => prev.map((goal) => goal.id === id ? { ...goal, ...updates } : goal));
    addNotification('Goal updated.', 'indigo');
    showToast('Goal updated.', 'indigo');
  };

  const deleteGoal = (id) => {
    const goal = goals.find((entry) => entry.id === id);
    if (!goal) return;
    setGoals((prev) => prev.filter((entry) => entry.id !== id));
    addNotification(`Goal deleted: ${goal.title}`, 'rose');
    showToast('Goal deleted.', 'rose');
  };

  const addMilestone = (goalId, title) => {
    const trimmedTitle = title?.trim();
    if (!trimmedTitle) return;
    setGoals((prev) => prev.map((goal) => {
      if (goal.id !== goalId) return goal;
      const nextMilestones = [...(goal.milestones || []), { id: createId('milestone'), title: trimmedTitle, completed: false }];
      const completedCount = nextMilestones.filter((m) => m.completed).length;
      const progress = Math.round((completedCount / nextMilestones.length) * 100);
      return { ...goal, milestones: nextMilestones, progress };
    }));
    addNotification('Milestone added.', 'indigo');
    showToast('Milestone added.', 'emerald');
  };

  const toggleMilestone = (goalId, milestoneId) => {
    setGoals((prev) => prev.map((goal) => {
      if (goal.id !== goalId) return goal;
      const nextMilestones = (goal.milestones || []).map((milestone) => milestone.id === milestoneId ? { ...milestone, completed: !milestone.completed } : milestone);
      const completedCount = nextMilestones.filter((m) => m.completed).length;
      const progress = nextMilestones.length > 0 ? Math.round((completedCount / nextMilestones.length) * 100) : goal.progress;
      const targetMilestone = nextMilestones.find(m => m.id === milestoneId);
      if (targetMilestone?.completed) {
        addTimelineEntry({ type: 'Goal', title: `Milestone completed: ${targetMilestone.title}`, content: `Goal: ${goal.title}`, category: 'Learning', relatedGoalId: goal.id });
      }
      return { ...goal, milestones: nextMilestones, progress };
    }));
    showToast('Milestone updated.', 'indigo');
  };

  const deleteMilestone = (goalId, milestoneId) => {
    setGoals((prev) => prev.map((goal) => {
      if (goal.id !== goalId) return goal;
      const nextMilestones = (goal.milestones || []).filter((milestone) => milestone.id !== milestoneId);
      const completedCount = nextMilestones.filter((m) => m.completed).length;
      const progress = nextMilestones.length > 0 ? Math.round((completedCount / nextMilestones.length) * 100) : 0;
      return { ...goal, milestones: nextMilestones, progress };
    }));
    showToast('Milestone removed.', 'rose');
  };

  const addNote = (note) => {
    const title = note.title?.trim();
    const content = note.content?.trim();
    if (!title || !content) {
      showToast('Title and content are required.', 'rose');
      return false;
    }
    const newNote = {
      id: createId('note'),
      title,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setNotes((prev) => [newNote, ...prev]);
    addNotification(`Note added: ${title}`, 'indigo');
    showToast('Note added.', 'emerald');
    return true;
  };

  const updateNote = (id, updates) => {
    setNotes((prev) => prev.map((note) => note.id === id ? { ...note, ...updates, updatedAt: new Date().toISOString() } : note));
    addNotification('Note updated.', 'indigo');
    showToast('Note updated.', 'indigo');
  };

  const deleteNote = (id) => {
    const note = notes.find((entry) => entry.id === id);
    if (!note) return;
    setNotes((prev) => prev.filter((entry) => entry.id !== id));
    addNotification(`Note deleted: ${note.title}`, 'rose');
    showToast('Note deleted.', 'rose');
  };

  const startFocusSession = ({ taskId = '', durationMinutes = 25 }) => {
    const targetTask = tasks.find((task) => task.id === taskId);
    const newSession = {
      id: createId('focus'),
      taskId,
      taskTitle: targetTask?.title || 'Deep work session',
      durationMinutes: Number(durationMinutes) || 25,
      elapsedSeconds: 0,
      status: 'running',
      startedAt: new Date().toISOString(),
      completed: false
    };
    setActiveFocusSession(newSession);
    setFocusSessions((prev) => [newSession, ...prev]);
    addNotification('Focus session started.', 'indigo');
    showToast('Focus session started.', 'indigo');
  };

  const pauseFocusSession = () => {
    setActiveFocusSession((prev) => prev ? { ...prev, status: 'paused' } : prev);
    showToast('Focus session paused.', 'amber');
  };

  const resumeFocusSession = () => {
    setActiveFocusSession((prev) => prev ? { ...prev, status: 'running' } : prev);
    showToast('Focus session resumed.', 'indigo');
  };

  const completeFocusSession = (sessionId = activeFocusSession?.id) => {
    if (!sessionId) return;
    const endedSession = activeFocusSession && activeFocusSession.id === sessionId ? activeFocusSession : focusSessions.find((session) => session.id === sessionId);
    if (!endedSession) return;
    const completedSession = { ...endedSession, status: 'completed', completed: true, completedAt: new Date().toISOString() };
    setFocusSessions((prev) => prev.map((session) => session.id === sessionId ? completedSession : session));
    setActiveFocusSession(null);
    addTimelineEntry({ type: 'Focus', title: `Completed focus session: ${completedSession.taskTitle}`, content: `${completedSession.durationMinutes} min focus block`, category: 'Wellness' });
    addNotification(`Focus session completed (${completedSession.durationMinutes}m)`, 'emerald');
    showToast('Focus session saved to stats.', 'emerald');
  };

  // Data Export, Import & Clearing Actions
  const exportData = () => {
    const exportPayload = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      userProfile,
      settings,
      tasks,
      habits,
      goals,
      schedule,
      timeline,
      notes,
      focusSessions
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `aura-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Data exported successfully as JSON.', 'emerald');
  };

  const importData = (importedJson) => {
    try {
      const parsed = typeof importedJson === 'string' ? JSON.parse(importedJson) : importedJson;
      if (!parsed || typeof parsed !== 'object') {
        showToast('Invalid backup data format.', 'rose');
        return false;
      }
      if (parsed.userProfile && typeof parsed.userProfile === 'object') setUserProfile(parsed.userProfile);
      if (parsed.settings && typeof parsed.settings === 'object') setSettings(parsed.settings);
      if (Array.isArray(parsed.tasks)) setTasks(parsed.tasks);
      if (Array.isArray(parsed.habits)) setHabits(parsed.habits);
      if (Array.isArray(parsed.goals)) setGoals(parsed.goals);
      if (Array.isArray(parsed.schedule)) setSchedule(parsed.schedule);
      if (Array.isArray(parsed.timeline)) setTimeline(parsed.timeline);
      if (Array.isArray(parsed.notes)) setNotes(parsed.notes);
      if (Array.isArray(parsed.focusSessions)) setFocusSessions(parsed.focusSessions);
      showToast('Data imported successfully.', 'emerald');
      return true;
    } catch (err) {
      console.error('Import error', err);
      showToast('Failed to import JSON data.', 'rose');
      return false;
    }
  };

  const clearTimelineData = () => {
    setTimeline([]);
    showToast('Timeline data cleared.', 'rose');
  };

  const clearTasksData = () => {
    setTasks([]);
    showToast('All tasks cleared.', 'rose');
  };

  const clearHabitsData = () => {
    setHabits([]);
    showToast('All habits cleared.', 'rose');
  };

  const clearGoalsData = () => {
    setGoals([]);
    showToast('All goals cleared.', 'rose');
  };

  const clearNotesData = () => {
    setNotes([]);
    showToast('All notes cleared.', 'rose');
  };

  const deleteAllApplicationData = () => {
    setTasks([]);
    setHabits([]);
    setGoals([]);
    setSchedule([]);
    setTimeline([]);
    setNotes([]);
    setFocusSessions([]);
    setNotifications([]);
    setSettings(defaultSettings);
    setUserProfile(buildDefaultUserProfile());
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    showToast('All application data reset.', 'rose');
  };

  useEffect(() => {
    if (!activeFocusSession || activeFocusSession.status !== 'running') return undefined;
    const timer = window.setInterval(() => {
      setActiveFocusSession((prev) => {
        if (!prev || prev.status !== 'running') return prev;
        const nextElapsed = prev.elapsedSeconds + 1;
        if (nextElapsed >= prev.durationMinutes * 60) {
          completeFocusSession(prev.id);
          return null;
        }
        return { ...prev, elapsedSeconds: nextElapsed };
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [activeFocusSession?.id, activeFocusSession?.status]);

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];
    const results = [];
    const addResult = (item, tab, label, detail) => {
      if (item.title?.toLowerCase().includes(query) || item.content?.toLowerCase().includes(query) || item.description?.toLowerCase().includes(query) || item.location?.toLowerCase().includes(query)) {
        results.push({ id: item.id, title: item.title || item.content || item.name || 'Untitled', tab, detail: `${label} • ${detail || ''}`, item });
      }
    };
    tasks.forEach((task) => addResult(task, 'today', 'Task', task.category));
    habits.forEach((habit) => addResult(habit, 'goals', 'Habit', habit.category));
    goals.forEach((goal) => addResult(goal, 'goals', 'Goal', goal.category));
    schedule.forEach((event) => addResult(event, 'calendar', 'Event', event.date));
    timeline.forEach((entry) => addResult(entry, 'timeline', 'Timeline', entry.category));
    notes.forEach((note) => addResult(note, 'notes', 'Note', note.title));
    return results.slice(0, 10);
  }, [searchQuery, tasks, habits, goals, schedule, timeline, notes]);

  const openSearchResult = (result) => {
    setActiveTab(result.tab);
    setSearchQuery('');
    showToast(`Opened ${result.title}`, 'indigo');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab: activeTab === 'chat' ? 'today' : activeTab,
        setActiveTab,
        userProfile,
        setUserProfile,
        schedule,
        setSchedule,
        tasks,
        setTasks,
        goals,
        setGoals,
        habits,
        setHabits,
        timeline,
        setTimeline,
        notes,
        setNotes,
        theme,
        setTheme,
        accentColor,
        setAccentColor,
        ACCENT_PALETTES,
        toggleTheme,
        settings,
        setSettings,
        notifications,
        showNotifications,
        setShowNotifications,
        markNotificationAsRead,
        clearNotifications,
        searchQuery,
        setSearchQuery,
        searchResults,
        openSearchResult,
        showFocusModePanel,
        setShowFocusModePanel,
        focusSessions,
        activeFocusSession,
        startFocusSession,
        pauseFocusSession,
        resumeFocusSession,
        completeFocusSession,
        toast,
        showToast,
        showOnboarding,
        setShowOnboarding,
        showAuth,
        setShowAuth,

        // Custom Categories State & Actions
        categories,
        setCategories,
        showCategoryManagerModal,
        setShowCategoryManagerModal,
        addCategory,
        updateCategory,
        deleteCategory,
        resetCategoriesToDefault,

        // Auth State & Actions
        isAuthenticated,
        setIsAuthenticated,
        login,
        signup,
        logout,

        // Integration States
        googleCalendarState,
        connectGoogleCalendar,
        disconnectGoogleCalendar,
        syncGoogleCalendar,
        gmailState,
        connectGmail,
        disconnectGmail,
        syncGmail,

        // Helper CRUD
        addTimelineEntry,
        updateTimelineEntry,
        deleteTimelineEntry,
        addTask,
        updateTask,
        deleteTask,
        duplicateTask,
        toggleTask,
        clearTasks,
        rescheduleTask,
        addHabit,
        updateHabit,
        deleteHabit,
        completeHabit,
        toggleHabit,
        skipHabit,
        pauseHabit,
        resumeHabit,
        addEvent,
        updateEvent,
        deleteEvent,
        duplicateEvent,
        rescheduleEvent,
        addGoal,
        updateGoal,
        deleteGoal,
        addMilestone,
        toggleMilestone,
        toggleGoalMilestone: toggleMilestone,
        deleteMilestone,
        addNote,
        updateNote,
        deleteNote,
        exportData,
        importData,
        clearTimelineData,
        clearTasksData,
        clearHabitsData,
        clearGoalsData,
        clearNotesData,
        deleteAllApplicationData,
        formatRelativeTime
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
