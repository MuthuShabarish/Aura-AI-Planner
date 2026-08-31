import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import {
  CheckSquare,
  Clock,
  Zap,
  Target,
  TrendingUp,
  Award
} from 'lucide-react';

export const InsightsView = () => {
  const { tasks, habits, goals, focusSessions } = useApp();

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  // 1. Task Metrics
  const completedTasks = useMemo(() => (Array.isArray(tasks) ? tasks.filter((t) => t.completed).length : 0), [tasks]);
  const taskCompletionRate = useMemo(() => {
    if (!tasks || tasks.length === 0) return 0;
    const rate = Math.round((completedTasks / tasks.length) * 100);
    return isNaN(rate) ? 0 : rate;
  }, [completedTasks, tasks]);

  // 2. Focus Time Metrics
  const totalFocusMins = useMemo(() => {
    if (!Array.isArray(focusSessions)) return 0;
    return focusSessions.reduce((acc, s) => acc + (Number(s.durationMinutes) || 25), 0);
  }, [focusSessions]);

  const focusHoursFormatted = useMemo(() => {
    const hours = totalFocusMins / 60;
    return isNaN(hours) ? '0.0' : hours.toFixed(1);
  }, [totalFocusMins]);

  // 3. Habit Consistency Metrics
  const habitScore = useMemo(() => {
    if (!habits || habits.length === 0) return 0;
    const totalRatio = habits.reduce((acc, h) => {
      const doneCount = Array.isArray(h?.completedDates) ? h.completedDates.length : 0;
      const target = Number(h?.targetDays) > 0 ? Number(h.targetDays) : 5;
      const pct = Math.min(100, Math.round((doneCount / target) * 100));
      return acc + (isNaN(pct) ? 0 : pct);
    }, 0);
    const score = Math.round(totalRatio / habits.length);
    return isNaN(score) ? 0 : score;
  }, [habits]);

  // 4. Overall Productivity Index
  const overallProductivity = useMemo(() => {
    const validTaskScore = isNaN(taskCompletionRate) ? 0 : taskCompletionRate;
    const validHabitScore = isNaN(habitScore) ? 0 : habitScore;
    const score = Math.round((validTaskScore + validHabitScore) / 2);
    return isNaN(score) ? 0 : score;
  }, [taskCompletionRate, habitScore]);

  // 5. Dynamic 7-Day Output Graph
  const weekDaysList = useMemo(() => {
    const now = new Date();
    const currentDayOfWeek = now.getDay();
    const distanceToMon = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + distanceToMon);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push(d.toISOString().slice(0, 10));
    }
    return days;
  }, []);

  const weeklyData = useMemo(() => {
    return weekDaysList.map((dateStr) => {
      const tasksOnDay = tasks.filter((t) => t.completed && t.dueDate === dateStr).length;
      const habitsOnDay = habits.filter((h) => (h.completedDates || []).includes(dateStr)).length;
      const focusOnDay = focusSessions.filter((s) => s.completedAt?.slice(0, 10) === dateStr).length;
      return tasksOnDay + habitsOnDay + focusOnDay;
    });
  }, [weekDaysList, tasks, habits, focusSessions]);

  const maxVal = useMemo(() => Math.max(...weeklyData, 4), [weeklyData]);

  const svgPoints = useMemo(() => {
    return weeklyData
      .map((val, idx) => `${(idx * 60) + 20},${120 - ((val / maxVal) * 90)}`)
      .join(' ');
  }, [weeklyData, maxVal]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-heading">Insights & Analytics</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Real-time statistics on tasks, focus blocks, and habit consistency</p>
      </div>

      {/* Top 4 Insight Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="p-5 space-y-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold font-heading">
            <span>Tasks Completed</span>
            <Badge variant="purple">{taskCompletionRate}% Rate</Badge>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading">{completedTasks}</h3>
          <p className="text-xs text-slate-400 font-medium">Out of {tasks.length} total tasks</p>
        </Card>

        <Card className="p-5 space-y-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold font-heading">
            <span>Focus Time</span>
            <Badge variant="blue">{focusSessions.length} sessions</Badge>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading">{focusHoursFormatted}h</h3>
          <p className="text-xs text-slate-400 font-medium">Logged focus time</p>
        </Card>

        <Card className="p-5 space-y-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold font-heading">
            <span>Habit Consistency</span>
            <Badge variant={habitScore >= 70 ? 'green' : 'gray'}>{habitScore}% Rate</Badge>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading">{habitScore}%</h3>
          <p className="text-xs text-slate-400 font-medium">Weekly target score</p>
        </Card>

        <Card className="p-5 space-y-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold font-heading">
            <span>Overall Productivity</span>
            <Badge variant={overallProductivity >= 50 ? 'orange' : 'gray'}>{overallProductivity >= 50 ? 'Active' : 'Building'}</Badge>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading">{overallProductivity}%</h3>
          <p className="text-xs text-slate-400 font-medium">Efficiency rating</p>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Task Completion Curve SVG */}
        <div className="lg:col-span-8">
          <Card className="p-6 space-y-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-500" /> Weekly Live Activity Graph
                </h3>
                <p className="text-xs text-slate-400">Real-time daily output (Tasks + Habits + Focus Sessions)</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-indigo-600 inline-block" />
                <span className="text-xs text-slate-500 font-semibold font-heading">Daily Output</span>
              </div>
            </div>

            <div className="pt-4 overflow-x-auto">
              <svg viewBox="0 0 400 140" className="w-full h-48 overflow-visible">
                <line x1="0" y1="30" x2="400" y2="30" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="4 4" />
                <line x1="0" y1="70" x2="400" y2="70" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="4 4" />
                <line x1="0" y1="110" x2="400" y2="110" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="4 4" />

                <polygon
                  points={`20,130 ${svgPoints} 380,130`}
                  className="fill-indigo-500/10 dark:fill-indigo-500/20"
                />

                <polyline
                  fill="none"
                  stroke="#6366F1"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={svgPoints}
                />

                {weeklyData.map((val, idx) => {
                  const cx = (idx * 60) + 20;
                  const cy = 120 - ((val / maxVal) * 90);
                  return (
                    <g key={idx}>
                      <circle cx={cx} cy={cy} r="5" fill="#6366F1" className="stroke-white dark:stroke-slate-900" strokeWidth="2" />
                      <text x={cx} y={cy - 10} textAnchor="middle" fontSize="10" fontWeight="bold" fill="currentColor" className="text-slate-600 dark:text-slate-300 font-heading">
                        {val}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="flex justify-between text-xs text-slate-400 font-bold px-2 pt-2 border-t border-slate-100 dark:border-slate-800 font-heading">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </Card>
        </div>

        {/* Breakdown Card */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 space-y-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
              <Target className="w-4 h-4 text-amber-500" /> Goal Milestone Execution
            </h3>
            <div className="space-y-4 pt-2">
              {goals.length === 0 ? (
                <div className="text-xs text-slate-400 text-center py-4">No goals tracked yet.</div>
              ) : (
                goals.map((g) => {
                  const milestones = g.milestones || [];
                  const completedM = milestones.filter(m => m.completed).length;
                  const prog = milestones.length > 0 ? Math.round((completedM / milestones.length) * 100) : (g.progress || 0);

                  return (
                    <div key={g.id} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-heading">
                        <span className="font-bold text-slate-800 dark:text-slate-200 truncate pr-2">{g.title}</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400 shrink-0">{prog}%</span>
                      </div>
                      <ProgressBar progress={prog} color="purple" height="h-2" />
                    </div>
                  );
                })
              )}
            </div>
          </Card>

          <Card className="p-6 space-y-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-500" /> Habit Consistency
            </h3>
            <div className="space-y-3 pt-1">
              {habits.length === 0 ? (
                <div className="text-xs text-slate-400 text-center py-4">No active habits tracked.</div>
              ) : (
                habits.map((h) => (
                  <div key={h.id} className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 font-heading truncate pr-2">{h.title || h.name}</span>
                    <Badge variant={(h.streak || 0) > 0 ? 'green' : 'gray'}>{(h.streak || 0)}d streak</Badge>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};