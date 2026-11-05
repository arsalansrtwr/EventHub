import React, { useState, useEffect } from 'react';
import { CartItem, EnrichedEvent, EnrichedOrder, Order } from '../types';
import { db } from '../services/db';
import { X, Lock, Loader2, CheckCircle2 } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  eventsMap: Map<string, EnrichedEvent>;
  currentUserName?: string;
  currentUserEmail?: string;
  onBookingSuccess: (order: EnrichedOrder) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  eventsMap,
  currentUserName,
  currentUserEmail,
  onBookingSuccess,
}) => {
  const [attendeeName, setAttendeeName] = useState(currentUserName || 'Hamza Tariq');
  const [attendeeEmail, setAttendeeEmail] = useState(currentUserEmail || 'hamza.tariq@gmail.com');
  const [attendeePhone, setAttendeePhone] = useState('+92 300 8472910');
  const [company, setCompany] = useState('Karachi, Pakistan');
  const [paymentMethod, setPaymentMethod] = useState<Order['payment_method']>('easypaisa');
  const [termsAgreed, setTermsAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Reservation hold countdown timer (09:42)
  const [secondsRemaining, setSecondsRemaining] = useState(9 * 60 + 42);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const timerMins = Math.floor(secondsRemaining / 60).toString().padStart(2, '0');
  const timerSecs = (secondsRemaining % 60).toString().padStart(2, '0');

  const enrichedItems = cartItems
    .map((item) => ({
      ...item,
      event: eventsMap.get(item.eventId),
    }))
    .filter((item): item is CartItem & { event: EnrichedEvent } => item.event !== undefined);

  const subtotal = enrichedItems.reduce((sum, item) => sum + item.event.price * item.quantity, 0);
  const grandTotal = subtotal;

  const firstItem = enrichedItems[0];

  const handlePayAndConfirm = async () => {
    setErrorMessage(null);
    if (!attendeeName.trim() || !attendeeEmail.trim()) {
      setErrorMessage('Please provide a valid attendee full name and delivery email address.');
      return;
    }
    if (!termsAgreed) {
      setErrorMessage('Please accept the Box Office Terms & gate entry policy.');
      return;
    }

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 650));

    const result = db.createBooking({
      attendeeName,
      attendeeEmail,
      attendeePhone,
      paymentMethod,
      notes: company ? `City/Location: ${company}` : undefined,
      items: cartItems.map((ci) => ({
        eventId: ci.eventId,
        quantity: ci.quantity,
        seatNumbers: ci.seatNumbers,
      })),
    });

    setIsSubmitting(false);

    if (result.success && result.order) {
      onBookingSuccess(result.order);
      onClose();
    } else {
      setErrorMessage(result.error || 'Booking submission failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[95vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scroll Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
          {/* Top Reservation Countdown Banner */}
          <div className="flex flex-wrap items-center justify-between py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-primary">schedule</span>
              <span>
                Seats held for{' '}
                <strong className="font-mono-numbers font-bold text-slate-900">
                  {timerMins}:{timerSecs}
                </strong>{' '}
                — inventory hold guaranteed
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold">
              <span className="material-symbols-outlined text-[16px] text-emerald-600">verified_user</span>
              <span>256-Bit SSL Secured Box Office</span>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
              {errorMessage}
            </div>
          )}

          {/* Main Checkout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Forms (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Step 1: Attendee Information */}
              <div className="bg-white rounded-xl p-6 shadow-xs flex flex-col gap-4 border border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs">
                      1
                    </span>
                    <h2 className="text-base font-bold text-slate-900 font-display">
                      Attendee & Ticket Pass Details
                    </h2>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">Step 1 of 2</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="font-semibold text-slate-700">Full Legal Name *</label>
                    <input
                      type="text"
                      value={attendeeName}
                      onChange={(e) => setAttendeeName(e.target.value)}
                      placeholder="e.g. Hamza Tariq"
                      className="w-full bg-slate-50 text-slate-900 px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-semibold text-slate-700">Email Address (Pass Delivery) *</label>
                    <input
                      type="email"
                      value={attendeeEmail}
                      onChange={(e) => setAttendeeEmail(e.target.value)}
                      placeholder="hamza.tariq@gmail.com"
                      className="w-full bg-slate-50 text-slate-900 px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-semibold text-slate-700">Mobile Phone (SMS Gate Pass) *</label>
                    <input
                      type="tel"
                      value={attendeePhone}
                      onChange={(e) => setAttendeePhone(e.target.value)}
                      placeholder="+92 300 1234567"
                      className="w-full bg-slate-50 text-slate-900 px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="font-semibold text-slate-700">City / Address</label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Karachi, Lahore, or Islamabad..."
                      className="w-full bg-slate-50 text-slate-900 px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Payment Gateway Choice (Pakistan Rails) */}
              <div className="bg-white rounded-xl p-6 shadow-xs flex flex-col gap-4 border border-slate-200">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs">
                    2
                  </span>
                  <h2 className="text-base font-bold text-slate-900 font-display">
                    Select Pakistani Payment Method
                  </h2>
                </div>

                <div className="flex flex-col gap-2.5">
                  {/* Easypaisa */}
                  <label
                    onClick={() => setPaymentMethod('easypaisa')}
                    className={`cursor-pointer rounded-xl p-3.5 transition-all block border ${
                      paymentMethod === 'easypaisa'
                        ? 'bg-emerald-50/60 border-emerald-500'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment_choice"
                          checked={paymentMethod === 'easypaisa'}
                          onChange={() => setPaymentMethod('easypaisa')}
                          className="w-4 h-4 text-emerald-600 accent-emerald-600 cursor-pointer"
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">Easypaisa Mobile Wallet</span>
                          <span className="text-[11px] text-slate-500">Instant OTP approval · 0% surcharge</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        INSTANT
                      </span>
                    </div>
                  </label>

                  {/* JazzCash */}
                  <label
                    onClick={() => setPaymentMethod('jazzcash')}
                    className={`cursor-pointer rounded-xl p-3.5 transition-all block border ${
                      paymentMethod === 'jazzcash'
                        ? 'bg-amber-50/60 border-amber-500'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment_choice"
                          checked={paymentMethod === 'jazzcash'}
                          onChange={() => setPaymentMethod('jazzcash')}
                          className="w-4 h-4 text-amber-600 accent-amber-600 cursor-pointer"
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">JazzCash Mobile Account</span>
                          <span className="text-[11px] text-slate-500">Pay directly from JazzCash app or MPIN</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                        INSTANT
                      </span>
                    </div>
                  </label>

                  {/* Raast / 1Link */}
                  <label
                    onClick={() => setPaymentMethod('raast_1link')}
                    className={`cursor-pointer rounded-xl p-3.5 transition-all block border ${
                      paymentMethod === 'raast_1link'
                        ? 'bg-indigo-50/60 border-primary'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment_choice"
                          checked={paymentMethod === 'raast_1link'}
                          onChange={() => setPaymentMethod('raast_1link')}
                          className="w-4 h-4 text-primary accent-primary cursor-pointer"
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">Raast / 1Link Instant Bank Pay</span>
                          <span className="text-[11px] text-slate-500">HBL, Meezan, Alfalah, Standard Chartered & all banks</span>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-[20px] text-slate-400">account_balance</span>
                    </div>
                  </label>

                  {/* Debit / Credit Card */}
                  <label
                    onClick={() => setPaymentMethod('card')}
                    className={`cursor-pointer rounded-xl p-3.5 transition-all block border ${
                      paymentMethod === 'card'
                        ? 'bg-indigo-50/60 border-primary'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment_choice"
                          checked={paymentMethod === 'card'}
                          onChange={() => setPaymentMethod('card')}
                          className="w-4 h-4 text-primary accent-primary cursor-pointer"
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">Credit / Debit Card (Visa / Mastercard / PayPak)</span>
                          <span className="text-[11px] text-slate-500">3D Secure verified interbank gateway</span>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-[20px] text-slate-400">credit_card</span>
                    </div>
                  </label>

                  {/* Pay at Venue */}
                  <label
                    onClick={() => setPaymentMethod('pay_at_venue')}
                    className={`cursor-pointer rounded-xl p-3.5 transition-all block border ${
                      paymentMethod === 'pay_at_venue'
                        ? 'bg-indigo-50/60 border-primary'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment_choice"
                          checked={paymentMethod === 'pay_at_venue'}
                          onChange={() => setPaymentMethod('pay_at_venue')}
                          className="w-4 h-4 text-primary accent-primary cursor-pointer"
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">Cash at Venue Box Office</span>
                          <span className="text-[11px] text-slate-500">Collect passes 1 hour before curtain</span>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-[20px] text-slate-400">storefront</span>
                    </div>
                  </label>
                </div>

                {/* Agreement Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600">
                    <input
                      type="checkbox"
                      checked={termsAgreed}
                      onChange={(e) => setTermsAgreed(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-primary accent-primary"
                    />
                    <span>
                      I agree to the <span className="text-primary underline">EventHub Box Office Terms</span> &
                      venue admission rules.
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary Card (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="bg-white rounded-xl p-6 shadow-xs flex flex-col gap-4 border border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 font-display">Order Summary</h3>
                  <span className="text-xs text-slate-400 font-mono-numbers">
                    {enrichedItems.reduce((s, i) => s + i.quantity, 0)} Ticket(s)
                  </span>
                </div>

                {/* Event Mini Banner */}
                {firstItem && (
                  <div className="flex gap-3 bg-slate-50 rounded-xl p-3.5 items-center border border-slate-200">
                    <img
                      src={firstItem.event.poster}
                      alt={firstItem.event.title}
                      className="w-16 h-16 rounded-lg object-cover shadow-2xs shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] text-primary uppercase font-bold tracking-wider">
                        {firstItem.event.categoryName}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {firstItem.event.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <span className="material-symbols-outlined text-[14px] text-slate-400">
                          calendar_month
                        </span>
                        <span>
                          {new Date(firstItem.event.event_date).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                        <span className="material-symbols-outlined text-[14px] text-slate-400 shrink-0">
                          location_on
                        </span>
                        <span className="truncate">{firstItem.event.venue}</span>
                      </p>
                    </div>
                  </div>
                )}

                {/* Line Items */}
                <div className="flex flex-col gap-2.5 py-1 text-xs divide-y divide-slate-100">
                  {enrichedItems.map((item) => (
                    <div key={item.eventId} className="pt-2 first:pt-0">
                      <div className="flex justify-between items-baseline font-semibold text-slate-900">
                        <span>
                          {item.event.title} × {item.quantity}
                        </span>
                        <span className="font-mono-numbers">
                          Rs. {(item.event.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Seats: {item.seatNumbers?.join(', ') || 'General Admission'}
                      </div>
                    </div>
                  ))}

                  <div className="flex items-center justify-between text-xs text-slate-600 pt-2">
                    <span>Box Office Processing</span>
                    <span className="text-emerald-700 font-bold uppercase text-[11px]">
                      Waived (Rs. 0)
                    </span>
                  </div>
                </div>

                {/* Total Due Row in PKR */}
                <div className="bg-slate-50 p-4 rounded-xl flex items-baseline justify-between border border-slate-200">
                  <div className="flex flex-col">
                    <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                      Total Amount Due
                    </span>
                    <span className="text-[11px] text-slate-400">Official verified ticket passes</span>
                  </div>
                  <span className="text-xl text-primary font-extrabold font-mono-numbers">
                    Rs. {grandTotal.toLocaleString()}
                  </span>
                </div>

                {/* CTA Conversion Button */}
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handlePayAndConfirm}
                  className="w-full bg-primary hover:opacity-90 active:scale-[0.99] text-white py-3.5 px-6 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing Payment & Issuing Pass...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Confirm & Issue Pass (Rs. {grandTotal.toLocaleString()})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
