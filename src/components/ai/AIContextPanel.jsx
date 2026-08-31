import React from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  Sparkles,
  Plus,
  MessageSquare,
  Pin,
  Trash2,
  Clock
} from 'lucide-react';

export const AIContextPanel = ({
  historyItems = [],
  activeChatId,
  onNewChat,
  onSelectHistory,
  onTogglePin,
  onDeleteHistory
}) => {
  const { tasks, habits, goals } = useApp();

  const activeTasks = tasks.filter((t) => !t.completed).length;
  const habitsCount = habits.length;
  const goalsCount = goals.length;

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const pinnedItems = historyItems.filter((item) => item.pinned);
  const unpinnedItems = historyItems.filter((item) => !item.pinned);

  // Group unpinned items
  const todayItems = unpinnedItems.filter((item) => item.group === 'Today' || !item.group);
  const previousItems = unpinnedItems.filter((item) => item.group === 'Previous');

  return (
    <div className="space-y-3.5 h-full flex flex-col min-h-0">
      {/* 1. Today's Context Card */}
      <Card className="p-4 border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-xs space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider font-heading flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Live Planner Context
          </span>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 font-heading flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" /> {todayFormatted}
          </span>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
          AURA AI dynamically reads your live tasks, habits, and goals to process updates.
        </p>

        {/* Dynamic Context Metrics */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80 text-center">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20">
            <span className="block text-sm font-extrabold text-indigo-600 dark:text-indigo-400 font-heading">{activeTasks}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Tasks</span>
          </div>
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20">
            <span className="block text-sm font-extrabold text-amber-600 dark:text-amber-400 font-heading">{habitsCount}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Habits</span>
          </div>
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
            <span className="block text-sm font-extrabold text-emerald-600 dark:text-emerald-400 font-heading">{goalsCount}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Goals</span>
          </div>
        </div>
      </Card>

      {/* 2. Conversation History (Fully Extended Height) */}
      <Card className="p-4 border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-xs flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white font-heading flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-indigo-500" /> Conversation History
          </h4>
          <Button onClick={onNewChat} variant="primary" size="xs" icon={Plus}>
            New Chat
          </Button>
        </div>

        {/* Scrollable Conversation List */}
        <div className="space-y-3.5 overflow-y-auto flex-1 pr-1 min-h-0">
          {historyItems.length === 0 ? (
            <div className="text-center py-12 px-2 space-y-2.5 my-auto">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <MessageSquare className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 font-heading">No chat history yet</p>
              <p className="text-[11px] text-slate-400 max-w-[200px] mx-auto leading-relaxed">
                Start a conversation with AURA to save chat threads here.
              </p>
            </div>
          ) : (
            <>
              {/* Pinned Section */}
              {pinnedItems.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider font-heading px-1 flex items-center gap-1">
                    <Pin className="w-3 h-3 fill-amber-500 text-amber-500" /> Pinned Chats
                  </span>
                  <div className="space-y-1">
                    {pinnedItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => onSelectHistory(item)}
                        className={`group w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all font-heading cursor-pointer border ${
                          item.id === activeChatId
                            ? 'bg-amber-500/15 text-amber-900 dark:text-amber-200 border-amber-500/50 font-bold shadow-xs'
                            : 'bg-amber-500/5 text-slate-700 dark:text-slate-200 border-amber-500/20 hover:border-amber-500/40'
                        }`}
                      >
                        <span className="truncate pr-2 font-medium">{item.title}</span>
                        
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={(e) => onTogglePin(e, item.id)}
                            className="p-1 rounded-lg text-amber-500 hover:bg-amber-500/20 transition-colors"
                            title="Unpin Chat"
                          >
                            <Pin className="w-3 h-3 fill-amber-500" />
                          </button>
                          <button
                            onClick={(e) => onDeleteHistory(e, item.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100"
                            title="Delete Chat"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Today Section */}
              {todayItems.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-heading px-1">
                    Today
                  </span>
                  <div className="space-y-1">
                    {todayItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => onSelectHistory(item)}
                        className={`group w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all font-heading cursor-pointer border ${
                          item.id === activeChatId
                            ? 'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/40 font-bold shadow-xs'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 border-transparent'
                        }`}
                      >
                        <span className="truncate pr-2 font-medium">{item.title}</span>

                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-[10px] text-slate-400 font-medium group-hover:hidden">{item.time}</span>
                          <button
                            onClick={(e) => onTogglePin(e, item.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-500/10 transition-colors hidden group-hover:inline-flex"
                            title="Pin Chat"
                          >
                            <Pin className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => onDeleteHistory(e, item.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors hidden group-hover:inline-flex"
                            title="Delete Chat"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Previous Section */}
              {previousItems.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-heading px-1">
                    Previous
                  </span>
                  <div className="space-y-1">
                    {previousItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => onSelectHistory(item)}
                        className={`group w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all font-heading cursor-pointer border ${
                          item.id === activeChatId
                            ? 'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/40 font-bold shadow-xs'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 border-transparent'
                        }`}
                      >
                        <span className="truncate pr-2 font-medium">{item.title}</span>

                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-[10px] text-slate-400 font-medium group-hover:hidden">{item.time}</span>
                          <button
                            onClick={(e) => onTogglePin(e, item.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-500/10 transition-colors hidden group-hover:inline-flex"
                            title="Pin Chat"
                          >
                            <Pin className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => onDeleteHistory(e, item.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors hidden group-hover:inline-flex"
                            title="Delete Chat"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

