import React from 'react';
import { useCare } from '../context/useCare';
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Pill,
  CheckSquare,
  ArrowRight,
  AlertCircle,
  Heart,
  Plus,
} from 'lucide-react';

interface CareDashboardProps {
  onNavigateToMeds: () => void;
  onNavigateToAppointments: () => void;
  onNavigateToTasks: () => void;
  onNavigateToCircle: () => void;
  onOpenAddMedModal: () => void;
}

export const CareDashboard: React.FC<CareDashboardProps> = ({
  onNavigateToMeds,
  onNavigateToAppointments,
  onNavigateToTasks,
  onOpenAddMedModal,
}) => {
  const {
    profile,
    medications,
    doses,
    appointments,
    careNotes,
    careTasks,
    currentMember,
    volunteerForAppointment,
    claimTask,
  } = useCare();

  // Exceptions calculation (PRD: Put exceptions first)
  const lowStockMeds = medications.filter(
    (m) => m.status === 'active' && m.supplyCount <= m.refillThresholdDays
  );

  const urgentAppointments = appointments.filter(
    (a) => a.status === 'upcoming' && !a.accompanyingPerson
  );

  const missedDoses = doses.filter((d) => d.status === 'missed');

  const takenCount = doses.filter((d) => d.status === 'taken' || d.status === 'late').length;
  const totalCount = doses.length;
  const adherencePercent = totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 100;

  // Caregiver burnout prevention insight (PRD Innovation 7: Meena load check)
  const meenaHandledTasksCount = careTasks.filter((t) => t.assignedTo === 'Meena Sharma').length;

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Welcome & Routine Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Care Dashboard
            </h2>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>Routine Active</span>
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Care overview for <strong>{profile.elderName}</strong> • Logged in as <strong>{currentMember.name}</strong> ({currentMember.relationship})
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenAddMedModal}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Medication</span>
          </button>
        </div>
      </div>

      {/* SECTION: Exceptions First (PRD 19.4: "Put exceptions first. Anything needing action appears at the top") */}
      {(lowStockMeds.length > 0 || urgentAppointments.length > 0 || missedDoses.length > 0) && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center space-x-1.5">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>Action Required (Exceptions)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Low Supply Alert Cards */}
            {lowStockMeds.map((med) => (
              <div
                key={med.id}
                className="bg-amber-50 rounded-2xl p-4 border-2 border-amber-300 shadow-sm flex items-start justify-between gap-3"
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-amber-500 text-white shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md">
                      Low Supply Refill Needed
                    </span>
                    <h4 className="text-base font-extrabold text-slate-900 mt-1">
                      {med.name} {med.strength}
                    </h4>
                    <p className="text-xs text-amber-950 mt-0.5 font-medium">
                      Only <strong>{med.supplyCount} pills left</strong> (~{Math.ceil(med.supplyCount / med.dailyDoseCount)} days remaining).
                    </p>
                  </div>
                </div>

                <button
                  onClick={onNavigateToMeds}
                  className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shrink-0 transition-colors shadow-sm"
                >
                  Order Refill
                </button>
              </div>
            ))}

            {/* Unassigned Companion Alerts */}
            {urgentAppointments.map((apt) => (
              <div
                key={apt.id}
                className="bg-rose-50 rounded-2xl p-4 border-2 border-rose-300 shadow-sm flex items-start justify-between gap-3"
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-rose-500 text-white shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-rose-900 bg-rose-200/80 px-2 py-0.5 rounded-md">
                      Needs Accompanying Person
                    </span>
                    <h4 className="text-base font-extrabold text-slate-900 mt-1">
                      {apt.doctor} ({apt.specialty})
                    </h4>
                    <p className="text-xs text-rose-950 mt-0.5 font-medium">
                      Consultation scheduled on {new Date(apt.datetime).toLocaleDateString()}. No companion assigned yet.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => volunteerForAppointment(apt.id)}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shrink-0 transition-colors shadow-sm"
                >
                  I Will Accompany
                </button>
              </div>
            ))}

          </div>
        </div>
      )}

      {/* Traffic-Light Status & Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Today's Adherence */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today&apos;s Adherence</p>
            <div className="flex items-baseline space-x-2 mt-2">
              <span className="text-3xl font-extrabold text-slate-900">{adherencePercent}%</span>
              <span className="text-xs font-bold text-emerald-600">On Track</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{takenCount} of {totalCount} doses taken</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2: Active Prescriptions */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Medications</p>
            <div className="flex items-baseline space-x-2 mt-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {medications.filter((m) => m.status === 'active').length}
              </span>
              <span className="text-xs font-semibold text-slate-400">Total</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Managed across 4 daily slots</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
            <Pill className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3: Upcoming Visits */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Doctor Visits</p>
            <div className="flex items-baseline space-x-2 mt-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {appointments.filter((a) => a.status === 'upcoming').length}
              </span>
              <span className="text-xs font-semibold text-blue-600">Scheduled</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Next: Dr. Kulkarni (Cardiology)</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4: Care Tasks */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Care Tasks</p>
            <div className="flex items-baseline space-x-2 mt-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {careTasks.filter((t) => t.status !== 'completed').length}
              </span>
              <span className="text-xs font-semibold text-amber-600">Pending</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Shared among Circle members</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
            <CheckSquare className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Caregiver Burnout Nudge (PRD Innovation 7: "Caregiver wellbeing nudges") */}
      {meenaHandledTasksCount >= 2 && (
        <div className="bg-gradient-to-r from-teal-50 via-emerald-50 to-sky-50 rounded-2xl p-5 border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-teal-950">
                Caregiver Wellbeing Nudge: Fair-Share Collaboration
              </h4>
              <p className="text-xs text-teal-800 mt-0.5">
                Meena has completed the majority of recent daily tasks. Rohan or Sunita can claim the upcoming clinic run to keep care balanced and prevent burnout!
              </p>
            </div>
          </div>
          <button
            onClick={onNavigateToTasks}
            className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shrink-0 transition-colors"
          >
            Review Task Board
          </button>
        </div>
      )}

      {/* Two Column Layout: Today's Schedule Overview & Next Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Today's Doses Summary */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-slate-900">Today&apos;s Medicine Timeline</h3>
            <button
              onClick={onNavigateToMeds}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
            >
              <span>Manage Doses</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {doses.slice(0, 4).map((dose) => (
              <div
                key={dose.id}
                className="p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 text-xs font-bold"
                    style={{ backgroundColor: dose.colorTag }}
                  >
                    <Pill className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {dose.medicationName} {dose.strength}
                    </p>
                    <p className="text-xs text-slate-500">
                      {dose.scheduledTime} • {dose.foodInstruction.replace('_', ' ')}
                    </p>
                  </div>
                </div>

                <div>
                  {dose.status === 'taken' ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      ✓ Taken {dose.loggedBy ? `by ${dose.loggedBy.split(' ')[0]}` : ''}
                    </span>
                  ) : dose.status === 'due' ? (
                    <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full animate-pulse">
                      Due Now
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-slate-400">
                      Upcoming
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Upcoming Doctor Appointments */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-slate-900">Upcoming Consultations</h3>
            <button
              onClick={onNavigateToAppointments}
              className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{apt.doctor}</h4>
                    <p className="text-xs font-semibold text-blue-700">{apt.specialty}</p>
                    <p className="text-xs text-slate-500 mt-1">📍 {apt.location}</p>
                  </div>
                  <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2.5 py-1 rounded-lg">
                    {new Date(apt.datetime).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    Companion:{' '}
                    <strong className={apt.accompanyingPerson ? 'text-slate-900' : 'text-rose-600'}>
                      {apt.accompanyingPerson || 'None assigned yet'}
                    </strong>
                  </span>
                  {!apt.accompanyingPerson && (
                    <button
                      onClick={() => volunteerForAppointment(apt.id)}
                      className="text-xs font-bold text-rose-700 hover:underline"
                    >
                      Volunteer
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Shared Care Notes & Task Board Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Shared Care Notes */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-slate-900">Recent Care Notes</h3>
            <button
              onClick={onNavigateToTasks}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
            >
              Add Note
            </button>
          </div>

          <div className="space-y-3">
            {careNotes.slice(0, 3).map((note) => (
              <div key={note.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-bold text-slate-700">{note.authorName}</span>
                  <span>{new Date(note.date).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-slate-800">{note.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Care Tasks */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-slate-900">Circle To-Dos</h3>
            <button
              onClick={onNavigateToTasks}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
            >
              Manage Tasks
            </button>
          </div>

          <div className="space-y-3">
            {careTasks.slice(0, 3).map((task) => (
              <div
                key={task.id}
                className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between gap-3"
              >
                <div>
                  <p className="text-sm font-bold text-slate-900">{task.title}</p>
                  <p className="text-xs text-slate-500">
                    Due: {task.dueDate} • Assigned to: <strong>{task.assignedTo || 'Unclaimed'}</strong>
                  </p>
                </div>
                {!task.assignedTo && (
                  <button
                    onClick={() => claimTask(task.id)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs font-bold hover:bg-emerald-100"
                  >
                    Claim
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

