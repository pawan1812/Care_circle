import React, { useState } from 'react';
import { useCare } from '../context/useCare';
import {
  Pill,
  Calendar,
  CheckCircle2,
  Clock,
  Volume2,
  Smile,
  Meh,
  Frown,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const ElderHome: React.FC<{ onNavigateToMeds: () => void; onNavigateToAppointments: () => void }> = ({
  onNavigateToMeds,
  onNavigateToAppointments,
}) => {
  const {
    profile,
    doses,
    appointments,
    logDose,
    speakText,
    t,
    addCareNote,
    showToast,
  } = useCare();

  const [feelingLogged, setFeelingLogged] = useState<string | null>(null);

  // Find the next upcoming or due dose
  const nextDose = doses.find((d) => d.status === 'due') || doses.find((d) => d.status === 'upcoming');
  const remainingTodayCount = doses.filter((d) => d.status === 'due' || d.status === 'upcoming').length;
  const nextAppointment = appointments.find((a) => a.status === 'upcoming');

  const handleFeelingCheckIn = (feeling: 'good' | 'okay' | 'unwell') => {
    setFeelingLogged(feeling);
    const feelingText =
      feeling === 'good' ? 'Feeling Good & Active 😊' : feeling === 'okay' ? 'Feeling Okay 😐' : 'Feeling Unwell or Fatigued 🙁';
    addCareNote(`Savitri checked in: ${feelingText}`, 'mood');
    showToast(`Checked in: ${feelingText}. Your circle has been gently notified.`, 'success');
    speakText(`Thank you Savitri. Your circle knows you are ${feelingText}. Take good care.`);
  };

  const handleReadSchedule = () => {
    const text = remainingTodayCount > 0
      ? `Hello Savitri. You have ${remainingTodayCount} medicine ${remainingTodayCount === 1 ? 'dose' : 'doses'} remaining today. Your next medicine is ${nextDose?.medicationName} ${nextDose?.strength} at ${nextDose?.scheduledTime}. ${nextDose?.foodInstruction.replace('_', ' ')}.`
      : `Hello Savitri. Wonderful news! You have taken all your scheduled medicines for today. Next doctor appointment is with ${nextAppointment?.doctor} on ${new Date(nextAppointment?.datetime || '').toLocaleDateString()}.`;
    speakText(text);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 space-y-8 animate-in fade-in duration-300">
      
      {/* Warm Elder Header & Voice Reader */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 text-emerald-100 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.elderMode}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t.welcomeBack}, {profile.elderName.split(' ')[0]}!
            </h2>
            <p className="text-emerald-100 mt-1 text-base sm:text-lg">
              {remainingTodayCount === 0
                ? t.allDoneToday
                : `You have ${remainingTodayCount} ${remainingTodayCount === 1 ? 'dose' : 'doses'} scheduled for today.`}
            </p>
          </div>

          <button
            onClick={handleReadSchedule}
            className="elder-touch-target self-start sm:self-center flex items-center space-x-3 px-5 py-3 rounded-2xl bg-white text-emerald-900 font-bold hover:bg-emerald-50 transition-all shadow-md active:scale-95 shrink-0"
            title="Read schedule aloud"
          >
            <Volume2 className="w-6 h-6 text-emerald-700" />
            <span className="text-base">{t.readAloud}</span>
          </button>
        </div>
      </div>

      {/* Gentle Daily Check-In (PRD ELD-7) */}
      <div className="bg-white rounded-3xl p-6 border-2 border-emerald-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-2">{t.feelingPrompt}</h3>
        <p className="text-sm text-slate-500 mb-4">
          A quick tap lets Meena and Rohan know how you are feeling without intrusive calls.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => handleFeelingCheckIn('good')}
            className={`elder-touch-target p-4 rounded-2xl border-2 flex items-center justify-center space-x-3 transition-all ${
              feelingLogged === 'good'
                ? 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold ring-2 ring-emerald-400'
                : 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 text-slate-700'
            }`}
          >
            <Smile className="w-7 h-7 text-emerald-600 shrink-0" />
            <span className="text-base font-semibold">{t.good}</span>
          </button>

          <button
            onClick={() => handleFeelingCheckIn('okay')}
            className={`elder-touch-target p-4 rounded-2xl border-2 flex items-center justify-center space-x-3 transition-all ${
              feelingLogged === 'okay'
                ? 'bg-amber-100 border-amber-500 text-amber-900 font-bold ring-2 ring-amber-400'
                : 'border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 text-slate-700'
            }`}
          >
            <Meh className="w-7 h-7 text-amber-600 shrink-0" />
            <span className="text-base font-semibold">{t.okay}</span>
          </button>

          <button
            onClick={() => handleFeelingCheckIn('unwell')}
            className={`elder-touch-target p-4 rounded-2xl border-2 flex items-center justify-center space-x-3 transition-all ${
              feelingLogged === 'unwell'
                ? 'bg-rose-100 border-rose-500 text-rose-900 font-bold ring-2 ring-rose-400'
                : 'border-slate-200 hover:border-rose-300 hover:bg-rose-50/50 text-slate-700'
            }`}
          >
            <Frown className="w-7 h-7 text-rose-600 shrink-0" />
            <span className="text-base font-semibold">{t.unwell}</span>
          </button>
        </div>
      </div>

      {/* BLOCK 1: Next Medicine (Giant Take Button - ELD-1) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            {t.nextMedicine}
          </span>
          {nextDose && (
            <span className="flex items-center space-x-1.5 text-sm font-bold text-slate-600">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>{nextDose.scheduledTime}</span>
            </span>
          )}
        </div>

        {nextDose ? (
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm"
                style={{ backgroundColor: nextDose.colorTag || '#059669' }}
              >
                <Pill className="w-9 h-9" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {nextDose.medicationName}
                </h4>
                <p className="text-lg font-bold text-emerald-700 mt-0.5">
                  {nextDose.strength} • 1 {nextDose.form}
                </p>
                <p className="text-sm font-medium text-slate-600 mt-2 bg-slate-100 p-2.5 rounded-xl border border-slate-200">
                  📌 {t[nextDose.foodInstruction as keyof typeof t] || nextDose.foodInstruction.replace('_', ' ')}
                </p>
              </div>
            </div>

            {/* Giant 1-Tap Taken Action */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => logDose(nextDose.id, 'taken')}
                className="elder-touch-target flex items-center justify-center space-x-3 w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-extrabold text-xl shadow-lg shadow-emerald-600/30 transition-all"
              >
                <CheckCircle2 className="w-7 h-7" />
                <span>{t.logTaken}</span>
              </button>

              <button
                onClick={() => logDose(nextDose.id, 'skipped', 'forgot')}
                className="elder-touch-target flex items-center justify-center space-x-2 w-full py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-700 font-bold text-base transition-colors border border-slate-300"
              >
                <span>{t.markSkip}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
            <h4 className="text-2xl font-bold text-slate-800">{t.allDoneToday}</h4>
            <p className="text-slate-500 max-w-md mx-auto">
              You are on track with your doctor’s prescribed care routine. Rest well!
            </p>
          </div>
        )}
      </div>

      {/* BLOCK 2: Today's Remaining Schedule (ELD-1) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {t.todaySchedule}
          </h3>
          <button
            onClick={onNavigateToMeds}
            className="flex items-center space-x-1 text-sm font-bold text-emerald-700 hover:text-emerald-800"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {doses.map((dose) => {
            const isTaken = dose.status === 'taken';
            return (
              <div
                key={dose.id}
                className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
                  isTaken
                    ? 'bg-slate-50/80 border-slate-200 opacity-75'
                    : dose.status === 'due'
                    ? 'bg-amber-50/60 border-amber-300 ring-2 ring-amber-200'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 font-bold text-xs"
                    style={{ backgroundColor: dose.colorTag }}
                  >
                    <Pill className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className={`text-base font-bold ${isTaken ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                        {dose.medicationName} {dose.strength}
                      </p>
                      {isTaken && (
                        <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                          ✓ Taken
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">
                      Scheduled: <strong>{dose.scheduledTime}</strong> • {dose.timeOfDay}
                    </p>
                  </div>
                </div>

                {!isTaken && (
                  <button
                    onClick={() => logDose(dose.id, 'taken')}
                    className="elder-touch-target px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shrink-0 transition-colors shadow-sm"
                  >
                    {t.markTaken}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* BLOCK 3: Next Doctor Visit (ELD-1) */}
      {nextAppointment && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
              {t.nextAppointment}
            </span>
            <button
              onClick={onNavigateToAppointments}
              className="flex items-center space-x-1 text-sm font-bold text-blue-700 hover:text-blue-800"
            >
              <span>Calendar</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200">
              <Calendar className="w-7 h-7" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xl font-bold text-slate-900">{nextAppointment.doctor}</h4>
              <p className="text-sm font-semibold text-blue-800">{nextAppointment.specialty}</p>
              <p className="text-xs text-slate-500 mt-1">
                📍 {nextAppointment.location}
              </p>
              <div className="mt-3 inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                <span>Accompanied by:</span>
                <strong className="text-slate-900">
                  {nextAppointment.accompanyingPerson || 'Family companion to be confirmed'}
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

