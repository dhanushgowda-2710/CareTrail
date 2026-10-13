import { 
  VoiceIntakeLanguage, 
  VoiceIntakeScenario, 
  VoiceRecordingSession, 
  ExtractedVoiceEntities,
  MedicalRecord,
  StaffProfile
} from '../types/caretrail';
import { intraHospitalStore } from './intraHospitalService';

export const CLINICAL_VOICE_SCENARIOS: VoiceIntakeScenario[] = [
  {
    id: 'scenario-kannada-cardiac',
    title: 'ಕನ್ನಡ: ಎದೆಬಡಿತ ಮತ್ತು ರಾತ್ರಿ ಉಸಿರಾಟದ ತೊಂದರೆ (Palpitations & Nocturnal Dyspnea)',
    language: 'kn-IN',
    languageLabel: 'Kannada (ಕರ್ನಾಟಕ)',
    languageNativeName: 'ಕನ್ನಡ',
    speakerRole: 'PATIENT',
    speakerName: 'Sunita Reddy',
    audioDurationSeconds: 42,
    clarityConfidenceScore: 94,
    originalTranscript: 'ನನಗೆ ಕಳೆದ ಎರಡು ವಾರಗಳಿಂದ ನಡೆದಾಡುವಾಗ ಎದೆಬಡಿತ ಜಾಸ್ತಿಯಾಗುತ್ತದೆ ಮತ್ತು ರಾತ್ರಿ ವೇಳೆ ಮಲಗಿದಾಗ ಉಸಿರಾಟ ಕಷ್ಟವಾಗುತ್ತದೆ. ನಾನು ಮೆಟ್‌ಫಾರ್ಮಿನ್ 500mg ತೆಗೆದುಕೊಳ್ಳುತ್ತಿದ್ದೇನೆ, ಆದರೆ ಬಿಪಿ ಮಾತ್ರೆ ತಿಂಗಳು ಮುಂಚೆ ಮುಗಿದುಹೋಗಿ ನಿಲ್ಲಿಸಿದ್ದೇನೆ. ಕಾಲಿನಲ್ಲಿ ಸ್ವಲ್ಪ ಊತ ಬಂದಿದೆ.',
    translatedEnglishDraft: 'Patient reports worsening exertional palpitations and nocturnal orthopnea/dyspnea when lying flat for the past 2 weeks. Compliant with Metformin 500mg regularly; however, reports discontinuing antihypertensive medication 1 month ago after supply ran out. Mild bilateral pedal edema noted by patient.',
    extractedEntities: {
      chiefComplaints: ['Exertional palpitations', 'Nocturnal dyspnea / orthopnea'],
      symptoms: ['Bilateral pedal edema', 'Breathlessness on lying flat'],
      approximateTimeline: '2 weeks duration (patient recall - approximate)',
      uncertaintiesOrGaps: [
        'Discontinued BP medication brand and dosage not recalled by patient',
        'Exact onset date of pedal edema approximate'
      ],
      mentionedMedications: [
        {
          medicineName: 'Metformin IP',
          dosage: '500 mg',
          frequency: 'Regular daily',
          adherenceStatus: 'REGULAR',
          context: 'Taking regularly for diabetes'
        },
        {
          medicineName: 'Antihypertensive agent (Unspecified)',
          dosage: 'Unknown',
          adherenceStatus: 'STOPPED_DISCONTINUED',
          context: 'Discontinued 1 month ago due to stock exhaustion'
        }
      ],
      vitalsOrObservations: [
        {
          parameter: 'Pedal Edema',
          value: 'Present (Bilateral)',
          flag: 'ELEVATED'
        }
      ],
      clinicalRisksIdentified: [
        'Severe rebound hypertension risk secondary to abrupt antihypertensive cessation',
        'Early congestive cardiac failure signs (orthopnea + pedal edema)'
      ]
    },
    provenance: {
      sourceCategory: 'PATIENT_REPORTED',
      verificationStatus: 'AWAITING_REVIEW',
      uncertaintyNote: 'Intake voice recollection in Kannada. Candidate facts extracted for clinician review before chart commit.'
    }
  },
  {
    id: 'scenario-hindi-hypo',
    title: 'हिन्दी: सुबह चक्कर आना और हाथ कांपना (Fasting Tremors & Reactive Hypoglycemia)',
    language: 'hi-IN',
    languageLabel: 'Hindi (भारत)',
    languageNativeName: 'हिन्दी',
    speakerRole: 'PATIENT',
    speakerName: 'Rajesh Kumar',
    audioDurationSeconds: 38,
    clarityConfidenceScore: 96,
    originalTranscript: 'डॉक्टर साहब, पिछले 10 दिनों से सुबह खाली पेट बहुत चक्कर आते हैं, पसीना आता है और हाथ कांपने लगते हैं। कुछ मीठा बिस्कुट खाने के बाद आराम मिलता है। मैं ग्लिमेपिराइड 2mg सुबह नाश्ते से आधा घंटा पहले लेता हूँ और इंसुलिन भी पिछले महीने अपोलो में शुरू हुआ था। दो बार कमजोरी से गिरते-गिरते बचा हूँ।',
    translatedEnglishDraft: 'Patient reports recurrent episodes of early morning fasting dizziness, profuse diaphoresis, and hand tremors for the past 10 days, promptly resolving after consuming sweet biscuits (suggestive of symptomatic reactive hypoglycemia). Taking Glimepiride 2mg 30 minutes before breakfast; subcutaneous insulin initiated last month at Apollo Hospital. Reports two near-syncope / near-fall episodes.',
    extractedEntities: {
      chiefComplaints: ['Recurrent fasting dizziness & tremors', 'Profuse sweating in morning'],
      symptoms: ['Hand tremors', 'Diaphoresis', 'Pre-syncope / near-fall'],
      approximateTimeline: '10 days duration (patient recall)',
      uncertaintiesOrGaps: [
        'Exact insulin unit regimen not recalled; requires verification from Apollo discharge summary',
        'Fasting capillary blood glucose readings not recorded during episodes'
      ],
      mentionedMedications: [
        {
          medicineName: 'Glimepiride IP',
          dosage: '2 mg',
          frequency: 'Morning before breakfast',
          adherenceStatus: 'REGULAR',
          context: 'Sulfonylurea taken before breakfast'
        },
        {
          medicineName: 'Human Insulin',
          dosage: 'Regimen unconfirmed',
          adherenceStatus: 'REGULAR',
          context: 'Initiated at Apollo last month'
        }
      ],
      vitalsOrObservations: [
        {
          parameter: 'Symptomatic Relief with Glucose',
          value: 'Positive (Whipple triad suspect)',
          flag: 'CRITICAL'
        }
      ],
      clinicalRisksIdentified: [
        'Severe hypoglycemia risk due to combination of Sulfonylurea + Insulin therapy',
        'Fall risk in diabetic patient with pre-syncope episodes'
      ]
    },
    provenance: {
      sourceCategory: 'PATIENT_REPORTED',
      verificationStatus: 'AWAITING_REVIEW',
      uncertaintyNote: 'Intake voice narrative in Hindi. Immediate clinician review required for insulin dosage adjustment.'
    }
  },
  {
    id: 'scenario-english-rounds',
    title: 'English: Clinician Rapid Post-CABG Outpatient Review Memo',
    language: 'en-IN',
    languageLabel: 'Indian English (OPD Dictation)',
    languageNativeName: 'English',
    speakerRole: 'CLINICIAN',
    speakerName: 'Dr. Anand Sharma',
    audioDurationSeconds: 45,
    clarityConfidenceScore: 98,
    originalTranscript: 'Follow-up review of post-CABG patient Arvind Swamy. Sternal incision well approximated, no instability or discharge. Chest auscultation clear bilaterally, no basal crepitations. Clinic BP 134 over 82 mmHg, pulse 74 regular. Recent fasting lipid panel reviewed: LDL 68 mg/dL on Atorvastatin 40mg. Continue Aspirin 75mg daily, maintain Metoprolol 25mg BD. Advise cardiac rehab walking 30 minutes daily. Next follow-up in 3 months with 2D-ECHO.',
    translatedEnglishDraft: 'Surgical follow-up of post-coronary artery bypass grafting patient Arvind Swamy. Sternal wound healed satisfactorily without instability or erythema. Respiratory system: Vesicular breath sounds bilaterally, no adventitious sounds. Vitals: BP 134/82 mmHg, Pulse 74/min regular. Target LDL achieved (68 mg/dL) on Atorvastatin 40mg OD. Plan: Continue Aspirin 75mg OD and Metoprolol Succinate 25mg BD. Prescribed graded cardiac rehabilitation. Schedule 2D-ECHO and review in 3 months.',
    extractedEntities: {
      chiefComplaints: ['Post-CABG routine surgical follow-up'],
      symptoms: ['Asymptomatic; no chest pain or dyspnea'],
      approximateTimeline: 'Encounter today',
      uncertaintiesOrGaps: [],
      mentionedMedications: [
        {
          medicineName: 'Atorvastatin IP',
          dosage: '40 mg',
          frequency: 'Once daily (HS)',
          adherenceStatus: 'REGULAR',
          context: 'Target LDL 68 mg/dL achieved'
        },
        {
          medicineName: 'Aspirin IP',
          dosage: '75 mg',
          frequency: 'Once daily after meals',
          adherenceStatus: 'REGULAR',
          context: 'Antiplatelet secondary prevention'
        },
        {
          medicineName: 'Metoprolol Succinate ER',
          dosage: '25 mg',
          frequency: 'Twice daily',
          adherenceStatus: 'REGULAR',
          context: 'Rate control & cardioprotection'
        }
      ],
      vitalsOrObservations: [
        {
          parameter: 'Blood Pressure',
          value: '134/82',
          unit: 'mmHg',
          flag: 'NORMAL'
        },
        {
          parameter: 'Pulse Rate',
          value: '74',
          unit: 'bpm',
          flag: 'NORMAL'
        },
        {
          parameter: 'LDL Cholesterol',
          value: '68',
          unit: 'mg/dL',
          flag: 'NORMAL'
        }
      ],
      clinicalRisksIdentified: []
    },
    provenance: {
      sourceCategory: 'INSTITUTIONAL',
      verificationStatus: 'VERIFIED',
      uncertaintyNote: 'Direct clinician audio dictation during OPD consultation. Verified and authored by attending cardiologist.'
    }
  }
];

class VoiceIntakeService {
  /**
   * Retrieve available pre-recorded clinical scenarios
   */
  public getScenarios(): VoiceIntakeScenario[] {
    return CLINICAL_VOICE_SCENARIOS;
  }

  public getScenarioById(id: string): VoiceIntakeScenario | undefined {
    return CLINICAL_VOICE_SCENARIOS.find(s => s.id === id);
  }

  /**
   * Parse arbitrary user-spoken speech transcript into candidate clinical entities
   */
  public parseTranscriptEntities(
    transcript: string, 
    language: VoiceIntakeLanguage,
    speakerRole: 'PATIENT' | 'CAREGIVER' | 'CLINICIAN'
  ): {
    standardizedDraft: string;
    entities: ExtractedVoiceEntities;
  } {
    const textLower = transcript.toLowerCase();

    const chiefComplaints: string[] = [];
    const symptoms: string[] = [];
    const uncertainties: string[] = [];
    const mentionedMedications: ExtractedVoiceEntities['mentionedMedications'] = [];
    const vitalsOrObservations: ExtractedVoiceEntities['vitalsOrObservations'] = [];

    // Symptom detection across Kannada, Hindi, and English terms
    if (textLower.includes('chest') || textLower.includes('ಎದೆ') || textLower.includes('सीने') || textLower.includes('दर्द')) {
      chiefComplaints.push('Chest discomfort / retrosternal symptom');
      symptoms.push('Chest tightness or pain');
    }
    if (textLower.includes('breath') || textLower.includes('ಉಸಿರಾಟ') || textLower.includes('सांस') || textLower.includes('dyspnea')) {
      chiefComplaints.push('Shortness of breath / respiratory distress');
      symptoms.push('Dyspnea on exertion or at rest');
    }
    if (textLower.includes('giddiness') || textLower.includes('ಚಕ್ಕರ್') || textLower.includes('चक्कर') || textLower.includes('dizziness')) {
      chiefComplaints.push('Dizziness / lightheadedness');
      symptoms.push('Pre-syncope episodes');
    }
    if (textLower.includes('sugar') || textLower.includes('diabetes') || textLower.includes('ಸಕ್ಕರೆ') || textLower.includes('मधुमेह')) {
      chiefComplaints.push('Glycemic disturbance / diabetes follow-up');
    }
    if (textLower.includes('swelling') || textLower.includes('ಊತ') || textLower.includes('सूजन') || textLower.includes('edema')) {
      symptoms.push('Peripheral edema / limb swelling');
    }

    if (chiefComplaints.length === 0) {
      chiefComplaints.push('Patient reported clinical symptom narrative');
    }

    // Medication detection
    if (textLower.includes('metformin') || textLower.includes('ಮೆಟ್‌ಫಾರ್ಮಿನ್')) {
      mentionedMedications.push({
        medicineName: 'Metformin IP',
        dosage: '500 mg',
        adherenceStatus: 'REGULAR',
        context: 'Oral biguanide for diabetes'
      });
    }
    if (textLower.includes('glimepiride') || textLower.includes('ग्लिमेपिराइड')) {
      mentionedMedications.push({
        medicineName: 'Glimepiride IP',
        dosage: '2 mg',
        adherenceStatus: 'REGULAR',
        context: 'Sulfonylurea'
      });
    }
    if (textLower.includes('insulin') || textLower.includes('ಇನ್ಸುಲಿನ್') || textLower.includes('इंसुलिन')) {
      mentionedMedications.push({
        medicineName: 'Insulin (Subcutaneous)',
        dosage: 'Unspecified units',
        adherenceStatus: 'REGULAR',
        context: 'Injectable insulin therapy'
      });
      uncertainties.push('Insulin regimen details and timing requires formal verification');
    }
    if (textLower.includes('bp') || textLower.includes('ಬಿಪಿ') || textLower.includes('बीपी')) {
      if (textLower.includes('stop') || textLower.includes('ನಿಲ್ಲಿಸಿದ್ದೇನೆ') || textLower.includes('बंद')) {
        mentionedMedications.push({
          medicineName: 'Antihypertensive agent (Unspecified)',
          adherenceStatus: 'STOPPED_DISCONTINUED',
          context: 'Patient reports discontinuing BP medicine'
        });
        uncertainties.push('Name and strength of discontinued BP medication unknown');
      }
    }

    // Timeline detection
    let timeline = 'Approximate duration per patient recollection';
    if (textLower.includes('week') || textLower.includes('ವಾರ') || textLower.includes('हफ्ते')) {
      timeline = 'Reported 1-2 weeks duration (patient estimate)';
    } else if (textLower.includes('month') || textLower.includes('ತಿಂಗಳು') || textLower.includes('महीने')) {
      timeline = 'Reported ~1 month duration (patient estimate)';
    } else if (textLower.includes('day') || textLower.includes('ದಿನ') || textLower.includes('दिन')) {
      timeline = 'Reported 5-10 days duration (patient estimate)';
    }

    if (speakerRole !== 'CLINICIAN') {
      uncertainties.push('Patient-reported intake: dates and brand names are subject to memory recall limits');
    }

    const standardizedDraft = speakerRole === 'CLINICIAN'
      ? `Clinician dictated progress note: ${transcript}`
      : `Patient intake voice transcription (${language}): ${transcript}. Summary: Patient notes ${chiefComplaints.join(', ')} with approximate timeline ${timeline}. Extracted candidate items awaiting clinician review.`;

    return {
      standardizedDraft,
      entities: {
        chiefComplaints,
        symptoms,
        approximateTimeline: timeline,
        uncertaintiesOrGaps: uncertainties,
        mentionedMedications,
        vitalsOrObservations
      }
    };
  }

  /**
   * Commit verified voice recording session into intra-hospital clinical store
   */
  public commitVoiceSessionToChart(
    patientId: string,
    session: {
      language: VoiceIntakeLanguage;
      speakerRole: 'PATIENT' | 'CAREGIVER' | 'CLINICIAN';
      speakerName: string;
      originalTranscript: string;
      clinicalNoteText: string;
      entities: ExtractedVoiceEntities;
      authorStaff: StaffProfile;
      saveAsInstitutionalDoctorNote: boolean;
    }
  ): {
    success: boolean;
    message: string;
    createdRecord?: MedicalRecord;
  } {
    const patient = intraHospitalStore.getCrossHospitalRegistry().find(p => p.id === patientId);
    if (!patient) {
      return { success: false, message: `Patient ${patientId} not found.` };
    }

    const todayIso = new Date().toISOString().split('T')[0];
    const correlationId = `req-voice-${Date.now()}`;

    const isDoctorNote = session.saveAsInstitutionalDoctorNote && session.authorStaff.role === 'doctor';

    const newRecord: MedicalRecord = {
      id: `rec-voice-${Date.now()}`,
      patientId: patient.id,
      hospitalId: session.authorStaff.hospitalId,
      hospitalName: session.authorStaff.hospitalName,
      branchId: session.authorStaff.branchId,
      branchName: session.authorStaff.branchName,
      authorStaffId: session.authorStaff.id,
      authorStaffName: session.authorStaff.name,
      authorRole: isDoctorNote ? session.authorStaff.designation : `${session.speakerName} (${session.speakerRole})`,
      encounterDate: todayIso,
      type: 'CONSULTATION',
      title: isDoctorNote
        ? `Clinician Voice Dictation: ${session.entities.chiefComplaints[0] || 'OPD Assessment'}`
        : `Multilingual Voice Intake (${session.language}): ${session.entities.chiefComplaints[0] || 'Patient Report'}`,
      sourceSystemName: `Tier 4 Multilingual Voice Engine (${session.language})`,
      sourceCategory: isDoctorNote ? 'INSTITUTIONAL' : 'PATIENT_REPORTED',
      verificationStatus: isDoctorNote ? 'VERIFIED' : 'AWAITING_REVIEW',
      isPatientReported: !isDoctorNote,
      clinicalNotes: `${session.clinicalNoteText}\n\n[TRANSCRIPT AUDIT]: Native Language: ${session.language} | Original Audio Transcript: "${session.originalTranscript}"\n[TIMELINE]: ${session.entities.approximateTimeline}`,
      diagnosis: session.entities.chiefComplaints.join(', '),
      createdAt: new Date().toISOString()
    };

    // If medications were extracted, attach candidate prescriptions
    if (session.entities.mentionedMedications.length > 0) {
      newRecord.prescriptions = session.entities.mentionedMedications.map(m => ({
        medicineName: m.medicineName,
        dosage: m.dosage || 'Dosage unconfirmed',
        frequency: m.frequency || (m.adherenceStatus === 'STOPPED_DISCONTINUED' ? 'DISCONTINUED BY PATIENT' : 'Daily'),
        duration: 'Awaiting doctor reconciliation',
        instructions: `Extracted from voice intake: ${m.context || m.adherenceStatus || 'Reported'}`
      }));
    }

    // Add to intra-hospital memory store
    const storeRecords = (intraHospitalStore as any).records;
    if (Array.isArray(storeRecords)) {
      storeRecords.unshift(newRecord);
    }

    // Log immutable audit trail entries
    intraHospitalStore.logAudit({
      actorId: session.authorStaff.id,
      actorName: session.authorStaff.name,
      actorRole: session.authorStaff.role,
      hospitalId: session.authorStaff.hospitalId,
      hospitalName: session.authorStaff.hospitalName,
      action: 'VOICE_RECORDING_TRANSCRIBED',
      targetPatientId: patient.id,
      targetPatientName: patient.name,
      outcome: 'SUCCESS_200',
      details: `Voice intake processed in language [${session.language}]. Speaker: ${session.speakerName} (${session.speakerRole}). Extracted ${session.entities.chiefComplaints.length} complaints and ${session.entities.mentionedMedications.length} medications.`,
      endpoint: `/api/patients/${patientId}/voice/transcribe`,
      requestCorrelationId: correlationId
    });

    intraHospitalStore.logAudit({
      actorId: session.authorStaff.id,
      actorName: session.authorStaff.name,
      actorRole: session.authorStaff.role,
      hospitalId: session.authorStaff.hospitalId,
      hospitalName: session.authorStaff.hospitalName,
      action: 'VOICE_CLINICAL_NOTE_SAVED',
      targetPatientId: patient.id,
      targetPatientName: patient.name,
      outcome: 'SUCCESS_200',
      details: `Voice clinical record committed to chart: "${newRecord.title}" [${newRecord.id}]. Verification status: ${newRecord.verificationStatus}, Source: ${newRecord.sourceCategory}.`,
      endpoint: `/api/patients/${patientId}/voice/commit`,
      requestCorrelationId: correlationId
    });

    return {
      success: true,
      message: `Voice intake successfully committed to chart as ${newRecord.verificationStatus} record (${newRecord.sourceCategory}).`,
      createdRecord: newRecord
    };
  }
}

export const voiceIntakeService = new VoiceIntakeService();
