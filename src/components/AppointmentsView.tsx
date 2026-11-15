import React, { useState } from 'react';
import { useCare } from '../context/useCare';
import {
  Clock,
  MapPin,
  Plus,
  CheckCircle2,
  Download,
  CheckSquare,
  FileText,
  X,
} from 'lucide-react';

export const AppointmentsView: React.FC = () => {
  const {
    appointments,
    addAppointment,
    volunteerForAppointment,
    toggleChecklistItem,
    saveAppointmentOutcome,
    exportAppointmentIcs,
    currentMember,
  } = useCare();

  const [now] = useState(() => Date.now());

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [outcomeModalAptId, setOutcomeModalAptId] = useState<string | null>(null);
  const [outcomeNotes, setOutcomeNotes] = useState('');

  // Add Appointment form state
  const [doctor, setDoctor] = useState('');
  const [specialty, setSpecialty] = useState('Cardiologist');
  const [location, setLocation] = useState('Lilavati Hospital, Bandra');
  const [datetime, setDatetime] = useState('');
  const [purpose, setPurpose] = useState('');
  const [phone, setPhone] = useState('+91 98220 55123');

  const handleSaveAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctor || !datetime) return;

    addAppointment({
      doctor,
      specialty,
      location,
      phone,
      datetime: new Date(datetime).toISOString(),
      purpose,
      accompanyingPerson: currentMember.role !== 'family_view' ? currentMember.name : '',
      checklist: [
        { id: `c-${Date.now()}-1`, text: 'Carry previous prescription & test files', done: true },
        { id: `c-${Date.now()}-2`, text: 'Carry CareCircle Doctor Visit Summary report', done: false },
        { id: `c-${Date.now()}-3`, text: 'Fasting 10-12 hours if blood test scheduled', done: false },
      ],
    });

    setIsAddModalOpen(false);
    setDoctor('');
    setPurpose('');
    setDatetime('');
  };

  const handleSaveOutcome = () => {
    if (outcomeModalAptId && outcomeNotes.trim()) {
      saveAppointmentOutcome(outcomeModalAptId, outcomeNotes.trim());
      setOutcomeModalAptId(null);
      setOutcomeNotes('');
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 space-y-6 animate-in fade-in duration-300">
      
      {/* Header & Add Consultation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Doctor Appointments
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Track upcoming specialist visits, pre-visit checklists, and family accompanying companions.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Visit</span>
        </button>
      </div>

      {/* Appointments List */}
      <div className="space-y-6">
        {appointments.map((apt) => {
          const aptDate = new Date(apt.datetime);
          const isUrgent =
            apt.status === 'upcoming' &&
            !apt.accompanyingPerson &&
            aptDate.getTime() - now < 48 * 60 * 60 * 1000;

          return (
            <div
              key={apt.id}
              className={`bg-white rounded-3xl p-6 sm:p-8 border-2 transition-all shadow-sm space-y-5 ${
                isUrgent
                  ? 'border-rose-300 ring-2 ring-rose-100'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                
                {/* Doctor & Location Details */}
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2.5 flex-wrap">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                      {apt.doctor}
                    </h3>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      {apt.specialty}
                    </span>
                    {apt.status === 'completed' && (
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        ✓ Completed
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>
                      {aptDate.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} at{' '}
                      {aptDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </p>

                  <p className="text-xs text-slate-500 flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{apt.location}</span>
                  </p>

                  {apt.purpose && (
                    <p className="text-xs font-medium text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-200 mt-2">
                      Purpose: <strong>{apt.purpose}</strong>
                    </p>
                  )}
                </div>

                {/* Calendar Export & Companion Badge */}
                <div className="flex flex-col sm:items-end space-y-3 shrink-0">
                  <button
                    onClick={() => exportAppointmentIcs(apt)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
                    title="Export .ics for Apple/Google Calendar"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>Add to Calendar (.ics)</span>
                  </button>

                  {/* Accompanying Person */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1 min-w-[200px]">
                    <p className="font-semibold text-slate-500">Accompanying Person:</p>
                    {apt.accompanyingPerson ? (
                      <div className="flex items-center space-x-1.5 text-emerald-800 font-extrabold text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{apt.accompanyingPerson}</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <span className="text-rose-600 font-bold block">
                          Unassigned! Companion needed
                        </span>
                        <button
                          onClick={() => volunteerForAppointment(apt.id)}
                          className="w-full py-1.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-sm"
                        >
                          I Will Accompany Savitri
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Pre-Visit Checklist (PRD APT-5) */}
              <div className="pt-3 border-t border-slate-100 space-y-2.5">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                  <span>Pre-Visit Checklist</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {apt.checklist.map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center space-x-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 cursor-pointer text-xs transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={item.done}
                        onChange={() => toggleChecklistItem(apt.id, item.id)}
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                      <span className={item.done ? 'line-through text-slate-400 font-medium' : 'text-slate-800 font-semibold'}>
                        {item.text}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Post-Visit Clinical Outcome (PRD APT-6) */}
              {apt.outcomeNotes ? (
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 space-y-1">
                  <p className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                    Doctor Visit Outcome Notes:
                  </p>
                  <p className="text-xs text-slate-800 font-medium leading-relaxed">
                    {apt.outcomeNotes}
                  </p>
                </div>
              ) : (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      setOutcomeModalAptId(apt.id);
                      setOutcomeNotes('');
                    }}
                    className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center space-x-1"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Record Visit Outcome & Doctor Notes</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Record Outcome Modal */}
      {outcomeModalAptId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Record Doctor Consultation Outcome</h3>
              <p className="text-sm text-slate-500 mt-1">
                Enter Dr. Kulkarni&apos;s observations, prescription tweaks, or next checkup recommendations.
              </p>
            </div>

            <textarea
              value={outcomeNotes}
              onChange={(e) => setOutcomeNotes(e.target.value)}
              placeholder="e.g. Blood pressure 126/80, stable. Advised to continue current medications. Follow-up in 3 months..."
              rows={4}
              className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setOutcomeModalAptId(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveOutcome}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md"
              >
                Save Outcome Notes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Visit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">Schedule Doctor Consultation</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAppointment} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Doctor Name *
                </label>
                <input
                  type="text"
                  required
                  value={doctor}
                  onChange={(e) => setDoctor(e.target.value)}
                  placeholder="e.g. Dr. V. Kulkarni"
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Specialty
                  </label>
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    placeholder="e.g. Cardiology"
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={datetime}
                    onChange={(e) => setDatetime(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Location / Clinic Address
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Lilavati Hospital, Bandra West"
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Doctor / Clinic Contact Phone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98220 55123"
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Purpose of Visit
                </label>
                <input
                  type="text"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g. Routine 3-month diabetes & blood pressure checkup"
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md"
                >
                  Schedule Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

