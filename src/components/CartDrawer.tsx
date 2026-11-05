import React from 'react';
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight, Calendar, MapPin } from 'lucide-react';
import { CartItem, EnrichedEvent } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  eventsMap: Map<string, EnrichedEvent>;
  onUpdateQuantity: (eventId: string, newQty: number) => void;
  onRemoveItem: (eventId: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  eventsMap,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const enrichedCart = items
    .map((item) => {
      const event = eventsMap.get(item.eventId);
      return {
        ...item,
        event,
      };
    })
    .filter((item): item is CartItem & { event: EnrichedEvent } => item.event !== undefined);

  const subtotal = enrichedCart.reduce((sum, item) => sum + item.event.price * item.quantity, 0);
  const serviceFee = subtotal > 0 ? 150 : 0; // PKR 150 box office processing
  const grandTotal = subtotal + serviceFee;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">Your Ticket Cart</h3>
            <span className="text-xs font-mono-numbers text-slate-500">
              ({items.reduce((s, i) => s + i.quantity, 0)} tickets)
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {enrichedCart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 py-12">
              <ShoppingBag className="w-12 h-12 text-slate-300 stroke-1 mb-3" />
              <p className="text-base font-semibold text-slate-800">Your cart is empty</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Explore our curated events catalogue and pick seats for your next live experience!
              </p>
              <button
                onClick={onClose}
                className="mt-6 px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
              >
                Discover Events
              </button>
            </div>
          ) : (
            enrichedCart.map((item) => (
              <div
                key={item.eventId}
                className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-3"
              >
                <div className="flex gap-3">
                  <img
                    src={item.event.poster}
                    alt={item.event.title}
                    className="w-16 h-16 object-cover rounded-lg shrink-0 border border-slate-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.event.title}</h4>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5 truncate">
                      <Calendar className="w-3 h-3 shrink-0 text-slate-400" />
                      <span>{new Date(item.event.event_date).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate">
                      <MapPin className="w-3 h-3 shrink-0 text-slate-400" />
                      <span className="truncate">{item.event.venue}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.eventId)}
                    className="text-slate-400 hover:text-rose-600 p-1 self-start transition-colors"
                    title="Remove from cart"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Seat Numbers Tag if allocated */}
                {item.seatNumbers && item.seatNumbers.length > 0 && (
                  <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    Allocated Seats:{' '}
                    <span className="font-mono-numbers font-semibold text-indigo-700">
                      {item.seatNumbers.join(', ')}
                    </span>
                  </div>
                )}

                {/* Pricing & Quantity Controls */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden shadow-2xs">
                    <button
                      onClick={() => onUpdateQuantity(item.eventId, item.quantity - 1)}
                      className="p-1.5 hover:bg-slate-50 text-slate-600 transition-colors"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold font-mono-numbers text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.eventId, item.quantity + 1)}
                      disabled={item.quantity >= item.event.seats_available}
                      className="p-1.5 hover:bg-slate-50 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-mono-numbers font-bold text-slate-900">
                      Rs. {(item.event.price * item.quantity).toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono-numbers">
                      Rs. {item.event.price.toLocaleString()} each
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout */}
        {enrichedCart.length > 0 && (
          <div className="p-6 border-t border-slate-200 bg-slate-50/70 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-mono-numbers font-semibold">Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Box Office Processing Fee</span>
                <span className="font-mono-numbers font-semibold">Rs. {serviceFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount</span>
                <span className="font-mono-numbers text-indigo-700 font-extrabold text-base">
                  Rs. {grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[10px] text-center text-slate-400">
              Easypaisa, JazzCash, Raast & Card payment supported · Verified passes
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
