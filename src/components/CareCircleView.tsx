import React, { useState } from 'react';
import { useCare } from '../context/useCare';
import {
  Key,
  Copy,
  Check,
  Trash2,
  UserPlus,
  X,
  AlertCircle,
  Stethoscope,
  Phone,
  Building2,
  MapPin,
  Clock,
  Plus,
  Users,
  ShieldCheck,
  Pill,
} from 'lucide-react';
import { Role, InviteCode } from '../types';

export const CareCircleView: React.FC = () => {
  const {
    profile,
    members,
    doctors,
    currentMember,
    invites,
    createInvite,
    redeemInvite,
    revokeMember,
    addDoctor,
  } = useCare();

  const [activeTab, setActiveTab] = useState<'members' | 'doctors'>('members');

  // Member invite modal state
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>('family_contributor');
  const [expiryHours, setExpiryHours] = useState<number>(48);
  const [lastGeneratedInvite, setLastGeneratedInvite] = useState<InviteCode | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Redeem modal state
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
  const [passcodeToRedeem, setPasscodeToRedeem] = useState('');
  const [redeemName, setRedeemName] = useState('');
  const [redeemEmail, setRedeemEmail] = useState('');
  const [redeemPin, setRedeemPin] = useState('');
  const [redeemError, setRedeemError] = useState('');

  // Add Doctor modal state
  const [isAddDoctorModalOpen, setIsAddDoctorModalOpen] = useState(false);
  const [docName, setDocName] = useState('');
  const [docSpecialty, setDocSpecialty] = useState('Cardiologist & Internal Medicine');
  const [docHospital, setDocHospital] = useState('Lilavati Hospital, Mumbai');
  const [docPhone, setDocPhone] = useState('+91 ');
  const [docEmergencyPhone, setDocEmergencyPhone] = useState('+91 ');
  const [docClinicAddress, setDocClinicAddress] = useState('');
  const [docConsultationHours, setDocConsultationHours] = useState('Mon - Thu, 10:00 AM - 1:00 PM');
  const [docEmail, setDocEmail] = useState('');
  const [docNotes, setDocNotes] = useState('');

  const isOwner = currentMember.role === 'elder';

  const roleDescriptions: Record<Role, { title: string; desc: string }> = {
    elder: {
      title: 'Elder (Owner)',
      desc: 'Controls full care ecosystem, approves circle members, views all medical schedules.',
    },
    primary_caretaker: {
      title: 'Primary Caretaker',
      desc: 'Manages daily medications, schedules doctor visits, performs shift handoffs, and logs doses with attribution.',
    },
    caretaker: {
      title: 'Visiting Caretaker / Nurse',
      desc: 'Administers daily medication, logs doses, records vitals and adds care notes during visits.',
    },
    family_contributor: {
      title: 'Family Contributor',
      desc: 'Views adherence, volunteers for clinic visits, adds family care notes, and suggests medication updates.',
    },
    family_view: {
      title: 'Family (View Only)',
      desc: 'Permissioned visibility into general adherence without access to private clinical appointment notes.',
    },
  };

  const handleGenerateInvite = () => {
    const invite = createInvite(selectedRole, expiryHours);
    setLastGeneratedInvite(invite);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleRedeem = (e: React.FormEvent) => {
    e.preventDefault();
    setRedeemError('');
    const result = redeemInvite(passcodeToRedeem, redeemName, redeemEmail);
    if (!result.success) {
      setRedeemError(result.message);
    } else {
      setIsRedeemModalOpen(false);
      setPasscodeToRedeem('');
      setRedeemName('');
      setRedeemEmail('');
      setRedeemPin('');
    }
  };

  const handleSaveDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;

    addDoctor({
      name: docName.trim(),
      specialty: docSpecialty.trim(),
      hospital: docHospital.trim(),
      phone: docPhone.trim(),
      emergencyPhone: docEmergencyPhone.trim() || undefined,
      clinicAddress: docClinicAddress.trim(),
      consultationHours: docConsultationHours.trim(),
      email: docEmail.trim() || undefined,
      notes: docNotes.trim() || undefined,
    });

    setIsAddDoctorModalOpen(false);
    setDocName('');
    setDocNotes('');
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Care Ecosystem
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Trusted family circle, home caregivers, and medical specialists for <strong>{profile.elderName}</strong>.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {activeTab === 'members' ? (
            <>
              <button
                onClick={() => setIsRedeemModalOpen(true)}
                className="px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition-colors"
              >
                I Have an Invite Code
              </button>

              <button
                onClick={() => {
                  setLastGeneratedInvite(null);
                  setIsInviteModalOpen(true);
                }}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span>Invite Family / Caretaker</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsAddDoctorModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Specialist / Doctor</span>
            </button>
          )}
        </div>
      </div>

      {/* Segmented Tab Switcher */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('members')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'members'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Family & Caregivers ({members.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('doctors')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'doctors'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>Doctors & Medical Specialists ({doctors.length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: FAMILY & CAREGIVERS                                                */}
      {/* ========================================================================= */}
      {activeTab === 'members' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {members.map((member) => {
              const isElder = member.role === 'elder';

              return (
                <div
                  key={member.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-slate-200 hover:border-slate-300 transition-all shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
                          {member.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="text-base font-extrabold text-slate-900">{member.name}</h4>
                            {isElder && (
                              <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                                OWNER
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-bold text-emerald-700 mt-0.5">
                            {roleDescriptions[member.role]?.title || member.role}
                          </p>
                          <p className="text-xs text-slate-400">{member.relationship}</p>
                        </div>
                      </div>

                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                        Active
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      {roleDescriptions[member.role]?.desc}
                    </p>

                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                      <span>{member.email}</span>
                      <span>Last active: {member.lastActive}</span>
                    </div>
                  </div>

                  {/* Revoke Action */}
                  {!isElder && isOwner && (
                    <div className="pt-3 border-t border-slate-100 flex justify-end">
                      <button
                        onClick={() => revokeMember(member.id)}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center space-x-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Revoke Access</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Active Pending Invites */}
          {invites.filter((i) => !i.used).length > 0 && (
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-4">
              <div className="flex items-center space-x-2 text-slate-800">
                <Key className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-extrabold">Active Single-Use Invite Passcodes</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {invites
                  .filter((i) => !i.used)
                  .map((inv) => (
                    <div
                      key={inv.id}
                      className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-base font-extrabold text-slate-900 tracking-wider">
                            {inv.code}
                          </span>
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                            {inv.role}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Expires: {new Date(inv.expiresAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>

                      <button
                        onClick={() => handleCopyCode(inv.code)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        title="Copy passcode"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: DOCTORS & MEDICAL SPECIALISTS                                       */}
      {/* ========================================================================= */}
      {activeTab === 'doctors' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {doctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-emerald-500/40 transition-all shadow-sm flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  {/* Doctor Title Bar */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start space-x-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-extrabold text-base shadow-sm shrink-0">
                        <Stethoscope className="w-6 h-6 text-emerald-700" />
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                          {doc.name}
                        </h4>
                        <span className="inline-block mt-1 text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                          {doc.specialty}
                        </span>
                      </div>
                    </div>

                    <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full shrink-0 flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
                      <span>Verified</span>
                    </span>
                  </div>

                  {/* Hospital & Location */}
                  <div className="space-y-2 text-xs text-slate-600 pt-1">
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-800">{doc.hospital}</span>
                    </div>

                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span className="text-slate-500 leading-relaxed">{doc.clinicAddress}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="text-slate-600">Hours: <strong>{doc.consultationHours}</strong></span>
                    </div>
                  </div>

                  {/* Doctor Advisory Notes */}
                  {doc.notes && (
                    <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-200/60 text-xs text-amber-900">
                      <p className="font-semibold mb-0.5">Clinical Focus & Guidance:</p>
                      <p className="text-amber-800 leading-relaxed">{doc.notes}</p>
                    </div>
                  )}

                  {/* Prescribed Meds */}
                  {doc.prescribedMedicationIds && doc.prescribedMedicationIds.length > 0 && (
                    <div className="pt-1 flex items-center space-x-2 text-xs text-slate-500">
                      <Pill className="w-3.5 h-3.5 text-slate-400" />
                      <span>Prescribing doctor for {doc.prescribedMedicationIds.length} active medications</span>
                    </div>
                  )}
                </div>

                {/* Contact Actions Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <a
                    href={`tel:${doc.phone.replace(/\s+/g, '')}`}
                    className="flex-1 flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Call Clinic</span>
                  </a>

                  {doc.emergencyPhone && (
                    <a
                      href={`tel:${doc.emergencyPhone.replace(/\s+/g, '')}`}
                      className="flex items-center space-x-1.5 py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs border border-rose-200 transition-colors"
                      title="Emergency Hospital Helpline"
                    >
                      <span>Emergency Helpline</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD DOCTOR / SPECIALIST                                             */}
      {/* ========================================================================= */}
      {isAddDoctorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 my-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Add Doctor / Specialist</h3>
              </div>
              <button
                onClick={() => setIsAddDoctorModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDoctor} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Doctor Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="e.g. Dr. Ramesh Deshpande"
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Medical Specialty *
                </label>
                <input
                  type="text"
                  required
                  value={docSpecialty}
                  onChange={(e) => setDocSpecialty(e.target.value)}
                  placeholder="e.g. Cardiologist, Neurologist, Orthopedic"
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Hospital / Medical Centre *
                </label>
                <input
                  type="text"
                  required
                  value={docHospital}
                  onChange={(e) => setDocHospital(e.target.value)}
                  placeholder="e.g. Lilavati Hospital, Mumbai"
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Clinic Phone *
                  </label>
                  <input
                    type="text"
                    required
                    value={docPhone}
                    onChange={(e) => setDocPhone(e.target.value)}
                    placeholder="+91 98220 12345"
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Emergency Line (Optional)
                  </label>
                  <input
                    type="text"
                    value={docEmergencyPhone}
                    onChange={(e) => setDocEmergencyPhone(e.target.value)}
                    placeholder="+91 22 2675 0000"
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Clinic OPD Address
                </label>
                <input
                  type="text"
                  value={docClinicAddress}
                  onChange={(e) => setDocClinicAddress(e.target.value)}
                  placeholder="e.g. Suite 402, Lilavati Hospital OPD, Bandra West"
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Consultation Days & Hours
                </label>
                <input
                  type="text"
                  value={docConsultationHours}
                  onChange={(e) => setDocConsultationHours(e.target.value)}
                  placeholder="e.g. Mon - Thu, 10:00 AM - 1:30 PM"
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Doctor / Clinic Email (Optional)
                </label>
                <input
                  type="email"
                  value={docEmail}
                  onChange={(e) => setDocEmail(e.target.value)}
                  placeholder="e.g. clinic@lilavatihospital.com"
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Clinical Advice / Follow-up Notes
                </label>
                <textarea
                  rows={2}
                  value={docNotes}
                  onChange={(e) => setDocNotes(e.target.value)}
                  placeholder="e.g. Managing hypertension and knee stiffness. Advised quarterly HbA1c review."
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition-colors"
              >
                Save Doctor to Care Team
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: GENERATE INVITE                                                    */}
      {/* ========================================================================= */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">Invite Care Circle Member</h3>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!lastGeneratedInvite ? (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                    Select Member Role:
                  </label>
                  <div className="space-y-2">
                    {[
                      { role: 'family_contributor', label: 'Family Contributor (Rohan / Ananya)', desc: 'Can view adherence, notes, volunteer for clinic visits' },
                      { role: 'caretaker', label: 'Visiting Caretaker / Nurse (Sunita / Dr. Jyoti)', desc: 'Can log doses on behalf, record vitals, add care notes' },
                      { role: 'primary_caretaker', label: 'Primary Caretaker (Meena)', desc: 'Full care management and appointment scheduling' },
                      { role: 'family_view', label: 'Family View Only (Vikram)', desc: 'Can view overall health without clinical notes' },
                    ].map((item) => (
                      <label
                        key={item.role}
                        className={`flex items-start space-x-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          selectedRole === item.role
                            ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-400'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="inviteRole"
                          value={item.role}
                          checked={selectedRole === item.role}
                          onChange={() => setSelectedRole(item.role as Role)}
                          className="w-4 h-4 text-emerald-600 mt-0.5 focus:ring-emerald-500"
                        />
                        <div>
                          <p className="text-sm font-bold text-slate-900">{item.label}</p>
                          <p className="text-xs text-slate-500">{item.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Passcode Expiration (PRD AC-2):
                  </label>
                  <select
                    value={expiryHours}
                    onChange={(e) => setExpiryHours(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value={24}>24 Hours</option>
                    <option value={48}>48 Hours (Recommended)</option>
                    <option value={72}>72 Hours</option>
                  </select>
                </div>

                <button
                  onClick={handleGenerateInvite}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition-colors"
                >
                  Generate Single-Use Passcode
                </button>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Key className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Passcode Ready to Share</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Send this single-use passcode to your family member or caregiver. It expires in {expiryHours} hours.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300">
                  <span className="font-mono text-3xl font-extrabold tracking-widest text-slate-900">
                    {lastGeneratedInvite.code}
                  </span>
                </div>

                <div className="flex items-center justify-center space-x-3">
                  <button
                    onClick={() => handleCopyCode(lastGeneratedInvite.code)}
                    className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedCode ? 'Copied to Clipboard!' : 'Copy Passcode'}</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 pt-2">
                  Security guarantee: Once redeemed, each member sets their own private PIN. The shared code cannot be reused.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: REDEEM PASSCODE                                                    */}
      {/* ========================================================================= */}
      {isRedeemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">Join CareCircle</h3>
              <button
                onClick={() => setIsRedeemModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRedeem} className="space-y-4">
              {redeemError && (
                <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-xs text-rose-800 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{redeemError}</span>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  8-Character Invite Passcode *
                </label>
                <input
                  type="text"
                  required
                  value={passcodeToRedeem}
                  onChange={(e) => setPasscodeToRedeem(e.target.value.toUpperCase())}
                  placeholder="e.g. CARE-7842"
                  className="w-full p-3 rounded-xl border border-slate-200 font-mono font-bold text-base focus:ring-2 focus:ring-emerald-500 uppercase tracking-wider"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={redeemName}
                  onChange={(e) => setRedeemName(e.target.value)}
                  placeholder="e.g. Ananya Sharma"
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Your Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={redeemEmail}
                  onChange={(e) => setRedeemEmail(e.target.value)}
                  placeholder="e.g. ananya@example.com"
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Create Your Personal 4-Digit Access PIN *
                </label>
                <input
                  type="password"
                  maxLength={6}
                  required
                  value={redeemPin}
                  onChange={(e) => setRedeemPin(e.target.value)}
                  placeholder="••••"
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm font-mono tracking-widest focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition-colors"
              >
                Join Savitri&apos;s Circle
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
