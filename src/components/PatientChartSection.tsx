import React, { useState } from 'react';
import { 
  User, 
  Fingerprint, 
  Calendar, 
  MapPin, 
  Phone, 
  AlertTriangle, 
  Activity, 
  PlusCircle, 
  FileText, 
  Stethoscope, 
  FlaskConical, 
  Pill, 
  Clock, 
  ShieldCheck, 
  ChevronLeft,
  HeartPulse,
  Award,
  CheckCircle2,
  ExternalLink,
  UserCheck,
  FileEdit,
  History,
  GitBranch
} from 'lucide-react';
import { PatientProfile, MedicalRecord, StaffProfile, RecordType, AccessGrant, SourceCategory, ClinicalSynthesisResult, SynthesisFocus, ClinicalCitation } from '../types/caretrail';
import { 
  UploadCloud, 
  Layers, 
  HelpCircle, 
  Sparkles, 
  BookmarkCheck,
  Tag,
  Mic
} from 'lucide-react';
import { AiClinicalSynthesisCard } from './AiClinicalSynthesisCard';
import { CdsSafetyGuardianCard } from './CdsSafetyGuardianCard';
import { ProblemReconciliationCard } from './ProblemReconciliationCard';
import { MedicationReconciliationCard } from './MedicationReconciliationCard';
import { AllergyRegistryCard } from './AllergyRegistryCard';
import { LabInvestigationsCard } from './LabInvestigationsCard';
import { 
  PatientCdsAssessment, 
  CdsAlert, 
  CdsSimulationInput, 
  CdsSimulationResult,
  ProblemReconciliationAssessment,
  DiagnosticConflict,
  MedicationReconciliationAssessment,
  MedicationDiscrepancyAlert,
  AllergyAssessment,
  AllergyDiscrepancy,
  AllergyReconciliationAction,
  LabInvestigationAssessment,
  StandardizedLabItem
} from '../types/caretrail';

interface PatientChartSectionProps {
  patient: PatientProfile;
  records: MedicalRecord[];
  staff: StaffProfile;
  isCrossHospital?: boolean;
  activeGrant?: AccessGrant;
  onBack: () => void;
  onOpenAddEncounter: () => void;
  onOpenUploadDoc?: () => void;
  onOpenAddReported?: () => void;
  onOpenMultiSourceChannels?: () => void;
  onOpenInspector: () => void;
  onOpenConsentPortal?: () => void;
  // Prompt 4 Synthesis Props
  synthesis?: ClinicalSynthesisResult | null;
  isLoadingSynthesis?: boolean;
  onRegenerateSynthesis?: (focus: SynthesisFocus, includeUnverified: boolean) => void;
  onSelectCitation?: (citation: ClinicalCitation) => void;
  activeCitationId?: string | null;
  activeHighlightedRecordId?: string | null;
  // Prompt 5 CDS Props
  cdsAssessment?: PatientCdsAssessment | null;
  onOpenOverrideModal?: (alert: CdsAlert) => void;
  onOpenTrajectoryModal?: () => void;
  onSimulateOrder?: (input: CdsSimulationInput) => CdsSimulationResult;
  lastSimulationResult?: CdsSimulationResult | null;
  // Prompt 6 Problem Reconciliation Props
  problemAssessment?: ProblemReconciliationAssessment | null;
  onOpenConflictModal?: (conflict: DiagnosticConflict) => void;
  // Prompt 7 Medication Reconciliation Props
  medicationAssessment?: MedicationReconciliationAssessment | null;
  onOpenMedRecDiscrepancyModal?: (discrepancy: MedicationDiscrepancyAlert) => void;
  onDirectDeprescribe?: (medicationId: string, drugName: string) => void;
  // Prompt 8 Allergy & ADR Registry Props
  allergyAssessment?: AllergyAssessment | null;
  onOpenAllergyDiscrepancyModal?: (discrepancy: AllergyDiscrepancy) => void;
  onDirectAllergyAction?: (allergyId: string, action: AllergyReconciliationAction, rationale: string) => void;
  // Prompt 9 Lab Investigation Props
  labAssessment?: LabInvestigationAssessment | null;
  onOpenLabInspector?: (labItem: StandardizedLabItem) => void;
  onAcknowledgeLabDelta?: (deltaId: string, note: string) => void;
  // Prompt 10 Corrections, Disputes & Audit Trail Props
  onOpenDisputeModal?: (record: MedicalRecord) => void;
  onOpenAddendumModal?: (record: MedicalRecord) => void;
  onOpenHistoryModal?: (record: MedicalRecord) => void;
  // Prompt 11 Emergency Summary Export Prop
  onOpenEmergencySummary?: () => void;
  // Prompt 13 Multilingual Voice Intake Prop
  onOpenVoiceIntake?: () => void;
}

export const PatientChartSection: React.FC<PatientChartSectionProps> = ({
  patient,
  records,
  staff,
  isCrossHospital,
  activeGrant,
  onBack,
  onOpenAddEncounter,
  onOpenUploadDoc,
  onOpenAddReported,
  onOpenMultiSourceChannels,
  onOpenInspector,
  onOpenConsentPortal,
  synthesis = null,
  isLoadingSynthesis = false,
  onRegenerateSynthesis,
  onSelectCitation,
  activeCitationId,
  activeHighlightedRecordId,
  cdsAssessment = null,
  onOpenOverrideModal,
  onOpenTrajectoryModal,
  onSimulateOrder,
  lastSimulationResult = null,
  problemAssessment = null,
  onOpenConflictModal,
  medicationAssessment = null,
  onOpenMedRecDiscrepancyModal,
  onDirectDeprescribe,
  allergyAssessment = null,
  onOpenAllergyDiscrepancyModal,
  onDirectAllergyAction,
  labAssessment = null,
  onOpenLabInspector,
  onAcknowledgeLabDelta,
  onOpenDisputeModal,
  onOpenAddendumModal,
  onOpenHistoryModal,
  onOpenEmergencySummary,
  onOpenVoiceIntake
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterSource, setFilterSource] = useState<string>('ALL');

  const filteredRecords = records.filter(r => {
    const matchesType = filterType === 'ALL' || r.type === filterType;
    const matchesSource = filterSource === 'ALL' || r.sourceCategory === filterSource;
    return matchesType && matchesSource;
  });

  // Multi-source counts
  const institutionalCount = records.filter(r => r.sourceCategory === 'INSTITUTIONAL').length;
  const uploadedCount = records.filter(r => r.sourceCategory === 'PATIENT_UPLOADED').length;
  const reportedCount = records.filter(r => r.sourceCategory === 'PATIENT_REPORTED').length;
  const externalCount = records.filter(r => r.sourceCategory === 'EXTERNAL_EXCHANGE').length;

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Hospital Registry</span>
        </button>

        <div className="flex items-center flex-wrap gap-2">
          {isCrossHospital ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-teal-950 text-teal-300 border border-teal-700 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-teal-400" />
              <span>Cross-Hospital Access via Patient Consent (200 OK)</span>
            </span>
          ) : (
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-950 text-emerald-300 border border-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              <span>Intra-Hospital Access Active (200 OK)</span>
            </span>
          )}

          {/* Prompt 3: Multi-Source Ingestion Action Buttons */}
          {onOpenMultiSourceChannels && (
            <button
              onClick={onOpenMultiSourceChannels}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-teal-300 transition-colors"
              title="Inspect 4 ingestion pipelines and ABDM gateway status"
            >
              <Layers className="w-3.5 h-3.5 text-teal-400" />
              <span>Pipelines</span>
            </button>
          )}

          {onOpenUploadDoc && (
            <button
              onClick={onOpenUploadDoc}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-teal-900/70 hover:bg-teal-800/80 border border-teal-700/60 text-teal-200 transition-colors"
              title="Upload paper scan / PDF for Tier 4 OCR extraction"
            >
              <UploadCloud className="w-3.5 h-3.5 text-teal-300" />
              <span>Upload Scan (Tier 4)</span>
            </button>
          )}

          {onOpenAddReported && (
            <button
              onClick={onOpenAddReported}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-950/70 hover:bg-amber-900/80 border border-amber-800/60 text-amber-200 transition-colors"
              title="Add remembered medical event (patient memory recall)"
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Add Recall Event</span>
            </button>
          )}

          {onOpenVoiceIntake && (
            <button
              onClick={onOpenVoiceIntake}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-700/60 text-emerald-200 transition-colors cursor-pointer"
              title="Record or dictate clinical notes in Kannada, Hindi, or English (Prompt 13)"
            >
              <Mic className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Voice Intake (Mic)</span>
            </button>
          )}

          {onOpenEmergencySummary && (
            <button
              onClick={onOpenEmergencySummary}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-950/70 hover:bg-rose-900/80 border border-rose-800/60 text-rose-200 transition-colors cursor-pointer"
              title="Export patient-approved offline emergency summary"
            >
              <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
              <span>Export Emergency Brief</span>
            </button>
          )}

          <button
            onClick={onOpenAddEncounter}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white shadow-md shadow-teal-900/30 transition-all cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add OPD Note</span>
          </button>
        </div>
      </div>

      {/* Cross-Hospital Active Consent Alert Banner */}
      {isCrossHospital && activeGrant && (
        <div className="p-4 bg-teal-950/60 border border-teal-600/70 rounded-2xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm text-white">ABDM Digital Consent Grant Active</span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-black/40 text-teal-300 border border-teal-700">
                  {activeGrant.id}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Authorized for <strong className="text-teal-200">{activeGrant.doctorName}</strong> ({activeGrant.doctorHospitalName}) by patient <strong className="text-white">{patient.name}</strong>. Valid until <strong className="text-slate-100">{new Date(activeGrant.expiresAt).toLocaleDateString()}</strong>.
              </p>
              <div className="text-[11px] text-teal-400 mt-1 font-mono">
                Scope: [{activeGrant.scope.join(', ')}] • Purpose: {activeGrant.purpose}
              </div>
            </div>
          </div>

          {onOpenConsentPortal && (
            <button
              onClick={onOpenConsentPortal}
              className="px-3 py-1.5 bg-rose-950/70 hover:bg-rose-900 border border-rose-800 rounded-lg text-xs font-semibold text-rose-200 shrink-0 flex items-center space-x-1 transition-colors"
              title="Simulate patient revoking consent and verify immediate 403 Forbidden denial"
            >
              <span>Test Revocation (Patient Portal)</span>
            </button>
          )}
        </div>
      )}

      {/* Patient Demographic & Clinical Header Card */}
      <div className="bg-slate-900 border border-teal-800/60 rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
          {/* Identity & Basic Info */}
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-900/70 border border-teal-500/40 flex items-center justify-center text-teal-300 font-bold text-xl shadow-inner shrink-0">
              {patient.name.split(' ').map(n => n[0]).join('')}
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-bold text-white tracking-tight">{patient.name}</h2>
                <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-slate-800 text-teal-300 border border-slate-700">
                  MRN: {patient.mrn}
                </span>
                <span className="text-xs px-2 py-0.5 rounded font-mono font-medium bg-teal-950 text-teal-200 border border-teal-800 flex items-center gap-1">
                  <Fingerprint className="w-3.5 h-3.5 text-teal-400" />
                  ABHA: {patient.abhaId}
                </span>
                <span className="text-xs px-2 py-0.5 rounded font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  Blood: <strong className="text-rose-400">{patient.bloodGroup}</strong>
                </span>
              </div>

              <div className="mt-2 flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-slate-300">
                <span>{patient.age} years ({patient.dob})</span>
                <span>•</span>
                <span>{patient.gender}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  {patient.phone}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {patient.address}
                </span>
              </div>

              {/* Facility attribution */}
              <div className="mt-2 text-xs text-slate-400 flex items-center gap-2">
                <span>Registered Facility:</span>
                <span className="font-semibold text-teal-300">{patient.hospitalName}</span>
                <span>•</span>
                <span>{patient.registeredBranchName}</span>
                <span>•</span>
                <span>Since {patient.registeredDate}</span>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs shrink-0 min-w-[200px]">
            <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider mb-1">
              Emergency Contact
            </div>
            <div className="font-semibold text-slate-200">{patient.emergencyContact.name}</div>
            <div className="text-slate-400 text-[11px]">{patient.emergencyContact.relationship}</div>
            <div className="text-teal-400 font-mono text-[11px] mt-0.5">{patient.emergencyContact.phone}</div>
          </div>
        </div>

        {/* Prompt 3: Multi-Source Provenance Breakdown Metrics Strip */}
        <div className="mt-4 pt-3.5 border-t border-slate-800/90 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400">Institutional EHR (Tier 2)</div>
              <div className="font-bold text-white font-mono">{institutionalCount} Verified Records</div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-teal-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400">Uploaded Scans (Tier 4)</div>
              <div className="font-bold text-teal-300 font-mono">{uploadedCount} OCR Digitized</div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400">Patient-Reported History</div>
              <div className="font-bold text-amber-300 font-mono">{reportedCount} Memory Recalls</div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400">Cross-Hospital Exchange</div>
              <div className="font-bold text-cyan-300 font-mono">{externalCount} Consented</div>
            </div>
          </div>
        </div>

        {/* Clinical Alerts Strip: Allergies & Chronic Conditions */}
        <div className="mt-3.5 pt-3 border-t border-slate-800/90 grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Allergies Alert */}
          <div className="bg-rose-950/30 border border-rose-900/60 rounded-xl p-3 flex items-start space-x-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-[11px] font-bold text-rose-300 uppercase tracking-wider">
                Documented Allergies & Drug Adverse Reactions
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {patient.allergies.length > 0 ? (
                  patient.allergies.map((allergy, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded-md font-semibold bg-rose-900/60 text-rose-200 border border-rose-700/60">
                      {allergy}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">No known drug allergies</span>
                )}
              </div>
            </div>
          </div>

          {/* Chronic Conditions */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex items-start space-x-2.5">
            <Activity className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-[11px] font-bold text-teal-300 uppercase tracking-wider">
                Active Problem List / Chronic Diagnoses
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {patient.chronicConditions.map((condition, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded-md font-medium bg-slate-800 text-slate-200 border border-slate-700">
                    {condition}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PROMPT 4: AI Clinical Synthesis & Source Grounding Component */}
      <AiClinicalSynthesisCard
        patient={patient}
        synthesis={synthesis}
        isLoading={isLoadingSynthesis}
        onRegenerate={onRegenerateSynthesis || (() => {})}
        onSelectCitation={onSelectCitation || (() => {})}
        activeCitationId={activeCitationId}
      />

      {/* PROMPT 5: Clinical Decision Support & Drug Safety Guardian */}
      {cdsAssessment && (
        <CdsSafetyGuardianCard
          patient={patient}
          assessment={cdsAssessment}
          staff={staff}
          onSelectCitation={onSelectCitation || (() => {})}
          onOpenOverrideModal={onOpenOverrideModal || (() => {})}
          onOpenTrajectoryModal={onOpenTrajectoryModal || (() => {})}
          onSimulateOrder={onSimulateOrder || (() => ({} as any))}
          lastSimulationResult={lastSimulationResult}
        />
      )}

      {/* PROMPT 6: Active Problem List & Multi-Facility Diagnostic Reconciliation */}
      {problemAssessment && (
        <ProblemReconciliationCard
          assessment={problemAssessment}
          staff={staff}
          onOpenConflictModal={onOpenConflictModal || (() => {})}
          onSelectCitation={onSelectCitation || (() => {})}
        />
      )}

      {/* PROMPT 7: Cross-Facility Medication Reconciliation & Active Regimen Manager */}
      {medicationAssessment && (
        <MedicationReconciliationCard
          patient={patient}
          assessment={medicationAssessment}
          staff={staff}
          onSelectCitation={onSelectCitation || (() => {})}
          onOpenDiscrepancyModal={onOpenMedRecDiscrepancyModal || (() => {})}
          onDirectDeprescribe={onDirectDeprescribe}
        />
      )}

      {/* PROMPT 8: Multi-Facility Allergy & ADR Registry (MedDRA / SNOMED CT / UNII) */}
      {allergyAssessment && (
        <AllergyRegistryCard
          assessment={allergyAssessment}
          staff={staff}
          onOpenAllergyDiscrepancyModal={onOpenAllergyDiscrepancyModal || (() => {})}
          onDirectAllergyAction={onDirectAllergyAction}
        />
      )}

      {/* PROMPT 9: Longitudinal Laboratory & Diagnostic Investigations Hub (LOINC / Delta-Checks) */}
      {labAssessment && (
        <LabInvestigationsCard
          assessment={labAssessment}
          staff={staff}
          onOpenLabInspector={onOpenLabInspector || (() => {})}
          onAcknowledgeDelta={onAcknowledgeLabDelta}
          onSelectCitation={onSelectCitation as any}
        />
      )}

      {/* Multi-Source Timeline Controls & Filter Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-teal-400" />
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Unified Longitudinal Timeline ({filteredRecords.length} Records)
          </span>
        </div>

        {/* Source & Type Filter Tabs */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* Source Filter Group */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
            {[
              { id: 'ALL', label: `All Sources (${records.length})` },
              { id: 'INSTITUTIONAL', label: `Tier 2 EHR (${institutionalCount})` },
              { id: 'PATIENT_UPLOADED', label: `Tier 4 Scans (${uploadedCount})` },
              { id: 'PATIENT_REPORTED', label: `Recalls (${reportedCount})` }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterSource(f.id)}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                  filterSource === f.id
                    ? 'bg-teal-700 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
            {[
              { id: 'ALL', label: 'All Types' },
              { id: 'CONSULTATION', label: 'Consults' },
              { id: 'LAB_REPORT', label: 'Labs' },
              { id: 'PRESCRIPTION', label: 'Prescriptions' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                  filterType === f.id
                    ? 'bg-slate-800 text-teal-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Longitudinal Records List with Multi-Source Provenance */}
      <div className="space-y-4">
        {filteredRecords.length === 0 ? (
          <div className="p-10 text-center bg-slate-900/40 rounded-xl border border-dashed border-slate-800">
            <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">No records found for selected filter</p>
            <p className="text-xs text-slate-500 mt-1">Try selecting 'All Sources' or ingest a document/past event above.</p>
          </div>
        ) : (
          filteredRecords.map((record) => {
            const isInstitutional = record.sourceCategory === 'INSTITUTIONAL';
            const isUploaded = record.sourceCategory === 'PATIENT_UPLOADED';
            const isReported = record.sourceCategory === 'PATIENT_REPORTED';
            const isExternal = record.sourceCategory === 'EXTERNAL_EXCHANGE';
            const isCitationHighlighted = activeHighlightedRecordId === record.id;

            return (
              <div
                key={record.id}
                id={`record-${record.id}`}
                className={`rounded-xl p-5 shadow-lg transition-all border ${
                  isCitationHighlighted
                    ? 'ring-2 ring-amber-400 bg-amber-950/30 border-amber-500 shadow-amber-500/20 shadow-xl'
                    : isInstitutional
                    ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    : isUploaded
                    ? 'bg-teal-950/20 border-teal-800/60 hover:border-teal-700'
                    : isReported
                    ? 'bg-amber-950/20 border-amber-900/60 hover:border-amber-800'
                    : 'bg-cyan-950/20 border-cyan-800/60'
                }`}
              >
                {/* Record Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center space-x-2.5">
                    <div className={`p-2 rounded-lg border ${
                      isInstitutional ? 'bg-teal-950 border-teal-800 text-teal-400' :
                      isUploaded ? 'bg-teal-900/40 border-teal-700 text-teal-300' :
                      isReported ? 'bg-amber-950 border-amber-800 text-amber-300' :
                      'bg-cyan-950 border-cyan-800 text-cyan-300'
                    }`}>
                      {record.type === 'CONSULTATION' && <Stethoscope className="w-4 h-4" />}
                      {record.type === 'LAB_REPORT' && <FlaskConical className="w-4 h-4" />}
                      {record.type === 'VITALS' && <HeartPulse className="w-4 h-4" />}
                      {record.type === 'PRESCRIPTION' && <Pill className="w-4 h-4" />}
                      {record.type === 'DISCHARGE_SUMMARY' && <FileText className="w-4 h-4" />}
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>{record.title}</span>
                      </h3>
                      <div className="text-xs text-slate-400 flex items-center space-x-2 mt-0.5">
                        <span>Attribution: <strong className="text-slate-200">{record.authorStaffName}</strong> ({record.authorRole})</span>
                        <span>•</span>
                        <span>Facility: {record.hospitalName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-start sm:self-auto">
                    <span className="text-xs font-mono text-slate-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {record.encounterDate}
                    </span>

                    {isCitationHighlighted && (
                      <span className="text-[11px] px-2 py-0.5 rounded font-bold font-mono bg-amber-400 text-slate-950 shadow-md animate-pulse">
                        Referenced in Citation
                      </span>
                    )}

                    {/* Strict Provenance Badge from PDF 1 & 2 */}
                    {isInstitutional && (
                      <span className="text-[11px] px-2 py-0.5 rounded font-medium bg-emerald-950 text-emerald-300 border border-emerald-800">
                        Verified Institutional (Tier 2)
                      </span>
                    )}
                    {isUploaded && (
                      <span className="text-[11px] px-2 py-0.5 rounded font-medium bg-teal-950 text-teal-300 border border-teal-700">
                        Patient-Uploaded Scan (Tier 4 OCR)
                      </span>
                    )}
                    {isReported && (
                      <span className="text-[11px] px-2 py-0.5 rounded font-medium bg-amber-950 text-amber-300 border border-amber-800">
                        Patient-Reported (Unverified)
                      </span>
                    )}
                    {isExternal && (
                      <span className="text-[11px] px-2 py-0.5 rounded font-medium bg-cyan-950 text-cyan-300 border border-cyan-800">
                        Consented External Exchange
                      </span>
                    )}

                    {/* Prompt 10: Disputed Status Badge */}
                    {record.isDisputed && (
                      <span className="text-[11px] px-2 py-0.5 rounded font-bold font-mono bg-rose-950 text-rose-300 border border-rose-700 animate-pulse flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-rose-400" />
                        <span>DISPUTED BY PATIENT</span>
                      </span>
                    )}

                    {/* Prompt 10: Version / Addenda Attached Badge */}
                    {record.addenda && record.addenda.length > 0 && (
                      <span className="text-[11px] px-2 py-0.5 rounded font-bold font-mono bg-teal-950 text-teal-300 border border-teal-700 flex items-center gap-1">
                        <GitBranch className="w-3 h-3 text-teal-400" />
                        <span>v{record.version || (record.addenda.length + 1)} ({record.addenda.length} Addenda)</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Provenance Detail Bar */}
                <div className="mt-3 py-1.5 px-3 rounded-lg bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-400">
                  <div className="flex items-center space-x-1.5 truncate">
                    <Award className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span className="truncate">Source System: <strong className="text-slate-200">{record.sourceSystemName}</strong></span>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    {record.originalDocumentName && (
                      <span className="text-teal-300 font-mono text-[10px] flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        <span>Attached: {record.originalDocumentName}</span>
                      </span>
                    )}
                    <span className="font-mono text-[10px] text-slate-500">ID: {record.id}</span>
                  </div>
                </div>

                {/* Scanned Extracted Text Snippet (For Tier 4 Uploads) */}
                {record.extractedSnippet && (
                  <div className="mt-3 p-2.5 rounded-lg bg-teal-950/40 border border-teal-800/40 text-[11px] text-slate-300">
                    <span className="text-teal-300 font-semibold block mb-0.5">OCR Extracted Text Evidence:</span>
                    <p className="font-mono italic text-teal-100/90">"{record.extractedSnippet}"</p>
                  </div>
                )}

                {/* Patient-Reported Disclaimer Notice */}
                {isReported && (
                  <div className="mt-3 p-2 rounded-lg bg-amber-950/30 border border-amber-900/50 text-[11px] text-amber-300/90 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Self-narrated recollection by patient. Retained for clinical awareness without independently verified hospital chart.</span>
                  </div>
                )}

                {/* Prompt 10: Active Dispute Warning Box */}
                {record.isDisputed && record.activeDispute && (
                  <div className="mt-3 p-3 rounded-lg bg-rose-950/40 border border-rose-800/80 text-xs text-rose-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center gap-1.5 text-rose-300">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                        <span>Active Patient Dispute Filed [{record.activeDispute.disputeType}]</span>
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {new Date(record.activeDispute.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-slate-300 pl-5">
                      <strong>Patient Note:</strong> "{record.activeDispute.reason}"
                    </p>
                    {record.activeDispute.requestedCorrection && (
                      <p className="text-slate-400 pl-5 text-[11px]">
                        <strong>Requested Correction:</strong> {record.activeDispute.requestedCorrection}
                      </p>
                    )}
                  </div>
                )}

                {/* Prompt 10: Appended Addenda Summary */}
                {record.addenda && record.addenda.length > 0 && (
                  <div className="mt-3 p-3 rounded-lg bg-teal-950/40 border border-teal-800/70 text-xs text-teal-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center gap-1.5 text-teal-300">
                        <GitBranch className="w-3.5 h-3.5 text-teal-400" />
                        <span>Clinician Addenda Attached ({record.addenda.length} Total)</span>
                      </span>
                      <button
                        onClick={() => onOpenHistoryModal && onOpenHistoryModal(record)}
                        className="text-[11px] font-semibold text-teal-400 hover:text-teal-200 underline cursor-pointer"
                      >
                        Inspect Full Version History
                      </button>
                    </div>
                    {record.addenda.slice(-1).map((latestAddendum) => (
                      <div key={latestAddendum.id} className="text-[11px] text-slate-300 bg-slate-900/80 p-2 rounded border border-teal-900/60">
                        <div className="text-teal-300 font-medium">
                          Latest Addendum by {latestAddendum.authorStaffName} on {new Date(latestAddendum.timestamp).toLocaleDateString()}:
                        </div>
                        <div className="font-mono mt-0.5 text-slate-200">"{latestAddendum.addendumNotes}"</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Clinical Notes */}
                <div className="mt-2.5 text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-850">
                  {record.clinicalNotes}
                </div>
                {record.diagnosis && (
                  <div className="mt-3 text-xs">
                    <span className="font-semibold text-slate-400">Assessment / Diagnosis: </span>
                    <span className="text-teal-300 font-medium">{record.diagnosis}</span>
                  </div>
                )}

              {/* Vitals if present */}
              {record.vitals && Object.keys(record.vitals).length > 0 && (
                <div className="mt-3 p-3 bg-slate-950/80 border border-slate-800 rounded-lg">
                  <div className="text-[11px] font-bold text-teal-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <HeartPulse className="w-3.5 h-3.5 text-teal-400" />
                    <span>Recorded Clinical Vitals</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 text-xs">
                    {record.vitals.bloodPressure && (
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <div className="text-[10px] text-slate-400">Blood Pressure</div>
                        <div className="font-bold text-slate-200 font-mono">{record.vitals.bloodPressure}</div>
                      </div>
                    )}
                    {record.vitals.pulseRate && (
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <div className="text-[10px] text-slate-400">Pulse Rate</div>
                        <div className="font-bold text-slate-200 font-mono">{record.vitals.pulseRate}</div>
                      </div>
                    )}
                    {record.vitals.temperature && (
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <div className="text-[10px] text-slate-400">Temperature</div>
                        <div className="font-bold text-slate-200 font-mono">{record.vitals.temperature}</div>
                      </div>
                    )}
                    {record.vitals.spO2 && (
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <div className="text-[10px] text-slate-400">SpO2</div>
                        <div className="font-bold text-emerald-400 font-mono">{record.vitals.spO2}</div>
                      </div>
                    )}
                    {record.vitals.respiratoryRate && (
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <div className="text-[10px] text-slate-400">Resp Rate</div>
                        <div className="font-bold text-slate-200 font-mono">{record.vitals.respiratoryRate}</div>
                      </div>
                    )}
                    {record.vitals.weightKg && (
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <div className="text-[10px] text-slate-400">Weight</div>
                        <div className="font-bold text-slate-200 font-mono">{record.vitals.weightKg}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Lab Results Table */}
              {record.labResults && record.labResults.length > 0 && (
                <div className="mt-3 overflow-x-auto">
                  <div className="text-[11px] font-bold text-teal-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FlaskConical className="w-3.5 h-3.5 text-teal-400" />
                    <span>Laboratory Investigation Results</span>
                  </div>
                  <table className="w-full text-xs text-left border border-slate-800 rounded-lg overflow-hidden">
                    <thead className="bg-slate-950 text-slate-400 text-[11px] uppercase">
                      <tr>
                        <th className="px-3 py-2">Test Name</th>
                        <th className="px-3 py-2">Result Value</th>
                        <th className="px-3 py-2">Reference Interval</th>
                        <th className="px-3 py-2">Clinical Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-slate-900/60">
                      {record.labResults.map((lr, idx) => (
                        <tr key={idx} className={lr.isAbnormal ? 'bg-amber-950/20' : ''}>
                          <td className="px-3 py-2 font-medium text-slate-200">{lr.testName}</td>
                          <td className="px-3 py-2 font-bold font-mono">
                            <span className={lr.isAbnormal ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                              {lr.value} {lr.unit}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-slate-400 text-[11px]">{lr.referenceRange}</td>
                          <td className="px-3 py-2">
                            {lr.isAbnormal ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                                Abnormal Flag
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300">
                                Within Limits
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Prescriptions List */}
              {record.prescriptions && record.prescriptions.length > 0 && (
                <div className="mt-3">
                  <div className="text-[11px] font-bold text-teal-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5 text-teal-400" />
                    <span>Prescribed Medications</span>
                  </div>
                  <div className="space-y-2">
                    {record.prescriptions.map((p, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                        <div>
                          <span className="font-bold text-teal-200">{p.medicineName}</span>
                          <span className="ml-2 font-mono text-slate-300 font-semibold">{p.dosage}</span>
                          <span className="ml-2 text-slate-400">• {p.frequency}</span>
                          <span className="ml-2 text-slate-400">({p.duration})</span>
                        </div>
                        <div className="text-[11px] text-slate-400 italic">
                          {p.instructions}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Prompt 10: Record Corrections & Governance Action Bar */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                  <span className="font-mono text-slate-500">Governance:</span>
                  {record.version && record.version > 1 ? (
                    <span className="text-teal-300 font-mono font-semibold">Active: v{record.version}.0</span>
                  ) : (
                    <span className="text-slate-400 font-mono">v1.0 (Original)</span>
                  )}
                  {record.isDisputed && (
                    <span className="text-rose-400 font-bold">• Active Dispute Under Review</span>
                  )}
                </div>

                <div className="flex items-center flex-wrap gap-1.5">
                  {/* Button 1: Patient Report Dispute */}
                  <button
                    onClick={() => onOpenDisputeModal && onOpenDisputeModal(record)}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-amber-700 text-slate-300 hover:text-amber-300 text-[11px] font-semibold flex items-center space-x-1 transition-all cursor-pointer"
                    title="Patient: Flag inaccuracy or file formal dispute"
                  >
                    <AlertTriangle className="w-3 h-3 text-amber-400" />
                    <span>Dispute Record</span>
                  </button>

                  {/* Button 2: Clinician Add Addendum */}
                  <button
                    onClick={() => onOpenAddendumModal && onOpenAddendumModal(record)}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-teal-950/80 border border-slate-800 hover:border-teal-700 text-slate-300 hover:text-teal-300 text-[11px] font-semibold flex items-center space-x-1 transition-all cursor-pointer"
                    title="Clinician: Append non-destructive correction/addendum"
                  >
                    <FileEdit className="w-3 h-3 text-teal-400" />
                    <span>Add Clinician Addendum</span>
                  </button>

                  {/* Button 3: Version History */}
                  <button
                    onClick={() => onOpenHistoryModal && onOpenHistoryModal(record)}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-[11px] font-medium flex items-center space-x-1 transition-all cursor-pointer"
                    title="View original baseline and addenda trail"
                  >
                    <History className="w-3 h-3 text-slate-400" />
                    <span>History (v{record.version || 1})</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
      </div>
    </div>
  );
};
