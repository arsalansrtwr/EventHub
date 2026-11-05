import React from 'react';
import { EnrichedEvent } from '../types';

interface EventGridProps {
  events: EnrichedEvent[];
  onSelectEvent: (event: EnrichedEvent) => void;
  onOpenSeatMap: (event: EnrichedEvent) => void;
  onQuickBook: (event: EnrichedEvent) => void;
}

export const EventGrid: React.FC<EventGridProps> = ({
  events,
  onSelectEvent,
  onOpenSeatMap,
  onQuickBook,
}) => {
  if (events.length === 0) {
    return (
      <div className="py-20 text-center bg-white rounded-2xl border border-slate-200 p-8 max-w-lg mx-auto shadow-xs">
        <span className="material-symbols-outlined text-slate-300 text-[48px] block mb-2">event_busy</span>
        <h3 className="text-base font-bold text-slate-900">No matching events found</h3>
        <p className="text-xs text-slate-500 mt-1">
          Try expanding your search query, selecting "All Pakistan Cities", or raising the price slider.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => {
        const eventDate = new Date(event.event_date);
        const monthShort = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
        const dayNumber = eventDate.toLocaleDateString('en-US', { day: '2-digit' });
        const weekday = eventDate.toLocaleDateString('en-US', { weekday: 'short' });
        const timeStr = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const soldCount = event.total_seats - event.seats_available;
        const soldPct = Math.round((soldCount / event.total_seats) * 100);
        const isUrgent = event.seats_available <= 50;

        return (
          <article
            key={event.id}
            className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-md border border-slate-200 hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between group"
          >
            {/* Poster Header */}
            <div
              onClick={() => onSelectEvent(event)}
              className="relative h-52 w-full overflow-hidden cursor-pointer bg-slate-900"
            >
              <img
                src={event.poster}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95 group-hover:opacity-100"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/20" />

              {/* Category Pill Top Left */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="bg-white/95 backdrop-blur-md text-slate-900 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-2xs">
                  {event.categoryName}
                </span>
                {event.attributes.city && (
                  <span className="bg-slate-900/85 backdrop-blur-md text-white text-[11px] font-semibold px-2 py-0.5 rounded-full border border-white/20">
                    {event.attributes.city}
                  </span>
                )}
              </div>

              {/* Clean Date Box Top Right */}
              <div className="absolute top-3 right-3 bg-white rounded-xl px-2.5 py-1.5 text-center shadow-md border border-slate-100">
                <span className="block text-[10px] text-primary uppercase font-extrabold tracking-wider leading-none">
                  {monthShort}
                </span>
                <span className="block text-lg font-extrabold text-slate-900 leading-tight font-mono-numbers">
                  {dayNumber}
                </span>
              </div>

              {/* Capacity & Urgency Badge Bottom Left */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                {isUrgent ? (
                  <span className="inline-flex items-center gap-1.5 bg-[#F43F5E] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    {event.seats_available <= 0 ? 'Sold Out' : `Only ${event.seats_available} Seats Free`}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-slate-900/80 backdrop-blur-md text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {event.seats_available} Available
                  </span>
                )}
                <span className="text-[11px] text-slate-200 font-medium">
                  {weekday} · {timeStr}
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 flex flex-col flex-1 justify-between gap-4">
              <div className="space-y-2.5">
                <h4
                  onClick={() => onSelectEvent(event)}
                  className="font-bold text-base text-slate-900 group-hover:text-primary transition-colors leading-snug cursor-pointer line-clamp-2 font-display"
                  title={event.title}
                >
                  {event.title}
                </h4>

                <div className="space-y-1 text-slate-500 text-xs">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="material-symbols-outlined text-[16px] text-slate-400 shrink-0">
                      location_on
                    </span>
                    <span className="truncate text-slate-600 font-medium">{event.venue}</span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                    <span>Lang: <strong className="text-slate-600 font-normal">{event.attributes.language || 'Urdu'}</strong></span>
                    <span>•</span>
                    <span>Age: <strong className="text-slate-600 font-normal">{event.attributes.age_limit || 'All Ages'}</strong></span>
                  </div>
                </div>
              </div>

              {/* Price & Action Row */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    Official Tickets
                  </span>
                  <div className="text-base font-bold text-slate-900 font-mono-numbers">
                    Rs. {event.price.toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenSeatMap(event)}
                    className="p-2 bg-slate-100 hover:bg-indigo-50 hover:text-primary text-slate-700 rounded-xl transition-colors cursor-pointer border border-slate-200"
                    title="Choose Specific Seats on Venue Map"
                  >
                    <span className="material-symbols-outlined text-[18px]">event_seat</span>
                  </button>

                  <button
                    onClick={() => onSelectEvent(event)}
                    className="px-3.5 py-2 bg-primary hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1"
                  >
                    <span>Book Pass</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};
