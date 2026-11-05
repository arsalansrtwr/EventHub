import React, { useState } from 'react';
import {
  X,
  Crown,
  ShieldCheck,
  CheckCircle2,
  Phone,
  MapPin,
  Mail,
  Sparkles,
  Zap,
  Clock,
  Star,
  Check,
  Edit3,
  Wifi,
  QrCode,
} from 'lucide-react';
import { User } from '../types';
import { db } from '../services/db';

interface MembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onUserUpdated: (user: User) => void;
}

export const MembershipModal: React.FC<MembershipModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserUpdated,
}) => {
  const [tier, setTier] = useState<'standard' | 'vip'>(currentUser.membership_tier === 'vip' ? 'vip' : 'standard');
  const [phone, setPhone] = useState(currentUser.phone || '+92 300 8472910');
  const [city, setCity] = useState(currentUser.city || 'Karachi & Lahore');
  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = (newTier?: 'standard' | 'vip') => {
    const activeTier = newTier || tier;
    const res = db.updateUserProfile(currentUser.id, {
      membership_tier: activeTier,
      phone: phone.trim(),
      city: city.trim(),
    });

    if (res.success && res.user) {
      onUserUpdated(res.user);
      setSuccessMsg(`Account tier updated to ${activeTier === 'vip' ? 'VIP Gold Member' : 'Standard Member'}`);
      setIsEditing(false);
      setTimeout(() => setSuccessMsg(null), 3000);
    }
  };

  const handleSelectTier = (selectedTier: 'standard' | 'vip') => {
    if (selectedTier === tier) return;
    setTier(selectedTier);
    handleSave(selectedTier);
  };

  const isVip = tier === 'vip';
  const memberCode = `EH-PK-${currentUser.id ? currentUser.id.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(-6) : '849201'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs ${
              isVip
                ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950'
                : 'bg-slate-900 text-white'
            }`}>
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 font-display">Member Profile & Privileges</h3>
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  isVip
                    ? 'bg-amber-100 text-amber-900 border border-amber-300/60'
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {isVip ? 'VIP Gold' : 'Standard'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Official EventHub Pakistan Box Office Credential</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">{successMsg}</span>
            </div>
          )}

          {/* Premium Digital Membership Card (Fintech / Executive Luxury Pass) */}
          <div
            className={`relative rounded-3xl p-6 sm:p-7 text-white shadow-2xl overflow-hidden transition-all duration-300 border ${
              isVip
                ? 'bg-gradient-to-br from-[#0c1021] via-[#121833] to-[#1c1836] border-amber-400/40 shadow-indigo-950/20'
                : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700/80 shadow-slate-900/20'
            }`}
          >
            {/* Ambient luxury light glows */}
            <div
              className="absolute -right-12 -top-12 w-52 h-52 rounded-full opacity-25 blur-3xl pointer-events-none"
              style={{ backgroundColor: isVip ? '#F59E0B' : '#6366F1' }}
            />
            <div
              className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full opacity-20 blur-3xl pointer-events-none"
              style={{ backgroundColor: isVip ? '#D97706' : '#3B82F6' }}
            />

            {/* Subtle card guilloche texture lines */}
            <div
              className="absolute inset-0 opacity-[0.035] pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(circle at 50% 50%, #ffffff 1px, transparent 1px)`,
                backgroundSize: '16px 16px',
              }}
            />

            {/* Card Header */}
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-black text-xs text-white shadow-xs">
                  EH
                </div>
                <div>
                  <div className="text-[11px] font-black tracking-widest uppercase text-white/90 leading-tight">
                    EventHub Pakistan
                  </div>
                  <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
                    Live Box Office Pass
                  </div>
                </div>
              </div>

              {/* VIP Gold Foil Badge */}
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-white/40 rotate-90" />
                <span
                  className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm ${
                    isVip
                      ? 'bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 text-slate-950 font-black border border-amber-200/50'
                      : 'bg-white/15 text-white/90 border border-white/10'
                  }`}
                >
                  {isVip && <Sparkles className="w-3 h-3 text-amber-950 fill-amber-950" />}
                  <span>{isVip ? 'VIP Gold Member' : 'Standard Pass'}</span>
                </span>
              </div>
            </div>

            {/* EMV Gold Chip Vector + Cardholder Details */}
            <div className="relative z-10 mb-6 flex items-center justify-between">
              <div>
                <div className="text-[9px] uppercase tracking-widest text-amber-200/70 font-bold mb-1">
                  Cardholder / Attendee
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-300/80 font-medium tracking-wide mt-0.5">
                  {isVip ? 'VIP ALL-ACCESS STATUS' : 'STANDARD GENERAL CREDENTIAL'}
                </div>
              </div>

              {/* Metallic Chip Graphic */}
              <div className="hidden sm:flex flex-col items-center">
                <div className="w-12 h-9 rounded-lg bg-gradient-to-tr from-amber-300 via-amber-200 to-yellow-400 border border-amber-500/70 shadow-sm relative overflow-hidden flex items-center justify-center">
                  <div className="w-8 h-5 border border-amber-700/40 rounded-sm grid grid-cols-2 grid-rows-2">
                    <div className="border-r border-b border-amber-700/40" />
                    <div className="border-b border-amber-700/40" />
                    <div className="border-r border-amber-700/40" />
                    <div />
                  </div>
                </div>
              </div>
            </div>

            {/* Card Footer: Aligned Metadata */}
            <div className="pt-4 border-t border-white/15 grid grid-cols-3 gap-2 relative z-10 font-mono-numbers">
              <div>
                <span className="block text-[9px] text-slate-400 uppercase tracking-widest font-semibold">
                  Member ID
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-100 tracking-wider">
                  {memberCode}
                </span>
              </div>

              <div>
                <span className="block text-[9px] text-slate-400 uppercase tracking-widest font-semibold">
                  Primary Region
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-100 truncate block">
                  {city || 'Pakistan'}
                </span>
              </div>

              <div className="text-right">
                <span className="block text-[9px] text-slate-400 uppercase tracking-widest font-semibold">
                  Pass Status
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Membership Tier Switcher (Interactive Segmented Control) */}
          <div className="bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80 flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleSelectTier('vip')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isVip
                  ? 'bg-white text-slate-950 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Crown className={`w-4 h-4 ${isVip ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
              <span>VIP Gold Member</span>
              {isVip && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
            </button>

            <button
              type="button"
              onClick={() => handleSelectTier('standard')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                !isVip
                  ? 'bg-white text-slate-950 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <ShieldCheck className={`w-4 h-4 ${!isVip ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>Standard Pass</span>
              {!isVip && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
            </button>
          </div>

          {/* VIP Privileges Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{isVip ? 'Exclusive VIP Privileges' : 'Available VIP Privileges'}</span>
              </h4>
              <span className="text-[11px] font-semibold text-slate-400">
                {isVip ? '4 / 4 Benefits Unlocked' : 'Select VIP Gold to Activate'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/70 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200/60">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 leading-tight">24h Priority Early Access</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Book Coke Studio and PSL tournament seats before public releases.
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/70 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200/60">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 leading-tight">Express Fast-Track Gate</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Dedicated VIP entrance lanes at major stadiums and concert arenas.
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/70 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 border border-indigo-200/60">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 leading-tight">0% Box Office Fees</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    All digital ticketing processing charges permanently waived.
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/70 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 border border-purple-200/60">
                  <Star className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 leading-tight">Complimentary Upgrades</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Instant priority notification for floor & orchestra seat upgrades.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Regional Details (Clean Grouped Card) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">
                Contact & Regional Credentials
              </span>
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="text-xs font-bold text-primary hover:text-indigo-800 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Info</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSave()}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 divide-y divide-slate-100 overflow-hidden shadow-xs">
              {/* Email Row */}
              <div className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 text-slate-600 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Delivery Email
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-900 block truncate">
                      {currentUser.email}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                  <Check className="w-3 h-3" /> Verified
                </span>
              </div>

              {/* Phone Row */}
              <div className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full">
                  <div className="p-2 rounded-xl bg-slate-100 text-slate-600 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="w-full">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Mobile & WhatsApp Passes
                    </span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+92 300 1234567"
                        className="w-full text-xs sm:text-sm font-semibold text-slate-900 bg-slate-50 border border-indigo-300 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono-numbers mt-0.5"
                      />
                    ) : (
                      <span className="text-xs sm:text-sm font-semibold text-slate-900 font-mono-numbers block">
                        {phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* City / Regional Hub Row */}
              <div className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full">
                  <div className="p-2 rounded-xl bg-slate-100 text-slate-600 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="w-full">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Preferred Regional Hub
                    </span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Karachi & Lahore"
                        className="w-full text-xs sm:text-sm font-semibold text-slate-900 bg-slate-50 border border-indigo-300 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-primary/20 mt-0.5"
                      />
                    ) : (
                      <span className="text-xs sm:text-sm font-semibold text-slate-900 block">
                        {city}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>SECP Reg. #1184-PK • 256-Bit Cryptographic Pass</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
