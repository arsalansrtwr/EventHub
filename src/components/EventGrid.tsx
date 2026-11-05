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
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-3 sm:gap-6">
      {events.map((event) => {
        const eventDate = new Date(event.event_date);
        const weekday = eventDate.toLocaleDateString('en-US', { weekday: 'short' });
        const timeStr = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return (
          <article
            key={event.id}
            className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-xs hover:shadow-md border border-slate-200 hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between group"
          >
            {/* Poster Header */}
            <div
              onClick={() => onSelectEvent(event)}
              className="relative h-36 sm:h-52 w-full overflow-hidden cursor-pointer bg-slate-900"
            >
              <img
                src={event.poster}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95 group-hover:opacity-100"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/20" />

              {/* City Pill Top Left */}
              {event.attributes.city && (
                <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex items-center">
                  <span className="bg-slate-900/85 backdrop-blur-md text-white text-[9px] sm:text-[11px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-full border border-white/20">
                    {event.attributes.city}
                  </span>
                </div>
              )}

              {/* Time & Weekday Bottom Right */}
              <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 text-white text-xs">
                <span className="text-[9px] sm:text-[11px] text-slate-200 font-medium bg-slate-900/60 backdrop-blur-sm px-1.5 sm:px-2 py-0.5 rounded-md">
                  {weekday} · {timeStr}
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-3 sm:p-5 flex flex-col flex-1 justify-between gap-2.5 sm:gap-4">
              <div className="space-y-1.5 sm:space-y-2.5">
                <h4
                  onClick={() => onSelectEvent(event)}
                  className="font-bold text-xs sm:text-base text-slate-900 group-hover:text-primary transition-colors leading-snug cursor-pointer line-clamp-2 font-display"
                  title={event.title}
                >
                  {event.title}
                </h4>

                <div className="hidden sm:block space-y-1 text-slate-500 text-[10px] sm:text-xs">
                  <div className="flex items-center gap-1 sm:gap-1.5 truncate">
                    <span className="material-symbols-outlined text-[14px] sm:text-[16px] text-slate-400 shrink-0">
                      location_on
                    </span>
                    <span className="truncate text-slate-600 font-medium">{event.venue}</span>
                  </div>
                </div>
              </div>

              {/* Price & Action Row */}
              <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-slate-100 gap-1 sm:gap-2">
                <div>
                  <span className="block text-[8px] sm:text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    Tickets
                  </span>
                  <div className="text-xs sm:text-base font-bold text-slate-900 font-mono-numbers">
                    Rs. {event.price.toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                  <button
                    onClick={() => onOpenSeatMap(event)}
                    className="hidden sm:inline-flex p-1 sm:p-2 bg-slate-100 hover:bg-indigo-50 hover:text-primary text-slate-700 rounded-lg sm:rounded-xl transition-colors cursor-pointer border border-slate-200"
                    title="Choose Specific Seats on Venue Map"
                  >
                    <span className="material-symbols-outlined text-[15px] sm:text-[18px]">event_seat</span>
                  </button>

                  <button
                    onClick={() => onSelectEvent(event)}
                    className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-primary hover:opacity-90 text-white rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-0.5 sm:gap-1 shrink-0"
                  >
                    <span>Book</span>
                    <span className="material-symbols-outlined text-[12px] sm:text-[14px]">arrow_forward</span>
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
