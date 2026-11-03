import React, { useState, useMemo } from 'react';
import { Search, MapPin, Calendar, Clock, Trophy, Users, Mail, Bookmark, BookmarkCheck, AlertCircle, Info, ChevronRight, X, Download, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EventItem, EventCategory, EventDateShort } from '../types.ts';
import { generateEventIcs, downloadIcsFile, getGoogleCalendarUrl } from '../utils/calendar.ts';

interface EventCardsProps {
  events: EventItem[];
  savedEventIds: string[];
  onToggleSave: (id: string) => void;
  onSelectEventToRegister: (eventId: string) => void;
}

export const EventCards: React.FC<EventCardsProps> = ({
  events,
  savedEventIds,
  onToggleSave,
  onSelectEventToRegister
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDate, setSelectedDate] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeDetailsEvent, setActiveDetailsEvent] = useState<EventItem | null>(null);

  const categories = ['All', 'Technical', 'Cultural', 'Gaming', 'Workshop'];
  const dates = [
    { label: 'All Days', value: 'All' },
    { label: 'Day 1 (12 Feb)', value: '12 Feb' },
    { label: 'Day 2 (13 Feb)', value: '13 Feb' }
  ];

  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const matchCat = selectedCategory === 'All' || ev.category === selectedCategory;
      const matchDate = selectedDate === 'All' || ev.dateShort === selectedDate;
      const matchQuery =
        searchQuery.trim() === '' ||
        ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchDate && matchQuery;
    });
  }, [events, selectedCategory, selectedDate, searchQuery]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedDate('All');
    setSearchQuery('');
  };

  return (
    <section id="events" className="py-16 md:py-24 border-t border-slate-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs font-medium text-indigo-400 tracking-wider uppercase mb-1">
              Festival Competitions & Showcases
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
              Featured Events
            </h2>
            <p className="mt-2 text-sm text-slate-400 max-w-xl">
              Discover events across technical innovations, stage arts, competitive esports, and scientific masterclasses. Filter by discipline or day.
            </p>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span>Showing <strong className="text-white font-mono tabular-nums">{filteredEvents.length}</strong> of {events.length} events</span>
            {(selectedCategory !== 'All' || selectedDate !== 'All' || searchQuery) && (
              <button
                onClick={resetFilters}
                className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4 ml-2"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-5 mb-10 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          {/* Category Tabs (Interactive Segmented Control) */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            <span className="text-xs text-slate-400 font-medium mr-2 whitespace-nowrap shrink-0 hidden sm:inline">Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Day Tabs and Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Day Switcher */}
            <div className="flex items-center gap-1 bg-slate-950/70 p-1 rounded-lg border border-slate-800">
              {dates.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setSelectedDate(d.value)}
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                    selectedDate === d.value
                      ? 'bg-slate-800 text-indigo-300 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>

            {/* Keyword Search Input */}
            <div className="relative min-w-[200px]">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search event or venue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-9 pr-8 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Event Cards Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16 px-4 bg-slate-900/30 border border-dashed border-slate-800 rounded-xl">
            <AlertCircle className="mx-auto h-8 w-8 text-slate-500 mb-3" />
            <h3 className="text-base font-semibold text-slate-300">No events found matching your criteria</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">Try clearing your search query or picking a different category or day.</p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-500"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              const isSaved = savedEventIds.includes(event.id);
              const hasOverlap = event.isOverlappingWith && event.isOverlappingWith.length > 0;

              return (
                <div
                  key={event.id}
                  className="cosmic-card rounded-xl p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-md hover:shadow-indigo-950/30 group"
                >
                  <div>
                    {/* Top unboxed metadata line conforming to zero-pill rules */}
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-400 mb-3 font-mono">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={
                          event.category === 'Technical' ? 'text-cyan-400 font-semibold' :
                          event.category === 'Cultural' ? 'text-pink-400 font-semibold' :
                          event.category === 'Gaming' ? 'text-emerald-400 font-semibold' :
                          'text-amber-400 font-semibold'
                        }>
                          {event.category}
                        </span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span>{event.dateShort}</span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span className="text-slate-300">{event.timeSlot}</span>
                      </div>

                      {/* Bookmark toggle */}
                      <button
                        onClick={() => onToggleSave(event.id)}
                        className={`p-1.5 rounded transition-colors ${
                          isSaved
                            ? 'text-indigo-400 hover:text-indigo-300 bg-indigo-950/60'
                            : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                        }`}
                        title={isSaved ? 'Remove from saved itinerary' : 'Save to my schedule'}
                        aria-label={isSaved ? `Unsave ${event.title}` : `Save ${event.title}`}
                      >
                        {isSaved ? (
                          <BookmarkCheck className="h-4 w-4 fill-indigo-400" />
                        ) : (
                          <Bookmark className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    {/* Event Title */}
                    <h3 className="font-heading text-lg font-bold text-white tracking-tight mb-2 group-hover:text-indigo-300 transition-colors">
                      {event.title}
                    </h3>

                    {/* Venue & Timing info */}
                    <div className="space-y-1.5 text-xs text-slate-300 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                        <span className="font-medium text-slate-200">Venue: {event.venue}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                        <span>{event.time}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-400 leading-relaxed mb-5 line-clamp-3">
                      {event.description}
                    </p>

                    {/* Overlapping schedule indicator if time slot is shared */}
                    {hasOverlap && (
                      <div className="mb-4 p-2 rounded bg-indigo-950/40 border border-indigo-800/40 text-[11px] text-indigo-300 flex items-start gap-1.5">
                        <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-indigo-400" />
                        <span>
                          Runs concurrently at {event.timeSlot}. Check the schedule matrix to avoid conflict.
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    {/* Key Attributes Grid */}
                    <div className="grid grid-cols-2 gap-2 border-t border-slate-800/80 pt-3 mb-4 text-xs">
                      <div>
                        <span className="block text-[11px] text-slate-500">Duration</span>
                        <span className="font-semibold text-slate-200">{event.duration.split('(')[0].trim()}</span>
                      </div>
                      <div>
                        <span className="block text-[11px] text-slate-500">Team Size</span>
                        <span className="text-slate-300">{event.teamSize}</span>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectEventToRegister(event.id)}
                        className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-indigo-600 rounded hover:bg-indigo-500 active:scale-95 transition-all text-center whitespace-nowrap"
                      >
                        Register
                      </button>
                      <button
                        onClick={() => setActiveDetailsEvent(event)}
                        className="py-2 px-3 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-700/60 rounded hover:bg-slate-800 hover:text-white transition-colors whitespace-nowrap"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => {
                          const ics = generateEventIcs(event);
                          downloadIcsFile(`${event.id}-sati.ics`, ics);
                        }}
                        className="p-2 text-xs font-medium text-indigo-300 bg-indigo-950/60 border border-indigo-800/60 rounded hover:bg-indigo-900/60 transition-colors"
                        title="Download .ics Calendar File"
                        aria-label={`Download .ics file for ${event.title}`}
                      >
                        <Calendar className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Coordinator email */}
                    <div className="mt-3 text-[11px] text-slate-500 flex items-center justify-between">
                      <span className="truncate">Contact: {event.contactEmail}</span>
                      <a
                        href={`mailto:${event.contactEmail}`}
                        className="text-indigo-400 hover:text-indigo-300 ml-1 shrink-0"
                        title={`Email ${event.contactEmail}`}
                      >
                        <Mail className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal for viewing detailed rules & coordinators */}
        {activeDetailsEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-xl p-6 text-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setActiveDetailsEvent(null)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="text-xs text-indigo-400 font-mono uppercase tracking-wider mb-1">
                {activeDetailsEvent.category} Track · {activeDetailsEvent.date}
              </div>
              <h3 className="font-heading text-xl font-bold text-white mb-2">
                {activeDetailsEvent.title}
              </h3>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mb-4 pb-3 border-b border-slate-800">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-indigo-400" />
                  Venue: {activeDetailsEvent.venue}
                </span>
                <span className="text-slate-600">·</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-indigo-400" />
                  {activeDetailsEvent.duration}
                </span>
              </div>

              <div className="mb-4">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Overview</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeDetailsEvent.longDescription}
                </p>
              </div>

              <div className="mb-4">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Rules & Guidelines</h4>
                <ul className="space-y-1.5 text-xs text-slate-400">
                  {activeDetailsEvent.rules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-indigo-400 font-mono text-[10px] mt-0.5">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6 p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400">Team Size:</span>
                  <span className="text-slate-200">{activeDetailsEvent.teamSize}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Official Contact:</span>
                  <a href={`mailto:${activeDetailsEvent.contactEmail}`} className="text-indigo-400 hover:underline">
                    {activeDetailsEvent.contactEmail}
                  </a>
                </div>
              </div>

              {/* Calendar Sync Options in Details Modal */}
              <div className="mb-5 p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs">
                <span className="font-semibold text-indigo-300 block mb-1.5 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Sync Session to Calendar</span>
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      const ics = generateEventIcs(activeDetailsEvent);
                      downloadIcsFile(`${activeDetailsEvent.id}-sati.ics`, ics);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded bg-indigo-900/50 text-indigo-300 border border-indigo-700/60 hover:bg-indigo-800/60 transition-colors"
                  >
                    <Download className="h-3 w-3" />
                    <span>Download .ics File</span>
                  </button>
                  <a
                    href={getGoogleCalendarUrl(activeDetailsEvent)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded bg-slate-800 text-slate-300 hover:text-white transition-colors"
                  >
                    <span>Google Calendar</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                <button
                  onClick={() => setActiveDetailsEvent(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const id = activeDetailsEvent.id;
                    setActiveDetailsEvent(null);
                    onSelectEventToRegister(id);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded hover:bg-indigo-500"
                >
                  Proceed to Register
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
