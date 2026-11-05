import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { EnrichedEvent } from '../types';

interface HeroSectionProps {
  featuredEvents: EnrichedEvent[];
  onSelectEvent: (event: EnrichedEvent) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onSelectCategory?: (categoryId: string) => void;
  activeCategoryId?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  featuredEvents,
  onSelectEvent,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Take up to 5 events
  const displayEvents = featuredEvents.slice(0, 5);
  const count = displayEvents.length;

  // Auto-advance carousel
  useEffect(() => {
    if (count <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % count);
    }, 5500);

    return () => clearInterval(interval);
  }, [count, isPaused]);

  if (count === 0) return null;

  const currentEvent = displayEvents[currentIndex] || displayEvents[0];

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + count) % count);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % count);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
  };

  return (
    <section
      className="relative bg-gradient-to-b from-slate-50 via-white to-slate-50 border-b border-slate-200 overflow-hidden py-6 sm:py-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Subtle background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(to right, #0f172a 1px, transparent 1px)`,
          backgroundSize: '36px 36px',
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        {/* Main Featured Showcase Card */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={() => onSelectEvent(currentEvent)}
          className="group relative bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
        >
          {/* Top Banner Image Area (Clean, uncluttered, no overlapping badges) */}
          <div className="relative h-72 sm:h-96 md:h-[420px] w-full overflow-hidden bg-slate-950">
            <img
              key={currentEvent.id}
              src={currentEvent.poster}
              alt={currentEvent.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              referrerPolicy="no-referrer"
            />

            {/* Gradient overlays for high text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-transparent" />

            {/* Event Typography with generous padding (No button collision) */}
            <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-10 right-6 sm:right-10 text-white z-10 space-y-2 sm:space-y-3 max-w-4xl">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-indigo-300 font-semibold tracking-wide">
                <span>{currentEvent.categoryName}</span>
                <span>•</span>
                <span>{currentEvent.attributes.city || 'Pakistan'}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight text-white drop-shadow-sm line-clamp-2">
                {currentEvent.title}
              </h2>

              <p className="hidden sm:block text-xs sm:text-sm text-slate-200/90 max-w-3xl line-clamp-2 leading-relaxed">
                {currentEvent.description}
              </p>
            </div>
          </div>

          {/* Bottom Card Control & Information Bar */}
          <div className="p-4 sm:p-6 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-slate-100">
            {/* Date & Venue */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="font-semibold text-slate-800">
                  {new Date(currentEvent.event_date).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="font-medium text-slate-700 truncate max-w-xs sm:max-w-md">
                  {currentEvent.venue}
                </span>
              </div>
            </div>

            {/* Navigation Controls, Price & Action Button */}
            <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-5 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
              {/* Previous & Next Arrows positioned in control bar without text overlap */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous event"
                  className="w-9 h-9 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                  title="Previous event"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next event"
                  className="w-9 h-9 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                  title="Next event"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Price */}
              <div className="text-left sm:text-right">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                  Tickets from
                </span>
                <span className="text-lg sm:text-2xl font-black font-mono-numbers text-slate-900 leading-none">
                  Rs. {currentEvent.price.toLocaleString()}
                </span>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectEvent(currentEvent);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-bold text-white bg-slate-900 group-hover:bg-indigo-600 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer shrink-0"
              >
                <span>Reserve Seats</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* 4 to 5 Events One-by-One Selector Tabs with Arrow Navigation */}
        <div className="mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {displayEvents.map((event, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={event.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-indigo-500/20'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isActive ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {idx + 1}
                </span>
                <span className="truncate max-w-[130px] sm:max-w-[180px]">
                  {event.title.split(':')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
