import React, { useState } from 'react';
import { useCare } from '../context/useCare';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Check,
  Key,
} from 'lucide-react';
import { Language } from '../i18n/translations';

interface OnboardingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingWizardModal: React.FC<OnboardingWizardModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { updateProfile, addMedication, createInvite, setLanguage } = useCare();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Elder Basics
  const [elderName, setElderName] = useState('Savitri Sharma');
  const [dateOfBirth, setDateOfBirth] = useState('1952-04-12');
  const [gender, setGender] = useState('Female');
  const [preferredLang, setPreferredLang] = useState<Language>('en');

  // Step 2: Emergency & Doctor
  const [emergencyContactName, setEmergencyContactName] = useState('Rohan Sharma (Son)');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('+91 98201 44321');
  const [primaryDoctorName, setPrimaryDoctorName] = useState('Dr. V. Kulkarni');
  const [primaryDoctorPhone, setPrimaryDoctorPhone] = useState('+91 98220 55123');
  const [bloodGroup, setBloodGroup] = useState('B+');

  // Step 3: First Med
  const [medName, setMedName] = useState('Metformin');
  const [medStrength, setMedStrength] = useState('500 mg');
  const [medTimes] = useState(['08:00', '20:00']);

  // Step 4: First Invite
  const [inviteRole, setInviteRole] = useState<'primary_caretaker' | 'family_contributor'>('family_contributor');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFinish = () => {
    updateProfile({
      elderName,
      dateOfBirth,
      gender,
      preferredLanguage: preferredLang,
      emergencyContactName,
      emergencyContactPhone,
      primaryDoctorName,
      primaryDoctorPhone,
      bloodGroup,
    });
    setLanguage(preferredLang);

    if (medName.trim()) {
      addMedication({
        name: medName,
        strength: medStrength,
        form: 'tablet',
        dose: '1 tablet',
        purpose: 'Primary daily healthcare',
        frequency: 'daily',
        timesOfDay: ['morning', 'night'],
        exactTimes: medTimes,
        foodInstruction: 'after_food',
        doctorMissedInstruction: 'Take as directed by doctor.',
        prescribingDoctor: primaryDoctorName,
        supplyCount: 30,
        refillThresholdDays: 7,
        dailyDoseCount: medTimes.length,
        startDate: new Date().toISOString().split('T')[0],
        status: 'active',
        colorTag: '#3b82f6',
      });
    }

    // Create the first invite code
    const inv = createInvite(inviteRole, 48);
    setGeneratedCode(inv.code);
    setStep(4);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6 animate-in zoom-in-95 my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">
              Care Profile Onboarding Wizard
            </h3>
            <p className="text-xs text-slate-500">
              Step {step} of 4 • Setting up trusted healthcare profile
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="grid grid-cols-4 gap-2">
          {['1. Elder', '2. Emergency', '3. First Med', '4. Invite'].map((lbl, idx) => (
            <div
              key={lbl}
              className={`text-center py-2 rounded-xl text-xs font-bold ${
                step === idx + 1
                  ? 'bg-emerald-600 text-white'
                  : step > idx + 1
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {lbl}
            </div>
          ))}
        </div>

        {/* Step 1: Elder Basics */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Care Recipient (Elder) Full Name *
              </label>
              <input
                type="text"
                value={elderName}
                onChange={(e) => setElderName(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Preferred Language
                </label>
                <select
                  value={preferredLang}
                  onChange={(e) => setPreferredLang(e.target.value as any)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="en">English</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="mr">मराठी (Marathi)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Emergency & Doctor */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Emergency Contact Name *
                </label>
                <input
                  type="text"
                  value={emergencyContactName}
                  onChange={(e) => setEmergencyContactName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Emergency Phone *
                </label>
                <input
                  type="text"
                  value={emergencyContactPhone}
                  onChange={(e) => setEmergencyContactPhone(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Primary Physician
                </label>
                <input
                  type="text"
                  value={primaryDoctorName}
                  onChange={(e) => setPrimaryDoctorName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Physician Phone
                </label>
                <input
                  type="text"
                  value={primaryDoctorPhone}
                  onChange={(e) => setPrimaryDoctorPhone(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Blood Group
              </label>
              <input
                type="text"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        )}

        {/* Step 3: First Medication */}
        {step === 3 && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500">
              Add the first primary daily medication to get the schedule started immediately.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Medicine Name *
                </label>
                <input
                  type="text"
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Strength
                </label>
                <input
                  type="text"
                  value={medStrength}
                  onChange={(e) => setMedStrength(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                First Circle Member Role to Invite
              </label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as any)}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500"
              >
                <option value="family_contributor">Family Contributor (View schedule, volunteer, log care)</option>
                <option value="primary_caretaker">Primary Caretaker (Full med editing and passcodes)</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 4: First Invite Code Ready */}
        {step === 4 && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Key className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-slate-900">CareCircle Ready!</h4>
              <p className="text-xs text-slate-500 mt-1">
                Share this first invite code with your family member to connect them to {elderName}&apos;s profile:
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300">
              <span className="font-mono text-3xl font-extrabold tracking-widest text-slate-900">
                {generatedCode || 'CARE-8492'}
              </span>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md"
            >
              Start Using CareCircle
            </button>
          </div>
        )}

        {/* Footer Navigation */}
        {step < 4 && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev - 1) as any)}
                className="flex items-center space-x-1 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div></div>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev + 1) as any)}
                className="flex items-center space-x-1 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="flex items-center space-x-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md"
              >
                <Check className="w-4 h-4" />
                <span>Save Profile & Generate Code</span>
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

