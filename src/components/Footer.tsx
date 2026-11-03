import React from 'react';
import { Rocket, Mail, MapPin, ExternalLink } from 'lucide-react';
import { FESTIVAL_DETAILS } from '../data/events.ts';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#040610] text-slate-400 text-xs py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-900">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-white font-heading font-bold text-base">
              <span className="flex h-7 w-7 items-center justify-center rounded bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                <Rocket className="h-3.5 w-3.5" />
              </span>
              <span>{FESTIVAL_DETAILS.name}</span>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              The premier intercollegiate technical & cultural celebration hosted at Samrat Ashok Technological Institute (SATI), Vidisha.
              Featuring algorithmic hackathons, robotics arenas, rock battles, and cultural showcases.
            </p>
            <div className="text-slate-500 text-[11px]">
              Est. 1960 · {FESTIVAL_DETAILS.dates} · Vidisha, Madhya Pradesh
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">Quick Navigation</h4>
            <ul className="space-y-1.5">
              <li><a href="#events" className="hover:text-white transition-colors">Event Showcases</a></li>
              <li><a href="#schedule" className="hover:text-white transition-colors">Day-Wise Schedule</a></li>
              <li><a href="#analytical-challenge" className="hover:text-white transition-colors">Concurrency Architecture</a></li>
              <li><a href="#registration-section" className="hover:text-white transition-colors">Online Registration</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact Committee</a></li>
            </ul>
          </div>

          {/* Festival Headquarters */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">Headquarters</h4>
            <p className="text-slate-400 leading-relaxed">
              {FESTIVAL_DETAILS.venue}
            </p>
            <div className="pt-1 text-slate-400">
              <div>Email: <a href={`mailto:${FESTIVAL_DETAILS.contactEmail}`} className="text-indigo-400 hover:underline">{FESTIVAL_DETAILS.contactEmail}</a></div>
              <div>Helpline: <span className="font-mono text-slate-300">{FESTIVAL_DETAILS.helpline}</span></div>
            </div>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} {FESTIVAL_DETAILS.name}. Samrat Ashok Technological Institute (SATI), Vidisha. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Built for Code Crack 3.0 College Fest Challenge</span>
            <span>·</span>
            <span>Frontend Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
