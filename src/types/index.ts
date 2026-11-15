export type Role = 
  | 'elder' 
  | 'primary_caretaker' 
  | 'caretaker' 
  | 'family_contributor' 
  | 'family_view';

export type DoseStatus = 'upcoming' | 'due' | 'taken' | 'late' | 'missed' | 'skipped' | 'snoozed';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export type MedicationForm = 
  | 'tablet' 
  | 'capsule' 
  | 'syrup' 
  | 'injection' 
  | 'drops' 
  | 'inhaler' 
  | 'topical' 
  | 'other';

export type ScheduleFrequency = 
  | 'daily' 
  | 'weekdays' 
  | 'every_n_hours' 
  | 'prn' 
  | 'tapering' 
  | 'course_limited';

export type FoodInstruction = 
  | 'with_food' 
  | 'before_food' 
  | 'after_food' 
  | 'empty_stomach' 
  | 'before_sleep' 
  | 'anytime';

export type MissedReason = 
  | 'forgot' 
  | 'felt_unwell' 
  | 'side_effect' 
  | 'ran_out' 
  | 'sleeping' 
  | 'doctor_advised' 
  | 'other';

export interface Medication {
  id: string;
  name: string;
  genericName?: string;
  strength: string; // e.g. "500 mg"
  form: MedicationForm;
  dose: string; // e.g. "1 tablet"
  frequency: ScheduleFrequency;
  timesOfDay: TimeOfDay[]; // ['morning', 'night']
  exactTimes: string[]; // ['08:00', '20:00']
  foodInstruction: FoodInstruction;
  doctorMissedInstruction: string; // Doctor guidance: e.g. "If missed, take within 2 hours; otherwise skip"
  prescribingDoctor: string;
  doctorPhone?: string;
  purpose: string; // e.g. "Blood pressure control"
  colorTag: string; // e.g. "blue", "yellow", "white", "pink"
  supplyCount: number; // current pills left
  refillThresholdDays: number; // default 7 days
  dailyDoseCount: number; // pills taken per day
  startDate: string; // YYYY-MM-DD
  endDate?: string;
  status: 'active' | 'paused' | 'discontinued';
  pausedReason?: string;
  discontinuedReason?: string;
  pillDescription?: string; // e.g. "Small white round tablet with a split line"
  pillPhoto?: string;
  createdAt: string;
  updatedAt: string;
  requiresElderApproval?: boolean;
  approvalStatus?: 'approved' | 'pending';
}

export interface DoseEvent {
  id: string;
  medicationId: string;
  medicationName: string;
  strength: string;
  form: MedicationForm;
  colorTag: string;
  scheduledTime: string; // e.g. "08:00"
  scheduledDate: string; // YYYY-MM-DD
  timeOfDay: TimeOfDay;
  foodInstruction: FoodInstruction;
  doctorMissedInstruction: string;
  status: DoseStatus;
  loggedAt?: string; // ISO string
  loggedBy?: string; // member name
  loggedByRole?: Role;
  reason?: MissedReason;
  notes?: string;
  snoozedUntil?: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  avatar?: string;
  relationship: string; // "Mother", "Son", "Caretaker", "Nurse"
  canViewAdherence: boolean;
  canViewAppointments: boolean;
  canViewNotes: boolean;
  canLogDoses: boolean;
  canManageMeds: boolean;
  receiveEmailAlerts: boolean;
  lastActive: string;
  status: 'active' | 'paused' | 'invited';
}

export interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  location: string;
  address?: string;
  phone?: string;
  datetime: string; // ISO string
  purpose: string;
  notes?: string;
  accompanyingPerson?: string; // Member name or unassigned
  checklist: { id: string; text: string; done: boolean }[];
  outcomeNotes?: string;
  medicationChangesNotes?: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  reminded24h?: boolean;
  reminded2h?: boolean;
}

export interface CareNote {
  id: string;
  authorName: string;
  authorRole: Role;
  content: string;
  category: 'general' | 'vital' | 'symptom' | 'doctor_visit' | 'mood';
  date: string; // ISO string
  isPrivateToElder?: boolean;
}

export interface CareTask {
  id: string;
  title: string;
  description?: string;
  assignedTo?: string; // Member name
  dueDate: string; // YYYY-MM-DD
  status: 'pending' | 'claimed' | 'completed';
  createdBy: string;
  createdAt: string;
}

export interface ShiftHandoff {
  id: string;
  caretakerName: string;
  shiftDate: string;
  shiftType: 'morning' | 'evening' | 'night';
  notes: string;
  vitalsSummary?: string;
  medsGivenSummary: string;
  concerns?: string;
  timestamp: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: Role;
  action: string; // e.g. "LOG_DOSE", "ADD_MEDICATION", "INVITE_MEMBER", "DISCONTINUE_MED"
  entity: string; // e.g. "Dose", "Medication", "Circle", "Privacy"
  details: string;
}

export interface InviteCode {
  id: string;
  code: string;
  role: Role;
  createdBy: string;
  createdAt: string;
  expiresAt: string;
  used: boolean;
  usedByEmail?: string;
}

export interface Doctor {
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

export interface CareProfile {
  id: string;
  elderName: string;
  dateOfBirth: string; // YYYY-MM-DD
  gender: string;
  timezone: string;
  preferredLanguage: 'en' | 'hi' | 'mr';
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  bloodGroup: string;
  allergies: string[];
  chronicConditions: string[];
  hospitalPreference?: string;
  primaryDoctorName: string;
  primaryDoctorPhone: string;
  isApprovalModeEnabled: boolean; // AC-7: sensitive changes need elder approval
  isPublicEmergencyCardEnabled: boolean;
  privacyMaskDrugNamesInEmails: boolean; // NOT-6: "Time for your 8 AM medicines" vs drug names
  escalationSettings: {
    level1Minutes: number; // default 30
    level2Minutes: number; // default 120
    repeatedMissesThreshold: number; // default 3 misses in 7 days
  };
}

export interface SimulatedEmail {
  id: string;
  to: string;
  recipientName: string;
  subject: string;
  previewText: string;
  sentAt: string;
  type: 'upcoming_dose' | 'due_now' | 'missed_level1' | 'missed_level2' | 'appointment_companion' | 'refill_alert' | 'invite';
  token: string;
  actionLinks?: {
    label: string;
    action: 'taken' | 'skip' | 'snooze' | 'volunteer' | 'accept_invite';
    targetId: string;
  }[];
  opened: boolean;
  actionTaken?: string;
}

