import React, { useState } from 'react';
import { useCare } from '../context/useCare';
import {
  Key,
  Copy,
  Check,
  Trash2,
  UserPlus,
  X,
  AlertCircle,
} from 'lucide-react';
import { Role, InviteCode } from '../types';

export const CareCircleView: React.FC = () => {
  const {
    profile,
    members,
    currentMember,
    invites,
    createInvite,
    redeemInvite,
    revokeMember,
  } = useCare();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>('family_contributor');
  const [expiryHours, setExpiryHours] = useState<number>(48);
  const [lastGeneratedInvite, setLastGeneratedInvite] = useState<InviteCode | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Redeem modal state
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
  const [passcodeToRedeem, setPasscodeToRedeem] = useState('');
  const [redeemName, setRedeemName] = useState('');
  const [redeemEmail, setRedeemEmail] = useState('');
  const [redeemPin, setRedeemPin] = useState('');
  const [redeemError, setRedeemError] = useState('');

  const isOwner = currentMember.role === 'elder';

  const roleDescriptions: Record<Role, { title: string; desc: string }> = {
    elder: {
      title: 'Elder (Owner)',
      desc: 'Controls full care ecosystem, approves circle members, views all medical schedules.',
    },
    primary_caretaker: {
      title: 'Primary Caretaker',
      desc: 'Manages daily medications, schedules doctor visits, performs shift handoffs, and logs doses with attribution.',
    },
    caretaker: {
      title: 'Visiting Caretaker / Nurse',
      desc: 'Administers daily medication, logs doses, records vitals and adds care notes during visits.',
    },
    family_contributor: {
      title: 'Family Contributor',
      desc: 'Views adherence, volunteers for clinic visits, adds family care notes, and suggests medication updates.',
    },
    family_view: {
      title: 'Family (View Only)',
      desc: 'Permissioned visibility into general adherence without access to private clinical appointment notes.',
    },
  };

  const handleGenerateInvite = () => {
    const invite = createInvite(selectedRole, expiryHours);
    setLastGeneratedInvite(invite);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleRedeem = (e: React.FormEvent) => {
    e.preventDefault();
    setRedeemError('');
    const result = redeemInvite(passcodeToRedeem, redeemName, redeemEmail);
    if (!result.success) {
      setRedeemError(result.message);
    } else {
      setIsRedeemModalOpen(false);
      setPasscodeToRedeem('');
      setRedeemName('');
      setRedeemEmail('');
      setRedeemPin('');
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 space-y-8 animate-in fade-in duration-300">
      
      {/* Header & Passcode Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Care Circle
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Trusted family members and caregivers connected to <strong>{profile.elderName}</strong>&apos;s healthcare profile.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsRedeemModalOpen(true)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition-colors"
          >
            I Have an Invite Code
          </button>

          <button
            onClick={() => {
              setLastGeneratedInvite(null);
              setIsInviteModalOpen(true);
            }}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Generate Invite Passcode</span>
          </button>
        </div>
      </div>

      {/* Circle Members List */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Active Circle Members ({members.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {members.map((member) => {
            const isElder = member.role === 'elder';

            return (
              <div
                key={member.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-slate-200 hover:border-slate-300 transition-all shadow-sm flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
                        {member.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-base font-extrabold text-slate-900">{member.name}</h4>
                          {isElder && (
                            <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                              OWNER
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-bold text-emerald-700 mt-0.5">
                          {roleDescriptions[member.role]?.title || member.role}
                        </p>
                        <p className="text-xs text-slate-400">{member.relationship}</p>
                      </div>
                    </div>

                    <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                      Active
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {roleDescriptions[member.role]?.desc}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span>{member.email}</span>
                    <span>Last active: {member.lastActive}</span>
                  </div>
                </div>

                {/* Revoke Action */}
                {!isElder && isOwner && (
                  <div className="pt-3 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => revokeMember(member.id)}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center space-x-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Revoke Access</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Pending Invites */}
      {invites.filter((i) => !i.used).length > 0 && (
        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-4">
          <div className="flex items-center space-x-2 text-slate-800">
            <Key className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-extrabold">Active Single-Use Invite Passcodes</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {invites
              .filter((i) => !i.used)
              .map((inv) => (
                <div
                  key={inv.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-base font-extrabold text-slate-900 tracking-wider">
                        {inv.code}
                      </span>
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                        {inv.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Expires: {new Date(inv.expiresAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <button
                    onClick={() => handleCopyCode(inv.code)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    title="Copy passcode"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Generate Invite Modal (PRD AC-2, AC-3, 7.1.1) */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">Invite Care Circle Member</h3>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!lastGeneratedInvite ? (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                    Select Member Role:
                  </label>
                  <div className="space-y-2">
                    {[
                      { role: 'family_contributor', label: 'Family Contributor (Rohan)', desc: 'Can view adherence, notes, volunteer for clinic visits' },
                      { role: 'caretaker', label: 'Visiting Caretaker / Nurse (Sunita)', desc: 'Can log doses on behalf, record vitals, add care notes' },
                      { role: 'primary_caretaker', label: 'Primary Caretaker (Meena)', desc: 'Full care management and appointment scheduling' },
                      { role: 'family_view', label: 'Family View Only', desc: 'Can view overall health without clinical notes' },
                    ].map((item) => (
                      <label
                        key={item.role}
                        className={`flex items-start space-x-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          selectedRole === item.role
                            ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-400'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="inviteRole"
                          value={item.role}
                          checked={selectedRole === item.role}
                          onChange={() => setSelectedRole(item.role as Role)}
                          className="w-4 h-4 text-emerald-600 mt-0.5 focus:ring-emerald-500"
                        />
                        <div>
                          <p className="text-sm font-bold text-slate-900">{item.label}</p>
                          <p className="text-xs text-slate-500">{item.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Passcode Expiration (PRD AC-2):
                  </label>
                  <select
                    value={expiryHours}
                    onChange={(e) => setExpiryHours(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value={24}>24 Hours</option>
                    <option value={48}>48 Hours (Recommended)</option>
                    <option value={72}>72 Hours</option>
                  </select>
                </div>

                <button
                  onClick={handleGenerateInvite}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition-colors"
                >
                  Generate Single-Use Passcode
                </button>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Key className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Passcode Ready to Share</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Send this single-use passcode to your family member or caregiver. It expires in {expiryHours} hours.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300">
                  <span className="font-mono text-3xl font-extrabold tracking-widest text-slate-900">
                    {lastGeneratedInvite.code}
                  </span>
                </div>

                <div className="flex items-center justify-center space-x-3">
                  <button
                    onClick={() => handleCopyCode(lastGeneratedInvite.code)}
                    className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedCode ? 'Copied to Clipboard!' : 'Copy Passcode'}</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 pt-2">
                  Security guarantee: Once redeemed, each member sets their own private PIN. The shared code cannot be reused.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Redeem Passcode Modal (PRD AC-3, 19.2) */}
      {isRedeemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">Join CareCircle</h3>
              <button
                onClick={() => setIsRedeemModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRedeem} className="space-y-4">
              {redeemError && (
                <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-xs text-rose-800 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{redeemError}</span>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  8-Character Invite Passcode *
                </label>
                <input
                  type="text"
                  required
                  value={passcodeToRedeem}
                  onChange={(e) => setPasscodeToRedeem(e.target.value.toUpperCase())}
                  placeholder="e.g. CARE-7842"
                  className="w-full p-3 rounded-xl border border-slate-200 font-mono font-bold text-base focus:ring-2 focus:ring-emerald-500 uppercase tracking-wider"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={redeemName}
                  onChange={(e) => setRedeemName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Your Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={redeemEmail}
                  onChange={(e) => setRedeemEmail(e.target.value)}
                  placeholder="e.g. rahul@example.com"
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Create Your Personal 4-Digit Access PIN *
                </label>
                <input
                  type="password"
                  maxLength={6}
                  required
                  value={redeemPin}
                  onChange={(e) => setRedeemPin(e.target.value)}
                  placeholder="••••"
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm font-mono tracking-widest focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition-colors"
              >
                Join Savitri&apos;s Circle
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

