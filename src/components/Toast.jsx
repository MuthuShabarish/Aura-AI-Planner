import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export const Toast = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const getToastColors = (type) => {
    switch (type) {
      case 'rose': return 'bg-rose-950/90 border-rose-500/40 text-rose-200 shadow-rose-500/20';
      case 'emerald': return 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200 shadow-emerald-500/20';
      case 'amber': return 'bg-amber-950/90 border-amber-500/40 text-amber-200 shadow-amber-500/20';
      case 'purple': return 'bg-purple-950/90 border-purple-500/40 text-purple-200 shadow-purple-500/20';
      default: return 'bg-indigo-950/90 border-indigo-500/40 text-indigo-200 shadow-indigo-500/20';
    }
  };

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 z-50 animate-slide-up">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl text-xs font-semibold ${getToastColors(toast.type)}`}>
        <div className="p-1 rounded-lg bg-white/10">
          <Sparkles className="w-4 h-4" />
        </div>
        <span>{toast.message}</span>
      </div>
    </div>
  );
};
