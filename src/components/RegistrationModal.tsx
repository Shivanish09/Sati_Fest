import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { RegistrationForm } from './RegistrationForm.tsx';
import { EventItem, RegistrationPass } from '../types.ts';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: EventItem[];
  preselectedEventId?: string;
  onSuccess?: (pass: RegistrationPass) => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  events,
  preselectedEventId,
  onSuccess
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#090d22] border border-slate-700/80 rounded-2xl p-6 sm:p-8 text-slate-100 shadow-2xl max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
          aria-label="Close registration dialog"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6">
          <div className="text-xs font-mono font-medium text-indigo-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Official Event Registration</span>
          </div>
          <h3 className="font-heading text-2xl font-bold text-white tracking-tight">
            Reserve Your Delegate Slot
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Free admission for university students. Fill out the details below to receive your instant digital entry pass.
          </p>
        </div>

        <RegistrationForm
          events={events}
          preselectedEventId={preselectedEventId}
          isModal={true}
          onCloseModal={onClose}
          onSuccess={onSuccess}
        />
      </div>
    </div>
  );
};
