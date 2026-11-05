import React from 'react';
import { X, Printer, Calendar, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { EnrichedOrder } from '../types';
import { QRCodeView } from './QRCodeView';

interface TicketVoucherModalProps {
  order: EnrichedOrder;
  isOpen: boolean;
  onClose: () => void;
}

export const TicketVoucherModal: React.FC<TicketVoucherModalProps> = ({ order, isOpen, onClose }) => {
  if (!isOpen) return null;

  const firstItem = order.items[0];
  const allSeats = order.items.flatMap((i) => i.seat_numbers);

  const handlePrint = () => {
    window.print();
  };

  const isConfirmed = order.status === 'confirmed';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[95vh]">
        {/* Modal Controls Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-100 bg-slate-50/80 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Official Digital Pass & Voucher
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg shadow-2xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Pass
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Ticket Pass Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-slate-100/60 print:p-0 print:bg-white">
          <div className="max-w-md mx-auto bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden relative">
            {/* Top Color Header */}
            <div className="bg-slate-900 text-white p-5 sm:p-6 relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-bold tracking-tight text-indigo-400">EVENTHUB TICKET VOUCHER</div>
                <div
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                    isConfirmed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                  }`}
                >
                  {isConfirmed ? (
                    <>
                      <CheckCircle2 className="w-3 h-3" /> Confirmed
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3" /> {order.status}
                    </>
                  )}
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2 leading-tight">
                {firstItem?.eventTitle || 'Event Ticket'}
              </h2>

              <div className="space-y-1 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  <span>
                    {firstItem?.eventDate
                      ? new Date(firstItem.eventDate).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Date TBA'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{firstItem?.eventVenue || 'Venue Location'}</span>
                </div>
              </div>
            </div>

            {/* Perforated Divider */}
            <div className="relative flex items-center justify-between px-2 bg-white">
              <div className="w-4 h-4 rounded-full bg-slate-100 -ml-4 border-r border-slate-200" />
              <div className="flex-1 border-b border-dashed border-slate-300 mx-2" />
              <div className="w-4 h-4 rounded-full bg-slate-100 -mr-4 border-l border-slate-200" />
            </div>

            {/* Ticket Details & QR Code */}
            <div className="p-6 bg-white space-y-6">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-slate-400 font-medium uppercase tracking-wider text-[10px]">Attendee Name</div>
                  <div className="font-semibold text-slate-900 mt-0.5">{order.attendee_name}</div>
                  <div className="text-slate-500 text-[11px] truncate">{order.attendee_email}</div>
                </div>
                <div>
                  <div className="text-slate-400 font-medium uppercase tracking-wider text-[10px]">Booking Reference</div>
                  <div className="font-mono-numbers font-bold text-slate-900 mt-0.5">#{order.id}</div>
                  <div className="text-slate-500 text-[11px]">
                    Paid: <strong className="text-slate-800">Rs. {order.total_amount.toLocaleString()}</strong>
                  </div>
                </div>

                <div className="col-span-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="text-slate-500 font-medium uppercase tracking-wider text-[10px]">
                    Allocated Seats & Tier
                  </div>
                  <div className="font-mono-numbers text-sm font-bold text-indigo-700 mt-0.5">
                    {allSeats.length > 0 ? allSeats.join(', ') : 'General Admission'}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Total Quantity: {order.items.reduce((s, i) => s + i.quantity, 0)} Ticket(s)
                  </div>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="flex flex-col items-center justify-center pt-2 pb-1 text-center border-t border-slate-100">
                <QRCodeView value={`EVENTHUB:${order.id}:${order.attendee_email}:${allSeats.join('-')}`} size={140} />
                <p className="text-[11px] text-slate-400 mt-2 font-mono-numbers">
                  Scan at venue entrance · Pass #{order.id}
                </p>
              </div>

              {/* Security Barcode Emulation */}
              <div className="pt-2 text-center border-t border-dashed border-slate-200">
                <div className="flex justify-center items-center gap-[2px] h-9 max-w-xs mx-auto opacity-75">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-slate-900 h-full"
                      style={{
                        width: (i % 3 === 0 ? 3 : i % 2 === 0 ? 1 : 2) + 'px',
                      }}
                    />
                  ))}
                </div>
                <div className="text-[9px] font-mono-numbers tracking-widest text-slate-400 mt-1 uppercase">
                  SECURITY SECURE HASH · {order.id.toUpperCase()} · ADMIT HOLDER
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
