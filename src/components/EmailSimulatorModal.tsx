import React, { useState } from 'react';
import { useCare } from '../context/useCare';
import {
  X,
  Mail,
  CheckCircle2,
  Clock,
  Sparkles,
  User,
} from 'lucide-react';

interface EmailSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmailSimulatorModal: React.FC<EmailSimulatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { emails, executeEmailAction, markEmailRead } = useCare();
  const [selectedEmailId, setSelectedEmailId] = useState<string>(emails[0]?.id || '');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentEmail = emails.find((e) => e.id === selectedEmailId) || emails[0];

  const handleExecuteLink = (action: string, targetId: string) => {
    if (currentEmail) {
      const res = executeEmailAction(currentEmail.token, action, targetId);
      setActionFeedback(res.message);
      markEmailRead(currentEmail.id);
      setTimeout(() => setActionFeedback(null), 5000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col animate-in zoom-in-95 my-6">
        
        {/* Simulator Top Bar */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold">Simulated Notification & Email Engine</h3>
                <span className="text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded-full">
                  PRD Section 7.5
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Test one-tap token action links that log doses without requiring login!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2-Column Mailbox View */}
        <div className="grid grid-cols-1 md:grid-cols-3 flex-1 min-h-[480px] overflow-hidden">
          
          {/* Left: Email List */}
          <div className="border-r border-slate-200 p-4 space-y-2 bg-slate-50 overflow-y-auto">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Simulated Inbox ({emails.length})
            </p>

            {emails.map((email) => {
              const isSelected = email.id === currentEmail?.id;
              return (
                <button
                  key={email.id}
                  onClick={() => {
                    setSelectedEmailId(email.id);
                    markEmailRead(email.id);
                  }}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-white border-emerald-500 shadow-md ring-1 ring-emerald-400'
                      : 'bg-white/80 border-slate-200 hover:bg-white text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-slate-900 truncate max-w-[130px]">
                      {email.recipientName}
                    </span>
                    <span className="text-[10px] text-slate-400">{email.sentAt}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 mt-1 line-clamp-1">
                    {email.subject}
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                    {email.previewText}
                  </p>
                  {!email.opened && (
                    <span className="inline-block mt-2 w-2 h-2 rounded-full bg-emerald-600"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: Rendered Email Content */}
          <div className="md:col-span-2 p-6 overflow-y-auto space-y-6 bg-white">
            {currentEmail && (
              <>
                {/* Email Header */}
                <div className="border-b border-slate-200 pb-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      From: CareCircle Notifications &lt;reminders@carecircle.app&gt;
                    </span>
                    <span className="text-xs text-slate-400">{currentEmail.sentAt}</span>
                  </div>
                  <h4 className="text-xl font-extrabold text-slate-900">
                    {currentEmail.subject}
                  </h4>
                  <p className="text-xs text-slate-600">
                    To: <strong>{currentEmail.recipientName}</strong> &lt;{currentEmail.to}&gt;
                  </p>
                </div>

                {/* Email Body Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5">
                  <div className="flex items-center space-x-2 text-emerald-800 font-extrabold text-base">
                    <Sparkles className="w-5 h-5 text-emerald-600" />
                    <span>CareCircle Automated Reminder</span>
                  </div>

                  <p className="text-slate-800 text-sm leading-relaxed">
                    Hello {currentEmail.recipientName},
                  </p>

                  <p className="text-slate-800 text-base font-medium leading-relaxed bg-white p-4 rounded-2xl border border-slate-200">
                    {currentEmail.previewText}
                  </p>

                  {/* 1-Tap Action Links (PRD NOT-1: "Contains secure, time-limited, one-tap action links") */}
                  {currentEmail.actionLinks && currentEmail.actionLinks.length > 0 && (
                    <div className="pt-2 space-y-3">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Quick 1-Tap Actions (No login needed):
                      </p>

                      <div className="flex flex-wrap items-center gap-3">
                        {currentEmail.actionLinks.map((link, idx) => {
                          const isPrimary = link.action === 'taken' || link.action === 'volunteer';
                          return (
                            <button
                              key={idx}
                              onClick={() => handleExecuteLink(link.action, link.targetId)}
                              className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold shadow-sm transition-all flex items-center space-x-2 ${
                                isPrimary
                                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
                                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                              }`}
                            >
                              {link.action === 'taken' && <CheckCircle2 className="w-4 h-4" />}
                              {link.action === 'snooze' && <Clock className="w-4 h-4" />}
                              {link.action === 'volunteer' && <User className="w-4 h-4" />}
                              <span>{link.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Success Action Feedback Banner */}
                  {actionFeedback && (
                    <div className="bg-emerald-100 border-2 border-emerald-500 p-4 rounded-2xl text-emerald-950 font-bold text-xs sm:text-sm flex items-center space-x-3 animate-in fade-in">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>{actionFeedback}</span>
                    </div>
                  )}

                  <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-400 space-y-1">
                    <p>
                      🔒 <strong>Security Verification:</strong> This action is signed with a cryptographic single-use token: <code className="font-mono bg-slate-200 px-1 py-0.5 rounded text-[10px]">{currentEmail.token}</code>.
                    </p>
                    <p>
                      You are receiving this notification because you are a registered member of Savitri Sharma&apos;s Care Circle.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

