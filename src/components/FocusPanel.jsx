import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../context/AppContext';
import { Button } from './ui/Button';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  X,
  Sparkles,
  Volume2,
  VolumeX,
  Clock,
  CheckSquare
} from 'lucide-react';

export const FocusPanel = () => {
  const {
    showFocusModePanel,
    setShowFocusModePanel,
    activeFocusSession,
    startFocusSession,
    pauseFocusSession,
    completeFocusSession,
    focusSessions,
    tasks
  } = useApp();

  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [soundMode, setSoundMode] = useState('Off'); // 'Off' | 'Rain' | 'Waves'

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

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

  useEffect(() => {
    if (activeFocusSession) {
      setIsRunning(activeFocusSession.status === 'running');
    }
  }, [activeFocusSession]);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsRunning(false);
            if (completeFocusSession) completeFocusSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, completeFocusSession]);

  const handleStart = () => {
    setSecondsLeft(selectedMinutes * 60);
    setIsRunning(true);
    if (startFocusSession) {
      startFocusSession({ taskId: selectedTaskId, durationMinutes: selectedMinutes });
    }
  };

  const handlePause = () => {
    setIsRunning(false);
    if (pauseFocusSession) pauseFocusSession();
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(selectedMinutes * 60);
  };

  const handleCompleteEarly = () => {
    setIsRunning(false);
    if (completeFocusSession) completeFocusSession();
    setShowFocusModePanel(false);
  };

  if (!showFocusModePanel) return null;

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-800 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-xs font-bold tracking-wider uppercase text-indigo-400 font-heading">Deep Focus Timer</h3>
              <p className="text-xs text-slate-400">Pomodoro Concentration Mode</p>
            </div>
          </div>

          <button
            onClick={() => setShowFocusModePanel(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close timer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Timer Body */}
        <div className="py-6 text-center space-y-6 relative z-10">
          {!isRunning && (
            <div className="max-w-xs mx-auto space-y-3">
              <select
                value={selectedTaskId}
                onChange={(e) => setSelectedTaskId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none"
              >
                <option value="">-- Focus on a specific task --</option>
                {tasks.map((t) => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
              </select>

              {/* Minute Presets */}
              <div className="flex justify-center gap-2">
                {[15, 25, 45, 60].map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setSelectedMinutes(m);
                      setSecondsLeft(m * 60);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all font-heading cursor-pointer ${
                      selectedMinutes === m
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-950 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {m}m
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Big Time Display */}
          <div className="py-2">
            <h1 className="text-7xl sm:text-8xl font-extrabold tracking-tight text-white font-heading select-none">
              {formattedTime}
            </h1>
          </div>

          {/* Waveform graphic */}
          <div className="flex items-center justify-center gap-1.5 h-6">
            {[40, 70, 30, 90, 50, 80, 40, 60, 100, 40, 70].map((height, i) => (
              <span
                key={i}
                className={`w-1 rounded-full bg-indigo-500 transition-all ${
                  isRunning ? 'animate-pulse' : 'opacity-30'
                }`}
                style={{ height: isRunning ? `${height}%` : '20%' }}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 pt-2">
            {!isRunning ? (
              <Button onClick={handleStart} variant="primary" size="lg" icon={Play} className="px-8 shadow-indigo-600/30">
                Start Focus
              </Button>
            ) : (
              <Button onClick={handlePause} variant="secondary" size="lg" icon={Pause} className="px-8 bg-amber-500/20 text-amber-300 border-amber-500/30">
                Pause
              </Button>
            )}

            <Button onClick={handleReset} variant="ghost" size="lg" icon={RotateCcw}>
              Reset
            </Button>

            {isRunning && (
              <Button onClick={handleCompleteEarly} variant="ghost" size="lg" icon={CheckCircle2} className="text-emerald-400">
                Complete
              </Button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-heading">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" /> Today's Total: <strong className="text-white">{formatFocusTime(totalFocusSecondsToday)}</strong>
          </span>
          <span className="flex items-center gap-1">
            <Volume2 className="w-3.5 h-3.5 text-indigo-400" /> Focus Mode Active
          </span>
        </div>
      </div>
    </div>,
    document.body
  );
};