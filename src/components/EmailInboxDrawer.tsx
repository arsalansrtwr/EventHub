import React, { useState } from 'react';
import { X, Mail, CheckCircle2, Clock, AlertTriangle, ChevronRight, Inbox, ArrowLeft, QrCode } from 'lucide-react';
import { SimulatedEmail } from '../types';

interface EmailInboxDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  emails: SimulatedEmail[];
  onMarkAsRead: (id: string) => void;
  currentUserEmail?: string;
}

export const EmailInboxDrawer: React.FC<EmailInboxDrawerProps> = ({
  isOpen,
  onClose,
  emails,
  onMarkAsRead,
  currentUserEmail,
}) => {
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<'all' | 'my'>('my');
  const [mobileViewingReader, setMobileViewingReader] = useState(false);

  if (!isOpen) return null;

  const filteredEmails =
    filterMode === 'my' && currentUserEmail
      ? emails.filter((m) => m.to_email.toLowerCase() === currentUserEmail.toLowerCase())
      : emails;

  const selectedEmail = emails.find((e) => e.id === selectedEmailId) || filteredEmails[0] || null;

  const handleSelectEmail = (id: string) => {
    setSelectedEmailId(id);
    onMarkAsRead(id);
    setMobileViewingReader(true);
  };

  const getBadgeIcon = (type: SimulatedEmail['type']) => {
    switch (type) {
      case 'order_confirmed':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
      case 'order_cancelled':
        return <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-amber-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Dispatched Ticket Outbox</h3>
              <p className="text-xs text-slate-500">Official Box Office e-ticket receipts & digital QR passes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Close Email Outbox"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-white border-b border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => {
                setFilterMode('my');
                setMobileViewingReader(false);
              }}
              className={`px-3 py-1 font-medium rounded-md transition-colors cursor-pointer ${
                filterMode === 'my' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              My Tickets ({currentUserEmail ? emails.filter((m) => m.to_email.toLowerCase() === currentUserEmail.toLowerCase()).length : 0})
            </button>
            <button
              onClick={() => {
                setFilterMode('all');
                setMobileViewingReader(false);
              }}
              className={`px-3 py-1 font-medium rounded-md transition-colors cursor-pointer ${
                filterMode === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Outbox ({emails.length})
            </button>
          </div>
          <span className="text-slate-400 text-[11px] hidden sm:inline">Dispatched immediately after checkout</span>
        </div>

        {/* Body Split with Mobile Toggle */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Email List Left (hidden on mobile if viewing reader) */}
          <div
            className={`w-full md:w-2/5 border-r border-slate-200 overflow-y-auto bg-slate-50/40 ${
              mobileViewingReader ? 'hidden md:block' : 'block'
            }`}
          >
            {filteredEmails.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 flex flex-col items-center justify-center h-full">
                <Inbox className="w-8 h-8 text-slate-300 mb-2 stroke-1" />
                <p>No dispatched tickets yet.</p>
                <p className="text-[11px] mt-1 text-slate-500">Book any Pakistani event to view instant delivery!</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredEmails.map((email) => {
                  const isSelected = selectedEmail?.id === email.id;
                  return (
                    <button
                      key={email.id}
                      onClick={() => handleSelectEmail(email.id)}
                      className={`w-full text-left p-3.5 transition-colors block relative cursor-pointer ${
                        isSelected ? 'bg-white border-l-2 border-indigo-600 shadow-2xs' : 'hover:bg-slate-100/70'
                      }`}
                    >
                      {!email.read && (
                        <span className="absolute top-3.5 right-3 w-2 h-2 rounded-full bg-indigo-600" />
                      )}
                      <div className="flex items-center gap-1.5 mb-1">
                        {getBadgeIcon(email.type)}
                        <span className="text-[11px] font-semibold text-slate-700 truncate">{email.to_name}</span>
                      </div>
                      <div className="text-xs font-medium text-slate-900 line-clamp-1 mb-1">{email.subject}</div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono-numbers">
                        <span>{new Date(email.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 md:hidden" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Email Reader Right (shown on mobile when email selected) */}
          <div
            className={`w-full md:w-3/5 overflow-y-auto p-4 sm:p-6 bg-white flex flex-col ${
              !mobileViewingReader ? 'hidden md:flex' : 'flex'
            }`}
          >
            {/* Mobile Back Button */}
            <div className="md:hidden pb-3 mb-2 border-b border-slate-100 flex items-center gap-2">
              <button
                onClick={() => setMobileViewingReader(false)}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-600 cursor-pointer p-1 rounded-md hover:bg-indigo-50"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Outbox
              </button>
            </div>

            {selectedEmail ? (
              <div className="space-y-4 text-xs">
                {/* Meta details */}
                <div className="pb-4 border-b border-slate-100">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 font-mono-numbers">
                    <span>From: boxoffice@eventhub.pk</span>
                    <span>{new Date(selectedEmail.sent_at).toLocaleString()}</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-1">{selectedEmail.subject}</h4>
                  <div className="text-slate-600">
                    To: <strong className="text-slate-800">{selectedEmail.to_name}</strong> &lt;{selectedEmail.to_email}&gt;
                  </div>
                </div>

                {/* Email Content */}
                <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 whitespace-pre-line text-slate-700 leading-relaxed font-sans text-xs">
                  {selectedEmail.body}
                </div>

                {/* Official seal */}
                <div className="pt-4 text-center border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-center gap-1.5">
                  <QrCode className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Official e-Ticket Dispatch • EventHub Pakistan (SECP Lic #1184-PK)</span>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400 text-xs">
                <Mail className="w-8 h-8 text-slate-300 mb-2 stroke-1" />
                Select a dispatched notification from the left to view full ticket details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
