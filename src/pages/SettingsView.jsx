import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Monitor,
  Bell,
  Database,
  Lock,
  Info,
  Save,
  Download,
  Upload,
  Trash2,
  Check,
  ShieldCheck,
  Volume2,
  Clock,
  Tag,
  User,
  Sliders,
  Sparkles,
  RefreshCw,
  HardDrive,
  CheckCircle2,
  Zap,
  RotateCcw
} from 'lucide-react';
import { CategoryManager } from '../components/CategoryManagerModal';

export const SettingsView = () => {
  const {
    theme,
    setTheme,
    accentColor = 'indigo',
    setAccentColor = () => {},
    ACCENT_PALETTES = {},
    settings = {},
    setSettings = () => {},
    userProfile = {},
    setUserProfile = () => {},
    tasks = [],
    habits = [],
    goals = [],
    schedule = [],
    notes = [],
    timeline = [],
    exportData,
    importData,
    clearTasksData,
    clearHabitsData,
    clearGoalsData,
    clearNotesData,
    clearTimelineData,
    deleteAllApplicationData,
    setShowOnboarding,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('appearance');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // General Profile Form
  const [displayName, setDisplayName] = useState(userProfile?.name || '');
  const [email, setEmail] = useState(userProfile?.email || '');
  const [title, setTitle] = useState(userProfile?.title || 'Personal Planner');
  const [statusMessage, setStatusMessage] = useState(userProfile?.statusMessage || 'Focused and ready');

  // Schedule & Day Hours
  const [wakeUpTime, setWakeUpTime] = useState(settings?.wakeUpTime || '07:00');
  const [sleepTime, setSleepTime] = useState(settings?.sleepTime || '23:00');
  const [workingHoursStart, setWorkingHoursStart] = useState(settings?.workingHoursStart || '09:00');
  const [workingHoursEnd, setWorkingHoursEnd] = useState(settings?.workingHoursEnd || '17:00');
  const [defaultTaskDuration, setDefaultTaskDuration] = useState(settings?.defaultTaskDuration || '30 mins');
  const [defaultPriority, setDefaultPriority] = useState(settings?.defaultPriority || 'Medium');

  // Notifications
  const [notificationsEnabled, setNotificationsEnabled] = useState(settings?.notificationsEnabled ?? true);
  const [reminderTime, setReminderTime] = useState(settings?.reminderTime || '09:00');
  const [taskReminders, setTaskReminders] = useState(settings?.taskReminders ?? true);
  const [habitReminders, setHabitReminders] = useState(settings?.habitReminders ?? true);
  const [calendarReminders, setCalendarReminders] = useState(settings?.calendarReminders ?? true);
  const [focusReminders, setFocusReminders] = useState(settings?.focusReminders ?? true);
  const [soundEnabled, setSoundEnabled] = useState(settings?.soundEnabled ?? true);

  // Appearance Options
  const [density, setDensity] = useState(settings?.density || 'comfortable');
  const [reduceMotion, setReduceMotion] = useState(settings?.reduceMotion ?? false);

  // Privacy Options
  const [analytics, setAnalytics] = useState(settings?.analytics ?? false);

  const triggerSavedFeedback = (message = 'Settings saved successfully!') => {
    setSavedSuccess(true);
    showToast(message, 'emerald');
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSaveGeneral = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setUserProfile((prev) => ({
      ...prev,
      name: displayName,
      email,
      title,
      statusMessage
    }));
    setSettings((prev) => ({
      ...prev,
      displayName,
      notificationsEnabled,
      reminderTime
    }));
    triggerSavedFeedback('Profile updated successfully!');
  };

  const handleSaveScheduleHours = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setSettings((prev) => ({
      ...prev,
      wakeUpTime,
      sleepTime,
      workingHoursStart,
      workingHoursEnd,
      defaultTaskDuration,
      defaultPriority
    }));
    triggerSavedFeedback('Schedule & Default Task preferences saved!');
  };

  const handleSaveNotifications = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setSettings((prev) => ({
      ...prev,
      notificationsEnabled,
      reminderTime,
      taskReminders,
      habitReminders,
      calendarReminders,
      focusReminders,
      soundEnabled
    }));
    triggerSavedFeedback('Notification preferences updated!');
  };

  const handleSaveAppearance = (newDensity, newReduceMotion) => {
    setDensity(newDensity);
    setReduceMotion(newReduceMotion);
    setSettings((prev) => ({
      ...prev,
      density: newDensity,
      reduceMotion: newReduceMotion
    }));
    showToast('Appearance settings updated!', 'indigo');
  };

  const handleSavePrivacy = (newAnalytics) => {
    setAnalytics(newAnalytics);
    setSettings((prev) => ({
      ...prev,
      analytics: newAnalytics
    }));
    showToast('Privacy preferences updated!', 'indigo');
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (importData) importData(parsed);
      } catch (err) {
        showToast('Invalid JSON backup file.', 'rose');
      }
    };
    reader.readAsText(file);
  };

  // Calculate local storage size
  const getStorageSizeKB = () => {
    try {
      let total = 0;
      for (let x in localStorage) {
        if (localStorage.hasOwnProperty(x)) {
          total += (localStorage[x].length + x.length) * 2;
        }
      }
      return (total / 1024).toFixed(1);
    } catch {
      return '12.4';
    }
  };

  const navItems = [
    { id: 'appearance', label: 'Appearance', icon: Sun },
    { id: 'categories', label: 'Custom Categories', icon: Tag },
    { id: 'schedule', label: 'Schedule Hours', icon: Clock },
    { id: 'general', label: 'General Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'data', label: 'Data & Backup', icon: Database },
    { id: 'privacy', label: 'Privacy & Security', icon: Lock },
    { id: 'about', label: 'About', icon: Info }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-heading">Settings & Preferences</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Customize application theme, schedule defaults, profile details, and data backup</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3">
          <Card className="p-2 space-y-1 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs sticky top-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all text-left font-heading cursor-pointer ${
                    isActive
                      ? 'bg-primary text-white shadow-primary font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </Card>
        </div>

        {/* Settings Content Area */}
        <div className="lg:col-span-9">
          <Card className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs min-h-[480px]">
            {/* 1. Custom Categories */}
            {activeTab === 'categories' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">Custom Categories</h3>
                  <p className="text-xs text-slate-500">Add, edit, or delete custom categories used across tasks, schedule, habits, and goals.</p>
                </div>
                <CategoryManager embedded />
              </div>
            )}

            {/* 2. Appearance */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">Appearance & Theme</h3>
                  <p className="text-xs text-slate-500">Choose how AURA looks to match your focus environment.</p>
                </div>

                {/* Theme Mode Selector */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 font-heading">Theme Mode</label>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      type="button"
                      onClick={() => setTheme('light')}
                      className={`p-4 border rounded-2xl flex flex-col items-center gap-2 text-xs font-bold transition-all font-heading cursor-pointer ${
                        theme === 'light'
                          ? 'border-primary bg-primary-light text-primary shadow-xs ring-2 ring-primary/20'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Sun className="w-6 h-6 text-amber-500" />
                      <span>Light Mode</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTheme('dark')}
                      className={`p-4 border rounded-2xl flex flex-col items-center gap-2 text-xs font-bold transition-all font-heading cursor-pointer ${
                        theme === 'dark'
                          ? 'border-primary bg-primary-light text-primary shadow-xs ring-2 ring-primary/20'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Moon className="w-6 h-6 text-indigo-500" />
                      <span>Dark Mode</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTheme('system')}
                      className={`p-4 border rounded-2xl flex flex-col items-center gap-2 text-xs font-bold transition-all font-heading cursor-pointer ${
                        theme === 'system'
                          ? 'border-primary bg-primary-light text-primary shadow-xs ring-2 ring-primary/20'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Monitor className="w-6 h-6 text-sky-500" />
                      <span>System Sync</span>
                    </button>
                  </div>
                </div>

                {/* Accent Swatches Selector */}
                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 font-heading">
                      Accent Theme Palette
                    </label>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 capitalize font-heading">
                      Active: {ACCENT_PALETTES?.[accentColor]?.name || accentColor}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {[
                      { id: 'indigo', name: 'Indigo Primary', color: 'bg-[#6366F1]' },
                      { id: 'emerald', name: 'Emerald Habits', color: 'bg-[#10B981]' },
                      { id: 'amber', name: 'Amber Goals', color: 'bg-[#F59E0B]' },
                      { id: 'sky', name: 'Sky Schedule', color: 'bg-[#0EA5E9]' },
                      { id: 'rose', name: 'Rose Notes', color: 'bg-[#F43F5E]' }
                    ].map((palette) => {
                      const isSelected = accentColor === palette.id;
                      return (
                        <button
                          key={palette.id}
                          type="button"
                          onClick={() => setAccentColor(palette.id)}
                          className={`w-9 h-9 rounded-full ${palette.color} transition-all cursor-pointer flex items-center justify-center ${
                            isSelected
                              ? 'ring-4 ring-offset-2 ring-indigo-500 scale-110 shadow-md'
                              : 'hover:scale-105 opacity-80 hover:opacity-100'
                          }`}
                          title={palette.name}
                        >
                          {isSelected && <Check className="w-4 h-4 text-white" />}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Click any color swatch to instantly re-skin the entire application theme in real-time.
                  </p>
                </div>

                {/* Layout Density & Motion */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                    <label className="block text-xs font-bold text-slate-900 dark:text-white font-heading">
                      Layout Density
                    </label>
                    <p className="text-[11px] text-slate-500 font-medium">Adjust spacing and padding throughout the interface.</p>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleSaveAppearance('comfortable', reduceMotion)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          density === 'comfortable'
                            ? 'bg-primary text-white border-primary shadow-xs'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        Comfortable
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveAppearance('compact', reduceMotion)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          density === 'compact'
                            ? 'bg-primary text-white border-primary shadow-xs'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        Compact
                      </button>
                    </div>
                  </div>

                  <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 flex items-center justify-between">
                    <div>
                      <label className="block text-xs font-bold text-slate-900 dark:text-white font-heading">
                        Reduce UI Motion
                      </label>
                      <p className="text-[11px] text-slate-500 font-medium">Disable smooth transition animations.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={reduceMotion}
                      onChange={(e) => handleSaveAppearance(density, e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 3. Schedule Hours */}
            {activeTab === 'schedule' && (
              <form onSubmit={handleSaveScheduleHours} className="space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">Schedule & Task Defaults</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                      Set your waking hours and default parameters for new tasks and schedule timeline items.
                    </p>
                  </div>
                  {savedSuccess && (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Check className="w-4 h-4" /> Hours Saved!
                    </span>
                  )}
                </div>

                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Wake Up Time */}
                    <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 bg-slate-50/50 dark:bg-slate-800/30">
                      <label className="block text-xs font-bold text-slate-900 dark:text-white font-heading">
                        🌅 Wake Up / Day Start Time
                      </label>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        The start time for your daily schedule timeline.
                      </p>
                      <input
                        type="time"
                        value={wakeUpTime}
                        onChange={(e) => setWakeUpTime(e.target.value)}
                        className="aura-input text-slate-900 dark:text-white w-full font-bold text-sm"
                      />
                    </div>

                    {/* Sleep Time */}
                    <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 bg-slate-50/50 dark:bg-slate-800/30">
                      <label className="block text-xs font-bold text-slate-900 dark:text-white font-heading">
                        🌙 Sleep / Day End Time
                      </label>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        The end time for your daily schedule timeline.
                      </p>
                      <input
                        type="time"
                        value={sleepTime}
                        onChange={(e) => setSleepTime(e.target.value)}
                        className="aura-input text-slate-900 dark:text-white w-full font-bold text-sm"
                      />
                    </div>
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="space-y-2.5 pt-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 font-heading">
                      Quick Schedule Presets
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                      <button
                        type="button"
                        onClick={() => { setWakeUpTime('05:00'); setSleepTime('21:00'); }}
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                      >
                        🌅 Early Riser (5 AM – 9 PM)
                      </button>
                      <button
                        type="button"
                        onClick={() => { setWakeUpTime('07:00'); setSleepTime('23:00'); }}
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                      >
                        ☀️ Standard Day (7 AM – 11 PM)
                      </button>
                      <button
                        type="button"
                        onClick={() => { setWakeUpTime('09:00'); setSleepTime('01:00'); }}
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                      >
                        🦉 Night Owl (9 AM – 1 AM)
                      </button>
                    </div>
                  </div>

                  {/* Task Defaults */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Default Task Duration
                      </label>
                      <select
                        value={defaultTaskDuration}
                        onChange={(e) => setDefaultTaskDuration(e.target.value)}
                        className="aura-input text-slate-900 dark:text-white"
                      >
                        <option value="15 mins">15 mins</option>
                        <option value="30 mins">30 mins</option>
                        <option value="45 mins">45 mins</option>
                        <option value="60 mins">60 mins</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Default Task Priority
                      </label>
                      <select
                        value={defaultPriority}
                        onChange={(e) => setDefaultPriority(e.target.value)}
                        className="aura-input text-slate-900 dark:text-white"
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Button type="submit" variant="primary" icon={Save}>
                    Save Schedule Defaults
                  </Button>
                </div>
              </form>
            )}

            {/* 4. General Profile */}
            {activeTab === 'general' && (
              <form onSubmit={handleSaveGeneral} className="space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">General Profile</h3>
                    <p className="text-xs text-slate-500">Update user details and personal display settings.</p>
                  </div>
                  {savedSuccess && (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Check className="w-4 h-4" /> Profile Saved!
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Display Name</label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="e.g. Alex Morgan"
                        className="aura-input text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. alex@aura.planner"
                        className="aura-input text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Professional Title</label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Senior Designer & Planner"
                        className="aura-input text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Status Message</label>
                      <input
                        type="text"
                        value={statusMessage}
                        onChange={(e) => setStatusMessage(e.target.value)}
                        placeholder="e.g. Focused and ready"
                        className="aura-input text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
                  <Button type="submit" variant="primary" icon={Save}>
                    Save Profile Details
                  </Button>
                </div>
              </form>
            )}

            {/* 5. Notifications */}
            {activeTab === 'notifications' && (
              <form onSubmit={handleSaveNotifications} className="space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">Notifications & Alerts</h3>
                    <p className="text-xs text-slate-500">Configure daily reminders, focus session alerts, and sound notifications.</p>
                  </div>
                  {savedSuccess && (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Check className="w-4 h-4" /> Preferences Saved!
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Master Switch */}
                  <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white font-heading">Master Notifications Toggle</h4>
                      <p className="text-[11px] text-slate-500">Enable or disable all in-app notification toasts.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationsEnabled}
                      onChange={(e) => setNotificationsEnabled(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                    />
                  </div>

                  <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white font-heading">Morning Planner Summary Time</h4>
                        <p className="text-[11px] text-slate-500">Scheduled time for daily focus agenda reminder.</p>
                      </div>
                      <input
                        type="time"
                        value={reminderTime}
                        onChange={(e) => setReminderTime(e.target.value)}
                        className="aura-input text-slate-900 dark:text-white w-36 font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Task Reminders</span>
                        <input
                          type="checkbox"
                          checked={taskReminders}
                          onChange={(e) => setTaskReminders(e.target.checked)}
                          className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                        />
                      </label>

                      <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Habit Tracker Reminders</span>
                        <input
                          type="checkbox"
                          checked={habitReminders}
                          onChange={(e) => setHabitReminders(e.target.checked)}
                          className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                        />
                      </label>

                      <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Calendar Event Alerts</span>
                        <input
                          type="checkbox"
                          checked={calendarReminders}
                          onChange={(e) => setCalendarReminders(e.target.checked)}
                          className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                        />
                      </label>

                      <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Focus Mode Alerts</span>
                        <input
                          type="checkbox"
                          checked={focusReminders}
                          onChange={(e) => setFocusReminders(e.target.checked)}
                          className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
                  <Button type="submit" variant="primary" icon={Save}>
                    Save Notification Preferences
                  </Button>
                </div>
              </form>
            )}

            {/* 6. Data & Backup */}
            {activeTab === 'data' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">Data Backup & Selective Resets</h3>
                  <p className="text-xs text-slate-500">Export your complete planner data as a JSON file or restore from a previous backup.</p>
                </div>

                {/* Backup & Restore */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 bg-slate-50/50 dark:bg-slate-800/30">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
                      <Download className="w-4 h-4 text-indigo-500" /> Export Backup
                    </h4>
                    <p className="text-xs text-slate-500">Download a full JSON copy of all tasks, habits, goals, schedule events, and journal notes.</p>
                    <Button onClick={exportData} variant="secondary" size="sm" icon={Download}>
                      Export JSON File
                    </Button>
                  </div>

                  <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 bg-slate-50/50 dark:bg-slate-800/30">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
                      <Upload className="w-4 h-4 text-emerald-500" /> Restore Backup
                    </h4>
                    <p className="text-xs text-slate-500">Upload a JSON backup file to restore your planner state.</p>
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 font-heading">
                      <Upload className="w-3.5 h-3.5" /> Import JSON Backup
                      <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* Selective Data Resets */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white font-heading">Selective Section Resets</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Clear all tasks?')) clearTasksData();
                      }}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-rose-500/50 text-slate-700 dark:text-slate-300 hover:text-rose-500 text-xs font-semibold transition-colors cursor-pointer text-left"
                    >
                      Clear Tasks ({tasks.length})
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Clear all habits?')) clearHabitsData();
                      }}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-rose-500/50 text-slate-700 dark:text-slate-300 hover:text-rose-500 text-xs font-semibold transition-colors cursor-pointer text-left"
                    >
                      Clear Habits ({habits.length})
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Clear all goals?')) clearGoalsData();
                      }}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-rose-500/50 text-slate-700 dark:text-slate-300 hover:text-rose-500 text-xs font-semibold transition-colors cursor-pointer text-left"
                    >
                      Clear Goals ({goals.length})
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Clear journal reflections?')) clearTimelineData();
                      }}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-rose-500/50 text-slate-700 dark:text-slate-300 hover:text-rose-500 text-xs font-semibold transition-colors cursor-pointer text-left"
                    >
                      Clear Journal ({timeline.length})
                    </button>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="p-4 border border-rose-200 dark:border-rose-950/60 bg-rose-50/40 dark:bg-rose-950/20 rounded-2xl space-y-3 pt-4">
                  <h4 className="text-sm font-bold text-rose-600 dark:text-rose-400 font-heading">Danger Zone</h4>
                  <p className="text-xs text-slate-500">Reset local storage completely and restore the app to factory default mock state.</p>
                  <Button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to reset all local storage data? This action cannot be undone.')) {
                        deleteAllApplicationData();
                      }
                    }}
                    variant="danger"
                    size="sm"
                    icon={Trash2}
                  >
                    Reset All App Data
                  </Button>
                </div>
              </div>
            )}

            {/* 7. Privacy & Security */}
            {activeTab === 'privacy' && (
              <div className="space-y-5">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" /> Privacy & Local Security
                  </h3>
                  <p className="text-xs text-slate-500">Your privacy is protected by local-first architecture.</p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 space-y-2 text-xs text-emerald-900 dark:text-emerald-200">
                  <h4 className="font-bold font-heading flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Local Storage Persistence
                  </h4>
                  <p className="leading-relaxed">
                    All your tasks, schedule entries, habits, and journal reflections are stored exclusively inside your browser's encrypted local storage (`aura-productivity-state-v1`). No third-party servers store or analyze your personal planner content.
                  </p>
                </div>

                <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white font-heading">Anonymous Telemetry & Analytics</h4>
                      <p className="text-[11px] text-slate-500">Allow anonymous feature usage reports to improve app performance.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={analytics}
                      onChange={(e) => handleSavePrivacy(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 8. About AURA */}
            {activeTab === 'about' && (
              <div className="space-y-6 text-center py-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-black text-2xl mx-auto shadow-lg shadow-indigo-500/30 font-heading">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-heading">AURA Personal Planner</h3>
                  <p className="text-xs text-slate-500 font-heading font-semibold">Version 2.4.0 (Production Build)</p>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  Designed for clean, calm, and focused productivity. Built with React, Vite, TailwindCSS, and Groq AI integrations.
                </p>

                {/* Storage & System Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto pt-2 text-left">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Local Data</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white font-heading">{getStorageSizeKB()} KB</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Tasks</span>
                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 font-heading">{tasks.length}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Habits</span>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-heading">{habits.length}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Goals</span>
                    <span className="text-sm font-bold text-amber-600 dark:text-amber-400 font-heading">{goals.length}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-center gap-3">
                  <Button
                    onClick={() => {
                      if (setShowOnboarding) setShowOnboarding(true);
                      showToast('App Tour restarted!', 'indigo');
                    }}
                    variant="secondary"
                    size="sm"
                    icon={RotateCcw}
                  >
                    Re-run App Tour
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};