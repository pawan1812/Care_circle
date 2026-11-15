import React, { useState } from 'react';
import { Mail, Clock, CheckCircle2, AlertCircle, PhoneCall, ChevronRight, Sparkles } from 'lucide-react';

export const DayWithCareCircleStory: React.FC = () => {
  const [activeAct, setActiveAct] = useState<1 | 2 | 3>(1);
  const [act1Taken, setAct1Taken] = useState(false);
  const [escalationStep, setEscalationStep] = useState<1 | 2 | 3>(2);

  return (
    <div className="space-y-8" id="how-it-works">
      {/* Section Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 text-amber-900 text-xs font-bold border border-amber-300">
          <Clock className="w-3.5 h-3.5 text-amber-700" />
          <span>A Typical Day With CareCircle</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
          How CareCircle Works in 3 Daily Acts
        </h2>
        <p className="text-base text-slate-600">
          From the first morning cup of tea to a restful night&apos;s sleep, see how our quiet, dignified system protects seniors and reassures families.
        </p>
      </div>

      {/* Act Selection Tabs */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 max-w-xl mx-auto">
        {[
          { act: 1 as const, time: '8:00 AM', label: '1. The 1-Tap Routine' },
          { act: 2 as const, time: '1:30 PM', label: '2. Gentle Escalation' },
          { act: 3 as const, time: '8:30 PM', label: '3. Evening Peace' },
        ].map((item) => (
          <button
            key={item.act}
            type="button"
            onClick={() => setActiveAct(item.act)}
            className={`flex-1 py-3 px-3 rounded-2xl text-xs sm:text-sm font-bold transition-all border text-center cursor-pointer ${
              activeAct === item.act
                ? 'bg-emerald-800 text-white border-emerald-900 shadow-lg scale-102'
                : 'bg-white/80 hover:bg-white text-slate-700 border-slate-200 shadow-xs'
            }`}
          >
            <div className="text-[11px] opacity-80 uppercase tracking-wider">{item.time}</div>
            <div className="truncate">{item.label}</div>
          </button>
        ))}
      </div>

      {/* Main Interactive Stage */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/70 shadow-2xl max-w-4xl mx-auto min-h-[380px] flex items-center justify-center transition-all">
        {/* ACT 1: 8:00 AM - Email Reminder with 1-Tap Taken */}
        {activeAct === 1 && (
          <div className="w-full space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  Act 1 • 8:00 AM Morning Tea & Routine
                </span>
                <h3 className="font-serif text-2xl font-bold text-slate-900 mt-0.5">
                  An email arrives in mom&apos;s inbox. One tap is all it takes.
                </h3>
              </div>
              <div className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                Simulated 1-Tap Signed Action Token
              </div>
            </div>

            {/* Email UI Mockup */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md max-w-xl mx-auto space-y-4">
              <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 text-xs text-slate-500">
                <Mail className="w-4 h-4 text-emerald-600" />
                <span>From: <strong>reminders@carecircle.health</strong></span>
                <span>•</span>
                <span>To: <strong>savitri.sharma@example.com</strong></span>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-base">
                  Good Morning, Savitri! Time for your 8:00 AM tablets
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  1. Metformin 500 mg (After breakfast) • 2. Amlodipine 5 mg
                </p>
              </div>

              {/* 1-Tap Action Button */}
              {!act1Taken ? (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setAct1Taken(true)}
                    className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2 active:scale-98 cursor-pointer"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>✓ Tap Here: I Have Taken My Tablets</span>
                  </button>
                  <p className="text-center text-[11px] text-slate-500 mt-2">
                    Clicking this logs the dose instantly without logging in.
                  </p>
                </div>
              ) : (
                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 text-center space-y-2 animate-in zoom-in-95">
                  <div className="inline-flex items-center space-x-2 text-emerald-800 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Logged at 8:02 AM • Thank you, Savitri!</span>
                  </div>
                  <p className="text-xs text-emerald-700">
                    Meena and Rohan&apos;s circles were quietly updated. No phone calls needed.
                  </p>
                  <button
                    type="button"
                    onClick={() => setAct1Taken(false)}
                    className="text-xs text-slate-500 underline hover:text-slate-700"
                  >
                    Reset demo
                  </button>
                </div>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-600 text-center max-w-xl mx-auto">
              Elders don&apos;t have to navigate confusing app stores or complex passwords. If they can open an email or tap a message, they can use CareCircle.
            </p>
          </div>
        )}

        {/* ACT 2: 1:30 PM - Missed Dose & Gentle Escalation Ladder */}
        {activeAct === 2 && (
          <div className="w-full space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                  Act 2 • 1:30 PM Missed Afternoon Dose
                </span>
                <h3 className="font-serif text-2xl font-bold text-slate-900 mt-0.5">
                  The Gentle Escalation Ladder (No Alarm Fatigue)
                </h3>
              </div>
              <div className="text-xs text-slate-500 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 font-medium">
                Stage {escalationStep} of 3
              </div>
            </div>

            {/* Visual Escalation Ladder */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Step 1: 15m Grace Period */}
              <div
                onClick={() => setEscalationStep(1)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  escalationStep === 1
                    ? 'bg-amber-50/90 border-amber-400 ring-2 ring-amber-200 shadow-md'
                    : 'bg-white/70 border-slate-200 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase text-slate-500">Stage 1 (0-15m)</span>
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Quiet Grace Window</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Gentle soft chime sent to Savitri only. No notifications sent to family to avoid false alarms.
                </p>
              </div>

              {/* Step 2: Primary Caretaker Nudge */}
              <div
                onClick={() => setEscalationStep(2)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  escalationStep === 2
                    ? 'bg-amber-50/90 border-amber-400 ring-2 ring-amber-200 shadow-md'
                    : 'bg-white/70 border-slate-200 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase text-amber-700">Stage 2 (30m)</span>
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Primary Caregiver Nudge</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Meena receives a calm email: <em>&ldquo;Savitri hasn&apos;t logged lunch tablet. Check in when convenient.&rdquo;</em>
                </p>
              </div>

              {/* Step 3: Remote Family Escalation */}
              <div
                onClick={() => setEscalationStep(3)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  escalationStep === 3
                    ? 'bg-rose-50/90 border-rose-400 ring-2 ring-rose-200 shadow-md'
                    : 'bg-white/70 border-slate-200 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase text-rose-700">Stage 3 (60m+)</span>
                  <PhoneCall className="w-4 h-4 text-rose-600" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Remote Family Alert</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Only if unaddressed after 1 hour, Rohan in Bengaluru is notified so someone can make a friendly call.
                </p>
              </div>
            </div>

            <div className="bg-slate-100/80 rounded-2xl p-4 text-xs text-slate-600 flex items-center justify-between">
              <span>
                💡 <strong>Why this matters:</strong> Loud alarms cause elderly anxiety and caregiver fatigue. Gentle staged escalation solves 98% of delays before family worries.
              </span>
              <button
                type="button"
                onClick={() => setEscalationStep((prev) => (prev === 3 ? 1 : ((prev + 1) as any)))}
                className="text-xs font-bold text-emerald-800 flex items-center space-x-1 hover:underline ml-4 flex-shrink-0"
              >
                <span>Next Stage</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ACT 3: 8:30 PM - Calm Green Dashboard */}
        {activeAct === 3 && (
          <div className="w-full space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  Act 3 • 8:30 PM Evening Calm
                </span>
                <h3 className="font-serif text-2xl font-bold text-slate-900 mt-0.5">
                  The Family Dashboard Settles to Serene Green
                </h3>
              </div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>100% Daily Adherence</span>
              </div>
            </div>

            {/* Calm Green Dashboard Mock */}
            <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl max-w-xl mx-auto space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-xl font-bold">Savitri Sharma • Daily Summary</h4>
                  <p className="text-xs text-emerald-300 mt-0.5">All 4 daily dose windows confirmed</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-800/80 flex items-center justify-center text-emerald-200 font-extrabold text-lg">
                  ✓
                </div>
              </div>

              {/* 4 Doses confirmed checklist */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                  <span className="text-emerald-300 font-bold block">Morning (08:00)</span>
                  <span className="text-white">Metformin • Taken 8:02 AM</span>
                </div>
                <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                  <span className="text-emerald-300 font-bold block">Afternoon (13:00)</span>
                  <span className="text-white">Shelcal 500 • Taken 1:45 PM</span>
                </div>
                <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                  <span className="text-emerald-300 font-bold block">Evening (18:30)</span>
                  <span className="text-white">Telmisartan • Taken 6:35 PM</span>
                </div>
                <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                  <span className="text-emerald-300 font-bold block">Night (21:00)</span>
                  <span className="text-white">Glimepiride • Taken 8:30 PM</span>
                </div>
              </div>

              <div className="pt-2 text-center text-xs text-emerald-200 font-medium">
                Rohan in Bengaluru and Meena in Pune see this green status. No urgent calls. Everyone sleeps soundly.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

