import React, { useState } from 'react';
import { User } from '../types';
import { Mail, ShoppingBag, Shield, LogOut, ChevronDown, Menu, X, Crown } from 'lucide-react';

interface TopBarProps {
  currentUser: User | null;
  cartCount: number;
  unreadEmailCount: number;
  currentView: 'catalogue' | 'bookings' | 'admin';
  onNavigate: (view: 'catalogue' | 'bookings' | 'admin') => void;
  onOpenCart: () => void;
  onOpenEmails: () => void;
  onOpenAuth: () => void;
  onOpenRegister?: () => void;
  onOpenMembership?: () => void;
  onLogout: () => void;
  onSwitchRole: (role: 'customer' | 'admin') => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentUser,
  cartCount,
  unreadEmailCount,
  currentView,
  onNavigate,
  onOpenCart,
  onOpenEmails,
  onOpenAuth,
  onOpenRegister,
  onOpenMembership,
  onLogout,
  onSwitchRole,
  searchQuery = '',
  onSearchChange,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl shadow-xs border-b border-slate-200">
      <div className="h-16 sm:h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={() => onNavigate('catalogue')}
            className="flex items-center gap-2.5 hover:opacity-90 transition-opacity cursor-pointer text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white text-xs font-black shadow-xs">
              EH
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg text-slate-900 tracking-tight font-extrabold font-display leading-none">
                EventHub
              </span>
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mt-0.5">
                Pakistan Box Office
              </span>
            </div>
          </button>

          {/* Search Bar on Header (Desktop) */}
          <div className="hidden lg:flex items-center bg-slate-100 px-3.5 py-1.5 rounded-xl w-64 xl:w-72 border border-slate-200 focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-white transition-all">
            <span className="material-symbols-outlined text-slate-400 text-[18px] mr-2">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Search concerts, stadiums, plays..."
              className="bg-transparent w-full text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange?.('')}
                className="text-[11px] text-slate-400 hover:text-slate-700 ml-1"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-6 text-xs font-semibold">
          <button
            onClick={() => onNavigate('catalogue')}
            className={`transition-colors cursor-pointer py-1 ${
              currentView === 'catalogue'
                ? 'text-primary font-bold border-b-2 border-primary'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Explore Events
          </button>

          <a
            href="#categories"
            onClick={(e) => {
              if (currentView !== 'catalogue') {
                e.preventDefault();
                onNavigate('catalogue');
              }
            }}
            className="text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            Categories
          </a>

          <button
            onClick={() => onNavigate('bookings')}
            className={`transition-colors cursor-pointer py-1 ${
              currentView === 'bookings'
                ? 'text-primary font-bold border-b-2 border-primary'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Bookings & Passes
          </button>

          <button
            onClick={() => onNavigate('admin')}
            className={`transition-colors cursor-pointer flex items-center gap-1.5 py-1 ${
              currentView === 'admin'
                ? 'text-primary font-bold border-b-2 border-primary'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-primary" />
            <span>Admin Box Office</span>
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Email Outbox Trigger */}
          <button
            onClick={onOpenEmails}
            className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            title="Ticket Pass Dispatch Inbox"
            aria-label="Open Email Inbox"
          >
            <Mail className="w-4 h-4" />
            {unreadEmailCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {unreadEmailCount}
              </span>
            )}
          </button>

          {/* Cart Trigger */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 transition-colors cursor-pointer"
            aria-label="View Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#F43F5E] text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Account / Profile */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
              >
                <img
                  alt="Profile"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-primary/20"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                  referrerPolicy="no-referrer"
                />
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-900 leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-indigo-600 font-bold leading-tight uppercase flex items-center gap-1">
                    {currentUser.role === 'admin' ? (
                      'Box Office Admin'
                    ) : currentUser.membership_tier === 'vip' ? (
                      <>
                        <Crown className="w-2.5 h-2.5 text-amber-500" />
                        <span>VIP Gold Member</span>
                      </>
                    ) : (
                      'Standard Member'
                    )}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isUserMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-50 text-xs animate-in fade-in duration-150"
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70">
                    <div className="font-bold text-slate-900 truncate">{currentUser.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                    <div className="text-[10px] uppercase font-extrabold text-indigo-600 mt-1 flex items-center gap-1">
                      {currentUser.membership_tier === 'vip' ? (
                        <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Crown className="w-3 h-3 text-amber-600" /> VIP Gold Pass Member
                        </span>
                      ) : (
                        <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                          Standard Pass Member
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onOpenMembership?.();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-indigo-50/60 text-slate-800 flex items-center gap-2 cursor-pointer font-semibold text-indigo-700"
                  >
                    <Crown className="w-3.5 h-3.5 text-amber-500" />
                    <span>View Membership Pass & Privileges</span>
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('bookings');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-800 flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <span>My Bookings & QR Passes</span>
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('admin');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-800 flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <Shield className="w-3.5 h-3.5 text-primary" />
                    <span>Admin Box Office Panel</span>
                  </button>

                  <div className="my-1 border-t border-slate-100" />

                  <button
                    onClick={() => {
                      onOpenRegister?.();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-1.5 hover:bg-slate-50 text-slate-600 cursor-pointer font-medium"
                  >
                    Create Another Account
                  </button>

                  <button
                    onClick={() => {
                      onSwitchRole(currentUser.role === 'admin' ? 'customer' : 'admin');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-1.5 hover:bg-indigo-50 text-indigo-600 font-semibold cursor-pointer"
                  >
                    Switch to {currentUser.role === 'admin' ? 'Attendee (Dur-e-Adan)' : 'Admin (Box Office)'}
                  </button>

                  <div className="my-1 border-t border-slate-100" />

                  <button
                    onClick={() => {
                      onLogout();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2 cursor-pointer font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAuth}
                className="px-3 py-1.5 text-slate-700 hover:text-slate-900 text-xs font-semibold hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={onOpenRegister || onOpenAuth}
                className="px-3.5 py-1.5 sm:px-4 sm:py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Crown className="w-3.5 h-3.5 text-amber-300" />
                <span>Join VIP</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation Drawer / Menu (Smooth collapsible) */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-200">
          {/* Mobile Search */}
          <div className="flex items-center bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200">
            <span className="material-symbols-outlined text-slate-400 text-[18px] mr-2">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Search concerts, stadiums, plays..."
              className="bg-transparent w-full text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1 text-xs font-semibold pt-1">
            <button
              onClick={() => {
                onNavigate('catalogue');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between ${
                currentView === 'catalogue' ? 'bg-indigo-50 text-primary font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>Explore Live Events</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>

            <button
              onClick={() => {
                onNavigate('bookings');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between ${
                currentView === 'bookings' ? 'bg-indigo-50 text-primary font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>My Bookings & Digital Passes</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>

            <button
              onClick={() => {
                onNavigate('admin');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between ${
                currentView === 'admin' ? 'bg-indigo-50 text-primary font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-primary" />
                Admin Box Office Console
              </span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
