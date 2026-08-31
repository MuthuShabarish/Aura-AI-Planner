import React, { useState } from 'react';
import { Send, Plus, Mic, Sparkles } from 'lucide-react';

export const AIComposer = ({ onSend }) => {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setText('Hey AURA, I want to set 1 hour time for study purpose today at 6 PM.');
        setIsRecording(false);
      }, 1500);
    }
  };

  return (
    <div className="shrink-0 pt-3 pb-1 bg-gradient-to-t from-white via-white to-transparent dark:from-[#18191c] dark:via-[#18191c] dark:to-transparent z-10">
      <form
        onSubmit={handleSubmit}
        className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg shadow-black/5 dark:shadow-black/30 space-y-2.5 transition-all duration-200 focus-within:border-indigo-500/80 focus-within:ring-4 focus-within:ring-indigo-500/10"
      >
        <div className="flex items-center gap-2.5">
          {/* Quick Action Button */}
          <button
            type="button"
            onClick={() => alert('Quick Actions: Ask AURA to add tasks, schedule events, track habits, or log goals.')}
            className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 border border-slate-200/80 dark:border-slate-800 transition-colors cursor-pointer shrink-0"
            title="Quick Action Suggestions"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Textarea Input */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask AURA anything (e.g. 'schedule study time at 6 PM'...)"
            rows={1}
            className="flex-1 bg-transparent border-0 text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none resize-none max-h-24 py-1 font-sans"
          />

          {/* Controls: Voice & Send */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={toggleRecording}
              className={`p-2 rounded-xl transition-all cursor-pointer border ${
                isRecording
                  ? 'bg-rose-500/20 text-rose-500 border-rose-500/30 animate-pulse'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border-transparent'
              }`}
              title={isRecording ? 'Listening...' : 'Voice Input'}
            >
              <Mic className="w-4 h-4" />
            </button>

            <button
              type="submit"
              disabled={!text.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-200 cursor-pointer flex items-center justify-center active:scale-95"
              title="Send Message"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Footer Hint */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1.5 border-t border-slate-100 dark:border-slate-800/80">
          <span className="flex items-center gap-1.5 font-bold font-heading text-slate-500 dark:text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> AURA Assistant
          </span>
          <span className="font-medium text-[10px] text-slate-400 hidden sm:inline-block">
            Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 font-mono text-[9px] font-semibold text-slate-600 dark:text-slate-300">Enter</kbd> to send · <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 font-mono text-[9px] font-semibold text-slate-600 dark:text-slate-300">Shift + Enter</kbd> for new line
          </span>
        </div>
      </form>
    </div>
  );
};

