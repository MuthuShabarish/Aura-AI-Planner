/**
 * Deterministic Calendar & Time Utilities for AURA Personal Planner
 */

export const parseTimeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = match[3];

  if (ampm) {
    if (ampm.toUpperCase() === 'PM' && hours < 12) hours += 12;
    if (ampm.toUpperCase() === 'AM' && hours === 12) hours = 0;
  }
  return hours * 60 + minutes;
};

export const formatMinutesToTime = (minutesTotal) => {
  const mins = Math.max(0, Math.min(1439, minutesTotal));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 === 0 ? 12 : h % 12;
  const displayM = String(m).padStart(2, '0');
  return `${displayH}:${displayM} ${ampm}`;
};

/**
 * Calculates open available time windows including event buffer padding
 */
export const findAvailableTimeWindowsWithBuffers = ({
  currentTimeMins = 540, // 9:00 AM
  bedtimeMins = 1380,   // 11:00 PM
  fixedEvents = [],
  eventBufferMins = 15
} = {}) => {
  const dayStart = Math.max(0, currentTimeMins);
  const dayEnd = Math.min(1440, bedtimeMins);

  if (dayStart >= dayEnd) return [];

  const bufferedEvents = [...fixedEvents]
    .map((e) => {
      const startMins = parseTimeToMinutes(e.time || e.startTime) || dayStart;
      const endMins = parseTimeToMinutes(e.endTime) || (startMins + 60);
      return {
        title: e.title,
        start: Math.max(dayStart, startMins - eventBufferMins),
        end: Math.min(dayEnd, endMins + eventBufferMins)
      };
    })
    .filter((e) => e.end > e.start)
    .sort((a, b) => a.start - b.start);

  const availableWindows = [];
  let pointer = dayStart;

  for (const event of bufferedEvents) {
    if (event.start > pointer) {
      availableWindows.push({
        start: pointer,
        end: Math.min(event.start, dayEnd),
        duration: Math.min(event.start, dayEnd) - pointer
      });
    }
    pointer = Math.max(pointer, event.end);
  }

  if (pointer < dayEnd) {
    availableWindows.push({
      start: pointer,
      end: dayEnd,
      duration: dayEnd - pointer
    });
  }

  return availableWindows.filter((w) => w.duration >= 15);
};

/**
 * Evaluates calendar conflicts between overlapping events
 */
export const evaluateCalendarConflicts = ({ schedule = [] }) => {
  const conflicts = [];
  const eventsByDate = {};

  schedule.forEach((evt) => {
    if (!evt.date) return;
    if (!eventsByDate[evt.date]) eventsByDate[evt.date] = [];
    eventsByDate[evt.date].push(evt);
  });

  Object.entries(eventsByDate).forEach(([date, events]) => {
    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        const a = events[i];
        const b = events[j];
        const aStart = parseTimeToMinutes(a.startTime || a.time);
        const aEnd = parseTimeToMinutes(a.endTime) || (aStart + 60);
        const bStart = parseTimeToMinutes(b.startTime || b.time);
        const bEnd = parseTimeToMinutes(b.endTime) || (bStart + 60);

        if (aStart < bEnd && aEnd > bStart) {
          conflicts.push({
            id: `conflict-${a.id}-${b.id}`,
            date,
            eventA: a,
            eventB: b,
            message: `"${a.title}" overlaps with "${b.title}"`
          });
        }
      }
    }
  });

  return conflicts;
};

export const parseHour = (timeStr) => {
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

export const generateHoursList = (wakeUpTime = '07:00', sleepTime = '23:00') => {
  let startHour = 7;
  let endHour = 23;

  if (wakeUpTime) {
    const parsedStart = parseHour(wakeUpTime);
    if (parsedStart !== -1) startHour = parsedStart;
  }
  if (sleepTime) {
    const parsedEnd = parseHour(sleepTime);
    if (parsedEnd !== -1) endHour = parsedEnd;
  }

  if (endHour <= startHour) {
    endHour += 24;
  }

  const hours = [];
  for (let h = startHour; h <= endHour; h++) {
    const displayHour = h % 24;
    const ampm = displayHour >= 12 ? 'PM' : 'AM';
    const hour12 = displayHour % 12 === 0 ? 12 : displayHour % 12;
    hours.push(`${hour12} ${ampm}`);
  }
  return hours;
};
