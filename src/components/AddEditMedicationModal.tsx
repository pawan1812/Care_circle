import React, { useState } from 'react';
import { useCare } from '../context/useCare';
import {
  X,
  Clock,
  ShieldCheck,
  Check,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { MedicationForm, ScheduleFrequency, FoodInstruction, TimeOfDay } from '../types';

interface AddEditMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COMMON_MEDS = [
  { name: 'Metformin', strength: '500 mg', purpose: 'Blood sugar control (Diabetes)', form: 'tablet' as MedicationForm },
  { name: 'Amlodipine', strength: '5 mg', purpose: 'High blood pressure management', form: 'tablet' as MedicationForm },
  { name: 'Glimepiride', strength: '1 mg', purpose: 'Post-meal glucose regulation', form: 'tablet' as MedicationForm },
  { name: 'Atorvastatin', strength: '10 mg', purpose: 'Cholesterol management', form: 'tablet' as MedicationForm },
  { name: 'Telmisartan', strength: '40 mg', purpose: 'Blood pressure control', form: 'tablet' as MedicationForm },
  { name: 'Shelcal 500 (Calcium + D3)', strength: '500 mg', purpose: 'Bone density and joint strength', form: 'tablet' as MedicationForm },
  { name: 'Pantoprazole', strength: '40 mg', purpose: 'Acid reflux and stomach protection', form: 'tablet' as MedicationForm },
  { name: 'Paracetamol', strength: '650 mg', purpose: 'Pain relief and fever', form: 'tablet' as MedicationForm },
];

export const AddEditMedicationModal: React.FC<AddEditMedicationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addMedication } = useCare();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [name, setName] = useState('');
  const [strength, setStrength] = useState('500 mg');
  const [form, setForm] = useState<MedicationForm>('tablet');
  const [dose, setDose] = useState('1 tablet');
  const [purpose, setPurpose] = useState('');
  const [frequency, setFrequency] = useState<ScheduleFrequency>('daily');
  const [timesOfDay, setTimesOfDay] = useState<TimeOfDay[]>(['morning', 'night']);
  const [exactTimes, setExactTimes] = useState<string[]>(['08:00', '20:00']);
  const [foodInstruction, setFoodInstruction] = useState<FoodInstruction>('after_food');
  const [prescribingDoctor, setPrescribingDoctor] = useState('Dr. V. Kulkarni');
  const [doctorMissedInstruction, setDoctorMissedInstruction] = useState(
    'If missed within 2 hours, take after food; otherwise skip and continue normal schedule. Never double dose.'
  );
  const [supplyCount, setSupplyCount] = useState<number>(30);
  const [refillThresholdDays, setRefillThresholdDays] = useState<number>(7);
  const [colorTag, setColorTag] = useState('#3b82f6');
  const [pillDescription, setPillDescription] = useState('White round tablet');

  if (!isOpen) return null;

  const handleSelectPreset = (preset: typeof COMMON_MEDS[0]) => {
    setName(preset.name);
    setStrength(preset.strength);
    setPurpose(preset.purpose);
    setForm(preset.form);
  };

  const handleFrequencyChange = (freq: ScheduleFrequency) => {
    setFrequency(freq);
    if (freq === 'daily') {
      setTimesOfDay(['morning', 'night']);
      setExactTimes(['08:00', '20:00']);
    } else if (freq === 'prn') {
      setTimesOfDay(['afternoon']);
      setExactTimes(['14:00']);
    }
  };

  const handleSave = () => {
    addMedication({
      name,
      strength,
      form,
      dose,
      purpose,
      frequency,
      timesOfDay,
      exactTimes,
      foodInstruction,
      doctorMissedInstruction,
      prescribingDoctor,
      supplyCount,
      refillThresholdDays,
      dailyDoseCount: exactTimes.length,
      startDate: new Date().toISOString().split('T')[0],
      status: 'active',
      colorTag,
      pillDescription,
    });
    onClose();
    setStep(1);
  };

  // Plain language summary (PRD 19.4: "Show a summary and confirm step in plain words")
  const plainEnglishSummary = `Take ${dose} of ${name || 'Medication'} (${strength}) ${
    frequency === 'daily'
      ? `every day at ${exactTimes.join(' and ')}`
      : frequency === 'prn'
      ? 'as needed for symptoms'
      : `${frequency}`
  } ${foodInstruction.replace('_', ' ')}. Sourced from ${prescribingDoctor}.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6 animate-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Add New Medication
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Guided safety onboarding • Step {step} of 4
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { s: 1, label: 'Basics' },
            { s: 2, label: 'Schedule' },
            { s: 3, label: 'Safety' },
            { s: 4, label: 'Confirm' },
          ].map((item) => (
            <div
              key={item.s}
              className={`text-center py-2 rounded-xl text-xs font-bold transition-all ${
                step === item.s
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : step > item.s
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {item.s}. {item.label}
            </div>
          ))}
        </div>

        {/* STEP 1: Medication Basics */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Quick-Select Common Prescriptions:
              </label>
              <div className="flex flex-wrap gap-2">
                {COMMON_MEDS.slice(0, 5).map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-xs font-semibold text-slate-700 transition-colors"
                  >
                    + {preset.name} ({preset.strength})
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Medication Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Metformin, Amlodipine"
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Strength / Dosage *
                </label>
                <input
                  type="text"
                  value={strength}
                  onChange={(e) => setStrength(e.target.value)}
                  placeholder="e.g. 500 mg, 5 mg, 10 ml"
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Form
                </label>
                <select
                  value={form}
                  onChange={(e) => setForm(e.target.value as MedicationForm)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="tablet">Tablet</option>
                  <option value="capsule">Capsule</option>
                  <option value="syrup">Syrup / Liquid</option>
                  <option value="injection">Injection</option>
                  <option value="drops">Drops</option>
                  <option value="inhaler">Inhaler</option>
                  <option value="topical">Topical / Ointment</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Primary Medical Purpose
                </label>
                <input
                  type="text"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g. Blood pressure, Diabetes, Pain relief"
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Dose Unit
                </label>
                <input
                  type="text"
                  value={dose}
                  onChange={(e) => setDose(e.target.value)}
                  placeholder="e.g. 1 tablet, 2 puffs, 5 ml"
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Pill Appearance Description
                </label>
                <input
                  type="text"
                  value={pillDescription}
                  onChange={(e) => setPillDescription(e.target.value)}
                  placeholder="e.g. Small yellow round tablet"
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Visual Pill Color Tag
              </label>
              <div className="flex items-center space-x-3">
                {['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#ef4444', '#64748b'].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setColorTag(color)}
                    className={`w-8 h-8 rounded-full transition-transform ${
                      colorTag === color ? 'scale-125 ring-2 ring-slate-800' : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Schedule & Dosing */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Frequency
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { value: 'daily', label: 'Daily (Morning & Night)' },
                  { value: 'weekdays', label: 'Specific Weekdays' },
                  { value: 'prn', label: 'As Needed (PRN)' },
                  { value: 'every_n_hours', label: 'Every 8 Hours' },
                  { value: 'course_limited', label: 'Course Limited (Antibiotic)' },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => handleFrequencyChange(item.value as ScheduleFrequency)}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                      frequency === item.value
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-1 ring-emerald-400'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Scheduled Daily Times
                </label>
                <div className="space-y-2">
                  {exactTimes.map((time, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => {
                          const updated = [...exactTimes];
                          updated[idx] = e.target.value;
                          setExactTimes(updated);
                        }}
                        className="p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500"
                      />
                      <span className="text-xs text-slate-400">Dose {idx + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Food Instructions
                </label>
                <select
                  value={foodInstruction}
                  onChange={(e) => setFoodInstruction(e.target.value as FoodInstruction)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="after_food">Take after food / meal</option>
                  <option value="before_food">Take before food / empty stomach</option>
                  <option value="with_food">Take with food or milk</option>
                  <option value="before_sleep">Take right before sleep</option>
                  <option value="anytime">Anytime with a glass of water</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Safety & Supply */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Current Supply (Pills)
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={supplyCount}
                  onChange={(e) => setSupplyCount(Number(e.target.value))}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Refill Alert Threshold (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={refillThresholdDays}
                  onChange={(e) => setRefillThresholdDays(Number(e.target.value))}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Prescribing Doctor
                </label>
                <input
                  type="text"
                  value={prescribingDoctor}
                  onChange={(e) => setPrescribingDoctor(e.target.value)}
                  placeholder="e.g. Dr. V. Kulkarni"
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Doctor-Entered Missed-Dose Advice *
              </label>
              <textarea
                value={doctorMissedInstruction}
                onChange={(e) => setDoctorMissedInstruction(e.target.value)}
                placeholder="Doctor's exact prescription instructions in case a dose is missed..."
                rows={3}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                CareCircle never invents clinical advice. This instruction will be shown to the elder and caretakers if a dose is skipped or overdue.
              </p>
            </div>
          </div>
        )}

        {/* STEP 4: Summary & Confirm Step in Plain Words (PRD 19.4) */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="bg-emerald-50 rounded-2xl p-5 border-2 border-emerald-300 space-y-3">
              <div className="flex items-center space-x-2 text-emerald-800">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <h4 className="text-base font-extrabold">Plain-Language Safety Confirmation</h4>
              </div>
              <p className="text-base font-bold text-slate-900 leading-relaxed bg-white p-4 rounded-xl border border-emerald-200">
                &ldquo;{plainEnglishSummary}&rdquo;
              </p>
              <p className="text-xs text-emerald-800">
                Please double-check this plain-English explanation against the doctor&apos;s physical prescription slip before saving.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Pills in Stock:</span>
                <span className="font-bold text-slate-900">{supplyCount} tablets (~{Math.ceil(supplyCount / (exactTimes.length || 1))} days)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Refill Alert Trigger:</span>
                <span className="font-bold text-slate-900">{refillThresholdDays} days before run-out</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Prescribing Clinician:</span>
                <span className="font-bold text-slate-900">{prescribingDoctor}</span>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => (prev - 1) as any)}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div></div>
          )}

          {step < 4 ? (
            <button
              type="button"
              disabled={!name.trim()}
              onClick={() => setStep((prev) => (prev + 1) as any)}
              className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm shadow-md"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base shadow-lg shadow-emerald-600/30"
            >
              <Check className="w-5 h-5" />
              <span>Confirm & Save Schedule</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

