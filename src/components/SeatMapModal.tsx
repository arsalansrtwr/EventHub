import React, { useState, useMemo } from 'react';
import { X, Check, Armchair, Info } from 'lucide-react';
import { EnrichedEvent } from '../types';

interface SeatMapModalProps {
  event: EnrichedEvent;
  isOpen: boolean;
  onClose: () => void;
  onConfirmSeats: (seatNumbers: string[], totalPrice: number) => void;
  initialSelectedSeats?: string[];
}

interface SeatInfo {
  id: string; // e.g. 'A-04'
  row: string;
  number: number;
  tier: 'vip' | 'orchestra' | 'balcony';
  price: number;
  isOccupied: boolean;
}

export const SeatMapModal: React.FC<SeatMapModalProps> = ({
  event,
  isOpen,
  onClose,
  onConfirmSeats,
  initialSelectedSeats = [],
}) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>(initialSelectedSeats);

  // Generate deterministic seat map for this event
  const seatsData = useMemo(() => {
    const rows = [
      { row: 'A', tier: 'vip' as const, count: 12, priceOffset: 1500 },
      { row: 'B', tier: 'vip' as const, count: 12, priceOffset: 1500 },
      { row: 'C', tier: 'orchestra' as const, count: 14, priceOffset: 0 },
      { row: 'D', tier: 'orchestra' as const, count: 14, priceOffset: 0 },
      { row: 'E', tier: 'orchestra' as const, count: 14, priceOffset: 0 },
      { row: 'F', tier: 'balcony' as const, count: 16, priceOffset: -800 },
      { row: 'G', tier: 'balcony' as const, count: 16, priceOffset: -800 },
    ];

    // Pseudo-random occupied seats based on event id and seats_available
    const occupiedFraction = Math.max(0, Math.min(0.65, 1 - event.seats_available / event.total_seats));
    const list: SeatInfo[] = [];

    rows.forEach((rConfig) => {
      for (let n = 1; n <= rConfig.count; n++) {
        const seatId = `${rConfig.row}-${n.toString().padStart(2, '0')}`;
        // Deterministic hash to mark some seats as already booked
        const hash = (seatId.charCodeAt(0) * 17 + seatId.charCodeAt(2) * 31 + event.id.length * 13) % 100;
        const isOccupied = hash < occupiedFraction * 100;

        list.push({
          id: seatId,
          row: rConfig.row,
          number: n,
          tier: rConfig.tier,
          price: Math.max(500, event.price + rConfig.priceOffset),
          isOccupied,
        });
      }
    });

    return list;
  }, [event]);

  if (!isOpen) return null;

  const toggleSeat = (seat: SeatInfo) => {
    if (seat.isOccupied) return;
    if (selectedSeats.includes(seat.id)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat.id));
    } else {
      if (selectedSeats.length >= 8) {
        alert('Maximum 8 tickets per customer booking.');
        return;
      }
      setSelectedSeats([...selectedSeats, seat.id]);
    }
  };

  const selectedSeatObjects = seatsData.filter((s) => selectedSeats.includes(s.id));
  const totalPrice = selectedSeatObjects.reduce((sum, s) => sum + s.price, 0);

  const handleConfirm = () => {
    if (selectedSeats.length === 0) return;
    onConfirmSeats(selectedSeats, totalPrice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Interactive Venue Seating Map</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {event.title} · {event.venue}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close Seat Map"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 py-3 px-6 bg-white border-b border-slate-100 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-sm border border-slate-300 bg-white" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-sm bg-indigo-600 border border-indigo-600" />
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-sm bg-slate-200 border border-slate-300 cursor-not-allowed" />
            <span>Reserved</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1.5 text-indigo-700">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>VIP Front Tier (${event.price + 20})</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>Orchestra (${event.price})</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Balcony (${Math.max(10, event.price - 10)})</span>
          </div>
        </div>

        {/* Map Canvas */}
        <div className="flex-1 overflow-y-auto overflow-x-auto p-4 sm:p-6 bg-slate-50/70">
          <div className="sm:hidden text-center text-[11px] text-indigo-600 font-medium mb-3 flex items-center justify-center gap-1 bg-indigo-50/80 py-1 px-3 rounded-lg border border-indigo-100">
            <span className="material-symbols-outlined text-[14px]">swipe</span>
            <span>Swipe horizontally to select seats</span>
          </div>

          {/* Stage Graphic */}
          <div className="max-w-md mx-auto mb-8 text-center">
            <div className="py-2 px-8 bg-slate-900 text-white rounded-t-xl text-xs font-bold tracking-widest uppercase shadow-sm">
              STAGE / AUDITORIUM SCREEN
            </div>
            <div className="h-2 bg-indigo-500/20 rounded-b-xl" />
          </div>

          {/* Seat Grid by Tier */}
          <div className="space-y-6 min-w-[480px] sm:min-w-0 max-w-2xl mx-auto pb-4">
            {/* VIP Tier */}
            <div className="p-3 bg-amber-50/40 border border-amber-200/60 rounded-lg">
              <div className="text-[11px] font-semibold tracking-wider text-amber-800 uppercase mb-2 flex items-center gap-1">
                <Armchair className="w-3.5 h-3.5" /> VIP Golden Rows (A & B)
              </div>
              <div className="space-y-2">
                {['A', 'B'].map((rowLetter) => (
                  <div key={rowLetter} className="flex items-center justify-center gap-1.5 sm:gap-2">
                    <span className="w-5 text-xs font-bold text-slate-400">{rowLetter}</span>
                    <div className="flex gap-1.5 sm:gap-2">
                      {seatsData
                        .filter((s) => s.row === rowLetter)
                        .map((seat) => {
                          const isSelected = selectedSeats.includes(seat.id);
                          return (
                            <button
                              key={seat.id}
                              disabled={seat.isOccupied}
                              onClick={() => toggleSeat(seat)}
                              title={`${seat.id} — $${seat.price} ${seat.isOccupied ? '(Occupied)' : ''}`}
                              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md text-[10px] font-mono-numbers font-semibold flex items-center justify-center transition-all ${
                                seat.isOccupied
                                  ? 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed opacity-60'
                                  : isSelected
                                  ? 'bg-indigo-600 text-white border-2 border-indigo-700 shadow-sm scale-105'
                                  : 'bg-white hover:bg-amber-100/70 text-slate-800 border border-amber-300 shadow-2xs hover:border-amber-400'
                              }`}
                            >
                              {isSelected ? <Check className="w-3.5 h-3.5" /> : seat.number}
                            </button>
                          );
                        })}
                    </div>
                    <span className="w-5 text-xs font-bold text-slate-400 text-right">{rowLetter}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Orchestra Tier */}
            <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-2xs">
              <div className="text-[11px] font-semibold tracking-wider text-slate-600 uppercase mb-2 flex items-center gap-1">
                <Armchair className="w-3.5 h-3.5" /> Orchestra Tier (C, D, E)
              </div>
              <div className="space-y-2">
                {['C', 'D', 'E'].map((rowLetter) => (
                  <div key={rowLetter} className="flex items-center justify-center gap-1.5 sm:gap-2">
                    <span className="w-5 text-xs font-bold text-slate-400">{rowLetter}</span>
                    <div className="flex gap-1.5 sm:gap-2">
                      {seatsData
                        .filter((s) => s.row === rowLetter)
                        .map((seat) => {
                          const isSelected = selectedSeats.includes(seat.id);
                          return (
                            <button
                              key={seat.id}
                              disabled={seat.isOccupied}
                              onClick={() => toggleSeat(seat)}
                              title={`${seat.id} — $${seat.price} ${seat.isOccupied ? '(Occupied)' : ''}`}
                              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md text-[10px] font-mono-numbers font-semibold flex items-center justify-center transition-all ${
                                seat.isOccupied
                                  ? 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed opacity-60'
                                  : isSelected
                                  ? 'bg-indigo-600 text-white border-2 border-indigo-700 shadow-sm scale-105'
                                  : 'bg-white hover:bg-indigo-50 text-slate-800 border border-slate-300 shadow-2xs hover:border-indigo-400'
                              }`}
                            >
                              {isSelected ? <Check className="w-3.5 h-3.5" /> : seat.number}
                            </button>
                          );
                        })}
                    </div>
                    <span className="w-5 text-xs font-bold text-slate-400 text-right">{rowLetter}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Balcony Tier */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="text-[11px] font-semibold tracking-wider text-slate-600 uppercase mb-2 flex items-center gap-1">
                <Armchair className="w-3.5 h-3.5" /> Balcony Tier (F & G)
              </div>
              <div className="space-y-2">
                {['F', 'G'].map((rowLetter) => (
                  <div key={rowLetter} className="flex items-center justify-center gap-1.5 sm:gap-2">
                    <span className="w-5 text-xs font-bold text-slate-400">{rowLetter}</span>
                    <div className="flex gap-1 sm:gap-1.5">
                      {seatsData
                        .filter((s) => s.row === rowLetter)
                        .map((seat) => {
                          const isSelected = selectedSeats.includes(seat.id);
                          return (
                            <button
                              key={seat.id}
                              disabled={seat.isOccupied}
                              onClick={() => toggleSeat(seat)}
                              title={`${seat.id} — Rs. ${seat.price.toLocaleString()} ${seat.isOccupied ? '(Occupied)' : ''}`}
                              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md text-[9px] font-mono-numbers font-semibold flex items-center justify-center transition-all ${
                                seat.isOccupied
                                  ? 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed opacity-60'
                                  : isSelected
                                  ? 'bg-indigo-600 text-white border border-indigo-700 shadow-sm scale-105'
                                  : 'bg-white hover:bg-emerald-50 text-slate-700 border border-slate-300 shadow-2xs hover:border-emerald-400'
                              }`}
                            >
                              {isSelected ? <Check className="w-3 h-3" /> : seat.number}
                            </button>
                          );
                        })}
                    </div>
                    <span className="w-5 text-xs font-bold text-slate-400 text-right">{rowLetter}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Summary & Action */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500">
                {selectedSeats.length > 0 ? (
                  <span>
                    Selected Seats ({selectedSeats.length}):{' '}
                    <strong className="text-slate-800 font-mono-numbers">{selectedSeats.join(', ')}</strong>
                  </span>
                ) : (
                  <span>Click available seats on the map above to select</span>
                )}
              </div>
              <div className="text-base font-bold text-slate-900 font-mono-numbers">
                Subtotal: Rs. {totalPrice.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors w-full sm:w-auto cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={selectedSeats.length === 0}
              className="px-5 py-2 text-xs font-semibold text-white bg-primary hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 w-full sm:w-auto cursor-pointer"
            >
              Confirm {selectedSeats.length} Seat{selectedSeats.length !== 1 ? 's' : ''} (Rs. {totalPrice.toLocaleString()})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
