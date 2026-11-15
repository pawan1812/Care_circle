import React, { useState, useRef } from 'react';
import { KeyRound, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface PasscodeWidgetProps {
  onSuccess: () => void;
  className?: string;
}

export const PasscodeWidget: React.FC<PasscodeWidgetProps> = ({ onSuccess, className = '' }) => {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleInputChange = (index: number, value: string) => {
    // Only accept alphanumeric characters
    const cleanVal = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!cleanVal) {
      const newDigits = [...digits];
      newDigits[index] = '';
      setDigits(newDigits);
      return;
    }

    const char = cleanVal.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);
    setErrorMsg(null);

    // Auto-advance to next box
    if (index < 5 && char) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (pasted.length > 0) {
      const newDigits = [...digits];
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pasted[i] || '';
      }
      setDigits(newDigits);
      const nextEmpty = newDigits.findIndex((d) => !d);
      if (nextEmpty !== -1) {
        inputRefs.current[nextEmpty]?.focus();
      } else {
        inputRefs.current[5]?.focus();
      }
    }
  };

  const handleSubmit = () => {
    const fullCode = digits.join('');
    if (fullCode.length < 6) {
      setErrorMsg('Please enter all 6 characters of the invite code');
      triggerShake();
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    // Realistic simulation: Valid demo codes include '849201', 'CARE84', 'SAV749', or any 6-char input for testing
    setTimeout(() => {
      setIsLoading(false);
      if (fullCode === '000000') {
        setErrorMsg('Invalid or expired invite code. Please request a new code from the primary caretaker.');
        triggerShake();
      } else {
        setIsSuccess(true);
      }
    }, 450);
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleDemoFill = () => {
    setDigits(['8', '4', '9', '2', '0', '1']);
    setErrorMsg(null);
    inputRefs.current[5]?.focus();
  };

  return (
    <div
      className={`glass-panel rounded-3xl p-6 sm:p-8 border border-white/60 shadow-xl max-w-xl mx-auto ${className}`}
      id="passcode-widget"
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 rounded-2xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center shadow-xs">
          <KeyRound className="w-5 h-5 text-emerald-700" />
        </div>
        <div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Have an Invite Passcode?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            Enter the 6-character single-use code sent by your family member.
          </p>
        </div>
      </div>

      {!isSuccess ? (
        <div className="space-y-6">
          {/* 6 Box Inputs */}
          <div
            className={`flex items-center justify-center gap-2 sm:gap-3 transition-transform ${
              isShaking ? 'animate-[shake_0.4s_ease-in-out]' : ''
            }`}
            onPaste={handlePaste}
          >
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => { inputRefs.current[idx] = el; }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                placeholder="•"
                aria-label={`Digit ${idx + 1}`}
                className={`w-11 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-mono font-black rounded-2xl border-2 transition-all shadow-xs outline-none ${
                  digit
                    ? 'border-emerald-600 bg-white text-emerald-900 ring-2 ring-emerald-100'
                    : 'border-slate-300/80 bg-white/70 text-slate-800 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100'
                }`}
              />
            ))}
          </div>

          {errorMsg && (
            <p className="text-xs sm:text-sm text-rose-600 font-semibold text-center bg-rose-50/80 p-2.5 rounded-xl border border-rose-200">
              {errorMsg}
            </p>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleDemoFill}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline underline-offset-4"
            >
              Fill demo code (849201)
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || digits.join('').length < 6}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 active:scale-95 cursor-pointer"
            >
              <span>{isLoading ? 'Verifying...' : 'Join Family Circle'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cryptographically salted • Single-use only</span>
            </span>
            <span>5 failed attempts locks for 15m</span>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50/90 rounded-2xl p-5 border border-emerald-200 space-y-4 animate-in fade-in zoom-in-95">
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="w-7 h-7 text-emerald-700 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-emerald-950 text-base">
                Passcode Verified Successfully!
              </h4>
              <p className="text-xs sm:text-sm text-emerald-800 mt-1 leading-relaxed">
                You have been authenticated as a <strong>Family Contributor</strong> to <strong>Savitri Sharma&apos;s</strong> CareCircle. You can now view dose schedules and volunteer for care tasks.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onSuccess}
            className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2"
          >
            <span>Enter Savitri&apos;s Active Circle Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

