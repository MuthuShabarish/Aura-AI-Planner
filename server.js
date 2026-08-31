import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Groq } from 'groq-sdk';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

app.use(cors());
app.use(express.json());

// Dynamically get or initialize Groq SDK client
const getGroqClient = () => {
  dotenv.config({ override: true });
  const apiKey = (process.env.GROQ_API_KEY || '').trim();
  if (apiKey && apiKey !== '' && !apiKey.startsWith('YOUR_')) {
    try {
      return new Groq({ apiKey });
    } catch (err) {
      console.warn('[AURA AI Backend] Failed to initialize Groq SDK:', err.message);
      return null;
    }
  }
  return null;
};

const SYSTEM_PROMPT = `
You are AURA, a warm, highly friendly, empathetic, encouraging, intelligent, and natural AI personal planning companion inside the AURA Personal Planner app.

PERSONALITY & TONAL GUIDELINES:
1. WARM & HUMAN: Talk like a supportive, smart friend or personal assistant. Be encouraging, warm, conversational, and genuinely supportive when the user accomplishes something or checks in.
2. CELEBRATE PROGRESS: When the user mentions finishing a session, completing a task, or achieving a milestone, celebrate enthusiastically (e.g. "Woohoo! Great job finishing that session! 🎉").
3. CONCISE & CALM: Keep messages natural and easy to read. Avoid robotic corporate jargon.
4. FLEXIBLE CHAT & ACTION:
   - For general chat, celebrations, advice, or questions, reply naturally with a warm message and set "action": null.
   - For explicit requests to add tasks, schedule sessions, track habits, or set goals, return the appropriate structured action JSON.

SYSTEM INSTRUCTIONS:
1. PRIMARY ROLE: Help the user manage tasks, schedules, habits, goals, and daily journal entries naturally.
2. NATURAL LANGUAGE & TYPO TOLERANCE: Understand typos, misspellings ("studing", "tomorow", "practce", "shdule"), missing punctuation, informal phrasing, and casual phrasing.
3. DATE & TIME AWARENESS:
   - Always reference the provided context.currentDate, context.currentTime, and context.timezone.
   - "today" = context.currentDate.
   - "tomorrow" = next calendar day from context.currentDate.
   - "yesterday" = previous calendar day.
   - When times like "6 PM" or "6" are mentioned for today/tomorrow, convert to 12-hour format ("06:00 PM") or ISO date.
4. EXPLICIT USER INTENT RULE:
   - Do NOT autonomously reschedule unrelated tasks, reorganize the user's day, or invent schedules the user did not request.
   - If required parameters (like start time for a study session) are missing, ask a short, natural clarification question instead of guessing.
5. STRUCTURED ACTION JSON FORMAT:
   You MUST return a SINGLE valid JSON object with the following schema:
   {
     "message": "Warm natural text response for the user",
     "action": null | {
       "intent": "create_task" | "toggle_task" | "delete_task" | "create_schedule" | "delete_schedule" | "create_habit" | "complete_habit" | "create_goal" | "create_journal_summary" | "none",
       "parameters": { ... },
       "requiresConfirmation": boolean
     }
   }

INTENT PARAMETER SCHEMAS:
- create_task: { "title": string, "dueDate": "YYYY-MM-DD", "dueTime": "HH:MM AM/PM", "priority": "High" | "Medium" | "Low", "category": "Work" | "Personal" | "Study" | "Career" }
- toggle_task: { "title": string } (or matching task title)
- delete_task: { "title": string } (set requiresConfirmation: true for deletions)
- create_schedule: { "title": string, "date": "YYYY-MM-DD", "startTime": "HH:MM AM/PM", "endTime": "HH:MM AM/PM", "category": "Study" | "Class" | "Work" | "Health" | "Personal" }
- delete_schedule: { "title": string } (set requiresConfirmation: true)
- create_habit: { "title": string, "category": "Health" | "Personal" | "Wellness" }
- complete_habit: { "title": string }
- create_goal: { "title": string, "targetDate": "YYYY-MM-DD", "category": "Career" | "Learning" | "Design" | "Personal" }
- create_journal_summary: { "date": "YYYY-MM-DD", "summary": "Concise natural daily reflection summary based on conversation history" } (set requiresConfirmation: true)

Make sure your output is strictly a valid JSON object.
`;

// Advanced Natural Language Processing Engine for Smart Fallback
const handleLocalFallback = (userMessage, context = {}) => {
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

// API Endpoint: POST /api/ai/chat
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, conversation = [], context = {} } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message content is required.' });
    }

    // Attempt Groq SDK if configured with a key
    const client = getGroqClient();
    if (client) {
      const activeModel = (process.env.GROQ_MODEL || 'openai/gpt-oss-120b').trim();
      const groqMessages = [
        { role: 'system', content: `${SYSTEM_PROMPT}\nCurrent Date Context: ${JSON.stringify(context)}` }
      ];

      const recentHistory = conversation.slice(-10);
      for (const msg of recentHistory) {
        if (msg.role && msg.content) {
          groqMessages.push({ role: msg.role === 'user' ? 'user' : 'assistant', content: msg.content });
        }
      }

      groqMessages.push({ role: 'user', content: message.trim() });

      // Helper to attempt completion with fallback models
      const tryCompletion = async (modelToUse) => {
        try {
          return await client.chat.completions.create({
            messages: groqMessages,
            model: modelToUse,
            temperature: 0.3
          });
        } catch (err) {
          if (modelToUse !== 'openai/gpt-oss-20b') {
            console.warn(`[AURA AI Backend] Model "${modelToUse}" failed (${err.message}). Retrying with openai/gpt-oss-20b...`);
            return await client.chat.completions.create({
              messages: groqMessages,
              model: 'openai/gpt-oss-20b',
              temperature: 0.3
            });
          }
          throw err;
        }
      };

      try {
        const completion = await tryCompletion(activeModel);
        const rawContent = completion.choices[0]?.message?.content;
        if (rawContent) {
          try {
            const parsed = JSON.parse(rawContent);
            return res.json({
              message: parsed.message || 'I processed your request.',
              action: parsed.action || null
            });
          } catch (parseErr) {
            return res.json({ message: rawContent, action: null });
          }
        }
      } catch (groqErr) {
        console.error('[AURA AI Backend] Groq API call failed:', groqErr.message);
      }
    }

    // Smart Local NLP Engine Fallback when GROQ_API_KEY is not set or API fails
    const fallbackResponse = handleLocalFallback(message, context);
    return res.json(fallbackResponse);

  } catch (err) {
    console.error('[AURA AI Backend] Internal Server Error:', err);
    return res.status(500).json({
      error: 'AURA AI is temporarily unavailable. Your planner data is safe. Please try again.',
      message: 'AURA AI is temporarily unavailable. Your planner data is safe. Please try again.',
      action: null
    });
  }
});

// Health check endpoint
app.get('/api/ai/health', (req, res) => {
  const client = getGroqClient();
  res.json({
    status: 'online',
    provider: client ? 'Groq' : 'Local NLP Engine',
    model: GROQ_MODEL
  });
});

const server = app.listen(PORT, () => {
  console.log(`[AURA AI Server] Backend API running on http://localhost:${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`[AURA AI Server] Port ${PORT} is already in use by another process.`);
  } else {
    console.error('[AURA AI Server] Server error:', err);
  }
});
