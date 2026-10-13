import { Organization, StaffProfile, PatientProfile, MedicalRecord, AuditEvent } from '../types/caretrail';

export const INITIAL_ORGANIZATIONS: Organization[] = [
  {
    id: 'hosp-apollo',
    name: 'Apollo Multi-Specialty Hospital',
    code: 'AMSH-BLR',
    type: 'Tertiary Care Hospital Network',
    city: 'Bengaluru',
    state: 'Karnataka',
    branches: [
      {
        id: 'branch-apollo-indiranagar',
        organizationId: 'hosp-apollo',
        name: 'Indiranagar Flagship Facility',
        branchCode: 'AMSH-BLR-01',
        address: '14th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru 560038',
        phone: '+91 80 2525 1000'
      },
      {
        id: 'branch-apollo-sheshadripuram',
        organizationId: 'hosp-apollo',
        name: 'Sheshadripuram OPD Center',
        branchCode: 'AMSH-BLR-02',
        address: '1st Main, Seshadripuram, Bengaluru 560020',
        phone: '+91 80 2346 5500'
      }
    ]
  },
  {
    id: 'hosp-city',
    name: 'City Care General Hospital',
    code: 'CCH-BLR',
    type: 'District Care Facility',
    city: 'Bengaluru',
    state: 'Karnataka',
    branches: [
      {
        id: 'branch-city-jayanagar',
        organizationId: 'hosp-city',
        name: 'Jayanagar 4th Block Center',
        branchCode: 'CCH-BLR-01',
        address: '9th Cross, Jayanagar 4th Block, Bengaluru 560011',
        phone: '+91 80 2656 2200'
      }
    ]
  },
  {
    id: 'hosp-fortis',
    name: 'Fortis Healthcare Institute',
    code: 'FHI-BLR',
    type: 'Super Specialty Hospital',
    city: 'Bengaluru',
    state: 'Karnataka',
    branches: [
      {
        id: 'branch-fortis-bgroad',
        organizationId: 'hosp-fortis',
        name: 'Bannerghatta Road Main Hospital',
        branchCode: 'FHI-BLR-01',
        address: '154/9, Bannerghatta Road, Opp. IIM-B, Bengaluru 560076',
        phone: '+91 80 6621 4444'
      }
    ]
  }
];

export const INITIAL_STAFF: StaffProfile[] = [
  {
    id: 'staff-anand',
    name: 'Dr. Anand Sharma',
    email: 'anand.sharma@apollo.caretrail.org',
    role: 'doctor',
    designation: 'Senior Consultant Physician',
    department: 'General & Internal Medicine',
    hospitalId: 'hosp-apollo',
    hospitalName: 'Apollo Multi-Specialty Hospital',
    branchId: 'branch-apollo-indiranagar',
    branchName: 'Indiranagar Flagship Facility',
    registrationNumber: 'KMC-54918-2008',
    password: 'doctor123'
  },
  {
    id: 'staff-priya',
    name: 'Dr. Priya Nair',
    email: 'priya.nair@apollo.caretrail.org',
    role: 'doctor',
    designation: 'Associate Consultant',
    department: 'Cardiology & Vascular Medicine',
    hospitalId: 'hosp-apollo',
    hospitalName: 'Apollo Multi-Specialty Hospital',
    branchId: 'branch-apollo-indiranagar',
    branchName: 'Indiranagar Flagship Facility',
    registrationNumber: 'KMC-68420-2015',
    password: 'doctor123'
  },
  {
    id: 'staff-ramesh-lab',
    name: 'Ramesh Varma',
    email: 'ramesh.varma@apollo.caretrail.org',
    role: 'lab_technician',
    designation: 'Senior Clinical Biochemist & Lab In-charge',
    department: 'Central Diagnostic Laboratory & Pathology',
    hospitalId: 'hosp-apollo',
    hospitalName: 'Apollo Multi-Specialty Hospital',
    branchId: 'branch-apollo-indiranagar',
    branchName: 'Indiranagar Flagship Facility',
    registrationNumber: 'KMC-LT-9021',
    password: 'lab123'
  },
  {
    id: 'staff-rekha',
    name: 'Nurse Rekha Gowda',
    email: 'rekha.gowda@apollo.caretrail.org',
    role: 'nurse',
    designation: 'Senior Triage Nurse',
    department: 'Outpatient Triage & Emergency',
    hospitalId: 'hosp-apollo',
    hospitalName: 'Apollo Multi-Specialty Hospital',
    branchId: 'branch-apollo-indiranagar',
    branchName: 'Indiranagar Flagship Facility',
    registrationNumber: 'KNC-88219-2012',
    password: 'nurse123'
  },
  {
    id: 'staff-vikram',
    name: 'Dr. Vikram Rao',
    email: 'vikram.rao@citycare.caretrail.org',
    role: 'doctor',
    designation: 'Chief Medical Officer',
    department: 'Internal Medicine & Critical Care',
    hospitalId: 'hosp-city',
    hospitalName: 'City Care General Hospital',
    branchId: 'branch-city-jayanagar',
    branchName: 'Jayanagar 4th Block Center',
    registrationNumber: 'KMC-41209-2004',
    password: 'doctor123'
  }
];

export const INITIAL_PATIENTS: PatientProfile[] = [
  // 1. Primary Profile 1: Full Comprehensive Records
  {
    id: 'pat-rajesh-kumar',
    mrn: 'AP-2024-8841',
    abhaId: '91-4821-3948-2019',
    name: 'Rajesh Kumar',
    age: 44,
    dob: '1980-05-15',
    gender: 'Male',
    phone: '+91 98450 12345',
    email: 'rajesh.kumar@example.com',
    bloodGroup: 'B+',
    emergencyContact: {
      name: 'Sunita Kumar',
      relationship: 'Spouse',
      phone: '+91 98450 99887'
    },
    hospitalId: 'hosp-apollo',
    hospitalName: 'Apollo Multi-Specialty Hospital',
    registeredBranchId: 'branch-apollo-indiranagar',
    registeredBranchName: 'Indiranagar Flagship Facility',
    registeredDate: '2024-01-12',
    address: '#42, 6th Cross, Indiranagar 1st Stage, Bengaluru 560038',
    allergies: ['Penicillin (Moderate rash)', 'Sulfa drugs'],
    chronicConditions: ['Type 2 Diabetes Mellitus', 'Essential Hypertension', 'Dyslipidemia'],
    password: 'patient123'
  },
  // 2. Primary Profile 2: Moderate Records
  {
    id: 'pat-meera-sundaram',
    mrn: 'AP-2023-1092',
    abhaId: '91-7712-4091-8832',
    name: 'Meera Sundaram',
    age: 32,
    dob: '1992-11-20',
    gender: 'Female',
    phone: '+91 98860 54321',
    email: 'meera.sundaram@example.com',
    bloodGroup: 'O+',
    emergencyContact: {
      name: 'Ravi Sundaram',
      relationship: 'Brother',
      phone: '+91 98860 11223'
    },
    hospitalId: 'hosp-apollo',
    hospitalName: 'Apollo Multi-Specialty Hospital',
    registeredBranchId: 'branch-apollo-sheshadripuram',
    registeredBranchName: 'Sheshadripuram OPD Center',
    registeredDate: '2023-08-14',
    address: '#108, Vyalikaval, Malleshwaram, Bengaluru 560003',
    allergies: ['Aspirin (Bronchospasm trigger)'],
    chronicConditions: ['Bronchial Asthma (Moderate persistent)', 'Allergic Rhinitis'],
    password: 'patient123'
  },
  // 3. Primary Profile 3: Minimal Records (1 Viral Fever Consultation Only)
  {
    id: 'pat-amit-patel',
    mrn: 'AP-2024-5501',
    abhaId: '91-9921-3341-6602',
    name: 'Amit Patel',
    age: 28,
    dob: '1996-04-12',
    gender: 'Male',
    phone: '+91 98110 55443',
    email: 'amit.patel@example.com',
    bloodGroup: 'A+',
    emergencyContact: {
      name: 'Pooja Patel',
      relationship: 'Spouse',
      phone: '+91 98110 22119'
    },
    hospitalId: 'hosp-apollo',
    hospitalName: 'Apollo Multi-Specialty Hospital',
    registeredBranchId: 'branch-apollo-indiranagar',
    registeredBranchName: 'Indiranagar Flagship Facility',
    registeredDate: '2024-03-01',
    address: '#14, 2nd Main, Koramangala 4th Block, Bengaluru 560034',
    allergies: [],
    chronicConditions: [],
    password: 'patient123'
  },
  // 4. Primary Profile 4: Fresh / Completely Blank Patient (0 Records, 0 Meds)
  {
    id: 'pat-kavita-joshi',
    mrn: 'AP-2024-9900',
    abhaId: '91-3310-8842-1199',
    name: 'Kavita Joshi',
    age: 24,
    dob: '2000-08-19',
    gender: 'Female',
    phone: '+91 97420 11992',
    email: 'kavita.joshi@example.com',
    bloodGroup: 'B+',
    emergencyContact: {
      name: 'Anand Joshi',
      relationship: 'Father',
      phone: '+91 97420 88221'
    },
    hospitalId: 'hosp-apollo',
    hospitalName: 'Apollo Multi-Specialty Hospital',
    registeredBranchId: 'branch-apollo-indiranagar',
    registeredBranchName: 'Indiranagar Flagship Facility',
    registeredDate: '2024-04-10',
    address: '#76, HSR Layout Sector 2, Bengaluru 560102',
    allergies: [],
    chronicConditions: [],
    password: 'patient123'
  },
  // 5. Primary Profile 5: Elder Chronic Patient with Ayushman Card (Cross-Hospital)
  {
    id: 'pat-sunita-devi',
    mrn: 'CC-2024-7712',
    abhaId: '91-8842-1920-4412',
    name: 'Sunita Devi',
    age: 65,
    dob: '1959-10-04',
    gender: 'Female',
    phone: '+91 94490 88123',
    email: 'sunita.devi@example.com',
    bloodGroup: 'AB+',
    emergencyContact: {
      name: 'Alok Nath',
      relationship: 'Son',
      phone: '+91 94490 11456'
    },
    hospitalId: 'hosp-city',
    hospitalName: 'City Care General Hospital',
    registeredBranchId: 'branch-city-jayanagar',
    registeredBranchName: 'Jayanagar 4th Block Center',
    registeredDate: '2023-10-18',
    address: '#29, 9th Main, Jayanagar 3rd Block, Bengaluru 560011',
    allergies: ['Sulfa antibiotics'],
    chronicConditions: ['Hypertension', 'Osteoporosis', 'Type 2 Diabetes'],
    password: 'patient123'
  },
  // Additional patients in database for Doctor Search (Total 15 profiles)
  {
    id: 'pat-suresh-hegde',
    mrn: 'AP-2024-9014',
    abhaId: '91-1039-5582-7714',
    name: 'Suresh Hegde',
    age: 61,
    dob: '1965-03-08',
    gender: 'Male',
    phone: '+91 94480 98765',
    email: 'suresh.hegde@example.com',
    bloodGroup: 'A+',
    emergencyContact: {
      name: 'Latha Hegde',
      relationship: 'Spouse',
      phone: '+91 94480 44556'
    },
    hospitalId: 'hosp-apollo',
    hospitalName: 'Apollo Multi-Specialty Hospital',
    registeredBranchId: 'branch-apollo-indiranagar',
    registeredBranchName: 'Indiranagar Flagship Facility',
    registeredDate: '2024-02-05',
    address: '#19, Defence Colony, Indiranagar, Bengaluru 560038',
    allergies: [],
    chronicConditions: ['Coronary Artery Disease (Post-CABG 2021)', 'Mild Osteoarthritis'],
    password: 'patient123'
  },
  {
    id: 'pat-kavita-patel',
    mrn: 'CC-2024-0419',
    abhaId: '91-8842-1920-4412',
    name: 'Kavita Patel',
    age: 38,
    dob: '1988-09-14',
    gender: 'Female',
    phone: '+91 97410 33221',
    email: 'kavita.patel@example.com',
    bloodGroup: 'AB+',
    emergencyContact: {
      name: 'Mahesh Patel',
      relationship: 'Spouse',
      phone: '+91 97410 88990'
    },
    hospitalId: 'hosp-city',
    hospitalName: 'City Care General Hospital',
    registeredBranchId: 'branch-city-jayanagar',
    registeredBranchName: 'Jayanagar 4th Block Center',
    registeredDate: '2024-03-10',
    address: '#55, 33rd Cross, Jayanagar 7th Block, Bengaluru 560082',
    allergies: ['Ciprofloxacin'],
    chronicConditions: ['Primary Hypothyroidism', 'Iron Deficiency Anemia'],
    password: 'patient123'
  },
  {
    id: 'pat-arvind-swamy',
    mrn: 'CC-2023-5591',
    abhaId: '91-3091-6674-1288',
    name: 'Arvind Swamy',
    age: 52,
    dob: '1974-12-02',
    gender: 'Male',
    phone: '+91 98440 77665',
    email: 'arvind.swamy@example.com',
    bloodGroup: 'O-',
    emergencyContact: {
      name: 'Gayathri Swamy',
      relationship: 'Spouse',
      phone: '+91 98440 33441'
    },
    hospitalId: 'hosp-city',
    hospitalName: 'City Care General Hospital',
    registeredBranchId: 'branch-city-jayanagar',
    registeredBranchName: 'Jayanagar 4th Block Center',
    registeredDate: '2023-11-19',
    address: '#87, Kanakapura Main Road, Banashankari 2nd Stage, Bengaluru 560070',
    allergies: ['NSAIDs (Gastric bleed history)'],
    chronicConditions: ['Chronic Kidney Disease (Stage 2)', 'Gouty Arthritis', 'Hypertension'],
    password: 'patient123'
  },
  {
    id: 'pat-sunita-reddy',
    mrn: 'FT-2024-3312',
    abhaId: '91-6652-3391-7700',
    name: 'Sunita Reddy',
    age: 41,
    dob: '1985-07-28',
    gender: 'Female',
    phone: '+91 99001 22334',
    email: 'sunita.reddy@example.com',
    bloodGroup: 'B-',
    emergencyContact: {
      name: 'Pradeep Reddy',
      relationship: 'Brother',
      phone: '+91 99001 77889'
    },
    hospitalId: 'hosp-fortis',
    hospitalName: 'Fortis Healthcare Institute',
    registeredBranchId: 'branch-fortis-bgroad',
    registeredBranchName: 'Bannerghatta Road Main Hospital',
    registeredDate: '2024-04-02',
    address: '#204, Prestige South Ridge, Hosur Road, Bengaluru 560068',
    allergies: ['Latex'],
    chronicConditions: ['Migraine with Aura', 'Cervical Spondylosis'],
    password: 'patient123'
  },
  {
    id: 'pat-deepak-verma',
    mrn: 'AP-2024-6012',
    abhaId: '91-4412-9021-3310',
    name: 'Deepak Verma',
    age: 46,
    dob: '1978-01-22',
    gender: 'Male',
    phone: '+91 98451 44556',
    email: 'deepak.verma@example.com',
    bloodGroup: 'O+',
    emergencyContact: {
      name: 'Shalini Verma',
      relationship: 'Spouse',
      phone: '+91 98451 99001'
    },
    hospitalId: 'hosp-apollo',
    hospitalName: 'Apollo Multi-Specialty Hospital',
    registeredBranchId: 'branch-apollo-indiranagar',
    registeredBranchName: 'Indiranagar Flagship Facility',
    registeredDate: '2024-01-20',
    address: '#312, 100ft Road, Indiranagar, Bengaluru 560038',
    allergies: [],
    chronicConditions: ['Hyperlipidemia', 'Mild Fatty Liver'],
    password: 'patient123'
  },
  {
    id: 'pat-ananya-roy',
    mrn: 'AP-2024-7140',
    abhaId: '91-5521-8819-2245',
    name: 'Ananya Roy',
    age: 34,
    dob: '1990-06-11',
    gender: 'Female',
    phone: '+91 98800 77123',
    email: 'ananya.roy@example.com',
    bloodGroup: 'A-',
    emergencyContact: {
      name: 'Debashish Roy',
      relationship: 'Spouse',
      phone: '+91 98800 33456'
    },
    hospitalId: 'hosp-apollo',
    hospitalName: 'Apollo Multi-Specialty Hospital',
    registeredBranchId: 'branch-apollo-indiranagar',
    registeredBranchName: 'Indiranagar Flagship Facility',
    registeredDate: '2024-02-14',
    address: '#55, Domlur 2nd Stage, Bengaluru 560071',
    allergies: [],
    chronicConditions: ['Polycystic Ovarian Syndrome'],
    password: 'patient123'
  },
  {
    id: 'pat-mohammed-farooq',
    mrn: 'CC-2024-3891',
    abhaId: '91-7734-1190-6641',
    name: 'Mohammed Farooq',
    age: 58,
    dob: '1966-11-03',
    gender: 'Male',
    phone: '+91 98452 33119',
    email: 'farooq.md@example.com',
    bloodGroup: 'B+',
    emergencyContact: {
      name: 'Amina Farooq',
      relationship: 'Spouse',
      phone: '+91 98452 77880'
    },
    hospitalId: 'hosp-city',
    hospitalName: 'City Care General Hospital',
    registeredBranchId: 'branch-city-jayanagar',
    registeredBranchName: 'Jayanagar 4th Block Center',
    registeredDate: '2024-01-05',
    address: '#89, Bannerghatta Main Road, Bengaluru 560029',
    allergies: [],
    chronicConditions: ['Type 2 Diabetes Mellitus', 'Peripheral Neuropathy'],
    password: 'patient123'
  },
  {
    id: 'pat-lakshmi-narayanan',
    mrn: 'FT-2024-5520',
    abhaId: '91-2290-6651-4482',
    name: 'Lakshmi Narayanan',
    age: 63,
    dob: '1961-04-18',
    gender: 'Female',
    phone: '+91 99450 11990',
    email: 'lakshmi.n@example.com',
    bloodGroup: 'O+',
    emergencyContact: {
      name: 'K. Narayanan',
      relationship: 'Spouse',
      phone: '+91 99450 88223'
    },
    hospitalId: 'hosp-fortis',
    hospitalName: 'Fortis Healthcare Institute',
    registeredBranchId: 'branch-fortis-bgroad',
    registeredBranchName: 'Bannerghatta Road Main Hospital',
    registeredDate: '2024-02-28',
    address: '#41, JP Nagar 6th Phase, Bengaluru 560078',
    allergies: [],
    chronicConditions: ['Hypertension', 'Chronic Lumbar Spondylosis'],
    password: 'patient123'
  },
  {
    id: 'pat-rohan-sengupta',
    mrn: 'AP-2024-8199',
    abhaId: '91-6643-2281-7790',
    name: 'Rohan Sengupta',
    age: 29,
    dob: '1995-09-29',
    gender: 'Male',
    phone: '+91 98112 33445',
    email: 'rohan.sen@example.com',
    bloodGroup: 'AB-',
    emergencyContact: {
      name: 'Tanushree Sengupta',
      relationship: 'Sister',
      phone: '+91 98112 77665'
    },
    hospitalId: 'hosp-apollo',
    hospitalName: 'Apollo Multi-Specialty Hospital',
    registeredBranchId: 'branch-apollo-indiranagar',
    registeredBranchName: 'Indiranagar Flagship Facility',
    registeredDate: '2024-03-22',
    address: '#190, Old Airport Road, Kodihalli, Bengaluru 560008',
    allergies: [],
    chronicConditions: [],
    password: 'patient123'
  },
  {
    id: 'pat-geeta-bhatt',
    mrn: 'CC-2024-6632',
    abhaId: '91-3382-7741-9950',
    name: 'Geeta Bhatt',
    age: 49,
    dob: '1975-02-14',
    gender: 'Female',
    phone: '+91 97412 88443',
    email: 'geeta.bhatt@example.com',
    bloodGroup: 'B+',
    emergencyContact: {
      name: 'Ramesh Bhatt',
      relationship: 'Spouse',
      phone: '+91 97412 11990'
    },
    hospitalId: 'hosp-city',
    hospitalName: 'City Care General Hospital',
    registeredBranchId: 'branch-city-jayanagar',
    registeredBranchName: 'Jayanagar 4th Block Center',
    registeredDate: '2024-02-19',
    address: '#62, 5th Main, Basavanagudi, Bengaluru 560004',
    allergies: [],
    chronicConditions: ['Hypothyroidism'],
    password: 'patient123'
  }
];

export const INITIAL_RECORDS: MedicalRecord[] = [
  // Rajesh Kumar Records (Apollo Hospital internal encounters)
  {
    id: 'rec-apollo-001',
    patientId: 'pat-rajesh-kumar',
    hospitalId: 'hosp-apollo',
    hospitalName: 'Apollo Multi-Specialty Hospital',
    branchId: 'branch-apollo-indiranagar',
    branchName: 'Indiranagar Flagship Facility',
    authorStaffId: 'staff-anand',
    authorStaffName: 'Dr. Anand Sharma',
    authorRole: 'Senior Consultant Physician',
    encounterDate: '2024-09-18',
    type: 'CONSULTATION',
    title: 'Outpatient Consultation: Glycemic Re-evaluation & BP Review',
    sourceSystemName: 'Apollo EHR v4.8 (Tier 2 Internal)',
    sourceCategory: 'INSTITUTIONAL',
    verificationStatus: 'VERIFIED',
    diagnosis: 'Type 2 Diabetes Mellitus (Uncontrolled), Essential Hypertension',
    clinicalNotes: 'Patient presents for 3-month follow-up. Reports mild bilateral pedal puffiness in the evening. Denies chest pain, orthopnea, or polyuria. Home fasting sugars range 130-150 mg/dL. Self-monitoring BP averages 135/88 mmHg. Compliant with Metformin and Telmisartan. Advised dietary reduction in refined carbohydrates, 45-min brisk walk daily, and addition of DPP-4 inhibitor if HbA1c remains > 7.5%.',
    vitals: {
      bloodPressure: '136/86 mmHg',
      pulseRate: '78 bpm',
      temperature: '98.4 °F',
      spO2: '99%',
      respiratoryRate: '16/min',
      weightKg: '78.5 kg'
    },
    prescriptions: [
      {
        medicineName: 'Metformin Hydrochloride (SR)',
        dosage: '1000 mg',
        frequency: 'Twice daily (after breakfast & dinner)',
        duration: '90 days',
        instructions: 'Take with food to minimize GI intolerance.'
      },
      {
        medicineName: 'Telmisartan Tablets IP',
        dosage: '40 mg',
        frequency: 'Once daily (morning)',
        duration: '90 days',
        instructions: 'Take after light morning snack.'
      },
      {
        medicineName: 'Atorvastatin IP',
        dosage: '10 mg',
        frequency: 'Once daily (at bedtime)',
        duration: '90 days',
        instructions: 'Lipid stabilization therapy.'
      }
    ],
    createdAt: '2024-09-18T10:45:00Z'
  },
  {
    id: 'rec-apollo-002',
    patientId: 'pat-rajesh-kumar',
    hospitalId: 'hosp-apollo',
    hospitalName: 'Apollo Multi-Specialty Hospital',
    branchId: 'branch-apollo-indiranagar',
    branchName: 'Indiranagar Flagship Facility',
    authorStaffId: 'staff-anand',
    authorStaffName: 'Apollo Central Biochemistry Lab',
    authorRole: 'Clinical Pathologist',
    encounterDate: '2024-09-16',
    type: 'LAB_REPORT',
    title: 'Comprehensive Metabolic Panel & Glycated Hemoglobin (HbA1c)',
    sourceSystemName: 'Apollo LIMS Centralized System',
    sourceCategory: 'INSTITUTIONAL',
    verificationStatus: 'VERIFIED',
    diagnosis: 'Elevated HbA1c, Elevated Fasting Plasma Glucose',
    clinicalNotes: 'Fasting specimen collected at 07:45 AM. Quality control verification passed on automated analyzer Cobas 6000.',
    originalDocumentName: 'apollo_lims_metabolic_hba1c_panel.pdf',
    aiLabSummary: 'AI Diagnostic Analysis: 3 Out-of-Range Values Detected.\n• Fasting Blood Glucose (142 mg/dL - HIGH, ref 70-100) indicates elevated fasting plasma sugar.\n• HbA1c (7.8% - HIGH, ref <5.7%) indicates uncontrolled glycemic status.\n• Serum Triglycerides (184 mg/dL - HIGH, ref <150) indicates elevated circulating triglycerides.\n• Renal function (Creatinine 0.92 mg/dL, eGFR 94 mL/min) and Total Cholesterol (198 mg/dL) are within normal baseline range.',
    pdfContentText: `APOLLO HOSPITALS DIAGNOSTIC PATHOLOGY SERVICES
Branch: Indiranagar Flagship Facility | Accredited NABL & CAP
Patient Name: Rajesh Kumar | MRN: AP-2024-8841 | Age/Sex: 52y/Male
Sample Collected: 16-Sep-2024 07:45 AM | Verified: 16-Sep-2024 03:20 PM
Analyzer: Roche Cobas 6000 Automated Clinical Chemistry

INVESTIGATION RESULTS:
------------------------------------------------------------------------
Test Parameter              Result      Unit       Reference Interval   Status
------------------------------------------------------------------------
Glycated Hemoglobin (HbA1c) 7.8         %          < 5.7 Normal         [HIGH]
Fasting Blood Glucose       142         mg/dL      70 - 100             [HIGH]
Serum Creatinine            0.92        mg/dL      0.70 - 1.20          Normal
Estimated GFR (CKD-EPI)     94          mL/min     > 60                 Normal
Total Cholesterol           198         mg/dL      < 200                Normal
Serum Triglycerides         184         mg/dL      < 150                [HIGH]
------------------------------------------------------------------------
Verified by: Dr. Subhashini Rao, MD Pathology | Ramesh Varma, Chief Lab Tech`,
    labResults: [
      {
        testName: 'Glycated Hemoglobin (HbA1c)',
        value: '7.8',
        unit: '%',
        referenceRange: '< 5.7 (Normal), 5.7 - 6.4 (Prediabetes), >= 6.5 (Diabetes)',
        isAbnormal: true,
        flag: 'HIGH'
      },
      {
        testName: 'Fasting Blood Glucose (FBG)',
        value: '142',
        unit: 'mg/dL',
        referenceRange: '70 - 100 mg/dL',
        isAbnormal: true,
        flag: 'HIGH'
      },
      {
        testName: 'Serum Creatinine',
        value: '0.92',
        unit: 'mg/dL',
        referenceRange: '0.70 - 1.20 mg/dL',
        isAbnormal: false,
        flag: 'NORMAL'
      },
      {
        testName: 'Estimated GFR (CKD-EPI)',
        value: '94',
        unit: 'mL/min/1.73m²',
        referenceRange: '> 60 mL/min/1.73m²',
        isAbnormal: false,
        flag: 'NORMAL'
      },
      {
        testName: 'Total Cholesterol',
        value: '198',
        unit: 'mg/dL',
        referenceRange: '< 200 mg/dL',
        isAbnormal: false,
        flag: 'NORMAL'
      },
      {
        testName: 'Serum Triglycerides',
        value: '184',
        unit: 'mg/dL',
        referenceRange: '< 150 mg/dL',
        isAbnormal: true,
        flag: 'HIGH'
      }
    ],
    createdAt: '2024-09-16T15:20:00Z'
  },
  {
    id: 'rec-apollo-003',
    patientId: 'pat-rajesh-kumar',
    hospitalId: 'hosp-apollo',
    hospitalName: 'Apollo Multi-Specialty Hospital',
    branchId: 'branch-apollo-indiranagar',
    branchName: 'Indiranagar Flagship Facility',
    authorStaffId: 'staff-priya',
    authorStaffName: 'Dr. Priya Nair',
    authorRole: 'Consultant Cardiologist',
    encounterDate: '2024-05-22',
    type: 'CONSULTATION',
    title: 'Cardiology Screening & 12-Lead Resting ECG Evaluation',
    sourceSystemName: 'Apollo EHR v4.8 (Tier 2 Internal)',
    sourceCategory: 'INSTITUTIONAL',
    verificationStatus: 'VERIFIED',
    diagnosis: 'Sinus Rhythm, Mild Left Ventricular Hypertrophy (Voltage Criteria)',
    clinicalNotes: 'Screening evaluation referred by Dr. Sharma in view of 6-year history of hypertension. 12-lead ECG confirms normal sinus rhythm rate 74 bpm, no acute ST-T deviations or pathologic Q waves. Transthoracic echocardiogram showed normal left ventricular ejection fraction of 62%, mild concentric LVH, grade I diastolic dysfunction. Continue current Telmisartan 40mg. Re-evaluate echocardiogram in 18 months.',
    vitals: {
      bloodPressure: '138/84 mmHg',
      pulseRate: '74 bpm',
      spO2: '98%',
      temperature: '98.6 °F',
      weightKg: '79.0 kg'
    },
    createdAt: '2024-05-22T11:15:00Z'
  },
  {
    id: 'rec-apollo-004',
    patientId: 'pat-rajesh-kumar',
    hospitalId: 'hosp-apollo',
    hospitalName: 'Apollo Multi-Specialty Hospital',
    branchId: 'branch-apollo-indiranagar',
    branchName: 'Indiranagar Flagship Facility',
    authorStaffId: 'staff-rekha',
    authorStaffName: 'Nurse Rekha Gowda',
    authorRole: 'Senior Triage Nurse',
    encounterDate: '2024-01-12',
    type: 'VITALS',
    title: 'Baseline Triage & Institutional Onboarding Intake',
    sourceSystemName: 'Apollo Nursing Station Intake',
    sourceCategory: 'INSTITUTIONAL',
    verificationStatus: 'VERIFIED',
    clinicalNotes: 'Initial registration at Apollo Indiranagar. Patient verified with government photo ID and ABHA address. Known allergy to Penicillin documented in EHR red-flag alert. Assigned primary consultant Dr. Anand Sharma.',
    vitals: {
      bloodPressure: '142/90 mmHg',
      pulseRate: '82 bpm',
      temperature: '98.2 °F',
      spO2: '99%',
      respiratoryRate: '18/min',
      weightKg: '80.2 kg'
    },
    createdAt: '2024-01-12T09:10:00Z'
  },

  // Meera Sundaram Records
  {
    id: 'rec-apollo-005',
    patientId: 'pat-meera-sundaram',
    hospitalId: 'hosp-apollo',
    hospitalName: 'Apollo Multi-Specialty Hospital',
    branchId: 'branch-apollo-sheshadripuram',
    branchName: 'Sheshadripuram OPD Center',
    authorStaffId: 'staff-anand',
    authorStaffName: 'Dr. Anand Sharma',
    authorRole: 'Senior Consultant Physician',
    encounterDate: '2024-08-04',
    type: 'CONSULTATION',
    title: 'Pulmonary Assessment: Seasonal Asthma Exacerbation',
    sourceSystemName: 'Apollo EHR v4.8 (Tier 2 Internal)',
    sourceCategory: 'INSTITUTIONAL',
    verificationStatus: 'VERIFIED',
    diagnosis: 'Bronchial Asthma Exacerbation (Dust & Pollen Trigger)',
    clinicalNotes: 'Patient experienced nighttime wheezing and paroxysmal dry cough over past 5 days following Bangalore monsoon rains. Peak expiratory flow rate (PEFR) 360 L/min (78% predicted). Bilateral polyphonic wheezes audible on forced expiration. Nebulized with Levosalbutamol + Budesonide in OPD with rapid symptomatic relief. Inhaler technique verified with spacer device.',
    vitals: {
      bloodPressure: '118/76 mmHg',
      pulseRate: '88 bpm',
      spO2: '96%',
      temperature: '98.6 °F',
      respiratoryRate: '20/min',
      weightKg: '56.0 kg'
    },
    prescriptions: [
      {
        medicineName: 'Formoterol Fumarate + Budesonide Inhaler (200/6 mcg)',
        dosage: '1 puff',
        frequency: 'Twice daily with spacer',
        duration: '60 days',
        instructions: 'Rinse mouth thoroughly after every inhalation.'
      },
      {
        medicineName: 'Levocetirizine Dihydrochloride',
        dosage: '5 mg',
        frequency: 'Once daily (bedtime)',
        duration: '14 days',
        instructions: 'For allergic rhinitis control.'
      }
    ],
    createdAt: '2024-08-04T14:30:00Z'
  },

  // City Care Hospital Records (Belong to hosp-city)
  {
    id: 'rec-city-001',
    patientId: 'pat-arvind-swamy',
    hospitalId: 'hosp-city',
    hospitalName: 'City Care General Hospital',
    branchId: 'branch-city-jayanagar',
    branchName: 'Jayanagar 4th Block Center',
    authorStaffId: 'staff-vikram',
    authorStaffName: 'Dr. Vikram Rao',
    authorRole: 'Chief Medical Officer',
    encounterDate: '2024-07-11',
    type: 'CONSULTATION',
    title: 'Nephrology & Renal Function Review',
    sourceSystemName: 'City Care MediSys v2.1',
    sourceCategory: 'INSTITUTIONAL',
    verificationStatus: 'VERIFIED',
    diagnosis: 'Chronic Kidney Disease Stage 2, Hyperuricemia with Gout flares',
    clinicalNotes: 'Serum creatinine stable at 1.4 mg/dL with eGFR 58 mL/min. Reports no joint pain since Febuxostat titration. Strict avoidance of NSAIDs reiterated. Low purine, low sodium dietary plan provided.',
    vitals: {
      bloodPressure: '128/82 mmHg',
      pulseRate: '72 bpm',
      spO2: '98%',
      temperature: '98.4 °F',
      weightKg: '71.0 kg'
    },
    createdAt: '2024-07-11T11:00:00Z'
  },

  // Rajesh Kumar: Tier 4 Patient-Uploaded Scanned Documents
  {
    id: 'rec-upload-001',
    patientId: 'pat-rajesh-kumar',
    hospitalId: 'hosp-manipal-ext',
    hospitalName: 'Manipal Hospital (Old Airport Rd)',
    branchId: 'branch-manipal-main',
    branchName: 'Cardiology Outpatient Clinic',
    authorStaffId: 'ext-doc-srinivas',
    authorStaffName: 'Dr. Srinivas Murthy (External Consultant)',
    authorRole: 'Consultant Cardiologist',
    encounterDate: '2023-11-10',
    type: 'PRESCRIPTION',
    title: 'Scanned Prescription: Prior Statin & Metformin Regimen',
    sourceSystemName: 'Tier 4 Document Capture (Manipal Hospital Paper Scan)',
    sourceCategory: 'PATIENT_UPLOADED',
    verificationStatus: 'AWAITING_REVIEW',
    originalDocumentName: 'Manipal_Cardio_Prescription_Nov2023.pdf',
    originalDocumentId: 'doc-upl-8821',
    extractedSnippet: 'Rx: Rosuvastatin 10mg OD bedtime, Metformin 500mg BD. Advised regular HbA1c review and lifestyle adjustment.',
    clinicalNotes: 'Document uploaded by patient. Optical text extraction identified previous medication regimen prior to Apollo registration. Awaiting attending clinician verification.',
    prescriptions: [
      {
        medicineName: 'Rosuvastatin IP',
        dosage: '10 mg',
        frequency: 'Once daily (bedtime)',
        duration: '60 days',
        instructions: 'Documented prior statin regimen.'
      },
      {
        medicineName: 'Metformin Hydrochloride',
        dosage: '500 mg',
        frequency: 'Twice daily',
        duration: '60 days',
        instructions: 'Prior glycemic control dose.'
      }
    ],
    createdAt: '2023-11-10T14:20:00Z'
  },
  {
    id: 'rec-upload-002',
    patientId: 'pat-rajesh-kumar',
    hospitalId: 'hosp-anand-labs',
    hospitalName: 'Anand Diagnostic Laboratories',
    branchId: 'branch-anand-shivajinagar',
    branchName: 'Shivajinagar Imaging Center',
    authorStaffId: 'ext-doc-kavitha',
    authorStaffName: 'Dr. Kavitha Raman',
    authorRole: 'Consultant Radiologist',
    encounterDate: '2023-04-18',
    type: 'LAB_REPORT',
    title: 'Scanned Diagnostic Report: Whole Abdomen Ultrasound Scan',
    sourceSystemName: 'Tier 4 Document Capture (Anand Diagnostic Labs Scan)',
    sourceCategory: 'PATIENT_UPLOADED',
    verificationStatus: 'AWAITING_REVIEW',
    originalDocumentName: 'Anand_Labs_USG_Abdomen_Apr2023.pdf',
    originalDocumentId: 'doc-upl-5419',
    extractedSnippet: 'Liver: Mild hepatomegaly (15.2 cm) with diffuse increase in parenchymal echogenicity consistent with Grade 1 Fatty Liver. Normal renal cortical thickness.',
    clinicalNotes: 'Scanned imaging report provided by patient. Confirms Grade 1 diffuse hepatic steatosis (fatty liver). Bilateral kidneys normal size with preserved corticomedullary differentiation.',
    labResults: [
      {
        testName: 'Ultrasound Liver Span',
        value: '15.2',
        unit: 'cm',
        referenceRange: '< 15.0 cm',
        isAbnormal: true
      },
      {
        testName: 'Renal Cortical Thickness',
        value: '1.4',
        unit: 'cm',
        referenceRange: '1.2 - 1.8 cm',
        isAbnormal: false
      }
    ],
    createdAt: '2023-04-18T16:00:00Z'
  },

  // Rajesh Kumar: Tier 4 Patient-Reported Longitudinal Events (Memory / Self-Report)
  {
    id: 'rec-reported-001',
    patientId: 'pat-rajesh-kumar',
    hospitalId: 'hosp-stmarthas',
    hospitalName: "St. Martha's Hospital (Remembered)",
    branchId: 'branch-stmarthas-main',
    branchName: 'Inpatient Medicine Ward',
    authorStaffId: 'pat-rajesh-kumar',
    authorStaffName: 'Rajesh Kumar (Patient Recall)',
    authorRole: 'Patient Self-Narrative',
    encounterDate: '2018-06-15',
    type: 'CONSULTATION',
    title: 'Patient-Reported History: Acute Enteric Fever & Inpatient Stay',
    sourceSystemName: 'Tier 4 Patient Memory Recall',
    sourceCategory: 'PATIENT_REPORTED',
    verificationStatus: 'AWAITING_REVIEW',
    isPatientReported: true,
    patientReportedNotes: "Patient recalls being admitted for 5 days at St. Martha's Hospital for high continuous fever and abdominal cramps. Stated Widal test was positive. Treated with IV Ceftriaxone for 5 days with uneventful recovery.",
    clinicalNotes: 'Patient-reported historical event (memory recall). Unverified by institutional record. Entered for clinical context awareness regarding past enteric infection.',
    createdAt: '2024-01-12T10:00:00Z'
  },
  {
    id: 'rec-reported-002',
    patientId: 'pat-rajesh-kumar',
    hospitalId: 'hosp-unspecified',
    hospitalName: 'Local Neighborhood Clinic (Remembered)',
    branchId: 'branch-local-opd',
    branchName: 'Primary Care OPD',
    authorStaffId: 'pat-rajesh-kumar',
    authorStaffName: 'Rajesh Kumar (Patient Recall)',
    authorRole: 'Patient Self-Narrative',
    encounterDate: '2016-09-02',
    type: 'CONSULTATION',
    title: 'Patient-Reported History: Severe Cutaneous Reaction to Amoxicillin',
    sourceSystemName: 'Tier 4 Patient Memory Recall',
    sourceCategory: 'PATIENT_REPORTED',
    verificationStatus: 'AWAITING_REVIEW',
    isPatientReported: true,
    patientReportedNotes: 'Developed widespread itchy hives, facial swelling, and mild lip puffiness 24 hours after taking Amoxicillin 500mg. Given urgent antihistamine injections.',
    clinicalNotes: 'Patient-reported adverse drug reaction event. Basis for documented Penicillin/Beta-lactam red-flag allergy in hospital profile.',
    createdAt: '2024-01-12T10:05:00Z'
  },
  // Amit Patel: Minimal records (Only 1 recent consultation, viral fever, no chronic disease)
  {
    id: 'rec-amit-001',
    patientId: 'pat-amit-patel',
    hospitalId: 'hosp-apollo',
    hospitalName: 'Apollo Multi-Specialty Hospital',
    branchId: 'branch-apollo-indiranagar',
    branchName: 'Indiranagar Flagship Facility',
    authorStaffId: 'staff-anand',
    authorStaffName: 'Dr. Anand Sharma',
    authorRole: 'Senior Consultant Physician',
    encounterDate: '2024-03-05',
    type: 'CONSULTATION',
    title: 'Outpatient Consultation: Acute Viral Pharyngitis & Low-grade Fever',
    sourceSystemName: 'Apollo EHR v4.8',
    sourceCategory: 'INSTITUTIONAL',
    verificationStatus: 'VERIFIED',
    diagnosis: 'Acute Viral Upper Respiratory Infection',
    clinicalNotes: 'Young adult presenting with mild sore throat, nasal congestion, and low-grade fever for 2 days. Chest clear bilaterally, throat shows mild erythematous mucosal injection without purulent exudates. Vitals stable. Advised adequate hydration, warm saline gargles, and Paracetamol as needed. Rest for 3 days.',
    vitals: {
      bloodPressure: '118/76 mmHg',
      pulseRate: '76 bpm',
      temperature: '99.2 °F',
      spO2: '99%',
      respiratoryRate: '16/min'
    },
    prescriptions: [
      {
        medicineName: 'Paracetamol IP',
        dosage: '650 mg',
        frequency: 'Thrice daily (as needed for fever)',
        duration: '3 days',
        instructions: 'Take after food if temperature > 99.5°F'
      }
    ],
    createdAt: '2024-03-05T11:20:00Z'
  },
  // Sunita Devi: Elder Chronic Patient Records (Cross-hospital via Ayushman Card / ABHA)
  {
    id: 'rec-sunita-001',
    patientId: 'pat-sunita-devi',
    hospitalId: 'hosp-city',
    hospitalName: 'City Care General Hospital',
    branchId: 'branch-city-jayanagar',
    branchName: 'Jayanagar 4th Block Center',
    authorStaffId: 'staff-vikram',
    authorStaffName: 'Dr. Vikram Rao',
    authorRole: 'Chief Medical Officer',
    encounterDate: '2024-03-12',
    type: 'CONSULTATION',
    title: 'Geriatric Outpatient Review: Hypertension & Knee Osteoarthritis',
    sourceSystemName: 'City Care EMR v3.2',
    sourceCategory: 'INSTITUTIONAL',
    verificationStatus: 'VERIFIED',
    diagnosis: 'Essential Hypertension (Stage 1), Bilateral Knee Osteoarthritis',
    clinicalNotes: 'Follow-up for long-standing hypertension and mechanical knee pain on stair climbing. Blood pressure well controlled on Amlodipine 5mg. Advised quadriceps strengthening exercises, calcium and vitamin D supplementation.',
    vitals: {
      bloodPressure: '132/84 mmHg',
      pulseRate: '72 bpm',
      temperature: '98.2 °F',
      spO2: '98%',
      respiratoryRate: '18/min'
    },
    prescriptions: [
      {
        medicineName: 'Amlodipine Besylate',
        dosage: '5 mg',
        frequency: 'Once daily (morning)',
        duration: '90 days',
        instructions: 'Take in the morning after breakfast.'
      },
      {
        medicineName: 'Calcium Carbonate + Vit D3',
        dosage: '500 mg / 400 IU',
        frequency: 'Once daily (evening)',
        duration: '90 days',
        instructions: 'Take after dinner.'
      }
    ],
    createdAt: '2024-03-12T09:30:00Z'
  },
  {
    id: 'rec-sunita-002',
    patientId: 'pat-sunita-devi',
    hospitalId: 'hosp-city',
    hospitalName: 'City Care General Hospital',
    branchId: 'branch-city-jayanagar',
    branchName: 'Jayanagar 4th Block Center',
    authorStaffId: 'staff-vikram',
    authorStaffName: 'City Care Diagnostic Laboratory',
    authorRole: 'Clinical Pathologist',
    encounterDate: '2024-03-11',
    type: 'LAB_REPORT',
    title: 'Lipid Profile & Serum Calcium Investigation',
    sourceSystemName: 'City Care LIMS',
    sourceCategory: 'INSTITUTIONAL',
    verificationStatus: 'VERIFIED',
    diagnosis: 'Normal Lipid Profile, Mild Vitamin D Insufficiency',
    clinicalNotes: 'Serum specimens collected in fasting state. Automated biochemistry assay.',
    labResults: [
      {
        testName: 'Total Cholesterol',
        value: '182',
        unit: 'mg/dL',
        referenceRange: '< 200 mg/dL',
        isAbnormal: false
      },
      {
        testName: 'Serum Calcium',
        value: '9.2',
        unit: 'mg/dL',
        referenceRange: '8.8 - 10.2 mg/dL',
        isAbnormal: false
      }
    ],
    createdAt: '2024-03-11T14:15:00Z'
  }
];

export const INITIAL_MULTI_SOURCE_CHANNELS = [
  {
    id: 'chan-tier2-local',
    name: 'Apollo Hospital In-Network EHR',
    code: 'TIER-2-LOCAL',
    tier: 'Tier 2 (Hospital DB/API)',
    sourceCategory: 'INSTITUTIONAL' as const,
    description: 'Internal relational database and Laboratory Information Management System (LIMS) direct connection.',
    status: 'ACTIVE' as const,
    recordsCount: 4,
    lastSyncTime: 'Live / Synchronized',
    protocol: 'PostgreSQL Direct Scoped Connection',
    details: 'Immediate operational access without patient consent required for in-hospital duty of care.'
  },
  {
    id: 'chan-tier2-exchange',
    name: 'Cross-Hospital Consented Exchange',
    code: 'TIER-2-EXCHANGE',
    tier: 'Tier 2 (Cross-Facility Bridge)',
    sourceCategory: 'EXTERNAL_EXCHANGE' as const,
    description: 'Bilateral consented data bridge between verified healthcare networks.',
    status: 'READY' as const,
    recordsCount: 1,
    lastSyncTime: 'On Consent Authorization',
    protocol: 'ABDM Consent-Scoped API Exchange',
    details: 'Enforces strict patient consent gates. Access revoked immediately upon patient instruction.'
  },
  {
    id: 'chan-tier4-doc',
    name: 'Patient Document Capture & AI OCR',
    code: 'TIER-4-DOC-AI',
    tier: 'Tier 4 (Paper Scan & OCR Capture)',
    sourceCategory: 'PATIENT_UPLOADED' as const,
    description: 'Digitization pipeline for paper prescriptions, discharge slips, and external lab PDFs.',
    status: 'ACTIVE' as const,
    recordsCount: 2,
    lastSyncTime: 'User Ingestion Active',
    protocol: 'PDF/Image OCR Text Extraction + Field Parser',
    details: 'Preserves original document bytes. Extracts candidate fields as drafts awaiting clinician review.'
  },
  {
    id: 'chan-tier4-memory',
    name: 'Patient-Reported Longitudinal History',
    code: 'TIER-4-PATIENT-REPORTS',
    tier: 'Tier 4 (Self-Narrated Recollection)',
    sourceCategory: 'PATIENT_REPORTED' as const,
    description: 'Structured memory capture for remembered past illnesses, surgeries, and drug sensitivities.',
    status: 'ACTIVE' as const,
    recordsCount: 2,
    lastSyncTime: 'Patient Portal Input',
    protocol: 'Patient Form / Voice Dictation Intake',
    details: 'Labelled unverified by design. Provides vital context without masquerading as ground truth.'
  },
  {
    id: 'chan-abdm-gateway',
    name: 'Official ABDM / ABHA Gateway Adapter',
    code: 'TIER-1-ABDM-GW',
    tier: 'Tier 1 / ABDM Sandbox Interface',
    sourceCategory: 'EXTERNAL_EXCHANGE' as const,
    description: 'National Health Authority ABDM HIP/HIU federated exchange connector.',
    status: 'NOT_CONFIGURED_HONEST_FALLBACK' as const,
    recordsCount: 0,
    protocol: 'FHIR R4 / NHA Gateway REST v0.5',
    endpoint: 'https://dev.abdm.gov.in/gateway/v0.5',
    details: 'Honest Architecture State: Connector schema & FHIR profiles designed; live government sandbox credentials not configured for local hackathon demo.'
  }
];

export const INITIAL_AUDIT_LOGS: AuditEvent[] = [
  {
    id: 'audit-001',
    timestamp: '2026-10-13T08:30:12Z',
    actorId: 'staff-anand',
    actorName: 'Dr. Anand Sharma',
    actorRole: 'doctor',
    hospitalId: 'hosp-apollo',
    hospitalName: 'Apollo Multi-Specialty Hospital',
    action: 'LOGIN',
    outcome: 'SUCCESS_200',
    details: 'Staff authenticated via institutional credentials session (AMSH-BLR-01).',
    endpoint: '/api/auth/login',
    requestCorrelationId: 'req-init-apollo-auth-01'
  },
  {
    id: 'audit-002',
    timestamp: '2026-10-13T08:31:05Z',
    actorId: 'staff-anand',
    actorName: 'Dr. Anand Sharma',
    actorRole: 'doctor',
    hospitalId: 'hosp-apollo',
    hospitalName: 'Apollo Multi-Specialty Hospital',
    action: 'SEARCH_PATIENT',
    outcome: 'SUCCESS_200',
    details: 'Intra-hospital patient directory query executed for term "Rajesh". Returned 1 scoped record.',
    endpoint: '/api/staff/patients?hospitalId=hosp-apollo&query=Rajesh',
    requestCorrelationId: 'req-srch-002'
  },
  {
    id: 'audit-003',
    timestamp: '2026-10-13T08:31:40Z',
    actorId: 'staff-anand',
    actorName: 'Dr. Anand Sharma',
    actorRole: 'doctor',
    hospitalId: 'hosp-apollo',
    hospitalName: 'Apollo Multi-Specialty Hospital',
    action: 'READ_PATIENT_CHART',
    targetPatientId: 'pat-rajesh-kumar',
    targetPatientName: 'Rajesh Kumar',
    outcome: 'SUCCESS_200',
    details: 'Intra-hospital medical chart accessed. Requester hospitalId (hosp-apollo) matches registered facility.',
    endpoint: '/api/patients/pat-rajesh-kumar',
    requestCorrelationId: 'req-read-003'
  }
];
