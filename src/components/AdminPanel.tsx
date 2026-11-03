import React, { useState } from 'react';
import { 
  Shield, Settings, Plus, Edit2, Trash2, RotateCcw, Download, 
  X, Check, AlertCircle, Save, Calendar, Users, MapPin, 
  Clock, IndianRupee, Eye, ExternalLink, Lock, Unlock 
} from 'lucide-react';
import { EventItem, FestivalDetails, RegistrationPass, EventCategory, EventDateShort } from '../types.ts';
import { SAMPLE_EVENTS, FESTIVAL_DETAILS as DEFAULT_FESTIVAL_DETAILS } from '../data/events.ts';
import { generateEventIcs, downloadIcsFile } from '../utils/calendar.ts';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  festivalDetails: FestivalDetails;
  onUpdateFestivalDetails: (updated: FestivalDetails) => void;
  events: EventItem[];
  onUpdateEvents: (updated: EventItem[]) => void;
  registeredPasses: RegistrationPass[];
  onDeletePass: (passId: string) => void;
  onClearAllPasses: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  festivalDetails,
  onUpdateFestivalDetails,
  events,
  onUpdateEvents,
  registeredPasses,
  onDeletePass,
  onClearAllPasses,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<'events' | 'festival' | 'registrations' | 'venues'>('events');

  // Form states for festival settings
  const [festForm, setFestForm] = useState<FestivalDetails>({ ...festivalDetails });
  const [festSavedNotice, setFestSavedNotice] = useState(false);

  // States for Event Editor modal
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [eventFormData, setEventFormData] = useState<Partial<EventItem>>({});
  const [rulesInputText, setRulesInputText] = useState('');

  if (!isOpen) return null;

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === 'sati1960') {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleSaveFestivalSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateFestivalDetails(festForm);
    setFestSavedNotice(true);
    setTimeout(() => setFestSavedNotice(false), 2500);
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Reset all festival settings and events to default SATI Vidisha configuration?')) {
      onUpdateEvents(SAMPLE_EVENTS);
      onUpdateFestivalDetails(DEFAULT_FESTIVAL_DETAILS);
      setFestForm(DEFAULT_FESTIVAL_DETAILS);
    }
  };

  // Open Event Editor for Create or Edit
  const handleOpenEditEvent = (event: EventItem) => {
    setEditingEvent(event);
    setIsCreatingEvent(false);
    setEventFormData({ ...event });
    setRulesInputText(event.rules.join('\n'));
  };

  const handleOpenCreateEvent = () => {
    setIsCreatingEvent(true);
    setEditingEvent(null);
    setEventFormData({
      id: `sati-event-${Date.now().toString().slice(-4)}`,
      title: '',
      category: 'Technical',
      date: '12 Feb 2026',
      dateShort: '12 Feb',
      time: '12 Feb, 10:00 AM',
      timeSlot: '10:00 AM',
      startIso: '2026-02-12T10:00:00+05:30',
      endIso: '2026-02-12T13:00:00+05:30',
      duration: '3 Hours',
      venue: 'Central Computer Center (Lab 2)',
      contactEmail: 'fest@example.edu',
      description: '',
      longDescription: '',
      teamSize: '1 - 2 Members',
      capacity: 50,
      registeredCount: 0,
      rules: ['Standard institute code of conduct applies.'],
      coordinators: [{ name: 'SATI Student Coordinator', role: 'Event Convener' }],
      isOverlappingWith: [],
    });
    setRulesInputText('Standard institute code of conduct applies.\nBring your college ID card.');
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventFormData.title || !eventFormData.venue) {
      alert('Please fill out Event Title and Venue.');
      return;
    }

    const rules = rulesInputText
      .split('\n')
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    const fullEvent: EventItem = {
      ...(eventFormData as EventItem),
      rules: rules.length > 0 ? rules : ['Standard college fest guidelines apply.'],
    };

    if (isCreatingEvent) {
      onUpdateEvents([...events, fullEvent]);
    } else if (editingEvent) {
      onUpdateEvents(events.map((e) => (e.id === editingEvent.id ? fullEvent : e)));
    }

    setEditingEvent(null);
    setIsCreatingEvent(false);
  };

  const handleDeleteEvent = (id: string) => {
    if (window.confirm('Are you sure you want to delete this event from the festival schedule?')) {
      onUpdateEvents(events.filter((e) => e.id !== id));
    }
  };

  const handleExportRegistrationsCsv = () => {
    if (registeredPasses.length === 0) {
      alert('No registrations available to export.');
      return;
    }

    const headers = ['Pass ID', 'Type', 'Team Name', 'Leader / Name', 'Email', 'Phone', 'College', 'Event Title', 'Venue', 'Time', 'Allocated Theme', 'Registration Date'];
    const rows = registeredPasses.map((p) => [
      `"${p.passId}"`,
      `"${p.formData.registrationType || 'individual'}"`,
      `"${p.formData.teamName || 'N/A'}"`,
      `"${p.formData.fullName}"`,
      `"${p.formData.email}"`,
      `"${p.formData.phone}"`,
      `"${p.formData.college}"`,
      `"${p.event.title}"`,
      `"${p.event.venue}"`,
      `"${p.event.time}"`,
      `"${p.formData.allocatedTheme || 'General'}"`,
      `"${p.issuedAt}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `sati-fest-registrations-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#080c1f] border border-indigo-500/30 rounded-2xl text-slate-100 shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Admin Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800 bg-[#060918]">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/40">
              <Shield className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-lg sm:text-xl font-bold text-white tracking-tight">
                  Festival Administration Console
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                  SATI Vidisha
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Full administrative authority over events, schedule timings, venues, prize pools (₹), and delegate passes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Close admin console"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Auth Gate Screen */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto my-auto space-y-5">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-950/60 border border-indigo-800/80 text-indigo-400">
              <Lock className="h-7 w-7" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Administrator Verification</h4>
              <p className="text-xs text-slate-400 mt-1">
                Enter festival administrator PIN to modify schedule, venues, or delegate data. PIN: <strong className="text-indigo-300 font-mono">sati1960</strong>
              </p>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-3">
              <input
                type="password"
                placeholder="Enter PIN (sati1960)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full text-center tracking-widest font-mono text-sm bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-indigo-500"
              />
              {pinError && (
                <p className="text-xs text-rose-400">Invalid PIN. Please enter <span className="font-mono font-semibold">sati1960</span>.</p>
              )}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Unlock className="h-4 w-4" />
                  <span>Authenticate & Open Admin Controls</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Main Authenticated Dashboard */
          <>
            {/* Top Navigation Tabs */}
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/60 px-4 sm:px-6 overflow-x-auto gap-4">
              <div className="flex items-center gap-2 py-2">
                <button
                  onClick={() => setActiveTab('events')}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === 'events'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Events Manager ({events.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('festival')}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === 'festival'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Settings className="h-3.5 w-3.5" />
                  <span>Festival Global Settings</span>
                </button>

                <button
                  onClick={() => setActiveTab('registrations')}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === 'registrations'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Users className="h-3.5 w-3.5" />
                  <span>Delegate Registrations ({registeredPasses.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('venues')}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === 'venues'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Campus Venue Audit</span>
                </button>
              </div>

              <div className="flex items-center gap-2 shrink-0 py-2">
                <button
                  onClick={handleResetToDefaults}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-amber-300 rounded hover:bg-slate-800/80 transition-colors"
                  title="Reset everything to SATI Vidisha official defaults"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Reset to SATI Defaults</span>
                </button>
              </div>
            </div>

            {/* TAB CONTENT SCROLLER */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* TAB 1: EVENTS MANAGER */}
              {activeTab === 'events' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                    <div>
                      <h4 className="font-heading text-base font-bold text-white">
                        Curate Competitions & Sessions
                      </h4>
                      <p className="text-xs text-slate-400">
                        Create new tracks, alter venues, customize cash prize pools (₹), and tweak competition rules.
                      </p>
                    </div>

                    <button
                      onClick={handleOpenCreateEvent}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow transition-colors whitespace-nowrap self-start sm:self-auto"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Create New Event</span>
                    </button>
                  </div>

                  {/* Events Table / Card List */}
                  <div className="space-y-3">
                    {events.map((ev) => (
                      <div
                        key={ev.id}
                        className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap text-xs">
                            <span className={
                              ev.category === 'Technical' ? 'text-cyan-400 font-bold' :
                              ev.category === 'Cultural' ? 'text-pink-400 font-bold' :
                              ev.category === 'Gaming' ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'
                            }>
                              {ev.category}
                            </span>
                            <span className="text-slate-600">·</span>
                            <span className="text-slate-300 font-mono">{ev.dateShort}, {ev.timeSlot}</span>
                            <span className="text-slate-600">·</span>
                            <span className="text-indigo-400">{ev.venue}</span>
                          </div>

                          <h5 className="font-heading text-sm font-bold text-white">
                            {ev.title}
                          </h5>

                          <p className="text-xs text-slate-400 line-clamp-1 max-w-2xl">
                            {ev.description}
                          </p>

                          <div className="text-[11px] text-slate-500">
                            Team: {ev.teamSize} · Capacity: {ev.capacity} · Coordinator: {ev.contactEmail}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                          <button
                            onClick={() => {
                              const ics = generateEventIcs(ev);
                              downloadIcsFile(`${ev.id}-admin.ics`, ics);
                            }}
                            className="p-2 text-xs rounded bg-slate-900 text-slate-300 hover:text-indigo-300 hover:bg-slate-800 border border-slate-800"
                            title="Export .ics calendar file"
                          >
                            <Calendar className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => handleOpenEditEvent(ev)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded bg-indigo-950 text-indigo-300 hover:bg-indigo-900 border border-indigo-800/60"
                          >
                            <Edit2 className="h-3 w-3" />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => handleDeleteEvent(ev.id)}
                            className="p-1.5 text-xs rounded bg-slate-900 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 border border-slate-800"
                            title="Delete this event"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: FESTIVAL GLOBAL SETTINGS */}
              {activeTab === 'festival' && (
                <form onSubmit={handleSaveFestivalSettings} className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <h4 className="font-heading text-base font-bold text-white">
                        Global Festival Identity & Campus Metadata
                      </h4>
                      <p className="text-xs text-slate-400">
                        Changes here update the Navbar, Hero title, contact sections, and printed admission passes live.
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow transition-colors"
                    >
                      <Save className="h-3.5 w-3.5" />
                      <span>Save All Changes</span>
                    </button>
                  </div>

                  {festSavedNotice && (
                    <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-400" />
                      <span>Festival settings saved and applied to entire website in real-time!</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">Festival Short Brand Name</label>
                      <input
                        type="text"
                        value={festForm.name}
                        onChange={(e) => setFestForm({ ...festForm, name: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">Festival Full Title / Conclave</label>
                      <input
                        type="text"
                        value={festForm.fullTitle}
                        onChange={(e) => setFestForm({ ...festForm, fullTitle: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">Host Institution</label>
                      <input
                        type="text"
                        value={festForm.institution}
                        onChange={(e) => setFestForm({ ...festForm, institution: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">Theme Keyword</label>
                      <input
                        type="text"
                        value={festForm.theme}
                        onChange={(e) => setFestForm({ ...festForm, theme: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">Festival Dates</label>
                      <input
                        type="text"
                        value={festForm.dates}
                        onChange={(e) => setFestForm({ ...festForm, dates: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">Campus Location & Address</label>
                      <input
                        type="text"
                        value={festForm.venue}
                        onChange={(e) => setFestForm({ ...festForm, venue: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">Official Contact Email</label>
                      <input
                        type="email"
                        value={festForm.contactEmail}
                        onChange={(e) => setFestForm({ ...festForm, contactEmail: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">Emergency Helpline Number</label>
                      <input
                        type="text"
                        value={festForm.helpline}
                        onChange={(e) => setFestForm({ ...festForm, helpline: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">Leadership / Coordinator Council</label>
                      <input
                        type="text"
                        value={festForm.coordinator}
                        onChange={(e) => setFestForm({ ...festForm, coordinator: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow"
                    >
                      Apply & Broadcast Changes
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 3: DELEGATE REGISTRATIONS */}
              {activeTab === 'registrations' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                    <div>
                      <h4 className="font-heading text-base font-bold text-white">
                        Live Delegate Registration Desk
                      </h4>
                      <p className="text-xs text-slate-400">
                        {registeredPasses.length} delegates registered across collegiate competitions.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleExportRegistrationsCsv}
                        disabled={registeredPasses.length === 0}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-300 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-800/80 rounded-lg disabled:opacity-40 transition-colors"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Export CSV Sheet</span>
                      </button>

                      {registeredPasses.length > 0 && (
                        <button
                          onClick={() => {
                            if (window.confirm('Delete all registrations?')) {
                              onClearAllPasses();
                            }
                          }}
                          className="px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 rounded hover:bg-rose-950/40"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                  </div>

                  {registeredPasses.length === 0 ? (
                    <div className="py-12 text-center text-slate-500 text-xs">
                      No registrations recorded yet. Attendees who submit the registration form will appear here in real-time.
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-slate-800">
                      <table className="w-full text-left text-xs text-slate-300">
                        <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                          <tr>
                            <th className="p-3">Pass ID</th>
                            <th className="p-3">Type & Team</th>
                            <th className="p-3">Attendee / Leader</th>
                            <th className="p-3">College</th>
                            <th className="p-3">Event Selected</th>
                            <th className="p-3">Allocated Theme</th>
                            <th className="p-3">Venue / Time</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                          {registeredPasses.map((pass) => (
                            <tr key={pass.passId} className="hover:bg-slate-800/40">
                              <td className="p-3 font-mono font-bold text-amber-300">{pass.passId}</td>
                              <td className="p-3">
                                <span
                                  className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                                    pass.formData.registrationType === 'team'
                                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  }`}
                                >
                                  {pass.formData.registrationType === 'team' ? 'Team' : 'Solo'}
                                </span>
                                {pass.formData.teamName && (
                                  <div className="text-[11px] font-semibold text-white mt-1">
                                    {pass.formData.teamName}
                                  </div>
                                )}
                              </td>
                              <td className="p-3">
                                <div className="font-semibold text-white">{pass.formData.fullName}</div>
                                <div className="text-[11px] text-slate-400 font-mono">{pass.formData.email}</div>
                              </td>
                              <td className="p-3 text-slate-300">{pass.formData.college}</td>
                              <td className="p-3 font-medium text-indigo-300">{pass.event.title}</td>
                              <td className="p-3">
                                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-indigo-950 text-indigo-300 border border-indigo-700/60">
                                  {pass.formData.allocatedTheme || 'Space'}
                                </span>
                              </td>
                              <td className="p-3 text-[11px] text-slate-400">
                                <div>{pass.event.venue}</div>
                                <div>{pass.event.time}</div>
                              </td>
                              <td className="p-3 text-right space-x-1">
                                <button
                                  onClick={() => {
                                    const ics = generateEventIcs(
                                      pass.event,
                                      pass.passId,
                                      pass.formData.fullName,
                                      pass.formData.allocatedTheme,
                                      pass.formData.themeDirective
                                    );
                                    downloadIcsFile(`${pass.event.id}-${pass.passId}.ics`, ics);
                                  }}
                                  className="p-1.5 text-indigo-400 hover:text-indigo-300 hover:bg-slate-800 rounded"
                                  title="Download .ics Calendar File"
                                >
                                  <Download className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => onDeletePass(pass.passId)}
                                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded"
                                  title="Cancel Registration"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: VENUES & CONCURRENCY AUDIT */}
              {activeTab === 'venues' && (
                <div className="space-y-4">
                  <div className="pb-3 border-b border-slate-800">
                    <h4 className="font-heading text-base font-bold text-white">
                      SATI Vidisha Campus Room & Facility Allocations
                    </h4>
                    <p className="text-xs text-slate-400">
                      Verify that simultaneous sessions are allocated to non-colliding physical rooms on the 85-acre campus.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        venueName: 'Central Computer Center (Lab 2)',
                        capacity: '120 Systems',
                        assignedEvents: events.filter((e) => e.venue.includes('Lab 2')),
                        features: 'High-speed gigabit LAN, dual power backup, Linux & Windows test benches'
                      },
                      {
                        venueName: 'Kailash Satyarthi Auditorium',
                        capacity: '800 Seater Indoor Arena',
                        assignedEvents: events.filter((e) => e.venue.includes('Satyarthi')),
                        features: 'Full acoustic stage, digital laser projection, alumni hall of fame'
                      },
                      {
                        venueName: 'Central Workshop & Fabrication Bay',
                        capacity: 'Outdoor/Semi-Indoor Yard',
                        assignedEvents: events.filter((e) => e.venue.includes('Workshop') || e.venue.includes('Fabrication')),
                        features: 'Sand/gravel obstacle pit, 24V charging docks, mechanical tooling'
                      },
                      {
                        venueName: 'Open Air Amphitheatre & Grounds',
                        capacity: '2,500 Spectators',
                        assignedEvents: events.filter((e) => e.venue.includes('Amphitheatre') || e.venue.includes('Open Air')),
                        features: 'Concert sound engineering line arrays, stadium lighting trusses'
                      },
                      {
                        venueName: 'IT & Computing Block (Lab 4)',
                        capacity: '80 Systems',
                        assignedEvents: events.filter((e) => e.venue.includes('Lab 4')),
                        features: 'Low-latency gaming server nodes, titan stream screen'
                      },
                      {
                        venueName: 'Seminar Halls (Civil & ECE)',
                        capacity: '150 Seater Smart Rooms',
                        assignedEvents: events.filter((e) => e.venue.includes('Seminar') || e.venue.includes('ECE')),
                        features: 'Digital smartboards, surround audio, conference seating'
                      }
                    ].map((room, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-white font-heading">{room.venueName}</span>
                          <span className="font-mono text-indigo-400 text-[11px]">{room.capacity}</span>
                        </div>
                        <p className="text-[11px] text-slate-400">{room.features}</p>
                        <div className="pt-2 border-t border-slate-800/80">
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Assigned Tracks:</span>
                          {room.assignedEvents.length === 0 ? (
                            <span className="text-[11px] text-slate-500 italic">No events currently booked</span>
                          ) : (
                            <div className="space-y-1">
                              {room.assignedEvents.map((ae) => (
                                <div key={ae.id} className="text-xs text-indigo-300 flex items-center justify-between">
                                  <span>{ae.title}</span>
                                  <span className="text-slate-400 font-mono text-[10px]">{ae.dateShort}, {ae.timeSlot}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* MODAL: EVENT CREATE / EDIT OVERLAY */}
        {(editingEvent || isCreatingEvent) && (
          <div className="absolute inset-0 z-50 bg-black/90 p-4 sm:p-6 overflow-y-auto flex flex-col justify-between animate-in fade-in">
            <div className="max-w-2xl mx-auto w-full space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="font-heading text-lg font-bold text-white">
                  {isCreatingEvent ? 'Create New Festival Event' : `Edit: ${editingEvent?.title}`}
                </h4>
                <button
                  onClick={() => {
                    setEditingEvent(null);
                    setIsCreatingEvent(false);
                  }}
                  className="p-1 text-slate-400 hover:text-white rounded"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEvent} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Event Title</label>
                  <input
                    type="text"
                    required
                    value={eventFormData.title || ''}
                    onChange={(e) => setEventFormData({ ...eventFormData, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Lunar Hackathon"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Category</label>
                    <select
                      value={eventFormData.category || 'Technical'}
                      onChange={(e) => setEventFormData({ ...eventFormData, category: e.target.value as EventCategory })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Technical">Technical</option>
                      <option value="Cultural">Cultural</option>
                      <option value="Gaming">Gaming</option>
                      <option value="Workshop">Workshop</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Date (Festival Day)</label>
                    <select
                      value={eventFormData.dateShort || '12 Feb'}
                      onChange={(e) => {
                        const val = e.target.value as EventDateShort;
                        setEventFormData({ 
                          ...eventFormData, 
                          dateShort: val,
                          date: val === '12 Feb' ? '12 Feb 2026' : '13 Feb 2026'
                        });
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="12 Feb">Day 1 (12 Feb 2026)</option>
                      <option value="13 Feb">Day 2 (13 Feb 2026)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Time Slot (for Scheduling)</label>
                    <select
                      value={eventFormData.timeSlot || '10:00 AM'}
                      onChange={(e) => setEventFormData({ ...eventFormData, timeSlot: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="05:00 PM">05:00 PM</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Display Timing & Duration</label>
                    <input
                      type="text"
                      value={eventFormData.time || ''}
                      onChange={(e) => setEventFormData({ ...eventFormData, time: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. 12 Feb, 10:00 AM"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Campus Venue</label>
                    <input
                      type="text"
                      required
                      value={eventFormData.venue || ''}
                      onChange={(e) => setEventFormData({ ...eventFormData, venue: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. Central Computer Center (Lab 2)"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Team Size</label>
                    <input
                      type="text"
                      value={eventFormData.teamSize || ''}
                      onChange={(e) => setEventFormData({ ...eventFormData, teamSize: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. 1 - 2 Members"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Short Description</label>
                  <textarea
                    rows={2}
                    value={eventFormData.description || ''}
                    onChange={(e) => setEventFormData({ ...eventFormData, description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Competition Rules (one rule per line)</label>
                  <textarea
                    rows={3}
                    value={rulesInputText}
                    onChange={(e) => setRulesInputText(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-indigo-500"
                    placeholder="Allowed languages...\nNo external code generators..."
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingEvent(null);
                      setIsCreatingEvent(false);
                    }}
                    className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow"
                  >
                    Save Event Configuration
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
