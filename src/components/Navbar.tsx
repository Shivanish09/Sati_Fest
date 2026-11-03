import React, { useState } from 'react';
import { Menu, X, Rocket, BookmarkCheck, Shield } from 'lucide-react';

interface NavbarProps {
  festivalName: string;
  onOpenRegister: (eventId?: string) => void;
  savedCount: number;
  onOpenSavedModal: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  festivalName,
  onOpenRegister,
  savedCount,
  onOpenSavedModal,
  onOpenAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Events', href: '#events' },
    { label: 'Schedule', href: '#schedule' },
    { label: 'Schedule Analysis', href: '#analytical-challenge' },
    { label: 'Registration', href: '#registration-section' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#050714]/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-3 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-indigo-400 transition-colors"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Rocket className="h-4 w-4" />
          </span>
          <span className="font-heading">{festivalName}</span>
        </a>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-white hover:underline underline-offset-8 decoration-indigo-400/60 transition-colors whitespace-nowrap shrink-0"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 primary action + bookmark quick access + admin portal */}
        <div className="flex items-center gap-3 shrink-0">
          {savedCount > 0 && (
            <button
              onClick={onOpenSavedModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-300 bg-indigo-950/60 border border-indigo-800/60 rounded-md hover:bg-indigo-900/60 transition-colors whitespace-nowrap"
              title="View your saved schedule itinerary"
            >
              <BookmarkCheck className="h-3.5 w-3.5" />
              <span>{savedCount} Saved</span>
            </button>
          )}

          <button
            onClick={() => onOpenRegister()}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-500 active:scale-95 transition-all whitespace-nowrap shrink-0 shadow-sm shadow-indigo-500/20"
          >
            Register Now
          </button>

          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/60 rounded-md transition-colors"
            title="Open Festival Administrator Panel"
          >
            <Shield className="h-3.5 w-3.5 text-indigo-400" />
            <span className="hidden lg:inline text-[11px]">Admin</span>
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-md border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#070b1a] px-4 pt-3 pb-6 transition-all">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-sm font-medium text-slate-300 hover:text-white border-b border-slate-800/50"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenRegister();
                }}
                className="w-full py-2.5 text-center text-xs font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-500 transition-colors"
              >
                Register for Events
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
