import { 
  PatientProfile, 
  MedicalRecord, 
  ReconciledMedicationItem,
  MedicationDiscrepancyAlert,
  MedicationReconciliationAssessment,
  MedicationReconciliationResolutionInput,
  MedicationAction
} from '../types/caretrail';

class MedicationReconciliationService {
  private userActionOverrides: Map<string, {
    action: MedicationAction;
    targetDrugName?: string;
    targetDosage?: string;
    targetFrequency?: string;
    justification: string;
    staffName: string;
    resolvedAt: string;
  }> = new Map();

  /**
   * Reconcile medications across all institutional EHR, ABDM exchanges, OCR scans, and patient recollections.
   */
  public reconcilePatientMedications(
    patient: PatientProfile,
    records: MedicalRecord[],
    overrides?: Map<string, {
      action: MedicationAction;
      targetDrugName?: string;
      targetDosage?: string;
      targetFrequency?: string;
      justification: string;
      staffName: string;
      resolvedAt: string;
    }>
  ): MedicationReconciliationAssessment {
    const activeOverrides = overrides || this.userActionOverrides;

    // Build canonical reconciled medications for Rajesh Kumar
    const baseMedications: ReconciledMedicationItem[] = [
      {
        id: 'med-telmisartan-01',
        name: 'Telmisartan Tablets IP',
        genericName: 'Telmisartan',
        rxNormCode: '316379',
        atcCode: 'C09CA07',
        therapeuticClass: 'Angiotensin II Receptor Antagonist (ARB)',
        dosage: '40 mg',
        frequency: 'Once daily (morning)',
        route: 'Oral',
        indication: 'Essential (Primary) Hypertension',
        timing: {
          morning: true,
          afternoon: false,
          evening: false,
          bedtime: false,
          withFood: false,
          instructions: 'Take 30 mins before breakfast with a full glass of water. Monitor home BP.'
        },
        status: 'ACTIVE',
        sourceFacility: 'Apollo Hospitals (Indiranagar)',
        prescribedBy: 'Dr. Vikram Anand, MD',
        prescribedDate: '2024-06-12',
        sourceCategory: 'INSTITUTIONAL',
        citationLabel: '[Amsh-001]',
        recordId: 'rec-apollo-001'
      },
      {
        id: 'med-metformin-02',
        name: 'Metformin Hydrochloride Prolonged-Release',
        genericName: 'Metformin Hydrochloride (ER)',
        rxNormCode: '860975',
        atcCode: 'A10BA02',
        therapeuticClass: 'Biguanide Antidiabetic Agent',
        dosage: '500 mg',
        frequency: 'Once daily (with dinner)',
        route: 'Oral',
        indication: 'Type 2 Diabetes Mellitus',
        timing: {
          morning: false,
          afternoon: false,
          evening: true,
          bedtime: false,
          withFood: true,
          instructions: 'Swallow whole with evening meal. Do not crush or chew prolonged release tablets.'
        },
        status: 'ACTIVE',
        sourceFacility: 'Apollo Hospitals (Indiranagar)',
        prescribedBy: 'Dr. Vikram Anand, MD',
        prescribedDate: '2024-06-12',
        sourceCategory: 'INSTITUTIONAL',
        citationLabel: '[Amsh-001]',
        recordId: 'rec-apollo-001',
        discrepancyNote: 'Dosage discordance detected: City Health Diagnostic report documents Metformin 1000mg twice daily based on HbA1c 7.8%.'
      },
      {
        id: 'med-atorvastatin-03',
        name: 'Atorvastatin Tablets IP',
        genericName: 'Atorvastatin Calcium',
        rxNormCode: '259255',
        atcCode: 'C10AA05',
        therapeuticClass: 'HMG-CoA Reductase Inhibitor (Statin)',
        dosage: '10 mg',
        frequency: 'Once daily at bedtime',
        route: 'Oral',
        indication: 'Mixed Dyslipidemia & Atherosclerotic Prophylaxis',
        timing: {
          morning: false,
          afternoon: false,
          evening: false,
          bedtime: true,
          withFood: false,
          instructions: 'Take at bedtime. Report any unexplained muscle soreness or tenderness immediately.'
        },
        status: 'ACTIVE',
        sourceFacility: 'Apollo Hospitals (Indiranagar)',
        prescribedBy: 'Dr. Vikram Anand, MD',
        prescribedDate: '2024-06-12',
        sourceCategory: 'INSTITUTIONAL',
        citationLabel: '[Amsh-001]',
        recordId: 'rec-apollo-001',
        discrepancyNote: 'Therapeutic duplication with Rosuvastatin 10mg prescribed at Manipal Hospital.'
      },
      {
        id: 'med-rosuvastatin-04',
        name: 'Rosuvastatin Tablets IP',
        genericName: 'Rosuvastatin Calcium',
        rxNormCode: '308047',
        atcCode: 'C10AA07',
        therapeuticClass: 'HMG-CoA Reductase Inhibitor (High-Potency Statin)',
        dosage: '10 mg',
        frequency: 'Once daily at bedtime',
        route: 'Oral',
        indication: 'Hypercholesterolemia & Cardiovascular Risk Reduction',
        timing: {
          morning: false,
          afternoon: false,
          evening: false,
          bedtime: true,
          withFood: false,
          instructions: 'Take at bedtime. High potency statin.'
        },
        status: 'PENDING_REVIEW',
        sourceFacility: 'Manipal Hospital (Old Airport Road)',
        prescribedBy: 'Dr. Shalini Rao, DM',
        prescribedDate: '2024-03-18',
        sourceCategory: 'PATIENT_UPLOADED',
        citationLabel: '[Scan-Manipal]',
        recordId: 'rec-manipal-001',
        discrepancyNote: 'Concurrent with Apollo Atorvastatin 10mg. Clinical conflict requiring deprescribing sign-off.'
      },
      {
        id: 'med-aspirin-05',
        name: 'Enteric-Coated Aspirin (Ecosprin)',
        genericName: 'Aspirin (Acetylsalicylic Acid)',
        rxNormCode: '1191',
        atcCode: 'B01AC06',
        therapeuticClass: 'Platelet Aggregation Inhibitor',
        dosage: '75 mg',
        frequency: 'Once daily after breakfast',
        route: 'Oral',
        indication: 'Primary Cardiovascular Thromboprophylaxis',
        timing: {
          morning: true,
          afternoon: false,
          evening: false,
          bedtime: false,
          withFood: true,
          instructions: 'Take immediately after food to prevent gastric mucosal irritation.'
        },
        status: 'ACTIVE',
        sourceFacility: 'City Health Diagnostic Center',
        prescribedBy: 'Dr. K. Narayanan, MBBS',
        prescribedDate: '2024-07-22',
        sourceCategory: 'PATIENT_UPLOADED',
        citationLabel: '[City-Renal]',
        recordId: 'rec-city-001'
      },
      {
        id: 'med-pantoprazole-06',
        name: 'Pantoprazole Gastro-Resistant Tablets',
        genericName: 'Pantoprazole Sodium',
        rxNormCode: '284635',
        atcCode: 'A02BC02',
        therapeuticClass: 'Proton Pump Inhibitor (PPI)',
        dosage: '40 mg',
        frequency: 'Once daily before breakfast (PRN / 14 days)',
        route: 'Oral',
        indication: 'Gastroesophageal Reflux & Gastric Protection',
        timing: {
          morning: true,
          afternoon: false,
          evening: false,
          bedtime: false,
          withFood: false,
          instructions: 'Take 45-60 minutes before morning breakfast. Intended for short-term course.'
        },
        status: 'ACTIVE',
        sourceFacility: 'Apollo Hospitals (Indiranagar)',
        prescribedBy: 'Dr. Vikram Anand, MD',
        prescribedDate: '2024-06-12',
        sourceCategory: 'INSTITUTIONAL',
        citationLabel: '[Amsh-001]',
        recordId: 'rec-apollo-001'
      }
    ];

    // Define Cross-Facility Discrepancy Alerts
    const baseDiscrepancies: MedicationDiscrepancyAlert[] = [
      {
        id: 'disc-statin-dup-01',
        type: 'THERAPEUTIC_DUPLICATION',
        title: 'Concurrent Dual Statin Therapy (Atorvastatin + Rosuvastatin)',
        severity: 'CRITICAL',
        description: 'Patient is concurrently documented on Atorvastatin 10mg daily at Apollo Hospitals and Rosuvastatin 10mg daily at Manipal Hospital. Taking two separate HMG-CoA reductase inhibitors creates severe additive toxicity risks.',
        clinicalRisk: 'Severe risk of drug-induced rhabdomyolysis, myopathy, acute kidney injury from myoglobinuria, and transaminase elevation.',
        recommendedAction: 'Immediately deprescribe one statin. Maintain either Rosuvastatin 10mg (higher potency for LDL reduction) or Atorvastatin 20mg based on lipid target, and discontinue the second prescription with clear patient instructions.',
        involvedMedications: [
          {
            facility: 'Apollo Hospitals (Indiranagar)',
            prescribedDrug: 'Atorvastatin Tablets IP 10mg',
            dosage: '10 mg once daily (bedtime)',
            frequency: 'Daily',
            prescribedDate: '2024-06-12',
            recordId: 'rec-apollo-001',
            citationLabel: '[Amsh-001]',
            doctorName: 'Dr. Vikram Anand, MD',
            sourceCategory: 'INSTITUTIONAL'
          },
          {
            facility: 'Manipal Hospital (Old Airport Road)',
            prescribedDrug: 'Rosuvastatin Tablets IP 10mg',
            dosage: '10 mg once daily (bedtime)',
            frequency: 'Daily',
            prescribedDate: '2024-03-18',
            recordId: 'rec-manipal-001',
            citationLabel: '[Scan-Manipal]',
            doctorName: 'Dr. Shalini Rao, DM',
            sourceCategory: 'PATIENT_UPLOADED'
          }
        ],
        status: 'UNRESOLVED'
      },
      {
        id: 'disc-metformin-dose-02',
        type: 'DOSAGE_DISCORDANCE',
        title: 'Metformin Daily Dosage Discordance (500mg ER vs 2000mg Daily)',
        severity: 'HIGH',
        description: 'Apollo Hospital OPD records Metformin ER 500mg once daily, whereas City Health Diagnostic documentation and pharmacy receipt indicate dose escalation to Metformin 1000mg twice daily following HbA1c elevation to 7.8%.',
        clinicalRisk: 'Subtherapeutic dosing (500mg ER) fails to achieve ADA/ICMR glycemic targets (HbA1c < 7.0%), while uncoordinated abrupt doubling increases gastrointestinal adverse effects.',
        recommendedAction: 'Harmonize on Metformin 1000mg prolonged release twice daily with meals, counsel patient on adherence, and schedule repeat renal function (eGFR) and HbA1c in 90 days.',
        involvedMedications: [
          {
            facility: 'Apollo Hospitals (Indiranagar)',
            prescribedDrug: 'Metformin ER 500mg',
            dosage: '500 mg once daily (dinner)',
            frequency: 'Daily',
            prescribedDate: '2024-06-12',
            recordId: 'rec-apollo-001',
            citationLabel: '[Amsh-001]',
            doctorName: 'Dr. Vikram Anand, MD',
            sourceCategory: 'INSTITUTIONAL'
          },
          {
            facility: 'City Health Diagnostic Center',
            prescribedDrug: 'Metformin 1000mg',
            dosage: '1000 mg twice daily with meals',
            frequency: 'Twice daily',
            prescribedDate: '2024-07-22',
            recordId: 'rec-city-002',
            citationLabel: '[City-Metformin]',
            doctorName: 'Dr. K. Narayanan, MBBS',
            sourceCategory: 'PATIENT_UPLOADED'
          }
        ],
        status: 'UNRESOLVED'
      },
      {
        id: 'disc-antihypertensive-03',
        type: 'CROSS_FACILITY_OMISSION',
        title: 'Antihypertensive Continuity Across Hospital Transfer',
        severity: 'MODERATE',
        description: 'Apollo prescribed Telmisartan 40mg daily, but Manipal Hospital consult notes indicate patient was evaluated for refractory blood pressure spikes without confirmation of ongoing Telmisartan adherence.',
        clinicalRisk: 'Unintended omission or erratic adherence leads to hypertensive rebound, organ strain, and confounding diagnostic workup.',
        recommendedAction: 'Reaffirm active status of Telmisartan 40mg daily morning dosing. Confirm patient is not taking supplementary over-the-counter or herbal remedies.',
        involvedMedications: [
          {
            facility: 'Apollo Hospitals (Indiranagar)',
            prescribedDrug: 'Telmisartan Tablets IP 40mg',
            dosage: '40 mg once daily',
            frequency: 'Morning',
            prescribedDate: '2024-06-12',
            recordId: 'rec-apollo-001',
            citationLabel: '[Amsh-001]',
            doctorName: 'Dr. Vikram Anand, MD',
            sourceCategory: 'INSTITUTIONAL'
          }
        ],
        status: 'RESOLVED',
        resolvedAction: 'CONTINUE',
        resolvedDrugName: 'Telmisartan 40mg',
        resolvedDosage: '40 mg daily',
        justification: 'Confirmed active daily adherence with controlled ambulatory BP (134/82 mmHg).',
        resolvedBy: 'Dr. Vikram Anand, MD',
        resolvedAt: '2024-10-14T09:30:00Z'
      }
    ];

    // Apply any clinician overrides
    const updatedMedications = baseMedications.map(med => {
      // Check overrides for specific medications
      if (activeOverrides.has(med.id)) {
        const override = activeOverrides.get(med.id)!;
        return {
          ...med,
          status: override.action === 'DISCONTINUE_DEPRESCRIBE' ? ('DISCONTINUED' as const) : ('MODIFIED' as const),
          reconciliationAction: override.action,
          dosage: override.targetDosage || med.dosage,
          frequency: override.targetFrequency || med.frequency,
          clinicianRationale: override.justification,
          reconciledBy: override.staffName,
          reconciledAt: override.resolvedAt
        };
      }
      return med;
    });

    const updatedDiscrepancies = baseDiscrepancies.map(disc => {
      if (activeOverrides.has(disc.id)) {
        const override = activeOverrides.get(disc.id)!;
        return {
          ...disc,
          status: 'RESOLVED' as const,
          resolvedAction: override.action,
          resolvedDrugName: override.targetDrugName || disc.involvedMedications[0]?.prescribedDrug,
          resolvedDosage: override.targetDosage || disc.involvedMedications[0]?.dosage,
          justification: override.justification,
          resolvedBy: override.staffName,
          resolvedAt: override.resolvedAt
        };
      }
      return disc;
    });

    // If statin discrepancy is resolved, adjust rosuvastatin vs atorvastatin accordingly
    if (activeOverrides.has('disc-statin-dup-01')) {
      const statinRes = activeOverrides.get('disc-statin-dup-01')!;
      if (statinRes.action === 'DISCONTINUE_DEPRESCRIBE' || statinRes.targetDrugName?.includes('Rosuvastatin')) {
        const rosuIndex = updatedMedications.findIndex(m => m.id === 'med-rosuvastatin-04');
        const atorIndex = updatedMedications.findIndex(m => m.id === 'med-atorvastatin-03');
        if (rosuIndex !== -1 && atorIndex !== -1) {
          // If Rosuvastatin was chosen to keep, Atorvastatin is discontinued
          if (statinRes.targetDrugName?.toLowerCase().includes('rosuvastatin')) {
            updatedMedications[atorIndex].status = 'DISCONTINUED';
            updatedMedications[atorIndex].clinicianRationale = 'Deprescribed to eliminate therapeutic duplication. Standardized on Rosuvastatin 10mg.';
            updatedMedications[atorIndex].reconciledBy = statinRes.staffName;
            updatedMedications[atorIndex].reconciledAt = statinRes.resolvedAt;

            updatedMedications[rosuIndex].status = 'ACTIVE';
            updatedMedications[rosuIndex].clinicianRationale = 'Selected as primary statin for high-intensity LDL reduction.';
            updatedMedications[rosuIndex].reconciledBy = statinRes.staffName;
            updatedMedications[rosuIndex].reconciledAt = statinRes.resolvedAt;
          } else {
            // Atorvastatin kept, Rosuvastatin discontinued
            updatedMedications[rosuIndex].status = 'DISCONTINUED';
            updatedMedications[rosuIndex].clinicianRationale = 'Deprescribed to eliminate therapeutic duplication. Continuing established Apollo Atorvastatin.';
            updatedMedications[rosuIndex].reconciledBy = statinRes.staffName;
            updatedMedications[rosuIndex].reconciledAt = statinRes.resolvedAt;

            updatedMedications[atorIndex].status = 'ACTIVE';
          }
        }
      }
    }

    // If metformin discrepancy resolved, update metformin item
    if (activeOverrides.has('disc-metformin-dose-02')) {
      const metRes = activeOverrides.get('disc-metformin-dose-02')!;
      const metIndex = updatedMedications.findIndex(m => m.id === 'med-metformin-02');
      if (metIndex !== -1) {
        updatedMedications[metIndex].dosage = metRes.targetDosage || '1000 mg';
        updatedMedications[metIndex].frequency = metRes.targetFrequency || 'Twice daily with meals';
        updatedMedications[metIndex].status = 'MODIFIED';
        updatedMedications[metIndex].clinicianRationale = metRes.justification;
        updatedMedications[metIndex].reconciledBy = metRes.staffName;
        updatedMedications[metIndex].reconciledAt = metRes.resolvedAt;
      }
    }

    const activeCount = updatedMedications.filter(m => m.status === 'ACTIVE' || m.status === 'MODIFIED').length;
    const deprescribedCount = updatedMedications.filter(m => m.status === 'DISCONTINUED').length;
    const modifiedCount = updatedMedications.filter(m => m.status === 'MODIFIED').length;
    const unresolvedDiscrepancyCount = updatedDiscrepancies.filter(d => d.status === 'UNRESOLVED').length;

    return {
      patientId: patient.id,
      patientName: patient.name,
      reconciledAt: new Date().toISOString(),
      activeRegimen: updatedMedications,
      discrepancies: updatedDiscrepancies,
      rxNormCodingRate: '100%',
      atcCodingRate: '100%',
      metrics: {
        totalEvaluated: updatedMedications.length,
        activeCount,
        discrepancyCount: updatedDiscrepancies.length,
        unresolvedDiscrepancyCount,
        deprescribedCount,
        modifiedCount
      }
    };
  }

  /**
   * Apply clinician reconciliation action to a discrepancy
   */
  public resolveDiscrepancy(input: MedicationReconciliationResolutionInput): void {
    this.userActionOverrides.set(input.discrepancyId, {
      action: input.action,
      targetDrugName: input.targetDrugName,
      targetDosage: input.targetDosage,
      targetFrequency: input.targetFrequency,
      justification: input.justification,
      staffName: input.staffName,
      resolvedAt: new Date().toISOString()
    });
  }

  /**
   * Apply a direct action to a specific medication item
   */
  public setMedicationAction(
    medicationId: string, 
    action: MedicationAction, 
    justification: string, 
    staffName: string,
    targetDosage?: string,
    targetFrequency?: string
  ): void {
    this.userActionOverrides.set(medicationId, {
      action,
      targetDosage,
      targetFrequency,
      justification,
      staffName,
      resolvedAt: new Date().toISOString()
    });
  }

  /**
   * Clear all overrides for test resetting
   */
  public clearOverrides(): void {
    this.userActionOverrides.clear();
  }
}

export const medicationReconciliationService = new MedicationReconciliationService();
