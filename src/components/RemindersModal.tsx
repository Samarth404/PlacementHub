import React, { useState } from 'react';
import {
  Bell,
  Calendar,
  Clock,
  CheckCircle,
  Plus,
  Trash2,
  Download,
  ExternalLink,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { Reminder, CompanyDrive } from '../types/placement';

interface RemindersModalProps {
  reminders: Reminder[];
  drives: CompanyDrive[];
  onToggleComplete: (reminderId: string) => void;
  onAddReminder: (reminder: Reminder) => void;
  onDeleteReminder: (reminderId: string) => void;
}

export const RemindersModal: React.FC<RemindersModalProps> = ({
  reminders,
  drives,
  onToggleComplete,
  onAddReminder,
  onDeleteReminder,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('2026-11-05');
  const [newTime, setNewTime] = useState('11:00 AM');
  const [newType, setNewType] = useState<Reminder['type']>('Application Deadline');

  // Generate standard RFC 5545 iCalendar .ics file
  const downloadICS = (reminder: Reminder) => {
    const title = reminder.title;
    // Format date string to YYYYMMDDTHHMMSSZ (UTC or local)
    const cleanDate = reminder.dueDate.replace(/-/g, '');
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CampusPlace//Placement Tracking System//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `SUMMARY:${title}`,
      `DESCRIPTION:Campus Placement Reminder: ${title} (${reminder.type})`,
      `DTSTART:${cleanDate}T090000Z`,
      `DTEND:${cleanDate}T100000Z`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT15M',
      'ACTION:DISPLAY',
      'DESCRIPTION:Reminder',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Google Calendar URL generator
  const getGoogleCalendarUrl = (reminder: Reminder) => {
    const cleanDate = reminder.dueDate.replace(/-/g, '');
    const text = encodeURIComponent(reminder.title);
    const details = encodeURIComponent(`Campus Placement Reminder for ${reminder.type}. Tracked via CampusPlace.`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${cleanDate}T090000Z/${cleanDate}T100000Z&details=${details}`;
  };

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const reminder: Reminder = {
      id: `rem-${Date.now().toString().slice(-4)}`,
      title: newTitle,
      dueDate: newDate,
      dueTime: newTime,
      type: newType,
      isCompleted: false,
      notifyMethod: 'In-App',
    };

    onAddReminder(reminder);
    setNewTitle('');
    setShowAddForm(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-amber-100 text-amber-700">
              <Bell className="w-4 h-4" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Placement Deadlines &amp; Interview Reminders
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Never miss an application deadline, online test slot, or technical interview. Sync with Google Calendar or Apple/Outlook.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Custom Reminder</span>
        </button>
      </div>

      {/* Add Reminder Form */}
      {showAddForm && (
        <form onSubmit={handleCreateReminder} className="bg-white p-5 rounded-xl border border-indigo-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Create New Placement Alert</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="font-semibold text-slate-700 block mb-1">Reminder Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Cisco Coding Round Test Link Submission"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Due Date</label>
              <input
                type="date"
                required
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Category / Type</label>
              <select
                value={newType}
                onChange={e => setNewType(e.target.value as Reminder['type'])}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Application Deadline">Application Deadline</option>
                <option value="Online Assessment">Online Assessment</option>
                <option value="Technical Interview">Technical Interview</option>
                <option value="HR Round">HR Round</option>
                <option value="Document Submission">Document Submission</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
            >
              Save Alert
            </button>
          </div>
        </form>
      )}

      {/* Reminders List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100">
        {reminders.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No active reminders scheduled.
          </div>
        ) : (
          reminders.map(rem => (
            <div
              key={rem.id}
              className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                rem.isCompleted ? 'bg-slate-50/60 opacity-60' : 'hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => onToggleComplete(rem.id)}
                  className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                    rem.isCompleted
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-slate-300 hover:border-indigo-600 bg-white'
                  }`}
                >
                  {rem.isCompleted && <CheckCircle className="w-3.5 h-3.5" />}
                </button>

                <div>
                  <h4
                    className={`text-sm font-semibold text-slate-900 ${
                      rem.isCompleted ? 'line-through text-slate-400' : ''
                    }`}
                  >
                    {rem.title}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1 font-mono-numbers">
                    <span className="flex items-center gap-1 text-slate-700 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {rem.dueDate}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {rem.dueTime}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="text-indigo-600 font-medium">{rem.type}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Add to GCal & .ICS download */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <a
                  href={getGoogleCalendarUrl(rem)}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1.5 text-[11px] font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1"
                  title="Add to Google Calendar"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Google Cal</span>
                </a>

                <button
                  type="button"
                  onClick={() => downloadICS(rem)}
                  className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
                  title="Download standard .ics file for Outlook, Apple, or mobile calendars"
                >
                  <Download className="w-3 h-3" />
                  <span>.ICS File</span>
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteReminder(rem.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                  title="Delete reminder"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
