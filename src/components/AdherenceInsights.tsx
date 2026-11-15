import React, { useState } from 'react';
import { useCare } from '../context/useCare';
import {
  Sparkles,
  FileText,
} from 'lucide-react';

interface AdherenceInsightsProps {
  onOpenDoctorSummary: () => void;
}

export const AdherenceInsights: React.FC<AdherenceInsightsProps> = ({
  onOpenDoctorSummary,
}) => {
  const { medications } = useCare();

  // Realistic mock historical days for the heatmap
  const [days] = useState(() => {
    return Array.from({ length: 14 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (13 - i));
      const dayStr = d.toISOString().split('T')[0];
      const isToday = i === 13;
      const isMissedDay = i === 4 || i === 9; // Simulated realistic historical days
      const isLateDay = i === 2 || i === 7;
      return {
        date: dayStr,
        label: d.toLocaleDateString([], { weekday: 'narrow', month: 'numeric', day: 'numeric' }),
        status: isToday ? 'partial' : isMissedDay ? 'missed' : isLateDay ? 'late' : 'taken',
        adherenceRate: isMissedDay ? 66 : isLateDay ? 85 : 100,
      };
    });
  });

  const overallAdherence = 91;

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Headline Section */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 text-emerald-100 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Adherence & Insights Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {overallAdherence}% Adherence Rate
          </h2>
          <p className="text-emerald-100 text-base max-w-xl">
            Savitri is maintaining consistent medication timing. Morning doses show a 98% on-time record over the past 14 days.
          </p>
        </div>

        <button
          onClick={onOpenDoctorSummary}
          className="self-start md:self-center flex items-center space-x-2.5 px-5 py-3 rounded-2xl bg-white text-emerald-900 font-extrabold text-sm hover:bg-emerald-50 transition-all shadow-md active:scale-95 shrink-0"
        >
          <FileText className="w-5 h-5 text-emerald-700" />
          <span>Doctor Visit Summary (PDF)</span>
        </button>
      </div>

      {/* Pattern Intelligence (PRD 7.8 Innovation 4: "Detects time-of-day miss patterns and suggests schedule alignment") */}
      <div className="bg-amber-50 rounded-3xl p-6 border-2 border-amber-300 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-amber-900 font-bold text-base">
          <Sparkles className="w-5 h-5 text-amber-600" />
          <span>Pattern Intelligence Detected</span>
        </div>
        <p className="text-sm font-semibold text-amber-950 leading-relaxed">
          &ldquo;Evening Metformin (8:00 PM) was delayed or missed 3 times in the last 10 days, usually when Savitri was preparing for sleep early.&rdquo;
        </p>
        <div className="bg-white/80 p-3.5 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start space-x-2">
          <span className="font-extrabold uppercase tracking-wide text-amber-800 shrink-0">Recommendation:</span>
          <span>
            Consider moving the second Metformin dose to 7:30 PM immediately with dinner, rather than right before bedtime.
          </span>
        </div>
      </div>

      {/* Calendar Heatmap (PRD ADH-2) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">14-Day Calendar Heatmap</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Visual log of on-time, late, and missed medication days
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <span className="flex items-center space-x-1">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="text-slate-600">On Time</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span className="text-slate-600">Delayed</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span>
              <span className="text-slate-600">Missed</span>
            </span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="grid grid-cols-7 sm:grid-cols-14 gap-2 pt-2">
          {days.map((day) => {
            let color = 'bg-emerald-500 text-white';
            if (day.status === 'late') color = 'bg-amber-400 text-amber-950';
            if (day.status === 'missed') color = 'bg-rose-500 text-white';
            if (day.status === 'partial') color = 'bg-emerald-400 text-white border-2 border-emerald-600';

            return (
              <div
                key={day.date}
                className="flex flex-col items-center p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-center"
              >
                <span className="text-[11px] font-bold text-slate-400 uppercase">{day.label.split(',')[0]}</span>
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-xs my-1.5 shadow-sm ${color}`}
                  title={`${day.date}: ${day.adherenceRate}% adherence`}
                >
                  {day.adherenceRate}%
                </div>
                <span className="text-[10px] text-slate-500 truncate max-w-full font-medium">
                  {day.date.slice(8)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Analysis: Breakdown by Medication & Missed Reasons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Per-Medication Adherence Breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-extrabold text-slate-900">Per-Medication Adherence</h3>

          <div className="space-y-4">
            {medications.filter((m) => m.status === 'active').map((med) => {
              // Simulated medication adherence rates
              const rate = med.name === 'Glimepiride' ? 96 : med.name === 'Amlodipine' ? 95 : med.name === 'Metformin' ? 88 : 94;
              return (
                <div key={med.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-800">{med.name} ({med.strength})</span>
                    <span className="text-emerald-700">{rate}%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${rate}%`,
                        backgroundColor: rate > 90 ? '#10b981' : '#f59e0b',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Missed Dose Reasons Distribution (PRD ADH-4) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-extrabold text-slate-900">Recorded Reasons for Missed / Late Doses</h3>
          <p className="text-xs text-slate-500">
            Insights based on caregiver & elder logs over the last 30 days:
          </p>

          <div className="space-y-3">
            {[
              { reason: 'Forgot / Distracted during evening routine', count: 4, pct: '50%' },
              { reason: 'Felt unwell / mild nausea', count: 2, pct: '25%' },
              { reason: 'Out of home / delayed return', count: 1, pct: '12.5%' },
              { reason: 'Doctor advised pause', count: 1, pct: '12.5%' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
              >
                <span className="font-semibold text-slate-800">{item.reason}</span>
                <span className="font-extrabold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                  {item.count} times ({item.pct})
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

