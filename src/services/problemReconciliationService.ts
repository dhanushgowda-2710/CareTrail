import { 
  PatientProfile, 
  MedicalRecord, 
  ClinicalCitation,
  ProblemReconciliationAssessment,
  ReconciledProblemItem,
  DiagnosticConflict,
  ProblemConflictResolutionInput,
  ProblemClinicalStatus
} from '../types/caretrail';

class ProblemReconciliationService {
  // Store resolved conflicts in-memory
  private resolutions: Map<string, {
    chosenTerm: string;
    targetStatus: ProblemClinicalStatus;
    justification: string;
    staffName: string;
    resolvedAt: string;
  }> = new Map();

  /**
   * Reconcile problems across all institutional records, scans, and recollections
   */
  public reconcilePatientProblems(
    patient: PatientProfile,
    records: MedicalRecord[],
    overrides?: Map<string, {
      chosenTerm: string;
      targetStatus: ProblemClinicalStatus;
      justification: string;
      staffName: string;
      resolvedAt: string;
    }>
  ): ProblemReconciliationAssessment {
    const activeResolutions = overrides || this.resolutions;

    // Build citations dictionary from records
    const citationsMap = new Map<string, ClinicalCitation>();
    records.forEach(rec => {
      let label = `[Rec-${rec.id.slice(-4)}]`;
      if (rec.id === 'rec-apollo-001') label = '[Amsh-001]';
      else if (rec.id === 'rec-apollo-002') label = '[Amsh-Triage]';
      else if (rec.id === 'rec-apollo-003') label = '[Amsh-Labs]';
      else if (rec.id === 'rec-apollo-004') label = '[Amsh-ECG]';
      else if (rec.id === 'rec-manipal-001') label = '[Scan-Manipal]';
      else if (rec.id === 'rec-manipal-002') label = '[Scan-USG]';
      else if (rec.id === 'rec-city-001') label = '[City-Renal]';
      else if (rec.id === 'rec-city-002') label = '[City-Metformin]';
      else if (rec.id === 'rec-recall-001') label = '[Recall-Penicillin]';
      else if (rec.id === 'rec-recall-002') label = '[Recall-OTC]';

      citationsMap.set(rec.id, {
        citationId: `cite-${rec.id}`,
        label,
        recordId: rec.id,
        recordTitle: rec.title,
        sourceCategory: rec.sourceCategory,
        hospitalName: rec.hospitalName,
        encounterDate: rec.encounterDate,
        quoteSnippet: rec.clinicalNotes?.slice(0, 140),
        verificationStatus: rec.verificationStatus
      });
    });

    // Conflict 1: Hypertension Nomenclature & Etiology Discrepancy
    const htnConflictId = 'conflict-htn-001';
    const htnResolution = activeResolutions.get(htnConflictId);
    const isHtnResolved = !!htnResolution;

    const conflictHtn: DiagnosticConflict = {
      id: htnConflictId,
      discrepancyType: 'NOMENCLATURE_VARIANCE',
      title: 'Essential HTN vs Secondary HTN / Renovascular Etiology',
      description: 'Apollo Hospitals documentation records Primary Essential Hypertension, while Manipal Hospital discharge summary flags resistant blood pressure requiring workup for Renovascular Hypertension (RVD).',
      conflictingItems: [
        {
          sourceFacility: 'Apollo Hospitals (Indiranagar)',
          documentedTerm: 'Essential (Primary) Hypertension',
          date: '2024-06-12',
          recordId: 'rec-apollo-001',
          citationLabel: '[Amsh-001]',
          clinicianName: 'Dr. Vikram Anand, MD',
          sourceCategory: 'INSTITUTIONAL',
          clinicalExcerpt: 'Established Primary Essential Hypertension, well-controlled on Telmisartan 40mg daily. No bruit or secondary stigmata.'
        },
        {
          sourceFacility: 'Manipal Hospital (Old Airport Road)',
          documentedTerm: 'Secondary Hypertension (Rule Out Renovascular Stenosis)',
          date: '2024-03-18',
          recordId: 'rec-manipal-001',
          citationLabel: '[Scan-Manipal]',
          clinicianName: 'Dr. Shalini Rao, DM (Nephrology)',
          sourceCategory: 'PATIENT_UPLOADED',
          clinicalExcerpt: 'Severe episodic spikes to 160/98 mmHg. Recommend renal Doppler ultrasound to rule out renal artery stenosis.'
        }
      ],
      recommendedResolution: 'Reconcile as Essential (Primary) Hypertension with secondary workup noted as ruled-out following stable renal Doppler and controlled ambulatory BP.',
      status: isHtnResolved ? 'RESOLVED' : 'UNRESOLVED',
      resolvedByStaffName: htnResolution?.staffName,
      resolutionTimestamp: htnResolution?.resolvedAt,
      chosenTerm: htnResolution?.chosenTerm,
      clinicalJustification: htnResolution?.justification
    };

    // Conflict 2: Diabetes Severity & Diagnostic Discordance
    const dmConflictId = 'conflict-dm-002';
    const dmResolution = activeResolutions.get(dmConflictId);
    const isDmResolved = !!dmResolution;

    const conflictDm: DiagnosticConflict = {
      id: dmConflictId,
      discrepancyType: 'SEVERITY_DISCORDANCE',
      title: 'Impaired Fasting Glucose vs Established Type 2 Diabetes Mellitus',
      description: 'Apollo outpatient consultation records Impaired Fasting Glucose (Pre-diabetes), whereas City Health Diagnostic Lab confirms HbA1c 7.8% with active Metformin therapy.',
      conflictingItems: [
        {
          sourceFacility: 'Apollo Hospitals (Indiranagar)',
          documentedTerm: 'Impaired Fasting Glucose / Pre-Diabetes',
          date: '2024-06-12',
          recordId: 'rec-apollo-003',
          citationLabel: '[Amsh-Labs]',
          clinicianName: 'Dr. Vikram Anand, MD',
          sourceCategory: 'INSTITUTIONAL',
          clinicalExcerpt: 'Fasting Blood Sugar 112 mg/dL. Counsel patient on lifestyle and dietary caloric restriction.'
        },
        {
          sourceFacility: 'City Health Diagnostic Center',
          documentedTerm: 'Type 2 Diabetes Mellitus (Uncontrolled)',
          date: '2024-07-22',
          recordId: 'rec-city-002',
          citationLabel: '[City-Metformin]',
          clinicianName: 'Dr. K. Narayanan, Consultant Pathologist',
          sourceCategory: 'PATIENT_UPLOADED',
          clinicalExcerpt: 'Glycated Hemoglobin (HbA1c) 7.8% (Ref < 5.7%). Patient initiating Metformin 1000mg twice daily.'
        }
      ],
      recommendedResolution: 'Reconcile canonical status to established Type 2 Diabetes Mellitus (ICD-10: E11.9) based on documented HbA1c >= 6.5% and chronic biguanide therapy.',
      status: isDmResolved ? 'RESOLVED' : 'UNRESOLVED',
      resolvedByStaffName: dmResolution?.staffName,
      resolutionTimestamp: dmResolution?.resolvedAt,
      chosenTerm: dmResolution?.chosenTerm,
      clinicalJustification: dmResolution?.justification
    };

    // Synthesized Canonical Problem 1: Hypertension
    const prob1Citations = [
      citationsMap.get('rec-apollo-001'),
      citationsMap.get('rec-apollo-002'),
      citationsMap.get('rec-manipal-001')
    ].filter(Boolean) as ClinicalCitation[];

    const problem1: ReconciledProblemItem = {
      id: 'prob-htn-01',
      canonicalCondition: htnResolution ? htnResolution.chosenTerm : 'Essential (Primary) Hypertension',
      status: htnResolution ? htnResolution.targetStatus : 'CHRONIC_MAINTENANCE',
      severity: 'MODERATE',
      icd10: {
        code: 'I10',
        display: 'Essential (primary) hypertension',
        chapter: 'IX. Diseases of the circulatory system',
        block: 'I10-I15 Hypertensive diseases'
      },
      snomed: {
        conceptId: '38341003',
        term: 'Hypertensive disorder, systemic arterial',
        hierarchy: 'Clinical finding / Cardiovascular'
      },
      firstDocumentedDate: '2023-11-10',
      lastAssessedDate: '2024-10-14',
      originatingHospital: 'Apollo Hospitals (Indiranagar)',
      originatingDoctor: 'Dr. Vikram Anand, MD',
      citations: prob1Citations,
      supportingRecordsCount: prob1Citations.length,
      clinicalNotes: isHtnResolved 
        ? `Reconciled by ${htnResolution?.staffName}: ${htnResolution?.justification}`
        : 'Blood pressure controlled on Telmisartan 40mg daily (latest reading 134/82 mmHg). Manipal discharge notes secondary workup was considered but outpatient trajectory remains responsive to monotherapy.',
      treatmentGoals: [
        'Maintain systolic BP < 130 mmHg and diastolic BP < 80 mmHg',
        'Annual urine albumin-to-creatinine ratio (uACR) screening',
        'Continue Telmisartan 40mg with potassium/renal function surveillance'
      ],
      hasConflict: true,
      conflictDetails: conflictHtn,
      isPatientReportedOnly: false,
      isUnverified: false,
      resolutionHistory: isHtnResolved ? {
        resolvedAt: htnResolution.resolvedAt,
        resolvedByStaffName: htnResolution.staffName,
        chosenDiagnosis: htnResolution.chosenTerm,
        justification: htnResolution.justification
      } : undefined
    };

    // Synthesized Canonical Problem 2: Type 2 Diabetes Mellitus
    const prob2Citations = [
      citationsMap.get('rec-city-002'),
      citationsMap.get('rec-apollo-003'),
      citationsMap.get('rec-apollo-001')
    ].filter(Boolean) as ClinicalCitation[];

    const problem2: ReconciledProblemItem = {
      id: 'prob-dm-02',
      canonicalCondition: dmResolution ? dmResolution.chosenTerm : 'Type 2 Diabetes Mellitus without complications',
      status: dmResolution ? dmResolution.targetStatus : 'ACTIVE',
      severity: 'MODERATE',
      icd10: {
        code: 'E11.9',
        display: 'Type 2 diabetes mellitus without complications',
        chapter: 'IV. Endocrine, nutritional and metabolic diseases',
        block: 'E08-E13 Diabetes mellitus'
      },
      snomed: {
        conceptId: '44054006',
        term: 'Diabetes mellitus type 2',
        hierarchy: 'Disorder of endocrine system'
      },
      firstDocumentedDate: '2024-06-12',
      lastAssessedDate: '2024-10-14',
      originatingHospital: 'City Health Diagnostic Center',
      originatingDoctor: 'Dr. K. Narayanan, Consultant Pathologist',
      citations: prob2Citations,
      supportingRecordsCount: prob2Citations.length,
      clinicalNotes: isDmResolved
        ? `Reconciled by ${dmResolution?.staffName}: ${dmResolution?.justification}`
        : 'Confirmed by elevated HbA1c (7.8%) and active Metformin prescription. Fasting glucose trending between 136-142 mg/dL.',
      treatmentGoals: [
        'Target Glycated Hemoglobin (HbA1c) < 7.0%',
        'Annual diabetic dilated eye examination (fundoscopy)',
        'Comprehensive bilateral foot sensory examination'
      ],
      hasConflict: true,
      conflictDetails: conflictDm,
      isPatientReportedOnly: false,
      isUnverified: false,
      resolutionHistory: isDmResolved ? {
        resolvedAt: dmResolution.resolvedAt,
        resolvedByStaffName: dmResolution.staffName,
        chosenDiagnosis: dmResolution.chosenTerm,
        justification: dmResolution.justification
      } : undefined
    };

    // Canonical Problem 3: Non-Alcoholic Fatty Liver Disease (Hepatic Steatosis)
    const prob3Citations = [
      citationsMap.get('rec-manipal-002')
    ].filter(Boolean) as ClinicalCitation[];

    const problem3: ReconciledProblemItem = {
      id: 'prob-nafld-03',
      canonicalCondition: 'Non-Alcoholic Fatty Liver Disease (Grade 1 Hepatic Steatosis)',
      status: 'CHRONIC_MAINTENANCE',
      severity: 'MILD',
      icd10: {
        code: 'K76.0',
        display: 'Fatty (change of) liver, not elsewhere classified',
        chapter: 'XI. Diseases of the digestive system',
        block: 'K70-K77 Diseases of liver'
      },
      snomed: {
        conceptId: '235856003',
        term: 'Non-alcoholic fatty liver',
        hierarchy: 'Disorder of liver'
      },
      firstDocumentedDate: '2024-03-20',
      lastAssessedDate: '2024-08-04',
      originatingHospital: 'Manipal Hospital (Old Airport Road)',
      originatingDoctor: 'Dr. Shalini Rao, Radiologist',
      citations: prob3Citations,
      supportingRecordsCount: prob3Citations.length,
      clinicalNotes: 'Whole abdomen ultrasound confirms mild increased hepatic parenchymal echogenicity with sound attenuation (Grade 1 fatty infiltration). Liver span 15.2 cm. No focal lesions.',
      treatmentGoals: [
        '5-7% weight reduction via aerobic exercise and Mediterranean diet',
        'Periodic LFT panel (ALT/AST) and FIB-4 non-invasive fibrosis index monitoring',
        'Avoid hepatotoxic OTC preparations'
      ],
      hasConflict: false,
      isPatientReportedOnly: false,
      isUnverified: false
    };

    // Canonical Problem 4: Chronic Kidney Disease, Stage 2
    const prob4Citations = [
      citationsMap.get('rec-city-001')
    ].filter(Boolean) as ClinicalCitation[];

    const problem4: ReconciledProblemItem = {
      id: 'prob-ckd-04',
      canonicalCondition: 'Chronic Kidney Disease, Stage 2 (Mild GFR Reduction)',
      status: 'UNDER_EVALUATION',
      severity: 'MODERATE',
      icd10: {
        code: 'N18.2',
        display: 'Chronic kidney disease, stage 2 (mild)',
        chapter: 'XIV. Diseases of the genitourinary system',
        block: 'N17-N19 Acute kidney injury and chronic kidney disease'
      },
      snomed: {
        conceptId: '431856006',
        term: 'Chronic kidney disease stage 2',
        hierarchy: 'Disorder of kidney'
      },
      firstDocumentedDate: '2024-08-04',
      lastAssessedDate: '2024-08-04',
      originatingHospital: 'City Health Diagnostic Center',
      originatingDoctor: 'City Health Automated Biochemistry Analyzer',
      citations: prob4Citations,
      supportingRecordsCount: prob4Citations.length,
      clinicalNotes: 'eGFR calculated at 58 mL/min/1.73m² (CKD-EPI 2021) with Serum Creatinine 1.28 mg/dL. Requires confirmation repeat at 3 months to distinguish transient decline from persistent CKD.',
      treatmentGoals: [
        'Repeat Serum Creatinine & eGFR within 90 days for CKD chronicity verification',
        'Strict avoidance of nephrotoxic medications (NSAIDs, COX-2 inhibitors)',
        'Optimize blood pressure target (< 130/80 mmHg) for renal protection'
      ],
      hasConflict: false,
      isPatientReportedOnly: false,
      isUnverified: false
    };

    // Canonical Problem 5: Childhood Bronchial Wheeze / Asthma (Patient Reported Recall)
    const problem5: ReconciledProblemItem = {
      id: 'prob-wheeze-05',
      canonicalCondition: 'Childhood Bronchial Hyperreactivity / Wheezing Episode',
      status: 'RESOLVED',
      severity: 'MILD',
      icd10: {
        code: 'J45.909',
        display: 'Unspecified asthma, uncomplicated',
        chapter: 'X. Diseases of the respiratory system',
        block: 'J40-J47 Chronic lower respiratory diseases'
      },
      snomed: {
        conceptId: '195967001',
        term: 'Asthma',
        hierarchy: 'Disorder of respiratory system'
      },
      firstDocumentedDate: '1998-05-10',
      lastAssessedDate: '2024-10-12',
      originatingHospital: 'Patient Self-Recall Narrative',
      originatingDoctor: 'Patient Memory Recollection',
      citations: [],
      supportingRecordsCount: 1,
      clinicalNotes: 'Patient recalled history of episodic seasonal wheezing at age 10-12 treated with herbal inhalations. No acute episodes in 25+ years. No daily inhaler therapy required.',
      treatmentGoals: [
        'No active maintenance therapy required',
        'Avoid beta-blockers without prior spirometry if bronchospasm recurs'
      ],
      hasConflict: false,
      isPatientReportedOnly: true,
      isUnverified: true
    };

    const problemsList = [problem1, problem2, problem3, problem4, problem5];
    const conflictsList = [conflictHtn, conflictDm];

    const activeCount = problemsList.filter(p => p.status === 'ACTIVE').length;
    const chronicCount = problemsList.filter(p => p.status === 'CHRONIC_MAINTENANCE').length;
    const underEvalCount = problemsList.filter(p => p.status === 'UNDER_EVALUATION').length;
    const resolvedCount = problemsList.filter(p => p.status === 'RESOLVED' || p.status === 'INACTIVE').length;
    const unresolvedConflicts = conflictsList.filter(c => c.status === 'UNRESOLVED').length;

    return {
      patientId: patient.id,
      patientName: patient.name,
      reconciledAt: new Date().toISOString(),
      totalProblemsCount: problemsList.length,
      activeProblemsCount: activeCount,
      chronicCount,
      underEvaluationCount: underEvalCount,
      resolvedCount,
      unresolvedConflictsCount: unresolvedConflicts,
      problems: problemsList,
      conflicts: conflictsList,
      icd10CodingRate: '100%',
      snomedCodingRate: '100%'
    };
  }

  /**
   * Save a clinician resolution for a diagnostic conflict
   */
  public resolveConflict(input: ProblemConflictResolutionInput) {
    this.resolutions.set(input.conflictId, {
      chosenTerm: input.chosenTerm,
      targetStatus: input.targetStatus,
      justification: input.justification,
      staffName: input.staffName,
      resolvedAt: new Date().toISOString()
    });
  }

  /**
   * Clear all manual resolutions
   */
  public clearResolutions() {
    this.resolutions.clear();
  }

  public getResolutionsMap() {
    return this.resolutions;
  }
}

export const problemReconciliationService = new ProblemReconciliationService();
