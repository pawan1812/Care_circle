import React, { useState } from 'react';
import { useCare } from '../context/useCare';
import {
  Pill,
  Search,
  Plus,
  Printer,
  ChevronRight,
} from 'lucide-react';
import { Medication } from '../types';

interface MedicationsListProps {
  onOpenAddModal: () => void;
  onSelectMedication: (med: Medication) => void;
}

export const MedicationsList: React.FC<MedicationsListProps> = ({
  onOpenAddModal,
  onSelectMedication,
}) => {
  const {
    medications,
    updateMedication,
    discontinueMedication,
    t,
  } = useCare();

  const [activeTab, setActiveTab] = useState<'active' | 'paused' | 'discontinued'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [discontinueModalMedId, setDiscontinueModalMedId] = useState<string | null>(null);
  const [discontinueReason, setDiscontinueReason] = useState('');

  const filteredMeds = medications
    .filter((m) => m.status === activeTab)
    .filter(
      (m) =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.genericName && m.genericName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        m.prescribingDoctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.purpose.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleConfirmDiscontinue = () => {
    if (discontinueModalMedId && discontinueReason.trim()) {
      discontinueMedication(discontinueModalMedId, discontinueReason.trim());
      setDiscontinueModalMedId(null);
      setDiscontinueReason('');
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-6 animate-in fade-in duration-300">
      
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Medications List
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Complete schedule, dosing rules, and refill forecasts. Changes are permanently audited.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors"
            title="Print doctor prescription list"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">Print Schedule</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Medication</span>
          </button>
        </div>
      </div>

      {/* Tabs & Search Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Status Tabs */}
        <div className="flex items-center space-x-1 p-1 rounded-2xl bg-slate-100 border border-slate-200 w-fit">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'active'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active ({medications.filter((m) => m.status === 'active').length})
          </button>

          <button
            onClick={() => setActiveTab('paused')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'paused'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Paused ({medications.filter((m) => m.status === 'paused').length})
          </button>

          <button
            onClick={() => setActiveTab('discontinued')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'discontinued'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Discontinued ({medications.filter((m) => m.status === 'discontinued').length})
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search medicine, doctor, purpose..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Medication Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMeds.map((med) => {
          const isLowStock = med.supplyCount <= med.refillThresholdDays;
          const daysLeft = Math.ceil(med.supplyCount / (med.dailyDoseCount || 1));

          return (
            <div
              key={med.id}
              className="bg-white rounded-2xl p-5 border-2 border-slate-200 hover:border-emerald-300 transition-all shadow-sm flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Top Row: Pill icon, Name, Strength, Refill badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start space-x-3.5">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 font-bold shadow-sm"
                      style={{ backgroundColor: med.colorTag }}
                    >
                      <Pill className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900">{med.name}</h3>
                      <p className="text-sm font-bold text-emerald-700">
                        {med.strength} • {med.dose} ({med.form})
                      </p>
                      {med.genericName && (
                        <p className="text-xs text-slate-400 italic">{med.genericName}</p>
                      )}
                    </div>
                  </div>

                  {/* Refill Supply Badge */}
                  {med.status === 'active' && (
                    <div
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold border shrink-0 text-right ${
                        isLowStock
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <p>{med.supplyCount} pills</p>
                      <p className="text-[10px] font-semibold">{daysLeft} days left</p>
                    </div>
                  )}
                </div>

                {/* Details Section */}
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="font-semibold">Schedule:</span>
                    <span className="font-bold text-slate-800">
                      {med.frequency} • {med.exactTimes.join(', ')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="font-semibold">Instructions:</span>
                    <span className="font-bold text-slate-800">
                      {t[med.foodInstruction as keyof typeof t] || med.foodInstruction.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="font-semibold">Doctor:</span>
                    <span className="font-bold text-slate-800">{med.prescribingDoctor}</span>
                  </div>

                  {med.discontinuedReason && (
                    <div className="bg-rose-50 p-2.5 rounded-xl border border-rose-200 text-rose-800 font-medium">
                      Discontinue reason: &ldquo;{med.discontinuedReason}&rdquo;
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onSelectMedication(med)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
                >
                  <span>History & Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center space-x-2">
                  {med.status === 'active' && (
                    <>
                      <button
                        onClick={() => updateMedication(med.id, { status: 'paused', pausedReason: 'Paused by circle' })}
                        className="px-2.5 py-1 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs font-medium"
                      >
                        Pause
                      </button>
                      <button
                        onClick={() => {
                          setDiscontinueModalMedId(med.id);
                          setDiscontinueReason('');
                        }}
                        className="px-2.5 py-1 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-medium"
                      >
                        Discontinue
                      </button>
                    </>
                  )}

                  {med.status === 'paused' && (
                    <button
                      onClick={() => updateMedication(med.id, { status: 'active' })}
                      className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                    >
                      Resume
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredMeds.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <Pill className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No {activeTab} medications found</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            {activeTab === 'active'
              ? 'Click the "Add Medication" button above to add a new prescription schedule.'
              : 'Prescription history will be displayed here whenever medicines are paused or discontinued.'}
          </p>
        </div>
      )}

      {/* Discontinue Modal (PRD MED-3: "Never silently overwritten or deleted") */}
      {discontinueModalMedId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Discontinue Medication</h3>
              <p className="text-sm text-slate-500 mt-1">
                To preserve patient safety, medications are never deleted. They are archived with a clinical reason so your doctor can review past treatments.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Reason for Discontinuation:
              </label>
              <textarea
                value={discontinueReason}
                onChange={(e) => setDiscontinueReason(e.target.value)}
                placeholder="e.g. Doctor changed dosage to Telmisartan, course completed, or side effects noted..."
                rows={3}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setDiscontinueModalMedId(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                disabled={!discontinueReason.trim()}
                onClick={handleConfirmDiscontinue}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-sm shadow-md"
              >
                Confirm Discontinuation
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

