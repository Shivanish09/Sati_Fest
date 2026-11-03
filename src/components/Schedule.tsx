import React, { useState, useMemo } from 'react';
import { Calendar, Clock, MapPin, Layers, LayoutGrid, CheckCircle2, AlertTriangle, ArrowRight, Download } from 'lucide-react';
import { EventItem, EventDateShort } from '../types.ts';
import { FESTIVAL_SCHEDULE_DAYS } from '../data/events.ts';
import { generateEventIcs, generateMultipleEventsIcs, downloadIcsFile } from '../utils/calendar.ts';

interface ScheduleProps {
  events: EventItem[];
  onSelectEventToRegister: (eventId: string) => void;
}

export const Schedule: React.FC<ScheduleProps> = ({ events, onSelectEventToRegister }) => {
  const [activeDay, setActiveDay] = useState<EventDateShort>('12 Feb');
  const [viewMode, setViewMode] = useState<'timeline' | 'parallel'>('timeline');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Filter events for active day and optional category
  const dayEvents = useMemo(() => {
    return events.filter(
      (ev) => ev.dateShort === activeDay && (categoryFilter === 'All' || ev.category === categoryFilter)
    );
  }, [events, activeDay, categoryFilter]);

  // Group events by time slot for timeline view
  const timeSlots = useMemo(() => {
    const slots = ['10:00 AM', '02:00 PM', '05:00 PM'] as const;
    return slots
      .map((slot) => {
        const matching = dayEvents.filter((ev) => ev.timeSlot === slot);
        return {
          slot,
          events: matching,
          hasConflict: matching.length > 1
        };
      })
      .filter((group) => group.events.length > 0);
  }, [dayEvents]);

  // Unique venues for parallel venue matrix view
  const venueLanes = useMemo(() => {
    const venuesSet = new Set(dayEvents.map((e) => e.venue));
    return Array.from(venuesSet);
  }, [dayEvents]);

  const activeDayMeta = FESTIVAL_SCHEDULE_DAYS.find((d) => d.dateShort === activeDay);

  return (
    <section id="schedule" className="py-16 md:py-24 border-t border-slate-800/80 bg-slate-950/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs font-medium text-indigo-400 tracking-wider uppercase mb-1">
              Time-Wise Itinerary
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
              Festival Schedule
            </h2>
            <p className="mt-2 text-sm text-slate-400 max-w-xl">
              Seamlessly browse events day-wise or examine simultaneous multi-venue tracks.
              Concurrent events are structured in parallel slots for effortless navigation.
            </p>
          </div>

          {/* Controls: Full ICS Export & View mode toggle */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                const ics = generateMultipleEventsIcs(events, 'SATI Samrat-Tech 2026 Festival Schedule');
                downloadIcsFile('sati-samrat-tech-2026-complete-schedule.ics', ics);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-300 bg-indigo-950/70 border border-indigo-800/80 rounded-lg hover:bg-indigo-900/80 transition-colors whitespace-nowrap shadow-sm"
              title="Download RFC 5545 calendar file of all festival events for Google or Outlook calendar"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Full Festival .ICS</span>
            </button>

            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('timeline')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  viewMode === 'timeline'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                <span>Timeline Blocks</span>
              </button>
              <button
                onClick={() => setViewMode('parallel')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  viewMode === 'parallel'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span>Parallel Venue Matrix</span>
              </button>
            </div>
          </div>
        </div>

        {/* Day Selector Buttons & Category Quick Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          {/* Day Buttons */}
          <div className="flex items-center gap-2">
            {FESTIVAL_SCHEDULE_DAYS.map((day) => (
              <button
                key={day.dateShort}
                onClick={() => setActiveDay(day.dateShort)}
                className={`flex flex-col items-start px-4 py-2.5 rounded-lg border text-left transition-all ${
                  activeDay === day.dateShort
                    ? 'bg-indigo-950/60 border-indigo-600/70 text-white ring-1 ring-indigo-500/30'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-sm text-white">{day.dayLabel}</span>
                  <span className="text-xs text-indigo-400 font-mono">({day.dateShort})</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-0.5">{day.dateFormatted}</span>
              </button>
            ))}
          </div>

          {/* Category Filter for schedule */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-lg border border-slate-800 overflow-x-auto">
            <span className="text-xs text-slate-400 font-medium px-2 hidden sm:inline">Filter:</span>
            {['All', 'Technical', 'Cultural', 'Gaming', 'Workshop'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 text-xs rounded transition-colors whitespace-nowrap ${
                  categoryFilter === cat
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Day Focus Context Note */}
        {activeDayMeta && (
          <div className="mb-8 p-3 rounded-lg bg-slate-900/40 border border-slate-800/80 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="text-slate-300">
              <strong className="text-indigo-400">{activeDayMeta.dayLabel} Focus:</strong> {activeDayMeta.focus}
            </div>
            <a
              href="#analytical-challenge"
              className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 hover:underline text-[11px]"
            >
              <span>How we resolve simultaneous time slots</span>
              <ArrowRight className="h-3 w-3" />
            </a>
          </div>
        )}

        {/* VIEW 1: Chronological Timeline Block View */}
        {viewMode === 'timeline' && (
          <div className="space-y-8">
            {timeSlots.map((group) => (
              <div
                key={group.slot}
                className="relative bg-slate-900/40 border border-slate-800 rounded-xl p-5 md:p-6"
              >
                {/* Time slot header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-800/80 gap-2">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-950/80 border border-indigo-800/50 text-indigo-400">
                      <Clock className="h-4 w-4" />
                    </span>
                    <div>
                      <h3 className="font-heading text-lg font-bold text-white tracking-tight">
                        {group.slot} Slot
                      </h3>
                      <span className="text-xs text-slate-400 font-mono">
                        {activeDay} 2026 · {group.events.length} Session{group.events.length > 1 ? 's' : ''} Scheduled
                      </span>
                    </div>
                  </div>

                  {/* Overlap banner indicator if slot contains concurrent events */}
                  {group.hasConflict && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-amber-950/40 border border-amber-800/40 text-amber-300 text-xs font-medium">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      <span>Simultaneous Track: Events run concurrently across separate venues</span>
                    </div>
                  )}
                </div>

                {/* Grid of parallel cards for this time block */}
                <div className={`grid gap-4 ${group.events.length > 1 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                  {group.events.map((event) => (
                    <div
                      key={event.id}
                      className="bg-slate-950/80 border border-slate-800/90 rounded-lg p-5 flex flex-col justify-between hover:border-slate-700 transition-colors"
                    >
                      <div>
                        {/* Clean unboxed metadata */}
                        <div className="flex items-center justify-between gap-2 text-xs text-slate-400 mb-2">
                          <span className={
                            event.category === 'Technical' ? 'text-cyan-400 font-semibold' :
                            event.category === 'Cultural' ? 'text-pink-400 font-semibold' :
                            event.category === 'Gaming' ? 'text-emerald-400 font-semibold' :
                            'text-amber-400 font-semibold'
                          }>
                            {event.category}
                          </span>
                          <span className="text-slate-500 font-mono">{event.duration}</span>
                        </div>

                        <h4 className="font-heading text-base font-bold text-white mb-2">
                          {event.title}
                        </h4>

                        <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                          {event.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mb-4 pb-3 border-b border-slate-850">
                          <span className="flex items-center gap-1.5 text-indigo-300 font-medium">
                            <MapPin className="h-3.5 w-3.5 text-indigo-400" />
                            {event.venue}
                          </span>
                          <span className="text-slate-600">·</span>
                          <span className="text-slate-400">Team: {event.teamSize}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 gap-2">
                        <span className="text-xs text-slate-400 font-mono">
                          {event.duration.split('(')[0].trim()}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              const ics = generateEventIcs(event);
                              downloadIcsFile(`${event.id}-sati.ics`, ics);
                            }}
                            className="p-1.5 text-xs text-indigo-300 bg-indigo-950/60 border border-indigo-800/60 rounded hover:bg-indigo-900/60 transition-colors"
                            title="Download .ics Calendar File"
                          >
                            <Calendar className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => onSelectEventToRegister(event.id)}
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded hover:bg-indigo-500 active:scale-95 transition-all"
                          >
                            Register Slot
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* VIEW 2: Parallel Venue Matrix View (Analytical view demonstrating concurrent clarity) */}
        {viewMode === 'parallel' && (
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/40 p-4">
            <div className="min-w-[700px]">
              <div className="mb-4 flex items-center justify-between text-xs text-slate-400">
                <span>Multi-Lane Venue Schedule for {activeDay} 2026</span>
                <span className="text-indigo-400 font-mono">Parallel Rooms View</span>
              </div>

              <div className="grid grid-cols-4 gap-3 bg-slate-950/70 p-3 rounded-lg border border-slate-800 text-xs font-semibold text-slate-300 mb-3">
                <div>Time Window</div>
                <div className="col-span-3">Assigned Venue & Event Session</div>
              </div>

              {['10:00 AM', '02:00 PM', '05:00 PM'].map((slot) => {
                const matching = dayEvents.filter((ev) => ev.timeSlot === slot);
                if (matching.length === 0) return null;

                return (
                  <div key={slot} className="grid grid-cols-4 gap-3 border-b border-slate-800/60 py-3.5 items-start">
                    <div className="font-mono text-xs font-bold text-indigo-300 pt-1">
                      {slot}
                    </div>

                    <div className="col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {matching.map((event) => (
                        <div
                          key={event.id}
                          className="p-3 rounded-lg bg-slate-950/90 border border-slate-800 hover:border-indigo-600/50 transition-colors"
                        >
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="font-semibold text-indigo-400">{event.venue}</span>
                            <span className="text-slate-500">{event.category}</span>
                          </div>
                          <div className="font-heading text-sm font-bold text-white mb-1">
                            {event.title}
                          </div>
                          <div className="text-[11px] text-slate-400 mb-2">
                            {event.duration}
                          </div>
                          <button
                            onClick={() => onSelectEventToRegister(event.id)}
                            className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 hover:underline"
                          >
                            Register for this track &rarr;
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
