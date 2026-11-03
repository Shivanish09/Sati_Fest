import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';
import { FESTIVAL_DETAILS } from '../data/events.ts';
import { ContactFormData } from '../types.ts';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isValidEmail = (email: string) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim());
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name || formData.name.trim().length < 2) {
      errs.name = 'Please provide your full name';
    }
    if (!formData.email || !isValidEmail(formData.email)) {
      errs.email = 'Please provide a valid email address (e.g. fest@example.edu)';
    }
    if (!formData.message || formData.message.trim().length < 10) {
      errs.message = 'Message must be at least 10 characters long';
    }
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });

    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length === 0) {
      setIsSubmitted(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const errs = validate();
      setErrors((prev) => ({ ...prev, [name]: errs[name] || '' }));
    }
  };

  return (
    <section id="contact" className="py-16 md:py-24 border-t border-slate-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="text-xs font-medium text-indigo-400 tracking-wider uppercase mb-1 font-mono">
                Support & Campus Desk
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Get in Touch
              </h2>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Have questions about event guidelines, accommodation, or transportation shuttles?
                Reach out directly to the AstroFest organizing committee.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-lg bg-indigo-950/60 border border-indigo-800/50 text-indigo-400 shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500 uppercase tracking-wider font-mono">Official Fest Email</span>
                  <a href={`mailto:${FESTIVAL_DETAILS.contactEmail}`} className="text-sm font-semibold text-white hover:text-indigo-400 transition-colors">
                    {FESTIVAL_DETAILS.contactEmail}
                  </a>
                  <p className="text-[11px] text-slate-400 mt-0.5">Response guaranteed within 6 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-lg bg-indigo-950/60 border border-indigo-800/50 text-indigo-400 shrink-0">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500 uppercase tracking-wider font-mono">Emergency Hotline</span>
                  <span className="text-sm font-semibold text-white font-mono">
                    {FESTIVAL_DETAILS.helpline}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">Active 24/7 during festival dates</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-lg bg-indigo-950/60 border border-indigo-800/50 text-indigo-400 shrink-0">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500 uppercase tracking-wider font-mono">Campus Location</span>
                  <span className="text-sm font-semibold text-white">
                    {FESTIVAL_DETAILS.venue}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">Main Gate Entrance · Visitor Parking at Gate 3</p>
                </div>
              </div>
            </div>

            {/* Committee credit */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
              <span className="font-semibold text-slate-300 block mb-1">Organizing Leadership</span>
              <span>{FESTIVAL_DETAILS.coordinator}</span>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 sm:p-8">
            {isSubmitted ? (
              <div className="py-8 text-center space-y-4 animate-in fade-in">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Message Dispatched!</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-white">{formData.name}</strong>. Your query regarding <em>{formData.subject}</em> has been assigned ticket reference <span className="font-mono text-indigo-300">#ASTRO-INQ-{Math.floor(1000 + Math.random() * 9000)}</span>. A committee coordinator will respond to <span className="text-white font-mono">{formData.email}</span> shortly.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
                    setTouched({});
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-500 transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div className="text-xs font-semibold text-white mb-2">Send an Official Message</div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-medium text-slate-300 mb-1.5">
                      Your Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="contact-name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Alex Morgan"
                      className={`w-full bg-slate-950 border rounded-lg px-3.5 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none transition-colors ${
                        errors.name && touched.name
                          ? 'border-rose-500 focus:border-rose-400'
                          : 'border-slate-800 focus:border-indigo-500'
                      }`}
                    />
                    {errors.name && touched.name && (
                      <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3 shrink-0" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-medium text-slate-300 mb-1.5">
                      Email Address <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="fest@example.edu"
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

                <div>
                  <label htmlFor="contact-subject" className="block text-xs font-medium text-slate-300 mb-1.5">
                    Inquiry Topic
                  </label>
                  <select
                    id="contact-subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="General Inquiry">General Festival Inquiry</option>
                    <option value="Event Rules & Clarifications">Event Rules & Clarifications</option>
                    <option value="Campus Accommodation & Logistics">Campus Accommodation & Logistics</option>
                    <option value="Sponsorship & Partnership">Sponsorship & Partnership</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-medium text-slate-300 mb-1.5">
                    Your Message <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe your question or request..."
                    className={`w-full bg-slate-950 border rounded-lg px-3.5 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none transition-colors ${
                      errors.message && touched.message
                        ? 'border-rose-500 focus:border-rose-400'
                        : 'border-slate-800 focus:border-indigo-500'
                    }`}
                  />
                  {errors.message && touched.message && (
                    <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Transmit Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
