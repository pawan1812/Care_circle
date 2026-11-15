import React, { useState } from 'react';
import { useCare } from '../context/useCare';
import { CareCircleMark } from './brand/CareCircleBrand';
import {
  Globe,
  Sun,
  Moon,
  Mail,
  ShieldAlert,
  ChevronDown,
  Sparkles,
  FileText,
  UserCheck,
} from 'lucide-react';

interface HeaderProps {
  onOpenEmergencyCard: () => void;
  onOpenDoctorSummary: () => void;
  onOpenEmailSimulator: () => void;
  onOpenOnboarding: () => void;
  onGoToLanding?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenEmergencyCard,
  onOpenDoctorSummary,
  onOpenEmailSimulator,
  onOpenOnboarding,
  onGoToLanding,
}) => {
  const {
    profile,
    currentMember,
    members,
    switchMember,
    language,
    setLanguage,
    textSize,
    setTextSize,
    isHighContrast,
    toggleHighContrast,
    isElderMode,
    toggleElderMode,
    emails,
    t,
  } = useCare();

  const [isMemberDropdownOpen, setIsMemberDropdownOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const unreadEmailsCount = emails.filter((e) => !e.opened).length;

  const roleLabels: Record<string, string> = {
    elder: 'Elder (Owner)',
    primary_caretaker: 'Primary Caretaker',
    family_contributor: 'Family Contributor',
    caretaker: 'Visiting Nurse',
    family_view: 'Family (View Only)',
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-colors dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Profile Context */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={onGoToLanding || toggleElderMode}>
              <CareCircleMark size={44} variant="color" />
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-serif">
                    Care<span className="text-emerald-800 italic">Circle</span>
                  </h1>
                  <span className="hidden sm:inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    v1.0 PRD
                  </span>
                </div>
                <p className="text-xs text-slate-500 hidden sm:block">
                  Caring for <strong className="text-slate-800">{profile.elderName}</strong> (74y)
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions & Role Switcher */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Landing Page Button */}
            {onGoToLanding && (
              <button
                onClick={onGoToLanding}
                className="hidden lg:inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition-colors"
                title="View Brand Identity & Landing Page"
              >
                <span>← Brand Landing</span>
              </button>
            )}

            {/* View Mode Switcher (Elder Mode vs Full Caretaker View) */}
            <button
              onClick={toggleElderMode}
              className={`flex items-center space-x-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl font-medium text-sm transition-all duration-200 border ${
                isElderMode
                  ? 'bg-amber-100/80 text-amber-900 border-amber-300 shadow-sm'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
              title="Toggle between Elder Simple Mode and Full Caretaker Mode"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span className="hidden md:inline">Mode:</span>
              <span className="font-bold">{isElderMode ? t.elderMode : t.standardMode}</span>
            </button>

            {/* Persona Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsMemberDropdownOpen(!isMemberDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-900 text-xs sm:text-sm font-medium transition-colors"
              >
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span className="hidden lg:inline text-emerald-700">{t.switchRole}:</span>
                <span className="font-bold truncate max-w-[120px]">{currentMember.name.split(' ')[0]}</span>
                <ChevronDown className="w-3.5 h-3.5 text-emerald-600" />
              </button>

              {isMemberDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Switch Role Persona (PRD Matrix)
                    </p>
                  </div>
                  {members.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => {
                        switchMember(member.id);
                        setIsMemberDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 flex items-start space-x-3 hover:bg-slate-50 transition-colors ${
                        member.id === currentMember.id ? 'bg-emerald-50/70 border-l-4 border-emerald-500' : ''
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {member.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-slate-900 truncate">{member.name}</p>
                          {member.id === currentMember.id && (
                            <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-bold">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-emerald-700 font-medium">
                          {roleLabels[member.role] || member.role}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">{member.relationship}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Emergency Card button */}
            <button
              onClick={onOpenEmergencyCard}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs sm:text-sm font-semibold transition-colors"
              title="Emergency Health Card & QR Code"
            >
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span className="hidden sm:inline">SOS Card</span>
            </button>

            {/* Doctor Visit Report button */}
            <button
              onClick={onOpenDoctorSummary}
              className="hidden md:flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 text-xs sm:text-sm font-semibold transition-colors"
              title="Printable Doctor Visit Summary"
            >
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Doctor Report</span>
            </button>

            {/* Guided Setup Wizard button */}
            <button
              onClick={onOpenOnboarding}
              className="hidden lg:flex items-center space-x-1 px-2.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
              title="Open Guided Onboarding Wizard"
            >
              <span>Setup Wizard</span>
            </button>

            {/* Email Simulator Button (PRD 1-Tap Links) */}
            <button
              onClick={onOpenEmailSimulator}
              className="relative p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
              title="Open Simulated Email Reminders & Action Links"
            >
              <Mail className="w-5 h-5 text-slate-600" />
              {unreadEmailsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center animate-pulse">
                  {unreadEmailsCount}
                </span>
              )}
            </button>

            {/* Accessibility Quick Toggles */}
            <div className="flex items-center space-x-1 border-l border-slate-200 pl-2">
              
              {/* Font Size Adjuster */}
              <button
                onClick={() => {
                  const next = textSize === 'normal' ? 'large' : textSize === 'large' ? 'xl' : 'normal';
                  setTextSize(next);
                }}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors"
                title={`Adjust Text Size: Current ${textSize.toUpperCase()}`}
              >
                {textSize === 'normal' ? 'A' : textSize === 'large' ? 'A+' : 'A++'}
              </button>

              {/* High Contrast Toggle */}
              <button
                onClick={toggleHighContrast}
                className={`p-2 rounded-lg border transition-colors ${
                  isHighContrast
                    ? 'bg-black text-yellow-300 border-black'
                    : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
                title="Toggle High Contrast Theme for Low Vision"
              >
                {isHighContrast ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Multi-language Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                  className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors flex items-center space-x-1"
                  title="Select Language (English / हिन्दी / मराठी)"
                >
                  <Globe className="w-4 h-4 text-slate-600" />
                  <span className="text-xs font-bold uppercase">{language}</span>
                </button>

                {isLangDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-36 rounded-xl bg-white shadow-xl border border-slate-200 py-1 z-50">
                    <button
                      onClick={() => {
                        setLanguage('en');
                        setIsLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-slate-50 flex items-center justify-between ${
                        language === 'en' ? 'text-emerald-600 font-bold bg-emerald-50' : 'text-slate-700'
                      }`}
                    >
                      <span>English</span>
                      {language === 'en' && '✓'}
                    </button>
                    <button
                      onClick={() => {
                        setLanguage('hi');
                        setIsLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-slate-50 flex items-center justify-between ${
                        language === 'hi' ? 'text-emerald-600 font-bold bg-emerald-50' : 'text-slate-700'
                      }`}
                    >
                      <span>हिन्दी</span>
                      {language === 'hi' && '✓'}
                    </button>
                    <button
                      onClick={() => {
                        setLanguage('mr');
                        setIsLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-slate-50 flex items-center justify-between ${
                        language === 'mr' ? 'text-emerald-600 font-bold bg-emerald-50' : 'text-slate-700'
                      }`}
                    >
                      <span>मराठी</span>
                      {language === 'mr' && '✓'}
                    </button>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      </div>
    </header>
  );
};

