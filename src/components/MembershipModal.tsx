import React, { useState } from 'react';
import { X, Crown, ShieldCheck, CheckCircle2, Phone, MapPin, Mail, Sparkles, ArrowRight } from 'lucide-react';
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
      setSuccessMsg(`Membership updated to ${activeTier === 'vip' ? 'VIP Gold Member' : 'Standard Member'}!`);
      setIsEditing(false);
      setTimeout(() => setSuccessMsg(null), 3500);
    }
  };

  const handleToggleTier = () => {
    const nextTier = tier === 'vip' ? 'standard' : 'vip';
    setTier(nextTier);
    handleSave(nextTier);
  };

  const isVip = tier === 'vip';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${isVip ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'}`}>
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Member Profile & Privileges</h3>
              <p className="text-xs text-slate-500">Official EventHub Pakistan Attendee Credential</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[85vh]">
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Digital Membership Pass Card */}
          <div
            className={`relative rounded-2xl p-6 text-white shadow-xl overflow-hidden transition-all duration-300 ${
              isVip
                ? 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-amber-500/40 ring-1 ring-amber-400/20'
                : 'bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 border border-slate-700'
            }`}
          >
            {/* Holographic background glow */}
            <div
              className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full opacity-30 blur-2xl pointer-events-none"
              style={{
                backgroundColor: isVip ? '#F59E0B' : '#6366F1',
              }}
            />

            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-xs">
                  EH
                </div>
                <span className="text-xs font-bold tracking-wider uppercase opacity-90">
                  EventHub Pakistan Pass
                </span>
              </div>
              <span
                className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full ${
                  isVip
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-sm'
                    : 'bg-white/20 text-white'
                }`}
              >
                {isVip ? 'VIP Gold Member' : 'Standard Pass'}
              </span>
            </div>

            <div className="space-y-1 mb-6 relative z-10">
              <div className="text-xs text-slate-300 font-medium">Attendee Name</div>
              <div className="text-xl font-bold tracking-tight text-white">{currentUser.name}</div>
            </div>

            <div className="flex items-end justify-between pt-4 border-t border-white/10 text-xs relative z-10 font-mono-numbers">
              <div>
                <span className="block text-[10px] text-slate-400 uppercase tracking-wider">Member ID</span>
                <span className="font-bold text-slate-200">EH-PK-{currentUser.id.slice(-6).toUpperCase()}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 uppercase tracking-wider">Region</span>
                <span className="font-medium text-slate-200">{city}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 uppercase tracking-wider">Status</span>
                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* VIP Benefits Checklist */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{isVip ? 'Active VIP Member Benefits' : 'Upgrade to VIP Benefits'}</span>
              </h4>
              <button
                type="button"
                onClick={handleToggleTier}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  isVip
                    ? 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                    : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-xs'
                }`}
              >
                {isVip ? 'Switch to Standard' : 'Upgrade to VIP Free'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-600 pt-1">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Priority 24h Early Access on Coke Studio & PSL tickets</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Express Fast-Track Entry Gate at Arenas & Stadiums</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>0% Box Office Processing Fee on all orders</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Complimentary Seating Upgrade Alerts</span>
              </div>
            </div>
          </div>

          {/* Account Details & Contact Preferences */}
          <div className="space-y-3 pt-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Contact & Regional Details</span>
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="text-indigo-600 hover:underline font-semibold cursor-pointer"
                >
                  Edit Details
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSave()}
                  className="text-emerald-700 hover:underline font-bold cursor-pointer"
                >
                  Save Changes
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> Account Email
                </span>
                <span className="font-semibold text-slate-800 block truncate">{currentUser.email}</span>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> Mobile / WhatsApp Passes
                </span>
                {isEditing ? (
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded px-2 py-0.5 focus:outline-none focus:border-indigo-500 font-mono-numbers"
                  />
                ) : (
                  <span className="font-semibold text-slate-800 block font-mono-numbers">{phone}</span>
                )}
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1 sm:col-span-2">
                <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> Preferred City / Hub
                </span>
                {isEditing ? (
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded px-2 py-0.5 focus:outline-none focus:border-indigo-500"
                  />
                ) : (
                  <span className="font-semibold text-slate-800 block">{city}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[11px] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> SECP Verified Member Account
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
