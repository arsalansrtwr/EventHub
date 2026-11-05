import React, { useState } from 'react';

interface FooterProps {
  onResetDemoData: () => void;
  onOpenAdmin: () => void;
  onOpenEmails: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onResetDemoData, onOpenAdmin, onOpenEmails }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubscribed(true);
    setNewsletterEmail('');
    setTimeout(() => setNewsletterSubscribed(false), 4000);
  };

  return (
    <footer className="w-full bg-white shadow-[0_-1px_8px_rgba(0,0,0,0.02)] mt-16 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1 & 2: Branding & Live Engine Status */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-xs">
                EH
              </span>
              <span className="text-base font-bold text-slate-900 tracking-tight font-display">
                EventHub <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full ml-1 border border-indigo-100">Pakistan</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              Pakistan&apos;s premier live event ticketing portal. Official partner for Coke Studio concerts, PSL cricket fixtures, Sufi Qawwali, literature festivals, and enterprise tech summits across Karachi, Lahore, and Islamabad.
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs text-slate-600 font-medium">
                Official Ticketing Partner • SECP Reg. #1184-PK
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              UAN Helpline: <span className="font-semibold text-slate-700 font-mono-numbers">+92 21 111-383-684</span> (Mon–Sat, 9 AM – 9 PM PKT)
            </div>
          </div>

          {/* Col 3: Browse Categories */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
              Popular Categories
            </h4>
            <span className="text-xs text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer">
              Live Concerts & Festivals
            </span>
            <span className="text-xs text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer">
              Tech & Startup Summits
            </span>
            <span className="text-xs text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer">
              Cricket & Sports Arenas
            </span>
            <span className="text-xs text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer">
              Sufi Qawwali & Classical
            </span>
            <span className="text-xs text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer">
              Literature & Performing Arts
            </span>
          </div>

          {/* Col 4: Platform & Operations */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
              Box Office Portals
            </h4>
            <button
              onClick={onOpenAdmin}
              className="text-left text-xs text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
            >
              <span className="material-symbols-outlined text-[16px] text-indigo-600">dashboard</span>
              Box Office Admin Console
            </button>
            <button
              onClick={onOpenEmails}
              className="text-left text-xs text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
            >
              <span className="material-symbols-outlined text-[16px] text-indigo-600">mail</span>
              Dispatched Ticket Outbox
            </button>
            <button
              onClick={onResetDemoData}
              className="text-left text-xs text-slate-600 hover:text-rose-600 transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
              title="Restore initial Pakistani box office database seed"
            >
              <span className="material-symbols-outlined text-[16px] text-rose-500">restart_alt</span>
              Reset Box Office Catalog
            </button>
          </div>

          {/* Col 5: Stay Informed Newsletter */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
              Priority Pass Drops
            </h4>
            <p className="text-xs text-slate-500">
              Get notified of early bird drops, Coke Studio passes, and PSL finals.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-1.5 mt-1">
              <div className="flex items-center bg-slate-100 rounded-xl px-2 py-1 border border-slate-200 focus-within:border-indigo-500 focus-within:bg-white transition-all">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="bg-transparent w-full text-slate-900 placeholder:text-slate-400 text-xs px-2 py-1 focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 shadow-2xs"
                >
                  Join
                </button>
              </div>
              {newsletterSubscribed ? (
                <span className="text-[11px] text-emerald-600 font-medium">✓ You are subscribed to event drop alerts!</span>
              ) : (
                <span className="text-[10px] text-slate-400">Zero spam. Verified official passes only.</span>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} EventHub Pakistan (Pvt.) Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-600 transition-colors cursor-pointer">
              Karachi (FTC Building)
            </span>
            <span className="hover:text-slate-600 transition-colors cursor-pointer">
              Lahore (Alhamra)
            </span>
            <span className="hover:text-slate-600 transition-colors cursor-pointer">
              Islamabad (F-7 Markaz)
            </span>
            <span className="hover:text-slate-600 transition-colors cursor-pointer">
              Privacy & Security
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
