export type EventCategory = 'Technical' | 'Cultural' | 'Gaming' | 'Workshop';

export type EventDateShort = '12 Feb' | '13 Feb';

export interface EventItem {
  id: string;
  title: string;
  category: EventCategory;
  date: string;
  dateShort: EventDateShort;
  time: string;
  timeSlot: '10:00 AM' | '02:00 PM' | '05:00 PM';
  duration: string;
  venue: string;
  contactEmail: string;
  description: string;
  longDescription: string;
  teamSize: string;
  prizePool?: string;
  capacity: number;
  registeredCount: number;
  rules: string[];
  startIso: string;
  endIso: string;
  coordinators: {
    name: string;
    role: string;
  }[];
  isOverlappingWith?: string[]; // IDs of events that share this time slot
}

export interface TeamMember {
  name: string;
  email: string;
  college?: string;
  role?: string;
}

export type RegistrationType = 'individual' | 'team';

export interface RegistrationFormData {
  registrationType?: RegistrationType;
  fullName: string; // Individual name or Team Leader name
  email: string;
  phone: string;
  college: string;
  eventId: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  teamName?: string;
  teamMembers?: TeamMember[];
  notes?: string;
  allocatedTheme?: string;
  themeDirective?: string;
  acceptedTerms: boolean;
}

export interface FestTheme {
  name: string;
  badgeColor: string;
  directive: string;
  coreRule: string;
}

export interface RegistrationPass {
  passId: string;
  issuedAt: string;
  formData: RegistrationFormData;
  event: EventItem;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface FestivalDetails {
  name: string;
  fullTitle: string;
  institution: string;
  tagline: string;
  theme: string;
  dates: string;
  campus: string;
  city: string;
  venue: string;
  contactEmail: string;
  instituteEmail: string;
  helpline: string;
  coordinator: string;
  totalPrizePool?: string;
  establishedYear: string;
  alumniNote: string;
}

