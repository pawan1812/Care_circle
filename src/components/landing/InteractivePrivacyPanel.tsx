import React, { useState } from 'react';
import { ShieldCheck, Eye, EyeOff, UserCheck, Lock, Sparkles } from 'lucide-react';

interface PermissionToggle {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  whoSees: string;
}

export const InteractivePrivacyPanel: React.FC = () => {
  const [toggles, setToggles] = useState<PermissionToggle[]>([
    {
      id: 'doses',
      title: 'Daily Dose Confirmation Status',
      description: 'Shares green checkmarks when tablets are taken. Preserves privacy by hiding chemical names.',
      enabled: true,
      whoSees: 'Meena & Rohan',
    },
    {
      id: 'prescriptions',
      title: 'Full Prescription & Dosage Strength',
      description: 'Allows viewing Metformin 500 mg, Amlodipine 5 mg, and doctor instructions.',
      enabled: true,
      whoSees: 'Meena (Primary Caretaker) only',
    },
    {
      id: 'clinical_notes',
      title: 'Doctor Consultation Summary & Questions',
      description: 'Pre-visit checklist and clinical briefings prepared for Dr. Kulkarni.',
      enabled: false,
      whoSees: 'Hidden from remote family',
    },
    {
      id: 'location',
      title: 'Live GPS Location Sharing',
      description: 'Real-time location beacon. Turned off by default to protect senior autonomy.',
      enabled: false,
      whoSees: 'Disabled (Strict Privacy)',
    },
  ]);

  const [elderApprovalMode, setElderApprovalMode] = useState(true);

  const handleToggle = (id: string) => {
    setToggles((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const nextEnabled = !t.enabled;
        let nextWhoSees = t.whoSees;
        if (id === 'clinical_notes') {
          nextWhoSees = nextEnabled ? 'Meena & Rohan' : 'Hidden from remote family';
        } else if (id === 'location') {
          nextWhoSees = nextEnabled ? 'Shared with Meena during transit' : 'Disabled (Strict Privacy)';
        } else if (id === 'prescriptions') {
          nextWhoSees = nextEnabled ? 'Meena (Primary Caretaker)' : 'Hidden (Dose status only)';
        }
        return { ...t, enabled: nextEnabled, whoSees: nextWhoSees };
      })
    );
  };

  const isNotesShared = toggles.find((t) => t.id === 'clinical_notes')?.enabled;
  const isLocationShared = toggles.find((t) => t.id === 'location')?.enabled;

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/60 shadow-2xl relative overflow-hidden">
      {/* Background soft ambient blur */}
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-emerald-200/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-amber-200/25 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/70">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-900 text-xs font-bold border border-emerald-300/60 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>DPDP Act 2023 Aligned • Consent-First</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Savitri Stays in Charge of Her Health Data
          </h3>
          <p className="text-sm text-slate-600 mt-1 max-w-xl">
            Try switching these live toggles. CareCircle is built so the senior decides what each circle member can see. Nothing is shared without permission.
          </p>
        </div>

        {/* Global Elder Approval Master Badge */}
        <div className="bg-white/90 p-4 rounded-2xl border border-emerald-200 shadow-sm flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">Elder Approval Mode</p>
            <p className="text-[11px] text-emerald-700 font-semibold">
              {elderApprovalMode ? 'Active (Requires Consent)' : 'Standard Auto-Sync'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setElderApprovalMode(!elderApprovalMode)}
            className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer ${
              elderApprovalMode ? 'bg-emerald-600' : 'bg-slate-300'
            }`}
            aria-label="Toggle Elder Approval Mode"
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-1 transition-transform ${
                elderApprovalMode ? 'left-6' : 'left-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Interactive Toggle Rows */}
      <div className="relative z-10 py-6 space-y-4">
        {toggles.map((item) => (
          <div
            key={item.id}
            className="bg-white/70 hover:bg-white/90 rounded-2xl p-4 sm:p-5 border border-slate-200/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm sm:text-base text-slate-900">{item.title}</span>
                {item.enabled ? (
                  <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <Eye className="w-3 h-3" />
                    <span>Shared</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                    <EyeOff className="w-3 h-3" />
                    <span>Private</span>
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-600">{item.description}</p>
              <p className="text-[11px] text-slate-500 font-medium pt-0.5">
                Current audience: <strong className="text-slate-800">{item.whoSees}</strong>
              </p>
            </div>

            {/* Custom Toggle Switch */}
            <button
              type="button"
              onClick={() => handleToggle(item.id)}
              className={`w-14 h-8 rounded-full transition-colors relative flex-shrink-0 cursor-pointer shadow-inner ${
                item.enabled ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
              aria-label={`Toggle ${item.title}`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white shadow-md absolute top-1 transition-transform ${
                  item.enabled ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      {/* Dynamic Avatar Reaction Strip */}
      <div className="relative z-10 pt-4 border-t border-slate-200/70">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Live Reaction: What Savitri&apos;s Circle Sees Right Now
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Avatar 1: Meena (Primary) */}
          <div className="bg-emerald-50/70 rounded-2xl p-3.5 border border-emerald-200/80 flex items-center space-x-3 transition-all">
            <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              M
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="font-bold text-xs text-slate-900 truncate">Meena (Daughter)</p>
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <p className="text-[11px] text-emerald-900 font-semibold truncate">
                {isLocationShared ? 'Doses • Meds • Location' : 'Doses & Prescriptions'}
              </p>
            </div>
          </div>

          {/* Avatar 2: Rohan (Remote Son) */}
          <div className="bg-white/80 rounded-2xl p-3.5 border border-slate-200 flex items-center space-x-3 transition-all">
            <div className="w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              R
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="font-bold text-xs text-slate-900 truncate">Rohan (Son in BLR)</p>
                {isNotesShared ? (
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                )}
              </div>
              <p className="text-[11px] text-slate-600 font-semibold truncate">
                {isNotesShared ? 'Dose status + Dr. Notes' : 'Dose Confirmations Only'}
              </p>
            </div>
          </div>

          {/* Avatar 3: Sunita (Visiting Nurse) */}
          <div className="bg-white/80 rounded-2xl p-3.5 border border-slate-200 flex items-center space-x-3 transition-all">
            <div className="w-10 h-10 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              S
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="font-bold text-xs text-slate-900 truncate">Sunita (Nurse)</p>
                <UserCheck className="w-3.5 h-3.5 text-teal-600" />
              </div>
              <p className="text-[11px] text-slate-600 font-semibold truncate">
                Shift Vitals & Handoff
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

