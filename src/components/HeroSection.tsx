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

      <div className="w-full px-4 sm:px-8 lg:px-12 relative">
        {/* Main Featured Showcase Card */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={() => onSelectEvent(currentEvent)}
          className="group relative bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
        >
          {/* Top Banner Image Area with substantial height / thickness */}
          <div className="relative h-80 sm:h-[480px] md:h-[600px] lg:h-[700px] xl:h-[760px] 2xl:h-[820px] w-full overflow-hidden bg-slate-950">
            {/* Ambient depth blur background layer */}
            <div
              className="absolute inset-0 bg-cover bg-center filter blur-2xl opacity-40 scale-110 pointer-events-none"
              style={{ backgroundImage: `url(${currentEvent.poster})` }}
            />

            <img
              key={currentEvent.id}
              src={currentEvent.poster}
              alt={currentEvent.title}
              className="relative w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 ease-out"
              referrerPolicy="no-referrer"
            />

            {/* Gradient overlays for high text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/45 to-slate-950/10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/25 to-transparent pointer-events-none" />

            {/* Event Typography with generous padding */}
            <div className="absolute bottom-8 sm:bottom-12 left-6 sm:left-12 right-6 sm:right-12 text-white z-10 space-y-3 sm:space-y-4 max-w-5xl">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-indigo-300 font-semibold tracking-wide">
                <span className="bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-indigo-200 border border-white/10 font-bold">
                  {currentEvent.categoryName}
                </span>
                <span>•</span>
                <span>{currentEvent.attributes.city || 'Pakistan'}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-white drop-shadow-md line-clamp-2 font-display">
                {currentEvent.title}
              </h2>

              <p className="hidden sm:block text-xs sm:text-sm md:text-base text-slate-200/95 max-w-4xl line-clamp-2 leading-relaxed">
                {currentEvent.description}
              </p>
            </div>

            {/* Floating Hero Carousel Arrows */}
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous event"
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-950/60 hover:bg-slate-900 text-white backdrop-blur-md flex items-center justify-center transition-all shadow-lg hover:scale-110 border border-white/20 cursor-pointer"
              title="Previous event"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next event"
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-950/60 hover:bg-slate-900 text-white backdrop-blur-md flex items-center justify-center transition-all shadow-lg hover:scale-110 border border-white/20 cursor-pointer"
              title="Next event"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Bottom Card Information & Action Bar */}
          <div className="p-4 sm:p-6 lg:p-7 bg-white flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-t border-slate-100">
            {/* Event Itinerary: Date, Time & Full Venue */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-xs sm:text-sm text-slate-600">
              <div className="flex items-center gap-2.5 shrink-0">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block leading-tight">
                    {new Date(currentEvent.event_date).toLocaleDateString([], {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {new Date(currentEvent.event_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 rounded-xl bg-slate-100 text-slate-600 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="font-medium text-slate-700 text-xs sm:text-sm leading-snug">
                  {currentEvent.venue}
                </span>
              </div>
            </div>

            {/* Price & Action Button */}
            <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
              <div className="text-left sm:text-right">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                  Official Tickets
                </span>
                <span className="text-xl sm:text-2xl font-black font-mono-numbers text-slate-900 leading-none">
                  Rs. {currentEvent.price.toLocaleString()}
                </span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectEvent(currentEvent);
                }}
                className="inline-flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-bold text-white bg-primary hover:opacity-90 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer shrink-0"
              >
                <span>Reserve Seats</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* 4 to 5 Events One-by-One Selector Tabs with Arrow Navigation */}
        <div className="mt-4 sm:mt-6 flex items-center justify-center gap-2 overflow-x-auto w-full pb-2 px-2 scrollbar-none">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous event"
            className="p-2 sm:px-3 sm:py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 hover:border-slate-300 rounded-xl transition-all cursor-pointer shrink-0 shadow-2xs flex items-center gap-1 text-xs font-semibold"
            title="Previous event"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          {displayEvents.map((event, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={event.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`shrink-0 flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
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
                <span className="truncate max-w-[130px] sm:max-w-[200px]">
                  {event.title.split(':')[0]}
                </span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next event"
            className="p-2 sm:px-3 sm:py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 hover:border-slate-300 rounded-xl transition-all cursor-pointer shrink-0 shadow-2xs flex items-center gap-1 text-xs font-semibold"
            title="Next event"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
