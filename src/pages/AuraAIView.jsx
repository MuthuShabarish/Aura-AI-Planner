import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { AIWelcome } from '../components/ai/AIWelcome';
import { AIComposer } from '../components/ai/AIComposer';
import { AIContextPanel } from '../components/ai/AIContextPanel';
import {
  sendChatMessage,
  loadStoredConversations,
  saveStoredConversations,
  loadStoredHistoryItems,
  saveStoredHistoryItems,
  clearAllAIConversations
} from '../services/aiService';
import {
  Sparkles,
  PanelRight,
  Calendar as CalendarIcon,
  BookOpen,
  AlertTriangle,
  Loader2,
  Trash2,
  X,
  Plus
} from 'lucide-react';

export const AuraAIView = () => {
  const {
    tasks,
    schedule,
    habits,
    goals,
    addTask,
    toggleTask,
    deleteTask,
    addEvent,
    deleteEvent,
    addHabit,
    completeHabit,
    addGoal,
    addTimelineEntry,
    showToast
  } = useApp();

  const [showRightPanel, setShowRightPanel] = useState(true);
  const [loading, setLoading] = useState(false);

  const todayKey = new Date().toISOString().slice(0, 10);
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Conversations stored in localStorage by thread ID / date
  const [conversationsMap, setConversationsMap] = useState(() => loadStoredConversations());
  const [historyItems, setHistoryItems] = useState(() => loadStoredHistoryItems());

  // Active chat thread id
  const [activeChatId, setActiveChatId] = useState(() => {
    const items = loadStoredHistoryItems();
    return items.length > 0 ? items[0].id : `chat-${Date.now()}`;
  });

  const [messages, setMessages] = useState(() => {
    const storedMap = loadStoredConversations();
    const items = loadStoredHistoryItems();
    const currentId = items.length > 0 ? items[0].id : null;
    return currentId && storedMap[currentId] ? storedMap[currentId] : [];
  });

  // Confirmation states for Journal or Destructive Actions
  const [pendingConfirmation, setPendingConfirmation] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Save current active thread messages to localStorage
  useEffect(() => {
    if (!activeChatId) return;
    const updatedMap = {
      ...conversationsMap,
      [activeChatId]: messages
    };
    setConversationsMap(updatedMap);
    saveStoredConversations(updatedMap);
  }, [messages, activeChatId]);

  // Save history items array to localStorage
  useEffect(() => {
    saveStoredHistoryItems(historyItems);
  }, [historyItems]);

  // Helper to execute action returned from AI
  const executeAiAction = (action) => {
    if (!action || !action.intent) return;

    const { intent, parameters, requiresConfirmation } = action;

    if (requiresConfirmation || intent === 'delete_task' || intent === 'delete_schedule' || intent === 'create_journal_summary') {
      setPendingConfirmation(action);
      return;
    }

    try {
      if (intent === 'create_task') {
        addTask({
          title: parameters.title,
          dueDate: parameters.dueDate || todayKey,
          dueTime: parameters.dueTime || '',
          priority: parameters.priority || 'Medium',
          category: parameters.category || 'Personal'
        });
      } else if (intent === 'toggle_task') {
        const match = tasks.find(
          (t) => t.title.toLowerCase().includes((parameters.title || '').toLowerCase())
        ) || tasks[0];
        if (match) toggleTask(match.id);
      } else if (intent === 'create_schedule') {
        addEvent({
          title: parameters.title,
          date: parameters.date || todayKey,
          startTime: parameters.startTime || '06:00 PM',
          endTime: parameters.endTime || '07:00 PM',
          category: parameters.category || 'Study'
        });
      } else if (intent === 'create_habit') {
        addHabit({
          title: parameters.title,
          category: parameters.category || 'Health'
        });
      } else if (intent === 'complete_habit') {
        const match = habits.find(
          (h) => h.title.toLowerCase().includes((parameters.title || '').toLowerCase())
        ) || habits[0];
        if (match) completeHabit(match.id);
      } else if (intent === 'create_goal') {
        addGoal({
          title: parameters.title,
          targetDate: parameters.targetDate || '',
          category: parameters.category || 'Personal'
        });
      }
    } catch (err) {
      console.error('Failed to execute AI action:', err);
    }
  };

  // Confirm pending action handler (e.g. Journal log or Delete)
  const handleConfirmPendingAction = () => {
    if (!pendingConfirmation) return;

    const { intent, parameters } = pendingConfirmation;

    try {
      if (intent === 'create_journal_summary') {
        addTimelineEntry({
          type: 'Journal',
          title: `Daily Reflection (${parameters.date || todayKey})`,
          content: parameters.summary || 'Summary of today\'s conversation and achievements.',
          date: parameters.date || todayKey,
          category: 'Reflection',
          mood: 'Focused'
        });
        showToast('Daily reflection added to Journal!', 'emerald');
      } else if (intent === 'delete_task') {
        const match = tasks.find(
          (t) => t.title.toLowerCase().includes((parameters.title || '').toLowerCase())
        );
        if (match) deleteTask(match.id);
      } else if (intent === 'delete_schedule') {
        const match = schedule.find(
          (s) => s.title.toLowerCase().includes((parameters.title || '').toLowerCase())
        );
        if (match) deleteEvent(match.id);
      }
    } catch (err) {
      console.error('Failed to confirm action:', err);
    } finally {
      setPendingConfirmation(null);
    }
  };

  // User message submit handler
  const handleSendMessage = async (text) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      time: timeNow
    };

    // If this is the first message in thread, add to history items
    if (messages.length === 0) {
      const chatTitle = text.length > 25 ? `${text.slice(0, 25)}...` : text;
      const newHistoryItem = {
        id: activeChatId,
        title: chatTitle,
        time: timeNow,
        group: 'Today',
        pinned: false,
        active: true
      };
      setHistoryItems((prev) => [newHistoryItem, ...prev]);
    }

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setLoading(true);

    const context = {
      currentDate: todayKey,
      currentTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
      tasks: tasks.slice(0, 15).map((t) => ({ id: t.id, title: t.title, dueDate: t.dueDate, completed: t.completed, priority: t.priority })),
      schedule: schedule.slice(0, 15).map((s) => ({ id: s.id, title: s.title, date: s.date, startTime: s.startTime, endTime: s.endTime })),
      habits: habits.map((h) => ({ id: h.id, title: h.title, streak: h.streak, completedToday: h.completedDates?.includes(todayKey) })),
      goals: goals.map((g) => ({ id: g.id, title: g.title, progress: g.progress }))
    };

    try {
      const result = await sendChatMessage({
        message: text,
        conversation: updatedMessages.map((m) => ({ role: m.role, content: m.text })),
        context
      });

      const aiMsg = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        text: result.message || 'I processed your request.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);

      if (result.action) {
        executeAiAction(result.action);
      }
    } catch (err) {
      console.error('Error receiving AI response:', err);
      const fallbackMsg = {
        id: `ai-err-${Date.now()}`,
        role: 'assistant',
        text: 'AURA AI is temporarily unavailable. Your planner data is safe. Please try again.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Start New Chat Thread
  const handleNewChat = () => {
    const newId = `chat-${Date.now()}`;
    setActiveChatId(newId);
    setMessages([]);
    setPendingConfirmation(null);
  };

  // Select Chat from History
  const handleSelectHistory = (item) => {
    setActiveChatId(item.id);
    const storedMap = loadStoredConversations();
    setMessages(storedMap[item.id] || []);
    setPendingConfirmation(null);
  };

  // Toggle Pin on History Item
  const handleTogglePin = (e, id) => {
    e.stopPropagation();
    setHistoryItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, pinned: !item.pinned } : item))
    );
    showToast('Pin status updated.', 'indigo');
  };

  // Delete History Item permanently from state & storage
  const handleDeleteHistory = (e, id) => {
    e.stopPropagation();
    setHistoryItems((prev) => prev.filter((item) => item.id !== id));
    
    // Clear conversation map entry for this id
    const nextMap = { ...conversationsMap };
    delete nextMap[id];
    setConversationsMap(nextMap);
    saveStoredConversations(nextMap);

    if (id === activeChatId) {
      handleNewChat();
    }
    showToast('Chat removed permanently.', 'rose');
  };

  // Clear all conversation history completely
  const handleClearAllHistory = () => {
    if (window.confirm('Are you sure you want to delete all AI chat history? This cannot be undone.')) {
      clearAllAIConversations();
      setHistoryItems([]);
      setConversationsMap({});
      handleNewChat();
      showToast('All chat history cleared.', 'rose');
    }
  };

  return (
    <div className="space-y-3.5 animate-fade-in flex flex-col h-[calc(100vh-128px)] min-h-0">
      {/* Compact Top Header Toolbar */}
      <Card className="p-3.5 border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-xs shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-60 blur-xs" />
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/25">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight font-heading">
                  AURA AI
                </h1>
                <Badge variant="purple">BETA</Badge>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold font-heading">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> AI Connected
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Your empathetic, intelligent planning companion
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={handleNewChat} variant="primary" size="xs" icon={Plus}>
              New Chat
            </Button>

            {historyItems.length > 0 && (
              <button
                onClick={handleClearAllHistory}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 border border-slate-200/80 dark:border-slate-800 transition-colors cursor-pointer"
                title="Clear All Chat History"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 font-heading">
              <CalendarIcon className="w-3.5 h-3.5 text-indigo-500" /> {todayFormatted}
            </span>

            <button
              onClick={() => setShowRightPanel(!showRightPanel)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                showRightPanel
                  ? 'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/30'
                  : 'border-slate-200/80 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={showRightPanel ? 'Hide Context Panel' : 'Show Context Panel'}
            >
              <PanelRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>

      {/* Main Content Area (3-Column Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 flex-1 min-h-0">
        {/* CENTER: Main Conversation Workspace */}
        <div className={`${showRightPanel ? 'lg:col-span-8' : 'lg:col-span-12'} flex flex-col h-full min-h-0`}>
          <Card className="p-4 sm:p-5 h-full flex flex-col overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#18191c] shadow-xs relative">
            
            {/* Scrollable Conversation Stream */}
            <div className="flex-1 overflow-y-auto space-y-5 pr-1.5 min-h-0 pb-2">
              {messages.length === 0 ? (
                <AIWelcome onSelectAction={handleSendMessage} />
              ) : (
                <>
                  {/* Date Separator */}
                  <div className="flex items-center justify-center my-3">
                    <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 text-[11px] font-bold text-slate-500 dark:text-slate-400 font-heading shadow-xs">
                      Today · {todayFormatted}
                    </span>
                  </div>

                  {/* Messages */}
                  <div className="space-y-4 max-w-3xl mx-auto">
                    {messages.map((msg) => {
                      const isUser = msg.role === 'user';
                      return (
                        <div
                          key={msg.id}
                          className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                        >
                          {!isUser && (
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20 mt-0.5">
                              <Sparkles className="w-4 h-4 text-white" />
                            </div>
                          )}

                          <div className="space-y-1 max-w-[85%] sm:max-w-[78%]">
                            <div
                              className={`p-3.5 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed font-sans shadow-xs whitespace-pre-wrap ${
                                isUser
                                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-xs shadow-indigo-500/15'
                                  : 'bg-slate-50 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 text-slate-900 dark:text-slate-100 rounded-tl-xs'
                              }`}
                            >
                              {msg.text}
                            </div>
                            <span
                              className={`block text-[10px] font-medium text-slate-400 px-1 ${
                                isUser ? 'text-right' : 'text-left'
                              }`}
                            >
                              {msg.time}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    {loading && (
                      <div className="flex items-center gap-3 justify-start">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
                          <Sparkles className="w-4 h-4 text-white animate-spin" />
                        </div>
                        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-2.5">
                          <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                          <span>AURA is thinking...</span>
                        </div>
                      </div>
                    )}

                    {/* Action Confirmation Banner */}
                    {pendingConfirmation && (
                      <div className="p-4 rounded-2xl border border-indigo-200 dark:border-indigo-500/40 bg-indigo-50/90 dark:bg-indigo-950/60 backdrop-blur-sm text-left space-y-3 shadow-lg animate-fade-in max-w-xl mx-auto my-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-extrabold text-xs font-heading">
                            {pendingConfirmation.intent === 'create_journal_summary' ? (
                              <BookOpen className="w-4 h-4 text-indigo-500" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-amber-500" />
                            )}
                            <span>
                              {pendingConfirmation.intent === 'create_journal_summary'
                                ? "Add to Today's Journal?"
                                : 'Confirm Planner Action'}
                            </span>
                          </div>
                          <button
                            onClick={() => setPendingConfirmation(null)}
                            className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                          {pendingConfirmation.intent === 'create_journal_summary'
                            ? `Here is the reflection generated for your daily journal:`
                            : `Are you sure you want to delete "${pendingConfirmation.parameters?.title}"?`}
                        </p>

                        {pendingConfirmation.parameters?.summary && (
                          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 italic font-sans leading-relaxed shadow-inner">
                            "{pendingConfirmation.parameters.summary}"
                          </div>
                        )}

                        <div className="flex items-center gap-2 pt-1">
                          <Button
                            variant={pendingConfirmation.intent.includes('delete') ? 'rose' : 'primary'}
                            size="sm"
                            onClick={handleConfirmPendingAction}
                            icon={pendingConfirmation.intent.includes('delete') ? Trash2 : BookOpen}
                          >
                            {pendingConfirmation.intent === 'create_journal_summary'
                              ? 'Add to Journal'
                              : 'Confirm Delete'}
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setPendingConfirmation(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>
                </>
              )}
            </div>

            {/* Sticky Composer */}
            <AIComposer onSend={handleSendMessage} />
          </Card>
        </div>

        {/* RIGHT: AI Context & History Panel */}
        {showRightPanel && (
          <div className="lg:col-span-4 h-full min-h-0">
            <AIContextPanel
              historyItems={historyItems}
              activeChatId={activeChatId}
              onNewChat={handleNewChat}
              onSelectHistory={handleSelectHistory}
              onTogglePin={handleTogglePin}
              onDeleteHistory={handleDeleteHistory}
            />
          </div>
        )}
      </div>
    </div>
  );
};
