import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './config';
import {
  FirestoreProfile,
  FirestoreMember,
  FirestoreMedication,
  FirestoreDoseEvent,
  FirestoreAppointment,
  FirestoreCareNote,
  FirestoreCareTask,
  FirestoreDoctor,
  FirestoreAuditLog,
  Role,
  DoseStatus,
} from './types';
import { hashPasscode, generateSecurePasscode, checkRateLimit, recordFailedAttempt, resetRateLimit } from '../../utils/security';

const DEFAULT_PROFILE_ID = 'savitri_sharma_profile';

// ==============================================================================
// 1. PROFILES ({profileId})
// ==============================================================================

export const getProfileFromDb = async (profileId = DEFAULT_PROFILE_ID): Promise<FirestoreProfile | null> => {
  try {
    const docRef = doc(db, 'profiles', profileId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as FirestoreProfile;
    }
  } catch (err) {
    console.warn('[Firestore] Error fetching profile:', err);
  }
  return null;
};

export const updateProfileInDb = async (
  profileId: string,
  data: Partial<FirestoreProfile>
): Promise<void> => {
  try {
    const docRef = doc(db, 'profiles', profileId);
    await updateDoc(docRef, { ...data });
  } catch (err) {
    console.warn('[Firestore] Error updating profile:', err);
  }
};

export const subscribeToProfile = (
  profileId: string,
  onUpdate: (profile: FirestoreProfile) => void
): Unsubscribe => {
  const docRef = doc(db, 'profiles', profileId);
  return onSnapshot(docRef, (snap) => {
    if (snap.exists()) {
      onUpdate({ id: snap.id, ...snap.data() } as FirestoreProfile);
    }
  });
};

// ==============================================================================
// 2. MEMBERS (profiles/{profileId}/members/{uid})
// ==============================================================================

export const subscribeToMembers = (
  profileId: string,
  onUpdate: (members: FirestoreMember[]) => void
): Unsubscribe => {
  const colRef = collection(db, 'profiles', profileId, 'members');
  return onSnapshot(colRef, (snap) => {
    const members = snap.docs.map((d) => ({ uid: d.id, ...d.data() } as FirestoreMember));
    onUpdate(members);
  });
};

export const updateMemberRoleInDb = async (
  profileId: string,
  uid: string,
  role: Role,
  status: 'active' | 'revoked' = 'active'
): Promise<void> => {
  const docRef = doc(db, 'profiles', profileId, 'members', uid);
  await updateDoc(docRef, { role, status });
};

// ==============================================================================
// 3. MEDICATIONS & SCHEDULES (profiles/{profileId}/medications/{medId})
// ==============================================================================

export const subscribeToMedications = (
  profileId: string,
  onUpdate: (meds: FirestoreMedication[]) => void
): Unsubscribe => {
  const colRef = collection(db, 'profiles', profileId, 'medications');
  return onSnapshot(colRef, (snap) => {
    const meds = snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreMedication));
    onUpdate(meds);
  });
};

export const addMedicationToDb = async (
  profileId: string,
  med: Omit<FirestoreMedication, 'id'>,
  times: string[] = ['08:00', '20:00']
): Promise<string> => {
  const medId = `med_${Date.now()}`;
  const docRef = doc(db, 'profiles', profileId, 'medications', medId);
  await setDoc(docRef, { ...med, id: medId });

  // Add default schedule subcollection
  const schedRef = doc(db, 'profiles', profileId, 'medications', medId, 'schedules', 'default_schedule');
  await setDoc(schedRef, {
    id: 'default_schedule',
    recurrenceRule: 'daily',
    times,
    startDate: new Date().toISOString().split('T')[0],
    endDate: null,
  });

  return medId;
};

export const updateMedicationInDb = async (
  profileId: string,
  medId: string,
  data: Partial<FirestoreMedication>
): Promise<void> => {
  const docRef = doc(db, 'profiles', profileId, 'medications', medId);
  await updateDoc(docRef, data);
};

// ==============================================================================
// 4. DOSE EVENTS (profiles/{profileId}/doseEvents/{eventId})
// ==============================================================================

export const subscribeToDoseEvents = (
  profileId: string,
  onUpdate: (doses: FirestoreDoseEvent[]) => void
): Unsubscribe => {
  const colRef = collection(db, 'profiles', profileId, 'doseEvents');
  const q = query(colRef, orderBy('scheduledAt', 'asc'));
  return onSnapshot(q, (snap) => {
    const doses = snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreDoseEvent));
    onUpdate(doses);
  });
};

export const logDoseInDb = async (
  profileId: string,
  doseId: string,
  status: DoseStatus,
  loggedBy: string,
  reason: string | null = null,
  notes?: string
): Promise<void> => {
  const docRef = doc(db, 'profiles', profileId, 'doseEvents', doseId);
  await updateDoc(docRef, {
    status,
    loggedBy,
    loggedAt: new Date().toISOString(),
    reason,
    notes: notes || '',
  });

  // Append immutable audit log
  await appendAuditLogInDb(profileId, {
    action: `DOSE_${status.toUpperCase()}`,
    actorName: loggedBy,
    actorRole: 'care_circle',
    details: `Dose ID ${doseId} marked as ${status}${reason ? ` (Reason: ${reason})` : ''}`,
    timestamp: new Date().toISOString(),
  });
};

export const snoozeDoseInDb = async (
  profileId: string,
  doseId: string,
  minutes = 15
): Promise<void> => {
  const docRef = doc(db, 'profiles', profileId, 'doseEvents', doseId);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    const current = snap.data() as FirestoreDoseEvent;
    const currDate = new Date(current.scheduledAt);
    currDate.setMinutes(currDate.getMinutes() + minutes);
    await updateDoc(docRef, {
      scheduledAt: currDate.toISOString(),
    });
  }
};

// ==============================================================================
// 5. APPOINTMENTS (profiles/{profileId}/appointments/{aptId})
// ==============================================================================

export const subscribeToAppointments = (
  profileId: string,
  onUpdate: (apts: FirestoreAppointment[]) => void
): Unsubscribe => {
  const colRef = collection(db, 'profiles', profileId, 'appointments');
  const q = query(colRef, orderBy('datetime', 'asc'));
  return onSnapshot(q, (snap) => {
    const apts = snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreAppointment));
    onUpdate(apts);
  });
};

export const volunteerForAppointmentInDb = async (
  profileId: string,
  aptId: string,
  volunteerName: string
): Promise<void> => {
  const docRef = doc(db, 'profiles', profileId, 'appointments', aptId);
  await updateDoc(docRef, { accompanyingPerson: volunteerName });
};

// ==============================================================================
// 6. INVITES & PASSCODE REDEMPTION (profiles/{profileId}/invites/{inviteId})
// ==============================================================================

export const createInviteInDb = async (
  profileId: string,
  role: Role,
  createdBy = 'Meena (Primary Caretaker)',
  expiryHours = 48
): Promise<{ code: string; id: string; expiresAt: string }> => {
  const rawCode = generateSecurePasscode();
  const inviteId = `inv_${Date.now()}`;
  const salt = `cc_salt_${Date.now()}`;
  const passcodeHash = hashPasscode(rawCode, salt);
  const expiresAt = new Date(Date.now() + expiryHours * 3600 * 1000).toISOString();

  const docRef = doc(db, 'profiles', profileId, 'invites', inviteId);
  await setDoc(docRef, {
    id: inviteId,
    role,
    passcodeHash,
    salt,
    expiresAt,
    usedBy: null,
    createdBy,
    status: 'active',
  });

  return { code: rawCode, id: inviteId, expiresAt };
};

export const verifyAndRedeemInviteInDb = async (
  profileId: string,
  passcode: string,
  userName: string,
  userEmail: string
): Promise<{ success: boolean; message: string; role?: Role }> => {
  // 1. Rate limiting check (5 attempts -> 15m lockout)
  const rl = checkRateLimit(userEmail || 'global_invite');
  if (rl.isLocked) {
    const mins = Math.ceil(rl.remainingLockoutSeconds / 60);
    return {
      success: false,
      message: `Too many attempts. Locked out for ${mins} minutes to protect family privacy.`,
    };
  }

  try {
    const colRef = collection(db, 'profiles', profileId, 'invites');
    const snap = await getDocs(colRef);

    for (const d of snap.docs) {
      const inv = d.data();
      if (inv.status === 'active') {
        const computedHash = hashPasscode(passcode.trim().toUpperCase(), inv.salt || 'carecircle_salt_2026');
        if (computedHash === inv.passcodeHash) {
          // Check expiration
          if (new Date(inv.expiresAt).getTime() < Date.now()) {
            return { success: false, message: 'This single-use invite passcode has expired.' };
          }

          // Mark used
          await updateDoc(d.ref, {
            status: 'used',
            usedBy: `${userName} (${userEmail})`,
          });

          // Add to members
          const memberRef = doc(db, 'profiles', profileId, 'members', `mem_${Date.now()}`);
          await setDoc(memberRef, {
            uid: `mem_${Date.now()}`,
            name: userName,
            email: userEmail,
            role: inv.role,
            status: 'active',
            accessExpiresAt: null,
            visibility: {
              canViewMeds: true,
              canViewVitals: inv.role === 'primaryCaretaker',
              canViewNotes: true,
              canViewLocation: false,
            },
            notificationPrefs: {
              email: true,
              sms: false,
              instantDoseAlerts: inv.role === 'primaryCaretaker',
              missedDoseEscalation: true,
            },
          });

          resetRateLimit(userEmail || 'global_invite');
          return { success: true, message: `Welcome! You have joined as ${inv.role}.`, role: inv.role };
        }
      }
    }
  } catch (err) {
    console.warn('[Firestore] Error redeeming invite:', err);
  }

  recordFailedAttempt(userEmail || 'global_invite');
  return { success: false, message: 'Invalid or already-used passcode. Please check with your family.' };
};

// ==============================================================================
// 7. CARE NOTES & TASKS
// ==============================================================================

export const subscribeToCareNotes = (
  profileId: string,
  onUpdate: (notes: FirestoreCareNote[]) => void
): Unsubscribe => {
  const colRef = collection(db, 'profiles', profileId, 'careNotes');
  const q = query(colRef, orderBy('timestamp', 'desc'));
  return onSnapshot(q, (snap) => {
    const notes = snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreCareNote));
    onUpdate(notes);
  });
};

export const addCareNoteInDb = async (
  profileId: string,
  note: Omit<FirestoreCareNote, 'id'>
): Promise<void> => {
  const id = `note_${Date.now()}`;
  const docRef = doc(db, 'profiles', profileId, 'careNotes', id);
  await setDoc(docRef, { ...note, id });
};

export const subscribeToCareTasks = (
  profileId: string,
  onUpdate: (tasks: FirestoreCareTask[]) => void
): Unsubscribe => {
  const colRef = collection(db, 'profiles', profileId, 'careTasks');
  const q = query(colRef, orderBy('dueDate', 'asc'));
  return onSnapshot(q, (snap) => {
    const tasks = snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreCareTask));
    onUpdate(tasks);
  });
};

export const claimTaskInDb = async (
  profileId: string,
  taskId: string,
  memberName: string
): Promise<void> => {
  const docRef = doc(db, 'profiles', profileId, 'careTasks', taskId);
  await updateDoc(docRef, { assignedTo: memberName, status: 'in_progress' });
};

// ==============================================================================
// 8. AUDIT LOGS (profiles/{profileId}/auditLogs/{logId})
// ==============================================================================

export const subscribeToAuditLogs = (
  profileId: string,
  onUpdate: (logs: FirestoreAuditLog[]) => void
): Unsubscribe => {
  const colRef = collection(db, 'profiles', profileId, 'auditLogs');
  const q = query(colRef, orderBy('timestamp', 'desc'));
  return onSnapshot(q, (snap) => {
    const logs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreAuditLog));
    onUpdate(logs);
  });
};

export const appendAuditLogInDb = async (
  profileId: string,
  entry: Omit<FirestoreAuditLog, 'id'>
): Promise<void> => {
  const id = `log_${Date.now()}`;
  const docRef = doc(db, 'profiles', profileId, 'auditLogs', id);
  await setDoc(docRef, { ...entry, id });
};

// ==============================================================================
// 8. DOCTORS & SPECIALISTS (profiles/{profileId}/doctors/{docId})
// ==============================================================================

export const subscribeToDoctors = (
  profileId: string,
  onUpdate: (doctors: FirestoreDoctor[]) => void
): Unsubscribe => {
  const colRef = collection(db, 'profiles', profileId, 'doctors');
  return onSnapshot(colRef, (snap) => {
    const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreDoctor));
    onUpdate(docs);
  });
};

export const getDoctorsFromDb = async (
  profileId: string = DEFAULT_PROFILE_ID
): Promise<FirestoreDoctor[]> => {
  try {
    const colRef = collection(db, 'profiles', profileId, 'doctors');
    const snap = await getDocs(colRef);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreDoctor));
  } catch (err) {
    console.warn('[Firestore] Error fetching doctors:', err);
    return [];
  }
};

export const addDoctorToDb = async (
  profileId: string,
  doctor: FirestoreDoctor
): Promise<void> => {
  try {
    const docRef = doc(db, 'profiles', profileId, 'doctors', doctor.id);
    await setDoc(docRef, doctor);
  } catch (err) {
    console.warn('[Firestore] Error adding doctor:', err);
  }
};

// ==============================================================================
// 9. AUTOMATIC FIRESTORE SEEDER
// ==============================================================================

export const seedInitialProfileToFirestore = async (profileId = DEFAULT_PROFILE_ID): Promise<void> => {
  try {
    const existing = await getProfileFromDb(profileId);
    if (existing) return; // Already initialized

    // Profile Document
    const profileRef = doc(db, 'profiles', profileId);
    await setDoc(profileRef, {
      id: profileId,
      elderName: 'Savitri Sharma',
      dob: '1952-04-12',
      language: 'en',
      timezone: 'Asia/Kolkata',
      privacySettings: {
        allowFullPrescriptionView: true,
        allowClinicalNotesView: false,
        allowGpsLocationSharing: false,
        requireApprovalForAppointments: true,
        notifyOnEveryDose: true,
      },
      escalationLadder: {
        graceWindowMinutes: 15,
        primaryNudgeDelayMinutes: 30,
        remoteFamilyEscalationMinutes: 60,
        enabled: true,
      },
      approvalMode: true,
      ownerUid: 'savitri_user_001',
      emergencyContactName: 'Rohan Sharma (Son)',
      emergencyContactPhone: '+91 98201 44321',
      primaryDoctorName: 'Dr. V. Kulkarni',
      primaryDoctorPhone: '+91 98220 55123',
      bloodGroup: 'B+',
      allergies: ['Penicillin', 'Sulfa drugs'],
      createdAt: new Date().toISOString(),
    });

    // Seed Members
    const members = [
      { uid: 'savitri_01', name: 'Savitri Sharma', role: 'owner' as Role, email: 'savitri@example.com' },
      { uid: 'meena_02', name: 'Meena Sharma', role: 'primaryCaretaker' as Role, email: 'meena@example.com' },
      { uid: 'rohan_03', name: 'Rohan Sharma', role: 'familyContributor' as Role, email: 'rohan@example.com' },
      { uid: 'sunita_04', name: 'Sunita (Visiting Nurse)', role: 'caretaker' as Role, email: 'sunita@example.com' },
    ];
    for (const m of members) {
      await setDoc(doc(db, 'profiles', profileId, 'members', m.uid), {
        ...m,
        status: 'active',
        accessExpiresAt: null,
        visibility: { canViewMeds: true, canViewVitals: true, canViewNotes: true, canViewLocation: false },
        notificationPrefs: { email: true, sms: false, instantDoseAlerts: true, missedDoseEscalation: true },
      });
    }

    // Seed Medications
    const meds = [
      { id: 'med_metformin', name: 'Metformin', strength: '500 mg', form: 'tablet' as const, instructions: '1 tablet with warm water after food', missedDoseInstruction: 'Take as soon as remembered unless close to next dose', supplyCount: 28, refillThresholdDays: 7, status: 'active' as const, prescriber: 'Dr. V. Kulkarni', photoUrl: null, colorTag: '#3b82f6' },
      { id: 'med_amlodipine', name: 'Amlodipine', strength: '5 mg', form: 'tablet' as const, instructions: '1 tablet once daily morning for hypertension', missedDoseInstruction: 'Never take a double dose', supplyCount: 30, refillThresholdDays: 7, status: 'active' as const, prescriber: 'Dr. V. Kulkarni', photoUrl: null, colorTag: '#10b981' },
      { id: 'med_shelcal', name: 'Shelcal 500', strength: '500 mg', form: 'tablet' as const, instructions: '1 tablet afternoon post lunch', missedDoseInstruction: 'Take with lunch next day', supplyCount: 14, refillThresholdDays: 7, status: 'active' as const, prescriber: 'Dr. V. Kulkarni', photoUrl: null, colorTag: '#f59e0b' },
    ];
    for (const med of meds) {
      await setDoc(doc(db, 'profiles', profileId, 'medications', med.id), med);
    }

    // Seed Today's Dose Events
    const today = new Date().toISOString().split('T')[0];
    const doses = [
      { id: 'dose_01', medId: 'med_metformin', medName: 'Metformin', strength: '500 mg', scheduledAt: `${today}T08:00:00.000Z`, timeSlot: 'morning' as const, status: 'taken' as const, loggedBy: 'Savitri (Self)', loggedAt: `${today}T08:02:00.000Z`, reason: null },
      { id: 'dose_02', medId: 'med_amlodipine', strength: '5 mg', scheduledAt: `${today}T08:00:00.000Z`, timeSlot: 'morning' as const, status: 'taken' as const, loggedBy: 'Savitri (Self)', loggedAt: `${today}T08:02:00.000Z`, reason: null },
      { id: 'dose_03', medId: 'med_shelcal', strength: '500 mg', scheduledAt: `${today}T13:00:00.000Z`, timeSlot: 'afternoon' as const, status: 'upcoming' as const, loggedBy: null, loggedAt: null, reason: null },
      { id: 'dose_04', medId: 'med_metformin', strength: '500 mg', scheduledAt: `${today}T20:00:00.000Z`, timeSlot: 'night' as const, status: 'upcoming' as const, loggedBy: null, loggedAt: null, reason: null },
    ];
    for (const dose of doses) {
      await setDoc(doc(db, 'profiles', profileId, 'doseEvents', dose.id), dose);
    }

    console.log('[Firestore] Successfully initialized CareCircle seed data in Firebase!');
  } catch (err) {
    console.warn('[Firestore] Note: Could not auto-seed (verify network / Firebase rules):', err);
  }
};
