import {
  PatientProfile,
  MedicalRecord,
  StandardizedLabItem,
  LabDeltaAlert,
  LabInvestigationAssessment,
  LabInterpretationInput,
  LabDeltaAcknowledgeInput,
  LabCategory
} from '../types/caretrail';

class LabInvestigationService {
  private initialLabsMap: Map<string, StandardizedLabItem[]> = new Map();
  private initialDeltaAlertsMap: Map<string, LabDeltaAlert[]> = new Map();

  constructor() {
    this.seedRajeshKumarLabs();
  }

  private seedRajeshKumarLabs(): void {
    const rajeshLabs: StandardizedLabItem[] = [
      {
        id: 'lab-rajesh-hba1c-01',
        testName: 'Hemoglobin A1c (Glycated Hb)',
        canonicalName: 'HbA1c / Total Glycated Hemoglobin',
        loinc: {
          code: '4548-4',
          name: 'Hemoglobin A1c/Hemoglobin.total in Blood',
          component: 'Hemoglobin A1c',
          system: 'Bld',
          scaleType: 'Qn'
        },
        category: 'GLYCEMIC',
        latestValue: 7.8,
        displayValue: '7.8',
        unit: '%',
        referenceRange: '< 5.7% (Diabetic >= 6.5%)',
        flag: 'CRITICAL_HIGH',
        latestDate: '2024-07-22',
        latestFacility: 'City Health Diagnostic Center',
        sourceCategory: 'PATIENT_UPLOADED',
        recordId: 'rec-city-002',
        citationLabel: '[City-Metformin]',
        methodology: 'High-Performance Liquid Chromatography (HPLC / NGSP Certified)',
        specimenType: 'Whole Blood (EDTA Tube)',
        trendDirection: 'UP',
        historicalReadings: [
          {
            date: '2023-11-10',
            value: 6.0,
            displayValue: '6.0',
            unit: '%',
            referenceRange: '< 5.7%',
            flag: 'HIGH',
            facility: 'Manipal Hospital (Old Airport Rd)',
            sourceCategory: 'PATIENT_UPLOADED',
            recordId: 'rec-upload-001',
            citationLabel: '[Scan-Manipal]',
            methodology: 'Immunoassay'
          },
          {
            date: '2024-01-15',
            value: 6.2,
            displayValue: '6.2',
            unit: '%',
            referenceRange: '< 5.7%',
            flag: 'HIGH',
            facility: 'Apollo Multi-Specialty Hospital',
            sourceCategory: 'INSTITUTIONAL',
            recordId: 'rec-apollo-001',
            citationLabel: '[Amsh-001]',
            methodology: 'HPLC'
          },
          {
            date: '2024-06-12',
            value: 6.4,
            displayValue: '6.4',
            unit: '%',
            referenceRange: '< 5.7%',
            flag: 'HIGH',
            facility: 'Apollo Multi-Specialty Hospital',
            sourceCategory: 'INSTITUTIONAL',
            recordId: 'rec-apollo-003',
            citationLabel: '[Amsh-Labs]',
            methodology: 'HPLC'
          },
          {
            date: '2024-07-22',
            value: 7.8,
            displayValue: '7.8',
            unit: '%',
            referenceRange: '< 5.7%',
            flag: 'CRITICAL_HIGH',
            facility: 'City Health Diagnostic Center',
            sourceCategory: 'PATIENT_UPLOADED',
            recordId: 'rec-city-002',
            citationLabel: '[City-Metformin]',
            methodology: 'HPLC'
          }
        ]
      },
      {
        id: 'lab-rajesh-fbs-02',
        testName: 'Fasting Blood Glucose',
        canonicalName: 'Glucose [Mass/volume] in Serum/Plasma (Fasting)',
        loinc: {
          code: '1558-6',
          name: 'Fasting glucose [Mass/volume] in Serum or Plasma',
          component: 'Glucose^post CFst',
          system: 'Ser/Plas',
          scaleType: 'Qn'
        },
        category: 'GLYCEMIC',
        latestValue: 148,
        displayValue: '148',
        unit: 'mg/dL',
        referenceRange: '70 - 99 mg/dL (Impaired 100-125, Diabetic >= 126)',
        flag: 'HIGH',
        latestDate: '2024-07-22',
        latestFacility: 'City Health Diagnostic Center',
        sourceCategory: 'PATIENT_UPLOADED',
        recordId: 'rec-city-002',
        citationLabel: '[City-Metformin]',
        methodology: 'Hexokinase / Photometric Enzymatic Assay',
        specimenType: 'Plasma (Sodium Fluoride / Potassium Oxalate)',
        trendDirection: 'UP',
        historicalReadings: [
          {
            date: '2024-01-15',
            value: 104,
            displayValue: '104',
            unit: 'mg/dL',
            referenceRange: '70 - 99 mg/dL',
            flag: 'HIGH',
            facility: 'Apollo Multi-Specialty Hospital',
            sourceCategory: 'INSTITUTIONAL',
            recordId: 'rec-apollo-001',
            citationLabel: '[Amsh-001]',
            methodology: 'Hexokinase'
          },
          {
            date: '2024-06-12',
            value: 112,
            displayValue: '112',
            unit: 'mg/dL',
            referenceRange: '70 - 99 mg/dL',
            flag: 'HIGH',
            facility: 'Apollo Multi-Specialty Hospital',
            sourceCategory: 'INSTITUTIONAL',
            recordId: 'rec-apollo-003',
            citationLabel: '[Amsh-Labs]',
            methodology: 'Hexokinase'
          },
          {
            date: '2024-07-22',
            value: 148,
            displayValue: '148',
            unit: 'mg/dL',
            referenceRange: '70 - 99 mg/dL',
            flag: 'HIGH',
            facility: 'City Health Diagnostic Center',
            sourceCategory: 'PATIENT_UPLOADED',
            recordId: 'rec-city-002',
            citationLabel: '[City-Metformin]',
            methodology: 'Hexokinase'
          }
        ]
      },
      {
        id: 'lab-rajesh-creatinine-03',
        testName: 'Serum Creatinine',
        canonicalName: 'Creatinine [Mass/volume] in Serum/Plasma',
        loinc: {
          code: '2160-0',
          name: 'Creatinine [Mass/volume] in Serum or Plasma',
          component: 'Creatinine',
          system: 'Ser/Plas',
          scaleType: 'Qn'
        },
        category: 'RENAL_ELECTROLYTES',
        latestValue: 1.45,
        displayValue: '1.45',
        unit: 'mg/dL',
        referenceRange: '0.70 - 1.20 mg/dL',
        flag: 'HIGH',
        latestDate: '2024-07-22',
        latestFacility: 'City Health Diagnostic Center',
        sourceCategory: 'PATIENT_UPLOADED',
        recordId: 'rec-city-002',
        citationLabel: '[City-Metformin]',
        methodology: 'IDMS-Traceable Enzymatic Creatinine Assay',
        specimenType: 'Serum (SST Gold Tube)',
        trendDirection: 'UP',
        historicalReadings: [
          {
            date: '2023-11-10',
            value: 1.05,
            displayValue: '1.05',
            unit: 'mg/dL',
            referenceRange: '0.70 - 1.20 mg/dL',
            flag: 'NORMAL',
            facility: 'Manipal Hospital (Old Airport Rd)',
            sourceCategory: 'PATIENT_UPLOADED',
            recordId: 'rec-upload-001',
            citationLabel: '[Scan-Manipal]',
            methodology: 'Modified Jaffe'
          },
          {
            date: '2024-06-12',
            value: 1.30,
            displayValue: '1.30',
            unit: 'mg/dL',
            referenceRange: '0.70 - 1.20 mg/dL',
            flag: 'HIGH',
            facility: 'Apollo Multi-Specialty Hospital',
            sourceCategory: 'INSTITUTIONAL',
            recordId: 'rec-apollo-003',
            citationLabel: '[Amsh-Labs]',
            methodology: 'Enzymatic IDMS'
          },
          {
            date: '2024-07-22',
            value: 1.45,
            displayValue: '1.45',
            unit: 'mg/dL',
            referenceRange: '0.70 - 1.20 mg/dL',
            flag: 'HIGH',
            facility: 'City Health Diagnostic Center',
            sourceCategory: 'PATIENT_UPLOADED',
            recordId: 'rec-city-002',
            citationLabel: '[City-Metformin]',
            methodology: 'Enzymatic IDMS'
          }
        ]
      },
      {
        id: 'lab-rajesh-egfr-04',
        testName: 'Estimated GFR (CKD-EPI 2021)',
        canonicalName: 'Glomerular filtration rate/1.73 sq M.predicted',
        loinc: {
          code: '33914-3',
          name: 'Glomerular filtration rate/1.73 sq M.predicted',
          component: 'Glomerular filtration rate/1.73 sq M.predicted',
          system: 'Ser/Plas',
          scaleType: 'Qn'
        },
        category: 'RENAL_ELECTROLYTES',
        latestValue: 52,
        displayValue: '52',
        unit: 'mL/min/1.73m²',
        referenceRange: '> 60 mL/min/1.73m² (Stage 3a CKD: 45-59)',
        flag: 'CRITICAL_LOW',
        latestDate: '2024-07-22',
        latestFacility: 'City Health Diagnostic Center',
        sourceCategory: 'PATIENT_UPLOADED',
        recordId: 'rec-city-002',
        citationLabel: '[City-Metformin]',
        methodology: 'Calculated: CKD-EPI 2021 Creatinine Equation (Age: 58, Male)',
        specimenType: 'Derived Clinical Calculation',
        trendDirection: 'DOWN',
        historicalReadings: [
          {
            date: '2023-11-10',
            value: 74,
            displayValue: '74',
            unit: 'mL/min/1.73m²',
            referenceRange: '> 60 mL/min/1.73m²',
            flag: 'NORMAL',
            facility: 'Manipal Hospital (Old Airport Rd)',
            sourceCategory: 'PATIENT_UPLOADED',
            recordId: 'rec-upload-001',
            citationLabel: '[Scan-Manipal]'
          },
          {
            date: '2024-06-12',
            value: 58,
            displayValue: '58',
            unit: 'mL/min/1.73m²',
            referenceRange: '> 60 mL/min/1.73m²',
            flag: 'LOW',
            facility: 'Apollo Multi-Specialty Hospital',
            sourceCategory: 'INSTITUTIONAL',
            recordId: 'rec-apollo-003',
            citationLabel: '[Amsh-Labs]'
          },
          {
            date: '2024-07-22',
            value: 52,
            displayValue: '52',
            unit: 'mL/min/1.73m²',
            referenceRange: '> 60 mL/min/1.73m²',
            flag: 'CRITICAL_LOW',
            facility: 'City Health Diagnostic Center',
            sourceCategory: 'PATIENT_UPLOADED',
            recordId: 'rec-city-002',
            citationLabel: '[City-Metformin]'
          }
        ]
      },
      {
        id: 'lab-rajesh-potassium-05',
        testName: 'Serum Potassium (K+)',
        canonicalName: 'Potassium [Moles/volume] in Serum/Plasma',
        loinc: {
          code: '2823-3',
          name: 'Potassium [Moles/volume] in Serum or Plasma',
          component: 'Potassium',
          system: 'Ser/Plas',
          scaleType: 'Qn'
        },
        category: 'RENAL_ELECTROLYTES',
        latestValue: 4.9,
        displayValue: '4.9',
        unit: 'mEq/L',
        referenceRange: '3.5 - 5.0 mEq/L',
        flag: 'HIGH',
        latestDate: '2024-06-12',
        latestFacility: 'Apollo Multi-Specialty Hospital',
        sourceCategory: 'INSTITUTIONAL',
        recordId: 'rec-apollo-003',
        citationLabel: '[Amsh-Labs]',
        methodology: 'Ion Selective Electrode (ISE Direct)',
        specimenType: 'Serum (Unhemolyzed)',
        trendDirection: 'UP',
        historicalReadings: [
          {
            date: '2023-11-10',
            value: 4.2,
            displayValue: '4.2',
            unit: 'mEq/L',
            referenceRange: '3.5 - 5.0 mEq/L',
            flag: 'NORMAL',
            facility: 'Manipal Hospital (Old Airport Rd)',
            sourceCategory: 'PATIENT_UPLOADED',
            recordId: 'rec-upload-001',
            citationLabel: '[Scan-Manipal]'
          },
          {
            date: '2024-06-12',
            value: 4.9,
            displayValue: '4.9',
            unit: 'mEq/L',
            referenceRange: '3.5 - 5.0 mEq/L',
            flag: 'HIGH',
            facility: 'Apollo Multi-Specialty Hospital',
            sourceCategory: 'INSTITUTIONAL',
            recordId: 'rec-apollo-003',
            citationLabel: '[Amsh-Labs]'
          }
        ]
      },
      {
        id: 'lab-rajesh-ldl-06',
        testName: 'Low-Density Lipoprotein (LDL-C)',
        canonicalName: 'Cholesterol in LDL [Mass/volume] in Serum/Plasma',
        loinc: {
          code: '13457-7',
          name: 'Cholesterol in LDL [Mass/volume] in Serum or Plasma',
          component: 'Cholesterol.in LDL',
          system: 'Ser/Plas',
          scaleType: 'Qn'
        },
        category: 'LIPID',
        latestValue: 142,
        displayValue: '142',
        unit: 'mg/dL',
        referenceRange: '< 100 mg/dL (High risk CAD optimal < 70)',
        flag: 'HIGH',
        latestDate: '2024-06-12',
        latestFacility: 'Apollo Multi-Specialty Hospital',
        sourceCategory: 'INSTITUTIONAL',
        recordId: 'rec-apollo-003',
        citationLabel: '[Amsh-Labs]',
        methodology: 'Direct Homogeneous Enzymatic Clearance',
        specimenType: 'Serum (Fasting 12h)',
        trendDirection: 'STABLE',
        historicalReadings: [
          {
            date: '2023-11-10',
            value: 156,
            displayValue: '156',
            unit: 'mg/dL',
            referenceRange: '< 100 mg/dL',
            flag: 'HIGH',
            facility: 'Manipal Hospital (Old Airport Rd)',
            sourceCategory: 'PATIENT_UPLOADED',
            recordId: 'rec-upload-001',
            citationLabel: '[Scan-Manipal]'
          },
          {
            date: '2024-06-12',
            value: 142,
            displayValue: '142',
            unit: 'mg/dL',
            referenceRange: '< 100 mg/dL',
            flag: 'HIGH',
            facility: 'Apollo Multi-Specialty Hospital',
            sourceCategory: 'INSTITUTIONAL',
            recordId: 'rec-apollo-003',
            citationLabel: '[Amsh-Labs]'
          }
        ]
      },
      {
        id: 'lab-rajesh-cholesterol-07',
        testName: 'Total Cholesterol',
        canonicalName: 'Cholesterol [Mass/volume] in Serum/Plasma',
        loinc: {
          code: '2093-3',
          name: 'Cholesterol [Mass/volume] in Serum or Plasma',
          component: 'Cholesterol',
          system: 'Ser/Plas',
          scaleType: 'Qn'
        },
        category: 'LIPID',
        latestValue: 218,
        displayValue: '218',
        unit: 'mg/dL',
        referenceRange: '< 200 mg/dL',
        flag: 'HIGH',
        latestDate: '2024-06-12',
        latestFacility: 'Apollo Multi-Specialty Hospital',
        sourceCategory: 'INSTITUTIONAL',
        recordId: 'rec-apollo-003',
        citationLabel: '[Amsh-Labs]',
        methodology: 'CHOD-PAP Enzymatic Colorimetric',
        specimenType: 'Serum (Fasting 12h)',
        trendDirection: 'DOWN',
        historicalReadings: [
          {
            date: '2023-11-10',
            value: 234,
            displayValue: '234',
            unit: 'mg/dL',
            referenceRange: '< 200 mg/dL',
            flag: 'HIGH',
            facility: 'Manipal Hospital (Old Airport Rd)',
            sourceCategory: 'PATIENT_UPLOADED',
            recordId: 'rec-upload-001',
            citationLabel: '[Scan-Manipal]'
          },
          {
            date: '2024-06-12',
            value: 218,
            displayValue: '218',
            unit: 'mg/dL',
            referenceRange: '< 200 mg/dL',
            flag: 'HIGH',
            facility: 'Apollo Multi-Specialty Hospital',
            sourceCategory: 'INSTITUTIONAL',
            recordId: 'rec-apollo-003',
            citationLabel: '[Amsh-Labs]'
          }
        ]
      },
      {
        id: 'lab-rajesh-alt-08',
        testName: 'Alanine Aminotransferase (ALT / SGPT)',
        canonicalName: 'Alanine aminotransferase [Enzymatic activity/volume]',
        loinc: {
          code: '1742-6',
          name: 'Alanine aminotransferase [Enzymatic activity/volume] in Serum or Plasma',
          component: 'Alanine aminotransferase',
          system: 'Ser/Plas',
          scaleType: 'Qn'
        },
        category: 'HEPATIC_LFT',
        latestValue: 48,
        displayValue: '48',
        unit: 'U/L',
        referenceRange: '< 35 U/L (Male)',
        flag: 'HIGH',
        latestDate: '2024-06-12',
        latestFacility: 'Apollo Multi-Specialty Hospital',
        sourceCategory: 'INSTITUTIONAL',
        recordId: 'rec-apollo-003',
        citationLabel: '[Amsh-Labs]',
        methodology: 'IFCC UV with Pyridoxal Phosphate',
        specimenType: 'Serum',
        trendDirection: 'UP',
        historicalReadings: [
          {
            date: '2023-04-18',
            value: 32,
            displayValue: '32',
            unit: 'U/L',
            referenceRange: '< 35 U/L',
            flag: 'NORMAL',
            facility: 'Anand Diagnostic Laboratories',
            sourceCategory: 'PATIENT_UPLOADED',
            recordId: 'rec-upload-002',
            citationLabel: '[Scan-USG]'
          },
          {
            date: '2024-06-12',
            value: 48,
            displayValue: '48',
            unit: 'U/L',
            referenceRange: '< 35 U/L',
            flag: 'HIGH',
            facility: 'Apollo Multi-Specialty Hospital',
            sourceCategory: 'INSTITUTIONAL',
            recordId: 'rec-apollo-003',
            citationLabel: '[Amsh-Labs]'
          }
        ]
      },
      {
        id: 'lab-rajesh-platelets-09',
        testName: 'Platelet Count',
        canonicalName: 'Platelets [#/volume] in Blood',
        loinc: {
          code: '777-3',
          name: 'Platelets [#/volume] in Blood',
          component: 'Platelets',
          system: 'Bld',
          scaleType: 'Qn'
        },
        category: 'HEMATOLOGY',
        latestValue: 215,
        displayValue: '215',
        unit: '10^3/uL',
        referenceRange: '150 - 450 10^3/uL',
        flag: 'NORMAL',
        latestDate: '2024-06-12',
        latestFacility: 'Apollo Multi-Specialty Hospital',
        sourceCategory: 'INSTITUTIONAL',
        recordId: 'rec-apollo-003',
        citationLabel: '[Amsh-Labs]',
        methodology: 'Automated Impedance / Optical Flow Cytometry (Sysmex XN-1000)',
        specimenType: 'Whole Blood (EDTA Tube)',
        trendDirection: 'STABLE',
        historicalReadings: [
          {
            date: '2023-04-18',
            value: 210,
            displayValue: '210',
            unit: '10^3/uL',
            referenceRange: '150 - 450 10^3/uL',
            flag: 'NORMAL',
            facility: 'Anand Diagnostic Laboratories',
            sourceCategory: 'PATIENT_UPLOADED',
            recordId: 'rec-upload-002',
            citationLabel: '[Scan-USG]'
          },
          {
            date: '2024-06-12',
            value: 215,
            displayValue: '215',
            unit: '10^3/uL',
            referenceRange: '150 - 450 10^3/uL',
            flag: 'NORMAL',
            facility: 'Apollo Multi-Specialty Hospital',
            sourceCategory: 'INSTITUTIONAL',
            recordId: 'rec-apollo-003',
            citationLabel: '[Amsh-Labs]'
          }
        ]
      }
    ];

    const rajeshDeltaAlerts: LabDeltaAlert[] = [
      {
        id: 'delta-hba1c-01',
        testName: 'Hemoglobin A1c (Glycated Hb)',
        loincCode: '4548-4',
        category: 'GLYCEMIC',
        severity: 'CRITICAL',
        title: 'Critical Glycemic Surge: HbA1c Jump (+25.8% Delta)',
        description: 'HbA1c surged from 6.2% at Apollo OPD indiranagar ([Amsh-001]) to 7.8% at City Health Diagnostic Center ([City-Metformin]) within 6 months.',
        previousReading: rajeshLabs[0].historicalReadings[1],
        currentReading: rajeshLabs[0].historicalReadings[3],
        percentageChange: 25.8,
        clinicalSignificance: 'Confirms rapid metabolic deterioration transitioning from impaired pre-diabetes into active uncontrolled Type 2 Diabetes Mellitus. Patient initiated higher-dose Metformin without dietary stabilization.',
        recommendedAction: 'Verify HbA1c via certified repeat HPLC; intensify glycemic regimen with Metformin 1000mg BD; counsel regarding dietary carbohydrates and self-monitoring of blood glucose (SMBG).',
        status: 'UNACKNOWLEDGED'
      },
      {
        id: 'delta-creatinine-02',
        testName: 'Serum Creatinine & eGFR Clearance',
        loincCode: '2160-0',
        category: 'RENAL_ELECTROLYTES',
        severity: 'CRITICAL',
        title: 'Renal Function Deterioration: eGFR Drop to 52 mL/min (-29.7% Delta)',
        description: 'Serum Creatinine climbed from 1.05 mg/dL to 1.45 mg/dL across Manipal ([Scan-Manipal]), Apollo ([Amsh-Labs]), and City Health ([City-Metformin]). eGFR dropped below 60 mL/min/1.73m² threshold into CKD Stage 3a.',
        previousReading: rajeshLabs[2].historicalReadings[0],
        currentReading: rajeshLabs[2].historicalReadings[2],
        percentageChange: 38.1,
        clinicalSignificance: 'Progressive renal microvascular impairment in setting of combined hypertension, dyslipidemia, and rising glycemic load. Imposes strict contraindications against NSAIDs and requires dose capping for renal-cleared biguanides.',
        recommendedAction: 'Schedule 24-hour urine microalbumin/creatinine ratio (ACR); maintain Telmisartan under close potassium/creatinine monitoring; cap Metformin daily total at 1000-1500mg.',
        status: 'UNACKNOWLEDGED'
      },
      {
        id: 'delta-alt-03',
        testName: 'Alanine Aminotransferase (ALT / SGPT)',
        loincCode: '1742-6',
        category: 'HEPATIC_LFT',
        severity: 'WARNING',
        title: 'Hepatic Transaminase Rise (+50.0% Delta)',
        description: 'ALT increased from normal 32 U/L at Anand Labs ([Scan-USG]) to 48 U/L at Apollo Hospital ([Amsh-Labs]), exceeding normal upper limit (< 35 U/L).',
        previousReading: rajeshLabs[7].historicalReadings[0],
        currentReading: rajeshLabs[7].historicalReadings[1],
        percentageChange: 50.0,
        clinicalSignificance: 'Biochemical transaminitis corroborating whole abdomen ultrasound finding of Grade 1 diffuse hepatic steatosis (fatty liver). Coincides with concurrent statin therapy (Atorvastatin/Rosuvastatin).',
        recommendedAction: 'Monitor LFT every 3 months; deprescribe dual statin duplication immediately; encourage weight reduction and aerobic exercise.',
        status: 'UNACKNOWLEDGED'
      }
    ];

    // Attach delta alerts to respective lab items
    rajeshLabs[0].deltaAlert = rajeshDeltaAlerts[0];
    rajeshLabs[2].deltaAlert = rajeshDeltaAlerts[1];
    rajeshLabs[3].deltaAlert = rajeshDeltaAlerts[1]; // eGFR shares renal delta
    rajeshLabs[7].deltaAlert = rajeshDeltaAlerts[2];

    this.initialLabsMap.set('pat-rajesh-kumar', rajeshLabs);
    this.initialDeltaAlertsMap.set('pat-rajesh-kumar', rajeshDeltaAlerts);
  }

  public reconcilePatientLabs(
    patient: PatientProfile,
    _records: MedicalRecord[],
    interpretationsMap?: Map<string, { signedBy: string; signedAt: string; clinicalAssessment: string }>,
    acknowledgedDeltasMap?: Map<string, { acknowledgedBy: string; acknowledgedAt: string; clinicalNote: string }>
  ): LabInvestigationAssessment {
    const rawList = this.initialLabsMap.get(patient.id) || this.initialLabsMap.get('pat-rajesh-kumar') || [];
    const deltaList = this.initialDeltaAlertsMap.get(patient.id) || this.initialDeltaAlertsMap.get('pat-rajesh-kumar') || [];

    // Deep clone to apply overrides
    const panels: StandardizedLabItem[] = rawList.map(item => ({
      ...item,
      historicalReadings: [...item.historicalReadings]
    }));

    const deltaAlerts: LabDeltaAlert[] = deltaList.map(delta => ({
      ...delta
    }));

    // Apply acknowledged deltas
    if (acknowledgedDeltasMap) {
      deltaAlerts.forEach(delta => {
        const ack = acknowledgedDeltasMap.get(delta.id);
        if (ack) {
          delta.status = 'ACKNOWLEDGED';
          delta.acknowledgedBy = ack.acknowledgedBy;
          delta.acknowledgedAt = ack.acknowledgedAt;
          delta.clinicalNote = ack.clinicalNote;
        }
      });
    }

    // Apply clinician interpretation sign-offs
    if (interpretationsMap) {
      panels.forEach(panel => {
        const signOff = interpretationsMap.get(panel.id);
        if (signOff) {
          panel.interpretationSignOff = signOff;
        }
      });
    }

    const abnormalCount = panels.filter(p => p.flag !== 'NORMAL').length;
    const criticalCount = panels.filter(p => p.flag === 'CRITICAL_HIGH' || p.flag === 'CRITICAL_LOW').length;
    const unacknowledgedDeltasCount = deltaAlerts.filter(d => d.status === 'UNACKNOWLEDGED').length;
    const categoriesSet = new Set(panels.map(p => p.category));

    return {
      patientId: patient.id,
      patientName: patient.name,
      evaluatedAt: new Date().toISOString(),
      loincCodingRate: '100%',
      panels,
      deltaAlerts,
      metrics: {
        totalTestsCount: panels.length,
        abnormalCount,
        criticalCount,
        unacknowledgedDeltasCount,
        categoriesEvaluatedCount: categoriesSet.size
      }
    };
  }

  public signOffInterpretation(input: LabInterpretationInput): boolean {
    const list = this.initialLabsMap.get('pat-rajesh-kumar') || [];
    const item = list.find(l => l.id === input.labItemId);
    if (item) {
      item.interpretationSignOff = {
        signedBy: input.staffName,
        signedAt: new Date().toISOString(),
        clinicalAssessment: input.clinicalAssessment
      };
      return true;
    }
    return false;
  }

  public acknowledgeDeltaAlert(input: LabDeltaAcknowledgeInput): boolean {
    const list = this.initialDeltaAlertsMap.get('pat-rajesh-kumar') || [];
    const item = list.find(d => d.id === input.deltaId);
    if (item) {
      item.status = 'ACKNOWLEDGED';
      item.acknowledgedBy = input.staffName;
      item.acknowledgedAt = new Date().toISOString();
      item.clinicalNote = input.clinicalNote;
      return true;
    }
    return false;
  }
}

export const labInvestigationService = new LabInvestigationService();
