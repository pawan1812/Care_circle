import React from 'react';
import { useCare } from '../context/useCare';
import {
  ShieldCheck,
  Eye,
  Lock,
  History,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

export const MyPrivacyDashboard: React.FC = () => {
  const {
    profile,
    members,
    currentMember,
    updateProfile,
    updateMemberPermissions,
    revokeMember,
    auditLogs,
  } = useCare();

  const isOwner = currentMember.role === 'elder';
  const privacyLogs = auditLogs.filter((l) => l.entity === 'Privacy' || l.action.includes('PRIVACY') || l.action.includes('MEMBER'));

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 space-y-8 animate-in fade-in duration-300">
      
      {/* Privacy Guarantee Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Elder-First Privacy Promise</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          My Privacy & Permissions Dashboard
        </h2>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          You are in full control of your healthcare data. You can see exactly what each family member and caregiver is allowed to see, view their last login time, or revoke access instantly.
        </p>
      </div>

      {/* Global Protection Controls */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-lg font-extrabold text-slate-900">Healthcare Protection Controls</h3>

        {/* Setting 1: Elder Approval Mode (AC-7) */}
        <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>Elder Approval Mode (Sensitive Changes)</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
              When turned on, any new medication or dosage adjustment entered by caretakers will require your explicit approval before being applied.
            </p>
          </div>

          <button
            onClick={() => updateProfile({ isApprovalModeEnabled: !profile.isApprovalModeEnabled })}
            className="shrink-0 p-1 text-slate-700 hover:text-emerald-600 transition-colors"
            title="Toggle Elder Approval Mode"
          >
            {profile.isApprovalModeEnabled ? (
              <ToggleRight className="w-10 h-10 text-emerald-600" />
            ) : (
              <ToggleLeft className="w-10 h-10 text-slate-400" />
            )}
          </button>
        </div>

        {/* Setting 2: Drug Privacy in Email Subjects (NOT-6) */}
        <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Eye className="w-4 h-4 text-emerald-600" />
              <span>Discreet Email Reminders</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
              Mask specific medication and diagnosis names in notification subjects (e.g. &ldquo;Time for your 8:00 AM medicines&rdquo; instead of naming Glimepiride).
            </p>
          </div>

          <button
            onClick={() => updateProfile({ privacyMaskDrugNamesInEmails: !profile.privacyMaskDrugNamesInEmails })}
            className="shrink-0 p-1 text-slate-700 hover:text-emerald-600 transition-colors"
            title="Toggle Discreet Email Reminders"
          >
            {profile.privacyMaskDrugNamesInEmails ? (
              <ToggleRight className="w-10 h-10 text-emerald-600" />
            ) : (
              <ToggleLeft className="w-10 h-10 text-slate-400" />
            )}
          </button>
        </div>
      </div>

      {/* Member-by-Member Plain Language View Matrix (PRD 19.3) */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Who Can See What (Plain English Breakdown)
        </h3>

        <div className="space-y-3">
          {members.map((member) => {
            const isElder = member.role === 'elder';

            return (
              <div
                key={member.id}
                className="bg-white rounded-2xl p-5 border-2 border-slate-200 shadow-sm space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                      {member.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-base font-extrabold text-slate-900">{member.name}</h4>
                      <p className="text-xs text-slate-500">
                        {member.relationship} • Last active: <strong>{member.lastActive}</strong>
                      </p>
                    </div>
                  </div>

                  {!isElder && isOwner && (
                    <button
                      onClick={() => revokeMember(member.id)}
                      className="text-xs font-bold text-rose-600 hover:text-rose-800 self-end sm:self-center"
                    >
                      Revoke Access
                    </button>
                  )}
                </div>

                {/* Plain-language explanation (PRD 19.3) */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-700 font-medium">
                  {isElder ? (
                    <p className="text-emerald-800 font-bold">
                      🌟 You are the profile owner. You have master access to all prescriptions, doctor summaries, and circle settings.
                    </p>
                  ) : member.role === 'primary_caretaker' ? (
                    <p>
                      <strong>{member.name}</strong> can see your active medicines, log doses on your behalf, schedule appointments, and coordinate daily routines.
                    </p>
                  ) : member.role === 'family_contributor' ? (
                    <p>
                      <strong>{member.name}</strong> can see your adherence progress and doctor visits, volunteer to accompany you, and leave family notes.
                    </p>
                  ) : (
                    <p>
                      <strong>{member.name}</strong> can view basic adherence summaries, but cannot view private family notes.
                    </p>
                  )}
                </div>

                {/* Granular Visibility Toggles for Caregivers (AC-6) */}
                {!isElder && isOwner && (
                  <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={member.canViewAdherence}
                        onChange={() => updateMemberPermissions(member.id, { canViewAdherence: !member.canViewAdherence })}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>Can view Adherence</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={member.canViewAppointments}
                        onChange={() => updateMemberPermissions(member.id, { canViewAppointments: !member.canViewAppointments })}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>Can view Appointments</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={member.canViewNotes}
                        onChange={() => updateMemberPermissions(member.id, { canViewNotes: !member.canViewNotes })}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>Can view Family Notes</span>
                    </label>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Access Changes Audit Log (PRD 19.3: "Show a short history of access changes") */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-slate-900">
          <History className="w-5 h-5 text-slate-600" />
          <h3 className="text-lg font-extrabold">Recent Access & Permission Changes</h3>
        </div>

        <div className="space-y-2 text-xs">
          {privacyLogs.slice(0, 4).map((log) => (
            <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800">{log.actorName}:</span>{' '}
                <span className="text-slate-600">{log.details}</span>
              </div>
              <span className="text-slate-400 font-mono text-[11px] shrink-0 ml-2">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

