import React, { useState, useEffect, useTransition } from 'react';
import { HealthcareHeader } from './components/HealthcareHeader';
import { LandingPage } from './components/LandingPage';
import { PatientPortalView } from './components/PatientPortal/PatientPortalView';
import { ClinicianPortalView } from './components/ClinicianPortal/ClinicianPortalView';
import { DeveloperDiagnosticsModal } from './components/DeveloperDiagnosticsModal';

// Modals
import { AddEncounterModal } from './components/AddEncounterModal';
import { AddLabReportModal } from './components/AddLabReportModal';
import { ClinicianAddendumModal } from './components/ClinicianAddendumModal';
import { PatientDisputeModal } from './components/PatientDisputeModal';
import { RecordHistoryModal } from './components/RecordHistoryModal';
import { CreateAccessRequestModal } from './components/CreateAccessRequestModal';
import { AccessDeniedModal } from './components/AccessDeniedModal';

// Services
import { intraHospitalStore } from './services/intraHospitalService';
import { offlineSyncService } from './services/offlineSyncService';
import { cdsService } from './services/cdsService';
import { problemReconciliationService } from './services/problemReconciliationService';
import { medicationReconciliationService } from './services/medicationReconciliationService';
import { allergyService } from './services/allergyService';
import { labInvestigationService } from './services/labInvestigationService';

// Types
import { 
  StaffProfile, 
  PatientProfile, 
  MedicalRecord, 
  AuditEvent,
  AccessRequest,
  AccessGrant,
  RecordType,
  RecordDispute,
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
} from './types/caretrail';

export default function App() {
  const [, startTransition] = useTransition();

  // Navigation Mode: 'landing' | 'patient' | 'clinician'
  const [viewMode, setViewMode] = useState<'landing' | 'patient' | 'clinician'>('landing');

  // Registry data
  const allPatients = intraHospitalStore.getCrossHospitalRegistry();
  const allStaff = intraHospitalStore.getAllStaff();

  // Active Personas
  const [currentStaff, setCurrentStaff] = useState<StaffProfile>(intraHospitalStore.getCurrentStaff());
  const [activePatient, setActivePatient] = useState<PatientProfile>(allPatients[0]);

  // Scoped patients for active clinician
  const [scopedPatients, setScopedPatients] = useState<PatientProfile[]>(() => {
    const res = intraHospitalStore.searchStaffPatients('', currentStaff);
    return res.data || [];
  });

  // Selected patient in Clinician Chart
  const [selectedClinicianPatient, setSelectedClinicianPatient] = useState<PatientProfile | null>(allPatients[0]);
  const [clinicianChartRecords, setClinicianChartRecords] = useState<MedicalRecord[]>(() => {
    return intraHospitalStore.getRecordsForPatient(allPatients[0].id);
  });

  // Patient's own records (Patient Portal)
  const [patientPortalRecords, setPatientPortalRecords] = useState<MedicalRecord[]>(() => {
    return intraHospitalStore.getRecordsForPatient(activePatient.id);
  });

  // Requests, Grants, Audits
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>(() => intraHospitalStore.getAccessRequests());
  const [accessGrants, setAccessGrants] = useState<AccessGrant[]>(() => intraHospitalStore.getAccessGrants());
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>(() => intraHospitalStore.getAuditEvents());

  // Offline simulation state
  const [isOffline, setIsOffline] = useState<boolean>(() => !offlineSyncService.isOnline());
  const [pendingOfflineCount, setPendingOfflineCount] = useState<number>(() => offlineSyncService.getPendingCount());

  // Modal Visibility states
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);
  const [isAddEncounterOpen, setIsAddEncounterOpen] = useState(false);
  const [isAddLabReportOpen, setIsAddLabReportOpen] = useState(false);
  const [isAddendumOpen, setIsAddendumOpen] = useState(false);
  const [recordForAddendum, setRecordForAddendum] = useState<MedicalRecord | null>(null);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [recordForDispute, setRecordForDispute] = useState<MedicalRecord | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [recordForHistory, setRecordForHistory] = useState<MedicalRecord | null>(null);
  const [isAccessRequestModalOpen, setIsAccessRequestModalOpen] = useState(false);
  const [patientForAccessRequest, setPatientForAccessRequest] = useState<PatientProfile | null>(null);
  const [isDeniedModalOpen, setIsDeniedModalOpen] = useState(false);
  const [deniedPatient, setDeniedPatient] = useState<PatientProfile | null>(null);
  const [denialMessage, setDenialMessage] = useState('');

  // Clinical Assessments for Clinician View
  const [cdsAssessment, setCdsAssessment] = useState<PatientCdsAssessment | null>(null);
  const [lastSimulationResult, setLastSimulationResult] = useState<CdsSimulationResult | null>(null);
  const [problemAssessment, setProblemAssessment] = useState<ProblemReconciliationAssessment | null>(null);
  const [medicationAssessment, setMedicationAssessment] = useState<MedicationReconciliationAssessment | null>(null);
  const [allergyAssessment, setAllergyAssessment] = useState<AllergyAssessment | null>(null);
  const [labAssessment, setLabAssessment] = useState<LabInvestigationAssessment | null>(null);

  // Sync records when active patient in Patient Portal changes
  useEffect(() => {
    setPatientPortalRecords(intraHospitalStore.getRecordsForPatient(activePatient.id));
  }, [activePatient]);

  // Recalculate Clinical Assessments whenever selected clinician patient changes
  useEffect(() => {
    if (selectedClinicianPatient) {
      const records = intraHospitalStore.getRecordsForPatient(selectedClinicianPatient.id);
      setClinicianChartRecords(records);

      try {
        const cds = cdsService.evaluatePatientSafety(selectedClinicianPatient, records);
        setCdsAssessment(cds);

        const prob = problemReconciliationService.reconcilePatientProblems(selectedClinicianPatient, records);
        setProblemAssessment(prob);

        const med = medicationReconciliationService.reconcilePatientMedications(selectedClinicianPatient, records);
        setMedicationAssessment(med);

        const allg = allergyService.reconcilePatientAllergies(selectedClinicianPatient, records);
        setAllergyAssessment(allg);

        const lab = labInvestigationService.reconcilePatientLabs(selectedClinicianPatient, records);
        setLabAssessment(lab);
      } catch (e) {
        console.error('Error running clinical assessments:', e);
      }
    }
  }, [selectedClinicianPatient, currentStaff]);

  // Refresh all state from intraHospitalStore
  const refreshAllState = () => {
    setPatientPortalRecords(intraHospitalStore.getRecordsForPatient(activePatient.id));
    if (selectedClinicianPatient) {
      setClinicianChartRecords(intraHospitalStore.getRecordsForPatient(selectedClinicianPatient.id));
    }
    const res = intraHospitalStore.searchStaffPatients('', currentStaff);
    setScopedPatients(res.data || []);
    setAccessRequests([...intraHospitalStore.getAccessRequests()]);
    setAccessGrants([...intraHospitalStore.getAccessGrants()]);
    setAuditLogs([...intraHospitalStore.getAuditEvents()]);
  };

  // Switch Staff Persona
  const handleSelectStaff = (staffId: string) => {
    startTransition(() => {
      const updated = intraHospitalStore.setCurrentStaff(staffId);
      setCurrentStaff(updated);
      const res = intraHospitalStore.searchStaffPatients('', updated);
      setScopedPatients(res.data || []);
      setAuditLogs([...intraHospitalStore.getAuditEvents()]);
    });
  };

  // Switch Patient Persona (Patient Portal)
  const handleSelectPatientPersona = (patientId: string) => {
    const found = allPatients.find(p => p.id === patientId);
    if (found) {
      setActivePatient(found);
      setPatientPortalRecords(intraHospitalStore.getRecordsForPatient(found.id));
    }
  };

  // Clinician selects patient for chart
  const handleClinicianSelectPatient = (patientId: string) => {
    const res = intraHospitalStore.getPatientChart(patientId, currentStaff);
    setAuditLogs([...intraHospitalStore.getAuditEvents()]);

    if (res.status === 200 && res.data) {
      setSelectedClinicianPatient(res.data.patient);
      setClinicianChartRecords(res.data.records);
    } else if (res.status === 403) {
      const deniedPat = allPatients.find(p => p.id === patientId) || null;
      setDeniedPatient(deniedPat);
      setDenialMessage(res.message || 'Access Denied: Cross-hospital facility mismatch without patient consent.');
      setIsDeniedModalOpen(true);
    }
  };

  // Link cross-hospital patient via Ayushman Card (ABHA) / FHIR Exchange
  const handleLinkCrossHospitalViaAbha = (patient: PatientProfile) => {
    intraHospitalStore.linkCrossHospitalViaAbha(patient.id, currentStaff);
    refreshAllState();
    handleClinicianSelectPatient(patient.id);
  };

  // Patient Document Upload handler
  const handlePatientUpload = (docData: {
    title: string;
    fileName: string;
    encounterDate: string;
    facilityName: string;
    type: RecordType;
    extractedSnippet: string;
    clinicalNotes: string;
    prescriptions?: MedicalRecord['prescriptions'];
    labResults?: MedicalRecord['labResults'];
  }) => {
    intraHospitalStore.addPatientUploadedRecord(activePatient.id, docData);
    refreshAllState();
  };

  // Patient Dispute submission handler
  const handlePatientSubmitDispute = (
    recordId: string,
    disputeData: {
      disputeType: RecordDispute['disputeType'];
      reason: string;
      requestedCorrection?: string;
    }
  ) => {
    intraHospitalStore.submitRecordDispute(recordId, activePatient.id, disputeData);
    refreshAllState();
  };

  // Clinician Addendum submission handler
  const handleClinicianSubmitAddendum = (
    recordId: string,
    addendumData: {
      reason: string;
      addendumNotes: string;
      correctedDiagnosis?: string;
      correctedNotes?: string;
      associatedDisputeId?: string;
    }
  ) => {
    intraHospitalStore.addRecordAddendum(recordId, addendumData, currentStaff);
    refreshAllState();
  };

  // Clinician Verification handler
  const handleClinicianVerifyRecord = (recordId: string) => {
    intraHospitalStore.verifyRecord(recordId, currentStaff);
    refreshAllState();
  };

  // Access Request & Consent handlers
  const handleOpenAccessRequestModal = (patient: PatientProfile) => {
    setPatientForAccessRequest(patient);
    setIsAccessRequestModalOpen(true);
  };

  const handleSubmitAccessRequest = (options: {
    purpose: string;
    scope: string[];
    dateRange: string;
    expiryDays: number;
  }) => {
    if (!patientForAccessRequest) return;
    intraHospitalStore.createAccessRequest(patientForAccessRequest.id, options, currentStaff);
    refreshAllState();
    setIsAccessRequestModalOpen(false);
  };

  const handleApproveConsentRequest = (requestId: string, expiryDays: number) => {
    intraHospitalStore.approveAccessRequest(requestId, expiryDays);
    refreshAllState();
  };

  const handleRejectConsentRequest = (requestId: string, reason: string) => {
    intraHospitalStore.rejectAccessRequest(requestId, reason);
    refreshAllState();
  };

  const handleRevokeConsentGrant = (grantId: string, reason: string) => {
    intraHospitalStore.revokeAccessGrant(grantId, reason);
    refreshAllState();
  };

  // Network / Offline Toggle
  const handleToggleOffline = () => {
    const next = !isOffline;
    offlineSyncService.setSimulatedOffline(next, currentStaff);
    setIsOffline(next);
    setPendingOfflineCount(offlineSyncService.getPendingCount());
    setAuditLogs([...intraHospitalStore.getAuditEvents()]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col justify-between">
      <div>
        {/* Universal Clean Healthcare Header */}
        <HealthcareHeader
          currentMode={viewMode}
          onNavigateMode={setViewMode}
          activePatient={activePatient}
          allPatients={allPatients}
          onSelectPatient={handleSelectPatientPersona}
          activeStaff={currentStaff}
          allStaff={allStaff}
          onSelectStaff={handleSelectStaff}
          isOffline={isOffline}
          onToggleOffline={handleToggleOffline}
          pendingOfflineCount={pendingOfflineCount}
          onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
          auditCount={auditLogs.length}
        />

        {/* View Mode Router */}
        <main>
          {viewMode === 'landing' && (
            <LandingPage
              onSelectPatientMode={(pid) => {
                if (pid) handleSelectPatientPersona(pid);
                setViewMode('patient');
              }}
              onSelectClinicianMode={(sid) => {
                if (sid) handleSelectStaff(sid);
                setViewMode('clinician');
              }}
              patients={allPatients}
              staffMembers={allStaff}
              onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
              onPatientRegistered={(newPat) => {
                refreshAllState();
                setActivePatient(newPat);
                setViewMode('patient');
              }}
              onStaffRegistered={(newStaff) => {
                refreshAllState();
                setCurrentStaff(newStaff);
                setViewMode('clinician');
              }}
            />
          )}

          {viewMode === 'patient' && (
            <PatientPortalView
              patient={activePatient}
              records={patientPortalRecords}
              accessRequests={accessRequests}
              accessGrants={accessGrants}
              auditLogs={auditLogs}
              onUploadDocument={handlePatientUpload}
              onOpenDisputeModal={(rec) => {
                setRecordForDispute(rec);
                setIsDisputeModalOpen(true);
              }}
              onOpenRecordHistory={(rec) => {
                setRecordForHistory(rec);
                setIsHistoryModalOpen(true);
              }}
              onApproveRequest={handleApproveConsentRequest}
              onRejectRequest={handleRejectConsentRequest}
              onRevokeGrant={handleRevokeConsentGrant}
            />
          )}

          {viewMode === 'clinician' && (
            <ClinicianPortalView
              staff={currentStaff}
              patients={scopedPatients}
              allPatients={allPatients}
              selectedPatient={selectedClinicianPatient}
              onSelectPatient={handleClinicianSelectPatient}
              patientRecords={clinicianChartRecords}
              accessRequests={accessRequests}
              accessGrants={accessGrants}
              auditLogs={auditLogs}
              onRequestAccess={handleOpenAccessRequestModal}
              onOpenAddEncounter={() => setIsAddEncounterOpen(true)}
              onOpenAddLabReport={() => setIsAddLabReportOpen(true)}
              onLinkCrossHospitalViaAbha={handleLinkCrossHospitalViaAbha}
              onOpenAddendumModal={(rec) => {
                setRecordForAddendum(rec);
                setIsAddendumOpen(true);
              }}
              onOpenRecordHistory={(rec) => {
                setRecordForHistory(rec);
                setIsHistoryModalOpen(true);
              }}
              onVerifyRecord={handleClinicianVerifyRecord}
              // Clinical engines
              cdsAssessment={cdsAssessment}
              problemAssessment={problemAssessment}
              medicationAssessment={medicationAssessment}
              allergyAssessment={allergyAssessment}
              labAssessment={labAssessment}
            />
          )}
        </main>
      </div>

      {/* Footer with Subtle Developer Diagnostics Access */}
      <footer className="border-t border-slate-200 bg-white py-5 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div>
            CareTrail · Clean Healthcare Records & Cross-Facility Provenance
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsDiagnosticsOpen(true)}
              className="text-slate-600 hover:text-slate-900 underline transition-colors cursor-pointer"
            >
              Developer Diagnostics & Test Suite
            </button>
            <span>·</span>
            <span>Synthetic Demonstration Mode</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Developer Diagnostics Modal */}
      <DeveloperDiagnosticsModal
        isOpen={isDiagnosticsOpen}
        onClose={() => setIsDiagnosticsOpen(false)}
        auditLogs={auditLogs}
      />

      {/* 2. Add Encounter Modal */}
      {selectedClinicianPatient && (
        <AddEncounterModal
          isOpen={isAddEncounterOpen}
          onClose={() => setIsAddEncounterOpen(false)}
          patient={selectedClinicianPatient}
          staff={currentStaff}
          onAddEncounter={(data) => {
            intraHospitalStore.appendEncounter(selectedClinicianPatient.id, data, currentStaff);
            refreshAllState();
            setIsAddEncounterOpen(false);
          }}
        />
      )}

      {/* 2b. Add Lab Report Modal (Lab Technician Workflow) */}
      {selectedClinicianPatient && (
        <AddLabReportModal
          isOpen={isAddLabReportOpen}
          onClose={() => setIsAddLabReportOpen(false)}
          patient={selectedClinicianPatient}
          staff={currentStaff}
          onAddLabReport={(data) => {
            intraHospitalStore.appendLabReport(selectedClinicianPatient.id, data, currentStaff);
            refreshAllState();
            setIsAddLabReportOpen(false);
          }}
        />
      )}

      {/* 3. Clinician Addendum Modal */}
      <ClinicianAddendumModal
        isOpen={isAddendumOpen}
        onClose={() => {
          setIsAddendumOpen(false);
          setRecordForAddendum(null);
        }}
        record={recordForAddendum}
        staff={currentStaff}
        onSubmitAddendum={(recId, addendumData) => {
          handleClinicianSubmitAddendum(recId, addendumData);
          setIsAddendumOpen(false);
          setRecordForAddendum(null);
        }}
      />

      {/* 4. Patient Dispute Modal */}
      <PatientDisputeModal
        isOpen={isDisputeModalOpen}
        onClose={() => {
          setIsDisputeModalOpen(false);
          setRecordForDispute(null);
        }}
        record={recordForDispute}
        patient={activePatient}
        onSubmitDispute={(recId, disputeData) => {
          handlePatientSubmitDispute(recId, disputeData);
          setIsDisputeModalOpen(false);
          setRecordForDispute(null);
        }}
      />

      {/* 5. Record History & Addenda Lineage Modal */}
      <RecordHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => {
          setIsHistoryModalOpen(false);
          setRecordForHistory(null);
        }}
        record={recordForHistory}
      />

      {/* 6. Create Cross-Hospital Access Request Modal */}
      {patientForAccessRequest && (
        <CreateAccessRequestModal
          isOpen={isAccessRequestModalOpen}
          onClose={() => {
            setIsAccessRequestModalOpen(false);
            setPatientForAccessRequest(null);
          }}
          patient={patientForAccessRequest}
          staff={currentStaff}
          onSubmitRequest={handleSubmitAccessRequest}
        />
      )}

      {/* 7. Access Denied (HTTP 403) Security Boundary Modal */}
      <AccessDeniedModal
        isOpen={isDeniedModalOpen}
        onClose={() => setIsDeniedModalOpen(false)}
        staff={currentStaff}
        deniedPatient={deniedPatient}
        denialMessage={denialMessage}
        onRequestAccess={() => {
          if (deniedPatient) {
            setIsDeniedModalOpen(false);
            handleOpenAccessRequestModal(deniedPatient);
          }
        }}
        onOpenConsentPortal={() => {
          setIsDeniedModalOpen(false);
          if (deniedPatient) {
            handleSelectPatientPersona(deniedPatient.id);
            setViewMode('patient');
          }
        }}
        onOpenAudit={() => {
          setIsDeniedModalOpen(false);
          setIsDiagnosticsOpen(true);
        }}
        onOpenInspector={() => {
          setIsDeniedModalOpen(false);
          setIsDiagnosticsOpen(true);
        }}
      />
    </div>
  );
}
