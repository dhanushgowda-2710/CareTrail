import React, { useState } from 'react';
import {
  X,
  Play,
  CheckCircle2,
  ShieldCheck,
  UserCheck,
  FileText,
  UploadCloud,
  Sparkles,
  Lock,
  Unlock,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Terminal,
  Clock,
  Award,
  Layers,
  FileDown
} from 'lucide-react';
import { StaffProfile } from '../types/caretrail';

interface JudgeDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStaff: StaffProfile;
  onSelectPatient: (patientId: string) => void;
  onOpenAddRemembered: () => void;
  onOpenUploadDoc: () => void;
  onSwitchStaff: (staffId: string) => void;
  onOpenConsentPortal: () => void;
  onRequestConsent: () => void;
  onRevokeConsent: () => void;
  onGenerateSummary: () => void;
  onTestCitationClick: () => void;
  onTestCrossAccessBlock: () => void;
  onTestUploadValidation: () => void;
  onTestAbdmProbe: () => void;
  onOpenAuditLogs: () => void;
}

export const JudgeDemoModal: React.FC<JudgeDemoModalProps> = ({
  isOpen,
  onClose,
  currentStaff,
  onSelectPatient,
  onOpenAddRemembered,
  onOpenUploadDoc,
  onSwitchStaff,
  onOpenConsentPortal,
  onRequestConsent,
  onRevokeConsent,
  onGenerateSummary,
  onTestCitationClick,
  onTestCrossAccessBlock,
  onTestUploadValidation,
  onTestAbdmProbe,
  onOpenAuditLogs
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([1]);

  if (!isOpen) return null;

  const markStepDone = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
  };

  const steps = [
    {
      num: 1,
      title: 'Patient Sign-in & Horizontal Isolation',
      actor: 'Rajesh Kumar (PAT-RAJESH-KUMAR)',
      goal: 'Prove tenant isolation: patient sees only their own records; cross-patient read fails with 403.',
      description:
        'Patient Rajesh Kumar logs in and accesses his clinical records at Apollo Hospital. Cross-tenant access to another patient (Arvind Swamy) is strictly blocked by the server authorization layer.',
      expectedResult:
        'Apollo records display on timeline. Attempting to query Arvind Swamy returns HTTP 403 Forbidden with CROSS_PATIENT_ACCESS_DENIED audit log.',
      actions: [
        {
          label: '1. Select Rajesh Kumar Chart',
          run: () => {
            onSelectPatient('pat-rajesh-kumar');
            markStepDone(1);
          }
        },
        {
          label: '2. Test Cross-Patient 403 Block',
          run: () => {
            onTestCrossAccessBlock();
            markStepDone(1);
          }
        }
      ]
    },
    {
      num: 2,
      title: 'Add Remembered Event (Patient-Reported)',
      actor: 'Patient / Caregiver',
      goal: 'Add an unverified patient recollection with approximate date and PATIENT_REPORTED badge.',
      description:
        'Patients frequently recall episodes without exact medical dates. CareTrail allows approximate dates and preserves uncertainty, labeling the event PATIENT_REPORTED and AWAITING_REVIEW.',
      expectedResult:
        'Timeline event displays amber PATIENT_REPORTED badge. Event date is explicitly distinct from system upload timestamp.',
      actions: [
        {
          label: 'Open "Add Remembered Event" Form',
          run: () => {
            onClose();
            onOpenAddRemembered();
            markStepDone(2);
          }
        }
      ]
    },
    {
      num: 3,
      title: 'Document Upload & Split-Pane OCR Review',
      actor: 'Patient / Attending Staff',
      goal: 'Upload a clinical PDF, inspect candidate extractions, and edit before committing.',
      description:
        'Uploaded documents pass MIME and 15MB size gates. Extracted clinical fields remain in draft (AWAITING_REVIEW) beside the original document. No AI guessing is auto-promoted without review.',
      expectedResult:
        'Original PDF preview shown beside candidate fields. Reviewer approves or edits fields before committing to patient timeline.',
      actions: [
        {
          label: 'Open Document Ingestion Drawer',
          run: () => {
            onClose();
            onOpenUploadDoc();
            markStepDone(3);
          }
        }
      ]
    },
    {
      num: 4,
      title: 'Timeline Provenance & Source Linkage',
      actor: 'Attending Clinician',
      goal: 'Demonstrate that timeline events link back to original document hash and reviewer lineage.',
      description:
        'Every accepted timeline item contains a clickable deep link to the source document excerpt with file checksum and reviewer identity. Reprocessing avoids duplicate timeline entries.',
      expectedResult:
        'Clicking "[View Original Source]" opens the original excerpt drawer with cryptographic hash and author audit trail.',
      actions: [
        {
          label: 'Inspect Active Timeline Lineage',
          run: () => {
            onSelectPatient('pat-rajesh-kumar');
            onClose();
            markStepDone(4);
          }
        }
      ]
    },
    {
      num: 5,
      title: 'Cross-Facility Access & Patient Consent',
      actor: 'Dr. Vikram Sengupta (Manipal) + Rajesh Kumar',
      goal: 'Demonstrate hospital boundary isolation: external doctor must obtain patient ABDM consent.',
      description:
        'Dr. Vikram Sengupta at Manipal Hospital cannot access Rajesh Kumar (Apollo) without permission. Dr. Vikram submits a time-bound access request. Rajesh reviews and approves it in the Patient Consent Portal.',
      expectedResult:
        'Dr. Vikram sees locked placeholder. Once approved in Patient Consent Portal, chart unlocks with active ABDM-GRANT-7821 badge.',
      actions: [
        {
          label: '1. Switch to Dr. Vikram (Manipal)',
          run: () => {
            onSwitchStaff('staff-vikram');
            markStepDone(5);
          }
        },
        {
          label: '2. Request ABDM Access Grant',
          run: () => {
            onRequestConsent();
            markStepDone(5);
          }
        },
        {
          label: '3. Open Patient Consent Portal',
          run: () => {
            onClose();
            onOpenConsentPortal();
            markStepDone(5);
          }
        }
      ]
    },
    {
      num: 6,
      title: 'Source-Linked AI Clinical Summary',
      actor: 'Dr. Vikram Sengupta (Manipal)',
      goal: 'Generate Gemini longitudinal summary with clickable citations; test true empty state.',
      description:
        'With active consent, Gemini synthesizes only permitted records. Every claim links to a bracketed citation chip [REC-APOLLO-001]. When a historical date range with 0 records is chosen, it returns a true empty state.',
      expectedResult:
        'Clicking citation chip deep-links to timeline event and opens Citation Inspector. 0 records returns "No records found" (no hallucinated advice).',
      actions: [
        {
          label: '1. Generate AI Clinical Synthesis',
          run: () => {
            onGenerateSummary();
            markStepDone(6);
          }
        },
        {
          label: '2. Test Deep-Link Citation Click',
          run: () => {
            onTestCitationClick();
            markStepDone(6);
          }
        }
      ]
    },
    {
      num: 7,
      title: 'Consent Revocation & Instant 403 Block',
      actor: 'Patient Rajesh Kumar -> Dr. Vikram',
      goal: 'Patient revokes access; server instantly cuts off clinician with 403 Forbidden.',
      description:
        'Patient revokes Dr. Vikram\'s grant in the Consent Portal. All subsequent clinician read requests are immediately rejected by the server authorization layer without client-side bypass.',
      expectedResult:
        'Dr. Vikram receives HTTP 403 Forbidden and Access Denied modal. Revocation audit event logged immediately.',
      actions: [
        {
          label: '1. Revoke Active Consent Grant',
          run: () => {
            onRevokeConsent();
            markStepDone(7);
          }
        },
        {
          label: '2. View Security Audit Trail',
          run: () => {
            onClose();
            onOpenAuditLogs();
            markStepDone(7);
          }
        }
      ]
    },
    {
      num: 8,
      title: 'Truthful Boundary & Security Failure Modes',
      actor: 'System Evaluator',
      goal: 'Prove honest boundaries: rejected executable uploads and unconfigured gateway probes.',
      description:
        'CareTrail never fakes connections. Attempting to upload malware.exe triggers HTTP 415. Probing the external ABDM Gateway truthfully returns HTTP 503 Not Configured without synthesizing fake data.',
      expectedResult:
        'Upload rejects executables with 415. ABDM Gateway probe returns 503 Not Configured with missing credential checklist.',
      actions: [
        {
          label: '1. Test Upload .exe Rejection (415)',
          run: () => {
            onTestUploadValidation();
            markStepDone(8);
          }
        },
        {
          label: '2. Test ABDM Gateway 503 Probe',
          run: () => {
            onTestAbdmProbe();
            markStepDone(8);
          }
        }
      ]
    }
  ];

  const currentStepData = steps[activeStep - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-teal-500/60 rounded-2xl max-w-4xl w-full my-auto shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-950 via-teal-950/90 to-slate-950 border-b border-teal-800/60 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-teal-500/30 to-emerald-500/30 border border-teal-500/50 text-teal-300">
              <Play className="w-6 h-6 text-emerald-400 fill-emerald-400/20" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Judge Demonstration: 3-5 Minute Patient Journey
                </h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                  Prompt 14 Rehearsal
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                8 continuous steps verifying patient isolation, document review, ABDM consent, and honest failure modes.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progression Pills */}
        <div className="px-6 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center space-x-1.5 overflow-x-auto shrink-0 text-xs">
          {steps.map((s) => {
            const isCurrent = activeStep === s.num;
            const isDone = completedSteps.includes(s.num);

            return (
              <button
                key={s.num}
                onClick={() => setActiveStep(s.num)}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 transition-all cursor-pointer shrink-0 ${
                  isCurrent
                    ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md'
                    : isDone
                    ? 'bg-slate-800 text-emerald-300 hover:bg-slate-700 border border-emerald-800/50'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <span className="w-4 h-4 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-mono">
                    {s.num}
                  </span>
                )}
                <span>Step {s.num}</span>
              </button>
            );
          })}
        </div>

        {/* Active Step Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          <div className="bg-slate-950/80 border border-teal-900/60 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-teal-400 font-bold">
                  Step {currentStepData.num} of 8 • {currentStepData.actor}
                </div>
                <h3 className="text-base font-bold text-white mt-0.5">{currentStepData.title}</h3>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <span className="px-2.5 py-1 rounded bg-teal-950 text-teal-300 border border-teal-800 text-[11px] font-mono font-semibold">
                  Goal: {currentStepData.goal}
                </span>
              </div>
            </div>

            {/* Description & Behavior */}
            <div className="space-y-3">
              <div>
                <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">
                  Clinical Scenario & Workflow:
                </span>
                <p className="text-slate-300 text-xs mt-1 leading-relaxed">{currentStepData.description}</p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900 border border-emerald-900/40 text-emerald-200">
                <span className="font-bold text-emerald-300 uppercase tracking-wider text-[10px] block mb-1">
                  Expected Observable Result & Proof:
                </span>
                <p className="text-xs text-slate-200 leading-relaxed">{currentStepData.expectedResult}</p>
              </div>
            </div>

            {/* Step Action Buttons */}
            <div className="pt-2">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-2">
                1-Click Step Triggers:
              </span>
              <div className="flex flex-wrap gap-2.5">
                {currentStepData.actions.map((act, idx) => (
                  <button
                    key={idx}
                    onClick={act.run}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold flex items-center space-x-2 shadow-md shadow-teal-950 transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>{act.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Step Navigation */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
              disabled={activeStep === 1}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Previous Step
            </button>

            <div className="text-slate-400 font-mono text-[11px]">
              Completed {completedSteps.length} of 8 Steps
            </div>

            <button
              onClick={() => {
                markStepDone(activeStep);
                setActiveStep(Math.min(8, activeStep + 1));
              }}
              disabled={activeStep === 8}
              className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center space-x-1.5"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center space-x-2">
            <FileText className="w-3.5 h-3.5 text-teal-400" />
            <span>Aligned with DEMO_SCRIPT.md and JUDGE_EVIDENCE.md (Prompt 14)</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
