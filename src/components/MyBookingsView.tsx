import React, { useState } from 'react';
import { EnrichedOrder, OrderStatus } from '../types';
import { db } from '../services/db';

interface MyBookingsViewProps {
  orders: EnrichedOrder[];
  onViewTicket: (order: EnrichedOrder) => void;
  onRefreshOrders: () => void;
  onBackToCatalogue: () => void;
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({
  orders,
  onViewTicket,
  onRefreshOrders,
  onBackToCatalogue,
}) => {
  const [activeTab, setActiveTab] = useState<'tickets' | 'profile' | 'preferences'>('tickets');
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);

  // Notification toggles simulation
  const [notifPassUpdates, setNotifPassUpdates] = useState(true);
  const [notifSeatAlerts, setNotifSeatAlerts] = useState(true);
  const [notifPresale, setNotifPresale] = useState(false);

  const currentUser = db.getCurrentUser();

  const filteredOrders = orders.filter((order) => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const matchesSearch =
      !searchQuery ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((i) => i.eventTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      order.items.some((i) => i.eventVenue.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const confirmedCount = orders.filter((o) => o.status === 'confirmed').length;
  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const cancelledCount = orders.filter((o) => o.status === 'cancelled').length;

  const handleCancelBooking = (orderId: string) => {
    if (
      window.confirm(
        'Are you sure you want to cancel this booking? Any reserved seats will be automatically restored to the event inventory.'
      )
    ) {
      setCancellingOrderId(orderId);
      const res = db.updateOrderStatus(orderId, 'cancelled');
      setCancellingOrderId(null);
      if (res.success) {
        onRefreshOrders();
      } else {
        alert(res.error || 'Failed to cancel booking.');
      }
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-semibold px-2.5 py-0.5 rounded-full text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            Confirmed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 border border-rose-200/80 font-semibold px-2.5 py-0.5 rounded-full text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
            Cancelled (Seats Restored)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200/80 font-semibold px-2.5 py-0.5 rounded-full text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
            Pending Admin Review
          </span>
        );
    }
  };

  return (
    <div className="w-full bg-[#faf8ff] min-h-[calc(100vh-5rem)]">
      <div className="w-full px-4 sm:px-8 lg:px-12 py-6 flex flex-col gap-6">
        {/* Breadcrumb back */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={onBackToCatalogue}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Back to Event Catalogue</span>
          </button>
          <span className="text-xs text-slate-400 font-mono-numbers truncate hidden sm:inline-block">
            Client Session: {currentUser?.email || 'Guest attendee'}
          </span>
        </div>

        {/* Top Profile Summary Card */}
        <div className="relative overflow-hidden rounded-2xl bg-white shadow-xs p-4 sm:p-6 border border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
              <img
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover ring-2 ring-indigo-500/20 shadow-xs shrink-0"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"
                alt={currentUser?.name || 'User Profile'}
              />
              <div className="flex flex-col gap-0.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  <h1 className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight font-display whitespace-nowrap">
                    {currentUser?.name || 'Dur-e-Adan'}
                  </h1>
                  <span className="bg-slate-100 text-slate-700 text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                    {currentUser?.role === 'admin' ? 'Box Office Admin' : 'VIP Member'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate">
                  {currentUser?.email || 'dureadan@gmail.com'} • Karachi & Lahore Events
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-start gap-4 sm:gap-8 border-t md:border-t-0 md:border-l border-slate-100 md:border-slate-200 pt-3 md:pt-0 md:pl-8">
              <div className="flex flex-col">
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Total Orders
                </span>
                <span className="text-xl sm:text-2xl font-bold font-mono-numbers text-slate-900 mt-0.5">
                  {orders.length}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Active Passes
                </span>
                <span className="text-xl sm:text-2xl font-bold font-mono-numbers text-indigo-600 mt-0.5">
                  {confirmedCount}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Pending Review
                </span>
                <span className="text-xl sm:text-2xl font-bold font-mono-numbers text-amber-600 mt-0.5">
                  {pendingCount}
                </span>
              </div>
            </div>
          </div>

          {/* Subnav Tabs */}
          <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto pt-3 sm:pt-4 mt-4 border-t border-slate-100 text-xs font-semibold scrollbar-none flex-nowrap min-w-0">
            <button
              onClick={() => setActiveTab('tickets')}
              className={`pb-2.5 flex items-center gap-1.5 transition-colors cursor-pointer border-b-2 shrink-0 whitespace-nowrap ${
                activeTab === 'tickets'
                  ? 'text-indigo-600 border-indigo-600'
                  : 'text-slate-500 border-transparent hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">confirmation_number</span>
              <span>Bookings & Passes ({orders.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`pb-2.5 flex items-center gap-1.5 transition-colors cursor-pointer border-b-2 shrink-0 whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'text-indigo-600 border-indigo-600'
                  : 'text-slate-500 border-transparent hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
              <span>Attendee Profile</span>
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`pb-2.5 flex items-center gap-1.5 transition-colors cursor-pointer border-b-2 shrink-0 whitespace-nowrap ${
                activeTab === 'preferences'
                  ? 'text-indigo-600 border-indigo-600'
                  : 'text-slate-500 border-transparent hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">notifications</span>
              <span>Notification Preferences</span>
            </button>
          </div>
        </div>

        {/* 12-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Column (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {activeTab === 'tickets' && (
              <>
                {/* Filter and Search Bar */}
                <div className="bg-white p-3.5 rounded-xl shadow-xs border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
                    <button
                      onClick={() => setFilter('all')}
                      className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                        filter === 'all'
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      All Bookings ({orders.length})
                    </button>
                    <button
                      onClick={() => setFilter('confirmed')}
                      className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                        filter === 'confirmed'
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Confirmed ({confirmedCount})
                    </button>
                    <button
                      onClick={() => setFilter('pending')}
                      className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                        filter === 'pending'
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Pending ({pendingCount})
                    </button>
                    <button
                      onClick={() => setFilter('cancelled')}
                      className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                        filter === 'cancelled'
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Cancelled ({cancelledCount})
                    </button>
                  </div>

                  <div className="relative flex-1 max-w-xs">
                    <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                      search
                    </span>
                    <input
                      type="text"
                      placeholder="Search bookings or venues..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 pl-8 pr-3 py-1.5 rounded-lg text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900"
                    />
                  </div>
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
                    <span className="material-symbols-outlined text-4xl text-slate-300 mx-auto block mb-3">
                      confirmation_number
                    </span>
                    <h3 className="text-base font-bold text-slate-800">No bookings match this filter</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      Explore live listings in the catalogue and reserve your digital entry passes.
                    </p>
                    <button
                      onClick={onBackToCatalogue}
                      className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                    >
                      Explore Events
                    </button>
                  </div>
                ) : (
                  filteredOrders.map((order) => {
                    const firstItem = order.items[0];

                    return (
                      <div
                        key={order.id}
                        className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden flex flex-col hover:border-slate-300 transition-colors"
                      >
                        {/* Order Header */}
                        <div className="p-5 flex flex-col gap-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-base text-slate-900 font-mono-numbers">
                                Booking #{order.id}
                              </span>
                              {getStatusBadge(order.status)}
                            </div>
                            <span className="text-xs text-slate-400 font-mono-numbers">
                              Ordered {new Date(order.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>

                          <div className="flex flex-col md:flex-row gap-4 items-center pt-1">
                            <img
                              className="w-full md:w-40 h-28 rounded-lg object-cover shadow-xs shrink-0 border border-slate-100"
                              src={firstItem?.eventPoster}
                              alt={firstItem?.eventTitle || 'Event'}
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex flex-col justify-between flex-1 gap-2 w-full">
                              <div>
                                <h2 className="text-base font-bold text-slate-900 font-display">
                                  {firstItem?.eventTitle}
                                </h2>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-slate-500 text-xs">
                                  <span className="flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-[16px] text-primary">
                                      calendar_today
                                    </span>
                                    {firstItem?.eventDate
                                      ? new Date(firstItem.eventDate).toLocaleDateString([], {
                                          weekday: 'short',
                                          month: 'short',
                                          day: 'numeric',
                                          year: 'numeric',
                                        })
                                      : 'Date TBA'}
                                  </span>
                                  <span className="flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-[16px] text-slate-400">
                                      location_on
                                    </span>
                                    {firstItem?.eventVenue}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Order Action Footer */}
                        <div className="p-4 bg-slate-50/70 border-t border-slate-200 flex items-center justify-end gap-2">
                          {order.status !== 'cancelled' && (
                            <button
                              onClick={() => handleCancelBooking(order.id)}
                              disabled={cancellingOrderId === order.id}
                              className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                            >
                              Cancel Order
                            </button>
                          )}

                          <button
                            onClick={() => onViewTicket(order)}
                            className="bg-primary hover:opacity-90 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">qr_code</span>
                            <span>View Digital Pass</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 flex flex-col gap-4">
                <h3 className="text-base font-bold text-slate-900">Personal & Organization Profile</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-500 mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      defaultValue={currentUser?.name || 'Hamza Tariq'}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Email Address</label>
                    <input
                      type="email"
                      defaultValue={currentUser?.email || 'hamza.tariq@gmail.com'}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      defaultValue="+92 300 8472910"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Designated Role</label>
                    <input
                      type="text"
                      defaultValue={currentUser?.role.toUpperCase() || 'CUSTOMER'}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-bold"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 flex flex-col gap-4">
                <h3 className="text-base font-bold text-slate-900">Notification & Pass Alerts</h3>
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-bold text-slate-900">Booking & Pass Updates</div>
                      <div className="text-slate-500">Instant QR pass copies to email</div>
                    </div>
                    <button
                      onClick={() => setNotifPassUpdates(!notifPassUpdates)}
                      className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                        notifPassUpdates ? 'bg-primary justify-end' : 'bg-slate-300 justify-start'
                      }`}
                    >
                      <div className="bg-white w-4 h-4 rounded-full shadow-md"></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-bold text-slate-900">Seat Availability Alerts</div>
                      <div className="text-slate-500">When new seat tiers are released</div>
                    </div>
                    <button
                      onClick={() => setNotifSeatAlerts(!notifSeatAlerts)}
                      className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                        notifSeatAlerts ? 'bg-primary justify-end' : 'bg-slate-300 justify-start'
                      }`}
                    >
                      <div className="bg-white w-4 h-4 rounded-full shadow-md"></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-bold text-slate-900">VIP Presale Access</div>
                      <div className="text-slate-500">Early notification before public drops</div>
                    </div>
                    <button
                      onClick={() => setNotifPresale(!notifPresale)}
                      className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                        notifPresale ? 'bg-primary justify-end' : 'bg-slate-300 justify-start'
                      }`}
                    >
                      <div className="bg-white w-4 h-4 rounded-full shadow-md"></div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Account Info Card */}
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Account Details</h3>
                <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Verified
                </span>
              </div>
              <div className="flex flex-col gap-3 text-xs">
                <div>
                  <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">
                    Full Name
                  </span>
                  <span className="font-semibold text-slate-900 mt-0.5 block">
                    {currentUser?.name || 'Hamza Tariq'}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">
                    Email Address
                  </span>
                  <span className="font-semibold text-slate-900 mt-0.5 block">
                    {currentUser?.email || 'hamza.tariq@gmail.com'}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">
                    Phone Contact
                  </span>
                  <span className="font-semibold text-slate-900 mt-0.5 block">
                    +92 300 8472910
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">
                    Security Level
                  </span>
                  <span className="text-slate-600 mt-0.5 block">
                    Two-Factor Passcode Enabled
                  </span>
                </div>
              </div>
            </div>

            {/* Notification Preferences Card */}
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 flex flex-col gap-4">
              <div className="pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Delivery Channels</h3>
              </div>
              <div className="flex flex-col gap-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900">Email Notifications</span>
                    <span className="text-[11px] text-slate-400">PDF & QR tickets dispatched</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900">SMS Gate Reminders</span>
                    <span className="text-[11px] text-slate-400">2 hours before curtain</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400">Standard</span>
                </div>
              </div>
            </div>

            {/* Need Help Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-slate-50 rounded-xl border border-indigo-100 p-5 text-xs">
              <div className="flex items-center gap-2 text-primary font-bold mb-1">
                <span className="material-symbols-outlined text-[18px]">support_agent</span>
                EventHub Support
              </div>
              <p className="text-slate-600 leading-relaxed">
                Need to transfer a seat, request an invoice, or inquire about accessibility seating? Our support team is online 24/7.
              </p>
              <div className="mt-3 text-[11px] font-mono-numbers text-slate-400">
                Support Ref: EH-TICKETING-VIP
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
