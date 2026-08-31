import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { generateHoursList } from '../utils/calendarUtils';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Edit3,
  List,
  Grid
} from 'lucide-react';

const parseHour = (timeStr) => {
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

const getDayNameFromDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[d.getDay()];
};

const isEventOnDay = (evt, targetDayName) => {
  if (!evt) return false;
  if (evt.day && evt.day.toLowerCase().slice(0, 3) === targetDayName.toLowerCase().slice(0, 3)) return true;
  if (evt.date) {
    const dayFromDate = getDayNameFromDate(evt.date);
    if (dayFromDate.toLowerCase().slice(0, 3) === targetDayName.toLowerCase().slice(0, 3)) return true;
  }
  return false;
};

export const ScheduleView = () => {
  const { schedule, addEvent, updateEvent, deleteEvent, settings, categories = [], setShowCategoryManagerModal } = useApp();
  const [viewMode, setViewMode] = useState('week'); // 'week' | 'day' | 'list'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [currentDate, setCurrentDate] = useState(() => new Date());

  // Form State
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState('10:00 AM');
  const [endTime, setEndTime] = useState('11:30 AM');
  const [category, setCategory] = useState('Work');
  const [location, setLocation] = useState('');

  const handlePrevWeek = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 7);
      return d;
    });
  };

  const handleNextWeek = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7);
      return d;
    });
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const weekDays = useMemo(() => {
    const d = new Date(currentDate);
    const day = d.getDay();
    const diffToMon = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.getFullYear(), d.getMonth(), diffToMon);

    const todayStr = new Date().toISOString().slice(0, 10);
    const days = [];

    for (let i = 0; i < 7; i++) {
      const colDate = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);

      const year = colDate.getFullYear();
      const month = String(colDate.getMonth() + 1).padStart(2, '0');
      const dayNum = String(colDate.getDate()).padStart(2, '0');
      const isoDate = `${year}-${month}-${dayNum}`;

      const dayName = colDate.toLocaleDateString('en-US', { weekday: 'short' });
      const displayDayNum = colDate.getDate();
      const isToday = isoDate === todayStr;

      days.push({
        name: dayName,
        dateNum: displayDayNum,
        isoDate,
        isToday
      });
    }
    return days;
  }, [currentDate]);

  const hoursList = useMemo(() => {
    const wakeUp = settings?.wakeUpTime || settings?.workingHoursStart || '07:00';
    const sleep = settings?.sleepTime || settings?.workingHoursEnd || '23:00';
    return generateHoursList(wakeUp, sleep);
  }, [settings?.wakeUpTime, settings?.sleepTime, settings?.workingHoursStart, settings?.workingHoursEnd]);

  const categoryStyles = {
    Study: { bg: 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60', text: 'text-amber-900 dark:text-amber-200', tag: 'orange' },
    Class: { bg: 'bg-sky-50/90 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/60', text: 'text-sky-900 dark:text-sky-200', tag: 'blue' },
    Work: { bg: 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60', text: 'text-rose-900 dark:text-rose-200', tag: 'pink' },
    Health: { bg: 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60', text: 'text-emerald-900 dark:text-emerald-200', tag: 'green' },
    Personal: { bg: 'bg-indigo-50/90 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/60', text: 'text-indigo-900 dark:text-indigo-200', tag: 'purple' }
  };

  const openCreateModal = () => {
    setEditingEvent(null);
    setTitle('');
    setDate(new Date().toISOString().slice(0, 10));
    setStartTime('10:00 AM');
    setEndTime('11:30 AM');
    setCategory('Work');
    setLocation('');
    setIsModalOpen(true);
  };

  const openEditModal = (evt) => {
    setEditingEvent(evt);
    setTitle(evt.title || '');
    setDate(evt.date || new Date().toISOString().slice(0, 10));
    setStartTime(evt.startTime || '10:00 AM');
    setEndTime(evt.endTime || '11:30 AM');
    setCategory(evt.category || 'Work');
    setLocation(evt.location || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!title.trim()) return;
    const day = getDayNameFromDate(date) || 'Thu';
    const formattedTime = `${startTime} – ${endTime}`;

    if (editingEvent) {
      updateEvent(editingEvent.id, { title, date, day, startTime, endTime, time: formattedTime, category, location });
    } else {
      addEvent({ title, date, day, startTime, endTime, time: formattedTime, category, location });
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (editingEvent) {
      deleteEvent(editingEvent.id);
      setIsModalOpen(false);
    }
  };

  const filteredSchedule = useMemo(() => {
    if (selectedCategory === 'All') return schedule;
    return schedule.filter((evt) => evt.category === selectedCategory);
  }, [schedule, selectedCategory]);

  const formattedWeekHeader = useMemo(() => {
    if (!weekDays || weekDays.length === 0) return '';
    const start = weekDays[0];
    const end = weekDays[6];
    const startDate = new Date(start.isoDate + 'T00:00:00');
    const endDate = new Date(end.isoDate + 'T00:00:00');

    const startStr = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endStr = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${startStr} – ${endStr}`;
  }, [weekDays]);

  return (
    <div className="space-y-4 animate-fade-in flex flex-col h-[calc(100vh-120px)] min-h-0">
      {/* Unified Compact Top Header Toolbar */}
      <Card className="p-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Title & Date Nav */}
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight font-heading">Schedule</h1>
            
            <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-xl p-0.5 bg-slate-50/50 dark:bg-slate-900/50">
              <button
                onClick={handlePrevWeek}
                className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                aria-label="Previous week"
                title="Previous week"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleToday}
                className="px-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 font-heading cursor-pointer hover:text-primary transition-colors"
              >
                Today
              </button>
              <button
                onClick={handleNextWeek}
                className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                aria-label="Next week"
                title="Next week"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline-flex items-center gap-1 font-heading">
              <CalendarIcon className="w-3.5 h-3.5 text-primary" /> {formattedWeekHeader}
            </span>
          </div>

          {/* Category Filter Chips & View Mode Switcher */}
          <div className="flex items-center gap-2 flex-wrap justify-between md:justify-end">
            <div className="flex items-center gap-1 flex-wrap">
              {['All', ...categories.map((c) => c.name)].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all font-heading cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-primary text-white shadow-primary'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
              <button
                onClick={() => setShowCategoryManagerModal(true)}
                className="px-2 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                + Manage
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setViewMode('week')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all font-heading flex items-center gap-1 cursor-pointer ${
                    viewMode === 'week'
                      ? 'bg-white dark:bg-slate-900 text-primary shadow-xs'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                  title="Grid View"
                >
                  <Grid className="w-3.5 h-3.5" /> Week
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all font-heading flex items-center gap-1 cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-slate-900 text-primary shadow-xs'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                  title="List View"
                >
                  <List className="w-3.5 h-3.5" /> List
                </button>
              </div>

              <Button onClick={openCreateModal} variant="primary" size="sm" icon={Plus}>
                Add Event
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Content Area (Fits cleanly in viewport) */}
      <div className="flex-1 min-h-0">
        {viewMode === 'week' ? (
          <Card className="p-0 h-full flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            {/* Header Row */}
            <div className="grid grid-cols-8 border-b border-slate-200 dark:border-slate-800 text-center bg-slate-50/80 dark:bg-slate-900/90 shrink-0">
              <div className="p-2 border-r border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400 dark:text-slate-500 font-heading flex items-center justify-center">
                Time
              </div>
              {weekDays.map((dayObj) => (
                <div
                  key={dayObj.isoDate}
                  className={`p-2 border-r border-slate-200 dark:border-slate-800 last:border-r-0 ${
                    dayObj.isToday ? 'bg-primary-light/60 dark:bg-indigo-950/40' : ''
                  }`}
                >
                  <span className={`text-[10px] font-bold uppercase font-heading ${dayObj.isToday ? 'text-primary font-extrabold' : 'text-slate-400 dark:text-slate-500'}`}>
                    {dayObj.name}
                  </span>
                  <p className={`text-xs font-bold mt-0.5 font-heading ${dayObj.isToday ? 'text-primary font-extrabold scale-105' : 'text-slate-900 dark:text-white'}`}>
                    {dayObj.dateNum}
                  </p>
                </div>
              ))}
            </div>

            {/* Scrollable Hours Body */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 min-h-0">
              {hoursList.map((hour) => (
                <div key={hour} className="grid grid-cols-8 min-h-[44px]">
                  <div className="p-1.5 border-r border-slate-200 dark:border-slate-800 text-[10px] font-semibold text-slate-400 dark:text-slate-500 text-center flex items-center justify-center font-heading">
                    {hour}
                  </div>
                  {weekDays.map((dayObj) => {
                    const matchedEvent = filteredSchedule.find((e) => {
                      const eventHour = parseHour(e.startTime || e.time);
                      const cellHour = parseHour(hour);
                      const hourMatch = eventHour !== -1 && cellHour !== -1 ? eventHour === cellHour : (e.time?.includes(hour) || e.startTime?.includes(hour.split(' ')[0]));
                      const dateMatch = e.date ? e.date === dayObj.isoDate : isEventOnDay(e, dayObj.name);
                      return hourMatch && dateMatch;
                    });
                    const style = matchedEvent ? categoryStyles[matchedEvent.category || 'Work'] || categoryStyles.Work : null;

                    return (
                      <div
                        key={dayObj.isoDate}
                        className={`p-0.5 border-r border-slate-100 dark:border-slate-800/60 last:border-r-0 relative group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 ${
                          dayObj.isToday ? 'bg-primary-light/10 dark:bg-indigo-950/10' : ''
                        }`}
                      >
                        {matchedEvent && style ? (
                          <div
                            onClick={() => openEditModal(matchedEvent)}
                            className={`h-full w-full p-1.5 rounded-lg border ${style.bg} cursor-pointer transition-all hover:scale-[1.01] shadow-xs flex flex-col justify-between`}
                          >
                            <div>
                              <h5 className={`font-bold text-[11px] leading-tight ${style.text} truncate font-heading`}>{matchedEvent.title}</h5>
                              <p className="text-[9px] text-slate-600 dark:text-slate-400 truncate font-medium mt-0.5">
                                {matchedEvent.startTime || matchedEvent.time}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingEvent(null);
                              setTitle('');
                              setDate(dayObj.isoDate);
                              setStartTime(hour);
                              setEndTime(hour);
                              setCategory('Work');
                              setLocation('');
                              setIsModalOpen(true);
                            }}
                            className="w-full h-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-slate-300 dark:text-slate-600 hover:text-primary transition-opacity cursor-pointer"
                            aria-label={`Add event at ${hour} on ${dayObj.name} ${dayObj.dateNum}`}
                            title={`Add event at ${hour} on ${dayObj.name} ${dayObj.dateNum}`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <div className="h-full overflow-y-auto pr-1 space-y-3">
            {filteredSchedule.length === 0 ? (
              <EmptyState
                icon={CalendarIcon}
                title="No events scheduled"
                description="Add events to your calendar to keep track of meetings, classes, and study blocks."
                actionLabel="Add Event"
                onAction={openCreateModal}
              />
            ) : (
              <div className="space-y-3 max-w-5xl mx-auto pb-4">
                {filteredSchedule.map((evt) => {
                  const style = categoryStyles[evt.category || 'Work'] || categoryStyles.Work;
                  const formattedDate = evt.date
                    ? new Date(evt.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
                    : (evt.day || 'Today');

                  return (
                    <div
                      key={evt.id}
                      className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18191c] hover:border-primary/50 transition-all shadow-xs group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      {/* Left: Indicator & Title Info */}
                      <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                        {/* Category Accent Bar */}
                        <div
                          className={`w-1.5 h-12 rounded-full shrink-0 ${
                            style.tag === 'orange'
                              ? 'bg-amber-500'
                              : style.tag === 'blue'
                              ? 'bg-sky-500'
                              : style.tag === 'pink'
                              ? 'bg-rose-500'
                              : style.tag === 'green'
                              ? 'bg-emerald-500'
                              : 'bg-primary'
                          }`}
                        />

                        <div className="space-y-1.5 min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant={style.tag}>{evt.category || 'General'}</Badge>
                            <span className="text-xs font-semibold text-slate-400 dark:text-slate-400 flex items-center gap-1 font-heading">
                              <CalendarIcon className="w-3.5 h-3.5 text-primary" />
                              {formattedDate}
                            </span>
                          </div>

                          <h4 className="text-base font-bold text-slate-900 dark:text-white font-heading truncate">
                            {evt.title}
                          </h4>

                          {evt.description && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                              {evt.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Middle: Time & Location Badges */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300 font-medium shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
                          <Clock className="w-3.5 h-3.5 text-primary" />
                          <span className="font-semibold">{evt.time || `${evt.startTime || '10:00 AM'} – ${evt.endTime || '11:30 AM'}`}</span>
                        </div>

                        {evt.location && (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span className="truncate max-w-[150px]">{evt.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-1 shrink-0 self-end sm:self-center opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditModal(evt)}
                          className="p-2 text-slate-400 hover:text-primary rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Edit Event"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteEvent(evt.id)}
                          className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add / Edit Event Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEvent ? 'Edit Event' : 'Add Calendar Event'}
        subtitle={editingEvent ? 'Modify existing schedule details' : 'Schedule a new event on your calendar'}
        footer={
          <>
            {editingEvent && (
              <Button type="button" variant="danger" icon={Trash2} onClick={handleDelete} className="mr-auto">
                Delete
              </Button>
            )}
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="add-event-form" variant="primary">
              {editingEvent ? 'Save Changes' : 'Create Event'}
            </Button>
          </>
        }
      >
        <form id="add-event-form" onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Event Title</label>
            <input
              type="text"
              placeholder="e.g. Project Sync, UI Study Session"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="aura-input text-slate-900 dark:text-white"
              required
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="aura-input text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => {
                  if (e.target.value === '__MANAGE_CATEGORIES__') {
                    setShowCategoryManagerModal(true);
                  } else {
                    setCategory(e.target.value);
                  }
                }}
                className="aura-input text-slate-900 dark:text-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
                <option value="__MANAGE_CATEGORIES__">+ Manage Categories...</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Start Time</label>
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="10:00 AM"
                className="aura-input text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">End Time</label>
              <input
                type="text"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="11:30 AM"
                className="aura-input text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Location / Link</label>
            <input
              type="text"
              placeholder="e.g. Room 302 or Zoom link"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="aura-input text-slate-900 dark:text-white"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};