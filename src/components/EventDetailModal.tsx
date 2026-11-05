import React, { useState } from 'react';
import { EnrichedEvent } from '../types';
import { X } from 'lucide-react';

interface EventDetailModalProps {
  event: EnrichedEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenSeatMap: (event: EnrichedEvent) => void;
  onQuickAddToCart: (event: EnrichedEvent, quantity: number, tier?: string) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  isOpen,
  onClose,
  onOpenSeatMap,
  onQuickAddToCart,
}) => {
  const [stdQty, setStdQty] = useState(1);
  const [vipQty, setVipQty] = useState(0);

  if (!isOpen || !event) return null;

  const stdPrice = event.price;
  const vipPrice = Math.round(event.price * 1.5);

  const totalTickets = stdQty + vipQty;
  const grandTotal = stdQty * stdPrice + vipQty * vipPrice;

  const eventDate = new Date(event.event_date);
  const dateStr = eventDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const timeStr = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleAddToCartAndProceed = () => {
    if (totalTickets <= 0) return;
    onQuickAddToCart(event, totalTickets);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-surface rounded-2xl shadow-2xl border border-border-subtle overflow-hidden flex flex-col my-auto max-h-[95vh]">
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-slate-900/60 hover:bg-slate-900 text-white rounded-full transition-colors backdrop-blur-md cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          {/* Breadcrumb Navigation (Matching Template) */}
          <nav
            aria-label="Breadcrumb"
            className="pb-4 flex items-center gap-1.5 text-xs text-text-muted"
          >
            <span className="material-symbols-outlined text-[16px]">home</span>
            <span>Home</span>
            <span className="text-outline-variant">/</span>
            <span>{event.categoryName}</span>
            <span className="text-outline-variant">/</span>
            <span className="text-on-surface font-semibold truncate max-w-xs">{event.title}</span>
          </nav>

          {/* Main Two-Column Layout (Matching Template) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column (8 cols on desktop) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Hero Card & Visual Banner */}
              <section className="bg-surface-card rounded-xl shadow-sm overflow-hidden flex flex-col border border-border-subtle/50">
                <div className="relative h-64 sm:h-80 w-full overflow-hidden">
                  <img
                    src={event.poster}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/95 via-inverse-surface/40 to-transparent" />

                  {/* Badges Floating Top Left */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-card/90 backdrop-blur-md text-primary text-xs font-bold shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-live-emerald animate-pulse" />
                      LIVE EVENT
                    </span>
                    <span className="px-3 py-1 rounded-full bg-primary text-on-primary text-xs font-bold shadow-sm">
                      {event.categoryName}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-surface-container-low text-on-surface-variant text-xs font-semibold backdrop-blur-md">
                      In-Person & Digital Pass
                    </span>
                  </div>

                  {/* Event Title & Meta Layer */}
                  <div className="absolute bottom-5 left-5 right-5 flex flex-col gap-1.5 text-on-primary">
                    <div className="flex items-center gap-2 text-primary-fixed text-xs font-bold uppercase tracking-wider">
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                      <span>Featured Event Edition</span>
                    </div>
                    <h1 className="font-headline-lg text-2xl sm:text-3xl text-white font-extrabold leading-tight tracking-tight">
                      {event.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 pt-1 text-inverse-on-surface text-xs opacity-90 font-medium">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[18px] text-tertiary-fixed">
                          translate
                        </span>
                        {event.attributes.language || 'English (Live)'}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[18px] text-secondary-fixed">
                          badge
                        </span>
                        Age: {event.attributes.age_limit || 'All Ages'}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[18px] text-live-emerald">
                          event_seat
                        </span>
                        {event.seats_available} Seats Available
                      </span>
                    </div>
                  </div>
                </div>

                {/* Organizer Bar */}
                <div className="px-6 py-4 bg-surface-container-lowest flex flex-wrap items-center justify-between gap-4 border-t border-border-subtle/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary font-bold text-sm shadow-xs">
                      EH
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-text-primary">
                          EventHub Box Office
                        </span>
                        <span
                          className="material-symbols-outlined text-primary text-[16px]"
                          style={{ fontVariationSettings: '"FILL" 1' }}
                        >
                          verified
                        </span>
                      </div>
                      <span className="text-[11px] text-text-secondary">
                        Verified Venue Organizer · Live Real-time Seating
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenSeatMap(event)}
                      className="px-3 py-1.5 rounded-lg bg-surface-subtle hover:bg-surface-container text-primary font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">event_seat</span>
                      <span>View Seat Map</span>
                    </button>
                  </div>
                </div>
              </section>

              {/* Key Quick Facts Bento Grid (Matching Template line 91) */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-surface-card shadow-sm flex items-start gap-4 border border-border-subtle/50">
                  <div className="w-11 h-11 rounded-lg bg-surface-container-low flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[22px]">calendar_month</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] text-text-muted font-bold uppercase tracking-wider">
                      Date & Schedule
                    </span>
                    <span className="text-sm font-bold text-text-primary mt-0.5">{dateStr}</span>
                    <span className="text-xs text-text-secondary mt-0.5">{timeStr} (Doors open 1h prior)</span>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-surface-card shadow-sm flex items-start gap-4 border border-border-subtle/50">
                  <div className="w-11 h-11 rounded-lg bg-surface-container-low flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[22px]">location_on</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] text-text-muted font-bold uppercase tracking-wider">
                      Location
                    </span>
                    <span className="text-sm font-bold text-text-primary mt-0.5 truncate">{event.venue}</span>
                    <span className="text-xs text-text-secondary mt-0.5">
                      {event.attributes.city || 'Central District'} · Main Entrance
                    </span>
                  </div>
                </div>
              </section>

              {/* Location Interactive Stylized Visual Map Preview */}
              <section className="rounded-xl overflow-hidden shadow-sm bg-surface-card p-5 flex flex-col gap-3 border border-border-subtle/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">map</span>
                    <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                      Venue & Logistics Map
                    </h3>
                  </div>
                  <span className="text-xs text-primary font-semibold flex items-center gap-0.5">
                    Live Venue Pin
                  </span>
                </div>
                <div className="w-full h-40 rounded-xl bg-surface-container-high relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-tr from-surface-dim/40 via-surface-container-low to-surface-card opacity-80" />
                  <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                    <line stroke="#777587" strokeWidth="2" x1="0" x2="100%" y1="35" y2="35" />
                    <line stroke="#777587" strokeWidth="2" x1="0" x2="100%" y1="95" y2="95" />
                    <line stroke="#777587" strokeWidth="2" x1="100" x2="100" y1="0" y2="100%" />
                    <line stroke="#3525cd" strokeWidth="3" x1="300" x2="300" y1="0" y2="100%" />
                    <circle cx="300" cy="75" r="8" fill="#3525cd" />
                    <circle cx="300" cy="75" r="18" fill="rgba(53,37,205,0.2)" className="animate-ping" />
                  </svg>
                  <div className="relative z-10 px-4 py-2 bg-surface-card/95 backdrop-blur-md rounded-xl shadow-md flex items-center gap-3">
                    <span className="material-symbols-outlined text-urgency-coral text-[24px]">pin_drop</span>
                    <div>
                      <p className="text-xs font-bold text-text-primary">{event.venue}</p>
                      <p className="text-[11px] text-text-secondary">Official check-in & box office terminal</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Event Highlights & Description */}
              <section className="p-6 rounded-xl bg-surface-card shadow-sm flex flex-col gap-4 border border-border-subtle/50">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[22px]">info</span>
                  <h2 className="font-headline-md text-base font-bold text-text-primary">Event Overview</h2>
                </div>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-surface-canvas border border-border-subtle/40">
                    <span className="material-symbols-outlined text-live-emerald text-[20px] shrink-0">
                      verified
                    </span>
                    <span className="text-xs font-semibold text-text-primary">Instant QR Pass</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-surface-canvas border border-border-subtle/40">
                    <span className="material-symbols-outlined text-live-emerald text-[20px] shrink-0">
                      autorenew
                    </span>
                    <span className="text-xs font-semibold text-text-primary">Free Cancellation</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-surface-canvas border border-border-subtle/40">
                    <span className="material-symbols-outlined text-live-emerald text-[20px] shrink-0">
                      event_seat
                    </span>
                    <span className="text-xs font-semibold text-text-primary">Reserved Seating</span>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column: Ticket Selection Box (4 cols on desktop) */}
            <aside className="w-full lg:col-span-4 lg:sticky lg:top-24 flex flex-col gap-4">
              <div className="p-6 rounded-xl bg-surface-card shadow-md flex flex-col gap-5 border border-border-subtle/60">
                <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                  <div className="flex flex-col">
                    <h2 className="font-headline-sm text-base font-bold text-text-primary">
                      Select Tickets
                    </h2>
                    <p className="text-[12px] text-text-muted mt-0.5">Choose pass quantity</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-surface-container-low text-primary text-xs font-bold">
                    Presale Active
                  </span>
                </div>

                {/* Standard Pass Box */}
                <div className="p-4 rounded-xl bg-surface-container-lowest border border-border-subtle hover:border-primary/30 transition-all">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-xs font-bold text-text-primary block">Standard Pass</span>
                      <span className="text-[11px] text-text-secondary">Full venue & performance access</span>
                    </div>
                    <div className="text-right">
                      <span className="font-headline-sm text-base text-primary font-bold font-mono-numbers">
                        Rs. {stdPrice.toLocaleString()}
                      </span>
                      <span className="block text-[10px] text-text-muted">Box Office Rate</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border-subtle/40">
                    <span className="text-xs text-text-secondary">Quantity</span>
                    <div className="flex items-center bg-surface-subtle rounded-lg p-1 gap-3">
                      <button
                        onClick={() => setStdQty(Math.max(0, stdQty - 1))}
                        disabled={stdQty === 0}
                        className="w-7 h-7 rounded-md flex items-center justify-center bg-surface-card hover:bg-surface-container text-on-surface font-bold transition-colors disabled:opacity-30 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold font-mono-numbers text-text-primary w-4 text-center">
                        {stdQty}
                      </span>
                      <button
                        onClick={() => setStdQty(stdQty + 1)}
                        className="w-7 h-7 rounded-md flex items-center justify-center bg-surface-card hover:bg-surface-container text-on-surface font-bold transition-colors cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* VIP Pass Box */}
                <div className="p-4 rounded-xl bg-surface-container-lowest border border-border-subtle hover:border-primary/30 transition-all">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-xs font-bold text-text-primary block">
                        VIP Enclosure Pass
                      </span>
                      <span className="text-[11px] text-text-secondary">Front row seats & hospitality lounge</span>
                    </div>
                    <div className="text-right">
                      <span className="font-headline-sm text-base text-text-primary font-bold font-mono-numbers">
                        Rs. {vipPrice.toLocaleString()}
                      </span>
                      <span className="block text-[10px] text-text-muted">VIP Hospitality</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border-subtle/40">
                    <span className="text-xs text-text-secondary">Quantity</span>
                    <div className="flex items-center bg-surface-subtle rounded-lg p-1 gap-3">
                      <button
                        onClick={() => setVipQty(Math.max(0, vipQty - 1))}
                        disabled={vipQty === 0}
                        className="w-7 h-7 rounded-md flex items-center justify-center bg-surface-card hover:bg-surface-container text-on-surface font-bold transition-colors disabled:opacity-30 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold font-mono-numbers text-text-primary w-4 text-center">
                        {vipQty}
                      </span>
                      <button
                        onClick={() => setVipQty(vipQty + 1)}
                        className="w-7 h-7 rounded-md flex items-center justify-center bg-surface-card hover:bg-surface-container text-on-surface font-bold transition-colors cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Interactive Seat Map Button */}
                <button
                  onClick={() => {
                    onClose();
                    onOpenSeatMap(event);
                  }}
                  className="w-full py-2.5 px-3 rounded-lg border border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">event_seat</span>
                  <span>Select Specific Seats on Venue Map</span>
                </button>

                {/* Cost Summary Box */}
                <div className="rounded-xl bg-surface-subtle p-4 flex flex-col gap-2 text-xs">
                  {stdQty > 0 && (
                    <div className="flex items-center justify-between text-text-secondary">
                      <span>{stdQty} × Standard Pass</span>
                      <span className="font-bold text-text-primary font-mono-numbers">
                        Rs. {(stdQty * stdPrice).toLocaleString()}
                      </span>
                    </div>
                  )}
                  {vipQty > 0 && (
                    <div className="flex items-center justify-between text-text-secondary">
                      <span>{vipQty} × VIP Enclosure</span>
                      <span className="font-bold text-text-primary font-mono-numbers">
                        Rs. {(vipQty * vipPrice).toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-sm font-bold text-text-primary">
                    <span>Total Amount</span>
                    <span className="text-primary font-mono-numbers text-base font-bold">
                      Rs. {grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Conversion CTA */}
                <button
                  onClick={handleAddToCartAndProceed}
                  disabled={totalTickets === 0}
                  className="w-full h-12 rounded-xl bg-primary hover:bg-secondary text-on-primary font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                  <span>
                    {totalTickets === 0
                      ? 'Select At Least 1 Ticket'
                      : `Add ${totalTickets} Ticket${totalTickets > 1 ? 's' : ''} to Cart & Checkout`}
                  </span>
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};
