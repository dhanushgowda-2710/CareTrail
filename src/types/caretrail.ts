export type StaffRole = 'doctor' | 'nurse' | 'admin' | 'lab_technician';

export type SourceCategory = 
  | 'INSTITUTIONAL'       // Tier 2 internal hospital EHR/HMIS
  | 'PATIENT_UPLOADED'    // Tier 4 patient paper scans/PDFs
  | 'PATIENT_REPORTED'    // Unverified patient recollections
  | 'EXTERNAL_EXCHANGE';  // Cross-hospital consent-based fetch

export type VerificationStatus = 
  | 'VERIFIED'           // Verified clinician or hospital EHR
  | 'AWAITING_REVIEW'    // AI extracted or patient entered
  | 'DISPUTED';          // Disputed/contested

export type RecordType = 
  | 'CONSULTATION' 
  | 'LAB_REPORT' 
  | 'PRESCRIPTION' 
  | 'VITALS' 
  | 'DISCHARGE_SUMMARY';

export interface Organization {
  id: string;
  name: string;
  code: string;
  type: string;
  city: string;
  state: string;
  branches: Branch[];
}

export interface Branch {
  id: string;
  organizationId: string;
  name: string;
  branchCode: string;
  address: string;
  phone: string;
}

export interface StaffProfile {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  designation: string;
  department: string;
  hospitalId: string;
  hospitalName: string;
  branchId: string;
  branchName: string;
  registrationNumber: string;
  avatarUrl?: string;
  password?: string;
}

export interface PatientProfile {
  id: string;
  mrn: string;
  abhaId: string;
  name: string;
  age: number;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  bloodGroup: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  hospitalId: string;
  hospitalName: string;
  registeredBranchId: string;
  registeredBranchName: string;
  registeredDate: string;
  address: string;
  allergies: string[];
  chronicConditions: string[];
  password?: string;
}

export interface PrescriptionItem {
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface LabResultItem {
  testName: string;
  value: string;
  unit: string;
  referenceRange: string;
  isAbnormal: boolean;
  flag?: 'HIGH' | 'LOW' | 'NORMAL' | 'CRITICAL';
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  hospitalId: string;
  hospitalName: string;
  branchId: string;
  branchName: string;
  authorStaffId: string;
  authorStaffName: string;
  authorRole: string;
  encounterDate: string;
  type: RecordType;
  title: string;
  sourceSystemName: string;
  sourceCategory: SourceCategory;
  verificationStatus: VerificationStatus;
  clinicalNotes: string;
  diagnosis?: string;
  vitals?: {
    bloodPressure?: string;
    pulseRate?: string;
    temperature?: string;
    spO2?: string;
    respiratoryRate?: string;
    weightKg?: string;
  };
  prescriptions?: PrescriptionItem[];
  labResults?: LabResultItem[];
  aiLabSummary?: string;
  pdfContentText?: string;
  pdfDataUrl?: string;
  originalDocumentId?: string;
  originalDocumentName?: string;
  originalDocumentUrl?: string;
  extractedSnippet?: string;
  isPatientReported?: boolean;
  patientReportedNotes?: string;
  disputeNotes?: string;
  // Prompt 10: Corrections, Disputes & Addenda
  isDisputed?: boolean;
  activeDispute?: RecordDispute;
  disputesHistory?: RecordDispute[];
  addenda?: RecordAddendum[];
  version?: number;
  originalSnapshot?: RecordSnapshot;
  createdAt: string;
}

export interface RecordSnapshot {
  title: string;
  clinicalNotes: string;
  diagnosis?: string;
  vitals?: MedicalRecord['vitals'];
  prescriptions?: MedicalRecord['prescriptions'];
  labResults?: MedicalRecord['labResults'];
  timestamp: string;
}

export type DisputeStatus = 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED_WITH_ADDENDUM' | 'REJECTED';

export interface RecordDispute {
  id: string;
  recordId: string;
  patientId: string;
  patientName: string;
  disputeType: 'FACTUAL_ERROR' | 'MISMATCHED_RECORD' | 'INCORRECT_ATTRIBUTION' | 'UNAUTHORIZED_ENTRY' | 'OTHER';
  reason: string;
  requestedCorrection?: string;
  status: DisputeStatus;
  createdAt: string;
  resolutionDecision?: {
    decidedByStaffId: string;
    decidedByStaffName: string;
    decidedAt: string;
    decisionNotes: string;
    actionTaken: 'ADDENDUM_ATTACHED' | 'DISPUTE_DISMISSED';
  };
}

export interface RecordAddendum {
  id: string;
  recordId: string;
  authorStaffId: string;
  authorStaffName: string;
  authorStaffRole: string;
  authorHospitalId: string;
  authorHospitalName: string;
  timestamp: string;
  reason: string;
  addendumNotes: string;
  correctedFields?: {
    fieldName: string;
    previousValue: string;
    newValue: string;
  }[];
  associatedDisputeId?: string;
  snapshotBeforeAddendum: RecordSnapshot;
}

export interface MultiSourceChannel {
  id: string;
  name: string;
  code: string;
  tier: string;
  sourceCategory: SourceCategory;
  description: string;
  status: 'ACTIVE' | 'CONNECTED' | 'NOT_CONFIGURED_HONEST_FALLBACK' | 'READY';
  recordsCount: number;
  lastSyncTime?: string;
  protocol: string;
  endpoint?: string;
  details: string;
}

export type AccessRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
export type AccessGrantStatus = 'ACTIVE' | 'REVOKED' | 'EXPIRED';

export interface AccessRequest {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  doctorDesignation: string;
  doctorHospitalId: string;
  doctorHospitalName: string;
  doctorDepartment: string;
  purpose: string;
  scope: string[];
  dateRange: string;
  status: AccessRequestStatus;
  createdAt: string;
  expiresAt: string;
  rejectionReason?: string;
}

export interface AccessGrant {
  id: string;
  requestId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  doctorDesignation: string;
  doctorHospitalId: string;
  doctorHospitalName: string;
  purpose: string;
  scope: string[];
  grantedAt: string;
  expiresAt: string;
  status: AccessGrantStatus;
  revokedAt?: string;
  revocationReason?: string;
}

export type AuditAction = 
  | 'LOGIN'
  | 'LOGOUT'
  | 'SEARCH_PATIENT'
  | 'READ_PATIENT_CHART'
  | 'CROSS_HOSPITAL_ATTEMPT_DENIED'
  | 'ADD_ENCOUNTER'
  | 'ACCESS_REQUEST'
  | 'ACCESS_REQUEST_APPROVED'
  | 'ACCESS_REQUEST_REJECTED'
  | 'ACCESS_GRANT_ACTIVE'
  | 'ACCESS_REVOKE'
  | 'DOCUMENT_UPLOAD'
  | 'AI_SUMMARY_GENERATED'
  | 'CDS_ALERT_TRIGGERED'
  | 'CDS_OVERRIDE_RECORDED'
  | 'CDS_SAFETY_SIMULATION'
  | 'PROBLEM_RECONCILED'
  | 'DIAGNOSTIC_CONFLICT_RESOLVED'
  | 'PROBLEM_STATUS_UPDATED'
  | 'MEDICATION_RECONCILED'
  | 'MEDICATION_REGIMEN_MODIFIED'
  | 'MEDICATION_DEPRESCRIBED'
  | 'ALLERGY_RECONCILED'
  | 'ALLERGY_VERIFIED'
  | 'ALLERGY_DELABELED'
  | 'CROSS_REACTIVITY_EVALUATED'
  | 'LAB_PANEL_EVALUATED'
  | 'CRITICAL_DELTA_FLAGGED'
  | 'LAB_INTERPRETATION_SIGNED'
  | 'LOINC_MAPPING_VERIFIED'
  | 'RECORD_DISPUTED'
  | 'RECORD_DISPUTE_DECIDED'
  | 'RECORD_AMENDED'
  | 'CORRECTION_ATTEMPT_DENIED'
  | 'DISPUTE_ATTEMPT_DENIED'
  | 'INTEGRATION_PROBE_TESTED'
  | 'EMERGENCY_SUMMARY_PREVIEWED'
  | 'EMERGENCY_SUMMARY_EXPORTED'
  | 'FHIR_MAPPING_INSPECTED'
  | 'ACCEPTANCE_SUITE_RUN'
  | 'SECURITY_PENETRATION_TESTED'
  | 'PRIVACY_SCAN_COMPLETED'
  | 'UPLOAD_SECURITY_TESTED'
  | 'VOICE_RECORDING_TRANSCRIBED'
  | 'VOICE_CLINICAL_NOTE_SAVED'
  | 'VOICE_INTAKE_CANCELLED'
  | 'VOICE_ENTITIES_APPROVED'
  | 'OFFLINE_MUTATION_QUEUED'
  | 'OFFLINE_SYNC_EXECUTED'
  | 'NETWORK_STATE_CHANGED'
  | 'GOVERNANCE_AUDIT_EXPORTED';

export type AuditOutcome = 'SUCCESS_200' | 'FORBIDDEN_403' | 'NOT_FOUND_404';

export interface AuditEvent {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  hospitalId: string;
  hospitalName: string;
  action: AuditAction;
  targetPatientId?: string;
  targetPatientName?: string;
  outcome: AuditOutcome;
  details: string;
  endpoint: string;
  requestCorrelationId: string;
}

export interface ApiResponse<T> {
  status: number;
  success: boolean;
  message?: string;
  data?: T;
  recordsUsed?: number;
  auditId?: string;
  boundaryRule?: string;
}

// ==========================================
// PROMPT 4: AI CLINICAL SYNTHESIS & SOURCE GROUNDING
// ==========================================

export type SynthesisFocus = 
  | 'COMPREHENSIVE' 
  | 'CHRONIC_CARE' 
  | 'MEDICATION_RECONCILIATION' 
  | 'RECENT_TRAJECTORY';

export interface ClinicalCitation {
  citationId: string;
  label: string; // e.g. "[Apollo-001]", "[Scan-USG]", "[Recall-01]"
  recordId: string;
  recordTitle: string;
  sourceCategory: SourceCategory;
  hospitalName: string;
  encounterDate: string;
  quoteSnippet?: string;
  verificationStatus: VerificationStatus;
}

export interface SynthesizedProblem {
  id: string;
  condition: string;
  status: 'ACTIVE' | 'RESOLVED' | 'UNDER_EVALUATION';
  severity: 'MILD' | 'MODERATE' | 'SEVERE';
  firstDocumentedDate: string;
  lastUpdatedDate: string;
  citations: ClinicalCitation[];
  clinicalNotes: string;
  isUnverified: boolean;
}

export interface ReconciledMedication {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  prescribingHospital: string;
  prescribingDoctor: string;
  status: 'ACTIVE' | 'DISCONTINUED' | 'PATIENT_REPORTED_OTC';
  sourceCategory: SourceCategory;
  verificationStatus: VerificationStatus;
  lastPrescribedDate: string;
  citations: ClinicalCitation[];
  discrepancyNote?: string;
}

export interface ClinicalRedFlag {
  id: string;
  title: string;
  severity: 'ALERT' | 'WARNING' | 'INFO';
  description: string;
  suggestedAction: string;
  citations: ClinicalCitation[];
}

export interface ClinicalSynthesisResult {
  id: string;
  patientId: string;
  patientName: string;
  generatedAt: string;
  modelUsed: string;
  focus: SynthesisFocus;
  includeUnverified: boolean;
  executiveSummary: string;
  timelineNarrative: string[];
  problems: SynthesizedProblem[];
  medications: ReconciledMedication[];
  redFlags: ClinicalRedFlag[];
  recordsSynthesizedCount: number;
  citations: ClinicalCitation[];
  provenanceBreakdown: {
    institutionalCount: number;
    patientUploadedCount: number;
    patientReportedCount: number;
    externalExchangeCount: number;
  };
}

// ==========================================
// PROMPT 5: CLINICAL DECISION SUPPORT (CDS) &
// DRUG SAFETY INTERACTION GUARDIAN
// ==========================================

export type CdsAlertSeverity = 
  | 'CRITICAL_CONTRAINDICATION' 
  | 'HIGH_RISK_INTERACTION' 
  | 'THERAPEUTIC_DUPLICATION' 
  | 'ORGAN_IMPAIRMENT_ALERT'
  | 'MODERATE_WARNING';

export type CdsCategory = 
  | 'ALLERGY_CROSS_REACTIVITY' 
  | 'DRUG_DRUG_INTERACTION' 
  | 'DUPLICATE_THERAPY' 
  | 'ORGAN_IMPAIRMENT' 
  | 'MONITORING_GAP';

export interface CdsAlert {
  id: string;
  category: CdsCategory;
  severity: CdsAlertSeverity;
  title: string;
  clinicalMechanism: string;
  offendingAgent: string;
  conflictingFactor: string;
  evidenceCitation: ClinicalCitation;
  suggestedAlternative: string;
  canOverride: boolean;
  isOverridden?: boolean;
  overrideReason?: string;
  overrideStaffName?: string;
  overrideTimestamp?: string;
  timestamp: string;
}

export interface CdsSimulationInput {
  medicineName: string;
  dosage: string;
  frequency: string;
  indication?: string;
}

export interface CdsSimulationResult {
  proposedMedication: string;
  dosage: string;
  safetyScore: 'SAFE' | 'CAUTION' | 'CONTRAINDICATED';
  summary: string;
  alerts: CdsAlert[];
  recommendedAlternatives: {
    medicineName: string;
    dosage: string;
    rationale: string;
  }[];
  timestamp: string;
}

export interface LabTrajectoryPoint {
  date: string;
  value: number;
  displayValue: string;
  unit: string;
  referenceRange: string;
  isAbnormal: boolean;
  facilityName: string;
  sourceCategory: SourceCategory;
  recordId: string;
  citationLabel: string;
}

export interface LabTrajectorySeries {
  testName: string;
  category: 'GLYCEMIC' | 'RENAL' | 'LIPID' | 'CARDIOVASCULAR' | 'HEPATIC';
  unit: string;
  optimalRange: string;
  points: LabTrajectoryPoint[];
  trendDirection: 'IMPROVING' | 'WORSENING' | 'STABLE';
  clinicalInterpretation: string;
}

export interface PatientCdsAssessment {
  patientId: string;
  patientName: string;
  evaluatedAt: string;
  activeAlerts: CdsAlert[];
  trajectories: LabTrajectorySeries[];
  metrics: {
    criticalCount: number;
    highRiskCount: number;
    duplicationCount: number;
    organImpairmentCount: number;
    totalAlerts: number;
  };
}

// ==========================================
// PROMPT 6: ACTIVE PROBLEM LIST & MULTI-FACILITY
// DIAGNOSTIC RECONCILIATION (ICD-10 / SNOMED CT)
// ==========================================

export type ProblemClinicalStatus = 
  | 'ACTIVE' 
  | 'CHRONIC_MAINTENANCE' 
  | 'UNDER_EVALUATION' 
  | 'RESOLVED' 
  | 'INACTIVE'
  | 'RULE_OUT';

export type ProblemSeverityGrade = 'MILD' | 'MODERATE' | 'SEVERE' | 'CRITICAL';

export interface Icd10CodeInfo {
  code: string;
  display: string;
  chapter: string;
  block: string;
}

export interface SnomedCodeInfo {
  conceptId: string;
  term: string;
  hierarchy: string;
}

export interface ConflictingEvidence {
  sourceFacility: string;
  documentedTerm: string;
  date: string;
  recordId: string;
  citationLabel: string;
  clinicianName: string;
  sourceCategory: SourceCategory;
  clinicalExcerpt: string;
}

export interface DiagnosticConflict {
  id: string;
  discrepancyType: 
    | 'NOMENCLATURE_VARIANCE'      // e.g. Essential HTN vs Renovascular HTN under workup
    | 'SEVERITY_DISCORDANCE'       // e.g. Pre-diabetes vs Established T2DM
    | 'STATUS_DISAGREEMENT'        // e.g. Active vs Resolved
    | 'ORGAN_STAGING_DISPARITY';   // e.g. Grade 1 Steatosis vs Non-Alcoholic Steatohepatitis
  title: string;
  description: string;
  conflictingItems: ConflictingEvidence[];
  recommendedResolution: string;
  status: 'UNRESOLVED' | 'RESOLVED';
  resolvedByStaffName?: string;
  resolutionTimestamp?: string;
  chosenTerm?: string;
  clinicalJustification?: string;
}

export interface ReconciledProblemItem {
  id: string;
  canonicalCondition: string;
  status: ProblemClinicalStatus;
  severity: ProblemSeverityGrade;
  icd10: Icd10CodeInfo;
  snomed: SnomedCodeInfo;
  firstDocumentedDate: string;
  lastAssessedDate: string;
  originatingHospital: string;
  originatingDoctor: string;
  citations: ClinicalCitation[];
  supportingRecordsCount: number;
  clinicalNotes: string;
  treatmentGoals: string[];
  hasConflict: boolean;
  conflictDetails?: DiagnosticConflict;
  isPatientReportedOnly: boolean;
  isUnverified: boolean;
  resolutionHistory?: {
    resolvedAt: string;
    resolvedByStaffName: string;
    chosenDiagnosis: string;
    justification: string;
  };
}

export interface ProblemConflictResolutionInput {
  conflictId: string;
  problemId: string;
  chosenTerm: string;
  targetStatus: ProblemClinicalStatus;
  justification: string;
  staffName: string;
}

export interface ProblemReconciliationAssessment {
  patientId: string;
  patientName: string;
  reconciledAt: string;
  totalProblemsCount: number;
  activeProblemsCount: number;
  chronicCount: number;
  underEvaluationCount: number;
  resolvedCount: number;
  unresolvedConflictsCount: number;
  problems: ReconciledProblemItem[];
  conflicts: DiagnosticConflict[];
  icd10CodingRate: string; // e.g. "100%"
  snomedCodingRate: string; // e.g. "100%"
}

// PROMPT 7: Medication Reconciliation (MedRec) & Polypharmacy Regimen Manager
export type MedicationDiscrepancyType = 
  | 'THERAPEUTIC_DUPLICATION'
  | 'DOSAGE_DISCORDANCE'
  | 'CROSS_FACILITY_OMISSION'
  | 'UNRECORDED_DISCONTINUATION'
  | 'ADHERENCE_GAP';

export type MedicationAction = 
  | 'CONTINUE'
  | 'MODIFY_DOSE'
  | 'DISCONTINUE_DEPRESCRIBE'
  | 'SUBSTITUTE';

export type MedicationStatus = 
  | 'ACTIVE'
  | 'MODIFIED'
  | 'DISCONTINUED'
  | 'PENDING_REVIEW';

export interface MedicationTiming {
  morning: boolean;
  afternoon: boolean;
  evening: boolean;
  bedtime: boolean;
  withFood: boolean;
  instructions: string;
}

export interface ReconciledMedicationItem {
  id: string;
  name: string;
  genericName: string;
  rxNormCode: string;
  atcCode: string;
  therapeuticClass: string;
  dosage: string;
  frequency: string;
  route: string;
  indication: string;
  timing: MedicationTiming;
  status: MedicationStatus;
  sourceFacility: string;
  prescribedBy: string;
  prescribedDate: string;
  sourceCategory: SourceCategory;
  citationLabel: string;
  recordId: string;
  discrepancyNote?: string;
  reconciliationAction?: MedicationAction;
  clinicianRationale?: string;
  reconciledBy?: string;
  reconciledAt?: string;
}

export interface MedicationDiscrepancyInvolved {
  facility: string;
  prescribedDrug: string;
  dosage: string;
  frequency: string;
  prescribedDate: string;
  recordId: string;
  citationLabel: string;
  doctorName: string;
  sourceCategory: SourceCategory;
}

export interface MedicationDiscrepancyAlert {
  id: string;
  type: MedicationDiscrepancyType;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  description: string;
  clinicalRisk: string;
  recommendedAction: string;
  involvedMedications: MedicationDiscrepancyInvolved[];
  status: 'UNRESOLVED' | 'RESOLVED';
  resolvedAction?: MedicationAction;
  resolvedDrugName?: string;
  resolvedDosage?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  justification?: string;
}

export interface MedicationReconciliationAssessment {
  patientId: string;
  patientName: string;
  reconciledAt: string;
  activeRegimen: ReconciledMedicationItem[];
  discrepancies: MedicationDiscrepancyAlert[];
  rxNormCodingRate: string;
  atcCodingRate: string;
  metrics: {
    totalEvaluated: number;
    activeCount: number;
    discrepancyCount: number;
    unresolvedDiscrepancyCount: number;
    deprescribedCount: number;
    modifiedCount: number;
  };
}

export interface MedicationReconciliationResolutionInput {
  discrepancyId: string;
  action: MedicationAction;
  targetDrugName: string;
  targetDosage: string;
  targetFrequency: string;
  justification: string;
  staffName: string;
}

// ==========================================
// PROMPT 8: Multi-Facility Allergy & ADR Registry (MedDRA / SNOMED CT / UNII)
// ==========================================

export type AllergySeverity = 'CRITICAL_ANAPHYLAXIS' | 'HIGH' | 'MODERATE' | 'MILD_INTOLERANCE';
export type AllergyCategory = 'MEDICATION' | 'FOOD' | 'ENVIRONMENTAL' | 'BIOLOGICAL_CONTRAST';
export type AllergyReactionType = 
  | 'IGE_MEDIATED_TYPE_1' 
  | 'CYTOTOXIC_TYPE_2' 
  | 'IMMUNE_COMPLEX_TYPE_3' 
  | 'CELL_MEDIATED_TYPE_4' 
  | 'NON_ALLERGIC_INTOLERANCE' 
  | 'UNKNOWN';

export type AllergyVerificationStatus = 
  | 'CONFIRMED_VERIFIED' 
  | 'PATIENT_REPORTED_UNCONFIRMED' 
  | 'REFUTED_DELABELED' 
  | 'SUSPECTED';

export type AllergyClinicalStatus = 'ACTIVE' | 'INACTIVE' | 'RESOLVED' | 'REFUTED';

export type AllergyReconciliationAction = 
  | 'CONFIRM_INSTITUTIONAL' 
  | 'DOWNGRADE_TO_INTOLERANCE' 
  | 'DELABEL_AFTER_CHALLENGE' 
  | 'UPDATE_CROSS_REACTIVITY' 
  | 'MERGE_DUPLICATES';

export interface AllergyCrossReactivityEntry {
  drugClass: string;
  crossReactivityRate: string;
  riskLevel: 'HIGH' | 'MODERATE' | 'LOW' | 'NEGLIGIBLE';
  clinicalGuidance: string;
  safeAlternatives: string[];
}

export interface AllergyItem {
  id: string;
  substance: string;
  genericName: string;
  category: AllergyCategory;
  reactionType: AllergyReactionType;
  snomedCode: string;
  medDraCode: string;
  uniiCode: string;
  manifestations: string[];
  severity: AllergySeverity;
  verificationStatus: AllergyVerificationStatus;
  clinicalStatus: AllergyClinicalStatus;
  onsetDate?: string;
  lastReactionDate?: string;
  sourceFacility: string;
  sourceCategory: SourceCategory;
  citationLabel: string;
  recordId: string;
  documentedBy: string;
  crossReactivityRisk: AllergyCrossReactivityEntry[];
  verificationNotes?: string;
  delabelReason?: string;
  reconciledBy?: string;
  reconciledAt?: string;
}

export interface AllergyDiscrepancySource {
  facility: string;
  status: string;
  reactionDescription: string;
  citationLabel: string;
  recordId: string;
  date: string;
  sourceCategory: SourceCategory;
}

export interface AllergyDiscrepancy {
  id: string;
  title: string;
  type: 'DISCORDANT_SEVERITY' | 'ALLERGY_VS_INTOLERANCE' | 'UNCONFIRMED_PATIENT_RECALL' | 'CROSS_FACILITY_MISSING';
  substance: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE';
  description: string;
  clinicalImplication: string;
  involvedSources: AllergyDiscrepancySource[];
  recommendedResolution: string;
  status: 'UNRESOLVED' | 'RESOLVED';
  resolvedAction?: AllergyReconciliationAction;
  resolvedBy?: string;
  resolvedAt?: string;
  rationale?: string;
}

export interface AllergyAssessment {
  patientId: string;
  patientName: string;
  reconciledAt: string;
  allergies: AllergyItem[];
  discrepancies: AllergyDiscrepancy[];
  snomedCodingRate: string;
  medDraCodingRate: string;
  uniiCodingRate: string;
  metrics: {
    totalCount: number;
    confirmedCount: number;
    unconfirmedCount: number;
    criticalCount: number;
    delabeledCount: number;
    unresolvedDiscrepancies: number;
  };
}

export interface AllergyResolutionInput {
  discrepancyId: string;
  action: AllergyReconciliationAction;
  targetSubstance: string;
  newStatus: AllergyVerificationStatus;
  newReactionType: AllergyReactionType;
  rationale: string;
  staffName: string;
}

// ==========================================
// PROMPT 9: Longitudinal Laboratory & Diagnostic Investigations Hub
// (LOINC Ontology, Multi-Facility Panel Harmonization, Delta-Checks)
// ==========================================

export type LabCategory = 
  | 'GLYCEMIC' 
  | 'RENAL_ELECTROLYTES' 
  | 'LIPID' 
  | 'HEPATIC_LFT' 
  | 'HEMATOLOGY'
  | 'CARDIAC_BIOMARKER';

export type LabAbnormalFlag = 
  | 'NORMAL' 
  | 'HIGH' 
  | 'LOW' 
  | 'CRITICAL_HIGH' 
  | 'CRITICAL_LOW';

export interface LoincCodeInfo {
  code: string;
  name: string;
  component: string;
  system: string;
  scaleType: string;
}

export interface LabHistoricalReading {
  date: string;
  value: number;
  displayValue: string;
  unit: string;
  referenceRange: string;
  flag: LabAbnormalFlag;
  facility: string;
  sourceCategory: SourceCategory;
  recordId: string;
  citationLabel: string;
  methodology?: string;
}

export interface LabDeltaAlert {
  id: string;
  testName: string;
  loincCode: string;
  category: LabCategory;
  severity: 'CRITICAL' | 'WARNING' | 'INFORMATIONAL';
  title: string;
  description: string;
  previousReading: LabHistoricalReading;
  currentReading: LabHistoricalReading;
  percentageChange: number;
  clinicalSignificance: string;
  recommendedAction: string;
  status: 'UNACKNOWLEDGED' | 'ACKNOWLEDGED';
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  clinicalNote?: string;
}

export interface StandardizedLabItem {
  id: string;
  testName: string;
  canonicalName: string;
  loinc: LoincCodeInfo;
  category: LabCategory;
  latestValue: number;
  displayValue: string;
  unit: string;
  referenceRange: string;
  flag: LabAbnormalFlag;
  latestDate: string;
  latestFacility: string;
  sourceCategory: SourceCategory;
  recordId: string;
  citationLabel: string;
  methodology: string;
  specimenType: string;
  deltaAlert?: LabDeltaAlert;
  historicalReadings: LabHistoricalReading[];
  trendDirection: 'UP' | 'DOWN' | 'STABLE';
  clinicalNote?: string;
  interpretationSignOff?: {
    signedBy: string;
    signedAt: string;
    clinicalAssessment: string;
  };
}

export interface LabInvestigationAssessment {
  patientId: string;
  patientName: string;
  evaluatedAt: string;
  loincCodingRate: string; // e.g. "100%"
  panels: StandardizedLabItem[];
  deltaAlerts: LabDeltaAlert[];
  metrics: {
    totalTestsCount: number;
    abnormalCount: number;
    criticalCount: number;
    unacknowledgedDeltasCount: number;
    categoriesEvaluatedCount: number;
  };
}

export interface LabInterpretationInput {
  labItemId: string;
  clinicalAssessment: string;
  staffName: string;
}

export interface LabDeltaAcknowledgeInput {
  deltaId: string;
  clinicalNote: string;
  staffName: string;
}

// ==========================================
// PROMPT 11: Honest External Integration Status,
// FHIR R4 Synthetic Adapter & Emergency Summary Export
// ==========================================

export type ConnectorStatus = 
  | 'NOT_CONFIGURED' 
  | 'REQUIRES_AUTHORIZATION' 
  | 'CONNECTED' 
  | 'TEMPORARILY_UNAVAILABLE' 
  | 'ERROR';

export type ConnectorCategory =
  | 'ABDM_GATEWAY'
  | 'E_HOSPITAL_NIC'
  | 'EXTERNAL_HOSPITAL_EMR'
  | 'PMJAY_BENEFICIARY_SCHEME'
  | 'INTERNAL_EHR'
  | 'OBJECT_STORAGE';

export interface ConnectorProbeResult {
  connectorId: string;
  testedAt: string;
  status: ConnectorStatus;
  httpStatus?: number;
  latencyMs: number;
  message: string;
  endpointUrl: string;
  missingEnvVars?: string[];
  securityNote: string;
}

export interface ExternalConnector {
  id: string;
  name: string;
  shortCode: string;
  tier: string;
  category: ConnectorCategory;
  description: string;
  status: ConnectorStatus;
  endpoint: string;
  protocol: string;
  authMechanism: string;
  requiredEnvVars: string[];
  configuredEnvVars: string[];
  missingEnvVars: string[];
  lastTestedAt?: string;
  lastProbeResult?: ConnectorProbeResult;
  nextApprovalRequired: string;
  securityNotice: string;
  policyBoundaryDisclaimer: string;
  isMockOnly: boolean;
}

export interface FhirR4SampleBundle {
  resourceType: 'Bundle';
  id: string;
  type: 'collection';
  timestamp: string;
  meta: {
    lastUpdated: string;
    profile: string[];
    tag: {
      system: string;
      code: string;
      display: string;
    }[];
  };
  syntheticNotice: string;
  mappingNotes: string[];
  total: number;
  entry: {
    fullUrl: string;
    resource: any;
  }[];
}

export interface EmergencySummaryItem {
  id: string;
  category: 'ALLERGY' | 'CONDITION' | 'MEDICATION' | 'EMERGENCY_CONTACT' | 'BLOOD_GROUP';
  title: string;
  details: string;
  criticality: 'CRITICAL' | 'IMPORTANT' | 'ROUTINE';
  sourceFacility: string;
  sourceDate: string;
  provenance: SourceCategory;
  isIncluded: boolean;
}

export interface EmergencySummaryExportPayload {
  exportId: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  bloodGroup: string;
  generatedAt: string;
  generatedByStaffName: string;
  generatedByRole: string;
  selectedItems: EmergencySummaryItem[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  disclaimer: string;
  nonRevocableNotice: string;
  completenessNotice: string;
}

// ==========================================
// PROMPT 12: Security, Accessibility & E2E Acceptance Pass
// ==========================================

export type AcceptanceCategory = 
  | 'SECURITY_AUTHORIZATION' 
  | 'PRIVACY_AUDIT' 
  | 'INGESTION_VALIDATION' 
  | 'CLINICAL_INTEGRITY' 
  | 'INTEGRATION_BOUNDARY'
  | 'ACCESSIBILITY_WCAG';

export interface AcceptanceCheckItem {
  id: string;
  checkNumber: number;
  name: string;
  category: AcceptanceCategory;
  requirement: string;
  expectedBehavior: string;
  observedResult: string;
  httpStatus: number;
  status: 'PASS' | 'FAIL' | 'NOT_CONFIGURED';
  evidenceSnapshot: string;
  executionMs: number;
  testedAt: string;
}

export interface AcceptanceTestRunResult {
  id: string;
  title: string;
  category: AcceptanceCategory;
  status: 'PASS' | 'FAIL' | 'NOT_CONFIGURED';
  command: string;
  evidence: string;
  details: string;
  timestamp: string;
}

export interface AcceptanceSuiteReport {
  suiteId: string;
  executedAt: string;
  totalChecks: number;
  passedCount: number;
  failedCount: number;
  notConfiguredCount: number;
  overallStatus: 'PASS' | 'FAIL';
  executionDurationMs: number;
  checks: AcceptanceCheckItem[];
  auditedBy: string;
}

export interface SecurityPrivacyAuditResult {
  scanId: string;
  totalEventsScanned: number;
  scannedAt: string;
  leakedSecretsFound: number;
  unmaskedTokensFound: number;
  rawPayloadByteDumpsFound: number;
  auditIntegrityValid: boolean;
  sanitizationScore: number;
  findings: {
    eventId: string;
    field: string;
    status: 'CLEAN' | 'FLAGGED';
    check: string;
    sampleValue: string;
  }[];
}

export interface UploadSecurityTestResult {
  testId: string;
  attemptedFile: string;
  attemptedMimeType: string;
  attemptedSizeMb: number;
  allowedWhitelist: string[];
  maxAllowedSizeMb: number;
  isRejected: boolean;
  httpStatus: number;
  rejectionReason: string;
  timestamp: string;
}

export interface RoleEscalationTestResult {
  testId: string;
  authenticatedStaff: string;
  authenticatedRole: string;
  attemptedPayloadRole: string;
  attemptedAction: string;
  isBlockedByServer: boolean;
  httpStatus: number;
  serverBoundaryRule: string;
  timestamp: string;
}

export interface CrossAccessTestResult {
  testId: string;
  requestingPatientId: string;
  requestingPatientName: string;
  targetPatientId: string;
  targetPatientName: string;
  isCrossAccessDenied: boolean;
  httpStatus: number;
  boundaryRule: string;
  timestamp: string;
}

// ==========================================
// PROMPT 13: MULTILINGUAL CLINICAL VOICE INTAKE
// ==========================================

export type VoiceIntakeLanguage = 'kn-IN' | 'hi-IN' | 'en-IN';

export interface ExtractedVoiceEntities {
  chiefComplaints: string[];
  symptoms: string[];
  approximateTimeline: string;
  uncertaintiesOrGaps: string[];
  mentionedMedications: {
    medicineName: string;
    dosage?: string;
    frequency?: string;
    adherenceStatus?: 'REGULAR' | 'STOPPED_DISCONTINUED' | 'IRREGULAR';
    context?: string;
  }[];
  vitalsOrObservations?: {
    parameter: string;
    value: string;
    unit?: string;
    flag?: 'NORMAL' | 'ELEVATED' | 'CRITICAL';
  }[];
  clinicalRisksIdentified?: string[];
}

export interface VoiceIntakeScenario {
  id: string;
  title: string;
  language: VoiceIntakeLanguage;
  languageLabel: string;
  languageNativeName: string;
  speakerRole: 'PATIENT' | 'CAREGIVER' | 'CLINICIAN';
  speakerName: string;
  audioDurationSeconds: number;
  clarityConfidenceScore: number;
  originalTranscript: string;
  translatedEnglishDraft: string;
  extractedEntities: ExtractedVoiceEntities;
  provenance: {
    sourceCategory: SourceCategory;
    verificationStatus: VerificationStatus;
    uncertaintyNote: string;
  };
}

export interface VoiceRecordingSession {
  id: string;
  patientId: string;
  recordedAt: string;
  language: VoiceIntakeLanguage;
  speakerRole: 'PATIENT' | 'CAREGIVER' | 'CLINICIAN';
  speakerName: string;
  audioDurationSeconds: number;
  clarityConfidenceScore: number;
  rawTranscript: string;
  standardizedEnglishDraft: string;
  extractedEntities: ExtractedVoiceEntities;
  clinicianReviewed: boolean;
  reviewedByStaffId?: string;
  savedRecordId?: string;
}

// ==========================================
// PROMPT 14: OFFLINE SURVIVABILITY & PRODUCTION READINESS
// ==========================================

export type NetworkConnectivityStatus = 'ONLINE' | 'OFFLINE_SIMULATED' | 'OFFLINE_DISCONNECTED';

export type OfflineMutationType = 
  | 'ADD_OPD_NOTE' 
  | 'ADD_VOICE_MEMO' 
  | 'PATIENT_DISPUTE' 
  | 'CLINICIAN_ADDENDUM'
  | 'CDS_OVERRIDE_DECISION';

export interface OfflineQueuedMutation {
  id: string;
  clientSequenceId: number;
  timestamp: string;
  mutationType: OfflineMutationType;
  patientId: string;
  patientName: string;
  actorStaffId: string;
  actorStaffName: string;
  actorRole: string;
  hospitalId: string;
  payload: any;
  status: 'QUEUED_LOCAL' | 'SYNCED' | 'CONFLICT_RESOLVED' | 'FAILED';
  retryCount: number;
  syncedAt?: string;
  conflictResolutionNote?: string;
}

export interface OfflineSyncReport {
  reportId: string;
  executedAt: string;
  totalProcessed: number;
  successfullySynced: number;
  conflictsResolved: number;
  failedCount: number;
  syncedMutations: OfflineQueuedMutation[];
  auditCorrelationId: string;
}

export interface SystemReadinessAuditReport {
  reportId: string;
  generatedAt: string;
  appTitle: string;
  totalPrompts: number;
  completedPrompts: number;
  overallScorePercent: number;
  stageEvaluations: {
    promptIndex: number;
    title: string;
    category: string;
    status: 'PASS' | 'NOT_CONFIGURED';
    summary: string;
    verificationDetail: string;
  }[];
  truthfulUnconfiguredChecklist: {
    integrationName: string;
    missingRequirement: string;
    truthfulBehavior: string;
  }[];
}

