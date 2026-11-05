import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { db } from './services/db';
import {
  CartItem,
  EnrichedEvent,
  EnrichedOrder,
  FilterOptions,
  User,
  SimulatedEmail,
} from './types';
import { TopBar } from './components/TopBar';
import { HeroSection } from './components/HeroSection';
import { SmartFilterBar } from './components/SmartFilterBar';
import { EventGrid } from './components/EventGrid';
import { CategoriesSection } from './components/CategoriesSection';
import { EventDetailModal } from './components/EventDetailModal';
import { SeatMapModal } from './components/SeatMapModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { MyBookingsView } from './components/MyBookingsView';
import { TicketVoucherModal } from './components/TicketVoucherModal';
import { EmailInboxDrawer } from './components/EmailInboxDrawer';
import { AuthModal } from './components/AuthModal';
import { MembershipModal } from './components/MembershipModal';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { CheckCircle2, Ticket } from 'lucide-react';

const CART_STORAGE_KEY = 'eventhub_session_cart_pk_v2';

export default function App() {
  // Navigation View State
  const [currentView, setCurrentView] = useState<'catalogue' | 'bookings' | 'admin'>('catalogue');

  // Database Entities State
  const [currentUser, setCurrentUser] = useState<User | null>(() => db.getCurrentUser());
  const [events, setEvents] = useState<EnrichedEvent[]>(() => db.getEvents());
  const [categories, setCategories] = useState(() => db.getCategories());
  const [distinctCities, setDistinctCities] = useState<string[]>(() => db.getDistinctCities());
  const [orders, setOrders] = useState<EnrichedOrder[]>([]);
  const [emails, setEmails] = useState<SimulatedEmail[]>(() => db.getEmails());

  // Cart State (stored in session/localStorage)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Filter & Search State
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    categoryId: 'all',
    city: 'all',
    language: 'all',
    ageLimit: 'all',
    maxPrice: 25000,
    sortBy: 'date_asc',
  });

  // Modals & Drawers State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialMode, setAuthModalInitialMode] = useState<'login' | 'register'>('login');
  const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isEmailsOpen, setIsEmailsOpen] = useState(false);
  const [selectedEventForDetail, setSelectedEventForDetail] = useState<EnrichedEvent | null>(null);
  const [selectedEventForSeatMap, setSelectedEventForSeatMap] = useState<EnrichedEvent | null>(null);
  const [selectedOrderForVoucher, setSelectedOrderForVoucher] = useState<EnrichedOrder | null>(null);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<{ text: string; sub?: string } | null>(null);

  const showToast = useCallback((text: string, sub?: string) => {
    setToastMessage({ text, sub });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  }, []);

  // Save cart changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Refresh data handler
  const refreshAllData = useCallback(() => {
    setEvents(db.getEvents());
    setCategories(db.getCategories());
    setDistinctCities(db.getDistinctCities());
    setEmails(db.getEmails());
    const user = db.getCurrentUser();
    setCurrentUser(user);
    if (user) {
      setOrders(db.getOrdersForUser(user.id));
    } else {
      setOrders([]);
    }
  }, []);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // Events Map for quick access
  const eventsMap = useMemo(() => {
    const map = new Map<string, EnrichedEvent>();
    events.forEach((e) => map.set(e.id, e));
    return map;
  }, [events]);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return db.getEvents(filters);
  }, [filters, events]);

  const featuredEvents = useMemo(() => {
    const featured = events.filter((e) => e.featured);
    return featured.length >= 4 ? featured.slice(0, 5) : events.slice(0, 5);
  }, [events]);

  // Total cart quantity count
  const totalCartTickets = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Unread emails count
  const unreadEmailCount = useMemo(() => {
    if (!currentUser) return emails.filter((e) => !e.read).length;
    return emails.filter((e) => !e.read && e.to_email.toLowerCase() === currentUser.email.toLowerCase()).length;
  }, [emails, currentUser]);

  // --- Cart Actions ---
  const handleAddToCart = (event: EnrichedEvent, quantity: number, seatNumbers: string[] = []) => {
    if (quantity <= 0) return;
    setCart((prev) => {
      const existing = prev.find((i) => i.eventId === event.id);
      if (existing) {
        return prev.map((i) =>
          i.eventId === event.id
            ? {
                ...i,
                quantity: i.quantity + quantity,
                seatNumbers: Array.from(new Set([...i.seatNumbers, ...seatNumbers])),
              }
            : i
        );
      }
      return [...prev, { eventId: event.id, quantity, seatNumbers }];
    });

    showToast(`Added ${quantity} ticket(s) to cart`, event.title);
    setIsCartOpen(true);
  };

  const handleUpdateCartQty = (eventId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(eventId);
    } else {
      setCart((prev) =>
        prev.map((i) => (i.eventId === eventId ? { ...i, quantity: newQty } : i))
      );
    }
  };

  const handleRemoveCartItem = (eventId: string) => {
    setCart((prev) => prev.filter((i) => i.eventId !== eventId));
  };

  // --- Seat Map Actions ---
  const handleConfirmSeatsFromMap = (seatNumbers: string[]) => {
    if (!selectedEventForSeatMap) return;
    handleAddToCart(selectedEventForSeatMap, seatNumbers.length, seatNumbers);
    setSelectedEventForSeatMap(null);
  };

  // --- Booking Completion ---
  const handleBookingSuccess = (createdOrder: EnrichedOrder) => {
    setCart([]); // Clear cart
    refreshAllData();
    showToast(
      `Booking Reserved #${createdOrder.id}!`,
      `Notification email dispatched. Digital QR pass generated.`
    );
    // Directly open their digital ticket voucher pass for instant gratification!
    setSelectedOrderForVoucher(createdOrder);
  };

  // --- Auth & Role Switching ---
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    refreshAllData();
    showToast(`Signed in as ${user.name}`, `Role: ${user.role.toUpperCase()}`);
  };

  const handleLogout = () => {
    db.logout();
    setCurrentUser(null);
    refreshAllData();
    showToast('Signed out of EventHub');
  };

  const handleSwitchRole = (role: 'customer' | 'admin') => {
    const updatedUser = db.switchRole(role);
    setCurrentUser(updatedUser);
    refreshAllData();
    showToast(`Active account switched to ${updatedUser.name}`, `Role: ${role.toUpperCase()}`);
  };

  const handleResetSeedData = () => {
    if (window.confirm('Reset EventHub database to original seed events, categories, and test orders?')) {
      db.resetToSeedData();
      setCart([]);
      refreshAllData();
      showToast('Database reset to initial demo seed');
    }
  };

  const handleMarkEmailRead = (id: string) => {
    db.markEmailAsRead(id);
    setEmails(db.getEmails());
  };

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Toast Notification Curtain */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-sm bg-slate-900 text-white p-4 rounded-xl shadow-2xl border border-slate-700 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <div className="font-bold text-white">{toastMessage.text}</div>
            {toastMessage.sub && <div className="text-slate-300 mt-0.5">{toastMessage.sub}</div>}
          </div>
        </div>
      )}

      {/* Top Bar (Adhering to Top Bar Contract) */}
      <TopBar
        currentUser={currentUser}
        cartCount={totalCartTickets}
        unreadEmailCount={unreadEmailCount}
        currentView={currentView}
        onNavigate={setCurrentView}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenEmails={() => setIsEmailsOpen(true)}
        onOpenAuth={() => {
          setAuthModalInitialMode('login');
          setIsAuthModalOpen(true);
        }}
        onOpenRegister={() => {
          setAuthModalInitialMode('register');
          setIsAuthModalOpen(true);
        }}
        onOpenMembership={() => setIsMembershipModalOpen(true)}
        onLogout={handleLogout}
        onSwitchRole={handleSwitchRole}
      />

      {/* Main View Switcher with top padding to prevent fixed TopBar from hiding content */}
      <main className="flex-1 pt-16 sm:pt-20">
        {currentView === 'admin' ? (
          <AdminPanel
            onBackToApp={() => setCurrentView('catalogue')}
            onRefreshData={refreshAllData}
          />
        ) : currentView === 'bookings' ? (
          <MyBookingsView
            orders={orders}
            onViewTicket={(order) => setSelectedOrderForVoucher(order)}
            onRefreshOrders={refreshAllData}
            onBackToCatalogue={() => setCurrentView('catalogue')}
          />
        ) : (
          /* Catalogue Discovery View */
          <div>
            {/* Hero Section: Featured Headliner Spotlight with 1-by-1 Switcher */}
            <HeroSection
              featuredEvents={featuredEvents}
              onSelectEvent={(evt) => setSelectedEventForDetail(evt)}
            />

            {/* Categories Section */}
            <CategoriesSection
              categories={categories}
              selectedCategoryId={filters.categoryId}
              onSelectCategory={(catId) => setFilters((prev) => ({ ...prev, categoryId: catId }))}
            />

            {/* Smart Multi-Attribute Filter Bar */}
            <SmartFilterBar
              categories={categories}
              cities={distinctCities}
              filters={filters}
              onFilterChange={(updates) => setFilters((prev) => ({ ...prev, ...updates }))}
              onResetFilters={() =>
                setFilters({
                  search: '',
                  categoryId: 'all',
                  city: 'all',
                  language: 'all',
                  ageLimit: 'all',
                  maxPrice: 25000,
                  sortBy: 'date_asc',
                })
              }
              totalResultsCount={filteredEvents.length}
            />

            {/* Events Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900">
                    Live Event Listings
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click any event card to view full itinerary, venue details, and interactive seat maps.
                  </p>
                </div>

                {filters.categoryId !== 'all' && (
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, categoryId: 'all' }))}
                    className="text-xs font-semibold text-indigo-600 hover:underline"
                  >
                    Clear Category
                  </button>
                )}
              </div>

              <EventGrid
                events={filteredEvents}
                onSelectEvent={(evt) => setSelectedEventForDetail(evt)}
                onOpenSeatMap={(evt) => setSelectedEventForSeatMap(evt)}
                onQuickBook={(evt) => handleAddToCart(evt, 1)}
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onResetDemoData={handleResetSeedData}
        onOpenAdmin={() => setCurrentView('admin')}
        onOpenEmails={() => setIsEmailsOpen(true)}
      />

      {/* MODALS & DRAWERS */}
      {/* 1. Event Detail Modal */}
      <EventDetailModal
        event={selectedEventForDetail}
        isOpen={Boolean(selectedEventForDetail)}
        onClose={() => setSelectedEventForDetail(null)}
        onOpenSeatMap={(evt) => setSelectedEventForSeatMap(evt)}
        onQuickAddToCart={(evt, qty) => handleAddToCart(evt, qty)}
      />

      {/* 2. Interactive SVG Seat Map Modal */}
      {selectedEventForSeatMap && (
        <SeatMapModal
          event={selectedEventForSeatMap}
          isOpen={Boolean(selectedEventForSeatMap)}
          onClose={() => setSelectedEventForSeatMap(null)}
          onConfirmSeats={handleConfirmSeatsFromMap}
        />
      )}

      {/* 3. Slide-Over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        eventsMap={eventsMap}
        onUpdateQuantity={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* 4. Multi-Step Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        eventsMap={eventsMap}
        currentUserName={currentUser?.name}
        currentUserEmail={currentUser?.email}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* 5. Ticket Voucher & QR Pass Modal */}
      {selectedOrderForVoucher && (
        <TicketVoucherModal
          order={selectedOrderForVoucher}
          isOpen={Boolean(selectedOrderForVoucher)}
          onClose={() => setSelectedOrderForVoucher(null)}
        />
      )}

      {/* 6. Email Notification Inbox Simulation Drawer */}
      <EmailInboxDrawer
        isOpen={isEmailsOpen}
        onClose={() => setIsEmailsOpen(false)}
        emails={emails}
        onMarkAsRead={handleMarkEmailRead}
        currentUserEmail={currentUser?.email}
      />

      {/* 7. Authentication Modal (Login & Register with VIP Tier) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalInitialMode}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* 8. Official VIP Membership & Profile Modal */}
      {currentUser && (
        <MembershipModal
          isOpen={isMembershipModalOpen}
          onClose={() => setIsMembershipModalOpen(false)}
          currentUser={currentUser}
          onUserUpdated={(updatedUser) => {
            setCurrentUser(updatedUser);
            refreshAllData();
          }}
        />
      )}
    </div>
  );
}
