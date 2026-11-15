import React from 'react';
import { useCare } from '../context/useCare';
import {
  X,
  Pill,
  AlertTriangle,
  History,
  Info,
} from 'lucide-react';
import { Medication } from '../types';

interface MedicationDetailModalProps {
  medication: Medication | null;
  onClose: () => void;
}

export const MedicationDetailModal: React.FC<MedicationDetailModalProps> = ({
  medication,
  onClose,
}) => {
  const { auditLogs, t } = useCare();

  if (!medication) return null;

  const medLogs = auditLogs.filter(
    (l) => l.entity === 'Medication' && l.details.toLowerCase().includes(medication.name.toLowerCase())
  );

  const daysLeft = Math.ceil(medication.supplyCount / (medication.dailyDoseCount || 1));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6 animate-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shrink-0 font-bold shadow-md"
              style={{ backgroundColor: medication.colorTag }}
            >
              <Pill className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-2xl font-extrabold text-slate-900">{medication.name}</h3>
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {medication.status}
                </span>
              </div>
              <p className="text-sm font-bold text-emerald-700">
                {medication.strength} • {medication.dose} ({medication.form})
              </p>
              {medication.genericName && (
                <p className="text-xs text-slate-400 italic">{medication.genericName}</p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Clinical Overview Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Schedule & Times</p>
            <p className="text-sm font-bold text-slate-900">
              {medication.frequency} at {medication.exactTimes.join(', ')}
            </p>
            <p className="text-xs text-slate-600">
              {t[medication.foodInstruction as keyof typeof t] || medication.foodInstruction.replace('_', ' ')}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Supply & Refill Forecast</p>
            <p className="text-sm font-bold text-slate-900">
              {medication.supplyCount} pills remaining
            </p>
            <p className="text-xs text-slate-600">
              Estimated ~{daysLeft} days until refill needed
            </p>
          </div>
        </div>

        {/* Doctor-Entered Missed Dose Instructions (PRD Innovation 3) */}
        <div className="bg-blue-50/70 rounded-2xl p-4 border border-blue-200 space-y-2">
          <div className="flex items-center space-x-2 text-blue-900 font-bold text-sm">
            <Info className="w-4 h-4 text-blue-600" />
            <span>Doctor-Entered Missed-Dose Advice</span>
          </div>
          <p className="text-xs text-slate-800 leading-relaxed font-medium">
            &ldquo;{medication.doctorMissedInstruction}&rdquo;
          </p>
          <p className="text-[11px] text-blue-700">
            Prescribed by: <strong>{medication.prescribingDoctor}</strong>
          </p>
        </div>

        {/* Pill Description & Identification Aid (PRD Innovation 9) */}
        {medication.pillDescription && (
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Pill Identification Aid:
            </p>
            <p className="text-xs text-slate-800 font-medium">
              {medication.pillDescription}
            </p>
          </div>
        )}

        {/* Change History Audit Log (PRD 19.4: "Keep change history immutable and visible") */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center space-x-2 text-slate-800">
            <History className="w-4 h-4 text-slate-600" />
            <h4 className="text-sm font-extrabold uppercase tracking-wider">Change & Audit History</h4>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5 max-h-48 overflow-y-auto text-xs">
            {medLogs.length > 0 ? (
              medLogs.map((log) => (
                <div key={log.id} className="pb-2 border-b border-slate-200 last:border-0">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="font-bold text-slate-700">{log.actorName}</span>
                    <span>{new Date(log.timestamp).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-800 mt-0.5">{log.details}</p>
                </div>
              ))
            ) : (
              <p className="text-slate-500 italic">
                Initial prescription created on {new Date(medication.createdAt).toLocaleDateString()}. No modifications made.
              </p>
            )}
          </div>
        </div>

        {/* Safety Disclaimer (PRD 15: Medical and Legal Disclaimer) */}
        <div className="bg-amber-50 rounded-2xl p-3.5 border border-amber-200 text-amber-900 text-xs flex items-start space-x-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>
            CareCircle supports healthcare organization. It does not provide medical advice or alter dosages. Always confirm changes with Dr. Kulkarni or your licensed pharmacist.
          </p>
        </div>

        {/* Close Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800"
          >
            Close Details
          </button>
        </div>

      </div>
    </div>
  );
};

