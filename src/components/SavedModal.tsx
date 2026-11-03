import React from 'react';
import { X, BookmarkCheck, Calendar, Clock, MapPin, Trash2, ArrowRight, Download } from 'lucide-react';
import { EventItem } from '../types.ts';
import { generateMultipleEventsIcs, generateEventIcs, downloadIcsFile } from '../utils/calendar.ts';

interface SavedModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedEvents: EventItem[];
  onRemove: (id: string) => void;
  onRegister: (id: string) => void;
}

export const SavedModal: React.FC<SavedModalProps> = ({
  isOpen,
  onClose,
  savedEvents,
  onRemove,
  onRegister,
}) => {
  if (!isOpen) return null;

  // Check if saved events have mutual schedule conflicts
  const hasTimeConflict = savedEvents.some((ev, idx) =>
    savedEvents.slice(idx + 1).some((other) => other.dateShort === ev.dateShort && other.timeSlot === ev.timeSlot)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl p-6 text-slate-200 shadow-2xl max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono uppercase tracking-wider mb-1">
          <BookmarkCheck className="h-4 w-4" />
          <span>Personal Itinerary</span>
        </div>
        <h3 className="font-heading text-xl font-bold text-white mb-2">
          Your Saved Festival Events ({savedEvents.length})
        </h3>
        <p className="text-xs text-slate-400 mb-5">
          Events you bookmarked for AstroFest 2026. Stored locally on this device.
        </p>

        {hasTimeConflict && (
          <div className="mb-4 p-3 rounded-lg bg-amber-950/40 border border-amber-800/40 text-xs text-amber-300">
            <strong>Schedule Advisory:</strong> Two or more of your saved events share the same time slot! You can still attend whichever you prefer on the day or choose one to register.
          </div>
        )}

        {savedEvents.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            No events saved yet. Click the bookmark icon on any event card to plan your personal festival schedule!
          </div>
        ) : (
          <div className="space-y-3 mb-6">
            {savedEvents.map((event) => (
              <div
                key={event.id}
                className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-4"
              >
                <div>
                  <div className="text-[11px] font-mono text-indigo-400">
                    {event.category} · {event.dateShort}, {event.timeSlot}
                  </div>
                  <h4 className="font-heading text-sm font-bold text-white">{event.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <MapPin className="h-3 w-3 text-indigo-400" />
                    <span>{event.venue}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onClose();
                      onRegister(event.id);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded hover:bg-indigo-500"
                  >
                    Register
                  </button>
                  <button
                    onClick={() => onRemove(event.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-900"
                    title="Remove from saved"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          {savedEvents.length > 0 ? (
            <button
              onClick={() => {
                const ics = generateMultipleEventsIcs(savedEvents, 'My Saved AstroFest 2026 Itinerary');
                downloadIcsFile('my-saved-itinerary.ics', ics);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-300 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-800/80 rounded-lg transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Saved Itinerary (.ICS)</span>
            </button>
          ) : <div />}

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white"
          >
            Close Itinerary
          </button>
        </div>
      </div>
    </div>
  );
};
