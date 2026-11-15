const fs = require('fs');
const path = require('path');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Read service account from .env.local
const envPath = path.resolve(__dirname, '../../../.env.local');
const envFile = fs.readFileSync(envPath, 'utf8');
const match = envFile.match(/FIREBASE_SERVICE_ACCOUNT=(.*)/);

if (!match) {
  console.error('FIREBASE_SERVICE_ACCOUNT not found in .env.local');
  process.exit(1);
}

const b64 = match[1].trim();
const sa = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));

const app = initializeApp({ credential: cert(sa), projectId: sa.project_id });
const db = getFirestore(app);

async function seedLiveFirestore() {
  console.log(`Starting live Firestore seeding on project: ${sa.project_id}...`);
  const profileId = 'savitri_sharma_profile';

  // 1. Profile Document (profiles/{profileId})
  await db.doc(`profiles/${profileId}`).set({
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
  console.log(`✓ Created profiles/${profileId}`);

  // 2. Members Subcollection (profiles/{profileId}/members/{uid})
  const members = [
    { uid: 'savitri_01', name: 'Savitri Sharma', role: 'owner', email: 'savitri@example.com' },
    { uid: 'meena_02', name: 'Meena Sharma', role: 'primaryCaretaker', email: 'meena@example.com' },
    { uid: 'rohan_03', name: 'Rohan Sharma', role: 'familyContributor', email: 'rohan@example.com' },
    { uid: 'sunita_04', name: 'Sunita (Visiting Nurse)', role: 'caretaker', email: 'sunita@example.com' },
  ];
  for (const m of members) {
    await db.doc(`profiles/${profileId}/members/${m.uid}`).set({
      ...m,
      status: 'active',
      accessExpiresAt: null,
      visibility: { canViewMeds: true, canViewVitals: true, canViewNotes: true, canViewLocation: false },
      notificationPrefs: { email: true, sms: false, instantDoseAlerts: true, missedDoseEscalation: true },
    });
  }
  console.log(`✓ Seeded ${members.length} members in profiles/${profileId}/members`);

  // 3. Invites Subcollection (profiles/{profileId}/invites/{inviteId})
  await db.doc(`profiles/${profileId}/invites/inv_demo_8492`).set({
    id: 'inv_demo_8492',
    role: 'familyContributor',
    passcodeHash: 'CARE-8492_hashed',
    expiresAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    usedBy: null,
    createdBy: 'Meena Sharma (Primary Caretaker)',
    status: 'active',
  });
  console.log(`✓ Seeded demo invite in profiles/${profileId}/invites`);

  // 4. Medications & Schedules Subcollections
  const meds = [
    {
      id: 'med_metformin',
      name: 'Metformin',
      strength: '500 mg',
      form: 'tablet',
      instructions: '1 tablet with warm water after food',
      missedDoseInstruction: 'Take as soon as remembered unless close to next dose',
      supplyCount: 28,
      refillThresholdDays: 7,
      status: 'active',
      prescriber: 'Dr. V. Kulkarni',
      photoUrl: null,
    },
    {
      id: 'med_amlodipine',
      name: 'Amlodipine',
      strength: '5 mg',
      form: 'tablet',
      instructions: '1 tablet once daily morning for hypertension',
      missedDoseInstruction: 'Never take a double dose',
      supplyCount: 30,
      refillThresholdDays: 7,
      status: 'active',
      prescriber: 'Dr. V. Kulkarni',
      photoUrl: null,
    },
    {
      id: 'med_shelcal',
      name: 'Shelcal 500',
      strength: '500 mg',
      form: 'tablet',
      instructions: '1 tablet afternoon post lunch',
      missedDoseInstruction: 'Take with lunch next day',
      supplyCount: 14,
      refillThresholdDays: 7,
      status: 'active',
      prescriber: 'Dr. V. Kulkarni',
      photoUrl: null,
    },
  ];
  for (const med of meds) {
    await db.doc(`profiles/${profileId}/medications/${med.id}`).set(med);
    await db.doc(`profiles/${profileId}/medications/${med.id}/schedules/default_schedule`).set({
      recurrenceRule: 'daily',
      times: ['08:00', '20:00'],
      startDate: new Date().toISOString().split('T')[0],
      endDate: null,
    });
  }
  console.log(`✓ Seeded ${meds.length} medications and schedules`);

  // 5. Dose Events Subcollection (profiles/{profileId}/doseEvents/{eventId})
  const today = new Date().toISOString().split('T')[0];
  const doses = [
    { id: 'dose_01', medId: 'med_metformin', scheduledAt: `${today}T08:00:00.000Z`, status: 'taken', loggedBy: 'Savitri (Self)', loggedAt: `${today}T08:02:00.000Z`, reason: null },
    { id: 'dose_02', medId: 'med_amlodipine', scheduledAt: `${today}T08:00:00.000Z`, status: 'taken', loggedBy: 'Savitri (Self)', loggedAt: `${today}T08:02:00.000Z`, reason: null },
    { id: 'dose_03', medId: 'med_shelcal', scheduledAt: `${today}T13:00:00.000Z`, status: 'upcoming', loggedBy: null, loggedAt: null, reason: null },
    { id: 'dose_04', medId: 'med_metformin', scheduledAt: `${today}T20:00:00.000Z`, status: 'upcoming', loggedBy: null, loggedAt: null, reason: null },
  ];
  for (const d of doses) {
    await db.doc(`profiles/${profileId}/doseEvents/${d.id}`).set(d);
  }
  console.log(`✓ Seeded ${doses.length} dose events for today`);

  // 6. Appointments Subcollection (profiles/{profileId}/appointments/{aptId})
  await db.doc(`profiles/${profileId}/appointments/apt_kulkarni_nov`).set({
    doctor: 'Dr. V. Kulkarni',
    specialty: 'Cardiologist',
    location: 'Lilavati Hospital, Bandra West, Mumbai',
    datetime: '2026-11-20T10:30:00.000Z',
    purpose: 'Routine 3-month hypertension & diabetes review',
    accompanyingPerson: 'Rohan Sharma (Son)',
    checklist: [
      { id: 'c1', text: 'Carry latest fasting blood sugar log', done: true },
      { id: 'c2', text: 'Carry blood pressure readings sheet', done: true },
      { id: 'c3', text: 'Carry current medicine strips', done: false },
    ],
    outcomeNotes: '',
    status: 'upcoming',
  });
  console.log(`✓ Seeded appointment with Dr. Kulkarni`);

  // 7. Audit Log Subcollection (profiles/{profileId}/auditLogs/{logId})
  await db.doc(`profiles/${profileId}/auditLogs/log_init_01`).set({
    action: 'INITIALIZE_FIRESTORE',
    actorName: 'System / Firebase Admin',
    actorRole: 'admin',
    details: 'Production Firestore schema initialized successfully for carecircle-4ec05',
    timestamp: new Date().toISOString(),
  });
  console.log(`✓ Appended initialization log to auditLogs`);

  const collections = await db.listCollections();
  console.log('\n======================================================');
  console.log('LIVE FIRESTORE SEEDING COMPLETE FOR carecircle-4ec05!');
  console.log('Root collections in Firestore:', collections.map((c) => c.id).join(', '));
  console.log('======================================================');
}

seedLiveFirestore().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});

