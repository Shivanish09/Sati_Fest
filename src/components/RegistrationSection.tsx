import React, { useState, useEffect } from 'react';
import { RegistrationForm } from './RegistrationForm.tsx';
import { EventItem, RegistrationPass, FestivalDetails } from '../types.ts';
import { Ticket, CheckCircle, ShieldCheck, Gift, Clock, Sparkles } from 'lucide-react';
import { FESTIVAL_DETAILS } from '../data/events.ts';
import { generateEventIcs, downloadIcsFile } from '../utils/calendar.ts';

interface RegistrationSectionProps {
  events: EventItem[];
  selectedEventId?: string;
  onPassGenerated?: (pass: RegistrationPass) => void;
}

export const RegistrationSection: React.FC<RegistrationSectionProps> = ({
  events,
  selectedEventId,
  onPassGenerated
}) => {
  const [storedPasses, setStoredPasses] = useState<RegistrationPass[]>([]);

  const loadPasses = () => {
    try {
      const data = JSON.parse(localStorage.getItem('satifest_passes') || localStorage.getItem('astrofest_passes') || '[]');
      setStoredPasses(data);
    } catch {
      setStoredPasses([]);
    }
  };

  useEffect(() => {
    loadPasses();
  }, []);

  const handleSuccess = (pass: RegistrationPass) => {
    loadPasses();
    if (onPassGenerated) onPassGenerated(pass);
  };

  return (
    <section id="registration-section" className="py-16 md:py-24 border-t border-slate-800/80 bg-[#060918]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Festival Perks & Information */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="text-xs font-medium text-indigo-400 tracking-wider uppercase mb-1 font-mono">
                Join Sati-Fest 2026 · SATI Vidisha
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                Team & Individual Registration
              </h2>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                Register as an individual or enroll your collegiate team with full member rosters.
                Upon registration, allocate your official problem statement theme and download your synced calendar file.
              </p>
            </div>

            {/* Perks list */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-indigo-950/60 border border-indigo-800/50 text-indigo-400 shrink-0">
                  <Ticket className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Instant Digital Pass</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Immediate on-screen confirmation badge with unique identifier and barcode for express campus entry.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-indigo-950/60 border border-indigo-800/50 text-indigo-400 shrink-0">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Zero Registration Fee</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    All workshops and competitive categories are fully funded by collegiate sponsorships.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-indigo-950/60 border border-indigo-800/50 text-indigo-400 shrink-0">
                  <Gift className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Delegate Kit & Participation Certificates</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Official AstroFest stickers, mission badge, and verified digital certificate for all active attendees.
                  </p>
                </div>
              </div>
            </div>

            {/* Official contact box */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-1">
              <div className="font-semibold text-slate-200">Registration Desk Inquiries</div>
              <div>Email: <a href={`mailto:${FESTIVAL_DETAILS.contactEmail}`} className="text-indigo-400 hover:underline">{FESTIVAL_DETAILS.contactEmail}</a></div>
              <div>Helpline: <span className="text-slate-300 font-mono">{FESTIVAL_DETAILS.helpline}</span></div>
            </div>

            {/* Previous Passes Banner if exists */}
            {storedPasses.length > 0 && (
              <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-800/50 text-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-indigo-300">Your Active Passes ({storedPasses.length})</span>
                  <span className="text-[11px] text-slate-400">Stored locally</span>
                </div>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {storedPasses.map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-900/80 text-[11px] gap-2">
                      <div className="truncate">
                        <span className="font-medium text-slate-200 block truncate">{p.event.title}</span>
                        <span className="font-mono text-amber-300 text-[10px]">{p.passId} · {p.event.venue}</span>
                      </div>
                      <button
                        onClick={() => {
                          const ics = generateEventIcs(
                            p.event,
                            p.passId,
                            p.formData.fullName,
                            p.formData.allocatedTheme,
                            p.formData.themeDirective
                          );
                          downloadIcsFile(`${p.event.id}-sati.ics`, ics);
                        }}
                        className="px-2 py-1 text-[10px] font-mono rounded bg-indigo-950 text-indigo-300 hover:bg-indigo-900 border border-indigo-800/60 shrink-0"
                        title="Download .ics Calendar File"
                      >
                        .ICS
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Validated Registration Form Card */}
          <div className="lg:col-span-7 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
            <RegistrationForm
              events={events}
              preselectedEventId={selectedEventId}
              isModal={false}
              onSuccess={handleSuccess}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
