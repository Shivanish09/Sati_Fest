import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Ticket,
  Printer,
  Copy,
  Check,
  QrCode,
  ArrowRight,
  Sparkles,
  X,
  Calendar,
  Download,
  ExternalLink,
  Dices,
  RotateCcw,
  Users,
  User,
  Plus,
  Trash2,
  Building,
} from 'lucide-react';
import { EventItem, RegistrationFormData, RegistrationPass, FestTheme, TeamMember, RegistrationType } from '../types.ts';
import { generateEventIcs, downloadIcsFile, getGoogleCalendarUrl } from '../utils/calendar.ts';
import { PROBLEM_STATEMENT_THEMES, getRandomTheme } from '../data/themes.ts';
import { saveRegistrationToDb } from '../services/api.ts';

interface RegistrationFormProps {
  events: EventItem[];
  preselectedEventId?: string;
  isModal?: boolean;
  onCloseModal?: () => void;
  onSuccess?: (pass: RegistrationPass) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  events,
  preselectedEventId,
  isModal = false,
  onCloseModal,
  onSuccess,
}) => {
  const initialEventId = preselectedEventId || (events[0]?.id ?? '');
  const initialEvent = events.find((e) => e.id === initialEventId) || events[0];

  // Helper to detect if an event is fundamentally for a team
  const isTeamByNature = (teamSizeStr?: string) => {
    if (!teamSizeStr) return false;
    const lower = teamSizeStr.toLowerCase();
    if (lower.includes('individual') || lower.includes('solo') || lower === '1 person') {
      return false;
    }
    return true;
  };

  const [registrationType, setRegistrationType] = useState<RegistrationType>(
    initialEvent && isTeamByNature(initialEvent.teamSize) ? 'team' : 'individual'
  );

  const [formData, setFormData] = useState<RegistrationFormData>({
    registrationType: initialEvent && isTeamByNature(initialEvent.teamSize) ? 'team' : 'individual',
    fullName: '',
    email: '',
    phone: '',
    college: 'Samrat Ashok Technological Institute (SATI), Vidisha',
    eventId: initialEventId,
    experienceLevel: 'Beginner',
    teamName: '',
    teamMembers: [],
    notes: '',
    allocatedTheme: undefined,
    themeDirective: undefined,
    acceptedTerms: false,
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { name: '', email: '', college: 'SATI Vidisha', role: 'Member 2' },
  ]);

  const [allocatedTheme, setAllocatedTheme] = useState<FestTheme | null>(null);
  const [isRollingTheme, setIsRollingTheme] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submittedPass, setSubmittedPass] = useState<RegistrationPass | null>(null);
  const [copiedPassId, setCopiedPassId] = useState(false);
  const [isSavingDb, setIsSavingDb] = useState(false);

  // Sync selected event if passed from parent
  useEffect(() => {
    if (preselectedEventId) {
      setFormData((prev) => ({ ...prev, eventId: preselectedEventId }));
      const ev = events.find((e) => e.id === preselectedEventId);
      if (ev) {
        const isTeam = isTeamByNature(ev.teamSize);
        setRegistrationType(isTeam ? 'team' : 'individual');
        setFormData((prev) => ({ ...prev, registrationType: isTeam ? 'team' : 'individual' }));
      }
    }
  }, [preselectedEventId, events]);

  const currentEvent = events.find((e) => e.id === formData.eventId) || events[0];

  const handleEventChange = (eventId: string) => {
    const ev = events.find((e) => e.id === eventId);
    const isTeam = ev ? isTeamByNature(ev.teamSize) : false;
    const newType = isTeam ? 'team' : 'individual';
    setRegistrationType(newType);
    setFormData((prev) => ({
      ...prev,
      eventId,
      registrationType: newType,
    }));
  };

  // Theme Randomizer Handler
  const handleRollTheme = () => {
    setIsRollingTheme(true);
    let iterations = 0;
    const maxIterations = 7;
    const interval = setInterval(() => {
      const sample = getRandomTheme();
      setAllocatedTheme(sample);
      iterations++;
      if (iterations >= maxIterations) {
        clearInterval(interval);
        const finalPick = getRandomTheme();
        setAllocatedTheme(finalPick);
        setIsRollingTheme(false);
        setFormData((prev) => ({
          ...prev,
          allocatedTheme: finalPick.name,
          themeDirective: finalPick.directive,
        }));
      }
    }, 60);
  };

  // Team Member Management
  const handleAddMember = () => {
    if (teamMembers.length >= 7) return;
    setTeamMembers((prev) => [
      ...prev,
      {
        name: '',
        email: '',
        college: formData.college || 'SATI Vidisha',
        role: `Member ${prev.length + 2}`,
      },
    ]);
  };

  const handleRemoveMember = (index: number) => {
    setTeamMembers((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    setTeamMembers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Validation
  const isValidEmail = (email: string) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim());
  };

  const isValidPhone = (phone: string) => {
    const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
    return cleaned.length >= 10 && /^\d+$/.test(cleaned);
  };

  const validateField = (name: keyof RegistrationFormData, value: any): string => {
    switch (name) {
      case 'fullName':
        if (!value || value.trim().length < 2) {
          return registrationType === 'team'
            ? 'Team Leader full name is required (min 2 chars)'
            : 'Participant full name is required (min 2 chars)';
        }
        return '';
      case 'teamName':
        if (registrationType === 'team' && (!value || value.trim().length < 2)) {
          return 'Team Name is required for team registrations';
        }
        return '';
      case 'email':
        if (!value || value.trim() === '') {
          return 'Contact email is required';
        }
        if (!isValidEmail(value)) {
          return 'Please enter a valid email format (e.g., student@satiengg.in)';
        }
        return '';
      case 'phone':
        if (!value || value.trim() === '') {
          return 'Mobile / WhatsApp number is required';
        }
        if (!isValidPhone(value)) {
          return 'Please enter a valid phone number (at least 10 digits)';
        }
        return '';
      case 'college':
        if (!value || value.trim().length < 2) {
          return 'College or Institution name is required';
        }
        return '';
      case 'eventId':
        if (!value) {
          return 'Please select an event to register';
        }
        return '';
      case 'acceptedTerms':
        if (!value) {
          return 'You must accept the Sati-Fest guidelines and rules';
        }
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    const val = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({ ...prev, [name]: val }));

    if (touched[name]) {
      const error = validateField(name as keyof RegistrationFormData, val);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (name: keyof RegistrationFormData) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name]);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark fields touched
    const allTouched: Record<string, boolean> = {
      fullName: true,
      email: true,
      phone: true,
      college: true,
      eventId: true,
      acceptedTerms: true,
      ...(registrationType === 'team' ? { teamName: true } : {}),
    };
    setTouched(allTouched);

    const newErrors: Record<string, string> = {};
    (Object.keys(allTouched) as (keyof RegistrationFormData)[]).forEach((field) => {
      const err = validateField(field, formData[field]);
      if (err) newErrors[field] = err;
    });

    // Check team members if team registration
    if (registrationType === 'team') {
      teamMembers.forEach((member, i) => {
        if (!member.name || member.name.trim().length < 2) {
          newErrors[`member_${i}_name`] = `Member ${i + 2} name is required`;
        }
        if (member.email && !isValidEmail(member.email)) {
          newErrors[`member_${i}_email`] = `Member ${i + 2} email format is invalid`;
        }
      });
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Auto-allocate theme if user didn't roll manually
    let finalTheme = allocatedTheme;
    if (!finalTheme) {
      finalTheme = getRandomTheme();
      setAllocatedTheme(finalTheme);
    }

    const selectedEvent = events.find((ev) => ev.id === formData.eventId) || events[0];
    const generatedPassId = `SATI-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const cleanedTeamMembers = registrationType === 'team'
      ? teamMembers.filter((m) => m.name.trim().length > 0)
      : [];

    const newPass: RegistrationPass = {
      passId: generatedPassId,
      issuedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      formData: {
        ...formData,
        registrationType,
        teamMembers: cleanedTeamMembers,
        allocatedTheme: finalTheme.name,
        themeDirective: finalTheme.directive,
      },
      event: selectedEvent,
    };

    setIsSavingDb(true);
    // Write directly to full-stack persistent database and cache
    await saveRegistrationToDb(newPass);
    setIsSavingDb(false);

    setSubmittedPass(newPass);
    if (onSuccess) onSuccess(newPass);
  };

  const handleCopyPassId = () => {
    if (!submittedPass) return;
    navigator.clipboard.writeText(submittedPass.passId);
    setCopiedPassId(true);
    setTimeout(() => setCopiedPassId(false), 2000);
  };

  const handleResetForNew = () => {
    setSubmittedPass(null);
    setAllocatedTheme(null);
    setFormData({
      registrationType: isTeamByNature(events[0]?.teamSize) ? 'team' : 'individual',
      fullName: '',
      email: '',
      phone: '',
      college: 'Samrat Ashok Technological Institute (SATI), Vidisha',
      eventId: events[0]?.id ?? '',
      experienceLevel: 'Beginner',
      teamName: '',
      teamMembers: [],
      notes: '',
      allocatedTheme: undefined,
      themeDirective: undefined,
      acceptedTerms: false,
    });
    setTeamMembers([{ name: '', email: '', college: 'SATI Vidisha', role: 'Member 2' }]);
    setTouched({});
    setErrors({});
  };

  return (
    <div className="relative">
      {/* If already submitted, display the Digital Boarding Pass Confirmation */}
      {submittedPass ? (
        <div className="p-6 sm:p-8 bg-slate-900/95 border border-indigo-500/40 rounded-2xl shadow-2xl animate-in fade-in duration-300">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
              <CheckCircle2 className="h-5 w-5" />
              <span>
                {submittedPass.formData.registrationType === 'team'
                  ? 'Team Registration Confirmed & Saved to Database!'
                  : 'Individual Registration Confirmed & Saved to Database!'}
              </span>
            </div>
            {isModal && onCloseModal && (
              <button
                onClick={onCloseModal}
                className="p-1 text-slate-400 hover:text-white rounded"
                aria-label="Close pass"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Styled Boarding Pass / Ticket */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-950 via-indigo-950/40 to-slate-950 border border-indigo-400/30 p-6 sm:p-7 text-white mb-6 shadow-inner">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-dashed border-indigo-500/30 mb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-indigo-400">
                    Official Admission Pass · Sati-Fest 2026
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      submittedPass.formData.registrationType === 'team'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {submittedPass.formData.registrationType === 'team' ? 'Team Pass' : 'Individual Pass'}
                  </span>
                </div>
                <h4 className="font-heading text-xl font-extrabold text-white">
                  {submittedPass.event.title}
                </h4>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  Track: {submittedPass.event.category} · {submittedPass.event.venue}
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Pass Identifier</span>
                <span className="font-mono text-lg font-bold text-amber-300 tracking-wider">
                  {submittedPass.passId}
                </span>
              </div>
            </div>

            {/* Team Info if Team Pass */}
            {submittedPass.formData.registrationType === 'team' && submittedPass.formData.teamName && (
              <div className="mb-5 p-3 rounded-lg bg-indigo-950/60 border border-indigo-700/40">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-bold uppercase font-mono">
                    <Users className="h-4 w-4 text-indigo-400" />
                    <span>Team: {submittedPass.formData.teamName}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Leader: {submittedPass.formData.fullName}
                  </span>
                </div>
                {submittedPass.formData.teamMembers && submittedPass.formData.teamMembers.length > 0 && (
                  <div className="text-[11px] text-slate-300 border-t border-indigo-900/60 pt-2 flex flex-wrap gap-x-4 gap-y-1">
                    <span className="text-slate-400">Team Roster:</span>
                    <span className="font-medium text-white">{submittedPass.formData.fullName} (Leader)</span>
                    {submittedPass.formData.teamMembers.map((m, idx) => (
                      <span key={idx} className="text-slate-200">
                        • {m.name} {m.college ? `(${m.college})` : ''}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Allocated Problem Statement Theme Card */}
            <div className="mb-5 p-4 rounded-xl bg-slate-950/90 border border-indigo-500/40 shadow-inner">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 text-[11px] font-mono tracking-wider uppercase text-indigo-300">
                  <Dices className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Allocated Problem Statement Theme</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase bg-indigo-600/30 text-indigo-300 border border-indigo-400/50 flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-amber-300" />
                  {submittedPass.formData.allocatedTheme || 'Space'}
                </span>
              </div>
              <p className="text-xs text-slate-200 font-medium leading-relaxed">
                {submittedPass.formData.themeDirective ||
                  'Apply this theme consistently across your project UI, architecture, and live presentation.'}
              </p>
              <div className="mt-2 text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>
                  {submittedPass.formData.registrationType === 'team'
                    ? 'Your team must align your event prototype to this allocated theme for final evaluation at SATI Vidisha.'
                    : 'Your individual submission will be graded on your alignment with this allocated theme.'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs mb-6">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">
                  {submittedPass.formData.registrationType === 'team' ? 'Team Leader' : 'Delegate Name'}
                </span>
                <span className="font-semibold text-slate-200">{submittedPass.formData.fullName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Institution</span>
                <span className="text-slate-200 truncate block">{submittedPass.formData.college}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Contact Email</span>
                <span className="text-indigo-300 font-mono truncate block">{submittedPass.formData.email}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Date & Time</span>
                <span className="text-slate-200">{submittedPass.event.time}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Designated Venue</span>
                <span className="text-slate-200 font-semibold">{submittedPass.event.venue}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Official Coordinator</span>
                <span className="text-slate-400 truncate block">{submittedPass.event.contactEmail}</span>
              </div>
            </div>

            {/* Visual Simulated QR / Barcode Strip */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 bg-slate-900/60 -mx-6 -mb-6 p-4 px-6 rounded-b-xl">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-white rounded text-slate-950">
                  <QrCode className="h-8 w-8" />
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  <div>Status: VERIFIED & SAVED TO DATABASE</div>
                  <div className="text-slate-500">Present this pass at {submittedPass.event.venue} desk</div>
                </div>
              </div>

              <button
                onClick={handleCopyPassId}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded bg-indigo-900/40 text-indigo-300 border border-indigo-700/50 hover:bg-indigo-800/50 transition-colors"
              >
                {copiedPassId ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy ID</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Calendar Sync & Export Controls */}
          <div className="mb-6 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold mb-2">
              <Calendar className="h-4 w-4" />
              <span>Add Sati-Fest Event to Your Personal Calendar (.ics & Google Calendar)</span>
            </div>
            <p className="text-slate-400 text-[11px] mb-3">
              Download the official RFC 5545 calendar event to sync with Microsoft Outlook, Apple Calendar, or Google Calendar with an automatic 30-minute advance alert and your allocated problem statement theme.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const icsContent = generateEventIcs(
                    submittedPass.event,
                    submittedPass.passId,
                    submittedPass.formData.fullName,
                    submittedPass.formData.allocatedTheme,
                    submittedPass.formData.themeDirective
                  );
                  const safeName = submittedPass.event.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                  downloadIcsFile(`${safeName}-satifest-vidisha.ics`, icsContent);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download .ics Calendar File</span>
              </button>

              <a
                href={getGoogleCalendarUrl(submittedPass.event, submittedPass.passId)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-md transition-colors"
              >
                <span>Add to Google Calendar</span>
                <ExternalLink className="h-3 w-3 text-slate-400" />
              </a>
            </div>
          </div>

          {/* Action buttons after registration */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Save Confirmation</span>
            </button>

            <button
              onClick={handleResetForNew}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors"
            >
              <span>Register for Another Event</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* The Validated Form */
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Event Picker Dropdown */}
          <div>
            <label htmlFor="eventId" className="block text-xs font-medium text-slate-300 mb-1.5">
              Select Festival Competition / Event <span className="text-rose-400">*</span>
            </label>
            <select
              id="eventId"
              name="eventId"
              value={formData.eventId}
              onChange={(e) => handleEventChange(e.target.value)}
              onBlur={() => handleBlur('eventId')}
              className={`w-full bg-slate-950 border rounded-lg px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none transition-colors ${
                errors.eventId && touched.eventId
                  ? 'border-rose-500 focus:border-rose-400'
                  : 'border-slate-800 focus:border-indigo-500'
              }`}
            >
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.title} ({ev.category} · {ev.teamSize} · {ev.dateShort}, {ev.timeSlot} · {ev.venue})
                </option>
              ))}
            </select>
          </div>

          {/* Selected Event Context Strip */}
          {currentEvent && (
            <div className="p-3.5 rounded-lg bg-indigo-950/40 border border-indigo-800/40 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 font-mono text-indigo-300 mb-1">
                <span>{currentEvent.title}</span>
                <span className="font-semibold text-amber-300">
                  Venue: {currentEvent.venue} · {currentEvent.timeSlot}
                </span>
              </div>
              <div className="text-slate-400 text-[11px] flex items-center justify-between">
                <span>{currentEvent.date} · Track: {currentEvent.category}</span>
                <span className="px-2 py-0.5 rounded bg-indigo-900/50 text-indigo-200 font-mono text-[10px]">
                  Format: {currentEvent.teamSize}
                </span>
              </div>
            </div>
          )}

          {/* Registration Mode Selector: Team vs Individual */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-300">Registration Category:</span>
              <span className="text-[11px] text-slate-400">
                {currentEvent ? `Recommended: ${currentEvent.teamSize}` : ''}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setRegistrationType('individual');
                  setFormData((prev) => ({ ...prev, registrationType: 'individual' }));
                }}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-xs font-medium transition-all ${
                  registrationType === 'individual'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <User className="h-4 w-4" />
                <span>Individual Registration</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setRegistrationType('team');
                  setFormData((prev) => ({ ...prev, registrationType: 'team' }));
                }}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-xs font-medium transition-all ${
                  registrationType === 'team'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <Users className="h-4 w-4" />
                <span>Team Registration</span>
              </button>
            </div>
          </div>

          {/* TEAM REGISTRATION FIELDS */}
          {registrationType === 'team' && (
            <div className="p-4 rounded-xl bg-slate-950/60 border border-indigo-900/50 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold">
                  <Users className="h-4 w-4 text-indigo-400" />
                  <span>Team Information & Roster</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  {currentEvent?.teamSize || '2 - 4 Members'}
                </span>
              </div>

              {/* Team Name */}
              <div>
                <label htmlFor="teamName" className="block text-xs font-medium text-slate-300 mb-1">
                  Official Team Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  id="teamName"
                  name="teamName"
                  placeholder="e.g. SATI Cyber Titans"
                  value={formData.teamName}
                  onChange={handleChange}
                  onBlur={() => handleBlur('teamName')}
                  className={`w-full bg-slate-950 border rounded-lg px-3.5 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none transition-colors ${
                    errors.teamName && touched.teamName
                      ? 'border-rose-500 focus:border-rose-400'
                      : 'border-slate-800 focus:border-indigo-500'
                  }`}
                />
                {errors.teamName && touched.teamName && (
                  <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    {errors.teamName}
                  </p>
                )}
              </div>

              {/* Additional Team Members */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-300">
                    Additional Team Members ({teamMembers.length})
                  </span>
                  {teamMembers.length < 6 && (
                    <button
                      type="button"
                      onClick={handleAddMember}
                      className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Member</span>
                    </button>
                  )}
                </div>

                {teamMembers.map((member, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>Member #{idx + 2}</span>
                      {teamMembers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(idx)}
                          className="text-slate-500 hover:text-rose-400 transition-colors"
                          title="Remove member"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Member Full Name *"
                        value={member.name}
                        onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                      />
                      <input
                        type="email"
                        placeholder="Member Email (optional)"
                        value={member.email}
                        onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="College / Institution / Branch"
                      value={member.college || ''}
                      onChange={(e) => handleMemberChange(idx, 'college', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                    {errors[`member_${idx}_name`] && (
                      <p className="text-[10px] text-rose-400">{errors[`member_${idx}_name`]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PRIMARY CONTACT / LEADER DETAILS */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-2">
              <User className="h-4 w-4 text-indigo-400" />
              <span>
                {registrationType === 'team' ? 'Team Leader / Primary Contact Details' : 'Participant Details'}
              </span>
            </div>

            {/* Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fullName" className="block text-xs font-medium text-slate-300 mb-1.5">
                  {registrationType === 'team' ? 'Leader Full Name' : 'Full Name'}{' '}
                  <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="e.g. Maya Lin"
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={() => handleBlur('fullName')}
                  className={`w-full bg-slate-950 border rounded-lg px-3.5 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none transition-colors ${
                    errors.fullName && touched.fullName
                      ? 'border-rose-500 focus:border-rose-400'
                      : 'border-slate-800 focus:border-indigo-500'
                  }`}
                />
                {errors.fullName && touched.fullName && (
                  <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-medium text-slate-300 mb-1.5">
                  Contact Email <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="student@satiengg.in"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur('email')}
                  className={`w-full bg-slate-950 border rounded-lg px-3.5 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none transition-colors ${
                    errors.email && touched.email
                      ? 'border-rose-500 focus:border-rose-400'
                      : 'border-slate-800 focus:border-indigo-500'
                  }`}
                />
                {errors.email && touched.email && (
                  <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    {errors.email}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Phone & College */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="block text-xs font-medium text-slate-300 mb-1.5">
                Mobile / WhatsApp <span className="text-rose-400">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="e.g. 9876543210"
                value={formData.phone}
                onChange={handleChange}
                onBlur={() => handleBlur('phone')}
                className={`w-full bg-slate-950 border rounded-lg px-3.5 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none transition-colors ${
                  errors.phone && touched.phone
                    ? 'border-rose-500 focus:border-rose-400'
                    : 'border-slate-800 focus:border-indigo-500'
                }`}
              />
              {errors.phone && touched.phone && (
                <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="college" className="block text-xs font-medium text-slate-300 mb-1.5">
                College / Institution <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                id="college"
                name="college"
                placeholder="e.g. Samrat Ashok Technological Institute"
                value={formData.college}
                onChange={handleChange}
                onBlur={() => handleBlur('college')}
                className={`w-full bg-slate-950 border rounded-lg px-3.5 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none transition-colors ${
                  errors.college && touched.college
                    ? 'border-rose-500 focus:border-rose-400'
                    : 'border-slate-800 focus:border-indigo-500'
                }`}
              />
              {errors.college && touched.college && (
                <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  {errors.college}
                </p>
              )}
            </div>
          </div>

          {/* Study Year */}
          <div>
            <label htmlFor="experienceLevel" className="block text-xs font-medium text-slate-300 mb-1.5">
              Year of Study
            </label>
            <select
              id="experienceLevel"
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="Beginner">1st Year (Foundation Engineering)</option>
              <option value="Intermediate">2nd / 3rd Year (Core Engineering)</option>
              <option value="Advanced">Final Year / Post-Graduate</option>
            </select>
          </div>

          {/* PROBLEM STATEMENT THEME ALLOCATION ROULETTE */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-slate-950 via-indigo-950/40 to-slate-950 border border-indigo-700/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider font-mono">
                  <Dices className="h-4 w-4 text-indigo-400 animate-pulse" />
                  <span>Problem Statement Theme Allocation</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Per festival rule: Each team receives one randomly allocated theme (Retro, Space, Nature, Cyberpunk, etc.) as their problem statement directive.
                </p>
              </div>

              <button
                type="button"
                onClick={handleRollTheme}
                disabled={isRollingTheme}
                className="shrink-0 inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 rounded-lg shadow transition-all disabled:opacity-50"
              >
                {isRollingTheme ? (
                  <>
                    <RotateCcw className="h-3.5 w-3.5 animate-spin" />
                    <span>Allocating Theme...</span>
                  </>
                ) : allocatedTheme ? (
                  <>
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Re-roll Random Theme</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                    <span>Allocate Random Theme</span>
                  </>
                )}
              </button>
            </div>

            {/* Display Allocated Theme Result Card */}
            {allocatedTheme ? (
              <div className="p-3.5 rounded-lg bg-slate-900/90 border border-indigo-500/40 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                    Allocated Theme
                  </span>
                  <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase border ${allocatedTheme.badgeColor}`}>
                    {allocatedTheme.name}
                  </span>
                </div>
                <p className="text-xs text-white font-medium mb-1">
                  Directive: {allocatedTheme.directive}
                </p>
                <p className="text-[11px] text-slate-400">
                  Rule: {allocatedTheme.coreRule}
                </p>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800 text-center text-xs text-slate-400">
                Click <strong className="text-indigo-300">"Allocate Random Theme"</strong> above to draw your team's official problem statement directive.
              </div>
            )}
          </div>

          {/* Terms and Conditions Checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                name="acceptedTerms"
                checked={formData.acceptedTerms}
                onChange={handleChange}
                onBlur={() => handleBlur('acceptedTerms')}
                className="mt-0.5 h-4 w-4 rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-xs text-slate-300 leading-normal">
                I agree to the Sati-Fest rules, venue safety conduct at SATI Vidisha, and confirm all {registrationType === 'team' ? 'team' : 'individual'} details are accurate.
              </span>
            </label>
            {errors.acceptedTerms && touched.acceptedTerms && (
              <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {errors.acceptedTerms}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSavingDb}
              className="w-full py-3 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] rounded-lg transition-all shadow-md shadow-indigo-600/20 text-center disabled:opacity-50"
            >
              {isSavingDb
                ? 'Saving to Sati-Fest Database...'
                : registrationType === 'team'
                ? 'Confirm Team Registration & Save to Database'
                : 'Confirm Individual Registration & Save to Database'}
            </button>
            <p className="mt-2 text-center text-[11px] text-slate-500">
              Immediate registration confirmation recorded in Sati-Fest persistent database. 100% Free Admission.
            </p>
          </div>
        </form>
      )}
    </div>
  );
};
