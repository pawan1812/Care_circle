import React, { useState, useEffect, useRef } from 'react';
import {
  CareProfile,
  Member,
  Medication,
  Doctor,
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
import {
  initialProfile,
  initialMembers,
  initialDoctors,
  initialMedications,
  initialDoses,
  initialAppointments,
  initialCareNotes,
  initialCareTasks,
  initialShiftHandoffs,
  initialAuditLogs,
  initialInvites,
  initialSimulatedEmails,
} from '../data/seedData';
import { translations, Language } from '../i18n/translations';
import confetti from 'canvas-confetti';
import {
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
  generateSecurePasscode,
  verifyActionToken,
} from '../utils/security';
import { CareContext, ToastMessage } from './careContextDef';
import {
  seedInitialProfileToFirestore,
  logDoseInDb,
  createInviteInDb,
  volunteerForAppointmentInDb,
  addMedicationToDb,
  updateProfileInDb,
} from '../services/firebase/firestoreService';

const STORAGE_PREFIX = 'carecircle_v1_';

export const CareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial from localStorage or defaults
  const [profile, setProfile] = useState<CareProfile>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}profile`);
    return saved ? JSON.parse(saved) : initialProfile;
  });

  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}members`);
    return saved ? JSON.parse(saved) : initialMembers;
  });

  const [currentMemberId, setCurrentMemberId] = useState<string>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}current_member_id`);
    return saved || 'mem-1'; // Default: Savitri (Elder)
  });

  const [medications, setMedications] = useState<Medication[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}medications`);
    return saved ? JSON.parse(saved) : initialMedications;
  });

  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}doctors`);
    return saved ? JSON.parse(saved) : initialDoctors;
  });

  const [doses, setDoses] = useState<DoseEvent[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}doses`);
    return saved ? JSON.parse(saved) : initialDoses;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}appointments`);
    return saved ? JSON.parse(saved) : initialAppointments;
  });

  const [careNotes, setCareNotes] = useState<CareNote[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}careNotes`);
    return saved ? JSON.parse(saved) : initialCareNotes;
  });

  const [careTasks, setCareTasks] = useState<CareTask[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}careTasks`);
    return saved ? JSON.parse(saved) : initialCareTasks;
  });

  const [shiftHandoffs, setShiftHandoffs] = useState<ShiftHandoff[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}shiftHandoffs`);
    return saved ? JSON.parse(saved) : initialShiftHandoffs;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}auditLogs`);
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  const [invites, setInvites] = useState<InviteCode[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}invites`);
    return saved ? JSON.parse(saved) : initialInvites;
  });

  const [emails, setEmails] = useState<SimulatedEmail[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}emails`);
    return saved ? JSON.parse(saved) : initialSimulatedEmails;
  });

  // UI preferences
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem(`${STORAGE_PREFIX}language`) as Language) || 'en';
  });

  const [textSize, setTextSizeState] = useState<'normal' | 'large' | 'xl'>(() => {
    return (localStorage.getItem(`${STORAGE_PREFIX}textSize`) as any) || 'normal';
  });

  const [isHighContrast, setIsHighContrast] = useState<boolean>(() => {
    return localStorage.getItem(`${STORAGE_PREFIX}highContrast`) === 'true';
  });

  const [isElderMode, setIsElderMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}elderMode`);
    return saved !== null ? saved === 'true' : true; // Default to Elder Mode true
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const toastCounterRef = useRef(0);

  // Current active member
  const currentMember = members.find((m) => m.id === currentMemberId) || members[0];

  // Auto-seed and initialize Firestore on mount
  useEffect(() => {
    seedInitialProfileToFirestore('savitri_sharma_profile').catch(() => {});
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}profile`, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}members`, JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}current_member_id`, currentMemberId);
  }, [currentMemberId]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}medications`, JSON.stringify(medications));
  }, [medications]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}doctors`, JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}doses`, JSON.stringify(doses));
  }, [doses]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}appointments`, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}careNotes`, JSON.stringify(careNotes));
  }, [careNotes]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}careTasks`, JSON.stringify(careTasks));
  }, [careTasks]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}shiftHandoffs`, JSON.stringify(shiftHandoffs));
  }, [shiftHandoffs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}auditLogs`, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}invites`, JSON.stringify(invites));
  }, [invites]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}emails`, JSON.stringify(emails));
  }, [emails]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}language`, language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}textSize`, textSize);
    document.body.classList.remove('font-large', 'font-xl');
    if (textSize === 'large') document.body.classList.add('font-large');
    if (textSize === 'xl') document.body.classList.add('font-xl');
  }, [textSize]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}highContrast`, String(isHighContrast));
    if (isHighContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [isHighContrast]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}elderMode`, String(isElderMode));
  }, [isElderMode]);

  // Toast Helper
  const showToast = (message: string, type: ToastMessage['type'] = 'info', undoAction?: () => void) => {
    toastCounterRef.current += 1;
    const id = `toast-${toastCounterRef.current}`;
    const newToast: ToastMessage = {
      id,
      message,
      type,
      undoAction,
      undoLabel: undoAction ? 'Undo' : undefined,
    };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      dismissToast(id);
    }, 6000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Audit Log Helper
  const appendAuditLog = (action: string, entity: string, details: string) => {
    const newEntry: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName: currentMember.name,
      actorRole: currentMember.role,
      action,
      entity,
      details,
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  // Role switching
  const switchMember = (memberId: string) => {
    const target = members.find((m) => m.id === memberId);
    if (target) {
      setCurrentMemberId(memberId);
      // Auto-toggle elder mode if switching to elder vs caretaker
      if (target.role === 'elder') {
        setIsElderMode(true);
      } else {
        setIsElderMode(false);
      }
      showToast(`Switched active view to: ${target.name} (${target.role.replace('_', ' ')})`, 'info');
      appendAuditLog('SWITCH_USER_VIEW', 'System', `Switched viewing profile to ${target.name}`);
    }
  };

  // Update profile
  const updateProfile = (updated: Partial<CareProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
    appendAuditLog('UPDATE_PROFILE', 'CareProfile', 'Updated elder healthcare details and preferences');
    showToast('Healthcare profile settings updated successfully', 'success');
    
    // Sync to Firestore
    updateProfileInDb('savitri_sharma_profile', {
      elderName: updated.elderName,
      dob: updated.dateOfBirth,
      language: updated.preferredLanguage,
      emergencyContactName: updated.emergencyContactName,
      emergencyContactPhone: updated.emergencyContactPhone,
      primaryDoctorName: updated.primaryDoctorName,
      primaryDoctorPhone: updated.primaryDoctorPhone,
      bloodGroup: updated.bloodGroup,
      allergies: updated.allergies,
    }).catch(() => {});
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setProfile((prev) => ({ ...prev, preferredLanguage: lang }));
  };

  const setTextSize = (size: 'normal' | 'large' | 'xl') => {
    setTextSizeState(size);
  };

  const toggleHighContrast = () => {
    setIsHighContrast((prev) => !prev);
  };

  const toggleElderMode = () => {
    setIsElderMode((prev) => !prev);
  };

  // Dose Logging
  const logDose = (doseId: string, status: DoseStatus, reason?: MissedReason, notes?: string) => {
    const dose = doses.find((d) => d.id === doseId);
    if (!dose) return;

    // Check double logging prevention
    if (dose.status === 'taken' && status === 'taken') {
      showToast(`${dose.medicationName} was already recorded as taken. Double-log prevented!`, 'warning');
      return;
    }

    const previousStatus = dose.status;
    const previousLoggedAt = dose.loggedAt;
    const previousLoggedBy = dose.loggedBy;
    const previousLoggedRole = dose.loggedByRole;

    const isElder = currentMember.role === 'elder';
    const nowIso = new Date().toISOString();

    setDoses((prev) =>
      prev.map((d) => {
        if (d.id === doseId) {
          return {
            ...d,
            status,
            loggedAt: nowIso,
            loggedBy: currentMember.name,
            loggedByRole: currentMember.role,
            reason: reason || d.reason,
            notes: notes || d.notes,
          };
        }
        return d;
      })
    );

    // Decrement supply count when taken
    if (status === 'taken') {
      setMedications((prev) =>
        prev.map((m) => {
          if (m.id === dose.medicationId && m.supplyCount > 0) {
            const newCount = m.supplyCount - 1;
            // Check low supply threshold
            if (newCount <= m.refillThresholdDays) {
              setTimeout(() => {
                showToast(`Refill Alert: ${m.name} has only ${newCount} days of supply left!`, 'warning');
              }, 1200);
            }
            return { ...m, supplyCount: newCount };
          }
          return m;
        })
      );

      // Trigger pleasant celebratory confetti for elder positive reinforcement!
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.75 },
        colors: ['#10b981', '#3b82f6', '#f59e0b'],
      });
    }

    const actionText = status === 'taken' ? 'Taken' : status === 'skipped' ? `Skipped (${reason || 'no reason'})` : status;
    const attribution = isElder ? 'by Savitri' : `by ${currentMember.name} (on behalf of Savitri)`;
    appendAuditLog('LOG_DOSE', 'Dose', `Marked ${dose.medicationName} (${dose.strength}) as ${actionText} ${attribution}`);

    // Commit to Firestore in real time
    logDoseInDb('savitri_sharma_profile', doseId, status, currentMember.name, reason || null, notes).catch(() => {});

    // Allow 8-second Undo
    showToast(
      `Recorded ${dose.medicationName} as ${status}. ${attribution}`,
      status === 'taken' ? 'success' : 'info',
      () => {
        // Undo callback
        setDoses((prev) =>
          prev.map((d) => {
            if (d.id === doseId) {
              return {
                ...d,
                status: previousStatus,
                loggedAt: previousLoggedAt,
                loggedBy: previousLoggedBy,
                loggedByRole: previousLoggedRole,
              };
            }
            return d;
          })
        );
        if (status === 'taken') {
          setMedications((prev) =>
            prev.map((m) => {
              if (m.id === dose.medicationId) {
                return { ...m, supplyCount: m.supplyCount + 1 };
              }
              return m;
            })
          );
        }
        appendAuditLog('UNDO_DOSE_LOG', 'Dose', `Reverted dose log for ${dose.medicationName}`);
        showToast(`Undo successful: Restored ${dose.medicationName} to previous state`, 'info');
      }
    );
  };

  const snoozeDose = (doseId: string, minutes = 15) => {
    const dose = doses.find((d) => d.id === doseId);
    if (!dose) return;
    const snoozeTime = new Date(Date.now() + minutes * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setDoses((prev) =>
      prev.map((d) => (d.id === doseId ? { ...d, status: 'snoozed', snoozedUntil: snoozeTime } : d))
    );
    showToast(`Snoozed ${dose.medicationName} for ${minutes} minutes (until ${snoozeTime})`, 'info');
    appendAuditLog('SNOOZE_DOSE', 'Dose', `Snoozed ${dose.medicationName} for ${minutes} mins`);
  };

  // Medication Management
  const addMedication = (med: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newId = `med-${Date.now()}`;
    const nowIso = new Date().toISOString();
    const newMed: Medication = {
      ...med,
      id: newId,
      createdAt: nowIso,
      updatedAt: nowIso,
    };
    setMedications((prev) => [newMed, ...prev]);

    // Also generate today's doses for this medication if active
    const todayDate = new Date().toISOString().split('T')[0];
    const newDoses: DoseEvent[] = (med.exactTimes || ['08:00']).map((time, idx) => ({
      id: `dose-gen-${Date.now()}-${idx}`,
      medicationId: newId,
      medicationName: med.name,
      strength: med.strength,
      form: med.form,
      colorTag: med.colorTag || '#3b82f6',
      scheduledDate: todayDate,
      scheduledTime: time,
      timeOfDay: med.timesOfDay[idx] || 'morning',
      foodInstruction: med.foodInstruction,
      doctorMissedInstruction: med.doctorMissedInstruction || 'Take as directed by doctor.',
      status: 'upcoming',
    }));

    setDoses((prev) => [...prev, ...newDoses]);
    appendAuditLog('ADD_MEDICATION', 'Medication', `Added new prescription: ${med.name} ${med.strength} (${med.frequency})`);
    showToast(`Successfully added medication: ${med.name}`, 'success');

    // Sync to Firestore
    addMedicationToDb('savitri_sharma_profile', {
      name: med.name,
      strength: med.strength,
      form: med.form as any,
      instructions: med.foodInstruction,
      missedDoseInstruction: med.doctorMissedInstruction || 'Take as directed by doctor.',
      supplyCount: med.supplyCount,
      refillThresholdDays: med.refillThresholdDays,
      status: 'active',
      prescriber: med.prescribingDoctor,
      photoUrl: null,
      colorTag: med.colorTag,
    }, med.exactTimes).catch(() => {});
  };

  const updateMedication = (id: string, updated: Partial<Medication>) => {
    setMedications((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updated, updatedAt: new Date().toISOString() } : m))
    );
    appendAuditLog('UPDATE_MEDICATION', 'Medication', `Updated details for medication ID: ${id}`);
    showToast('Medication updated successfully', 'success');
  };

  const discontinueMedication = (id: string, reason: string) => {
    setMedications((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              status: 'discontinued',
              discontinuedReason: reason,
              updatedAt: new Date().toISOString(),
            }
          : m
      )
    );
    // Remove future upcoming doses
    setDoses((prev) => prev.filter((d) => !(d.medicationId === id && d.status === 'upcoming')));
    const med = medications.find((m) => m.id === id);
    appendAuditLog('DISCONTINUE_MEDICATION', 'Medication', `Discontinued ${med?.name || id}. Reason: ${reason}`);
    showToast(`Discontinued ${med?.name}. Prescription retained in medical history.`, 'warning');
  };

  // Appointment Actions
  const addAppointment = (apt: Omit<Appointment, 'id' | 'status'>) => {
    const newApt: Appointment = {
      ...apt,
      id: `apt-${Date.now()}`,
      status: 'upcoming',
    };
    setAppointments((prev) => [newApt, ...prev]);
    appendAuditLog('ADD_APPOINTMENT', 'Appointment', `Scheduled consultation with ${apt.doctor} (${apt.specialty})`);
    showToast(`Appointment with ${apt.doctor} scheduled successfully`, 'success');
  };

  const addDoctor = (newDoc: Omit<Doctor, 'id'>) => {
    const created: Doctor = {
      ...newDoc,
      id: `doc-${Date.now()}`,
    };
    setDoctors((prev) => [created, ...prev]);
    appendAuditLog('ADD_DOCTOR', 'Doctor', `Added specialist ${created.name} (${created.specialty}) to Care Team`);
    showToast(`Added ${created.name} to Care Team`, 'success');
  };

  const volunteerForAppointment = (aptId: string) => {
    const apt = appointments.find((a) => a.id === aptId);
    if (!apt) return;
    const volunteerName = currentMember.name;
    setAppointments((prev) =>
      prev.map((a) => (a.id === aptId ? { ...a, accompanyingPerson: volunteerName } : a))
    );
    appendAuditLog('VOLUNTEER_COMPANION', 'Appointment', `${volunteerName} volunteered to accompany Savitri to ${apt.doctor}`);
    showToast(`Thank you! You are now listed to accompany Savitri to ${apt.doctor}`, 'success');
    volunteerForAppointmentInDb('savitri_sharma_profile', aptId, volunteerName).catch(() => {});
  };

  const toggleChecklistItem = (aptId: string, checklistId: string) => {
    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id === aptId) {
          const updated = a.checklist.map((item) =>
            item.id === checklistId ? { ...item, done: !item.done } : item
          );
          return { ...a, checklist: updated };
        }
        return a;
      })
    );
  };

  const saveAppointmentOutcome = (aptId: string, notes: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === aptId ? { ...a, outcomeNotes: notes, status: 'completed' } : a))
    );
    appendAuditLog('APPOINTMENT_OUTCOME', 'Appointment', `Recorded clinical visit notes for appointment ${aptId}`);
    showToast('Doctor visit outcome notes recorded', 'success');
  };

  const exportAppointmentIcs = (apt: Appointment) => {
    const startDate = new Date(apt.datetime);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration
    
    const formatIcsDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CareCircle//Elder Care Platform//EN',
      'BEGIN:VEVENT',
      `UID:${apt.id}@carecircle.app`,
      `DTSTAMP:${formatIcsDate(new Date())}`,
      `DTSTART:${formatIcsDate(startDate)}`,
      `DTEND:${formatIcsDate(endDate)}`,
      `SUMMARY:${apt.doctor} - ${apt.specialty}`,
      `DESCRIPTION:CareCircle Doctor Visit for Savitri Sharma.\\nPurpose: ${apt.purpose}\\nCompanion: ${apt.accompanyingPerson || 'Unassigned'}`,
      `LOCATION:${apt.location}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CareCircle-Doctor-Visit-${apt.doctor.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Downloaded .ics calendar invite for doctor visit', 'success');
  };

  // Circle & Privacy Actions (PRD 7.1.1, AC-2, AC-3, AC-9)
  const createInvite = (role: Role, expiryHours = 48): InviteCode => {
    const randomCode = generateSecurePasscode('CARE');
    const newInvite: InviteCode = {
      id: `inv-${Date.now()}`,
      code: randomCode,
      role,
      createdBy: currentMember.name,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + expiryHours * 60 * 60 * 1000).toISOString(),
      used: false,
    };
    setInvites((prev) => [newInvite, ...prev]);
    appendAuditLog('CREATE_INVITE', 'Circle', `Generated single-use passcode ${randomCode} for role ${role}`);
    showToast(`Generated single-use passcode: ${randomCode} (Expires in ${expiryHours}h)`, 'success');
    createInviteInDb('savitri_sharma_profile', role as any, currentMember.name, expiryHours).catch(() => {});
    return newInvite;
  };

  const redeemInvite = (code: string, name: string, email: string) => {
    // AC-9: Check rate-limit & lockout before evaluation
    const rateCheck = checkRateLimit('circle_invite_entry');
    if (rateCheck.isLocked) {
      appendAuditLog('LOCKOUT_ALERT', 'Security', `Too many failed passcode attempts. Locked for ${rateCheck.remainingLockoutSeconds}s`);
      return {
        success: false,
        message: `Security Lockout: Too many failed passcode attempts. Please wait ${rateCheck.remainingLockoutSeconds} seconds before trying again.`,
      };
    }

    const invite = invites.find((i) => i.code.trim().toUpperCase() === code.trim().toUpperCase());
    if (!invite) {
      const res = recordFailedAttempt('circle_invite_entry');
      if (res.lockoutTriggered) {
        appendAuditLog('SECURITY_LOCKOUT', 'Security', 'Owner Alert: 5 consecutive passcode failures detected. 15-minute lockout triggered.');
        return {
          success: false,
          message: 'Too many incorrect passcode attempts. Device locked out for 15 minutes. The elder profile owner has been alerted.',
        };
      }
      return {
        success: false,
        message: `Invalid passcode (${5 - res.failedCount} attempt(s) remaining before security lockout).`,
      };
    }

    if (invite.used) {
      return { success: false, message: 'This single-use invite passcode has already been redeemed.' };
    }
    if (new Date(invite.expiresAt).getTime() < Date.now()) {
      return { success: false, message: 'This invite passcode has expired. Please ask the profile owner for a new one.' };
    }

    // Success - reset rate limit
    resetRateLimit('circle_invite_entry');

    const newMember: Member = {
      id: `mem-${Date.now()}`,
      name,
      email,
      role: invite.role,
      relationship: invite.role === 'caretaker' ? 'Caretaker' : 'Family Member',
      canViewAdherence: true,
      canViewAppointments: true,
      canViewNotes: true,
      canLogDoses: invite.role === 'caretaker' || invite.role === 'primary_caretaker',
      canManageMeds: false,
      receiveEmailAlerts: true,
      lastActive: 'Just now',
      status: 'active',
    };

    setMembers((prev) => [...prev, newMember]);
    setInvites((prev) => prev.map((i) => (i.id === invite.id ? { ...i, used: true, usedByEmail: email } : i)));
    appendAuditLog('MEMBER_JOINED', 'Circle', `${name} joined the CareCircle as ${invite.role} using code ${code}`);
    showToast(`Welcome ${name}! You have successfully joined Savitri's Care Circle.`, 'success');
    return { success: true, message: `Successfully joined as ${invite.role}!` };
  };

  const revokeMember = (memberId: string) => {
    const mem = members.find((m) => m.id === memberId);
    if (!mem) return;
    if (mem.role === 'elder') {
      showToast('Cannot revoke access for the Elder Profile Owner', 'error');
      return;
    }
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
    appendAuditLog('REVOKE_MEMBER', 'Circle', `Revoked circle access for ${mem.name} (${mem.role})`);
    showToast(`Access permanently revoked for ${mem.name}`, 'warning');
  };

  const updateMemberPermissions = (memberId: string, permissions: Partial<Member>) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, ...permissions } : m))
    );
    appendAuditLog('UPDATE_PERMISSIONS', 'Privacy', `Updated member permissions for member ID ${memberId}`);
    showToast('Member permissions updated successfully', 'success');
  };

  // Notes & Tasks
  const addCareNote = (content: string, category: CareNote['category'], isPrivate = false) => {
    const newNote: CareNote = {
      id: `note-${Date.now()}`,
      authorName: currentMember.name,
      authorRole: currentMember.role,
      content,
      category,
      date: new Date().toISOString(),
      isPrivateToElder: isPrivate,
    };
    setCareNotes((prev) => [newNote, ...prev]);
    appendAuditLog('ADD_NOTE', 'Notes', `Added ${category} care note: "${content.substring(0, 40)}..."`);
    showToast('Care note shared with Circle', 'success');
  };

  const addCareTask = (title: string, dueDate: string, description?: string) => {
    const newTask: CareTask = {
      id: `task-${Date.now()}`,
      title,
      description,
      dueDate,
      status: 'pending',
      createdBy: currentMember.name,
      createdAt: new Date().toISOString(),
    };
    setCareTasks((prev) => [newTask, ...prev]);
    appendAuditLog('ADD_TASK', 'Tasks', `Created new task: ${title}`);
    showToast('New care task created', 'success');
  };

  const claimTask = (taskId: string) => {
    setCareTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'claimed', assignedTo: currentMember.name } : t))
    );
    showToast(`Task assigned to ${currentMember.name}`, 'success');
  };

  const completeTask = (taskId: string) => {
    setCareTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'completed' } : t))
    );
    showToast('Task marked as completed', 'success');
  };

  const addShiftHandoff = (data: Omit<ShiftHandoff, 'id' | 'timestamp'>) => {
    const newHandoff: ShiftHandoff = {
      ...data,
      id: `handoff-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setShiftHandoffs((prev) => [newHandoff, ...prev]);
    appendAuditLog('SHIFT_HANDOFF', 'Circle', `Completed shift handoff summary by ${data.caretakerName}`);
    showToast('Caretaker shift handoff logged successfully', 'success');
  };

  // Email simulator token action execution (PRD NOT-1)
  const executeEmailAction = (token: string, action: string, targetId: string) => {
    const verification = verifyActionToken(token);
    if (!verification.valid) {
      return { success: false, message: verification.reason || 'Invalid or expired action token.' };
    }

    if (action === 'taken') {
      logDose(targetId, 'taken');
      return { success: true, message: 'Dose recorded as Taken via 1-tap email link. No login required!' };
    } else if (action === 'skip') {
      logDose(targetId, 'skipped', 'forgot');
      return { success: true, message: 'Dose marked as Skipped via 1-tap email link.' };
    } else if (action === 'snooze') {
      snoozeDose(targetId, 15);
      return { success: true, message: 'Dose snoozed for 15 minutes.' };
    } else if (action === 'volunteer') {
      volunteerForAppointment(targetId);
      return { success: true, message: 'Confirmed! You volunteered to accompany Savitri via 1-tap email action.' };
    }
    return { success: false, message: 'Unknown action link.' };
  };

  const markEmailRead = (emailId: string) => {
    setEmails((prev) => prev.map((e) => (e.id === emailId ? { ...e, opened: true } : e)));
  };

  // Voice speech assistant (Web Speech API)
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (language === 'hi') {
        utterance.lang = 'hi-IN';
      } else if (language === 'mr') {
        utterance.lang = 'mr-IN';
      } else {
        utterance.lang = 'en-US';
      }
      utterance.rate = 0.9; // Slightly slower, calm cadence for elderly users
      window.speechSynthesis.speak(utterance);
      showToast('Voice assistant speaking...', 'info');
    } else {
      showToast('Voice speech is not supported in this browser.', 'warning');
    }
  };

  // Reset to initial demo data
  const resetAllData = () => {
    localStorage.clear();
    setProfile(initialProfile);
    setMembers(initialMembers);
    setCurrentMemberId('mem-1');
    setMedications(initialMedications);
    setDoctors(initialDoctors);
    setDoses(initialDoses);
    setAppointments(initialAppointments);
    setCareNotes(initialCareNotes);
    setCareTasks(initialCareTasks);
    setShiftHandoffs(initialShiftHandoffs);
    setAuditLogs(initialAuditLogs);
    setInvites(initialInvites);
    setEmails(initialSimulatedEmails);
    setLanguageState('en');
    setTextSizeState('normal');
    setIsHighContrast(false);
    setIsElderMode(true);
    showToast('Platform reset to original demo state', 'info');
  };

  const t = translations[language] || translations.en;

  return (
    <CareContext.Provider
      value={{
        profile,
        currentMember,
        members,
        medications,
        doctors,
        doses,
        appointments,
        careNotes,
        careTasks,
        shiftHandoffs,
        auditLogs,
        invites,
        emails,
        toasts,
        language,
        textSize,
        isHighContrast,
        isElderMode,
        t,
        switchMember,
        updateProfile,
        setLanguage,
        setTextSize,
        toggleHighContrast,
        toggleElderMode,
        logDose,
        snoozeDose,
        addMedication,
        updateMedication,
        discontinueMedication,
        addAppointment,
        addDoctor,
        volunteerForAppointment,
        toggleChecklistItem,
        saveAppointmentOutcome,
        exportAppointmentIcs,
        createInvite,
        redeemInvite,
        revokeMember,
        updateMemberPermissions,
        addCareNote,
        addCareTask,
        claimTask,
        completeTask,
        addShiftHandoff,
        executeEmailAction,
        markEmailRead,
        speakText,
        dismissToast,
        showToast,
        resetAllData,
      }}
    >
      {children}
    </CareContext.Provider>
  );
};


