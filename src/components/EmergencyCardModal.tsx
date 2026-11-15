import React, { useEffect, useState } from 'react';
import { useCare } from '../context/useCare';
import {
  X,
  ShieldAlert,
  Phone,
  Printer,
  QrCode,
  Check,
  Share2,
} from 'lucide-react';
import QRCode from 'qrcode';

interface EmergencyCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyCardModal: React.FC<EmergencyCardModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { profile, medications } = useCare();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);

  const activeMeds = medications.filter((m) => m.status === 'active');

  // Generate QR code for Emergency Card
  useEffect(() => {
    if (isOpen) {
      const emergencySummary = `CareCircle SOS: ${profile.elderName} | Blood: ${profile.bloodGroup} | Allergies: ${profile.allergies.join(', ')} | Emergency Contact: ${profile.emergencyContactName} (${profile.emergencyContactPhone}) | Lilavati OPD Dr. Kulkarni: ${profile.primaryDoctorPhone}`;
      QRCode.toDataURL(emergencySummary, { width: 200, margin: 1 })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error(err));
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const handleCopyCard = () => {
    navigator.clipboard.writeText(
      `CARECIRCLE EMERGENCY INFO:\nPatient: ${profile.elderName} (74y)\nBlood Group: ${profile.bloodGroup}\nAllergies: ${profile.allergies.join(', ')}\nEmergency Contact: ${profile.emergencyContactName} (${profile.emergencyContactPhone})\nLilavati Doctor: ${profile.primaryDoctorName} (${profile.primaryDoctorPhone})`
    );
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border-2 border-rose-200 p-6 sm:p-8 space-y-6 animate-in zoom-in-95 my-6">
        
        {/* Modal Controls Bar (Hidden during print) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 no-print">
          <div className="flex items-center space-x-2 text-rose-700">
            <ShieldAlert className="w-6 h-6 text-rose-600" />
            <h3 className="text-xl font-extrabold text-slate-900">
              Emergency Health Card (SOS)
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.print()}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
              title="Print wallet-sized emergency card"
            >
              <Printer className="w-4 h-4" />
              <span>Print Wallet Card</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* WALLET-SIZED EMERGENCY CARD CONTAINER */}
        <div className="border-2 border-rose-500 rounded-3xl p-6 bg-gradient-to-b from-rose-50/50 via-white to-white shadow-md space-y-5">
          
          {/* Card Top Banner */}
          <div className="flex items-center justify-between border-b-2 border-rose-200 pb-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">
                EMERGENCY MEDICAL CARD
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                {profile.elderName}
              </h2>
              <p className="text-xs text-slate-500">
                Age: 74 Years • Gender: {profile.gender}
              </p>
            </div>

            {/* Blood Group Highlight */}
            <div className="text-center bg-rose-600 text-white p-3 rounded-2xl shadow-sm">
              <span className="text-[10px] uppercase font-bold tracking-wider block opacity-90">Blood</span>
              <span className="text-2xl font-black">{profile.bloodGroup.split(' ')[0]}</span>
            </div>
          </div>

          {/* Critical Responders Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            
            {/* Primary Emergency Contact */}
            <div className="bg-white p-3.5 rounded-2xl border border-rose-200 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Primary Emergency Contact
              </span>
              <p className="text-sm font-extrabold text-slate-900">{profile.emergencyContactName}</p>
              <a
                href={`tel:${profile.emergencyContactPhone}`}
                className="inline-flex items-center space-x-1.5 text-rose-700 font-extrabold hover:underline"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{profile.emergencyContactPhone}</span>
              </a>
            </div>

            {/* Primary Physician */}
            <div className="bg-white p-3.5 rounded-2xl border border-rose-200 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Primary Doctor & Hospital
              </span>
              <p className="text-sm font-extrabold text-slate-900">{profile.primaryDoctorName}</p>
              <a
                href={`tel:${profile.primaryDoctorPhone}`}
                className="inline-flex items-center space-x-1.5 text-blue-700 font-extrabold hover:underline"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{profile.primaryDoctorPhone}</span>
              </a>
            </div>

          </div>

          {/* Known Allergies & Conditions */}
          <div className="space-y-3 text-xs">
            <div className="bg-rose-100/70 p-3 rounded-xl border border-rose-300">
              <span className="font-extrabold text-rose-900 uppercase tracking-wide block mb-1">
                ⚠️ Severe Allergies:
              </span>
              <p className="font-bold text-rose-950 text-sm">
                {profile.allergies.join(' • ')}
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-600 uppercase tracking-wide block mb-1">
                Chronic Medical Conditions:
              </span>
              <p className="font-semibold text-slate-900">
                {profile.chronicConditions.join(' • ')}
              </p>
            </div>
          </div>

          {/* Current Active Medications */}
          <div className="space-y-1.5 text-xs">
            <span className="font-bold text-slate-700 uppercase tracking-wider block">
              Active Prescriptions:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {activeMeds.map((med) => (
                <div key={med.id} className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-900">{med.name} {med.strength}</span>
                  <span className="text-[10px] text-slate-500 block">{med.exactTimes.join(', ')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* QR Code for First Responders & Paramedics */}
          <div className="pt-3 border-t border-rose-200 flex items-center justify-between">
            <div className="text-xs space-y-1 max-w-xs">
              <span className="font-extrabold text-slate-900 flex items-center space-x-1">
                <QrCode className="w-4 h-4 text-rose-600" />
                <span>Scan for First Responders</span>
              </span>
              <p className="text-[11px] text-slate-500 leading-snug">
                Paramedics can scan this QR code instantly on any camera phone without requiring an app or login.
              </p>
            </div>

            {qrDataUrl && (
              <img
                src={qrDataUrl}
                alt="Emergency Health QR Code"
                className="w-24 h-24 rounded-xl border-2 border-slate-300 p-1 bg-white shadow-xs"
              />
            )}
          </div>

        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between pt-2 no-print">
          <button
            onClick={handleCopyCard}
            className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 hover:text-slate-900"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            <span>{copiedLink ? 'Copied Emergency Summary!' : 'Copy Summary Text'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs sm:text-sm hover:bg-slate-800"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

