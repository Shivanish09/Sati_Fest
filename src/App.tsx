/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { CampusShowcase } from './components/CampusShowcase.tsx';
import { EventCards } from './components/EventCards.tsx';
import { Schedule } from './components/Schedule.tsx';
import { AnalyticalExplanation } from './components/AnalyticalExplanation.tsx';
import { RegistrationSection } from './components/RegistrationSection.tsx';
import { RegistrationModal } from './components/RegistrationModal.tsx';
import { SavedModal } from './components/SavedModal.tsx';
import { AdminPanel } from './components/AdminPanel.tsx';
import { ContactSection } from './components/ContactSection.tsx';
import { Footer } from './components/Footer.tsx';
import { SAMPLE_EVENTS, FESTIVAL_DETAILS } from './data/events.ts';
import { EventItem, FestivalDetails, RegistrationPass } from './types.ts';
import {
  fetchRegistrationsFromDb,
  deleteRegistrationFromDb,
  clearAllRegistrationsFromDb,
  fetchEventsFromDb,
  saveEventsToDb,
  fetchFestivalDetailsFromDb,
  saveFestivalDetailsToDb,
} from './services/api.ts';

export default function App() {
  // Festival Details State (Admin customizable & persisted in database)
  const [festivalDetails, setFestivalDetails] = useState<FestivalDetails>(() => {
    try {
      const saved = localStorage.getItem('satifest_festival_details');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...FESTIVAL_DETAILS, ...parsed, name: 'Sati-Fest', fullTitle: 'Sati-Fest 2026' };
      }
      return FESTIVAL_DETAILS;
    } catch {
      return FESTIVAL_DETAILS;
    }
  });

  // Events State (Admin customizable & persisted in database)
  const [events, setEvents] = useState<EventItem[]>(() => {
    try {
      const saved = localStorage.getItem('satifest_events');
      if (saved) {
        const parsed: EventItem[] = JSON.parse(saved);
        return parsed.map((e) => {
          const { prizePool, ...rest } = e;
          return rest;
        });
      }
      return SAMPLE_EVENTS;
    } catch {
      return SAMPLE_EVENTS;
    }
  });

  // Registered Passes State (Loaded from backend database)
  const [registeredPasses, setRegisteredPasses] = useState<RegistrationPass[]>(() => {
    try {
      const saved = localStorage.getItem('satifest_passes') || localStorage.getItem('astrofest_passes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [savedEventIds, setSavedEventIds] = useState<string[]>([]);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | undefined>(undefined);
  const [recentPass, setRecentPass] = useState<RegistrationPass | null>(null);

  // Load from persistent database on mount
  useEffect(() => {
    fetchRegistrationsFromDb().then((passes) => {
      if (Array.isArray(passes) && passes.length > 0) {
        setRegisteredPasses(passes);
      }
    });

    fetchEventsFromDb().then((dbEvents) => {
      if (Array.isArray(dbEvents) && dbEvents.length > 0) {
        setEvents(dbEvents);
      }
    });

    fetchFestivalDetailsFromDb().then((details) => {
      if (details && details.name) {
        setFestivalDetails({ ...details, name: 'Sati-Fest', fullTitle: 'Sati-Fest 2026' });
      }
    });

    try {
      const stored = localStorage.getItem('satifest_saved_events') || localStorage.getItem('astrofest_saved_events');
      if (stored) {
        setSavedEventIds(JSON.parse(stored));
      }
    } catch {
      // fallback
    }
  }, []);

  // Save changes from Admin Panel to Database
  const handleUpdateFestivalDetails = async (updated: FestivalDetails) => {
    const formatted = { ...updated, name: 'Sati-Fest', fullTitle: 'Sati-Fest 2026' };
    setFestivalDetails(formatted);
    await saveFestivalDetailsToDb(formatted);
  };

  const handleUpdateEvents = async (updated: EventItem[]) => {
    setEvents(updated);
    await saveEventsToDb(updated);
  };

  const handleDeletePass = async (passId: string) => {
    const updated = registeredPasses.filter((p) => p.passId !== passId);
    setRegisteredPasses(updated);
    await deleteRegistrationFromDb(passId);
  };

  const handleClearAllPasses = async () => {
    setRegisteredPasses([]);
    await clearAllRegistrationsFromDb();
  };

  const handlePassGenerated = (pass: RegistrationPass) => {
    setRecentPass(pass);
    setRegisteredPasses((prev) => [pass, ...prev]);
  };

  const toggleSaveEvent = (id: string) => {
    setSavedEventIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('satifest_saved_events', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleOpenRegister = (eventId?: string) => {
    if (eventId) {
      setSelectedEventId(eventId);
    } else {
      setSelectedEventId(events[0]?.id);
    }
    setIsRegisterModalOpen(true);
  };

  const handleSelectEventFromCard = (eventId: string) => {
    setSelectedEventId(eventId);
    setIsRegisterModalOpen(true);
  };

  const savedEventsList = events.filter((ev) => savedEventIds.includes(ev.id));

  return (
    <div className="relative min-h-screen bg-[#070b19] text-slate-100 flex flex-col selection:bg-indigo-600 selection:text-white">
      {/* Collegiate ambient background gradient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-indigo-900/15 rounded-full blur-3xl" />
      </div>

      {/* Main Content Wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Navigation Bar with dynamic Sati-Fest name and Admin console button */}
        <Navbar
          festivalName={festivalDetails.name}
          onOpenRegister={() => handleOpenRegister()}
          savedCount={savedEventIds.length}
          onOpenSavedModal={() => setIsSavedModalOpen(true)}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />

        {/* Main Sections */}
        <main className="flex-1">
          {/* Sati-Fest Hero Banner with Countdown & Metrics */}
          <Hero 
            festivalDetails={festivalDetails} 
            onOpenRegister={() => handleOpenRegister()} 
          />

          {/* SATI Vidisha Campus & Facilities Showcase (Est. 1960) */}
          <CampusShowcase />

          {/* Featured Events with Category, Day & Search Filters */}
          <EventCards
            events={events}
            savedEventIds={savedEventIds}
            onToggleSave={toggleSaveEvent}
            onSelectEventToRegister={handleSelectEventFromCard}
          />

          {/* Day-Wise & Time-Wise Schedule with Parallel Matrix View & Full .ICS Export */}
          <Schedule
            events={events}
            onSelectEventToRegister={handleSelectEventFromCard}
          />

          {/* Analytical Challenge: Explicit Reasoning on Simultaneous Slots */}
          <AnalyticalExplanation />

          {/* Form Registration Section: Team & Individual with Theme Roulette & Database Save */}
          <RegistrationSection
            events={events}
            selectedEventId={selectedEventId}
            onPassGenerated={handlePassGenerated}
          />

          {/* Contact Committee Section */}
          <ContactSection />
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Modal Dialog for Event Registration (Team / Individual) */}
      <RegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        events={events}
        preselectedEventId={selectedEventId}
        onSuccess={handlePassGenerated}
      />

      {/* Modal Dialog for Saved Events / Bookmarked Itinerary */}
      <SavedModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedEvents={savedEventsList}
        onRemove={toggleSaveEvent}
        onRegister={(eventId) => {
          setSelectedEventId(eventId);
          setIsRegisterModalOpen(true);
        }}
      />

      {/* Full Festival Administrator Control Panel (Passcode: sati1960) */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        festivalDetails={festivalDetails}
        onUpdateFestivalDetails={handleUpdateFestivalDetails}
        events={events}
        onUpdateEvents={handleUpdateEvents}
        registeredPasses={registeredPasses}
        onDeletePass={handleDeletePass}
        onClearAllPasses={handleClearAllPasses}
      />
    </div>
  );
}
