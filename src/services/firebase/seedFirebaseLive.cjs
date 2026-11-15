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
    primaryDoctorName: 'Dr. Vikram Kulkarni',
    primaryDoctorPhone: '+91 98220 55123',
    bloodGroup: 'B+',
    allergies: ['Penicillin', 'Sulfa drugs'],
    chronicConditions: ['Type 2 Diabetes Mellitus', 'Hypertension (High BP)', 'Osteoarthritis'],
    hospitalPreference: 'Lilavati Hospital & Research Centre, Mumbai',
    createdAt: new Date().toISOString(),
  });
  console.log(`✓ Updated profiles/${profileId}`);

  // 2. Members Subcollection (profiles/{profileId}/members/{uid})
  const members = [
    {
      uid: 'savitri_01',
      name: 'Savitri Sharma',
      role: 'owner',
      email: 'savitri.care@example.com',
      phone: '+91 98210 11223',
      relationship: 'Self (Elder)',
      visibility: { canViewMeds: true, canViewVitals: true, canViewNotes: true, canViewLocation: true },
      notificationPrefs: { email: true, sms: true, instantDoseAlerts: true, missedDoseEscalation: false },
    },
    {
      uid: 'meena_02',
      name: 'Meena Sharma',
      role: 'primaryCaretaker',
      email: 'meena.care@example.com',
      phone: '+91 98205 99887',
      relationship: 'Daughter-in-law & Primary Caregiver',
      visibility: { canViewMeds: true, canViewVitals: true, canViewNotes: true, canViewLocation: true },
      notificationPrefs: { email: true, sms: true, instantDoseAlerts: true, missedDoseEscalation: true },
    },
    {
      uid: 'rohan_03',
      name: 'Rohan Sharma',
      role: 'familyContributor',
      email: 'rohan.blr@example.com',
      phone: '+91 98201 44321',
      relationship: 'Son (Lives in Bengaluru)',
      visibility: { canViewMeds: true, canViewVitals: true, canViewNotes: true, canViewLocation: false },
      notificationPrefs: { email: true, sms: false, instantDoseAlerts: true, missedDoseEscalation: true },
    },
    {
      uid: 'sunita_04',
      name: 'Sunita Patil (Visiting Nurse)',
      role: 'caretaker',
      email: 'sunita.nurse@example.com',
      phone: '+91 98190 33445',
      relationship: 'Home Care Nurse',
      visibility: { canViewMeds: true, canViewVitals: true, canViewNotes: true, canViewLocation: false },
      notificationPrefs: { email: false, sms: false, instantDoseAlerts: true, missedDoseEscalation: false },
    },
    {
      uid: 'ananya_05',
      name: 'Ananya Sharma',
      role: 'familyContributor',
      email: 'ananya.college@example.com',
      phone: '+91 98203 11890',
      relationship: 'Granddaughter (College Student in Mumbai)',
      visibility: { canViewMeds: true, canViewVitals: true, canViewNotes: true, canViewLocation: false },
      notificationPrefs: { email: true, sms: false, instantDoseAlerts: true, missedDoseEscalation: false },
    },
    {
      uid: 'vikram_06',
      name: 'Vikram Sharma',
      role: 'familyView',
      email: 'vikram.pune@example.com',
      phone: '+91 94220 88765',
      relationship: 'Elder Brother (78, Retired in Pune)',
      visibility: { canViewMeds: true, canViewVitals: false, canViewNotes: false, canViewLocation: false },
      notificationPrefs: { email: true, sms: false, instantDoseAlerts: false, missedDoseEscalation: true },
    },
    {
      uid: 'ramesh_07',
      name: 'Ramesh Patil',
      role: 'caretaker',
      email: 'ramesh.neighbor@example.com',
      phone: '+91 98200 44556',
      relationship: 'Next-Door Neighbor (Holds Spare Key)',
      visibility: { canViewMeds: false, canViewVitals: false, canViewNotes: false, canViewLocation: false },
      notificationPrefs: { email: true, sms: true, instantDoseAlerts: false, missedDoseEscalation: true },
    },
    {
      uid: 'jyoti_08',
      name: 'Dr. Jyoti Devi',
      role: 'caretaker',
      email: 'dr.jyoti.physio@example.com',
      phone: '+91 98198 77234',
      relationship: 'Evening Physiotherapist & Joint Rehab',
      visibility: { canViewMeds: true, canViewVitals: true, canViewNotes: true, canViewLocation: false },
      notificationPrefs: { email: false, sms: false, instantDoseAlerts: true, missedDoseEscalation: false },
    },
  ];

  for (const m of members) {
    await db.doc(`profiles/${profileId}/members/${m.uid}`).set({
      ...m,
      status: 'active',
      accessExpiresAt: null,
      lastActive: new Date().toISOString(),
    });
  }
  console.log(`✓ Seeded ${members.length} members in profiles/${profileId}/members`);

  // 3. Doctors Subcollection (profiles/{profileId}/doctors/{docId})
  const doctors = [
    {
      id: 'doc_kulkarni',
      name: 'Dr. Vikram Kulkarni',
      specialty: 'Senior Consultant Cardiologist & Diabetologist',
      hospital: 'Lilavati Hospital & Research Centre, Mumbai',
      phone: '+91 98220 55123',
      emergencyPhone: '+91 22 2675 1000',
      clinicAddress: 'OPD Suite 402, Lilavati Hospital, Bandra Reclamation, Bandra West, Mumbai 400050',
      consultationHours: 'Mon - Thu, 10:00 AM - 1:30 PM',
      email: 'dr.vkulkarni@lilavatihospital.com',
      notes: 'Primary cardiologist since 2018. Managing hypertension and Type 2 diabetes. Advised quarterly HbA1c.',
      prescribedMedicationIds: ['med_metformin', 'med_amlodipine', 'med_telmisartan'],
      nextAppointmentDate: '2026-11-20T10:30:00.000Z',
    },
    {
      id: 'doc_mehta',
      name: 'Dr. Anjali Mehta',
      specialty: 'Senior Orthopedic Surgeon & Joint Care Specialist',
      hospital: 'P. D. Hinduja National Hospital, Mahim, Mumbai',
      phone: '+91 98192 44100',
      emergencyPhone: '+91 22 2445 1515',
      clinicAddress: 'Shree Orthopedic Centre, Gokhale Road, Dadar West, Mumbai 400028',
      consultationHours: 'Tue & Fri, 4:00 PM - 7:30 PM',
      email: 'dr.anjali.mehta@hindujahospital.com',
      notes: 'Managing bilateral osteoarthritis with right knee predominance. Advised daily gentle quadriceps exercises.',
      prescribedMedicationIds: ['med_shelcal', 'med_paracetamol'],
      nextAppointmentDate: '2026-11-24T16:00:00.000Z',
    },
    {
      id: 'doc_iyer',
      name: 'Dr. Rajesh Iyer',
      specialty: 'Senior Consultant Geriatrician',
      hospital: 'Nanavati Max Super Speciality Hospital, Vile Parle, Mumbai',
      phone: '+91 98331 77654',
      emergencyPhone: '+91 22 2626 7500',
      clinicAddress: 'Geriatric Wellness Wing, Nanavati Hospital, S.V. Road, Vile Parle West, Mumbai 400056',
      consultationHours: 'Wed & Sat, 11:00 AM - 3:00 PM',
      email: 'dr.rajesh.iyer@nanavatimax.org',
      notes: 'Conducts biannual geriatric cognitive, memory, polypharmacy and fall-risk evaluations.',
      prescribedMedicationIds: [],
      nextAppointmentDate: '2026-12-15T11:00:00.000Z',
    },
    {
      id: 'doc_nambiar',
      name: 'Dr. Priya Nambiar',
      specialty: 'Chief Vitreo-Retinal & Cataract Surgeon',
      hospital: 'Aditya Jyot Eye Hospital, Wadala, Mumbai',
      phone: '+91 98450 66890',
      emergencyPhone: '+91 22 2417 7600',
      clinicAddress: 'Plot 153, Major Parameshwaran Road, Wadala West, Mumbai 400031',
      consultationHours: 'Mon & Thu, 2:00 PM - 6:00 PM',
      email: 'dr.priya.nambiar@adityajyot.com',
      notes: 'Conducts annual diabetic retinopathy and intraocular pressure screening.',
      prescribedMedicationIds: [],
      nextAppointmentDate: '2026-12-04T14:30:00.000Z',
    },
    {
      id: 'doc_deshmukh',
      name: 'Dr. Sameer Deshmukh',
      specialty: 'Senior Physiotherapist & Neuro-Muscular Rehab Specialist',
      hospital: 'ActiveLife Physical Therapy Centre, Bandra West',
      phone: '+91 98204 33211',
      emergencyPhone: '+91 98204 33211',
      clinicAddress: 'Bandra Medical Enclave, Turner Road, Bandra West, Mumbai 400050',
      consultationHours: 'Daily Home Care Sessions by Appointment',
      email: 'sam.deshmukh.pt@gmail.com',
      notes: 'Supervises home rehabilitation plan and works closely with evening nurse Sunita Patil.',
      prescribedMedicationIds: [],
    },
  ];

  for (const doc of doctors) {
    await db.doc(`profiles/${profileId}/doctors/${doc.id}`).set(doc);
  }
  console.log(`✓ Seeded ${doctors.length} doctors & specialists in profiles/${profileId}/doctors`);

  // 4. Invites Subcollection (profiles/{profileId}/invites/{inviteId})
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

  // 5. Medications & Schedules Subcollections
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
      prescriber: 'Dr. Vikram Kulkarni',
      photoUrl: null,
      colorTag: '#3b82f6',
      dailyDoseCount: 2,
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
      prescriber: 'Dr. Vikram Kulkarni',
      photoUrl: null,
      colorTag: '#10b981',
      dailyDoseCount: 1,
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
      prescriber: 'Dr. Anjali Mehta',
      photoUrl: null,
      colorTag: '#f59e0b',
      dailyDoseCount: 1,
    },
    {
      id: 'med_telmisartan',
      name: 'Telmisartan',
      strength: '40 mg',
      form: 'tablet',
      instructions: '1 tablet at bedtime for blood pressure stability',
      missedDoseInstruction: 'Take before sleeping',
      supplyCount: 25,
      refillThresholdDays: 7,
      status: 'active',
      prescriber: 'Dr. Vikram Kulkarni',
      photoUrl: null,
      colorTag: '#ec4899',
      dailyDoseCount: 1,
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

  // 6. Dose Events Subcollection (profiles/{profileId}/doseEvents/{eventId})
  const today = new Date().toISOString().split('T')[0];
  const doses = [
    { id: 'dose_01', medId: 'med_metformin', scheduledAt: `${today}T08:00:00.000Z`, status: 'taken', loggedBy: 'Savitri (Self)', loggedAt: `${today}T08:02:00.000Z`, reason: null },
    { id: 'dose_02', medId: 'med_amlodipine', scheduledAt: `${today}T08:00:00.000Z`, status: 'taken', loggedBy: 'Savitri (Self)', loggedAt: `${today}T08:02:00.000Z`, reason: null },
    { id: 'dose_03', medId: 'med_shelcal', scheduledAt: `${today}T13:00:00.000Z`, status: 'due', loggedBy: null, loggedAt: null, reason: null },
    { id: 'dose_04', medId: 'med_metformin', scheduledAt: `${today}T20:00:00.000Z`, status: 'upcoming', loggedBy: null, loggedAt: null, reason: null },
    { id: 'dose_05', medId: 'med_telmisartan', scheduledAt: `${today}T20:00:00.000Z`, status: 'upcoming', loggedBy: null, loggedAt: null, reason: null },
  ];
  for (const d of doses) {
    await db.doc(`profiles/${profileId}/doseEvents/${d.id}`).set(d);
  }
  console.log(`✓ Seeded ${doses.length} dose events for today`);

  // 7. Appointments Subcollection (profiles/{profileId}/appointments/{aptId})
  const appointments = [
    {
      id: 'apt_kulkarni_nov',
      doctor: 'Dr. Vikram Kulkarni',
      specialty: 'Senior Consultant Cardiologist & Diabetologist',
      location: 'Lilavati Hospital, Bandra West, Mumbai',
      datetime: new Date(Date.now() + 42 * 3600 * 1000).toISOString(),
      purpose: 'Routine 3-month hypertension & diabetes review',
      accompanyingPerson: 'Meena Sharma',
      checklist: [
        { id: 'c1', text: 'Carry latest fasting blood sugar log', done: true },
        { id: 'c2', text: 'Carry blood pressure readings sheet', done: true },
        { id: 'c3', text: 'Carry current medicine strips', done: false },
      ],
      outcomeNotes: '',
      status: 'upcoming',
      phone: '+91 98220 55123',
    },
    {
      id: 'apt_mehta_dec',
      doctor: 'Dr. Anjali Mehta',
      specialty: 'Senior Orthopedic Surgeon & Joint Care Specialist',
      location: 'Shree Orthopedic Centre, Dadar West, Mumbai',
      datetime: new Date(Date.now() + 6 * 24 * 3600 * 1000).toISOString(),
      purpose: 'Right knee osteoarthritis review & physio assessment',
      accompanyingPerson: null,
      checklist: [
        { id: 'c21', text: 'Carry knee X-ray films', done: false },
        { id: 'c22', text: 'Note down frequency of knee stiffness', done: false },
      ],
      outcomeNotes: '',
      status: 'upcoming',
      phone: '+91 98192 44100',
    },
    {
      id: 'apt_nambiar_dec',
      doctor: 'Dr. Priya Nambiar',
      specialty: 'Chief Vitreo-Retinal & Cataract Surgeon',
      location: 'Aditya Jyot Eye Hospital, Wadala West, Mumbai',
      datetime: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString(),
      purpose: 'Annual Diabetic Retinopathy Dilated Eye Exam',
      accompanyingPerson: 'Ananya Sharma',
      checklist: [
        { id: 'c31', text: 'Carry dark sunglasses for return journey', done: true },
        { id: 'c32', text: 'Carry current bifocal reading glasses', done: true },
      ],
      outcomeNotes: '',
      status: 'upcoming',
      phone: '+91 98450 66890',
    },
    {
      id: 'apt_iyer_jan',
      doctor: 'Dr. Rajesh Iyer',
      specialty: 'Senior Consultant Geriatrician',
      location: 'Nanavati Max Super Speciality Hospital, Vile Parle West',
      datetime: new Date(Date.now() + 28 * 24 * 3600 * 1000).toISOString(),
      purpose: 'Biannual Geriatric Health, Memory & Polypharmacy Review',
      accompanyingPerson: null,
      checklist: [
        { id: 'c41', text: 'Carry complete list of all 6 active prescriptions', done: false },
        { id: 'c42', text: 'Print 30-day adherence report from CareCircle', done: false },
      ],
      outcomeNotes: '',
      status: 'upcoming',
      phone: '+91 98331 77654',
    },
  ];

  for (const apt of appointments) {
    await db.doc(`profiles/${profileId}/appointments/${apt.id}`).set(apt);
  }
  console.log(`✓ Seeded ${appointments.length} appointments in profiles/${profileId}/appointments`);

  // 8. Care Notes Subcollection (profiles/{profileId}/careNotes/{noteId})
  const notes = [
    {
      id: 'note_01',
      author: 'Sunita Patil (Visiting Nurse)',
      authorRole: 'caretaker',
      category: 'vital',
      content: 'Morning BP: 126/80 mmHg, Pulse 72 bpm. Fasting blood sugar 112 mg/dL. Savitri feeling energetic.',
      timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
      isPrivate: false,
    },
    {
      id: 'note_02',
      author: 'Dr. Jyoti Devi',
      authorRole: 'caretaker',
      category: 'doctor',
      content: 'Completed 40-minute knee rehabilitation session. Quadriceps strength improving. Savitri stood with single-leg support for 15s.',
      timestamp: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
      isPrivate: false,
    },
    {
      id: 'note_03',
      author: 'Ananya Sharma',
      authorRole: 'familyContributor',
      category: 'general',
      content: 'Spent Sunday afternoon with Dadi. Tested her large font size and voice read-aloud setting on CareCircle.',
      timestamp: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
      isPrivate: false,
    },
  ];

  for (const n of notes) {
    await db.doc(`profiles/${profileId}/careNotes/${n.id}`).set(n);
  }
  console.log(`✓ Seeded ${notes.length} care notes in profiles/${profileId}/careNotes`);

  // 9. Care Tasks Subcollection (profiles/{profileId}/careTasks/{taskId})
  const tasks = [
    {
      id: 'task_01',
      title: 'Order refill for Glimepiride 1 mg (Only 5 days left!)',
      dueDate: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString().split('T')[0],
      assignedTo: 'Meena Sharma',
      status: 'in_progress',
      description: 'Call Apollo Pharmacy or reorder via 1mg app.',
    },
    {
      id: 'task_02',
      title: 'Accompany Savitri to Aditya Jyot Eye Hospital for Retinopathy Scan',
      dueDate: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().split('T')[0],
      assignedTo: 'Ananya Sharma',
      status: 'pending',
      description: 'Bring dark sunglasses and previous retina report.',
    },
    {
      id: 'task_03',
      title: 'Confirm emergency backup key with neighbor Ramesh Patil',
      dueDate: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString().split('T')[0],
      assignedTo: 'Meena Sharma',
      status: 'pending',
      description: 'Verify society security contact protocol.',
    },
  ];

  for (const t of tasks) {
    await db.doc(`profiles/${profileId}/careTasks/${t.id}`).set(t);
  }
  console.log(`✓ Seeded ${tasks.length} care tasks in profiles/${profileId}/careTasks`);

  // 10. Audit Log Subcollection (profiles/{profileId}/auditLogs/{logId})
  await db.doc(`profiles/${profileId}/auditLogs/log_expand_01`).set({
    action: 'EXPAND_CARE_TEAM',
    actorName: 'System / Firebase Admin',
    actorRole: 'admin',
    details: 'Enriched CareCircle database with 5 medical specialists, 8 care circle members, and 4 appointments',
    timestamp: new Date().toISOString(),
  });
  console.log(`✓ Appended enrichment log to auditLogs`);

  const collections = await db.listCollections();
  console.log('\n======================================================');
  console.log('LIVE FIRESTORE ENRICHMENT COMPLETE FOR carecircle-4ec05!');
  console.log('Root collections in Firestore:', collections.map((c) => c.id).join(', '));
  console.log('======================================================');
}

seedLiveFirestore().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
