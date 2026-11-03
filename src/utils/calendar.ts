import { EventItem } from '../types.ts';
import { FESTIVAL_DETAILS } from '../data/events.ts';

/**
 * Format an ISO date string (e.g. "2026-02-12T10:00:00") into iCalendar UTC/Local format: YYYYMMDDTHHMMSSZ
 */
export function formatIcsDateTime(isoString: string): string {
  const date = new Date(isoString);
  const pad = (n: number) => String(n).padStart(2, '0');
  
  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());

  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

/**
 * Escape text for iCalendar fields (commas, semicolons, backslashes, newlines)
 */
function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/**
 * Generate RFC 5545 compliant iCalendar string for a single event
 */
export function generateEventIcs(
  event: EventItem,
  passId?: string,
  attendeeName?: string,
  themeName?: string,
  themeDirective?: string
): string {
  const dtStart = formatIcsDateTime(event.startIso);
  const dtEnd = formatIcsDateTime(event.endIso);
  const now = formatIcsDateTime(new Date().toISOString());
  const uid = `satifest-${event.id}-${Date.now()}@satiengg.in`;

  let description = `${event.description}\n\nCategory: ${event.category}\nVenue: ${event.venue}\nContact: ${event.contactEmail}`;
  if (passId) {
    description += `\n\nYour Admission Pass ID: ${passId}`;
  }
  if (attendeeName) {
    description += `\nRegistered Attendee: ${attendeeName}`;
  }
  if (themeName) {
    description += `\n\n=== ALLOCATED PROBLEM STATEMENT THEME ===\nTheme: ${themeName.toUpperCase()}\nDirective: ${themeDirective || 'Apply this theme consistently across your project'}`;
  }
  description += `\n\nFestival: Satifest (${FESTIVAL_DETAILS.institution})`;

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Satifest 2026//College Festival Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Satifest 2026',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${escapeIcsText(`${event.title} | Satifest 2026`)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    `LOCATION:${escapeIcsText(`${event.venue}, ${FESTIVAL_DETAILS.venue}`)}`,
    `ORGANIZER;CN=Satifest Organizing Committee:mailto:${event.contactEmail}`,
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    'TRIGGER:-PT30M',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escapeIcsText(`Reminder: ${event.title} begins in 30 minutes at ${event.venue}`)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return icsLines.join('\r\n');
}

/**
 * Generate iCalendar file containing multiple events (e.g., entire itinerary or festival schedule)
 */
export function generateMultipleEventsIcs(events: EventItem[], calendarName = 'Satifest 2026 Itinerary'): string {
  const now = formatIcsDateTime(new Date().toISOString());

  const eventBlocks = events.map((event) => {
    const dtStart = formatIcsDateTime(event.startIso);
    const dtEnd = formatIcsDateTime(event.endIso);
    const uid = `satifest-${event.id}-${Math.random().toString(36).substring(2, 9)}@satiengg.in`;
    const description = `${event.description}\n\nCategory: ${event.category}\nVenue: ${event.venue}\nContact: ${event.contactEmail}`;

    return [
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${now}`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${escapeIcsText(`${event.title} | Satifest 2026`)}`,
      `DESCRIPTION:${escapeIcsText(description)}`,
      `LOCATION:${escapeIcsText(`${event.venue}, ${FESTIVAL_DETAILS.venue}`)}`,
      'STATUS:CONFIRMED',
      'TRANSP:OPAQUE',
      'BEGIN:VALARM',
      'TRIGGER:-PT30M',
      'ACTION:DISPLAY',
      `DESCRIPTION:${escapeIcsText(`Reminder: ${event.title} begins in 30 minutes at ${event.venue}`)}`,
      'END:VALARM',
      'END:VEVENT',
    ].join('\r\n');
  });

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Satifest 2026//College Festival Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeIcsText(calendarName)}`,
    ...eventBlocks,
    'END:VCALENDAR',
  ].join('\r\n');
}

/**
 * Trigger client-side download of the generated .ics file for Google Calendar, Apple Calendar, or Outlook
 */
export function downloadIcsFile(filename: string, icsContent: string): void {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename.endsWith('.ics') ? filename : `${filename}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate direct Google Calendar web event URL
 */
export function getGoogleCalendarUrl(event: EventItem, passId?: string): string {
  const dtStart = formatIcsDateTime(event.startIso);
  const dtEnd = formatIcsDateTime(event.endIso);

  const text = encodeURIComponent(`${event.title} | Satifest 2026`);
  let detailsText = `${event.description}\nCategory: ${event.category}\nVenue: ${event.venue}\nContact: ${event.contactEmail}`;
  if (passId) {
    detailsText += `\nPass ID: ${passId}`;
  }
  const details = encodeURIComponent(detailsText);
  const location = encodeURIComponent(`${event.venue}, ${FESTIVAL_DETAILS.venue}`);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dtStart}/${dtEnd}&details=${details}&location=${location}`;
}
