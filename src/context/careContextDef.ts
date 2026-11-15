import { createContext } from 'react';
import {
  CareProfile,
  Member,
  Medication,
  DoseEvent,
  Appointment,
  CareNote,
  CareTask,
  ShiftHandoff,
  AuditLogEntry,
  InviteCode,
  SimulatedEmail,
  Role,
  DoseStatus,
  MissedReason,
} from '../types';
import { translations, Language } from '../i18n/translations';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  undoAction?: () => void;
  undoLabel?: string;
}

export interface CareContextType {
  // State
  profile: CareProfile;
  currentMember: Member;
  members: Member[];
  medications: Medication[];
  doses: DoseEvent[];
  appointments: Appointment[];
  careNotes: CareNote[];
  careTasks: CareTask[];
  shiftHandoffs: ShiftHandoff[];
  auditLogs: AuditLogEntry[];
  invites: InviteCode[];
  emails: SimulatedEmail[];
  toasts: ToastMessage[];

  // Accessibility & UI
  language: Language;
  textSize: 'normal' | 'large' | 'xl';
  isHighContrast: boolean;
  isElderMode: boolean;
  t: (typeof translations)['en'];

  // Actions
  switchMember: (memberId: string) => void;
  updateProfile: (updated: Partial<CareProfile>) => void;
  setLanguage: (lang: Language) => void;
  setTextSize: (size: 'normal' | 'large' | 'xl') => void;
  toggleHighContrast: () => void;
  toggleElderMode: () => void;

  // Dose & Med Actions
  logDose: (doseId: string, status: DoseStatus, reason?: MissedReason, notes?: string) => void;
  snoozeDose: (doseId: string, minutes?: number) => void;
  addMedication: (med: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMedication: (id: string, updated: Partial<Medication>) => void;
  discontinueMedication: (id: string, reason: string) => void;

  // Appointment Actions
  addAppointment: (apt: Omit<Appointment, 'id' | 'status'>) => void;
  volunteerForAppointment: (aptId: string) => void;
  toggleChecklistItem: (aptId: string, checklistId: string) => void;
  saveAppointmentOutcome: (aptId: string, notes: string) => void;
  exportAppointmentIcs: (apt: Appointment) => void;

  // Circle & Privacy Actions
  createInvite: (role: Role, expiryHours?: number) => InviteCode;
  redeemInvite: (code: string, name: string, email: string) => { success: boolean; message: string };
  revokeMember: (memberId: string) => void;
  updateMemberPermissions: (memberId: string, permissions: Partial<Member>) => void;

  // Notes & Tasks Actions
  addCareNote: (content: string, category: CareNote['category'], isPrivate?: boolean) => void;
  addCareTask: (title: string, dueDate: string, description?: string) => void;
  claimTask: (taskId: string) => void;
  completeTask: (taskId: string) => void;
  addShiftHandoff: (data: Omit<ShiftHandoff, 'id' | 'timestamp'>) => void;

  // Email Action Simulator (1-Tap Tokens)
  executeEmailAction: (token: string, action: string, targetId: string) => { success: boolean; message: string };
  markEmailRead: (emailId: string) => void;

  // Voice & Helpers
  speakText: (text: string) => void;
  dismissToast: (id: string) => void;
  showToast: (msg: string, type?: ToastMessage['type'], undoAction?: () => void) => void;
  resetAllData: () => void;
}

export const CareContext = createContext<CareContextType | undefined>(undefined);

