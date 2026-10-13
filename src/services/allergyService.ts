import {
  PatientProfile,
  MedicalRecord,
  AllergyItem,
  AllergyDiscrepancy,
  AllergyAssessment,
  AllergyResolutionInput,
  AllergyReconciliationAction,
  AllergyVerificationStatus,
  AllergyReactionType,
  AllergyCrossReactivityEntry
} from '../types/caretrail';

class AllergyService {
  private initialAllergiesMap: Map<string, AllergyItem[]> = new Map();
  private initialDiscrepanciesMap: Map<string, AllergyDiscrepancy[]> = new Map();

  constructor() {
    this.seedRajeshKumarAllergies();
    this.seedMeeraSundaramAllergies();
  }

  private seedRajeshKumarAllergies(): void {
    const rajeshAllergies: AllergyItem[] = [
      {
        id: 'allg-rajesh-penicillin-01',
        substance: 'Penicillin / Beta-Lactam Antibiotics',
        genericName: 'Penicillin G / Amoxicillin',
        category: 'MEDICATION',
        reactionType: 'IGE_MEDIATED_TYPE_1',
        snomedCode: '91936005', // Allergy to penicillin
        medDraCode: '10034277', // Penicillin allergy
        uniiCode: 'Q42T66VG0C', // Penicillin G
        manifestations: [
          'Acute Facial Angioedema & Lip Swelling',
          'Widespread Urticaria & Pruritic Hives',
          'Mild Wheezing & Dyspnea'
        ],
        severity: 'CRITICAL_ANAPHYLAXIS',
        verificationStatus: 'CONFIRMED_VERIFIED',
        clinicalStatus: 'ACTIVE',
        onsetDate: '2016-09-02',
        lastReactionDate: '2016-09-02',
        sourceFacility: 'Apollo Multi-Specialty Hospital',
        sourceCategory: 'INSTITUTIONAL',
        citationLabel: '[Amsh-Labs]',
        recordId: 'rec-apollo-004',
        documentedBy: 'Nurse Rekha Gowda / Dr. Anand Sharma',
        crossReactivityRisk: [
          {
            drugClass: 'Aminopenicillins (Amoxicillin, Ampicillin)',
            crossReactivityRate: '100% Contraindicated',
            riskLevel: 'HIGH',
            clinicalGuidance: 'Strict absolute contraindication. Direct structural ring homology.',
            safeAlternatives: ['Azithromycin 500mg', 'Clarithromycin 500mg', 'Doxycycline 100mg']
          },
          {
            drugClass: '1st & 2nd Gen Cephalosporins (Cephalexin, Cefaclor, Cefuroxime)',
            crossReactivityRate: '5 - 10% Cross-Reactivity',
            riskLevel: 'MODERATE',
            clinicalGuidance: 'Avoid due to similar R1 side chain homology and shared beta-lactam core.',
            safeAlternatives: ['Levofloxacin 500mg', 'Ciprofloxacin 500mg']
          },
          {
            drugClass: '3rd & 4th Gen Cephalosporins (Ceftriaxone, Cefepime)',
            crossReactivityRate: '< 2% Cross-Reactivity',
            riskLevel: 'LOW',
            clinicalGuidance: 'Use only with specialist allergist supervision or negative skin prick testing.',
            safeAlternatives: ['Vancomycin (for Gram+ MRSA)', 'Aztreonam (Gram- aerobic)']
          },
          {
            drugClass: 'Carbapenems (Meropenem, Imipenem)',
            crossReactivityRate: '< 1% Cross-Reactivity',
            riskLevel: 'LOW',
            clinicalGuidance: 'Permissible in critical sepsis if non-beta-lactam alternatives exhausted.',
            safeAlternatives: ['Amikacin', 'Tigecycline', 'Colistin']
          },
          {
            drugClass: 'Monobactams (Aztreonam)',
            crossReactivityRate: 'Negligible (< 0.1%)',
            riskLevel: 'NEGLIGIBLE',
            clinicalGuidance: 'Immunologically safe (distinct beta-lactam monocyclic ring, no R1 side-chain sharing).',
            safeAlternatives: ['Aztreonam 1g - 2g IV']
          }
        ],
        verificationNotes: 'Corroborated by Apollo EHR triage red flag and patient narrative rec-patient-002 requiring urgent parenteral antihistamines.'
      },
      {
        id: 'allg-rajesh-nsaid-02',
        substance: 'Non-Steroidal Anti-Inflammatory Drugs (Ibuprofen / Diclofenac)',
        genericName: 'Ibuprofen / NSAID Class',
        category: 'MEDICATION',
        reactionType: 'NON_ALLERGIC_INTOLERANCE',
        snomedCode: '300916003', // Adverse reaction to NSAID
        medDraCode: '10000049', // Drug intolerance / abdominal discomfort
        uniiCode: 'WK2XYI10QM', // Ibuprofen
        manifestations: [
          'Severe Epigastric Dyspepsia & Burning',
          'Mild Postprandial Nausea',
          'No Cutaneous Wheals or Bronchospasm'
        ],
        severity: 'MILD_INTOLERANCE',
        verificationStatus: 'CONFIRMED_VERIFIED',
        clinicalStatus: 'ACTIVE',
        onsetDate: '2021-03-15',
        lastReactionDate: '2023-11-10',
        sourceFacility: 'Apollo Outpatient Medicine',
        sourceCategory: 'INSTITUTIONAL',
        citationLabel: '[Amsh-001]',
        recordId: 'rec-apollo-001',
        documentedBy: 'Dr. Vikram Anand, MD',
        crossReactivityRisk: [
          {
            drugClass: 'COX-2 Selective Inhibitors (Celecoxib, Etoricoxib)',
            crossReactivityRate: 'Low GI mucosal injury',
            riskLevel: 'LOW',
            clinicalGuidance: 'Spares COX-1 gastric cytoprotection; prescribe with PPI if analgesia required.',
            safeAlternatives: ['Paracetamol 650mg up to TID', 'Topical Diclofenac Gel']
          },
          {
            drugClass: 'Pure Analgesic / Antipyretic (Paracetamol / Acetaminophen)',
            crossReactivityRate: 'Zero Cross-Reactivity',
            riskLevel: 'NEGLIGIBLE',
            clinicalGuidance: 'Safe standard analgesic of choice for mild-to-moderate pain.',
            safeAlternatives: ['Paracetamol 500mg - 1000mg']
          }
        ],
        verificationNotes: 'Confirmed non-allergic peptic intolerance due to COX-1 inhibition; patient tolerates Paracetamol without difficulty.'
      },
      {
        id: 'allg-rajesh-iodine-03',
        substance: 'Iodinated Radiocontrast Media',
        genericName: 'Non-Ionic Low-Osmolar Radiocontrast (Iohexol)',
        category: 'BIOLOGICAL_CONTRAST',
        reactionType: 'UNKNOWN',
        snomedCode: '294859005', // Adverse reaction to radiopaque dye
        medDraCode: '10065798', // Contrast media reaction
        uniiCode: '4419T9MX03', // Iohexol
        manifestations: ['Transient flushing during angiography', 'No delayed exanthem'],
        severity: 'MILD_INTOLERANCE',
        verificationStatus: 'REFUTED_DELABELED',
        clinicalStatus: 'REFUTED',
        onsetDate: '2024-03-10',
        sourceFacility: 'Manipal Hospital Cardiology',
        sourceCategory: 'EXTERNAL_EXCHANGE',
        citationLabel: '[Scan-Manipal]',
        recordId: 'rec-city-001',
        documentedBy: 'Dr. Ramesh Rao, Interventional Cardiologist',
        crossReactivityRisk: [],
        delabelReason: 'Underwent contrast CT angiography at Manipal without premedication. Previous "seafood/iodine" allergy label refuted as unscientific myth.',
        verificationNotes: 'Formally de-labeled in Manipal cath record; documented safe tolerance.'
      }
    ];

    const rajeshDiscrepancies: AllergyDiscrepancy[] = [
      {
        id: 'disc-allg-penicillin-01',
        title: 'Penicillin / Beta-Lactam Red-Flag Conflict & Cross-Reactivity Gap',
        type: 'DISCORDANT_SEVERITY',
        substance: 'Penicillin / Beta-Lactam Antibiotics',
        severity: 'CRITICAL',
        description: 'Apollo Hospital EHR documents a "Severe Red-Flag Penicillin Allergy" (rec-apollo-004) while patient recall (rec-patient-002) details acute angioedema and lip swelling after Amoxicillin. However, external clinics lack documentation of cross-reactivity risks for Cephalosporins and Carbapenems.',
        clinicalImplication: 'Accidental prescribing of 1st generation cephalosporins (Cephalexin) carries a 5-10% risk of life-threatening anaphylaxis due to side-chain homology.',
        involvedSources: [
          {
            facility: 'Apollo Multi-Specialty Hospital',
            status: 'Documented EHR Red-Flag Allergy (Severe)',
            reactionDescription: 'Known allergy to Penicillin documented in baseline intake red-flag alert.',
            citationLabel: '[Amsh-Labs]',
            recordId: 'rec-apollo-004',
            date: '2024-01-12',
            sourceCategory: 'INSTITUTIONAL'
          },
          {
            facility: 'Tier 4 Patient Memory Recall',
            status: 'Patient Narrative (Severe Cutaneous & Lip Edema)',
            reactionDescription: 'Itchy hives, facial swelling, and lip puffiness 24h post Amoxicillin 500mg requiring urgent parenteral antihistamines.',
            citationLabel: '[Pt-Self]',
            recordId: 'rec-patient-002',
            date: '2016-09-02',
            sourceCategory: 'PATIENT_REPORTED'
          }
        ],
        recommendedResolution: 'Confirm as Type 1 IgE-Mediated Beta-Lactam Hypersensitivity (SNOMED CT: 91936005, MedDRA: 10034277). Enforce strict avoidance of all Aminopenicillins and 1st/2nd Gen Cephalosporins. Map Macrolides / Doxycycline as safe alternatives.',
        status: 'UNRESOLVED'
      },
      {
        id: 'disc-allg-nsaid-02',
        title: 'NSAID Allergy vs Non-Allergic Gastrointestinal Intolerance Discordance',
        type: 'ALLERGY_VS_INTOLERANCE',
        substance: 'Ibuprofen / NSAIDs',
        severity: 'HIGH',
        description: 'One outpatient documentation notes "NSAID Allergy", but detailed symptom review reveals only epigastric dyspepsia and mild heartburn without urticaria, bronchospasm, or angioedema.',
        clinicalImplication: 'Inaccurate "allergy" labeling erroneously excludes safe analgesic options, forcing escalation to opioids or suboptimal analgesia.',
        involvedSources: [
          {
            facility: 'Apollo Outpatient Medicine',
            status: 'Documented Non-Allergic Dyspepsia',
            reactionDescription: 'Severe heartburn and gastritis after Ibuprofen 400mg; no wheezing, rash, or lip swelling.',
            citationLabel: '[Amsh-001]',
            recordId: 'rec-apollo-001',
            date: '2024-06-12',
            sourceCategory: 'INSTITUTIONAL'
          },
          {
            facility: 'City Health Diagnostic Center',
            status: 'Labeled "Allergy: Ibuprofen"',
            reactionDescription: 'Historical record labeled as drug allergy without mechanistic differentiation.',
            citationLabel: '[City-Metformin]',
            recordId: 'rec-city-002',
            date: '2024-07-22',
            sourceCategory: 'PATIENT_UPLOADED'
          }
        ],
        recommendedResolution: 'Downgrade from IgE-mediated allergy to Non-Allergic GI Intolerance (SNOMED CT: 300916003). Authorize Paracetamol and selective COX-2 inhibitors with gastroprotection.',
        status: 'UNRESOLVED'
      }
    ];

    this.initialAllergiesMap.set('pat-rajesh-kumar', rajeshAllergies);
    this.initialDiscrepanciesMap.set('pat-rajesh-kumar', rajeshDiscrepancies);
  }

  private seedMeeraSundaramAllergies(): void {
    const meeraAllergies: AllergyItem[] = [
      {
        id: 'allg-meera-dust-01',
        substance: 'House Dust Mite & Pollen Allergens',
        genericName: 'Dermatophagoides pteronyssinus',
        category: 'ENVIRONMENTAL',
        reactionType: 'IGE_MEDIATED_TYPE_1',
        snomedCode: '232350006', // House dust mite allergy
        medDraCode: '10020478', // House dust allergy
        uniiCode: '42K5P2L9W8',
        manifestations: ['Bronchial Wheezing & Dyspnea', 'Paroxysmal Dry Cough', 'Allergic Rhinitis'],
        severity: 'HIGH',
        verificationStatus: 'CONFIRMED_VERIFIED',
        clinicalStatus: 'ACTIVE',
        onsetDate: '2019-07-10',
        lastReactionDate: '2024-08-04',
        sourceFacility: 'Apollo Multi-Specialty Hospital',
        sourceCategory: 'INSTITUTIONAL',
        citationLabel: '[Amsh-005]',
        recordId: 'rec-apollo-005',
        documentedBy: 'Dr. Anand Sharma',
        crossReactivityRisk: [
          {
            drugClass: 'Storage Mites & Cockroach Antigens',
            crossReactivityRate: 'High Environmental Homology',
            riskLevel: 'HIGH',
            clinicalGuidance: 'Minimize indoor carpet exposure, maintain HEPA filtration.',
            safeAlternatives: ['Inhaled Budesonide/Formoterol', 'Levocetirizine 5mg nocte']
          }
        ],
        verificationNotes: 'Correlated with acute asthma exacerbation during Bangalore monsoon rains.'
      }
    ];

    this.initialAllergiesMap.set('pat-meera-sundaram', meeraAllergies);
    this.initialDiscrepanciesMap.set('pat-meera-sundaram', []);
  }

  public reconcilePatientAllergies(
    patient: PatientProfile,
    records: MedicalRecord[],
    overrides?: Map<string, any>
  ): AllergyAssessment {
    let allergies = this.initialAllergiesMap.get(patient.id) 
      ? [...(this.initialAllergiesMap.get(patient.id) || [])]
      : [];

    let discrepancies = this.initialDiscrepanciesMap.get(patient.id)
      ? [...(this.initialDiscrepanciesMap.get(patient.id) || [])]
      : [];

    // Apply any clinician overrides/reconciliations
    if (overrides) {
      overrides.forEach((override, key) => {
        // Discrepancy override
        const targetDisc = discrepancies.find(d => d.id === key);
        if (targetDisc) {
          targetDisc.status = 'RESOLVED';
          targetDisc.resolvedAction = override.action;
          targetDisc.resolvedBy = override.staffName;
          targetDisc.resolvedAt = override.resolvedAt || new Date().toISOString();
          targetDisc.rationale = override.rationale;

          // If resolving penicillin, ensure status is confirmed verified
          if (targetDisc.substance.includes('Penicillin')) {
            const penItem = allergies.find(a => a.id === 'allg-rajesh-penicillin-01');
            if (penItem) {
              penItem.verificationStatus = override.newStatus || 'CONFIRMED_VERIFIED';
              penItem.reactionType = override.newReactionType || 'IGE_MEDIATED_TYPE_1';
              penItem.reconciledBy = override.staffName;
              penItem.reconciledAt = override.resolvedAt || new Date().toISOString();
            }
          }

          // If resolving NSAID, adjust reactionType to intolerance
          if (targetDisc.substance.includes('Ibuprofen') || targetDisc.substance.includes('NSAID')) {
            const nsaidItem = allergies.find(a => a.id === 'allg-rajesh-nsaid-02');
            if (nsaidItem) {
              nsaidItem.reactionType = 'NON_ALLERGIC_INTOLERANCE';
              nsaidItem.severity = 'MILD_INTOLERANCE';
              nsaidItem.verificationStatus = 'CONFIRMED_VERIFIED';
              nsaidItem.reconciledBy = override.staffName;
              nsaidItem.reconciledAt = override.resolvedAt || new Date().toISOString();
            }
          }
        }

        // Direct allergy item override
        const targetAllergy = allergies.find(a => a.id === key);
        if (targetAllergy) {
          if (override.action === 'DELABEL_AFTER_CHALLENGE') {
            targetAllergy.verificationStatus = 'REFUTED_DELABELED';
            targetAllergy.clinicalStatus = 'REFUTED';
            targetAllergy.delabelReason = override.rationale;
          } else if (override.action === 'DOWNGRADE_TO_INTOLERANCE') {
            targetAllergy.reactionType = 'NON_ALLERGIC_INTOLERANCE';
            targetAllergy.severity = 'MILD_INTOLERANCE';
          } else if (override.action === 'CONFIRM_INSTITUTIONAL') {
            targetAllergy.verificationStatus = 'CONFIRMED_VERIFIED';
          }
          targetAllergy.reconciledBy = override.staffName;
          targetAllergy.reconciledAt = override.resolvedAt || new Date().toISOString();
        }
      });
    }

    const confirmedCount = allergies.filter(a => a.verificationStatus === 'CONFIRMED_VERIFIED').length;
    const unconfirmedCount = allergies.filter(a => a.verificationStatus === 'PATIENT_REPORTED_UNCONFIRMED' || a.verificationStatus === 'SUSPECTED').length;
    const criticalCount = allergies.filter(a => a.severity === 'CRITICAL_ANAPHYLAXIS').length;
    const delabeledCount = allergies.filter(a => a.verificationStatus === 'REFUTED_DELABELED').length;
    const unresolvedDiscrepancies = discrepancies.filter(d => d.status === 'UNRESOLVED').length;

    const snomedCoded = allergies.filter(a => a.snomedCode && a.snomedCode !== 'PENDING').length;
    const medDraCoded = allergies.filter(a => a.medDraCode && a.medDraCode !== 'PENDING').length;
    const uniiCoded = allergies.filter(a => a.uniiCode && a.uniiCode !== 'PENDING').length;

    const total = allergies.length || 1;
    const snomedCodingRate = `${Math.round((snomedCoded / total) * 100)}%`;
    const medDraCodingRate = `${Math.round((medDraCoded / total) * 100)}%`;
    const uniiCodingRate = `${Math.round((uniiCoded / total) * 100)}%`;

    return {
      patientId: patient.id,
      patientName: patient.name,
      reconciledAt: new Date().toISOString(),
      allergies,
      discrepancies,
      snomedCodingRate,
      medDraCodingRate,
      uniiCodingRate,
      metrics: {
        totalCount: allergies.length,
        confirmedCount,
        unconfirmedCount,
        criticalCount,
        delabeledCount,
        unresolvedDiscrepancies
      }
    };
  }

  public resolveDiscrepancy(input: AllergyResolutionInput): boolean {
    const list = this.initialDiscrepanciesMap.get('pat-rajesh-kumar') || [];
    const disc = list.find(d => d.id === input.discrepancyId);
    if (disc) {
      disc.status = 'RESOLVED';
      disc.resolvedAction = input.action;
      disc.resolvedBy = input.staffName;
      disc.resolvedAt = new Date().toISOString();
      disc.rationale = input.rationale;
      return true;
    }
    return false;
  }

  public setAllergyAction(
    allergyId: string,
    action: AllergyReconciliationAction,
    rationale: string,
    staffName: string
  ): boolean {
    const list = this.initialAllergiesMap.get('pat-rajesh-kumar') || [];
    const item = list.find(a => a.id === allergyId);
    if (item) {
      if (action === 'DELABEL_AFTER_CHALLENGE') {
        item.verificationStatus = 'REFUTED_DELABELED';
        item.clinicalStatus = 'REFUTED';
        item.delabelReason = rationale;
      } else if (action === 'CONFIRM_INSTITUTIONAL') {
        item.verificationStatus = 'CONFIRMED_VERIFIED';
      } else if (action === 'DOWNGRADE_TO_INTOLERANCE') {
        item.reactionType = 'NON_ALLERGIC_INTOLERANCE';
        item.severity = 'MILD_INTOLERANCE';
      }
      item.reconciledBy = staffName;
      item.reconciledAt = new Date().toISOString();
      return true;
    }
    return false;
  }
}

export const allergyService = new AllergyService();
