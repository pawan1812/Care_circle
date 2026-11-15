// Firestore Data Model according to PRD & Production Architecture

export type Role = 'owner' | 'primaryCaretaker' | 'caretaker' | 'familyContributor' | 'familyView';
export type DoseStatus = 'upcoming' | 'taken' | 'late' | 'missed' | 'skipped' | 'due' | 'snoozed';

export interface PrivacySettings {
  allowFullPrescriptionView: boolean;
  allowClinicalNotesView: boolean;
  allowGpsLocationSharing: boolean;
  requireApprovalForAppointments: boolean;
  notifyOnEveryDose: boolean;
}

export interface EscalationLadderConfig {
  graceWindowMinutes: number; // e.g. 15m quiet
  primaryNudgeDelayMinutes: number; // e.g. 30m
  remoteFamilyEscalationMinutes: number; // e.g. 60m
  enabled: boolean;
}

export interface FirestoreProfile {
  id: string;
  elderName: string;
  dob: string;
  language: string;
  timezone: string;
  privacySettings: PrivacySettings;
  escalationLadder: EscalationLadderConfig;
  approvalMode: boolean;
  ownerUid: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  primaryDoctorName?: string;
  primaryDoctorPhone?: string;
  bloodGroup?: string;
  allergies?: string[];
  createdAt: string;
}

export interface FirestoreMember {
  uid: string;
  email: string;
  name: string;
  role: Role;
  visibility: {
    canViewMeds: boolean;
    canViewVitals: boolean;
    canViewNotes: boolean;
    canViewLocation: boolean;
  };
  notificationPrefs: {
    email: boolean;
    sms: boolean;
    instantDoseAlerts: boolean;
    missedDoseEscalation: boolean;
  };
  accessExpiresAt: string | null;
  status: 'active' | 'revoked' | 'pending';
}

export interface FirestoreInvite {
  id: string;
  role: Role;
  passcodeHash: string;
  expiresAt: string;
  usedBy: string | null;
  createdBy: string;
  status: 'active' | 'used' | 'expired';
}

export interface FirestoreMedication {
  id: string;
  name: string;
  strength: string;
  form: 'tablet' | 'capsule' | 'liquid' | 'injection' | 'inhaler' | 'drops';
  instructions: string;
  missedDoseInstruction: string;
  supplyCount: number;
  refillThresholdDays: number;
  status: 'active' | 'paused' | 'discontinued';
  prescriber: string;
  photoUrl: string | null;
  colorTag?: string;
  dailyDoseCount?: number;
}

export interface FirestoreSchedule {
  id: string;
  recurrenceRule: string; // 'daily' | 'twice_daily' | 'weekly'
  times: string[]; // e.g. ['08:00', '20:00']
  startDate: string;
  endDate: string | null;
}

export interface FirestoreDoseEvent {
  id: string;
  medId: string;
  medName?: string;
  strength?: string;
  scheduledAt: string; // ISO string
  timeSlot: 'morning' | 'afternoon' | 'evening' | 'night';
  status: DoseStatus;
  loggedBy: string | null; // e.g. 'Savitri (Self)' or 'Meena (Caretaker)'
  loggedAt: string | null;
  reason: string | null;
  notes?: string;
}

export interface FirestoreAppointment {
  id: string;
  doctor: string;
  specialty: string;
  location: string;
  datetime: string;
  purpose: string;
  accompanyingPerson: string | null;
  checklist: Array<{ id: string; text: string; done: boolean }>;
  outcomeNotes: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  contactPhone?: string;
}

export interface FirestoreCareNote {
  id: string;
  content: string;
  author: string;
  authorRole: string;
  category: 'general' | 'vital' | 'incident' | 'doctor';
  timestamp: string;
  isPrivate: boolean;
}

export interface FirestoreCareTask {
  id: string;
  title: string;
  dueDate: string;
  assignedTo: string | null;
  status: 'pending' | 'in_progress' | 'completed';
  description?: string;
}

export interface FirestoreDoctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  phone: string;
  emergencyPhone?: string;
  clinicAddress: string;
  consultationHours: string;
  email?: string;
  notes?: string;
  prescribedMedicationIds?: string[];
  nextAppointmentDate?: string;
}

export interface FirestoreAuditLog {
  id: string;
  action: string;
  actorName: string;
  actorRole: string;
  details: string;
  timestamp: string;
}
