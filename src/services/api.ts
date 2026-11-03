import { RegistrationPass, EventItem, FestivalDetails } from '../types.ts';
import { SAMPLE_EVENTS, FESTIVAL_DETAILS } from '../data/events.ts';

const LOCAL_STORAGE_PASSES_KEY = 'satifest_passes';
const LOCAL_STORAGE_EVENTS_KEY = 'satifest_events';
const LOCAL_STORAGE_DETAILS_KEY = 'satifest_festival_details';

/**
 * API Service for interacting with the backend database (/api/registrations, etc.)
 * with automatic fallback and local caching.
 */

export async function fetchRegistrationsFromDb(): Promise<RegistrationPass[]> {
  try {
    const res = await fetch('/api/registrations');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        localStorage.setItem(LOCAL_STORAGE_PASSES_KEY, JSON.stringify(data));
        return data;
      }
    }
  } catch (err) {
    console.warn('Backend database not reachable, reading from local cache:', err);
  }

  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_PASSES_KEY) || localStorage.getItem('astrofest_passes');
    return cached ? JSON.parse(cached) : [];
  } catch {
    return [];
  }
}

export async function saveRegistrationToDb(pass: RegistrationPass): Promise<boolean> {
  // Always update local cache first for instant UI response
  try {
    const cached = await fetchRegistrationsFromDb();
    const updated = [pass, ...cached.filter((p) => p.passId !== pass.passId)];
    localStorage.setItem(LOCAL_STORAGE_PASSES_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }

  try {
    const res = await fetch('/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pass),
    });
    return res.ok;
  } catch (err) {
    console.warn('Backend database write deferred:', err);
    return false;
  }
}

export async function deleteRegistrationFromDb(passId: string): Promise<boolean> {
  try {
    const cached = await fetchRegistrationsFromDb();
    const updated = cached.filter((p) => p.passId !== passId);
    localStorage.setItem(LOCAL_STORAGE_PASSES_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }

  try {
    const res = await fetch(`/api/registrations/${encodeURIComponent(passId)}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (err) {
    console.warn('Backend database delete failed:', err);
    return false;
  }
}

export async function clearAllRegistrationsFromDb(): Promise<boolean> {
  localStorage.removeItem(LOCAL_STORAGE_PASSES_KEY);
  try {
    const res = await fetch('/api/registrations', {
      method: 'DELETE',
    });
    return res.ok;
  } catch (err) {
    console.warn('Backend database clear failed:', err);
    return false;
  }
}

export async function fetchEventsFromDb(): Promise<EventItem[]> {
  try {
    const res = await fetch('/api/events');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        localStorage.setItem(LOCAL_STORAGE_EVENTS_KEY, JSON.stringify(data));
        return data;
      }
    }
  } catch {
    // fallback
  }

  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_EVENTS_KEY) || localStorage.getItem('sati_events');
    if (cached) return JSON.parse(cached);
  } catch {
    // fallback
  }

  return SAMPLE_EVENTS;
}

export async function saveEventsToDb(events: EventItem[]): Promise<boolean> {
  localStorage.setItem(LOCAL_STORAGE_EVENTS_KEY, JSON.stringify(events));
  try {
    const res = await fetch('/api/events', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(events),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchFestivalDetailsFromDb(): Promise<FestivalDetails> {
  try {
    const res = await fetch('/api/festival-details');
    if (res.ok) {
      const data = await res.json();
      if (data && data.name) {
        localStorage.setItem(LOCAL_STORAGE_DETAILS_KEY, JSON.stringify(data));
        return data;
      }
    }
  } catch {
    // fallback
  }

  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_DETAILS_KEY) || localStorage.getItem('sati_festival_details');
    if (cached) return JSON.parse(cached);
  } catch {
    // fallback
  }

  return FESTIVAL_DETAILS;
}

export async function saveFestivalDetailsToDb(details: FestivalDetails): Promise<boolean> {
  localStorage.setItem(LOCAL_STORAGE_DETAILS_KEY, JSON.stringify(details));
  try {
    const res = await fetch('/api/festival-details', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(details),
    });
    return res.ok;
  } catch {
    return false;
  }
}
