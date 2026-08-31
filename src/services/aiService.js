const CONVERSATION_STORAGE_KEY = 'aura-ai-conversations-v1';
const HISTORY_ITEMS_STORAGE_KEY = 'aura-ai-history-items-v1';

// Local storage helpers for AI conversations grouped by date
export const loadStoredConversations = () => {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(CONVERSATION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error('Failed to load AI conversations from storage', e);
    return {};
  }
};

export const saveStoredConversations = (conversationsMap) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CONVERSATION_STORAGE_KEY, JSON.stringify(conversationsMap));
  } catch (e) {
    console.error('Failed to save AI conversations to storage', e);
  }
};

// Local storage helpers for conversation history list
export const loadStoredHistoryItems = () => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_ITEMS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load history items from storage', e);
    return [];
  }
};

export const saveStoredHistoryItems = (items) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(HISTORY_ITEMS_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save history items to storage', e);
  }
};

export const clearAllAIConversations = () => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(CONVERSATION_STORAGE_KEY);
    window.localStorage.removeItem(HISTORY_ITEMS_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear AI conversations from storage', e);
  }
};

// Smart Client-Side NLP Engine Fallback when Backend Server is Offline
export const handleLocalFallback = (userMessage, context = {}) => {
  const msgRaw = userMessage || '';
  const msgLower = msgRaw.toLowerCase().trim();
  const currentDate = context.currentDate || new Date().toISOString().slice(0, 10);

  // Calculate tomorrow
  const tom = new Date();
  tom.setDate(tom.getDate() + 1);
  const tomorrowDate = tom.toISOString().slice(0, 10);
  const isTomorrow = /\b(tomorrow|tomorow|tommw|tommorow)\b/i.test(msgLower);
  const targetDate = isTomorrow ? tomorrowDate : currentDate;

  // 1. GREETINGS & CASUAL CONVERSATION (Do NOT create tasks!)
  if (/^(hi|hello|hey|hey aura|howdy|sup|good morning|good afternoon|good evening|greetings)\b/i.test(msgLower) ||
      /\b(how are you|how r u|how are u|how are youuu|how's it going|how is it going|what's up|whats up)\b/i.test(msgLower)) {
    const greetings = [
      "I'm doing great and ready to help! What's on your mind today?",
      "Hello! I'm here and ready to keep your day organized. How can I help you?",
      "Hey there! Ready to plan your tasks, habits, or schedule?"
    ];
    const randomIndex = Math.floor(Math.random() * greetings.length);
    return {
      message: greetings[randomIndex],
      action: null
    };
  }

  // 2. GRATITUDE / ACKNOWLEDGEMENT
  if (/^(thanks|thank you|thx|cool|awesome|great|perfect|ok|okay|got it)\b/i.test(msgLower)) {
    return {
      message: "You're very welcome! Let me know whenever you need anything else.",
      action: null
    };
  }

  // 3. CAPABILITIES / QUESTIONS ("who are you", "what can you do", "help")
  if (/\b(who are you|what can you do|help|capabilities)\b/i.test(msgLower)) {
    return {
      message: "I'm AURA, your personal planning assistant! You can ask me to:\n• Add tasks ('remind me to study UI design')\n• Schedule events ('block time for math at 4 PM')\n• Track habits ('add daily reading habit')\n• Set goals ('set goal to finish portfolio')",
      action: null
    };
  }

  // 4. QUERY / READ ACTIONS ("show tasks", "what do i have today", "what's on my list")
  if (/\b(show|get|list|what|see|check|view|display)\b/i.test(msgLower) && /\b(task|tasks|schedule|habits|goals|today|list|agenda)\b/i.test(msgLower)) {
    const tasksList = context.tasks || [];
    const activeTasks = tasksList.filter((t) => !t.completed);

    if (activeTasks.length === 0) {
      return {
        message: `Your task list for ${isTomorrow ? 'tomorrow' : 'today'} is completely clear! 🌟`,
        action: null
      };
    }

    const taskTitles = activeTasks.map((t, idx) => `${idx + 1}. ${t.title}${t.priority ? ` (${t.priority} priority)` : ''}`).join('\n');
    return {
      message: `Here are your active tasks for ${isTomorrow ? 'tomorrow' : 'today'}:\n\n${taskTitles}`,
      action: null
    };
  }

  // 5. COMPLETE / TOGGLE TASK ("mark python practice complete", "done with python", "finish task")
  if (/\b(mark|complete|completed|done|finished|check off)\b/i.test(msgLower) && !/\b(how|what|why)\b/i.test(msgLower)) {
    let cleanTitle = msgRaw
      .replace(/^(hey aura|please|can you|mark|complete|completed|done|finished|as|task|check off)/gi, '')
      .replace(/(done|completed|as done|as completed)$/gi, '')
      .trim();

    if (!cleanTitle && context.tasks?.length > 0) {
      cleanTitle = context.tasks[0].title;
    }

    return {
      message: `Awesome! I've marked "${cleanTitle || 'task'}" as completed. Great job! 🎉`,
      action: {
        intent: 'toggle_task',
        parameters: { title: cleanTitle || 'task' },
        requiresConfirmation: false
      }
    };
  }

  // 6. DELETE / REMOVE ACTION ("delete task", "remove study", "cancel event")
  if (/\b(delete|remove|cancel|drop)\b/i.test(msgLower)) {
    const cleanTitle = msgRaw
      .replace(/^(hey aura|please|can you|delete|remove|cancel|drop|my|the|task|event|habit)/gi, '')
      .trim();

    return {
      message: `I found "${cleanTitle || 'item'}". Do you want me to delete it from your planner?`,
      action: {
        intent: 'delete_task',
        parameters: { title: cleanTitle || 'item' },
        requiresConfirmation: true
      }
    };
  }

  // 7. SCHEDULE / BLOCK TIME ("schedule study time", "block one hour for study", "put study at 6")
  if (/\b(schedule|block|calendar|event|slot)\b/i.test(msgLower)) {
    const timeMatch = msgLower.match(/(?:at\s+)?(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i);
    let parsedTime = '06:00 PM';
    if (timeMatch) {
      let rawTimeStr = timeMatch[1].trim();
      if (!rawTimeStr.includes('am') && !rawTimeStr.includes('pm')) {
        const num = parseInt(rawTimeStr, 10);
        if (num < 12) rawTimeStr = `${num}:00 PM`;
        else rawTimeStr = `${num}:00 AM`;
      }
      parsedTime = rawTimeStr.toUpperCase();
    }
    const hasTime = /\b(at|\d+\s*pm|\d+\s*am|\d{1,2}:\d{2})\b/i.test(msgLower);
    
    let cleanTitle = msgRaw
      .replace(/^(hey aura|please|can you|schedule|block|time|for|put|set|a|an)/gi, '')
      .replace(/(today|tomorrow|tomorow|tommw|at \d+.*|\d+ pm|\d+ am)/gi, '')
      .trim() || 'Focus & Study Session';

    if (!hasTime) {
      return {
        message: `Sure! I can help you schedule "${cleanTitle}". What time would you like to set it for today?`,
        action: null
      };
    }

    return {
      message: `Done! I've scheduled "${cleanTitle}" for ${isTomorrow ? 'tomorrow' : 'today'} at ${parsedTime}.`,
      action: {
        intent: 'create_schedule',
        parameters: {
          title: cleanTitle,
          date: targetDate,
          startTime: parsedTime,
          endTime: '07:00 PM',
          category: 'Study'
        },
        requiresConfirmation: false
      }
    };
  }

  // 8. HABIT CREATION ("add reading habit", "track habit water", "build habit")
  if (/\b(habit|streak|daily habit)\b/i.test(msgLower)) {
    const cleanTitle = msgRaw
      .replace(/^(hey aura|please|can you|add|create|track|build|as|a|habit|my)/gi, '')
      .replace(/(as a habit|habit)$/gi, '')
      .trim() || 'Daily Practice';

    return {
      message: `Got it! Added new habit "${cleanTitle}" to your daily tracker. Stay consistent! ⚡`,
      action: {
        intent: 'create_habit',
        parameters: { title: cleanTitle, category: 'Health' },
        requiresConfirmation: false
      }
    };
  }

  // 9. GOAL CREATION ("set goal to crack placement", "add goal master react")
  if (/\b(goal|target|milestone|objective)\b/i.test(msgLower)) {
    const cleanTitle = msgRaw
      .replace(/^(hey aura|please|can you|add|create|set|my|goal|to)/gi, '')
      .replace(/(as a goal|goal)$/gi, '')
      .trim() || 'New Milestone';

    return {
      message: `Goal locked in! I've added "${cleanTitle}" to your goals overview. 🎯`,
      action: {
        intent: 'create_goal',
        parameters: { title: cleanTitle, targetDate: '', category: 'Personal' },
        requiresConfirmation: false
      }
    };
  }

  // 10. EXPLICIT TASK CREATION (Requires explicit task keywords like "add task", "create task", "remind me", "todo", "need to")
  if (/\b(add task|create task|new task|remind me|todo|need to do|add a task|create a task|task for|task to)\b/i.test(msgLower) ||
      (/^\b(add|create|remind|put)\b/i.test(msgLower) && msgRaw.length > 5)) {

    let priority = 'Medium';
    if (/\b(high|urgent|important|top)\b/i.test(msgLower)) {
      priority = 'High';
    } else if (/\b(low|minor|whenever)\b/i.test(msgLower)) {
      priority = 'Low';
    }

    let cleanTitle = msgRaw
      .replace(/^(hey aura|please|can you|add a task|create a task|add task|create task|remind me to|need to|do|write down|put|a|an|new)/gi, '')
      .replace(/(high-priority|high priority|medium priority|low priority|priority|task for|task)/gi, '')
      .replace(/(tomorrow|tomorow|today|at \d+|\d+ pm|\d+ am)/gi, '')
      .trim() || msgRaw;

    if (!cleanTitle || cleanTitle.toLowerCase() === 'for') cleanTitle = 'New Task';

    return {
      message: `I've created a new ${priority !== 'Medium' ? priority + ' priority ' : ''}task "${cleanTitle}" for ${isTomorrow ? 'tomorrow' : 'today'}.`,
      action: {
        intent: 'create_task',
        parameters: { title: cleanTitle, dueDate: targetDate, priority, category: 'Personal' },
        requiresConfirmation: false
      }
    };
  }

  // 11. GENERAL CHAT / FALLBACK RESPONSE (Do NOT create task!)
  return {
    message: `I'm here to help you plan! You can ask me to add tasks, schedule study sessions, track habits, or manage your goals. What would you like to work on?`,
    action: null
  };
};

// Send message to Node.js backend (/api/ai/chat) with smart client-side fallback
export const sendChatMessage = async ({ message, conversation = [], context = {} }) => {
  try {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message,
        conversation,
        context
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn('API route /api/ai/chat fetch failed, attempting fallback endpoint:', error.message);
    
    // Direct fallback attempt if proxy is not configured
    try {
      const fallbackResponse = await fetch('http://localhost:3001/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, conversation, context })
      });
      if (fallbackResponse.ok) {
        return await fallbackResponse.json();
      }
    } catch (e) {
      // Direct server fetch failed
    }

    // Process with Smart Client-Side NLP Engine Fallback
    console.log('[AURA AI] Processing message via Smart Client-Side NLP Engine fallback.');
    return handleLocalFallback(message, context);
  }
};
