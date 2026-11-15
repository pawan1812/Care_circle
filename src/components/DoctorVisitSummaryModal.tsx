import React, { useState } from 'react';
import { useCare } from '../context/useCare';
import {
  X,
  Printer,
} from 'lucide-react';

interface DoctorVisitSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DoctorVisitSummaryModal: React.FC<DoctorVisitSummaryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { profile, medications, careNotes, doctors } = useCare();
  const [includeVitals, setIncludeVitals] = useState(true);
  const [includeQuestions, setIncludeQuestions] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(() => profile.primaryDoctorName || 'Dr. Vikram Kulkarni');

  const [generatedDateStr] = useState(
    () => new Date().toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })
  );

  if (!isOpen) return null;

  const activeMeds = medications.filter((m) => m.status === 'active');
  const vitalNotes = careNotes.filter((n) => n.category === 'vital');

  const questionsForDoctor = [
    'Should we adjust the evening timing of Metformin 500 mg with dinner rather than bedtime to reduce missed doses?',
    'Savitri experienced mild right knee stiffness in the morning. Is any additional joint supplement or physio needed?',
    'Review blood pressure readings: average 128/82 mmHg over the past 2 weeks.',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-10 space-y-6 animate-in zoom-in-95 my-6">
        
        {/* Modal Controls Bar (Hidden during print) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 no-print gap-4">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">
              Doctor Visit Clinical Summary
            </h3>
            <p className="text-xs text-slate-500">
              1-Page clinician-friendly report ready for consultation with <strong>{selectedDoctor}</strong>
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-600">
              <div className="flex items-center space-x-1.5">
                <span className="font-semibold text-slate-700">Target Specialist:</span>
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="p-1 rounded-lg border border-slate-300 text-xs bg-slate-50 font-medium"
                >
                  <option value={profile.primaryDoctorName}>{profile.primaryDoctorName}</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name} ({d.specialty})
                    </option>
                  ))}
                </select>
              </div>
              <label className="flex items-center space-x-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeVitals}
                  onChange={(e) => setIncludeVitals(e.target.checked)}
                  className="rounded text-emerald-600"
                />
                <span>Include Vitals</span>
              </label>
              <label className="flex items-center space-x-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeQuestions}
                  onChange={(e) => setIncludeQuestions(e.target.checked)}
                  className="rounded text-emerald-600"
                />
                <span>Include Consultation Questions</span>
              </label>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.print()}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE CLINICAL DOCUMENT CONTENT */}
        <div className="printable-report space-y-6 text-slate-900">
          
          {/* Clinic / Platform Document Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b-2 border-slate-800 pb-4 gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl text-emerald-800 tracking-tight">CareCircle</span>
                <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold">• Healthcare Summary</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                PATIENT CONSULTATION REPORT
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Report Generated on: {generatedDateStr}
              </p>
            </div>

            {/* Patient Header Bio */}
            <div className="text-right text-xs space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200 sm:min-w-[240px]">
              <p className="font-bold text-sm text-slate-900">{profile.elderName}</p>
              <p className="text-slate-600">Age: 74 Years • Gender: {profile.gender}</p>
              <p className="text-slate-600">Blood Group: <strong>{profile.bloodGroup}</strong></p>
              <p className="text-rose-700 font-bold">Allergies: {profile.allergies.join(', ')}</p>
            </div>
          </div>

          {/* Clinician & Adherence Snapshot */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 font-bold uppercase tracking-wider block">Consulting Specialist</span>
              <p className="font-extrabold text-slate-900 mt-0.5">{selectedDoctor || profile.primaryDoctorName}</p>
              <p className="text-slate-500">{profile.hospitalPreference}</p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-emerald-800 font-bold uppercase tracking-wider block">14-Day Adherence</span>
              <p className="text-2xl font-black text-emerald-900 mt-0.5">91% Overall</p>
              <p className="text-emerald-700 font-medium">98% on-time morning timing</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 font-bold uppercase tracking-wider block">Emergency Contact</span>
              <p className="font-extrabold text-slate-900 mt-0.5">{profile.emergencyContactName}</p>
              <p className="text-slate-500">{profile.emergencyContactPhone}</p>
            </div>
          </div>

          {/* Active Medication Regimen Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200 pb-1">
              1. Current Prescribed Regimen ({activeMeds.length} Active Medications)
            </h4>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold">
                  <tr>
                    <th className="p-2.5">Medication & Strength</th>
                    <th className="p-2.5">Schedule</th>
                    <th className="p-2.5">Food Instructions</th>
                    <th className="p-2.5">Prescriber & Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {activeMeds.map((med) => (
                    <tr key={med.id} className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-900">
                        {med.name} {med.strength} ({med.form})
                      </td>
                      <td className="p-2.5 font-semibold text-slate-700">
                        {med.exactTimes.join(', ')} ({med.frequency})
                      </td>
                      <td className="p-2.5 text-slate-600">
                        {med.foodInstruction.replace('_', ' ')}
                      </td>
                      <td className="p-2.5 text-slate-600">
                        {med.prescribingDoctor} • {med.purpose}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Adherence & Missed Dose Analysis */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200 pb-1">
              2. Timing Variations & Missed Doses Summary (Last 14 Days)
            </h4>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <p className="font-medium text-slate-800">
                • <strong>Evening Doses:</strong> Metformin 500mg delayed or skipped 3 times over 10 days due to early fatigue before 8:00 PM.
              </p>
              <p className="font-medium text-slate-800">
                • <strong>Morning Doses:</strong> Glimepiride 1mg and Amlodipine 5mg taken consistently at 08:00 AM - 08:15 AM with breakfast.
              </p>
              <p className="font-medium text-slate-800">
                • <strong>PRN Paracetamol:</strong> Taken twice this week following evening walking routine.
              </p>
            </div>
          </div>

          {/* Recent Vitals & Symptom Observations */}
          {includeVitals && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200 pb-1">
                3. Recent Home Vitals & Observations
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {vitalNotes.map((note) => (
                  <div key={note.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="font-bold text-slate-800">{note.content}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Logged by {note.authorName} on {new Date(note.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Family Questions for Consultation */}
          {includeQuestions && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200 pb-1">
                4. Questions Prepared for Doctor Consultation
              </h4>
              <div className="space-y-1.5 text-xs text-slate-800">
                {questionsForDoctor.map((q, idx) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <span className="font-bold text-emerald-800">{idx + 1}.</span>
                    <span>{q}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Regulatory & Clinical Disclaimer (PRD 19.4 #20: "Include a footer that states the data is self-reported") */}
          <div className="pt-4 border-t-2 border-slate-200 text-[10px] text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <p>
              <strong>Notice for Clinician:</strong> Adherence timings and vital records in this summary are self-reported by the patient and family caregivers via CareCircle.
            </p>
            <p className="shrink-0 font-mono">
              Lilavati Cardiology OPD Ref: CC-2026-7489
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

