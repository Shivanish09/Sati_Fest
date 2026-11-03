import React, { useState } from 'react';
import { Columns, Clock, Filter, AlertCircle, Compass, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

export const AnalyticalExplanation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ux' | 'comparison' | 'rules'>('ux');

  return (
    <section id="analytical-challenge" className="py-16 md:py-24 border-t border-slate-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-medium text-indigo-400 tracking-wider uppercase mb-1 font-mono">
            Analytical Challenge & UX Reasoning
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight text-balance">
            Maintaining Readability in Concurrent Event Schedules
          </h2>
          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            In intercollegiate festivals like AstroFest, multiple specialized tracks (such as Code Sprint in Lab 2
            and Cosmic Hackathon in the Auditorium) inevitably run concurrently. Here is the formal UX architecture
            ensuring zero visual confusion and frictionless navigation.
          </p>
        </div>

        {/* Tabbed Interactive Reasoning Interface */}
        <div className="flex items-center gap-2 mb-8 border-b border-slate-800 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('ux')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'ux'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            4 Pillars of Schedule Clarity
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'comparison'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Sequential vs Parallel Comparison
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'rules'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Attendee Conflict Prevention
          </button>
        </div>

        {/* Content Panel 1: 4 Pillars */}
        {activeTab === 'ux' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="cosmic-card rounded-xl p-5 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="h-9 w-9 rounded-lg bg-indigo-950/70 border border-indigo-800/60 flex items-center justify-center text-indigo-400 mb-4">
                  <Clock className="h-4 w-4" />
                </div>
                <h3 className="font-heading text-base font-bold text-white mb-2">
                  1. Unified Time-Block Parent
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Instead of rendering independent identical time stamps that confuse users, overlapping events are grouped
                  under a single shared time-slot header (e.g. "10:00 AM Slot"). This explicitly communicates concurrency.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-indigo-300 font-mono">
                Prevents false sequential assumptions
              </div>
            </div>

            <div className="cosmic-card rounded-xl p-5 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="h-9 w-9 rounded-lg bg-indigo-950/70 border border-indigo-800/60 flex items-center justify-center text-cyan-400 mb-4">
                  <Columns className="h-4 w-4" />
                </div>
                <h3 className="font-heading text-base font-bold text-white mb-2">
                  2. Multi-Venue Parallel Lanes
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Concurrent sessions are rendered as side-by-side equal-elevation cards. The physical venue (e.g. Lab 2 vs
                  Turing Auditorium) is highlighted prominently, immediately signalling different rooms to visitors.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-cyan-300 font-mono">
                Spatial separation matches physical reality
              </div>
            </div>

            <div className="cosmic-card rounded-xl p-5 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="h-9 w-9 rounded-lg bg-indigo-950/70 border border-indigo-800/60 flex items-center justify-center text-pink-400 mb-4">
                  <Filter className="h-4 w-4" />
                </div>
                <h3 className="font-heading text-base font-bold text-white mb-2">
                  3. Client-Side Track Isolation
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Attendees interested strictly in Technical challenges or Cultural showcases can toggle discipline filters.
                  This immediately removes concurrent noise from irrelevant tracks without page reloads.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-pink-300 font-mono">
                Zero cognitive overload for specialists
              </div>
            </div>

            <div className="cosmic-card rounded-xl p-5 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="h-9 w-9 rounded-lg bg-indigo-950/70 border border-indigo-800/60 flex items-center justify-center text-amber-400 mb-4">
                  <AlertCircle className="h-4 w-4" />
                </div>
                <h3 className="font-heading text-base font-bold text-white mb-2">
                  4. Concurrency Warning Flags
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Each overlapping card displays a subtle warning badge notifying the participant that another major event
                  occurs during this exact window, guiding them to choose their primary commitment.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-amber-300 font-mono">
                Proactive scheduling awareness
              </div>
            </div>
          </div>
        )}

        {/* Content Panel 2: Comparison Demonstration */}
        {activeTab === 'comparison' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/40 p-6 rounded-xl border border-slate-800">
            <div className="p-4 rounded-lg bg-red-950/20 border border-red-900/40">
              <div className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5">
                <span>✕ Common Flaw: Naive Stacking</span>
              </div>
              <p className="text-xs text-slate-300 mb-4">
                Listing concurrent events as flat sequential rows forces visitors to assume <em>Code Sprint</em> finishes
                before <em>Cosmic Hackathon</em> begins, leading to missed rounds, gate confusion, and double-booking.
              </p>
              <div className="space-y-2 opacity-60 text-xs font-mono bg-slate-950 p-3 rounded border border-slate-800">
                <div className="text-slate-400">10:00 AM - Code Sprint (Lab 2)</div>
                <div className="text-slate-400">10:00 AM - Cosmic Hackathon (Auditorium)</div>
                <div className="text-slate-500 text-[10px]">&uarr; Looks like a typo or vertical collision</div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-900/40">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>✓ Implemented Solution: Grouped Track Matrix</span>
              </div>
              <p className="text-xs text-slate-300 mb-4">
                A single "10:00 AM Slot" header branches horizontally into independent venue columns. Visitors
                immediately perceive that the two events occur concurrently in physically distinct venues.
              </p>
              <div className="space-y-2 text-xs font-mono bg-slate-950 p-3 rounded border border-emerald-900/50">
                <div className="text-indigo-400 font-bold border-b border-slate-800 pb-1">
                  [Time Slot: 10:00 AM - 01:00 PM]
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-900 p-1.5 rounded text-cyan-300">Track A: Lab 2</div>
                  <div className="bg-slate-900 p-1.5 rounded text-pink-300">Track B: Auditorium</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Panel 3: Conflict Prevention Rules */}
        {activeTab === 'rules' && (
          <div className="bg-slate-900/40 p-6 rounded-xl border border-slate-800 space-y-4">
            <h3 className="font-heading text-lg font-bold text-white mb-2">
              Registration Rules for Overlapping Sessions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
                <div className="font-semibold text-indigo-300 mb-1">Single-Event Focus</div>
                <p className="text-slate-400 leading-relaxed">
                  Participants are permitted to compete in only one event per time slot to maintain fair attendance and team integrity.
                </p>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
                <div className="font-semibold text-indigo-300 mb-1">Venue Proximity Guidance</div>
                <p className="text-slate-400 leading-relaxed">
                  Events in Lab 2 and Main Turing Auditorium are separated by a 2-minute breezeway walk with clearly marked directional signage.
                </p>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
                <div className="font-semibold text-indigo-300 mb-1">Personal Itinerary Export</div>
                <p className="text-slate-400 leading-relaxed">
                  Using our local bookmarking feature, visitors curate their own conflict-free personalized festival boarding pass.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
