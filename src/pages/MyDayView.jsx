import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { generateHoursList } from '../utils/calendarUtils';
import {
  CheckSquare,
  Zap,
  Target,
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus,
  CheckCircle2,
  Circle,
  Sparkles,
  FileText,
  Flame,
  Calendar as CalendarIcon,
  ArrowRight
} from 'lucide-react';

const parseHour = (timeStr) => {
  if (!timeStr) return -1;
  const str = String(timeStr).trim().toUpperCase();
  const ampmMatch = str.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?/);
  if (!ampmMatch) return -1;
  let h = parseInt(ampmMatch[1], 10);
  const ampm = ampmMatch[3];
  if (ampm === 'PM' && h < 12) h += 12;
  if (ampm === 'AM' && h === 12) h = 0;
  return h;
};

const getDayNameFromDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[d.getDay()];
};

const isEventOnDay = (evt, targetDayName) => {
  if (!evt) return false;
  if (evt.day && evt.day.toLowerCase().slice(0, 3) === targetDayName.toLowerCase().slice(0, 3)) return true;
  if (evt.date) {
    const dayFromDate = getDayNameFromDate(evt.date);
    if (dayFromDate.toLowerCase().slice(0, 3) === targetDayName.toLowerCase().slice(0, 3)) return true;
  }
  return false;
};

export const MyDayView = () => {
  const {
    tasks,
    toggleTask,
    habits,
    toggleHabit,
    goals,
    schedule,
    notes,
    focusSessions,
    setShowFocusModePanel,
    setActiveTab,
    addEvent,
    settings
  } = useApp();

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const todayDayName = useMemo(() => getDayNameFromDate(todayStr) || 'Thu', [todayStr]);

  const remainingTasks = useMemo(() => tasks.filter((t) => !t.completed), [tasks]);
  const completedHabitsToday = useMemo(() => {
    return habits.filter((h) => h.completedDates?.includes(todayStr)).length;
  }, [habits, todayStr]);

  const habitTrackStatus = habits.length > 0 && completedHabitsToday >= Math.ceil(habits.length / 2) ? 'On track' : 'In progress';

  const overallGoalProgress = useMemo(() => {
    if (goals.length === 0) return 0;
    const sum = goals.reduce((acc, g) => acc + (Number(g.progress) || 0), 0);
    return Math.round(sum / goals.length);
  }, [goals]);

  const totalFocusSecondsToday = useMemo(() => {
    return focusSessions
      .filter((s) => s.completedAt && s.completedAt.slice(0, 10) === todayStr)
      .reduce((acc, s) => acc + (s.durationMinutes * 60 || 0), 0);
  }, [focusSessions, todayStr]);

  const formatFocusTime = (totalSec) => {
    if (!totalSec || totalSec === 0) return '0h 0m';
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  };

  const formattedDateHeader = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const hoursList = useMemo(() => {
    const wakeUp = settings?.wakeUpTime || settings?.workingHoursStart || '07:00';
    const sleep = settings?.sleepTime || settings?.workingHoursEnd || '23:00';
    return generateHoursList(wakeUp, sleep);
  }, [settings?.wakeUpTime, settings?.sleepTime, settings?.workingHoursStart, settings?.workingHoursEnd]);

  const categoryColorMap = {
    Study: { bg: 'bg-amber-50/90 dark:bg-slate-800/90 border-amber-300 dark:border-amber-500/40', text: 'text-amber-900 dark:text-amber-300', tag: 'orange' },
    Class: { bg: 'bg-sky-50/90 dark:bg-slate-800/90 border-sky-300 dark:border-sky-500/40', text: 'text-sky-900 dark:text-sky-300', tag: 'blue' },
    Work: { bg: 'bg-rose-50/90 dark:bg-slate-800/90 border-rose-300 dark:border-rose-500/40', text: 'text-rose-900 dark:text-rose-300', tag: 'pink' },
    Health: { bg: 'bg-emerald-50/90 dark:bg-slate-800/90 border-emerald-300 dark:border-emerald-500/40', text: 'text-emerald-900 dark:text-emerald-300', tag: 'green' },
    Personal: { bg: 'bg-indigo-50/90 dark:bg-slate-800/90 border-purple-300 dark:border-purple-500/40', text: 'text-indigo-900 dark:text-purple-300', tag: 'purple' }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. TOP METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Tasks Card */}
        <div
          onClick={() => setActiveTab('tasks')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-800 transition-all cursor-pointer flex items-center justify-between group"
        >
          <div>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-heading">Tasks</p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 font-heading tracking-tight">{tasks.length}</h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">{remainingTasks.length} remaining</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/50 shrink-0 group-hover:scale-105 transition-transform">
            <CheckSquare className="w-6 h-6" />
          </div>
        </div>

        {/* Habits Card */}
        <div
          onClick={() => setActiveTab('habits')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-800 transition-all cursor-pointer flex items-center justify-between group"
        >
          <div>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-heading">Habits</p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 font-heading tracking-tight">
              {completedHabitsToday}/{habits.length || 0}
            </h3>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1">{habitTrackStatus}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/50 shrink-0 group-hover:scale-105 transition-transform">
            <Zap className="w-6 h-6" />
          </div>
        </div>

        {/* Goals Card */}
        <div
          onClick={() => setActiveTab('goals')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-amber-300 dark:hover:border-amber-800 transition-all cursor-pointer flex items-center justify-between group"
        >
          <div>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-heading">Goals</p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 font-heading tracking-tight">{overallGoalProgress}%</h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Average Progress</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-100 dark:border-amber-900/50 shrink-0 group-hover:scale-105 transition-transform">
            <Target className="w-6 h-6" />
          </div>
        </div>

        {/* Focus Time Card */}
        <div
          onClick={() => setShowFocusModePanel(true)}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-sky-300 dark:hover:border-sky-800 transition-all cursor-pointer flex items-center justify-between group"
        >
          <div>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-heading">Focus Time</p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 font-heading tracking-tight">{formatFocusTime(totalFocusSecondsToday)}</h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Completed Today</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-100 dark:border-sky-900/50 shrink-0 group-hover:scale-105 transition-transform">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 2. MAIN DASHBOARD CONTENT GRID (60% Left / 40% Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: TODAY'S SCHEDULE & NOTES */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-primary" /> Today's Schedule
              </h3>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-primary-light text-primary text-xs font-bold rounded-lg font-heading">
                  {formattedDateHeader}
                </span>
                <button
                  onClick={() => setActiveTab('schedule')}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1 ml-1 cursor-pointer"
                >
                  Full View <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="pt-4 space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {hoursList.map((hour) => {
                const matchedEvent = schedule.find((e) => {
                  const eventHour = parseHour(e.startTime || e.time);
                  const cellHour = parseHour(hour);
                  const hourMatch = eventHour !== -1 && cellHour !== -1 ? eventHour === cellHour : (e.time?.includes(hour) || e.startTime?.includes(hour.split(' ')[0]));
                  const dayMatch = isEventOnDay(e, todayDayName);
                  return hourMatch && dayMatch;
                });
                const categoryStyle = categoryColorMap[matchedEvent?.category || 'Work'] || categoryColorMap.Work;

                return (
                  <div key={hour} className="flex items-start gap-4 text-xs py-1 group">
                    <span className="w-14 text-xs font-semibold text-slate-400 dark:text-slate-500 text-right pr-3 shrink-0 pt-1 font-heading">{hour}</span>
                    <div className="flex-1 border-t border-slate-100 dark:border-slate-800/80 pt-1.5 min-h-[46px]">
                      {matchedEvent ? (
                        <div
                          onClick={() => setActiveTab('schedule')}
                          className={`p-3 rounded-xl border ${categoryStyle.bg} transition-all hover:scale-[1.01] shadow-xs cursor-pointer flex items-center justify-between`}
                        >
                          <div>
                            <h4 className={`font-bold text-xs ${categoryStyle.text} font-heading`}>{matchedEvent.title}</h4>
                            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                              {matchedEvent.startTime || matchedEvent.time} {matchedEvent.location ? `• ${matchedEvent.location}` : ''}
                            </p>
                          </div>
                          <Badge variant={categoryStyle.tag}>{matchedEvent.category || 'General'}</Badge>
                        </div>
                      ) : (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              addEvent({ title: 'New Focus Slot', startTime: hour, date: todayStr, day: todayDayName, category: 'Work' });
                            }}
                            className="text-[11px] text-primary font-semibold flex items-center gap-1 py-1 hover:underline cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add slot at {hour}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Notes Preview */}
          {notes && notes.length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-500" /> Recent Notes
                </h3>
                <button onClick={() => setActiveTab('notes')} className="text-xs font-semibold text-primary hover:underline cursor-pointer">
                  View all
                </button>
              </div>
              <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {notes.slice(0, 2).map((note) => (
                  <div
                    key={note.id}
                    onClick={() => setActiveTab('notes')}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 cursor-pointer hover:border-primary transition-colors"
                  >
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate font-heading">{note.title}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">{note.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: PRIORITIES, HABITS, GOALS & FOCUS TIMER */}
        <div className="lg:col-span-5 space-y-6">
          {/* Top Priorities Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-primary" /> Top Priorities
              </h3>
              <button onClick={() => setActiveTab('tasks')} className="text-xs font-semibold text-primary hover:underline cursor-pointer">
                View all
              </button>
            </div>
            <div className="pt-3 space-y-2">
              {remainingTasks.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400 font-medium">
                  🎉 All tasks completed for today!
                </div>
              ) : (
                remainingTasks.slice(0, 4).map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer border border-slate-100 dark:border-slate-800/80"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <button className="text-slate-400 hover:text-primary transition-colors shrink-0">
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-primary fill-primary-light" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                        )}
                      </button>
                      <span className={`text-xs font-bold truncate ${task.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                        {task.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant={task.priority === 'High' ? 'pink' : 'purple'}>
                        {task.priority || 'Medium'}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Habit Progress Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-500" /> Today's Habits
              </h3>
              <button onClick={() => setActiveTab('habits')} className="text-xs font-semibold text-primary hover:underline cursor-pointer">
                View all
              </button>
            </div>
            <div className="pt-3 space-y-2.5">
              {habits.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  No habits tracked yet.
                </div>
              ) : (
                habits.slice(0, 4).map((habit) => {
                  const completedDates = habit.completedDates || [];
                  const isDoneToday = completedDates.includes(todayStr);
                  const streakVal = habit.streak || 0;

                  return (
                    <div key={habit.id} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors border border-slate-100 dark:border-slate-800/60">
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <button
                          onClick={() => toggleHabit(habit.id, todayStr)}
                          className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs transition-colors shadow-xs shrink-0 cursor-pointer ${
                            isDoneToday
                              ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-emerald-100 dark:hover:bg-emerald-950/60'
                          }`}
                          title={isDoneToday ? 'Untick today' : 'Tick today'}
                        >
                          <Zap className="w-4 h-4" />
                        </button>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white font-heading truncate">{habit.title || habit.name}</h4>
                          <p className="text-[10px] text-slate-400 font-medium truncate">{completedDates.length} completions</p>
                        </div>
                      </div>

                      <Badge variant={streakVal > 0 ? 'green' : 'gray'} icon={Flame}>
                        {streakVal}d
                      </Badge>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Goals Overview Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-500" /> Strategic Goals
              </h3>
              <button onClick={() => setActiveTab('goals')} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                View all
              </button>
            </div>
            <div className="pt-3 space-y-3">
              {goals.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  No active goals created.
                </div>
              ) : (
                goals.slice(0, 3).map((goal) => {
                  const milestones = goal.milestones || [];
                  const completedM = milestones.filter(m => m.completed).length;
                  const computedProgress = milestones.length > 0
                    ? Math.round((completedM / milestones.length) * 100)
                    : (goal.progress || 0);

                  return (
                    <div key={goal.id} className="space-y-1.5 p-3 rounded-xl border border-slate-100 dark:border-slate-800/60">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-900 dark:text-white font-heading truncate pr-2">{goal.title}</span>
                        <span className="font-bold text-amber-600 dark:text-amber-400 shrink-0">{computedProgress}%</span>
                      </div>
                      <ProgressBar progress={computedProgress} color="emerald" height="h-1.5" />
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Focus Mode Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs relative overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                  </div>
                  <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider font-heading">Deep Focus</span>
                </div>
                <span className="text-[11px] text-slate-400 font-semibold font-heading">Pomodoro</span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">Ready for Deep Work?</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Eliminate distractions and start a timed focus session.</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-400 font-medium">Target: <strong>25 mins</strong></span>
                <Button
                  onClick={() => setShowFocusModePanel(true)}
                  variant="primary"
                  size="md"
                >
                  Start Timer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};