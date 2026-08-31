import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRight, ShieldCheck, Check, X, Calendar, CheckSquare, Target } from 'lucide-react';

export const OnboardingModal = () => {
  const { showOnboarding, setShowOnboarding, setUserProfile, showToast } = useApp();
  const [step, setStep] = useState(1);

  const [tempData, setTempData] = useState({
    peakHours: "09:00 AM - 01:00 PM"
  });

  if (!showOnboarding) return null;

  const handleFinish = () => {
    setUserProfile(prev => ({
      ...prev,
      peakHours: tempData.peakHours
    }));
    setShowOnboarding(false);
    showToast("AURA Personal Planner initialized!", "purple");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-lg animate-slide-up">
      <div className="bg-slate-900 border border-purple-500/30 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl shadow-purple-500/20 relative overflow-hidden">
        
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button 
          onClick={() => setShowOnboarding(false)}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: WELCOME */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-6 h-6 text-white" />
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Welcome to AURA</span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mt-1">Your Personal Planner</h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                Streamline your daily tasks, schedule events, track habits, and achieve long-term strategic goals with complete privacy and local control.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-black/30 p-3.5 rounded-2xl border border-white/5 space-y-1">
                <div className="font-semibold text-indigo-300 flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-indigo-400" />
                  <span>Tasks & Schedule</span>
                </div>
                <p className="text-slate-400 text-[11px]">Manage tasks by priority and organize time blocks on your schedule.</p>
              </div>

              <div className="bg-black/30 p-3.5 rounded-2xl border border-white/5 space-y-1">
                <div className="font-semibold text-purple-300 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-purple-400" />
                  <span>Goals & Habits</span>
                </div>
                <p className="text-slate-400 text-[11px]">Build consistent streaks and track strategic goal milestones.</p>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs py-3 px-5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
            >
              <span>Continue Setup</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: PREFERENCES */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">Step 2 of 2</span>
              <h2 className="text-xl font-bold text-slate-100 mt-1">Planner Preferences</h2>
              <p className="text-xs text-slate-400 mt-1">Set your preferred peak focus hours.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Peak Focus & Working Hours</label>
                <select
                  value={tempData.peakHours}
                  onChange={(e) => setTempData({ ...tempData, peakHours: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="07:00 AM - 11:00 AM">Early Morning (07:00 AM - 11:00 AM)</option>
                  <option value="09:00 AM - 01:00 PM">Standard Morning (09:00 AM - 01:00 PM)</option>
                  <option value="02:00 PM - 06:00 PM">Afternoon Peak (02:00 PM - 06:00 PM)</option>
                  <option value="08:00 PM - 12:00 AM">Night Owl Focus (08:00 PM - 12:00 AM)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-3 rounded-2xl text-xs font-semibold text-slate-400 hover:text-slate-200 bg-white/5 border border-white/10 cursor-pointer"
              >
                Back
              </button>

              <button
                onClick={handleFinish}
                className="flex-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white font-bold text-xs py-3 px-5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Start Planning</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
