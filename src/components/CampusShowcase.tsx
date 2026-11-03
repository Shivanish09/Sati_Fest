import React, { useState } from 'react';
import { MapPin, Users, Building, Laptop, Wrench, Music, ArrowRight, CheckCircle2, Info, Maximize2, X, Camera } from 'lucide-react';
import { FESTIVAL_DETAILS } from '../data/events.ts';

interface FacilityItem {
  id: string;
  title: string;
  tag: string;
  description: string;
  specs: string[];
  hostedEvents: string[];
  imageSrc?: string;
  imageAlt?: string;
  svgIllustration?: React.ReactNode;
}

export const CampusShowcase: React.FC = () => {
  const [activeFacilityIndex, setActiveFacilityIndex] = useState(0);
  const [isFullscreenImageOpen, setIsFullscreenImageOpen] = useState(false);

  const facilities: FacilityItem[] = [
    {
      id: 'main-building',
      title: 'Main Academic Building & Historic Portico',
      tag: 'Campus Heritage · Est. 1960',
      description: 'The iconic central administrative and academic landmark of SATI Vidisha, founded by Maharaja Jiwajirao Scindia. Features the prominent clock tower, lush manicured botanical gardens, and the beloved "I ❤️ SATI" landmark monument.',
      specs: ['85-Acre Lush Green Campus', 'Administrative & Dean Secretariat', 'Historic Clock Tower & Central Gardens', 'Visitor Helpdesk at Portico Gate 1'],
      hostedEvents: ['Festival Registration Headquarters', 'Inaugural Flag Off', 'Welcome & Helpdesk Desk'],
      imageSrc: '/assets/aistudio/image_265e489f.png',
      imageAlt: 'Samrat Ashok Technological Institute (SATI) Vidisha Main Campus Building with I Love SATI Monument'
    },
    {
      id: 'kailash-satyarthi-hall',
      title: 'Kailash Satyarthi Auditorium',
      tag: 'Flagship Event Arena · 800 Seater',
      description: 'Named in honour of SATI alumnus and Nobel Peace Laureate Kailash Satyarthi. Equipped with acoustic treatment, stage lighting, and projection systems for technical symposiums and keynote conclaves.',
      specs: ['800 Upholstered Seater Capacity', 'High-Fidelity Sound Engineering', 'Dual Titan Projection Displays'],
      hostedEvents: ['Engineers 2030 Hackathon', 'Inaugural Ceremony', 'Grand Valedictory'],
      svgIllustration: (
        <svg viewBox="0 0 400 220" className="w-full h-full object-cover" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="220" fill="#0f172a" />
          {/* Auditorium Stage & Lights */}
          <polygon points="30,170 370,170 330,120 70,120" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5" />
          {/* Stage Backdrop */}
          <rect x="100" y="40" width="200" height="80" rx="4" fill="#0284c7" opacity="0.3" stroke="#0284c7" strokeWidth="1.5" />
          <text x="200" y="85" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold" fontFamily="sans-serif">KAILASH SATYARTHI HALL</text>
          <text x="200" y="105" textAnchor="middle" fill="#93c5fd" fontSize="10" fontFamily="sans-serif">Nobel Laureate Alumni Memorial</text>
          {/* Spotlight beams */}
          <polygon points="100,0 130,120 70,120" fill="#60a5fa" opacity="0.15" />
          <polygon points="300,0 330,120 270,120" fill="#60a5fa" opacity="0.15" />
          {/* Seating tiers */}
          <path d="M10 185 Q200 175 390 185" stroke="#475569" strokeWidth="4" />
          <path d="M0 205 Q200 195 400 205" stroke="#334155" strokeWidth="6" />
        </svg>
      )
    },
    {
      id: 'computer-center-lab-2',
      title: 'Central Computer Center (Lab 2)',
      tag: 'Computing Center · Gigabit LAN',
      description: 'Centralized high-speed computing facility housing workstations with dedicated Linux and Windows dev environments. Venue for the flagship Code Sprint algorithmic tournament.',
      specs: ['120 Workstations with Dual Monitors', 'Redundant Gigabit Fiber Backbone', 'Automated Grading Server Nodes'],
      hostedEvents: ['Code Sprint Tournament', 'Developer Bug-Fixing', 'Algorithmic Battles'],
      svgIllustration: (
        <svg viewBox="0 0 400 220" className="w-full h-full object-cover" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="220" fill="#0b1329" />
          {/* Grid lines on floor */}
          <line x1="0" y1="180" x2="400" y2="180" stroke="#1e293b" strokeWidth="2" />
          {/* Workstation rows */}
          <g transform="translate(40, 70)">
            <rect x="0" y="20" width="80" height="50" rx="4" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
            <rect x="5" y="25" width="70" height="38" rx="2" fill="#0284c7" opacity="0.4" />
            <rect x="35" y="70" width="10" height="15" fill="#475569" />
            <rect x="25" y="85" width="30" height="4" fill="#334155" />
            {/* Terminal text lines */}
            <line x1="12" y1="35" x2="45" y2="35" stroke="#38bdf8" strokeWidth="2" />
            <line x1="12" y1="42" x2="65" y2="42" stroke="#38bdf8" strokeWidth="2" />
            <line x1="12" y1="49" x2="35" y2="49" stroke="#38bdf8" strokeWidth="2" />
          </g>
          <g transform="translate(160, 70)">
            <rect x="0" y="20" width="80" height="50" rx="4" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
            <rect x="5" y="25" width="70" height="38" rx="2" fill="#0284c7" opacity="0.4" />
            <rect x="35" y="70" width="10" height="15" fill="#475569" />
            <rect x="25" y="85" width="30" height="4" fill="#334155" />
            <line x1="12" y1="35" x2="55" y2="35" stroke="#38bdf8" strokeWidth="2" />
            <line x1="12" y1="42" x2="40" y2="42" stroke="#38bdf8" strokeWidth="2" />
            <line x1="12" y1="49" x2="60" y2="49" stroke="#38bdf8" strokeWidth="2" />
          </g>
          <g transform="translate(280, 70)">
            <rect x="0" y="20" width="80" height="50" rx="4" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
            <rect x="5" y="25" width="70" height="38" rx="2" fill="#0284c7" opacity="0.4" />
            <rect x="35" y="70" width="10" height="15" fill="#475569" />
            <rect x="25" y="85" width="30" height="4" fill="#334155" />
            <line x1="12" y1="35" x2="48" y2="35" stroke="#38bdf8" strokeWidth="2" />
            <line x1="12" y1="42" x2="68" y2="42" stroke="#38bdf8" strokeWidth="2" />
          </g>
          <text x="200" y="35" textAnchor="middle" fill="#e2e8f0" fontSize="12" fontWeight="bold" fontFamily="monospace">CENTRAL COMPUTER CENTER · LAB 2</text>
        </svg>
      )
    },
    {
      id: 'central-workshop-robotics',
      title: 'Central Workshop & Fabrication Bay',
      tag: 'Hardware Prototyping Yard',
      description: 'SATI’s extensive fabrication and mechanical engineering workshop. Featuring specialized tooling, soldering stations, and a custom sand-and-rock Martian test course for the Pragyan Rover Challenge.',
      specs: ['Chassis Fabrication & 24V Docks', 'Obstacle Course & Crater Arena', 'CNC Precision Workbenches'],
      hostedEvents: ['Pragyan Lunar Rover Challenge', 'Hardware Prototyping', 'Robotics Scrimmage'],
      svgIllustration: (
        <svg viewBox="0 0 400 220" className="w-full h-full object-cover" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="220" fill="#111827" />
          {/* Workshop roof trusses */}
          <line x1="0" y1="30" x2="200" y2="10" stroke="#374151" strokeWidth="2" />
          <line x1="200" y1="10" x2="400" y2="30" stroke="#374151" strokeWidth="2" />
          <line x1="50" y1="30" x2="200" y2="30" stroke="#4b5563" strokeWidth="1" />
          {/* Terrain course */}
          <path d="M0 170 Q100 140 200 160 T400 150 L400 220 L0 220 Z" fill="#78350f" opacity="0.5" />
          {/* Rover Vehicle */}
          <g transform="translate(160, 115)">
            <rect x="15" y="15" width="50" height="25" rx="3" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
            <circle cx="10" cy="40" r="10" fill="#1f2937" stroke="#f59e0b" strokeWidth="2" />
            <circle cx="40" cy="40" r="10" fill="#1f2937" stroke="#f59e0b" strokeWidth="2" />
            <circle cx="70" cy="40" r="10" fill="#1f2937" stroke="#f59e0b" strokeWidth="2" />
            <line x1="40" y1="15" x2="50" y2="0" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="50" cy="0" r="3" fill="#f59e0b" />
          </g>
          <text x="200" y="45" textAnchor="middle" fill="#f3f4f6" fontSize="12" fontWeight="bold" fontFamily="sans-serif">CENTRAL WORKSHOP & ROBOTICS ARENA</text>
        </svg>
      )
    }
  ];

  const active = facilities[activeFacilityIndex];

  return (
    <section id="campus-showcase" className="py-16 md:py-24 border-t border-slate-800 bg-[#090d1f]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs font-semibold text-indigo-400 tracking-wider uppercase mb-1 font-mono">
              Campus Tour & Facilities
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
              Samrat Ashok Technological Institute
            </h2>
            <p className="mt-2 text-sm text-slate-300 max-w-2xl leading-relaxed">
              Explore the 85-acre historic campus in Vidisha (M.P.). From the Kailash Satyarthi Auditorium
              to Central Computer Center Lab 2, discover the venues where Satifest 2026 unfolds.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Founded by Maharaja Jiwajirao Scindia</span>
            <span className="text-slate-600">·</span>
            <span className="text-xs font-mono font-bold text-indigo-300">Est. 1960</span>
          </div>
        </div>

        {/* Facility Selector Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {facilities.map((fac, idx) => (
            <button
              key={fac.id}
              onClick={() => setActiveFacilityIndex(idx)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                activeFacilityIndex === idx
                  ? 'bg-indigo-950/70 border-indigo-500/80 text-white shadow-lg ring-1 ring-indigo-500/30'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span className="block text-[10px] font-mono text-indigo-400 uppercase tracking-wider mb-1">
                Venue 0{idx + 1}
              </span>
              <span className="font-heading font-bold text-xs sm:text-sm text-white line-clamp-1 block">
                {fac.title}
              </span>
              <span className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                {fac.tag}
              </span>
            </button>
          ))}
        </div>

        {/* Featured Facility Card Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-6 sm:p-8">
          {/* Facility Visual Graphic Illustration or Authentic Campus Photograph */}
          <div className="lg:col-span-7 rounded-xl overflow-hidden border border-slate-700/80 aspect-[16/9] shadow-inner relative group bg-slate-950">
            {active.imageSrc ? (
              <div 
                className="w-full h-full relative cursor-pointer overflow-hidden"
                onClick={() => setIsFullscreenImageOpen(true)}
                title="Click to view full photo of SATI Vidisha campus"
              >
                <img
                  src={active.imageSrc}
                  alt={active.imageAlt || active.title}
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />
                
                {/* Official Photo Badge */}
                <div className="absolute top-3 right-3 bg-indigo-600/90 backdrop-blur-md text-white text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full shadow-lg border border-indigo-400/40 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Real Campus Photo</span>
                </div>

                {/* Enlarge Button Hint */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFullscreenImageOpen(true);
                  }}
                  className="absolute top-3 left-3 bg-black/60 hover:bg-black/90 backdrop-blur-md text-slate-200 hover:text-white p-1.5 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 text-xs font-mono"
                >
                  <Maximize2 className="h-3.5 w-3.5 text-indigo-400" />
                  <span className="text-[10px]">Expand</span>
                </button>
              </div>
            ) : (
              active.svgIllustration
            )}
            <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-lg text-[11px] font-mono text-slate-200 border border-white/10 flex items-center gap-2 shadow-lg pointer-events-none">
              <MapPin className="h-3.5 w-3.5 text-indigo-400" />
              <span>SATI Vidisha Campus Landmark</span>
            </div>
          </div>

          {/* Facility Details Column */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <span className="text-xs font-mono text-indigo-400 font-semibold uppercase tracking-wider block mb-1">
                {active.tag}
              </span>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-tight">
                {active.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                {active.description}
              </p>
            </div>

            <div className="space-y-2 border-t border-slate-800 pt-4">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Key Facility Specifications:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {active.specs.map((spec, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-slate-800 pt-4">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Featured Events at this Venue:
              </span>
              <div className="flex flex-wrap gap-2">
                {active.hostedEvents.map((ev, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 text-xs rounded bg-slate-950 border border-slate-800 text-slate-200"
                  >
                    {ev}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen High-Resolution Campus Photo Lightbox Modal */}
      {isFullscreenImageOpen && active.imageSrc && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
          onClick={() => setIsFullscreenImageOpen(false)}
        >
          <div 
            className="relative max-w-5xl w-full bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
              <div className="flex items-center gap-2.5">
                <Camera className="h-4 w-4 text-indigo-400" />
                <h3 className="font-heading font-bold text-white text-sm sm:text-base">
                  Samrat Ashok Technological Institute (SATI), Vidisha
                </h3>
                <span className="text-xs text-slate-400 hidden sm:inline">· Main Academic Building & Landmark</span>
              </div>
              <button
                type="button"
                onClick={() => setIsFullscreenImageOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Image Body */}
            <div className="relative bg-black flex items-center justify-center max-h-[75vh] overflow-hidden">
              <img
                src={active.imageSrc}
                alt={active.imageAlt || active.title}
                className="max-h-[75vh] w-auto max-w-full object-contain mx-auto"
              />
            </div>

            {/* Modal Caption Footer */}
            <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                <span>Civil Lines, Vidisha, Madhya Pradesh - 464001</span>
              </div>
              <div className="font-mono text-[11px] text-indigo-300">
                Featuring the Historic Clock Tower & "I ❤️ SATI" Garden Monument
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

