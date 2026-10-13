import React, { useState } from 'react';
import { 
  Building2, 
  Stethoscope, 
  Search, 
  User, 
  ShieldCheck, 
  Lock, 
  PlusCircle, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Pill, 
  Activity, 
  FlaskConical, 
  FileEdit, 
  History,
  UploadCloud,
  Eye,
  Flag,
  Share2,
  Sparkles,
  X,
  FileCheck,
  FileCode
} from 'lucide-react';
import { 
  StaffProfile, 
  PatientProfile, 
  MedicalRecord, 
  AccessRequest, 
  AccessGrant, 
  AuditEvent,
  RecordType,
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
} from '../../types/caretrail';

interface ClinicianPortalViewProps {
  staff: StaffProfile;
  patients: PatientProfile[];
  allPatients: PatientProfile[];
  selectedPatient: PatientProfile | null;
  onSelectPatient: (patientId: string) => void;
  patientRecords: MedicalRecord[];
  accessRequests: AccessRequest[];
  accessGrants: AccessGrant[];
  auditLogs: AuditEvent[];
  onRequestAccess: (patient: PatientProfile) => void;
  onOpenAddEncounter: () => void;
  onOpenAddLabReport?: () => void;
  onLinkCrossHospitalViaAbha?: (patient: PatientProfile) => void;
  onOpenAddendumModal: (record: MedicalRecord) => void;
  onOpenRecordHistory: (record: MedicalRecord) => void;
  onVerifyRecord: (recordId: string) => void;
  // Clinical Engine props maintained for compatibility
  cdsAssessment?: PatientCdsAssessment | null;
  onOpenOverrideModal?: (alert: CdsAlert) => void;
  onOpenTrajectoryModal?: () => void;
  onSimulateOrder?: (input: CdsSimulationInput) => CdsSimulationResult;
  lastSimulationResult?: CdsSimulationResult | null;
  problemAssessment?: ProblemReconciliationAssessment | null;
  onOpenConflictModal?: (conflict: DiagnosticConflict) => void;
  medicationAssessment?: MedicationReconciliationAssessment | null;
  onOpenMedRecDiscrepancyModal?: (discrepancy: MedicationDiscrepancyAlert) => void;
  onDirectDeprescribe?: (medicationId: string, drugName: string) => void;
  allergyAssessment?: AllergyAssessment | null;
  onOpenAllergyDiscrepancyModal?: (discrepancy: AllergyDiscrepancy) => void;
  onDirectAllergyAction?: (allergyId: string, action: AllergyReconciliationAction, rationale: string) => void;
  labAssessment?: LabInvestigationAssessment | null;
  onOpenLabInspector?: (labItem: StandardizedLabItem) => void;
  onAcknowledgeLabDelta?: (deltaId: string, note: string) => void;
}

export const ClinicianPortalView: React.FC<ClinicianPortalViewProps> = ({
  staff,
  patients,
  allPatients,
  selectedPatient,
  onSelectPatient,
  patientRecords,
  accessRequests,
  accessGrants,
  auditLogs,
  onRequestAccess,
  onOpenAddEncounter,
  onOpenAddLabReport,
  onLinkCrossHospitalViaAbha,
  onOpenAddendumModal,
  onOpenRecordHistory,
  onVerifyRecord
}) => {
  const [topTab, setTopTab] = useState<'directory' | 'chart' | 'audit'>('directory');
  const [directoryScope, setDirectoryScope] = useState<'in_network' | 'cross_facility'>('in_network');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Specific sub-tabs requested: Clinical Timeline, Consultation Details, Lab Reports & Investigations, Document Verification
  const [chartSubTab, setChartSubTab] = useState<'timeline' | 'consultations' | 'labs' | 'verify_queue'>('timeline');

  // Modal state for viewing both the AI Summary and Original PDF of a Lab Report
  const [selectedLabDocForPreview, setSelectedLabDocForPreview] = useState<MedicalRecord | null>(null);
  const [labPreviewTab, setLabPreviewTab] = useState<'ai_summary' | 'original_pdf'>('ai_summary');

  // Cross hospital patients
  const crossFacilityPatients = allPatients.filter(p => p.hospitalId !== staff.hospitalId);

  // Active directory list
  const activeDirectory = directoryScope === 'in_network' ? patients : crossFacilityPatients;
  const filteredDirectory = activeDirectory.filter(p => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.mrn.toLowerCase().includes(q) ||
      p.abhaId.toLowerCase().includes(q) ||
      p.chronicConditions.some(c => c.toLowerCase().includes(q))
    );
  });

  // Consultations & Lab records filtering
  const consultationRecords = patientRecords.filter(r => r.type === 'CONSULTATION');
  const labRecords = patientRecords.filter(r => r.type === 'LAB_REPORT' || (r.labResults && r.labResults.length > 0));

  // Verification queue for unverified documents
  const unverifiedRecords = patientRecords.filter(
    r => r.verificationStatus === 'AWAITING_REVIEW' || r.sourceCategory === 'PATIENT_UPLOADED'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Clinician Institutional Facility Context Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 shrink-0">
            {staff.role === 'lab_technician' ? (
              <FlaskConical className="w-6 h-6 text-teal-700" />
            ) : (
              <Stethoscope className="w-6 h-6 text-slate-800" />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold text-slate-900">{staff.name}</h1>
              <span className="text-xs px-2 py-0.5 rounded-md font-medium bg-slate-100 text-slate-700 border border-slate-200">
                {staff.designation}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-md font-mono bg-teal-50 text-teal-800 border border-teal-200">
                {staff.role === 'lab_technician' ? 'Diagnostic Lab Technician' : staff.role === 'doctor' ? 'Practicing Physician' : 'Clinical Staff'}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
              <span>{staff.department}</span>
              <span aria-hidden="true">·</span>
              <span className="font-medium text-slate-700">{staff.hospitalName}</span>
              <span aria-hidden="true">·</span>
              <span>{staff.branchName}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-[11px]">ID: {staff.id}</span>
            </div>
          </div>
        </div>

        {/* Top View Selector Buttons */}
        <div className="flex items-center space-x-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 self-start md:self-auto">
          <button
            onClick={() => setTopTab('directory')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              topTab === 'directory'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Patient Directory
          </button>
          <button
            onClick={() => {
              if (selectedPatient) setTopTab('chart');
            }}
            disabled={!selectedPatient}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              topTab === 'chart'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : selectedPatient
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 cursor-not-allowed'
            }`}
          >
            Clinical Chart {selectedPatient ? `(${selectedPatient.name.split(' ')[0]})` : ''}
          </button>
          <button
            onClick={() => setTopTab('audit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              topTab === 'audit'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Audit Log
          </button>
        </div>
      </div>

      {/* VIEW 1: Patient Directory */}
      {topTab === 'directory' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Hospital Patient Directory</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct database access is scoped to {staff.hospitalName} branch. Cross-hospital access uses Ayushman Card (ABHA) or explicit consent requests.
                </p>
              </div>

              {/* In-Network vs Cross-Hospital Directory Selector */}
              <div className="flex items-center space-x-1 p-1 bg-slate-100 rounded-xl border border-slate-200 self-start sm:self-auto">
                <button
                  onClick={() => setDirectoryScope('in_network')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    directoryScope === 'in_network'
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  In-Hospital Network ({patients.length})
                </button>
                <button
                  onClick={() => setDirectoryScope('cross_facility')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    directoryScope === 'cross_facility'
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Cross-Facility Registry ({crossFacilityPatients.length})
                </button>
              </div>
            </div>

            {/* Search Bar (10-20 patients in database) */}
            <div className="mt-4 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search patient by Name, MRN, Ayushman ABHA ID, or Condition (15+ demo profiles in registry)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-teal-700 focus:outline-hidden"
              />
            </div>

            {/* Directory Cards */}
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDirectory.map((patient) => {
                const isCrossHospital = patient.hospitalId !== staff.hospitalId;
                const activeGrant = accessGrants.find(
                  g => g.doctorId === staff.id && g.patientId === patient.id && g.status === 'ACTIVE'
                );
                const pendingReq = accessRequests.find(
                  r => r.doctorId === staff.id && r.patientId === patient.id && r.status === 'PENDING'
                );

                return (
                  <div
                    key={patient.id}
                    className={`border rounded-xl p-4.5 transition-all flex flex-col justify-between ${
                      selectedPatient?.id === patient.id
                        ? 'border-teal-700 bg-teal-50/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{patient.name}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            MRN: {patient.mrn} · {patient.age}y {patient.gender} · Blood: {patient.bloodGroup}
                          </div>
                        </div>

                        {/* Status Label */}
                        <div>
                          {!isCrossHospital ? (
                            <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                              Direct Database Access
                            </span>
                          ) : activeGrant ? (
                            <span className="text-[11px] font-medium text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md">
                              Consent Granted
                            </span>
                          ) : (
                            <span className="text-[11px] font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                              External Facility
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-2.5 text-xs text-slate-600">
                        <div className="truncate">
                          <strong>Registered Facility:</strong> {patient.hospitalName}
                        </div>
                        <div className="truncate">
                          <strong>Ayushman Card (ABHA):</strong> {patient.abhaId}
                        </div>
                        <div className="mt-1 truncate">
                          <strong>Active Diagnoses:</strong> {patient.chronicConditions.join(', ') || 'No chronic conditions on file'}
                        </div>
                        <div className="mt-0.5 text-slate-500">
                          <strong>Documented Allergies:</strong> {patient.allergies.join(', ') || 'None reported'}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      {!isCrossHospital || activeGrant ? (
                        <button
                          onClick={() => {
                            onSelectPatient(patient.id);
                            setTopTab('chart');
                          }}
                          className="w-full py-2 px-3 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-medium text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
                        >
                          <span>{staff.role === 'lab_technician' ? 'View Patient Lab Chart' : 'Open Clinical Chart'}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <div className="w-full flex flex-col gap-2">
                          <div className="flex items-center justify-between gap-2">
                            <button
                              onClick={() => {
                                if (onLinkCrossHospitalViaAbha) {
                                  onLinkCrossHospitalViaAbha(patient);
                                  setTopTab('chart');
                                }
                              }}
                              className="flex-1 py-2 px-3 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-medium text-xs transition-colors flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Link via Ayushman Card ({patient.abhaId})</span>
                            </button>
                            <button
                              onClick={() => onRequestAccess(patient)}
                              disabled={!!pendingReq}
                              className="py-2 px-3 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 text-slate-700 font-medium text-xs transition-colors cursor-pointer"
                            >
                              {pendingReq ? 'Request Pending' : 'Request Access'}
                            </button>
                          </div>
                          <button
                            onClick={() => {
                              onSelectPatient(patient.id);
                              setTopTab('chart');
                            }}
                            className="text-center text-[11px] text-slate-500 hover:text-slate-800 underline py-0.5 cursor-pointer"
                          >
                            Simulate Cross-Hospital Mismatch (403 Test)
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Patient Clinical Chart */}
      {topTab === 'chart' && selectedPatient && (
        <div className="space-y-6">
          {/* Patient Banner */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-bold text-slate-900">{selectedPatient.name}</h2>
                  <span className="text-xs px-2 py-0.5 rounded-md font-mono bg-slate-100 text-slate-700 border border-slate-200">
                    MRN: {selectedPatient.mrn}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-md font-mono bg-slate-100 text-slate-700 border border-slate-200">
                    ABHA: {selectedPatient.abhaId}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                  <span>{selectedPatient.age}y · {selectedPatient.gender}</span>
                  <span aria-hidden="true">·</span>
                  <span>DOB: {selectedPatient.dob}</span>
                  <span aria-hidden="true">·</span>
                  <span>Blood Group: {selectedPatient.bloodGroup}</span>
                  <span aria-hidden="true">·</span>
                  <span>Registered: {selectedPatient.hospitalName}</span>
                </div>
              </div>

              {/* Action Buttons based on role */}
              <div className="flex items-center space-x-2">
                {staff.role === 'lab_technician' ? (
                  <button
                    onClick={onOpenAddLabReport}
                    className="px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-medium text-xs transition-colors shadow-xs flex items-center space-x-1.5 cursor-pointer"
                  >
                    <FlaskConical className="w-3.5 h-3.5" />
                    <span>Add New Lab Report (Upload PDF)</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={onOpenAddEncounter}
                      className="px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-medium text-xs transition-colors shadow-xs flex items-center space-x-1.5 cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>New Consultation</span>
                    </button>
                    {onOpenAddLabReport && (
                      <button
                        onClick={onOpenAddLabReport}
                        className="px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
                      >
                        <FlaskConical className="w-3.5 h-3.5 text-teal-700" />
                        <span>Add Lab Report</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Diagnoses & Allergies */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-900 block mb-1">Active Diagnoses:</span>
                <span className="text-slate-700">{selectedPatient.chronicConditions.join(' · ') || 'None recorded'}</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/60">
                <span className="font-semibold text-amber-900 block mb-1">Documented Allergies:</span>
                <span className="text-amber-950 font-medium">{selectedPatient.allergies.join(' · ') || 'None recorded'}</span>
              </div>
            </div>
          </div>

          {/* Clean 4-Workflow Tabs as requested */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-white border border-slate-200 rounded-xl shadow-xs">
            {/* 1. Clinical Timeline */}
            <button
              onClick={() => setChartSubTab('timeline')}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                chartSubTab === 'timeline'
                  ? 'bg-teal-700 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Clinical Timeline ({patientRecords.length})
            </button>

            {/* 2. Consultation Details */}
            <button
              onClick={() => setChartSubTab('consultations')}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                chartSubTab === 'consultations'
                  ? 'bg-teal-700 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Consultation Details ({consultationRecords.length})
            </button>

            {/* 3. Lab Reports & Verification */}
            <button
              onClick={() => setChartSubTab('labs')}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                chartSubTab === 'labs'
                  ? 'bg-teal-700 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lab Reports & AI Summary ({labRecords.length})
            </button>

            {/* 4. Document Verification */}
            <button
              onClick={() => setChartSubTab('verify_queue')}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 ${
                chartSubTab === 'verify_queue'
                  ? 'bg-teal-700 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Document Verification</span>
              {unverifiedRecords.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                  {unverifiedRecords.length}
                </span>
              )}
            </button>
          </div>

          {/* SUB-TAB 1: Clinical Timeline */}
          {chartSubTab === 'timeline' && (
            <div className="space-y-4">
              {patientRecords.map((rec) => (
                <div
                  key={rec.id}
                  className={`bg-white border rounded-xl p-5 shadow-xs transition-colors ${
                    rec.isDisputed ? 'border-rose-200 bg-rose-50/20' : 'border-slate-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-1">
                        <span className="font-semibold text-slate-800">{rec.encounterDate}</span>
                        <span aria-hidden="true">·</span>
                        <span>{rec.hospitalName}</span>
                        <span aria-hidden="true">·</span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                          {rec.type}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-medium text-slate-700">
                          {rec.sourceCategory === 'INSTITUTIONAL' ? 'Institutional EHR' : rec.sourceCategory === 'PATIENT_UPLOADED' ? 'Patient Upload' : 'Patient Recall'}
                        </span>
                      </div>

                      <h3 className="text-base font-semibold text-slate-900">{rec.title}</h3>
                      <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
                        <span>Author: {rec.authorStaffName} ({rec.authorRole})</span>
                        {rec.type === 'CONSULTATION' && (
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium border border-slate-200 text-[11px]">
                            Immutable Clinical Note (Read-Only)
                          </span>
                        )}
                        {rec.originalDocumentName && (
                          <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-800 font-mono text-[11px] border border-teal-200">
                            {rec.originalDocumentName}
                          </span>
                        )}
                      </div>

                      {rec.diagnosis && (
                        <div className="mt-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 inline-block">
                          <strong>Diagnosis: </strong>{rec.diagnosis}
                        </div>
                      )}

                      <div className="mt-2 text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                        {rec.clinicalNotes}
                      </div>

                      {/* Prescriptions */}
                      {rec.prescriptions && rec.prescriptions.length > 0 && (
                        <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                          <strong className="text-slate-900 block mb-1">Prescribed Medicines:</strong>
                          {rec.prescriptions.map((p, idx) => (
                            <div key={idx} className="text-slate-700">
                              {p.medicineName} — {p.dosage} · {p.frequency} · {p.duration}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Lab results quick summary */}
                      {rec.labResults && rec.labResults.length > 0 && (
                        <div className="mt-3 p-3 bg-teal-50/40 rounded-lg border border-teal-100 text-xs space-y-1">
                          <div className="flex items-center justify-between mb-1">
                            <strong className="text-slate-900">Lab Results ({rec.labResults.length} parameters):</strong>
                            <button
                              onClick={() => {
                                setSelectedLabDocForPreview(rec);
                                setLabPreviewTab('ai_summary');
                              }}
                              className="text-teal-800 hover:underline font-medium text-[11px] flex items-center space-x-1 cursor-pointer"
                            >
                              <Eye className="w-3 h-3 text-teal-700" />
                              <span>View AI Summary & Original PDF</span>
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {rec.labResults.map((item, idx) => (
                              <span
                                key={idx}
                                className={`px-2 py-1 rounded text-[11px] border font-mono ${
                                  item.isAbnormal || item.flag === 'HIGH' || item.flag === 'LOW'
                                    ? 'bg-rose-50 border-rose-200 text-rose-800 font-bold'
                                    : 'bg-white border-slate-200 text-slate-700'
                                }`}
                              >
                                {item.testName}: {item.value} {item.unit}
                                {item.flag === 'HIGH' && ' [HIGH]'}
                                {item.flag === 'LOW' && ' [LOW]'}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Dispute status */}
                      {rec.isDisputed && (
                        <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-900">
                          <strong>Patient Dispute: </strong>{rec.activeDispute?.reason || rec.disputeNotes}
                        </div>
                      )}
                    </div>

                    <div className="flex sm:flex-col items-end gap-2 shrink-0 pt-2 sm:pt-0">
                      {/* CRITICAL: Lab staff CANNOT add addenda */}
                      {staff.role !== 'lab_technician' && (
                        <button
                          onClick={() => onOpenAddendumModal(rec)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium transition-colors cursor-pointer flex items-center space-x-1.5"
                        >
                          <FileEdit className="w-3.5 h-3.5" />
                          <span>Add Addendum</span>
                        </button>
                      )}

                      {rec.addenda && rec.addenda.length > 0 && (
                        <button
                          onClick={() => onOpenRecordHistory(rec)}
                          className="text-[11px] text-teal-800 hover:underline cursor-pointer"
                        >
                          View History ({rec.addenda.length} Addenda)
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SUB-TAB 2: Consultation Details */}
          {chartSubTab === 'consultations' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Physician Consultation Notes</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Chronological consultation records. Note: Existing consultations created by prior physicians cannot be edited to maintain tamper-evident legal medical records.
                  </p>
                </div>
                {staff.role !== 'lab_technician' && (
                  <button
                    onClick={onOpenAddEncounter}
                    className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-medium text-xs transition-colors shadow-xs flex items-center space-x-1.5 cursor-pointer shrink-0"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>New Consultation</span>
                  </button>
                )}
              </div>

              {consultationRecords.length > 0 ? (
                consultationRecords.map((rec) => (
                  <div key={rec.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-slate-900 text-sm">{rec.title}</h4>
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                            Immutable Consultation Note (Read-Only)
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-slate-700">{rec.encounterDate}</span>
                          <span>·</span>
                          <span>Attending Doctor: <strong>{rec.authorStaffName}</strong> ({rec.authorRole})</span>
                          <span>·</span>
                          <span>{rec.hospitalName}</span>
                        </div>
                      </div>

                      {staff.role !== 'lab_technician' && (
                        <button
                          onClick={() => onOpenAddendumModal(rec)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium transition-colors cursor-pointer flex items-center space-x-1 shrink-0 self-start sm:self-auto"
                        >
                          <FileEdit className="w-3.5 h-3.5" />
                          <span>Add Signed Addendum</span>
                        </button>
                      )}
                    </div>

                    {rec.diagnosis && (
                      <div className="text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 inline-block text-slate-800">
                        <strong>Diagnosis / Assessment: </strong>{rec.diagnosis}
                      </div>
                    )}

                    <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                      {rec.clinicalNotes}
                    </div>

                    {rec.prescriptions && rec.prescriptions.length > 0 && (
                      <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-2">
                        <div className="font-semibold text-slate-900 flex items-center space-x-1.5">
                          <Pill className="w-3.5 h-3.5 text-teal-700" />
                          <span>Prescribed Medications & Timings:</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {rec.prescriptions.map((p, idx) => (
                            <div key={idx} className="p-2 rounded-lg bg-slate-50 border border-slate-200/80">
                              <div className="font-bold text-slate-900">{p.medicineName}</div>
                              <div className="text-[11px] text-slate-600 mt-0.5">
                                Dosage: <strong>{p.dosage}</strong> · Timing: {p.frequency}
                              </div>
                              <div className="text-[11px] text-slate-500">
                                Duration: {p.duration} {p.instructions ? `· ${p.instructions}` : ''}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg flex items-center space-x-1.5">
                      <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>Tamper-Evident Medical Record: Previous consultations of other doctors cannot be altered.</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-xs text-slate-500">
                  No consultation notes on file for this patient. Click "New Consultation" above to add the first encounter note.
                </div>
              )}
            </div>
          )}

          {/* SUB-TAB 3: Lab Reports & AI Summaries (With Original PDF Viewer) */}
          {chartSubTab === 'labs' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Laboratory Investigations & AI Outlier Analysis</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Lab technicians can upload PDF test reports, and AI automatically flags High / Low / Critical parameters. Doctors can view both the AI summary and the original PDF.
                  </p>
                </div>

                <button
                  onClick={onOpenAddLabReport}
                  className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-medium text-xs transition-colors shadow-xs flex items-center space-x-1.5 cursor-pointer shrink-0"
                >
                  <FlaskConical className="w-3.5 h-3.5" />
                  <span>Add New Lab Report (Upload PDF)</span>
                </button>
              </div>

              {labRecords.length > 0 ? (
                labRecords.map((rec) => {
                  const abnormalItems = (rec.labResults || []).filter(
                    r => r.isAbnormal || r.flag === 'HIGH' || r.flag === 'LOW' || r.flag === 'CRITICAL'
                  );

                  return (
                    <div key={rec.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3.5">
                      {/* Card Header */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-bold text-slate-900 text-sm">{rec.title}</h4>
                            {abnormalItems.length > 0 ? (
                              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 border border-rose-200 text-rose-800 flex items-center space-x-1">
                                <AlertTriangle className="w-3 h-3 text-rose-600" />
                                <span>{abnormalItems.length} Abnormal Values Detected</span>
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center space-x-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>All Values Normal</span>
                              </span>
                            )}
                          </div>

                          <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-slate-700">{rec.encounterDate}</span>
                            <span>·</span>
                            <span>Lab: {rec.hospitalName}</span>
                            <span>·</span>
                            <span>Analyst: <strong>{rec.authorStaffName}</strong></span>
                            {rec.originalDocumentName && (
                              <>
                                <span>·</span>
                                <span className="font-mono text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 text-[11px]">
                                  {rec.originalDocumentName}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Interactive View Button for Doctor / Technician */}
                        <button
                          onClick={() => {
                            setSelectedLabDocForPreview(rec);
                            setLabPreviewTab('ai_summary');
                          }}
                          className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-900 font-semibold text-xs transition-colors cursor-pointer flex items-center space-x-1.5 shrink-0 shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5 text-teal-700" />
                          <span>View AI Summary & Original PDF</span>
                        </button>
                      </div>

                      {/* AI Diagnostic Highlights */}
                      <div className="p-3.5 rounded-xl bg-teal-50/50 border border-teal-100 text-xs space-y-1.5">
                        <div className="font-semibold text-teal-900 flex items-center space-x-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                          <span>AI Outlier & High/Low Synthesis:</span>
                        </div>
                        <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                          {rec.aiLabSummary || rec.clinicalNotes}
                        </p>
                      </div>

                      {/* Parameters Table with High/Low Flagging */}
                      {rec.labResults && rec.labResults.length > 0 && (
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs text-left">
                            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                              <tr>
                                <th className="py-2 px-3">Test Parameter</th>
                                <th className="py-2 px-3">Observed Value</th>
                                <th className="py-2 px-3">Reference Interval</th>
                                <th className="py-2 px-3 text-right">Interpretation Flag</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {rec.labResults.map((item, idx) => {
                                const isHigh = item.flag === 'HIGH';
                                const isLow = item.flag === 'LOW';
                                const isAbnormal = isHigh || isLow || item.isAbnormal;

                                return (
                                  <tr
                                    key={idx}
                                    className={
                                      isHigh
                                        ? 'bg-rose-50/40 text-rose-950 font-medium'
                                        : isLow
                                        ? 'bg-amber-50/40 text-amber-950 font-medium'
                                        : 'text-slate-800'
                                    }
                                  >
                                    <td className="py-2 px-3 font-medium">{item.testName}</td>
                                    <td className="py-2 px-3 font-bold font-mono">
                                      {item.value} {item.unit}
                                    </td>
                                    <td className="py-2 px-3 text-slate-500 font-mono text-[11px]">
                                      {item.referenceRange}
                                    </td>
                                    <td className="py-2 px-3 text-right">
                                      {isHigh && (
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white">
                                          HIGH
                                        </span>
                                      )}
                                      {isLow && (
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white">
                                          LOW
                                        </span>
                                      )}
                                      {!isAbnormal && (
                                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-800">
                                          NORMAL
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-xs text-slate-500">
                  No laboratory investigation reports recorded yet. Click "Add New Lab Report" to upload a test PDF.
                </div>
              )}
            </div>
          )}

          {/* SUB-TAB 4: Verification Queue */}
          {chartSubTab === 'verify_queue' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Document Verification Queue</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Review unverified patient uploads and AI-extracted clinical records before physician verification.
                </p>
              </div>

              {unverifiedRecords.length > 0 ? (
                <div className="space-y-3">
                  {unverifiedRecords.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-4 rounded-xl border border-amber-200 bg-amber-50/20 text-xs flex flex-col md:flex-row md:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center space-x-2 text-slate-500 mb-1">
                          <span className="font-semibold text-slate-800">{rec.encounterDate}</span>
                          <span>·</span>
                          <span>Source: {rec.hospitalName}</span>
                          <span>·</span>
                          <span className="text-amber-800 font-medium">Awaiting Physician Endorsement</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm">{rec.title}</h4>
                        <p className="text-slate-600 mt-1">{rec.clinicalNotes}</p>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0 self-end md:self-auto">
                        {/* Lab staff cannot add addenda */}
                        {staff.role !== 'lab_technician' && (
                          <button
                            onClick={() => onOpenAddendumModal(rec)}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors cursor-pointer"
                          >
                            Add Addendum
                          </button>
                        )}
                        <button
                          onClick={() => onVerifyRecord(rec.id)}
                          className="px-3.5 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-medium text-xs transition-colors shadow-xs cursor-pointer flex items-center space-x-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Endorse as Verified</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No records currently awaiting review.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* VIEW 3: Audit Trail Log */}
      {topTab === 'audit' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-1">Hospital Clinical Audit Trail</h2>
          <p className="text-xs text-slate-500 mb-4">
            Immutable, append-only log of all chart views, security checks, and cross-hospital access events.
          </p>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden max-h-[600px] overflow-y-auto">
            {auditLogs.slice(0, 25).map((audit) => (
              <div key={audit.id} className="p-3.5 text-xs bg-white hover:bg-slate-50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-slate-500 mb-1 gap-1">
                  <span className="font-semibold text-slate-700">
                    {new Date(audit.timestamp).toLocaleString()}
                  </span>
                  <span className="font-mono text-[11px] text-slate-500">
                    {audit.endpoint}
                  </span>
                </div>
                <div className="text-slate-800 font-medium">
                  {audit.actorName} ({audit.actorRole}) · {audit.hospitalName}
                </div>
                <div className="text-slate-600 text-[11px] mt-1">
                  {audit.details}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: Doctor & Technician "View AI Summary & Original PDF Report" */}
      {selectedLabDocForPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedLabDocForPreview.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Facility: <span className="font-semibold text-slate-700">{selectedLabDocForPreview.hospitalName}</span> · Date: {selectedLabDocForPreview.encounterDate}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLabDocForPreview(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Toggle between AI Diagnostic Summary & Original PDF View */}
            <div className="mt-4 flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs">
              <button
                onClick={() => setLabPreviewTab('ai_summary')}
                className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-1.5 ${
                  labPreviewTab === 'ai_summary'
                    ? 'bg-white text-teal-900 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-4 h-4 text-teal-700" />
                <span>AI Clinical Summary & Outliers</span>
              </button>
              <button
                onClick={() => setLabPreviewTab('original_pdf')}
                className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-1.5 ${
                  labPreviewTab === 'original_pdf'
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileCode className="w-4 h-4 text-slate-600" />
                <span>Original Laboratory PDF Document</span>
              </button>
            </div>

            {/* TAB A: AI Clinical Summary & Outliers */}
            {labPreviewTab === 'ai_summary' && (
              <div className="mt-5 space-y-4">
                <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-xs space-y-2">
                  <div className="flex items-center space-x-1.5 font-bold text-teal-900 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-teal-700" />
                    <span>AI Diagnostic Synthesis & High/Low Flags</span>
                  </div>
                  <p className="text-slate-800 whitespace-pre-line leading-relaxed">
                    {selectedLabDocForPreview.aiLabSummary || selectedLabDocForPreview.clinicalNotes}
                  </p>
                </div>

                {/* Table with Flags */}
                {selectedLabDocForPreview.labResults && selectedLabDocForPreview.labResults.length > 0 && (
                  <div>
                    <h5 className="font-semibold text-slate-900 text-xs mb-2">
                      Test Parameter Analysis ({selectedLabDocForPreview.labResults.length} parameters):
                    </h5>
                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                          <tr>
                            <th className="py-2.5 px-3">Parameter</th>
                            <th className="py-2.5 px-3">Result</th>
                            <th className="py-2.5 px-3">Reference Range</th>
                            <th className="py-2.5 px-3 text-right">Flag</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {selectedLabDocForPreview.labResults.map((item, idx) => {
                            const isHigh = item.flag === 'HIGH';
                            const isLow = item.flag === 'LOW';
                            const isAbnormal = isHigh || isLow || item.isAbnormal;

                            return (
                              <tr
                                key={idx}
                                className={
                                  isHigh
                                    ? 'bg-rose-50/50 text-rose-950 font-medium'
                                    : isLow
                                    ? 'bg-amber-50/50 text-amber-950 font-medium'
                                    : 'text-slate-800'
                                }
                              >
                                <td className="py-2 px-3 font-medium">{item.testName}</td>
                                <td className="py-2 px-3 font-bold font-mono">
                                  {item.value} {item.unit}
                                </td>
                                <td className="py-2 px-3 text-slate-500 font-mono text-[11px]">
                                  {item.referenceRange}
                                </td>
                                <td className="py-2 px-3 text-right">
                                  {isHigh && (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white">
                                      HIGH
                                    </span>
                                  )}
                                  {isLow && (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white">
                                      LOW
                                    </span>
                                  )}
                                  {!isAbnormal && (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-800">
                                      NORMAL
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB B: Original PDF Document View */}
            {labPreviewTab === 'original_pdf' && (
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div className="flex items-center space-x-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>File: <strong className="font-mono text-slate-800">{selectedLabDocForPreview.originalDocumentName || 'laboratory_investigation_report.pdf'}</strong></span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-medium border border-emerald-200">
                    NABL / CAP Certified LIMS Archive
                  </span>
                </div>

                {/* Styled Original PDF Sheet */}
                <div className="p-6 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto shadow-inner leading-relaxed">
                  <pre className="whitespace-pre-wrap font-mono">
                    {selectedLabDocForPreview.pdfContentText || 
`================================================================================
${selectedLabDocForPreview.hospitalName.toUpperCase()} - CENTRAL DIAGNOSTIC PATHOLOGY
Branch: Main Clinical Pathology Center | Quality Assurance Certified
--------------------------------------------------------------------------------
PATIENT NAME    : ${selectedPatient?.name || 'Patient Chart'}
MRN / PATIENT ID: ${selectedPatient?.mrn || 'N/A'}
ENCOUNTER DATE  : ${selectedLabDocForPreview.encounterDate}
SOURCE SYSTEM   : ${selectedLabDocForPreview.sourceSystemName}
DOCUMENT ARCHIVE: ${selectedLabDocForPreview.originalDocumentName || 'lims_lab_report.pdf'}
--------------------------------------------------------------------------------
INVESTIGATION PARAMETERS:
${(selectedLabDocForPreview.labResults || []).map(r => 
  `${r.testName.padEnd(30, ' ')} ${r.value.padStart(6, ' ')} ${r.unit.padEnd(8, ' ')} [Ref: ${r.referenceRange}] ${r.flag ? `*${r.flag}*` : (r.isAbnormal ? '*ABNORMAL*' : 'Normal')}`
).join('\n')}
--------------------------------------------------------------------------------
CLINICAL NOTES:
${selectedLabDocForPreview.clinicalNotes}
--------------------------------------------------------------------------------
VERIFIED BY: ${selectedLabDocForPreview.authorStaffName} (${selectedLabDocForPreview.authorRole})
STATUS     : ${selectedLabDocForPreview.verificationStatus}
================================================================================`}
                  </pre>
                </div>
              </div>
            )}

            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => setSelectedLabDocForPreview(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium transition-colors cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
