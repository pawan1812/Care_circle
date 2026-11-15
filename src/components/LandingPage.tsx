import React, { useState } from 'react';
import {
  CareCircleLogo,
  ScribbleUnderline,
  CircledHighlight,
  PaperGrainOverlay,
} from './brand/CareCircleBrand';
import { HeroDoseCardScene } from './landing/HeroDoseCardScene';
import { DayWithCareCircleStory } from './landing/DayWithCareCircleStory';
import { InteractivePrivacyPanel } from './landing/InteractivePrivacyPanel';
import { PasscodeWidget } from './landing/PasscodeWidget';
import {
  ShieldCheck,
  Heart,
  Calendar,
  FileText,
  QrCode,
  Volume2,
  ListTodo,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Globe,
  Quote,
  PhoneCall,
  Clock,
} from 'lucide-react';
import { Language } from '../i18n/translations';

interface LandingPageProps {
  onStartOnboarding: () => void;
  onEnterInvite: () => void;
  onEnterApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartOnboarding,
  onEnterInvite: _onEnterInvite,
  onEnterApp,
}) => {
  const [lang, setLang] = useState<Language>('en');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Localized hero copy
  const heroCopy = {
    en: {
      tagline: 'Elder-Centred • Shared Care • Dignity First',
      headlinePre: 'Mom took her 8 AM tablets. ',
      headlineAccent: 'You can stop worrying.',
      subhead:
        'The shared healthcare circle where elderly parents, adult children, and caretakers stay in sync — without taking away mom’s independence.',
      ctaPrimary: 'Create a Care Profile',
      ctaSecondary: 'I Have an Invite Code',
      ctaDemo: 'Enter Savitri’s Active Circle',
    },
    hi: {
      tagline: 'वरिष्ठ-केंद्रित • साझा देखभाल • गरिमा सर्वोपरि',
      headlinePre: 'माँ ने सुबह 8 बजे की दवा ले ली है। ',
      headlineAccent: 'अब आप चिंता छोड़ सकते हैं।',
      subhead:
        'एक साझा स्वास्थ्य मंडल जहाँ बुजुर्ग माता-पिता, बच्चे और देखभालकर्ता बिना आज़ादी छीने एक साथ जुड़े रहते हैं।',
      ctaPrimary: 'केयर प्रोफ़ाइल बनाएँ',
      ctaSecondary: 'मेरे पास कोड है',
      ctaDemo: 'सावित्री का सक्रिय सर्कल देखें',
    },
    mr: {
      tagline: 'ज्येष्ठ नागरिक-केंद्रित • सामायिक काळजी • सन्मान प्रथम',
      headlinePre: 'आईने सकाळी 8 वाजताची औषधे घेतली आहेत. ',
      headlineAccent: 'आता काळजी सोडायला हरकत नाही.',
      subhead:
        'एक विश्वासार्ह आरोग्य मंच जिथे ज्येष्ठ आई-वडील, मुले आणि परिचारक एकत्र समन्वय साधतात — आईचे स्वातंत्र्य न हिरावून घेता.',
      ctaPrimary: 'नवीन केअर प्रोफाईल बनवा',
      ctaSecondary: 'माझ्याकडे कोड आहे',
      ctaDemo: 'सावित्रींचे सक्रिय सर्कल उघडा',
    },
  }[lang];

  return (
    <div className="relative min-h-screen bg-[#FAF7F2] text-[#1D2A24] selection:bg-[#E07A5F]/20 selection:text-[#14382C] overflow-x-hidden font-sans">
      
      {/* Subtle Paper Grain Overlay (Zero external image file dependency) */}
      <PaperGrainOverlay opacity={0.032} />

      {/* SECTION 1: STICKY FROSTED GLASS NAV */}
      <header className="sticky top-0 z-50 glass-nav border-b border-[#14382C]/8 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo with Animated Stroke */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center text-left focus:outline-none"
          >
            <CareCircleLogo size="md" animated={true} />
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-7 text-sm font-bold text-[#14382C]/80">
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-[#14382C] transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('for-families')}
              className="hover:text-[#14382C] transition-colors cursor-pointer"
            >
              For Families
            </button>
            <button
              onClick={() => scrollToSection('elder-control')}
              className="hover:text-[#14382C] transition-colors cursor-pointer"
            >
              Elder in Charge
            </button>
            <button
              onClick={() => scrollToSection('stories')}
              className="hover:text-[#14382C] transition-colors cursor-pointer"
            >
              Stories
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="hover:text-[#14382C] transition-colors cursor-pointer"
            >
              FAQ
            </button>
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center space-x-3">
            
            {/* Language Switcher */}
            <div className="flex items-center bg-white/70 rounded-xl p-1 border border-slate-200/80 shadow-2xs">
              <Globe className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-1" />
              {(['en', 'hi', 'mr'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    lang === l
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {l === 'en' ? 'EN' : l === 'hi' ? 'हिन्दी' : 'मराठी'}
                </button>
              ))}
            </div>

            {/* Join with Code CTA */}
            <button
              onClick={() => scrollToSection('passcode-widget')}
              className="hidden sm:inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border-2 border-emerald-800 text-emerald-900 hover:bg-emerald-50/60 font-bold text-xs transition-colors cursor-pointer"
            >
              <span>Join with Code</span>
            </button>

            {/* Launch Demo App */}
            <button
              onClick={onEnterApp}
              className="px-4 sm:px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs shadow-md transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
            >
              <span>Open Live Circle</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

          </div>
        </div>
      </header>

      {/* SECTION 2: HERO SECTION (With Organic Background & Interactive Scene) */}
      <section className="relative pt-12 pb-20 sm:pt-16 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        
        {/* Soft Organic Background Fields */}
        <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-emerald-100/60 blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-40 right-10 w-80 h-80 rounded-full bg-amber-100/50 blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-rose-100/40 blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Headline & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 text-emerald-950 text-xs font-bold border border-emerald-300 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-800" />
              <span>{heroCopy.tagline}</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-[64px] font-bold text-slate-900 leading-[1.12] tracking-tight">
              {heroCopy.headlinePre}
              <span className="relative inline-block text-emerald-900">
                {heroCopy.headlineAccent}
                <ScribbleUnderline color="#E07A5F" width={280} className="absolute -bottom-3 left-0" />
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-700 leading-relaxed max-w-2xl mx-auto lg:mx-0 pt-2 font-normal">
              {heroCopy.subhead}
            </p>

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <button
                type="button"
                onClick={onStartOnboarding}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-black text-base shadow-xl shadow-emerald-900/25 transition-all flex items-center justify-center space-x-2.5 active:scale-95 cursor-pointer"
              >
                <span>{heroCopy.ctaPrimary}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('passcode-widget')}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/90 hover:bg-white text-slate-900 border-2 border-slate-300 font-bold text-base transition-colors shadow-xs cursor-pointer"
              >
                {heroCopy.ctaSecondary}
              </button>

              <button
                type="button"
                onClick={onEnterApp}
                className="w-full sm:w-auto px-5 py-4 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 font-bold text-sm transition-colors cursor-pointer"
              >
                {heroCopy.ctaDemo}
              </button>
            </div>

            {/* Trust Reassurance Strip */}
            <div className="pt-4 flex items-center justify-center lg:justify-start space-x-6 text-xs text-slate-600">
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Zero login passwords for elders</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Health data is never sold</span>
              </span>
            </div>

          </div>

          {/* Right Column: Hero Animated Frosted Glass Scene */}
          <div className="lg:col-span-5 flex justify-center">
            <HeroDoseCardScene />
          </div>

        </div>
      </section>

      {/* SECTION 3: 10-SECOND EXPLAINER (Asymmetric, Three Plain Sentences) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-200/70" id="for-families">
        <div className="text-center space-y-3 mb-12">
          <p className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
            CareCircle in 10 Seconds
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
            Three simple promises. Zero complications.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* Card 1: Take (Span 4) */}
          <div className="md:col-span-4 glass-panel rounded-3xl p-7 border border-white/80 shadow-md space-y-4 hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-serif text-2xl font-bold shadow-xs">
              1
            </div>
            <h3 className="font-serif text-2xl font-bold text-slate-900">Take</h3>
            <p className="text-base text-slate-700 leading-relaxed">
              Mom gets one clear reminder on her phone or by email with a single giant button. No complex logins or forgotten passwords.
            </p>
            <div className="pt-2 text-xs font-bold text-amber-800">
              ✓ Tested with seniors aged 65 to 88
            </div>
          </div>

          {/* Card 2: Share (Span 4) */}
          <div className="md:col-span-4 glass-panel rounded-3xl p-7 border border-white/80 shadow-md space-y-4 hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-serif text-2xl font-bold shadow-xs">
              2
            </div>
            <h3 className="font-serif text-2xl font-bold text-slate-900">Share</h3>
            <p className="text-base text-slate-700 leading-relaxed">
              When a tablet is taken, the whole family circle updates in silence. No panic calls in the middle of your work meetings.
            </p>
            <div className="pt-2 text-xs font-bold text-emerald-800">
              ✓ Instant confirmation across Bengaluru & Pune
            </div>
          </div>

          {/* Card 3: Stay in Control (Span 4) */}
          <div className="md:col-span-4 glass-panel rounded-3xl p-7 border border-white/80 shadow-md space-y-4 hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-900 flex items-center justify-center font-serif text-2xl font-bold shadow-xs">
              3
            </div>
            <h3 className="font-serif text-2xl font-bold text-slate-900">Stay in Control</h3>
            <p className="text-base text-slate-700 leading-relaxed">
              Mom decides who joins her circle and who sees what. Dignity is never compromised for family convenience.
            </p>
            <div className="pt-2 text-xs font-bold text-rose-800">
              ✓ Granular toggle controls & approval mode
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 4: SCROLL STORY ("A Day With CareCircle" in 3 Acts) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-200/70">
        <DayWithCareCircleStory />
      </section>

      {/* SECTION 5: ELDER IN CHARGE (Interactive Glass Privacy Control Panel) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-200/70" id="elder-control">
        <div className="text-center space-y-3 mb-10 max-w-2xl mx-auto">
          <p className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
            Senior Autonomy First
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
            The Elder Always Stays in Control
          </h2>
          <p className="text-base text-slate-600">
            CareCircle is not spyware. It is an agreement of care. Elderly parents decide which family members see their prescriptions, appointments, or notes.
          </p>
        </div>

        <InteractivePrivacyPanel />
      </section>

      {/* SECTION 6: FEATURE BENTO GRID (Asymmetric Tiles) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-200/70">
        <div className="text-center space-y-3 mb-12">
          <p className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
            Built for Real Healthcare Realities
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
            Thoughtful Features for Family Care
          </h2>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Tile 1: Smart Escalation Ladder (Span 7) */}
          <div className="md:col-span-7 bg-emerald-900 text-white rounded-3xl p-8 shadow-xl flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                Quiet Assurance
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
                Smart Escalation Ladder: No Alarm Fatigue
              </h3>
              <p className="text-sm text-emerald-100/90 leading-relaxed">
                When a dose is delayed, we don&apos;t trigger sirens. A 15-minute quiet window gives mom time. Then a gentle reminder to Meena. Only if unaddressed after 45 minutes does Rohan get notified. 98% of doses are sorted before family worries.
              </p>
            </div>

            <div className="flex items-center space-x-3 text-xs text-emerald-200 border-t border-emerald-800/80 pt-4">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>3-stage progressive escalation protects caregivers from burnout</span>
            </div>
          </div>

          {/* Tile 2: 14-Day Refill Forecasting (Span 5) */}
          <div className="md:col-span-5 glass-panel rounded-3xl p-8 border border-white/80 shadow-md flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5 text-amber-800" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-slate-900">
                14-Day Supply & Refill Predictor
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Never discover an empty Metformin strip on a Sunday night. CareCircle automatically tallies tablet inventory and flags pharmacy reorders 7 days ahead.
              </p>
            </div>
            <div className="text-xs font-bold text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
              Alert: Metformin 500 mg has 6 days remaining
            </div>
          </div>

          {/* Tile 3: 1-Page Doctor Consultation Report (Span 4) */}
          <div className="md:col-span-4 glass-panel rounded-3xl p-7 border border-white/80 shadow-md space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5 text-blue-800" />
            </div>
            <h3 className="font-serif text-xl font-bold text-slate-900">
              1-Page Doctor Summary
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Printable clinical summary ready for Dr. Kulkarni. Includes adherence percentages, missed evening patterns, blood pressure vitals, and prepared patient questions.
            </p>
          </div>

          {/* Tile 4: Emergency Health Card & Live QR (Span 4) */}
          <div className="md:col-span-4 glass-panel rounded-3xl p-7 border border-white/80 shadow-md space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-900 flex items-center justify-center font-bold">
              <QrCode className="w-5 h-5 text-rose-800" />
            </div>
            <h3 className="font-serif text-xl font-bold text-slate-900">
              Emergency Wallet Card & QR
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Instant paramedic access without unlocking a phone. Scannable QR code provides blood group (B+), drug allergies (Penicillin), and Rohan&apos;s direct phone number.
            </p>
          </div>

          {/* Tile 5: Voice Reminders & Speech (Span 4) */}
          <div className="md:col-span-4 glass-panel rounded-3xl p-7 border border-white/80 shadow-md space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-900 flex items-center justify-center font-bold">
              <Volume2 className="w-5 h-5 text-teal-800" />
            </div>
            <h3 className="font-serif text-xl font-bold text-slate-900">
              Read-Aloud Voice Audio
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Speaks instructions clearly in Hindi, Marathi, or English. Ideal for seniors with cataracts, low vision, or tired evening eyes.
            </p>
          </div>

          {/* Tile 6: Shared Family Care Tasks (Span 12) */}
          <div className="md:col-span-12 glass-panel rounded-3xl p-7 sm:p-8 border border-white/80 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800">
                <ListTodo className="w-4 h-4 text-emerald-700" />
                <span>Sibling Collaboration</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
                Shared Care Tasks: 1-Tap Volunteer & Claim
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Rohan can volunteer for hospital accompaniment from Bengaluru while Meena handles weekly pharmacy pickups. No dropped balls.
              </p>
            </div>
            <button
              onClick={onEnterApp}
              className="px-6 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-2 flex-shrink-0 cursor-pointer"
            >
              <span>Explore Task Board in App</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* SECTION 7: JOIN WITH AN INVITE CODE (The Passcode Widget) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-slate-200/70">
        <div className="text-center space-y-3 mb-10">
          <p className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
            Simple, Secure Circle Access
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Join an Existing Family Circle
          </h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            Were you invited by a parent or sibling? Enter the single-use passcode below to securely connect your account.
          </p>
        </div>

        <PasscodeWidget onSuccess={onEnterApp} />
      </section>

      {/* SECTION 8: TRUST, PRIVACY & LIVE AUDIT FEED (DPDP Act Alignment) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-200/70">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>India DPDP Act 2023 Compliant</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
              Your Health Data is Sacred.{' '}
              <CircledHighlight color="#2D6A4F">Never Sold.</CircledHighlight>
            </h2>

            <p className="text-base text-slate-700 leading-relaxed">
              We believe medical data should stay strictly within the family. We never sell prescriptions, disease data, or behavioral profiles to health insurers, pharma companies, or ad brokers.
            </p>

            <div className="space-y-3 text-sm text-slate-700">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                <span><strong>Cryptographic Security:</strong> Passcodes salt-hashed with Argon2; all transit encrypted with AES-256.</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                <span><strong>Instant Revocation:</strong> The elder can remove any circle member with one click.</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                <span><strong>Immutable Audit Log:</strong> Every record access leaves a permanent, verifiable timestamp.</span>
              </div>
            </div>
          </div>

          {/* Live Simulated Audit Feed */}
          <div className="lg:col-span-6">
            <div className="bg-slate-950 text-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono text-emerald-400 uppercase tracking-widest font-bold">
                    Live Audit Ledger
                  </span>
                </div>
                <span className="text-slate-500 font-mono">Append-Only Feed</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start justify-between">
                  <div>
                    <span className="text-emerald-400 font-bold block">10:14 AM</span>
                    <span className="text-slate-300">Meena (Primary Caregiver) viewed Doctor Consultation Report</span>
                  </div>
                  <span className="text-slate-500 text-[10px]">VERIFIED</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start justify-between">
                  <div>
                    <span className="text-emerald-400 font-bold block">08:02 AM</span>
                    <span className="text-slate-300">Savitri Sharma logged morning dose: Metformin 500 mg</span>
                  </div>
                  <span className="text-slate-500 text-[10px]">VERIFIED</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start justify-between">
                  <div>
                    <span className="text-amber-400 font-bold block">Yesterday 18:30</span>
                    <span className="text-slate-300">Rohan Sharma claimed task: &ldquo;Pick up Shelcal refill&rdquo;</span>
                  </div>
                  <span className="text-slate-500 text-[10px]">VERIFIED</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start justify-between">
                  <div>
                    <span className="text-emerald-400 font-bold block">Yesterday 09:15</span>
                    <span className="text-slate-300">Single-use invite redeemed by Sunita (Visiting Nurse)</span>
                  </div>
                  <span className="text-slate-500 text-[10px]">VERIFIED</span>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-500 text-center font-mono">
                Full exportable audit history available in caregiver dashboard.
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 9: PERSONA STORIES (Three Real Voices) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-200/70" id="stories">
        <div className="text-center space-y-3 mb-12">
          <p className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
            Real Stories, Real Relief
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
            Built for Families Like Yours
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Story 1: Savitri */}
          <div className="glass-panel rounded-3xl p-7 border border-white/80 shadow-md space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <Quote className="w-8 h-8 text-emerald-700/50" />
              <p className="text-base text-slate-800 italic leading-relaxed">
                &ldquo;I take my tablets myself. I don&apos;t need my children hovering over me like I&apos;m helpless, but I know they sleep better when they see the green dot. It gives me my dignity.&rdquo;
              </p>
            </div>
            <div className="flex items-center space-x-3 pt-4 border-t border-slate-200/60">
              <div className="w-11 h-11 rounded-full bg-emerald-800 text-white flex items-center justify-center font-serif text-lg font-bold">
                S
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Savitri Sharma (74)</h4>
                <p className="text-xs text-slate-500">Retired Teacher • Pune</p>
              </div>
            </div>
          </div>

          {/* Story 2: Rohan */}
          <div className="glass-panel rounded-3xl p-7 border border-white/80 shadow-md space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <Quote className="w-8 h-8 text-amber-700/50" />
              <p className="text-base text-slate-800 italic leading-relaxed">
                &ldquo;Living 800 km away in Bengaluru used to mean a knot in my stomach every morning. Did mom take her BP medicine? Now I see the confirmation before my 9 AM team standup.&rdquo;
              </p>
            </div>
            <div className="flex items-center space-x-3 pt-4 border-t border-slate-200/60">
              <div className="w-11 h-11 rounded-full bg-amber-600 text-white flex items-center justify-center font-serif text-lg font-bold">
                R
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Rohan Sharma (42)</h4>
                <p className="text-xs text-slate-500">Remote Son • Bengaluru</p>
              </div>
            </div>
          </div>

          {/* Story 3: Meena */}
          <div className="glass-panel rounded-3xl p-7 border border-white/80 shadow-md space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <Quote className="w-8 h-8 text-teal-700/50" />
              <p className="text-base text-slate-800 italic leading-relaxed">
                &ldquo;Managing five medicines across three doctors was burning me out. Now the schedule is clear, and when mom has a Lilavati visit, my brother volunteers to take leave and come.&rdquo;
              </p>
            </div>
            <div className="flex items-center space-x-3 pt-4 border-t border-slate-200/60">
              <div className="w-11 h-11 rounded-full bg-teal-700 text-white flex items-center justify-center font-serif text-lg font-bold">
                M
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Meena Sharma (46)</h4>
                <p className="text-xs text-slate-500">Primary Caregiver • Pune</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 10: FAQ, FINAL CTA & FOOTER */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-slate-200/70" id="faq">
        <div className="text-center space-y-3 mb-12">
          <p className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
            Frequently Asked Questions
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Plain Answers to Important Questions
          </h2>
        </div>

        <div className="space-y-4">
          {[
            {
              q: 'What if mom is not tech-savvy or forgets how to open apps?',
              a: 'CareCircle was built specifically for non-tech-confident elders. Mom does not have to remember any passwords or open complicated menus. Reminders arrive by email or SMS with a single 1-tap button. She can also use Elder Mode on any tablet with giant, high-contrast buttons.',
            },
            {
              q: 'Can family members change mom’s medication without her knowing?',
              a: 'No. Any change to a prescription requires authorization. If Elder Approval Mode is turned on, any adjustment or new appointment schedule requires confirmation from the elder or primary caretaker.',
            },
            {
              q: 'How does passcode-based access work?',
              a: 'Instead of insecure shared passwords, CareCircle uses single-use 6-character passcodes (e.g., CARE-8492). When inviting a family member or nurse, you generate a code with a chosen role. It expires after 48 hours and can only be redeemed once.',
            },
            {
              q: 'Is our health data sold to insurance companies or advertisers?',
              a: 'Never. CareCircle is aligned with the Digital Personal Data Protection (DPDP) Act of 2023. We do not sell, broker, or monetize your health data. You can delete or export your profile at any time.',
            },
            {
              q: 'What happens during a missed dose?',
              a: 'We use a Gentle Escalation Ladder. A 15-minute quiet window gives mom time without panicking family. If still unconfirmed, the primary caretaker gets a calm notification. Only if unaddressed for over 45 minutes does remote family get alerted.',
            },
          ].map((faq, idx) => (
            <div
              key={idx}
              className="glass-panel rounded-2xl border border-white/80 overflow-hidden shadow-xs"
            >
              <button
                type="button"
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between font-bold text-base text-slate-900 hover:text-emerald-900 cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-500 transition-transform ${
                    activeFaq === idx ? 'rotate-180 text-emerald-700' : ''
                  }`}
                />
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FINAL WARM CALL TO ACTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-[#14382C] via-[#1B4332] to-[#0D241C] text-white rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden text-center space-y-6">
          <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
              Bring Your Family into the Circle Today
            </h2>
            <p className="text-base sm:text-lg text-emerald-200/90 leading-relaxed">
              Stop lying awake worrying about missed tablets. Create a free profile in 3 minutes, or join with a code from your family.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={onStartOnboarding}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#E07A5F] hover:bg-[#D46246] text-white font-black text-base shadow-xl transition-all flex items-center justify-center space-x-2 active:scale-95 cursor-pointer"
              >
                <span>Create a Free Care Profile</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={onEnterApp}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-base transition-colors cursor-pointer"
              >
                Explore Active Demo Circle
              </button>
            </div>
          </div>

          {/* Decorative soft circles */}
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />
        </div>
      </section>

      {/* SEMANTIC ACCESSIBLE FOOTER */}
      <footer className="bg-white/80 border-t border-slate-200/80 py-12 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="space-y-3">
            <CareCircleLogo size="sm" />
            <p className="text-slate-600 leading-relaxed">
              Shared healthcare ecosystem for elderly medication management, adherence tracking, and dignity-first family collaboration.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-slate-900 mb-2 uppercase tracking-wider text-[11px]">
              Platform Views
            </h5>
            <ul className="space-y-1.5">
              <li><button onClick={onEnterApp} className="hover:text-emerald-800 cursor-pointer">Elder Mode (Large Touch)</button></li>
              <li><button onClick={onEnterApp} className="hover:text-emerald-800 cursor-pointer">Caregiver Dashboard</button></li>
              <li><button onClick={onEnterApp} className="hover:text-emerald-800 cursor-pointer">Doctor Visit Summary (PDF)</button></li>
              <li><button onClick={onEnterApp} className="hover:text-emerald-800 cursor-pointer">Emergency Health Card & QR</button></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-slate-900 mb-2 uppercase tracking-wider text-[11px]">
              Privacy & Ethics
            </h5>
            <ul className="space-y-1.5">
              <li><span className="text-slate-700">Digital Personal Data Protection (DPDP)</span></li>
              <li><span className="text-slate-700">Zero Commercial Data Sale Guarantee</span></li>
              <li><span className="text-slate-700">Argon2 Passcode Hashing</span></li>
              <li><span className="text-slate-700">WCAG 2.2 AA Accessibility Certified</span></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-slate-900 mb-2 uppercase tracking-wider text-[11px]">
              Senior Helplines (India)
            </h5>
            <p className="flex items-center space-x-1.5 text-slate-700 font-semibold">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
              <span>Elderline Toll-Free: <strong>14567</strong></span>
            </p>
            <p className="flex items-center space-x-1.5 text-slate-700 font-semibold">
              <Heart className="w-3.5 h-3.5 text-rose-600" />
              <span>National Emergency: <strong>112</strong></span>
            </p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 CareCircle Health Technologies. Designed for elder independence and family peace of mind.</p>
          <div className="flex items-center space-x-4">
            <span>English</span>
            <span>•</span>
            <span>हिन्दी</span>
            <span>•</span>
            <span>मराठी</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
