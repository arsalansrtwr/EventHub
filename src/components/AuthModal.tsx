import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, User as UserIcon, Shield, CheckCircle2, AlertCircle, Phone, MapPin, Crown, Sparkles } from 'lucide-react';
import { db } from '../services/db';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+92 300 ');
  const [city, setCity] = useState('Karachi');
  const [membershipTier, setMembershipTier] = useState<'standard' | 'vip'>('vip');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    setMode(initialMode);
    setError(null);
    setSuccessMsg(null);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (mode === 'login') {
      const res = db.login(email, password);
      if (res.success && res.user) {
        setSuccessMsg(`Welcome back, ${res.user.name}!`);
        setTimeout(() => {
          onLoginSuccess(res.user!);
          onClose();
        }, 300);
      } else {
        setError(res.error || 'Invalid credentials. Please verify your email and password.');
      }
    } else {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      const res = db.register(name, email, password, 'customer', phone, city, membershipTier);
      if (res.success && res.user) {
        setSuccessMsg(`Account created! Welcome to EventHub as a ${res.user.membership_tier === 'vip' ? 'VIP Gold Member' : 'Standard Member'}.`);
        setTimeout(() => {
          onLoginSuccess(res.user!);
          onClose();
        }, 400);
      } else {
        setError(res.error || 'Registration failed.');
      }
    }
  };

  const handleQuickFill = (preset: 'vip_customer' | 'standard_customer' | 'admin') => {
    setMode('login');
    setError(null);
    if (preset === 'vip_customer') {
      setEmail('dureadan@gmail.com');
      setPassword('password123');
    } else if (preset === 'standard_customer') {
      setEmail('ayesha.khan@gmail.com');
      setPassword('password123');
    } else {
      setEmail('admin@eventhub.pk');
      setPassword('admin123');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header with Mode Toggle */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {mode === 'login' ? 'Sign In to EventHub Pakistan' : 'Create Verified Attendee Account'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {mode === 'login'
                ? 'Access your booking history and digital QR passes'
                : 'Join EventHub with instant VIP access & zero-fee booking'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch header */}
        <div className="flex border-b border-slate-100 bg-slate-100/60 p-1.5 mx-6 mt-4 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer text-center ${
              mode === 'login' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer text-center ${
              mode === 'register' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Create Account & VIP Pass
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 pt-4 space-y-4 max-h-[78vh] overflow-y-auto">
          {/* Quick-fill evaluation helper */}
          {mode === 'login' && (
            <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs space-y-1.5">
              <div className="flex items-center justify-between text-indigo-950 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-indigo-600" /> 1-Click Fast Sign-In:
                </span>
              </div>
              <div className="flex flex-wrap gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={() => handleQuickFill('vip_customer')}
                  className="px-2.5 py-1.5 bg-white hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-[11px] font-semibold transition-colors flex-1 text-center cursor-pointer shadow-2xs"
                >
                  VIP (Dur-e-Adan)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('standard_customer')}
                  className="px-2.5 py-1.5 bg-white hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-[11px] font-semibold transition-colors flex-1 text-center cursor-pointer shadow-2xs"
                >
                  Standard (Ayesha Khan)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('admin')}
                  className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[11px] font-semibold transition-colors flex-1 text-center cursor-pointer shadow-2xs"
                >
                  Box Office Admin
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Legal Name</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Dur-e-Adan"
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Mobile / WhatsApp</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+92 300 8472910"
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono-numbers"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">City / Region</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                      >
                        <option value="Karachi">Karachi</option>
                        <option value="Lahore">Lahore</option>
                        <option value="Islamabad">Islamabad</option>
                        <option value="Rawalpindi">Rawalpindi</option>
                        <option value="Faisalabad">Faisalabad</option>
                        <option value="Peshawar">Peshawar</option>
                        <option value="Multan">Multan</option>
                        <option value="Quetta">Quetta</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Membership Tier Card Choice */}
                <div className="space-y-1.5 pt-1">
                  <label className="block font-semibold text-slate-700">Select Membership Tier</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div
                      onClick={() => setMembershipTier('vip')}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        membershipTier === 'vip'
                          ? 'border-amber-500 bg-amber-50/50 ring-1 ring-amber-400'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-amber-900 flex items-center gap-1">
                          <Crown className="w-3.5 h-3.5 text-amber-600" /> VIP Gold Pass
                        </span>
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-extrabold px-1.5 py-0.5 rounded">
                          Free Launch
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-tight">
                        24h early presale, 0% booking fee & fast-track gate entry.
                      </p>
                    </div>

                    <div
                      onClick={() => setMembershipTier('standard')}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        membershipTier === 'standard'
                          ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-400'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-800">Standard Pass</span>
                        <span className="text-[10px] text-slate-400 font-bold">Standard</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-tight">
                        Regular access, QR tickets, and booking history.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="dureadan@gmail.com"
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono-numbers"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1">
              <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Remember me</span>
              </label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => setError('Use the 1-Click Fast Sign-In buttons above for instant access.')}
                  className="text-indigo-600 hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-xs transition-colors cursor-pointer text-xs"
            >
              {mode === 'login' ? 'Sign In to Account' : 'Create Account & Activate Membership'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
