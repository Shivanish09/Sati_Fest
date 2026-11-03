import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, MapPin, ArrowRight, Clock, Award, Users, School } from 'lucide-react';
import { FestivalDetails } from '../types.ts';
import { FESTIVAL_DETAILS as DEFAULT_DETAILS } from '../data/events.ts';

interface HeroProps {
  festivalDetails?: FestivalDetails;
  onOpenRegister: () => void;
}

export const Hero: React.FC<HeroProps> = ({ festivalDetails, onOpenRegister }) => {
  const details = festivalDetails || DEFAULT_DETAILS;
  // Festival starts Feb 12, 2026 10:00 AM
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date('2026-02-12T10:00:00').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        // Event live or fallback
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Subtle cosmic background glows */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-40 -z-10"
      >
        <div className="h-[520px] w-[520px] rounded-full bg-indigo-600/20 blur-[130px]" />
        <div className="h-[400px] w-[400px] rounded-full bg-violet-500/15 blur-[120px] translate-x-32 -translate-y-20" />
        <div className="h-[300px] w-[300px] rounded-full bg-cyan-500/10 blur-[100px] -translate-x-40 translate-y-32" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Subtle Editorial Kicker */}
          <div className="inline-flex items-center gap-2 text-xs font-medium text-indigo-400 tracking-widest uppercase mb-4 flex-wrap justify-center">
            <span>{details.institution}</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-400">Est. 1960 · Vidisha (M.P.)</span>
          </div>

          {/* Main Festival Headline */}
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6 text-balance">
            Sati-Fest 2026
            <span className="block text-2xl sm:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-300 to-indigo-100 mt-2">
              Annual Technical & Cultural Festival · SATI Vidisha
            </span>
          </h1>

          {/* Descriptive Value Proposition */}
          <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed max-w-2xl mx-auto">
            {details.tagline}. Two intensive days of algorithmic code sprints at Lab 2, autonomous Pragyan lunar rover challenges at the Central Workshop, rock battles at the Open Air grounds, and esports arenas on the 85-acre historic SATI Vidisha campus.
          </p>

          {/* Key Quick Metadata Banner */}
          <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-sm text-slate-300 mb-10">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-indigo-400" />
              <span>{details.dates}</span>
            </div>
            <span className="hidden sm:inline text-slate-600" aria-hidden="true">·</span>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-indigo-400" />
              <span>{details.venue}</span>
            </div>
            <span className="hidden sm:inline text-slate-600" aria-hidden="true">·</span>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-emerald-400" />
              <span>Free Entry · Verified Certificates</span>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-14">
            <button
              onClick={onOpenRegister}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-500 active:scale-95 transition-all shadow-lg shadow-indigo-600/25 whitespace-nowrap"
            >
              <span>Register for Events</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
            <a
              href="#schedule"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-slate-200 bg-slate-900/80 border border-slate-700/70 rounded-md hover:bg-slate-800 hover:text-white transition-colors whitespace-nowrap"
            >
              View Day-Wise Schedule
            </a>
            <a
              href="#analytical-challenge"
              className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 text-sm font-medium text-slate-300 hover:text-white transition-colors whitespace-nowrap"
            >
              Schedule Architecture &rarr;
            </a>
          </div>

          {/* Live Countdown Grid */}
          <div className="mx-auto max-w-lg p-4 sm:p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3 text-xs text-slate-400 uppercase tracking-wider font-mono">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-indigo-400" />
                Launch Countdown
              </span>
              <span>12 Feb, 10:00 AM Opening</span>
            </div>
            <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
              <div className="p-2 sm:p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                <span className="block text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">
                  {String(timeLeft.days).padStart(2, '0')}
                </span>
                <span className="text-[11px] text-slate-400">Days</span>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                <span className="block text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[11px] text-slate-400">Hours</span>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                <span className="block text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[11px] text-slate-400">Minutes</span>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                <span className="block text-xl sm:text-2xl font-bold font-mono text-indigo-300 tabular-nums">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[11px] text-slate-400">Seconds</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Item Festival Metric Strip below hero */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-slate-800/80 pt-8">
          <div className="flex flex-col">
            <span className="font-mono text-2xl md:text-3xl font-bold text-white tabular-nums">08</span>
            <span className="text-xs text-slate-400 mt-1">Curated Competitions</span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-2xl md:text-3xl font-bold text-indigo-300 tabular-nums">04</span>
            <span className="text-xs text-slate-400 mt-1">Disciplines (Tech, Culture, Gaming, Workshops)</span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-2xl md:text-3xl font-bold text-emerald-300 tabular-nums">100%</span>
            <span className="text-xs text-slate-400 mt-1">Free Admission & Delegate Kits</span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-2xl md:text-3xl font-bold text-white tabular-nums">1,200+</span>
            <span className="text-xs text-slate-400 mt-1">Expected Inter-College Attendees</span>
          </div>
        </div>
      </div>
    </section>
  );
};
