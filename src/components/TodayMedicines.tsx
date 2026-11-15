import React, { useState } from 'react';
import { useCare } from '../context/useCare';
import {
  Pill,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RotateCcw,
  Info,
  User,
  Coffee,
  Sun,
  Sunset,
  Moon,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { DoseEvent, MissedReason, TimeOfDay } from '../types';

export const TodayMedicines: React.FC = () => {
  const {
    doses,
    logDose,
    snoozeDose,
    t,
  } = useCare();

  const [skipModalDoseId, setSkipModalDoseId] = useState<string | null>(null);
  const [selectedSkipReason, setSelectedSkipReason] = useState<MissedReason>('forgot');
  const [skipNotes, setSkipNotes] = useState('');
  const [expandedInfoDoseId, setExpandedInfoDoseId] = useState<string | null>(null);

  // Group doses by time of day
  const timeGroups: { key: TimeOfDay; label: string; icon: React.ReactNode; period: string }[] = [
    { key: 'morning', label: t.morning, icon: <Sun className="w-5 h-5 text-amber-500" />, period: '06:00 - 12:00' },
    { key: 'afternoon', label: t.afternoon, icon: <Coffee className="w-5 h-5 text-orange-500" />, period: '12:00 - 17:00' },
    { key: 'evening', label: t.evening, icon: <Sunset className="w-5 h-5 text-indigo-500" />, period: '17:00 - 20:00' },
    { key: 'night', label: t.night, icon: <Moon className="w-5 h-5 text-purple-500" />, period: '20:00 - 24:00' },
  ];

  const handleConfirmSkip = () => {
    if (skipModalDoseId) {
      logDose(skipModalDoseId, 'skipped', selectedSkipReason, skipNotes);
      setSkipModalDoseId(null);
      setSkipNotes('');
    }
  };

  const getStatusBadge = (dose: DoseEvent) => {
    switch (dose.status) {
      case 'taken':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.taken}</span>
          </span>
        );
      case 'late':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>{t.late}</span>
          </span>
        );
      case 'due':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold border border-rose-300 animate-pulse">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>{t.dueNow}</span>
          </span>
        );
      case 'skipped':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 text-xs font-bold border border-slate-300">
            <XCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.skipped} ({dose.reason?.replace('_', ' ')})</span>
          </span>
        );
      case 'snoozed':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold border border-blue-300">
            <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
            <span>Snoozed until {dose.snoozedUntil}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{t.upcoming}</span>
          </span>
        );
    }
  };

  const takenCount = doses.filter((d) => d.status === 'taken' || d.status === 'late').length;
  const totalCount = doses.length;
  const adherenceRate = totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 100;

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 space-y-8 animate-in fade-in duration-300">
      
      {/* Overview Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t.todaySchedule}
          </h2>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">
            Doses grouped by time of day. Log with attribution for complete transparency.
          </p>
          <div className="mt-3 flex items-center space-x-2 text-xs text-slate-500">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Real-time local synchronization active</span>
          </div>
        </div>

        {/* Adherence Gauge */}
        <div className="bg-emerald-50/80 rounded-2xl p-4 border border-emerald-200 flex items-center space-x-4 shrink-0">
          <div className="relative w-16 h-16 flex items-center justify-center rounded-full bg-white shadow-sm border-4 border-emerald-500">
            <span className="text-sm font-extrabold text-emerald-800">{adherenceRate}%</span>
          </div>
          <div>
            <p className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Today’s Progress</p>
            <p className="text-sm font-bold text-slate-800 mt-0.5">
              {takenCount} of {totalCount} Taken
            </p>
            <p className="text-xs text-emerald-700">
              {adherenceRate >= 80 ? '🌟 Excellent adherence' : 'Follow schedule carefully'}
            </p>
          </div>
        </div>
      </div>

      {/* Doses grouped by Time of Day */}
      <div className="space-y-6">
        {timeGroups.map((group) => {
          const groupDoses = doses.filter((d) => d.timeOfDay === group.key);
          if (groupDoses.length === 0) return null;

          return (
            <div key={group.key} className="space-y-3">
              {/* Group Heading */}
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-white shadow-sm border border-slate-200">
                    {group.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{group.label}</h3>
                    <p className="text-xs text-slate-400">{group.period}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                  {groupDoses.filter((d) => d.status === 'taken').length} / {groupDoses.length} completed
                </span>
              </div>

              {/* Doses Cards in Group */}
              <div className="grid grid-cols-1 gap-3">
                {groupDoses.map((dose) => {
                  const isTaken = dose.status === 'taken' || dose.status === 'late';
                  const isExpanded = expandedInfoDoseId === dose.id;

                  return (
                    <div
                      key={dose.id}
                      className={`bg-white rounded-2xl p-5 border-2 transition-all shadow-sm ${
                        isTaken
                          ? 'border-emerald-200/60 bg-emerald-50/20'
                          : dose.status === 'due'
                          ? 'border-rose-300 ring-2 ring-rose-100'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        
                        {/* Medicine Info */}
                        <div className="flex items-start space-x-3.5">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 font-bold shadow-sm"
                            style={{ backgroundColor: dose.colorTag }}
                          >
                            <Pill className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
                              <h4 className="text-lg font-extrabold text-slate-900">
                                {dose.medicationName}
                              </h4>
                              <span className="text-sm font-semibold text-slate-700">
                                {dose.strength}
                              </span>
                              {getStatusBadge(dose)}
                            </div>

                            <p className="text-xs text-slate-500 mt-1">
                              Scheduled at <strong className="text-slate-800">{dose.scheduledTime}</strong> •{' '}
                              <span>{t[dose.foodInstruction as keyof typeof t] || dose.foodInstruction}</span>
                            </p>

                            {/* Attribution tag if logged by someone */}
                            {dose.loggedBy && (
                              <div className="mt-2 inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                                <User className="w-3.5 h-3.5 text-slate-500" />
                                <span>
                                  {dose.status === 'taken' ? 'Logged by' : 'Updated by'}{' '}
                                  <strong className="text-slate-900">{dose.loggedBy}</strong>{' '}
                                  {dose.loggedAt && (
                                    <span className="text-slate-400">
                                      at {new Date(dose.loggedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  )}
                                </span>
                              </div>
                            )}

                            {dose.notes && (
                              <p className="text-xs text-slate-500 italic mt-1">
                                Note: &ldquo;{dose.notes}&rdquo;
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Dose Actions */}
                        <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                          {!isTaken ? (
                            <>
                              <button
                                onClick={() => logDose(dose.id, 'taken')}
                                className="elder-touch-target px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm shadow-sm transition-all flex items-center space-x-1.5"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>{t.markTaken}</span>
                              </button>

                              <button
                                onClick={() => snoozeDose(dose.id, 15)}
                                className="elder-touch-target px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors border border-slate-200"
                                title="Snooze for 15 minutes"
                              >
                                {t.snooze}
                              </button>

                              <button
                                onClick={() => {
                                  setSkipModalDoseId(dose.id);
                                  setSelectedSkipReason('forgot');
                                }}
                                className="elder-touch-target px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 font-medium text-xs transition-colors border border-slate-200 hover:border-rose-200"
                              >
                                {t.markSkip}
                              </button>
                            </>
                          ) : (
                            <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                              ✓ Completed
                            </span>
                          )}

                          {/* Expand Doctor Guidance Accordion */}
                          <button
                            onClick={() => setExpandedInfoDoseId(isExpanded ? null : dose.id)}
                            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                            title="View Doctor’s Instructions & Missed-Dose Advice"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Doctor Missed-Dose Guidance (PRD MED-9, Innovation 3) */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-slate-100 text-xs bg-slate-50/80 p-3.5 rounded-xl space-y-2 animate-in fade-in">
                          <div className="flex items-start space-x-2 text-slate-700">
                            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold text-slate-900">Doctor-Entered Missed Dose Advice:</p>
                              <p className="text-slate-600 mt-0.5">{dose.doctorMissedInstruction}</p>
                              <p className="text-[11px] text-slate-400 mt-1 italic">
                                Sourced from prescribing doctor&apos;s chart. CareCircle does not alter medical guidance.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Skip Dose Modal with Reason (PRD MED-5, ADH-4) */}
      {skipModalDoseId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Record Skipped Dose</h3>
              <p className="text-sm text-slate-500 mt-1">
                Recording the reason helps your doctor and family identify patterns in the Adherence & Insights view.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Reason for Skipping:
              </label>
              {[
                { value: 'forgot', label: 'Forgot or distracted' },
                { value: 'felt_unwell', label: 'Felt unwell / Nausea' },
                { value: 'side_effect', label: 'Concerned about side effects' },
                { value: 'ran_out', label: 'Medicine ran out / No refill' },
                { value: 'sleeping', label: 'Asleep during scheduled time' },
                { value: 'doctor_advised', label: 'Doctor or pharmacist advised to skip' },
                { value: 'other', label: 'Other personal reason' },
              ].map((r) => (
                <label
                  key={r.value}
                  className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedSkipReason === r.value
                      ? 'bg-emerald-50 border-emerald-500 font-bold text-emerald-950'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="skipReason"
                    value={r.value}
                    checked={selectedSkipReason === r.value}
                    onChange={() => setSelectedSkipReason(r.value as MissedReason)}
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm">{r.label}</span>
                </label>
              ))}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Optional Note for Circle:
              </label>
              <textarea
                value={skipNotes}
                onChange={(e) => setSkipNotes(e.target.value)}
                placeholder="e.g. Taking it after dinner instead, or doctor requested a pause..."
                rows={2}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setSkipModalDoseId(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSkip}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm shadow-md"
              >
                Save Skipped Dose
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

