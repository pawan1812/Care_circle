import React, { useState } from 'react';
import { CheckCircle2, Clock, Sparkles, HeartHandshake } from 'lucide-react';
import confetti from 'canvas-confetti';

export const HeroDoseCardScene: React.FC = () => {
  const [isTaken, setIsTaken] = useState(false);

  const handleTake = () => {
    if (!isTaken) {
      setIsTaken(true);
      try {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#2D6A4F', '#52B788', '#E07A5F', '#F2CC8F'],
        });
      } catch {}
    } else {
      setIsTaken(false);
    }
  };

  return (
    <div className="relative w-full max-w-lg mx-auto py-4 select-none">
      {/* Rich Organic Color Fields Behind Glass (So glass sits over visible color) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-emerald-400/25 blur-3xl pointer-events-none" />
      <div className="absolute -top-6 -right-6 w-48 h-48 rounded-full bg-amber-300/30 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-56 h-56 rounded-full bg-rose-300/25 blur-3xl pointer-events-none" />

      {/* Floating Pill Tag Badge (Parallax floating effect) */}
      <div className="absolute -top-4 -left-3 sm:-left-6 z-20 glass-card px-3.5 py-1.5 rounded-full border border-white/80 shadow-md flex items-center space-x-2 text-xs font-bold text-emerald-950 animate-bounce duration-1000">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>08:00 AM Routine • After Breakfast</span>
      </div>

      {/* Floating Family Circle Sync Badge */}
      <div className="absolute -bottom-3 -right-2 sm:-right-4 z-20 glass-card px-3.5 py-2 rounded-2xl border border-white/80 shadow-md flex items-center space-x-2 text-xs font-bold text-slate-800">
        <HeartHandshake className="w-4 h-4 text-emerald-700" />
        <span>Rohan in Bengaluru: Synced</span>
      </div>

      {/* The Central Hero Glass Dose Card */}
      <div className="relative z-10 glass-panel rounded-3xl p-6 sm:p-7 border border-white/80 shadow-2xl space-y-5 backdrop-blur-xl">
        
        {/* Card Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-200/60">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900">
                Savitri&apos;s Morning Tablets
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Prescribed by Dr. V. Kulkarni • Lilavati Hospital
            </p>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
              isTaken
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'bg-amber-100 text-amber-900 border border-amber-300'
            }`}
          >
            {isTaken ? '✓ Taken' : 'Due Now (8:00 AM)'}
          </span>
        </div>

        {/* Medicines in this slot */}
        <div className="space-y-2.5">
          {/* Med 1 */}
          <div className="bg-white/85 rounded-2xl p-3.5 border border-slate-200/70 flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs border border-blue-200">
                M
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900">Metformin 500 mg</p>
                <p className="text-[11px] text-slate-500">1 tablet • With warm water after food</p>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-400">1 tablet</span>
          </div>

          {/* Med 2 */}
          <div className="bg-white/85 rounded-2xl p-3.5 border border-slate-200/70 flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs border border-emerald-200">
                A
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900">Amlodipine 5 mg</p>
                <p className="text-[11px] text-slate-500">1 tablet • For blood pressure control</p>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-400">1 tablet</span>
          </div>
        </div>

        {/* Interactive Spring Action Button */}
        <div>
          {!isTaken ? (
            <button
              type="button"
              onClick={handleTake}
              className="w-full py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white font-extrabold text-base shadow-xl shadow-emerald-700/25 transition-all flex items-center justify-center space-x-2.5 cursor-pointer spring-bounce"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Tap to Mark Taken (Try Interactive Demo)</span>
            </button>
          ) : (
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleTake}
                className="w-full py-4 rounded-2xl bg-emerald-100 hover:bg-emerald-200 active:scale-98 text-emerald-950 font-extrabold text-base border-2 border-emerald-400 shadow-sm transition-all flex items-center justify-center space-x-2.5 cursor-pointer spring-bounce"
              >
                <Sparkles className="w-5 h-5 text-emerald-700" />
                <span>✓ Confirmed Taken at 8:02 AM</span>
              </button>
              <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                <span>Logged by Savitri Sharma</span>
                <span className="underline cursor-pointer" onClick={handleTake}>
                  Tap again to reset
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Quiet Assurance Footer */}
        <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-200/60">
          <span className="flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Next dose: 1:30 PM (Lunch)</span>
          </span>
          <span className="text-emerald-800 font-semibold">
            Family updated in silence
          </span>
        </div>

      </div>
    </div>
  );
};

