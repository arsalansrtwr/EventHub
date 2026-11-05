import React, { useState } from 'react';
import { Category, EnrichedEvent, EnrichedOrder, OrderStatus } from '../types';
import { db } from '../services/db';

interface AdminPanelProps {
  onBackToApp: () => void;
  onRefreshData: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBackToApp, onRefreshData }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'inventory' | 'orders' | 'categories'>('overview');

  // Order filters
  const [orderStatusFilter, setOrderStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<EnrichedOrder | null>(null);

  // Event modal state
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    category_id: '',
    description: '',
    poster: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    event_date: '2026-12-15T19:00',
    venue: '',
    price: 3500,
    seats_available: 150,
    total_seats: 150,
    city: 'Karachi',
    language: 'Urdu',
    age_limit: 'All Ages',
    duration: '3 Hours',
  });

  // Category modal state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');

  // Fetch live state from db
  const metrics = db.getDashboardMetrics();
  const allOrders = db.getAllOrders();
  const allEvents = db.getEvents();
  const allCategories = db.getCategories();

  // Filtered orders
  const filteredOrders = allOrders.filter((order) => {
    const matchesStatus = orderStatusFilter === 'all' || order.status === orderStatusFilter;
    const matchesSearch =
      !orderSearch ||
      order.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.attendee_name.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.attendee_email.toLowerCase().includes(orderSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Order actions
  const handleUpdateStatus = (orderId: string, status: OrderStatus) => {
    const res = db.updateOrderStatus(orderId, status);
    if (!res.success) {
      alert(res.error);
    } else {
      onRefreshData();
      if (selectedOrderDetails?.id === orderId && res.order) {
        setSelectedOrderDetails(res.order);
      }
    }
  };

  // Event actions
  const handleOpenCreateEvent = () => {
    setEditingEventId(null);
    setEventForm({
      title: '',
      category_id: allCategories[0]?.id || '',
      description: '',
      poster: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
      event_date: '2026-12-20T20:00',
      venue: '',
      price: 45,
      seats_available: 120,
      total_seats: 120,
      city: 'London',
      language: 'English',
      age_limit: '16+',
      duration: '2h 15m',
    });
    setIsEventModalOpen(true);
  };

  const handleOpenEditEvent = (evt: EnrichedEvent) => {
    setEditingEventId(evt.id);
    setEventForm({
      title: evt.title,
      category_id: evt.category_id,
      description: evt.description,
      poster: evt.poster,
      event_date: evt.event_date.slice(0, 16),
      venue: evt.venue,
      price: evt.price,
      seats_available: evt.seats_available,
      total_seats: evt.total_seats,
      city: evt.attributes.city || 'London',
      language: evt.attributes.language || 'English',
      age_limit: evt.attributes.age_limit || 'All Ages',
      duration: evt.attributes.duration || '2 Hours',
    });
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title.trim() || !eventForm.venue.trim() || !eventForm.category_id) {
      alert('Please fill out all required fields (Title, Category, Venue).');
      return;
    }

    if (editingEventId) {
      db.updateEvent(
        editingEventId,
        {
          title: eventForm.title,
          category_id: eventForm.category_id,
          description: eventForm.description,
          poster: eventForm.poster,
          event_date: eventForm.event_date,
          venue: eventForm.venue,
          price: Number(eventForm.price),
          seats_available: Number(eventForm.seats_available),
          total_seats: Number(eventForm.total_seats),
        },
        {
          city: eventForm.city,
          language: eventForm.language,
          age_limit: eventForm.age_limit,
          duration: eventForm.duration,
        }
      );
    } else {
      db.createEvent(
        {
          title: eventForm.title,
          category_id: eventForm.category_id,
          description: eventForm.description,
          poster: eventForm.poster,
          event_date: eventForm.event_date,
          venue: eventForm.venue,
          price: Number(eventForm.price),
          seats_available: Number(eventForm.seats_available),
          total_seats: Number(eventForm.total_seats),
        },
        {
          city: eventForm.city,
          language: eventForm.language,
          age_limit: eventForm.age_limit,
          duration: eventForm.duration,
        }
      );
    }

    setIsEventModalOpen(false);
    onRefreshData();
  };

  const handleDeleteEvent = (id: string) => {
    if (window.confirm('Are you sure you want to delete this event? This will release associated resources.')) {
      const res = db.deleteEvent(id);
      if (!res.success) {
        alert(res.error);
      } else {
        onRefreshData();
      }
    }
  };

  // Category actions
  const handleOpenCreateCategory = () => {
    setEditingCategoryId(null);
    setCategoryName('');
    setCategoryDescription('');
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat: Category) => {
    setEditingCategoryId(cat.id);
    setCategoryName(cat.name);
    setCategoryDescription(cat.description || '');
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      alert('Please enter a category name.');
      return;
    }

    if (editingCategoryId) {
      db.updateCategory(editingCategoryId, categoryName, categoryDescription);
    } else {
      db.createCategory(categoryName, categoryDescription);
    }
    setIsCategoryModalOpen(false);
    onRefreshData();
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      const res = db.deleteCategory(id);
      if (!res.success) {
        alert(res.error);
      } else {
        onRefreshData();
      }
    }
  };

  // Simulated image file upload (Base64 file reader)
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image file size exceeds 2MB limit. Please choose a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setEventForm((prev) => ({ ...prev, poster: uploadEvent.target!.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const featuredEvent = allEvents.find((e) => e.featured) || allEvents[0];
  const overallFilledPct =
    metrics.totalSeatsCapacity > 0
      ? Math.round(((metrics.totalSeatsCapacity - metrics.totalSeatsRemaining) / metrics.totalSeatsCapacity) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-[#faf8ff] text-slate-900 flex">
      {/* Fixed/Sticky Left Navigation Sidebar (Matching stitch template) */}
      <aside className="hidden lg:flex fixed left-0 top-16 sm:top-20 h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] w-64 bg-[#f2f3ff] z-30 flex-col justify-between py-6 border-r border-slate-200">
        <div className="flex flex-col gap-6">
          <div className="px-6 flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-xs font-bold shadow-xs">
              EH
            </span>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900 tracking-tight font-display">EventHub</span>
              <span className="text-[10px] font-bold text-primary bg-[#e2dfff] px-2 py-0.5 rounded-full">
                ADMIN
              </span>
            </div>
          </div>

          <nav className="px-3 flex flex-col gap-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer text-left ${
                activeTab === 'overview'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">dashboard</span>
              Overview
            </button>

            <button
              onClick={() => setActiveTab('events')}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer text-left ${
                activeTab === 'events'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">event</span>
              Events & Slots ({allEvents.length})
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer text-left ${
                activeTab === 'inventory'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">chair</span>
              Seat Inventory
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer text-left ${
                activeTab === 'orders'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                Bookings & Orders
              </span>
              {metrics.pendingOrdersCount > 0 && (
                <span className={`text-[10px] font-mono-numbers px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === 'orders' ? 'bg-white text-primary' : 'bg-amber-100 text-amber-800'
                }`}>
                  {metrics.pendingOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer text-left ${
                activeTab === 'categories'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">category</span>
              Categories ({allCategories.length})
            </button>
          </nav>
        </div>

        <div className="px-3 flex flex-col gap-2">
          <div className="bg-slate-200/70 p-3 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                alt="Admin Profile"
                className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-300"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80"
              />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900 leading-tight">Operations</span>
                <span className="text-[10px] text-slate-500 leading-tight">Admin Level 1</span>
              </div>
            </div>
            <button
              onClick={onBackToApp}
              className="text-slate-500 hover:text-primary transition-colors cursor-pointer p-1"
              title="Return to Public Storefront"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 w-full lg:pl-64 flex flex-col">
        {/* Header Bar */}
        <header className="sticky top-16 sm:top-20 h-16 bg-white/90 backdrop-blur-md shadow-xs border-b border-slate-200 z-20 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile Tab Bar */}
            <div className="flex lg:hidden items-center gap-1 overflow-x-auto text-xs font-semibold py-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-2.5 py-1 rounded-lg ${activeTab === 'overview' ? 'bg-primary text-white' : 'text-slate-600'}`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`px-2.5 py-1 rounded-lg ${activeTab === 'events' ? 'bg-primary text-white' : 'text-slate-600'}`}
              >
                Events
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-2.5 py-1 rounded-lg ${activeTab === 'orders' ? 'bg-primary text-white' : 'text-slate-600'}`}
              >
                Orders
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`px-2.5 py-1 rounded-lg ${activeTab === 'categories' ? 'bg-primary text-white' : 'text-slate-600'}`}
              >
                Categories
              </button>
            </div>

            <div className="hidden sm:flex items-center bg-slate-100 px-3 py-1.5 rounded-xl w-64 md:w-80">
              <span className="material-symbols-outlined text-slate-400 text-[18px] mr-2">search</span>
              <input
                className="bg-transparent w-full text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none"
                placeholder="Search orders, events, attendees..."
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToApp}
              className="flex items-center gap-1 text-slate-600 hover:text-primary text-xs font-semibold transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              <span className="hidden sm:inline">Storefront View</span>
            </button>

            <button
              onClick={handleOpenCreateCategory}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">category</span>
              <span className="hidden md:inline">+ Category</span>
            </button>

            <button
              onClick={handleOpenCreateEvent}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-primary hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              <span>+ New Event</span>
            </button>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="p-4 sm:p-6 md:p-8 flex flex-col gap-6 max-w-7xl w-full">
          {/* Header Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span>Enterprise Operations</span>
                <span>•</span>
                <span className="text-emerald-600 flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live Engine
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display mt-0.5">
                EventHub Organizer Console
              </h1>
            </div>
          </div>

          {/* 4 KPI Cards (Matching kinetic horizon) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200 flex flex-col justify-between hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Active Events</span>
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold text-slate-900 font-mono-numbers">
                  {allEvents.length}
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  <span className="text-emerald-600 font-semibold font-mono-numbers">
                    +{allEvents.filter((e) => e.featured).length}
                  </span>{' '}
                  featured drops
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200 flex flex-col justify-between hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Tickets Booked</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
                  <span className="material-symbols-outlined text-[20px]">confirmation_number</span>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold text-slate-900 font-mono-numbers">
                  {metrics.totalTicketsSold}
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  <span className="text-emerald-600 font-semibold font-mono-numbers">
                    Rs. {metrics.totalRevenue.toLocaleString()}
                  </span>{' '}
                  revenue
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200 flex flex-col justify-between hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Pending Review</span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700">
                  <span className="material-symbols-outlined text-[20px]">hourglass_top</span>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold text-[#F43F5E] font-mono-numbers">
                  {metrics.pendingOrdersCount}
                </div>
                <div className="mt-1 text-xs text-[#F43F5E] font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F43F5E]"></span>
                  Action required by admin
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200 flex flex-col justify-between hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Seat Capacity</span>
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">event_seat</span>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex items-baseline gap-1 font-mono-numbers">
                  <span className="text-2xl font-bold text-slate-900">
                    {metrics.totalSeatsCapacity - metrics.totalSeatsRemaining}
                  </span>
                  <span className="text-xs text-slate-400">/ {metrics.totalSeatsCapacity}</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-500"
                    style={{ width: `${overallFilledPct}%` }}
                  ></div>
                </div>
                <div className="mt-1 text-xs text-slate-500 flex justify-between font-mono-numbers">
                  <span>Capacity Filled</span>
                  <span className="font-semibold text-slate-900">{overallFilledPct}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* TAB: OVERVIEW (Split Grid) */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              {/* Left 8 Cols: Orders & Bookings Summary */}
              <div className="xl:col-span-8 flex flex-col gap-6">
                <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 font-display">
                        Recent Bookings & Order Queue
                      </h2>
                      <p className="text-xs text-slate-500">
                        Review customer requests, approve admissions, or cancel orders to replenish inventory
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      View All Orders ({allOrders.length})
                      <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </button>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 p-1 rounded-xl">
                    <button
                      onClick={() => setOrderStatusFilter('all')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        orderStatusFilter === 'all'
                          ? 'bg-primary text-white shadow-2xs'
                          : 'bg-white text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      All ({allOrders.length})
                    </button>
                    <button
                      onClick={() => setOrderStatusFilter('pending')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        orderStatusFilter === 'pending'
                          ? 'bg-primary text-white shadow-2xs'
                          : 'bg-white text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Pending ({metrics.pendingOrdersCount})
                    </button>
                    <button
                      onClick={() => setOrderStatusFilter('confirmed')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        orderStatusFilter === 'confirmed'
                          ? 'bg-primary text-white shadow-2xs'
                          : 'bg-white text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Confirmed ({metrics.confirmedOrdersCount})
                    </button>
                    <button
                      onClick={() => setOrderStatusFilter('cancelled')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        orderStatusFilter === 'cancelled'
                          ? 'bg-primary text-white shadow-2xs'
                          : 'bg-white text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Cancelled ({metrics.cancelledOrdersCount})
                    </button>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto rounded-xl border border-slate-100">
                    <table className="w-full text-left whitespace-nowrap text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider h-10 border-b border-slate-200">
                          <th className="py-2.5 px-3">Order ID</th>
                          <th className="py-2.5 px-3">Customer</th>
                          <th className="py-2.5 px-3">Event & Seats</th>
                          <th className="py-2.5 px-3 text-center">Tickets</th>
                          <th className="py-2.5 px-3">Total</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredOrders.slice(0, 6).map((order) => {
                          const firstItem = order.items[0];
                          const allSeats = order.items.flatMap((i) => i.seat_numbers);
                          const totalQty = order.items.reduce((acc, i) => acc + i.quantity, 0);

                          return (
                            <tr key={order.id} className="hover:bg-slate-50/70 transition-colors h-14">
                              <td className="px-3 py-2 font-mono-numbers font-bold text-primary">
                                #{order.id}
                              </td>

                              <td className="px-3 py-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-full bg-indigo-100 text-primary flex items-center justify-center font-bold text-[11px] shrink-0">
                                    {order.attendee_name.slice(0, 2).toUpperCase()}
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="font-semibold text-slate-900 leading-tight">
                                      {order.attendee_name}
                                    </span>
                                    <span className="text-slate-400 text-[10px] leading-tight">
                                      {order.attendee_email}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              <td className="px-3 py-2 max-w-[170px] truncate">
                                <span className="font-medium text-slate-900 truncate block">
                                  {firstItem?.eventTitle || 'Event'}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono-numbers block">
                                  Seats: {allSeats.join(', ') || 'GA'}
                                </span>
                              </td>

                              <td className="px-3 py-2 text-center">
                                <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 font-mono-numbers font-semibold">
                                  {totalQty}×
                                </span>
                              </td>

                              <td className="px-3 py-2 font-mono-numbers font-bold text-slate-900">
                                Rs. {order.total_amount.toLocaleString()}
                              </td>

                              <td className="px-3 py-2">
                                {order.status === 'confirmed' ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    Confirmed
                                  </span>
                                ) : order.status === 'cancelled' ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700">
                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                    Cancelled
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                    Pending
                                  </span>
                                )}
                              </td>

                              <td className="px-3 py-2 text-right">
                                <div className="inline-flex items-center gap-1">
                                  {order.status !== 'confirmed' && (
                                    <button
                                      onClick={() => handleUpdateStatus(order.id, 'confirmed')}
                                      className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold transition-colors cursor-pointer text-[11px]"
                                    >
                                      Approve
                                    </button>
                                  )}
                                  {order.status !== 'cancelled' && (
                                    <button
                                      onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                                      className="px-2 py-1 rounded-md bg-rose-50 text-rose-700 hover:bg-rose-100 font-medium transition-colors cursor-pointer text-[11px]"
                                    >
                                      Cancel
                                    </button>
                                  )}
                                  <button
                                    onClick={() => setSelectedOrderDetails(order)}
                                    className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                                    title="View Details"
                                  >
                                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right 4 Cols: Seat Inventory Monitor & Categories */}
              <div className="xl:col-span-4 flex flex-col gap-6">
                {/* Seat Inventory Monitor */}
                <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 font-display">Seat Inventory Monitor</h3>
                    <button
                      onClick={() => setActiveTab('inventory')}
                      className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                    >
                      View All
                    </button>
                  </div>

                  <div className="flex flex-col gap-3">
                    {allEvents.slice(0, 4).map((evt) => {
                      const soldCount = evt.total_seats - evt.seats_available;
                      const soldPct = Math.round((soldCount / evt.total_seats) * 100);
                      const isHigh = soldPct > 85;

                      return (
                        <div
                          key={evt.id}
                          className="flex flex-col gap-1.5 p-3 rounded-xl bg-slate-50 hover:bg-slate-100/70 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-2 h-2 rounded-full ${isHigh ? 'bg-[#F43F5E]' : 'bg-emerald-500'}`}
                              ></span>
                              <span
                                className="font-bold text-slate-900 text-xs truncate max-w-[160px]"
                                title={evt.title}
                              >
                                {evt.title}
                              </span>
                            </div>
                            <span
                              className={`text-xs font-bold font-mono-numbers ${isHigh ? 'text-[#F43F5E]' : 'text-emerald-700'}`}
                            >
                              {soldPct}% Sold
                            </span>
                          </div>

                          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${isHigh ? 'bg-[#F43F5E]' : 'bg-emerald-500'}`}
                              style={{ width: `${soldPct}%` }}
                            ></div>
                          </div>

                          <div className="flex justify-between items-center text-[11px] font-mono-numbers text-slate-500">
                            <span>
                              {soldCount} / {evt.total_seats} seats
                            </span>
                            <span className={isHigh ? 'text-[#F43F5E] font-bold' : 'text-slate-600'}>
                              {evt.seats_available} remaining
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Featured Event Card */}
                {featuredEvent && (
                  <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 flex flex-col gap-3 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 font-display">Featured Spotlight</h4>
                      <span className="text-emerald-700 bg-emerald-50 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Live on Storefront
                      </span>
                    </div>

                    <div className="w-full h-32 rounded-lg overflow-hidden relative shadow-inner">
                      <img
                        className="w-full h-full object-cover"
                        src={featuredEvent.poster}
                        alt={featuredEvent.title}
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                      <div className="absolute bottom-2 left-2 right-2 text-white">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-primary px-2 py-0.5 rounded">
                          {featuredEvent.categoryName}
                        </span>
                        <p className="text-xs font-bold mt-1 truncate">{featuredEvent.title}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400">Venue Location</span>
                        <span className="font-semibold text-slate-800 truncate max-w-[170px]">
                          {featuredEvent.venue}
                        </span>
                      </div>
                      <button
                        onClick={() => handleOpenEditEvent(featuredEvent)}
                        className="inline-flex items-center gap-1 text-primary hover:underline font-semibold cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                        Edit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: EVENTS & SLOTS */}
          {activeTab === 'events' && (
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Live Event Catalogue & Listings</h3>
                  <p className="text-xs text-slate-500">
                    Add new events, update posters, configure ticket prices and total seat allocations
                  </p>
                </div>
                <button
                  onClick={handleOpenCreateEvent}
                  className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-primary hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">add_circle</span>
                  Create Event
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Poster</th>
                      <th className="py-3 px-4">Event Details</th>
                      <th className="py-3 px-4">Category & City</th>
                      <th className="py-3 px-4">Date / Time</th>
                      <th className="py-3 px-4 text-right">Price</th>
                      <th className="py-3 px-4">Seat Availability</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {allEvents.map((evt) => {
                      const remainingPct = Math.round((evt.seats_available / evt.total_seats) * 100);

                      return (
                        <tr key={evt.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4">
                            <img
                              src={evt.poster}
                              alt={evt.title}
                              className="w-12 h-12 object-cover rounded-lg border border-slate-100"
                              referrerPolicy="no-referrer"
                            />
                          </td>

                          <td className="py-3 px-4 max-w-xs">
                            <div className="font-bold text-slate-900 line-clamp-1">{evt.title}</div>
                            <div className="text-slate-500 text-[11px] truncate">{evt.venue}</div>
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-semibold text-slate-800">{evt.categoryName}</span>
                            <div className="text-slate-500 text-[11px]">{evt.attributes.city || 'Standard'}</div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="font-medium text-slate-800 font-mono-numbers">
                              {new Date(evt.event_date).toLocaleDateString([], {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </div>
                            <div className="text-slate-400 text-[11px] font-mono-numbers">
                              {new Date(evt.event_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </td>

                          <td className="py-3 px-4 text-right font-mono-numbers font-bold text-slate-900">
                            Rs. {evt.price.toLocaleString()}
                          </td>

                          <td className="py-3 px-4 min-w-[140px]">
                            <div className="flex items-center justify-between text-[11px] font-mono-numbers mb-1">
                              <span>{evt.seats_available} free</span>
                              <span className="text-slate-400">/ {evt.total_seats}</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${remainingPct < 20 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                                style={{ width: `${remainingPct}%` }}
                              />
                            </div>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditEvent(evt)}
                                className="p-1.5 text-slate-500 hover:text-primary hover:bg-slate-100 rounded transition-colors cursor-pointer"
                                title="Edit Event"
                              >
                                <span className="material-symbols-outlined text-[18px]">edit</span>
                              </button>
                              <button
                                onClick={() => handleDeleteEvent(evt.id)}
                                className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                                title="Delete Event"
                              >
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: SEAT INVENTORY */}
          {activeTab === 'inventory' && (
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 flex flex-col gap-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-display">Live Seat Inventory Matrix</h3>
                <p className="text-xs text-slate-500">
                  Track real-time capacity and remaining available seats across all active productions
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allEvents.map((evt) => {
                  const soldCount = evt.total_seats - evt.seats_available;
                  const soldPct = Math.round((soldCount / evt.total_seats) * 100);

                  return (
                    <div key={evt.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={evt.poster}
                          alt={evt.title}
                          className="w-14 h-14 object-cover rounded-lg border border-slate-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-900 text-sm truncate">{evt.title}</h4>
                          <p className="text-slate-500 text-xs truncate">{evt.venue}</p>
                          <span className="text-[11px] font-mono-numbers text-indigo-700 font-semibold">
                            Base Ticket: Rs. {evt.price.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-mono-numbers mb-1">
                          <span className="text-slate-600">
                            Booked: <strong>{soldCount}</strong> / {evt.total_seats}
                          </span>
                          <span className="font-bold text-primary">{soldPct}% Filled</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              soldPct > 80 ? 'bg-[#F43F5E]' : 'bg-primary'
                            }`}
                            style={{ width: `${soldPct}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                        <span className="text-slate-500">
                          Remaining:{' '}
                          <strong className="text-emerald-700 font-mono-numbers">
                            {evt.seats_available} seats
                          </strong>
                        </span>
                        <button
                          onClick={() => handleOpenEditEvent(evt)}
                          className="text-primary font-semibold hover:underline"
                        >
                          Adjust Capacity
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: BOOKINGS & ORDERS */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-medium w-full sm:w-auto">
                  <button
                    onClick={() => setOrderStatusFilter('all')}
                    className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                      orderStatusFilter === 'all'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    All ({allOrders.length})
                  </button>
                  <button
                    onClick={() => setOrderStatusFilter('pending')}
                    className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                      orderStatusFilter === 'pending'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Pending ({metrics.pendingOrdersCount})
                  </button>
                  <button
                    onClick={() => setOrderStatusFilter('confirmed')}
                    className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                      orderStatusFilter === 'confirmed'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Confirmed ({metrics.confirmedOrdersCount})
                  </button>
                  <button
                    onClick={() => setOrderStatusFilter('cancelled')}
                    className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                      orderStatusFilter === 'cancelled'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Cancelled ({metrics.cancelledOrdersCount})
                  </button>
                </div>

                <div className="relative w-full sm:w-64">
                  <span className="material-symbols-outlined text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 text-[18px]">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Search order ID or attendee..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Order Ref</th>
                      <th className="py-3 px-4">Attendee & Customer</th>
                      <th className="py-3 px-4">Event & Seats</th>
                      <th className="py-3 px-4 text-right">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400">
                          No orders match the selected criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => {
                        const firstItem = order.items[0];
                        const allSeats = order.items.flatMap((i) => i.seat_numbers);

                        return (
                          <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3 px-4 font-mono-numbers font-bold text-slate-900">
                              #{order.id}
                              <div className="text-[10px] font-normal text-slate-400">
                                {new Date(order.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                              </div>
                            </td>

                            <td className="py-3 px-4">
                              <div className="font-semibold text-slate-900">{order.attendee_name}</div>
                              <div className="text-slate-500 text-[11px]">{order.attendee_email}</div>
                            </td>

                            <td className="py-3 px-4 max-w-xs">
                              <div className="font-medium text-slate-900 truncate">
                                {firstItem?.eventTitle || 'Event'}
                              </div>
                              <div className="text-[11px] text-slate-500 font-mono-numbers">
                                Seats: {allSeats.join(', ') || 'GA'} ({order.items.reduce((s, i) => s + i.quantity, 0)} tix)
                              </div>
                            </td>

                            <td className="py-3 px-4 text-right font-mono-numbers font-bold text-slate-900">
                              Rs. {order.total_amount.toLocaleString()}
                              <div className="text-[10px] font-normal text-slate-400 uppercase">
                                {order.payment_method.replace('_', ' ')}
                              </div>
                            </td>

                            <td className="py-3 px-4">
                              {order.status === 'confirmed' ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                                  Confirmed
                                </span>
                              ) : order.status === 'cancelled' ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                                  Cancelled
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                                  Pending
                                </span>
                              )}
                            </td>

                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setSelectedOrderDetails(order)}
                                  className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                                  title="View Details"
                                >
                                  <span className="material-symbols-outlined text-[16px]">visibility</span>
                                </button>

                                {order.status !== 'confirmed' && (
                                  <button
                                    onClick={() => handleUpdateStatus(order.id, 'confirmed')}
                                    className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded transition-colors cursor-pointer"
                                  >
                                    Approve
                                  </button>
                                )}

                                {order.status !== 'cancelled' && (
                                  <button
                                    onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                                    className="px-2.5 py-1 text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded transition-colors cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: CATEGORIES */}
          {activeTab === 'categories' && (
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Event Categories & Taxonomy</h3>
                  <p className="text-xs text-slate-500">Group events into distinct discoverable disciplines</p>
                </div>
                <button
                  onClick={handleOpenCreateCategory}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-primary hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">add_circle</span>
                  New Category
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {allCategories.map((cat) => (
                  <div
                    key={cat.id}
                    className="p-4 flex items-center justify-between text-xs hover:bg-slate-50/70 transition-colors"
                  >
                    <div>
                      <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <span>{cat.name}</span>
                        <span className="text-[11px] font-mono-numbers text-slate-400 font-normal">
                          ({cat.eventCount} active events)
                        </span>
                      </div>
                      {cat.description && <div className="text-slate-500 mt-0.5">{cat.description}</div>}
                      <div className="text-[10px] text-slate-400 font-mono-numbers mt-1">Slug: {cat.slug}</div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditCategory(cat)}
                        className="p-1.5 text-slate-500 hover:text-primary hover:bg-slate-100 rounded transition-colors cursor-pointer"
                        title="Rename Category"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                        title="Delete Category"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL 1: Order Details */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Order Details #{selectedOrderDetails.id}
                </h3>
                <p className="text-xs text-slate-500">
                  Booked on {new Date(selectedOrderDetails.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-semibold">Attendee Details</div>
                  <div className="font-bold text-slate-900 mt-1">{selectedOrderDetails.attendee_name}</div>
                  <div className="text-slate-600">{selectedOrderDetails.attendee_email}</div>
                  <div className="text-slate-600">{selectedOrderDetails.attendee_phone}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-semibold">Payment & Status</div>
                  <div className="font-bold text-slate-900 mt-1 uppercase">
                    {selectedOrderDetails.payment_method.replace('_', ' ')}
                  </div>
                  <div className="mt-1 font-mono-numbers text-sm font-bold text-primary">
                    Total: Rs. {selectedOrderDetails.total_amount.toLocaleString()}
                  </div>
                </div>
              </div>

              {selectedOrderDetails.notes && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900">
                  <strong>Special Requests:</strong> {selectedOrderDetails.notes}
                </div>
              )}

              <div className="space-y-2">
                <div className="font-bold text-slate-900 text-xs">Booked Tickets & Seats</div>
                {selectedOrderDetails.items.map((item) => (
                  <div key={item.id} className="p-3 border border-slate-200 rounded-lg flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">{item.eventTitle}</div>
                      <div className="text-slate-500 text-[11px]">{item.eventVenue}</div>
                      <div className="text-primary font-mono-numbers text-[11px] font-semibold mt-1">
                        Seats: {item.seat_numbers.join(', ')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold font-mono-numbers text-slate-900">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-400">Qty: {item.quantity}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
              <div className="text-xs">
                Status:{' '}
                <strong className="uppercase font-semibold text-slate-900">
                  {selectedOrderDetails.status}
                </strong>
              </div>
              <div className="flex gap-2">
                {selectedOrderDetails.status !== 'confirmed' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedOrderDetails.id, 'confirmed')}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer"
                  >
                    Approve Order
                  </button>
                )}
                {selectedOrderDetails.status !== 'cancelled' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedOrderDetails.id, 'cancelled')}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel & Release Seats
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Create / Edit Event */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
              <h3 className="text-base font-bold text-slate-900">
                {editingEventId ? 'Edit Event Listing' : 'Create New Event Listing'}
              </h3>
              <button
                onClick={() => setIsEventModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  placeholder="e.g. Electric Forest Live Concert"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                  <select
                    value={eventForm.category_id}
                    onChange={(e) => setEventForm({ ...eventForm, category_id: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    {allCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={eventForm.event_date}
                    onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Venue Address / Location *</label>
                <input
                  type="text"
                  required
                  value={eventForm.venue}
                  onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                  placeholder="e.g. Royal Albert Hall, London"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              {/* Poster Upload Simulation */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Poster Image Upload</span>
                  <span className="text-[10px] text-slate-400 font-normal">Direct image URL or file</span>
                </label>
                <div className="flex gap-3 items-center">
                  <img
                    src={eventForm.poster}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded-lg border border-slate-200 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={eventForm.poster}
                      onChange={(e) => setEventForm({ ...eventForm, poster: e.target.value })}
                      placeholder="Image URL..."
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md cursor-pointer transition-colors text-[11px] font-semibold">
                      <span className="material-symbols-outlined text-[16px]">upload_file</span>
                      Upload From Computer
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ticket Price (PKR) *</label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    required
                    value={eventForm.price}
                    onChange={(e) => setEventForm({ ...eventForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono-numbers"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Capacity *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={eventForm.total_seats}
                    onChange={(e) =>
                      setEventForm({
                        ...eventForm,
                        total_seats: Number(e.target.value),
                        seats_available: editingEventId ? eventForm.seats_available : Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono-numbers"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Seats Available</label>
                  <input
                    type="number"
                    min="0"
                    max={eventForm.total_seats}
                    value={eventForm.seats_available}
                    onChange={(e) => setEventForm({ ...eventForm, seats_available: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono-numbers"
                  />
                </div>
              </div>

              {/* Attributes */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
                <div className="font-semibold text-slate-700 text-[11px] uppercase tracking-wider">
                  Event Attributes (City, Language, Age Limit, Duration)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">City</label>
                    <input
                      type="text"
                      value={eventForm.city}
                      onChange={(e) => setEventForm({ ...eventForm, city: e.target.value })}
                      className="w-full px-2 py-1 border border-slate-200 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Language</label>
                    <input
                      type="text"
                      value={eventForm.language}
                      onChange={(e) => setEventForm({ ...eventForm, language: e.target.value })}
                      className="w-full px-2 py-1 border border-slate-200 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Age Limit</label>
                    <input
                      type="text"
                      value={eventForm.age_limit}
                      onChange={(e) => setEventForm({ ...eventForm, age_limit: e.target.value })}
                      className="w-full px-2 py-1 border border-slate-200 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Duration</label>
                    <input
                      type="text"
                      value={eventForm.duration}
                      onChange={(e) => setEventForm({ ...eventForm, duration: e.target.value })}
                      className="w-full px-2 py-1 border border-slate-200 rounded bg-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-primary hover:bg-indigo-700 rounded-lg shadow-xs cursor-pointer"
                >
                  {editingEventId ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Create / Edit Category */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
              <h3 className="text-base font-bold text-slate-900">
                {editingCategoryId ? 'Rename Category' : 'Create New Category'}
              </h3>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g. Jazz & Classical"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={categoryDescription}
                  onChange={(e) => setCategoryDescription(e.target.value)}
                  placeholder="Summary of this event category..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-primary hover:bg-indigo-700 rounded-lg shadow-xs cursor-pointer"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
