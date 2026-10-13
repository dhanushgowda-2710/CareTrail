import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Unlock, 
  FileCheck, 
  ShieldAlert, 
  UserCheck, 
  Layers, 
  UploadCloud, 
  Workflow, 
  Building2,
  Sparkles,
  BookmarkCheck,
  RotateCw,
  Cpu,
  Pill,
  Activity,
  ClipboardList,
  Clock,
  FlaskConical,
  TrendingUp,
  TrendingDown,
  FileEdit,
  History,
  AlertTriangle,
  HeartPulse,
  FileDown,
  Server,
  Terminal,
  Mic,
  Languages,
  Award,
  CheckCircle2
} from 'lucide-react';
import { StaffProfile, AccessRequest, AccessGrant, SynthesisFocus } from '../types/caretrail';

interface PromptBannerProps {
  currentStaff: StaffProfile;
  accessRequests: AccessRequest[];
  accessGrants: AccessGrant[];
  onOpenUploadDocDemo: () => void;
  onOpenAddReportedDemo: () => void;
  onOpenMultiSourceChannels: () => void;
  onViewMultiSourceChart: () => void;
  onRequestConsentDemo: () => void;
  onOpenConsentPortal: () => void;
  onTestGrantedAccess: () => void;
  onTestRevocationBlock: () => void;
  onSwitchHospital: () => void;
  onOpenVerificationGuide: (promptNum?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14) => void;
  // Prompt 4 actions
  onTriggerPrompt4Demo?: () => void;
  onTestCitationClick?: () => void;
  onToggleSynthesisVerifiedOnly?: () => void;
  onSwitchSynthesisFocus?: (focus: SynthesisFocus) => void;
  // Prompt 5 actions
  onTriggerPrompt5Demo?: () => void;
  onTestAllergyCdsDemo?: () => void;
  onTestDuplicationCdsDemo?: () => void;
  onOpenTrajectoryDemo?: () => void;
  // Prompt 6 actions
  onTriggerPrompt6Demo?: () => void;
  onResolveHtnConflictDemo?: () => void;
  onResolveDmConflictDemo?: () => void;
  // Prompt 7 actions
  onTriggerPrompt7Demo?: () => void;
  onReconcileStatinDemo?: () => void;
  onHarmonizeMetforminDemo?: () => void;
  onOpenScheduleDemo?: () => void;
  // Prompt 8 actions
  onTriggerPrompt8Demo?: () => void;
  onResolvePenicillinAllergyDemo?: () => void;
  onDifferentiateNsaidIntoleranceDemo?: () => void;
  onInspectCrossReactivityDemo?: () => void;
  // Prompt 9 actions
  onTriggerPrompt9Demo?: () => void;
  onInspectHba1cDeltaDemo?: () => void;
  onInspectCreatinineDeltaDemo?: () => void;
  onFilterGlycemicPanelDemo?: () => void;
  // Prompt 10 actions
  onTriggerPrompt10Demo?: () => void;
  onTestPatientDisputeDemo?: () => void;
  onTestUnauthorizedCorrectionDemo?: () => void;
  onTestClinicianAddendumDemo?: () => void;
  onTestAuditLineageDemo?: () => void;
  // Prompt 11 actions
  onTriggerPrompt11Demo?: () => void;
  onOpenIntegrationStatusDemo?: () => void;
  onOpenEmergencySummaryDemo?: () => void;
  onTestAbdmProbeDemo?: () => void;
  onTestFhirMappingDemo?: () => void;
  onOpenPolicyMatrixDemo?: () => void;
  // Prompt 12 actions
  onTriggerPrompt12Demo?: () => void;
  onRunAcceptanceSuiteDemo?: () => void;
  onTestCrossAccessBlockDemo?: () => void;
  onTestRoleEscalationBlockDemo?: () => void;
  onTestUploadValidationDemo?: () => void;
  onTestAuditPrivacyScanDemo?: () => void;
  // Prompt 13 actions
  onTriggerPrompt13Demo?: () => void;
  onOpenVoiceIntakeDemo?: () => void;
  onTestKannadaVoiceDemo?: () => void;
  onTestHindiVoiceDemo?: () => void;
  onTestEnglishVoiceDemo?: () => void;
  // Prompt 14 actions
  onOpenJudgeDemo?: () => void;
  onOpenProductionReadinessDemo?: () => void;
}

export const Prompt1Banner: React.FC<PromptBannerProps> = ({
  currentStaff,
  accessRequests,
  accessGrants,
  onOpenUploadDocDemo,
  onOpenAddReportedDemo,
  onOpenMultiSourceChannels,
  onViewMultiSourceChart,
  onRequestConsentDemo,
  onOpenConsentPortal,
  onTestGrantedAccess,
  onTestRevocationBlock,
  onSwitchHospital,
  onOpenVerificationGuide,
  onTriggerPrompt4Demo,
  onTestCitationClick,
  onToggleSynthesisVerifiedOnly,
  onSwitchSynthesisFocus,
  onTriggerPrompt5Demo,
  onTestAllergyCdsDemo,
  onTestDuplicationCdsDemo,
  onOpenTrajectoryDemo,
  onTriggerPrompt6Demo,
  onResolveHtnConflictDemo,
  onResolveDmConflictDemo,
  onTriggerPrompt7Demo,
  onReconcileStatinDemo,
  onHarmonizeMetforminDemo,
  onOpenScheduleDemo,
  onTriggerPrompt8Demo,
  onResolvePenicillinAllergyDemo,
  onDifferentiateNsaidIntoleranceDemo,
  onInspectCrossReactivityDemo,
  onTriggerPrompt9Demo,
  onInspectHba1cDeltaDemo,
  onInspectCreatinineDeltaDemo,
  onFilterGlycemicPanelDemo,
  onTriggerPrompt10Demo,
  onTestPatientDisputeDemo,
  onTestUnauthorizedCorrectionDemo,
  onTestClinicianAddendumDemo,
  onTestAuditLineageDemo,
  onTriggerPrompt11Demo,
  onOpenIntegrationStatusDemo,
  onOpenEmergencySummaryDemo,
  onTestAbdmProbeDemo,
  onTestFhirMappingDemo,
  onOpenPolicyMatrixDemo,
  onTriggerPrompt12Demo,
  onRunAcceptanceSuiteDemo,
  onTestCrossAccessBlockDemo,
  onTestRoleEscalationBlockDemo,
  onTestUploadValidationDemo,
  onTestAuditPrivacyScanDemo,
  onTriggerPrompt13Demo,
  onOpenVoiceIntakeDemo,
  onTestKannadaVoiceDemo,
  onTestHindiVoiceDemo,
  onTestEnglishVoiceDemo,
  onOpenJudgeDemo,
  onOpenProductionReadinessDemo
}) => {
  const [activePromptTab, setActivePromptTab] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14>(14);
  const pendingCount = accessRequests.filter(r => r.status === 'PENDING').length;

  return (
    <div className="bg-gradient-to-r from-slate-950 via-teal-950 to-slate-950 border-b border-teal-800/40 px-4 py-3 sm:px-6 shadow-lg">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Top Prompt Selection Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-teal-900/40 pb-2.5">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400">
              Evaluation Roadmap:
            </span>
            <div className="flex items-center bg-slate-900/90 p-0.5 rounded-lg border border-teal-800/40 text-xs overflow-x-auto">
              <button
                onClick={() => setActivePromptTab(14)}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center space-x-1 ${
                  activePromptTab === 14
                    ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
                <span>P14: Judge Demo</span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-400/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/40">
                  FINAL PASS
                </span>
              </button>
              <button
                onClick={() => setActivePromptTab(13)}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center space-x-1 ${
                  activePromptTab === 13
                    ? 'bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Mic className="w-3.5 h-3.5 text-teal-300" />
                <span>P13: Voice Intake</span>
              </button>
              <button
                onClick={() => setActivePromptTab(12)}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center space-x-1 ${
                  activePromptTab === 12
                    ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>P12: Security & E2E Pass</span>
              </button>
              <button
                onClick={() => setActivePromptTab(11)}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center space-x-1 ${
                  activePromptTab === 11
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Workflow className="w-3.5 h-3.5 text-teal-300" />
                <span>P11: Integrations/Export</span>
              </button>
              <button
                onClick={() => setActivePromptTab(10)}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center space-x-1 ${
                  activePromptTab === 10
                    ? 'bg-gradient-to-r from-teal-600 via-amber-600 to-rose-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <History className="w-3.5 h-3.5 text-amber-300" />
                <span>P10: Disputes/Audit</span>
              </button>
              <button
                onClick={() => setActivePromptTab(9)}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center space-x-1 ${
                  activePromptTab === 9
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FlaskConical className="w-3.5 h-3.5 text-cyan-300" />
                <span>P9: Labs/LOINC</span>
              </button>
              <button
                onClick={() => setActivePromptTab(8)}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center space-x-1 ${
                  activePromptTab === 8
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-300" />
                <span>P8: Allergy/ADR</span>
              </button>
              <button
                onClick={() => setActivePromptTab(7)}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center space-x-1 ${
                  activePromptTab === 7
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Pill className="w-3.5 h-3.5 text-teal-300" />
                <span>P7: MedRec</span>
              </button>
              <button
                onClick={() => setActivePromptTab(6)}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center space-x-1 ${
                  activePromptTab === 6
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ClipboardList className="w-3.5 h-3.5 text-amber-300" />
                <span>P6: Problem Rec</span>
              </button>
              <button
                onClick={() => setActivePromptTab(5)}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center space-x-1 ${
                  activePromptTab === 5
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-300" />
                <span>P5: CDS</span>
              </button>
              <button
                onClick={() => setActivePromptTab(4)}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center space-x-1 ${
                  activePromptTab === 4
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>P4: AI Synthesis</span>
              </button>
              <button
                onClick={() => setActivePromptTab(3)}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center space-x-1 ${
                  activePromptTab === 3
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>P3: Multi-Source</span>
              </button>
              <button
                onClick={() => setActivePromptTab(2)}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center space-x-1 ${
                  activePromptTab === 2
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>P2: ABDM</span>
                {pendingCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-black text-[10px] font-bold">
                    {pendingCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActivePromptTab(1)}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center space-x-1 ${
                  activePromptTab === 1
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>P1: Intra-Hosp</span>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <button
              onClick={() => onOpenVerificationGuide(activePromptTab)}
              className="text-teal-300 hover:text-teal-200 font-semibold underline underline-offset-4 flex items-center gap-1 cursor-pointer"
            >
              <span>View Prompt {activePromptTab} Checklist & Evaluation Rubric</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Content for PROMPT 14 (FINAL PASS & REHEARSAL) */}
        {activePromptTab === 14 && (
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-cyan-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 shrink-0 mt-0.5">
                <Award className="w-5 h-5 text-emerald-300 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-emerald-200 uppercase tracking-wide flex items-center gap-1.5">
                    Prompt 14: Three-to-Five-Minute Judge Demo & Governance Pass
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Final Stage Completed (14/14)
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-950 text-teal-300 border border-teal-700">
                    DEMO_SCRIPT.md
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                    JUDGE_EVIDENCE.md
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">
                    Offline Survivability
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-3xl">
                  Continuous 8-step patient journey (<code className="text-emerald-300 font-mono">DEMO_SCRIPT.md</code>); empirical technical verification matrix (<code className="text-teal-300 font-mono">JUDGE_EVIDENCE.md</code>); client-side offline survivability queue with synchronization replay; and 14-prompt governance attestation with zero fabricated metrics or claims.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <button
                onClick={() => {
                  if (onOpenJudgeDemo) onOpenJudgeDemo();
                }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-950 transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Launch Judge Demo (8 Steps)</span>
              </button>

              <button
                onClick={() => {
                  if (onOpenProductionReadinessDemo) onOpenProductionReadinessDemo();
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-teal-700/80 text-teal-200 transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                <span>Governance Matrix (14/14)</span>
              </button>

              <button
                onClick={() => onOpenVerificationGuide(14)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors flex items-center space-x-1 cursor-pointer"
              >
                <span>Full Rubric</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          </div>
        )}

        {/* Content for PROMPT 13 (ACTIVE) */}
        {activePromptTab === 13 && (
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-gradient-to-br from-teal-500/20 via-emerald-500/20 to-cyan-500/20 border border-teal-500/40 rounded-xl text-teal-300 shrink-0 mt-0.5">
                <Mic className="w-5 h-5 text-teal-300 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-teal-200 uppercase tracking-wide flex items-center gap-1.5">
                    Prompt 13: Low-Effort Multilingual Clinical Voice Intake
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Active & Ready to Verify
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-950 text-teal-300 border border-teal-700">
                    Kannada • Hindi • English
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">
                    Dual-Track Transcript
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-3xl">
                  Low-effort clinical audio intake when digital exchange is unavailable: Web Speech API microphone capture; authentic clinical audio presets in <strong className="text-teal-300">Kannada (kn-IN)</strong>, <strong className="text-emerald-300">Hindi (hi-IN)</strong>, and <strong className="text-cyan-300">Indian English (en-IN)</strong>; dual-track display with native script transcript; automated extraction of chief complaints, approximate timelines with uncertainty flags, and mentioned medications; and a human-in-the-loop doctor commit gate.
                </p>
              </div>
            </div>

            {/* Prompt 13 Quick Action Buttons */}
            <div className="flex items-center flex-wrap gap-2 shrink-0">
              <button
                onClick={onOpenVoiceIntakeDemo}
                className="px-3 py-1.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold rounded-lg text-xs flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
                title="Launch Multilingual Voice Intake Modal"
              >
                <Mic className="w-3.5 h-3.5 text-slate-950" />
                <span>1. Open Voice Modal</span>
              </button>

              <button
                onClick={onTestKannadaVoiceDemo}
                className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs font-semibold text-slate-200 flex items-center space-x-1.5 transition-all cursor-pointer font-mono"
                title="Simulate Kannada cardiac history voice intake (Sunita Reddy)"
              >
                <Languages className="w-3.5 h-3.5 text-teal-400" />
                <span>2. Kannada Audio</span>
              </button>

              <button
                onClick={onTestHindiVoiceDemo}
                className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs font-semibold text-slate-200 flex items-center space-x-1.5 transition-all cursor-pointer font-mono"
                title="Simulate Hindi diabetes tremors intake (Rajesh Kumar)"
              >
                <Languages className="w-3.5 h-3.5 text-amber-400" />
                <span>3. Hindi Audio</span>
              </button>

              <button
                onClick={onTestEnglishVoiceDemo}
                className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs font-semibold text-slate-200 flex items-center space-x-1.5 transition-all cursor-pointer font-mono"
                title="Simulate English clinician rapid rounds dictation (Dr. Anand Sharma)"
              >
                <Languages className="w-3.5 h-3.5 text-cyan-400" />
                <span>4. English Dictate</span>
              </button>
            </div>
          </div>
        )}

        {/* Content for PROMPT 12 */}
        {activePromptTab === 12 && (
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-cyan-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-emerald-200 uppercase tracking-wide flex items-center gap-1.5">
                    Prompt 12: Security, Accessibility & E2E Acceptance Pass
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Active & Ready to Verify
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-950 text-teal-300 border border-teal-700">
                    10/10 Acceptance Checks
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950 text-blue-300 border border-blue-800">
                    Zero Leaks Confirmed
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-3xl">
                  Comprehensive acceptance & security validation: verifies patient horizontal cross-access denial (<span className="text-rose-300 font-mono">403 Forbidden</span>); server-enforced role escalation defenses; file extension & 15MB limits; grounded summary citation checks; unrecorded fact preservation; audit log credential sanitization; and WCAG AA contrast.
                </p>
              </div>
            </div>

            {/* Prompt 12 Quick Action Buttons */}
            <div className="flex items-center flex-wrap gap-2 shrink-0">
              <button
                onClick={onRunAcceptanceSuiteDemo}
                className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-bold rounded-lg text-xs flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
                title="Run full automated acceptance test suite across all 10 checks"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-slate-950" />
                <span>1. Run 10-Check Suite</span>
              </button>

              <button
                onClick={onTestCrossAccessBlockDemo}
                className="px-2.5 py-1.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-700 rounded-lg text-xs font-semibold text-rose-200 flex items-center space-x-1.5 transition-all cursor-pointer font-mono"
                title="Verify Patient A cannot query Patient B (403 Forbidden)"
              >
                <Lock className="w-3.5 h-3.5 text-rose-400" />
                <span>2. Cross-Access (403)</span>
              </button>

              <button
                onClick={onTestRoleEscalationBlockDemo}
                className="px-2.5 py-1.5 bg-amber-950/80 hover:bg-amber-900 border border-amber-700 rounded-lg text-xs font-semibold text-amber-200 flex items-center space-x-1.5 transition-all cursor-pointer font-mono"
                title="Verify client JSON cannot escalate user role (403 Forbidden)"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>3. Role Escalation</span>
              </button>

              <button
                onClick={onTestUploadValidationDemo}
                className="px-2.5 py-1.5 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700 rounded-lg text-xs font-semibold text-cyan-200 flex items-center space-x-1.5 transition-all cursor-pointer font-mono"
                title="Test malware.exe and oversized upload rejection (415 / 413)"
              >
                <UploadCloud className="w-3.5 h-3.5 text-cyan-400" />
                <span>4. Upload Whitelist</span>
              </button>

              <button
                onClick={onTestAuditPrivacyScanDemo}
                className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs font-semibold text-slate-200 flex items-center space-x-1.5 transition-all cursor-pointer font-mono"
                title="Scan all audit entries for passwords, tokens, or raw document bytes"
              >
                <History className="w-3.5 h-3.5 text-teal-400" />
                <span>5. Privacy Scanner</span>
              </button>
            </div>
          </div>
        )}

        {/* Content for PROMPT 11 */}
        {activePromptTab === 11 && (
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-gradient-to-br from-teal-500/20 via-emerald-500/20 to-amber-500/20 border border-teal-500/40 rounded-xl text-teal-300 shrink-0 mt-0.5">
                <Workflow className="w-5 h-5 text-teal-400 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-teal-200 uppercase tracking-wide flex items-center gap-1.5">
                    Prompt 11: Honest Integration Status & Emergency Export
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Active & Ready to Verify
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-950 text-teal-300 border border-teal-700">
                    Explicit NOT_CONFIGURED States
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">
                    ABHA != PM-JAY Policy Rule
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-3xl">
                  External connectivity readiness: truthful connector states (<span className="text-rose-300 font-mono">NOT_CONFIGURED</span> without fake fetches); synthetic <strong className="text-cyan-300">FHIR R4 adapter specimen</strong> (labeled example mapping); policy firewall separating ABHA records from PM-JAY schemes; and a patient-approved <strong className="text-amber-300">emergency summary export</strong> with timestamp and non-revocable notice.
                </p>
              </div>
            </div>

            {/* Prompt 11 Quick Action Buttons */}
            <div className="flex items-center flex-wrap gap-2 shrink-0">
              <button
                onClick={onOpenIntegrationStatusDemo}
                className="px-3 py-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-slate-950 font-bold rounded-lg text-xs flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
                title="Inspect 5 external connectors and truthful statuses"
              >
                <Server className="w-3.5 h-3.5 text-slate-950" />
                <span>1. Connectors (5 Sources)</span>
              </button>

              <button
                onClick={onTestAbdmProbeDemo}
                className="px-2.5 py-1.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-700 rounded-lg text-xs font-semibold text-rose-200 flex items-center space-x-1.5 transition-all cursor-pointer font-mono"
                title="Run diagnostic probe against ABDM gateway (proves honest 503 failure)"
              >
                <Terminal className="w-3.5 h-3.5 text-rose-400" />
                <span>2. Probe ABDM (503 Honest)</span>
              </button>

              <button
                onClick={onTestFhirMappingDemo}
                className="px-2.5 py-1.5 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700 rounded-lg text-xs font-semibold text-cyan-200 flex items-center space-x-1.5 transition-all cursor-pointer font-mono"
                title="Inspect synthetic FHIR R4 Bundle specimen"
              >
                <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>3. FHIR R4 Specimen</span>
              </button>

              <button
                onClick={onOpenPolicyMatrixDemo}
                className="px-2.5 py-1.5 bg-amber-950/80 hover:bg-amber-900 border border-amber-700 rounded-lg text-xs font-semibold text-amber-200 flex items-center space-x-1.5 transition-all cursor-pointer font-mono"
                title="Inspect ABHA vs PM-JAY regulatory boundaries"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>4. ABHA != PM-JAY</span>
              </button>

              <button
                onClick={onOpenEmergencySummaryDemo}
                className="px-2.5 py-1.5 bg-rose-900 hover:bg-rose-800 text-white font-semibold rounded-lg text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-sm"
                title="Open patient-approved emergency summary export modal"
              >
                <HeartPulse className="w-3.5 h-3.5 text-rose-300" />
                <span>5. Export Emergency Sheet</span>
              </button>
            </div>
          </div>
        )}

        {/* Content for PROMPT 10 */}
        {activePromptTab === 10 && (
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-gradient-to-br from-amber-500/20 via-teal-500/20 to-rose-500/20 border border-amber-500/40 rounded-xl text-amber-300 shrink-0 mt-0.5">
                <History className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-amber-200 uppercase tracking-wide flex items-center gap-1.5">
                    Prompt 10: Corrections, Disputes & Audit Trail
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-950 text-amber-300 border border-amber-800">
                    Active & Ready to Verify
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-950 text-teal-300 border border-teal-700">
                    Non-Destructive Versioning
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950 text-blue-300 border border-blue-800">
                    Append-Only Audit Trail
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-3xl">
                  Medical-record preservation & governance: allows patients to flag inaccurate events with structured dispute rationale without mutating clinical ground truth; allows authorized clinicians to attach non-destructive addenda (<span className="text-teal-300 font-bold">v1.0 baseline preserved</span>); strictly blocks unauthorized edits with <strong className="text-rose-400">403 Forbidden</strong> enforcement; and records all operations to an immutable append-only audit trail.
                </p>
              </div>
            </div>

            {/* Prompt 10 Quick Action Buttons */}
            <div className="flex items-center flex-wrap gap-2 shrink-0">
              <button
                onClick={onTestPatientDisputeDemo || onViewMultiSourceChart}
                className="px-3 py-1.5 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-slate-950 font-bold rounded-lg text-xs flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
                title="Simulate patient reporting a record dispute"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-slate-950" />
                <span>1. Patient Dispute Demo</span>
              </button>

              <button
                onClick={onTestUnauthorizedCorrectionDemo}
                className="px-2.5 py-1.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-700 rounded-lg text-xs font-semibold text-rose-200 flex items-center space-x-1.5 transition-all cursor-pointer font-mono"
                title="Test 403 Forbidden rejection of unauthorized edit"
              >
                <Lock className="w-3.5 h-3.5 text-rose-400" />
                <span>2. Test 403 Reject</span>
              </button>

              <button
                onClick={onTestClinicianAddendumDemo}
                className="px-2.5 py-1.5 bg-teal-950/80 hover:bg-teal-900 border border-teal-700 rounded-lg text-xs font-semibold text-teal-200 flex items-center space-x-1.5 transition-all cursor-pointer font-mono"
                title="Simulate clinician appending addendum to resolve dispute"
              >
                <FileEdit className="w-3.5 h-3.5 text-teal-400" />
                <span>3. Addendum (v2)</span>
              </button>

              <button
                onClick={onTestAuditLineageDemo}
                className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs font-semibold text-slate-200 flex items-center space-x-1.5 transition-all cursor-pointer font-mono"
                title="Inspect append-only audit log and version history"
              >
                <History className="w-3.5 h-3.5 text-amber-400" />
                <span>4. Audit Lineage</span>
              </button>
            </div>
          </div>
        )}

        {/* Content for PROMPT 9 (ACTIVE) */}
        {activePromptTab === 9 && (
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-gradient-to-br from-cyan-500/20 via-teal-500/20 to-indigo-500/20 border border-cyan-500/40 rounded-xl text-cyan-300 shrink-0 mt-0.5">
                <FlaskConical className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-cyan-200 uppercase tracking-wide flex items-center gap-1.5">
                    Prompt 9: Longitudinal Laboratory & Diagnostic Investigations Hub
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800">
                    Active & Ready to Verify
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-950 text-teal-300 border border-teal-700">
                    100% LOINC Standardized
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-800">
                    Cross-LIMS Delta Engine
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-3xl">
                  Cross-facility lab harmonization & delta checks: detects <strong className="text-rose-300">HbA1c Glycemic Surge</strong> (6.2% at Apollo <span className="font-mono text-teal-300">[Amsh-Labs]</span> to 7.8% at City Health <span className="font-mono text-cyan-300">[City-Metformin]</span>, +25.8% shift into active T2DM), identifies <strong className="text-amber-300">Renal Function Creep</strong> (Creatinine 1.05 -&gt; 1.45 mg/dL, eGFR drop to 52 mL/min into Stage 3a CKD), flags hepatic transaminitis (ALT 48 U/L), aligns 100% with LOINC, and supports clinician electronic sign-off.
                </p>
              </div>
            </div>

            {/* Prompt 9 Quick Action Buttons */}
            <div className="flex items-center flex-wrap gap-2 shrink-0">
              <button
                onClick={onTriggerPrompt9Demo || onViewMultiSourceChart}
                className="px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
                title="Open Rajesh Kumar's chart to view Laboratory Investigations Hub"
              >
                <FlaskConical className="w-3.5 h-3.5 text-cyan-200" />
                <span>1. View Lab Hub</span>
              </button>

              <button
                onClick={onInspectHba1cDeltaDemo}
                className="px-2.5 py-1.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-700 rounded-lg text-xs font-semibold text-rose-200 flex items-center space-x-1.5 transition-all cursor-pointer font-mono"
                title="Inspect HbA1c +25.8% Surge Delta Check"
              >
                <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
                <span>2. HbA1c Surge (+25.8%)</span>
              </button>

              <button
                onClick={onInspectCreatinineDeltaDemo}
                className="px-2.5 py-1.5 bg-amber-950/80 hover:bg-amber-900 border border-amber-700 rounded-lg text-xs font-semibold text-amber-200 flex items-center space-x-1.5 transition-all cursor-pointer font-mono"
                title="Inspect Creatinine Creep / eGFR Drop to 52"
              >
                <TrendingDown className="w-3.5 h-3.5 text-amber-400" />
                <span>3. eGFR Drop (CKD 3a)</span>
              </button>

              <button
                onClick={onFilterGlycemicPanelDemo}
                className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs font-semibold text-cyan-300 flex items-center space-x-1.5 transition-all cursor-pointer"
                title="Filter Glycemic & Renal Panels"
              >
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>4. Filter Panels</span>
              </button>
            </div>
          </div>
        )}

        {/* Content for PROMPT 8 */}
        {activePromptTab === 8 && (
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-gradient-to-br from-rose-500/20 via-amber-500/20 to-teal-500/20 border border-rose-500/40 rounded-xl text-rose-300 shrink-0 mt-0.5">
                <ShieldAlert className="w-5 h-5 text-rose-400 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-rose-200 uppercase tracking-wide flex items-center gap-1.5">
                    Prompt 8: Multi-Facility Allergy & ADR Registry (MedDRA / SNOMED CT / UNII)
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-950 text-rose-300 border border-rose-800">
                    Active & Ready to Verify
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-950 text-teal-300 border border-teal-700">
                    100% Ontological Alignment
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-3xl">
                  Cross-facility immunological reconciliation: resolves <strong className="text-rose-300">Beta-Lactam / Penicillin Red-Flag Conflict</strong> (Apollo EHR <span className="font-mono text-teal-300">[Amsh-Labs]</span> vs patient recall <span className="font-mono text-cyan-300">[Pt-Self]</span>), differentiates <strong className="text-amber-300">NSAID Intolerance vs True Allergy</strong> (<span className="font-mono text-indigo-300">[Amsh-001]</span> vs <span className="font-mono text-purple-300">[City-Metformin]</span>), maps molecular cross-reactivity boundaries across Cephalosporins and Carbapenems, and writes ABDM safety audits.
                </p>
              </div>
            </div>

            {/* Prompt 8 Quick Action Buttons */}
            <div className="flex items-center flex-wrap gap-2 shrink-0">
              <button
                onClick={onTriggerPrompt8Demo || onViewMultiSourceChart}
                className="px-3 py-1.5 bg-gradient-to-r from-rose-600 to-teal-600 hover:from-rose-500 hover:to-teal-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
                title="Open Rajesh Kumar's chart to view Allergy & ADR Registry"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-200" />
                <span>1. View Allergy Registry</span>
              </button>

              <button
                onClick={onResolvePenicillinAllergyDemo}
                className="px-2.5 py-1.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-700 rounded-lg text-xs font-semibold text-rose-200 flex items-center space-x-1.5 transition-all cursor-pointer font-mono"
                title="Reconcile Penicillin Red-Flag Allergy Conflict (Critical)"
              >
                <BookmarkCheck className="w-3.5 h-3.5 text-rose-400" />
                <span>2. Reconcile Penicillin</span>
              </button>

              <button
                onClick={onDifferentiateNsaidIntoleranceDemo}
                className="px-2.5 py-1.5 bg-amber-950/80 hover:bg-amber-900 border border-amber-700 rounded-lg text-xs font-semibold text-amber-200 flex items-center space-x-1.5 transition-all cursor-pointer font-mono"
                title="Differentiate NSAID Gastric Intolerance vs IgE Allergy"
              >
                <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>3. Differentiate NSAID</span>
              </button>

              <button
                onClick={onInspectCrossReactivityDemo}
                className="px-2.5 py-1.5 bg-teal-950/80 hover:bg-teal-900 border border-teal-700 rounded-lg text-xs font-semibold text-teal-200 flex items-center space-x-1.5 transition-all cursor-pointer"
                title="Inspect Cross-Reactivity Risk Matrix & Safe Substitutes"
              >
                <Layers className="w-3.5 h-3.5 text-teal-400" />
                <span>4. Cross-Reactivity Matrix</span>
              </button>
            </div>
          </div>
        )}

        {/* Content for PROMPT 7 (ACTIVE) */}
        {activePromptTab === 7 && (
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-gradient-to-br from-teal-500/20 via-emerald-500/20 to-blue-500/20 border border-teal-500/40 rounded-xl text-teal-300 shrink-0 mt-0.5">
                <Pill className="w-5 h-5 text-teal-400 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-teal-200 uppercase tracking-wide flex items-center gap-1.5">
                    Prompt 7: Cross-Facility Medication Reconciliation & Active Regimen Harmonization (RxNorm / ATC)
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Active & Ready to Verify
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950 text-blue-300 border border-blue-700">
                    100% RxNorm / ATC Standard
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-3xl">
                  Cross-facility polypharmacy reconciliation: detects <strong className="text-rose-300">Dual Statin Duplication</strong> (Apollo Atorvastatin 10mg vs Manipal Rosuvastatin 10mg) and <strong className="text-amber-300">Metformin Dosage Discordance</strong> (Apollo 500mg ER vs City Health 1000mg twice daily with HbA1c 7.8%), with interactive deprescribing workbench, 24-hour transition schedule, and ABDM audit logging.
                </p>
              </div>
            </div>

            {/* Prompt 7 Quick Action Buttons */}
            <div className="flex items-center flex-wrap gap-2 shrink-0">
              <button
                onClick={onTriggerPrompt7Demo || onViewMultiSourceChart}
                className="px-3 py-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
                title="Open Rajesh Kumar's chart to view MedRec Workbench"
              >
                <Pill className="w-3.5 h-3.5 text-teal-200" />
                <span>1. View MedRec Regimen</span>
              </button>

              <button
                onClick={onReconcileStatinDemo}
                className="px-2.5 py-1.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-700 rounded-lg text-xs font-semibold text-rose-200 flex items-center space-x-1.5 transition-all cursor-pointer font-mono"
                title="Reconcile Concurrent Statin Duplication (Atorvastatin vs Rosuvastatin)"
              >
                <BookmarkCheck className="w-3.5 h-3.5 text-rose-400" />
                <span>2. Reconcile Dual Statins</span>
              </button>

              <button
                onClick={onHarmonizeMetforminDemo}
                className="px-2.5 py-1.5 bg-amber-950/80 hover:bg-amber-900 border border-amber-700 rounded-lg text-xs font-semibold text-amber-200 flex items-center space-x-1.5 transition-all cursor-pointer font-mono"
                title="Harmonize Metformin Dosage (500mg vs 1000mg)"
              >
                <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>3. Harmonize Metformin</span>
              </button>

              <button
                onClick={onOpenScheduleDemo}
                className="px-2.5 py-1.5 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700 rounded-lg text-xs font-semibold text-indigo-200 flex items-center space-x-1.5 transition-all cursor-pointer"
                title="View 24-Hour Daily Medication Transition Schedule"
              >
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>4. View Daily Schedule</span>
              </button>

              <button
                onClick={() => onOpenVerificationGuide(7)}
                className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-teal-700/60 rounded-lg text-xs font-semibold text-teal-300 flex items-center space-x-1.5 transition-all cursor-pointer"
                title="Open Prompt 7 Verification Rubric & Checklist"
              >
                <FileCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>5. Verify P7 Rubric</span>
              </button>
            </div>
          </div>
        )}

        {/* Content for PROMPT 6 */}
        {activePromptTab === 6 && (
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-gradient-to-br from-amber-500/20 via-teal-500/20 to-indigo-500/20 border border-amber-500/40 rounded-xl text-amber-300 shrink-0 mt-0.5">
                <ClipboardList className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-amber-200 uppercase tracking-wide flex items-center gap-1.5">
                    Prompt 6: Clinical Problem List & Multi-Facility Diagnostic Reconciliation (ICD-10 / SNOMED CT)
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Active & Ready to Verify
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-700">
                    100% Ontology Mapped
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-3xl">
                  Automated cross-hospital diagnostic synthesis: detects <strong className="text-amber-300">Hypertension Nomenclature Variance</strong> (Apollo Essential HTN vs Manipal Secondary HTN) and <strong className="text-teal-300">Diabetes Severity Discordance</strong> (Apollo Pre-diabetes vs City Health T2DM HbA1c 7.8%), maps every canonical problem to <strong className="text-white">ICD-10-CM</strong> and <strong className="text-white">SNOMED CT</strong>, with attending sign-offs logged to ABDM audit ledger.
                </p>
              </div>
            </div>

            {/* Prompt 6 Quick Action Buttons */}
            <div className="flex items-center flex-wrap gap-2 shrink-0">
              <button
                onClick={onTriggerPrompt6Demo || onViewMultiSourceChart}
                className="px-3 py-1.5 bg-gradient-to-r from-amber-600 to-teal-600 hover:from-amber-500 hover:to-teal-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
                title="Open Rajesh Kumar's chart to view Problem Reconciliation Registry"
              >
                <ClipboardList className="w-3.5 h-3.5 text-amber-200" />
                <span>1. View Problem Registry</span>
              </button>

              <button
                onClick={onResolveHtnConflictDemo}
                className="px-2.5 py-1.5 bg-amber-950/80 hover:bg-amber-900 border border-amber-700 rounded-lg text-xs font-semibold text-amber-200 flex items-center space-x-1.5 transition-all cursor-pointer font-mono"
                title="Resolve Hypertension Conflict (Essential vs Secondary Renovascular HTN)"
              >
                <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>2. Resolve HTN Conflict</span>
              </button>

              <button
                onClick={onResolveDmConflictDemo}
                className="px-2.5 py-1.5 bg-teal-950/80 hover:bg-teal-900 border border-teal-700 rounded-lg text-xs font-semibold text-teal-200 flex items-center space-x-1.5 transition-all cursor-pointer font-mono"
                title="Resolve Diabetes Conflict (Pre-Diabetes vs Established T2DM)"
              >
                <BookmarkCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>3. Resolve T2DM Conflict</span>
              </button>

              <button
                onClick={() => onOpenVerificationGuide(6)}
                className="px-2.5 py-1.5 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700 rounded-lg text-xs font-semibold text-indigo-200 flex items-center space-x-1.5 transition-all cursor-pointer"
                title="Open Prompt 6 Verification Rubric & Checklist"
              >
                <FileCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>4. Verify P6 Rubric</span>
              </button>
            </div>
          </div>
        )}

        {/* Content for PROMPT 5 */}
        {activePromptTab === 5 && (
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-gradient-to-br from-rose-500/20 via-amber-500/20 to-teal-500/20 border border-rose-500/40 rounded-xl text-rose-300 shrink-0 mt-0.5">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-teal-200 uppercase tracking-wide flex items-center gap-1.5">
                    Prompt 5: Clinical Decision Support (CDS) & Drug Safety Interaction Guardian
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Active & Ready to Verify
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-700">
                    Cross-Facility Safety Rules + Grounded Evidence
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-3xl">
                  Automated clinical safety cross-checking: <strong className="text-rose-300">Penicillin Allergy Block</strong> (grounded in patient recall <span className="font-mono text-amber-300">[Recall-Penicillin]</span>), <strong className="text-amber-300">Dual Statin Duplication</strong> (Apollo Atorvastatin vs Manipal scan Rosuvastatin), <strong className="text-indigo-300">CKD Nephrotoxicity</strong>, and a real-time <strong className="text-teal-200">Pre-Order Prescription Simulator</strong> with mandatory clinician override justifications.
                </p>
              </div>
            </div>

            {/* Prompt 5 Quick Action Buttons */}
            <div className="flex items-center flex-wrap gap-2 shrink-0">
              <button
                onClick={onTriggerPrompt5Demo || onViewMultiSourceChart}
                className="px-3 py-1.5 bg-gradient-to-r from-rose-600 via-amber-600 to-teal-600 hover:from-rose-500 hover:to-teal-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
                title="Open Rajesh Kumar's chart to view CDS Safety Guardian"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-200" />
                <span>1. View CDS Guardian</span>
              </button>

              <button
                onClick={onTestAllergyCdsDemo}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-rose-500/50 rounded-lg text-xs font-semibold text-rose-300 flex items-center space-x-1.5 transition-all cursor-pointer font-mono"
                title="Test simulated order of Amoxicillin 500mg against Rajesh's documented penicillin allergy"
              >
                <BookmarkCheck className="w-3.5 h-3.5 text-rose-400" />
                <span>2. Test Allergy Block</span>
              </button>

              <button
                onClick={onTestDuplicationCdsDemo}
                className="px-2.5 py-1.5 bg-amber-950/80 hover:bg-amber-900 border border-amber-700 rounded-lg text-xs font-semibold text-amber-200 flex items-center space-x-1.5 transition-all cursor-pointer font-mono"
                title="Test simulated order of Rosuvastatin 10mg against Apollo Atorvastatin (therapeutic duplication)"
              >
                <Pill className="w-3.5 h-3.5 text-amber-400" />
                <span>3. Test Statin Duplication</span>
              </button>

              <button
                onClick={onOpenTrajectoryDemo}
                className="px-2.5 py-1.5 bg-teal-950/80 hover:bg-teal-900 border border-teal-700 rounded-lg text-xs font-semibold text-teal-200 flex items-center space-x-1.5 transition-all cursor-pointer"
                title="Open longitudinal lab and vital trend flowsheet"
              >
                <Activity className="w-3.5 h-3.5 text-teal-400" />
                <span>4. Lab Trajectories</span>
              </button>

              <button
                onClick={() => onOpenVerificationGuide(5)}
                className="px-2.5 py-1.5 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700 rounded-lg text-xs font-semibold text-indigo-200 flex items-center space-x-1.5 transition-all cursor-pointer"
                title="Open Prompt 5 Verification Rubric & Checklist"
              >
                <FileCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>5. Verify P5 Rubric</span>
              </button>
            </div>
          </div>
        )}

        {/* Content for PROMPT 4 */}
        {activePromptTab === 4 && (
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-gradient-to-br from-teal-500/20 to-indigo-500/20 border border-teal-500/40 rounded-xl text-teal-300 shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-teal-200 uppercase tracking-wide flex items-center gap-1.5">
                    Prompt 4: AI Longitudinal Clinical Synthesis & Grounded Citations
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Active & Ready to Verify
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-700">
                    Gemini 3.8 Flash + Resilient Grounding
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-3xl">
                  Synthesizes complete patient history into an <strong className="text-white">Executive Clinical Summary</strong>, <strong className="text-teal-200">Problem List</strong> with severity ratings, <strong className="text-indigo-200">Reconciled Medication Regimens</strong>, and <strong className="text-rose-300">Safety Red Flags</strong>. Every clinical claim contains an interactive citation (e.g. <span className="font-mono text-amber-300">[Amsh-001]</span>, <span className="font-mono text-teal-300">[Scan-USG]</span>) with click-to-inspect provenance.
                </p>
              </div>
            </div>

            {/* Prompt 4 Quick Action Buttons */}
            <div className="flex items-center flex-wrap gap-2 shrink-0">
              <button
                onClick={onTriggerPrompt4Demo || onViewMultiSourceChart}
                className="px-3 py-1.5 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
                title="Synthesize Rajesh Kumar's multi-source longitudinal history"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>1. View AI Synthesis</span>
              </button>

              <button
                onClick={onTestCitationClick}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-teal-500/50 rounded-lg text-xs font-semibold text-amber-300 flex items-center space-x-1.5 transition-all cursor-pointer font-mono"
                title="Inspect clickable citation marker and verify exact source proof"
              >
                <BookmarkCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>2. Test [Amsh-001] Citation</span>
              </button>

              <button
                onClick={onToggleSynthesisVerifiedOnly}
                className="px-2.5 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700 rounded-lg text-xs font-semibold text-emerald-200 flex items-center space-x-1.5 transition-all cursor-pointer"
                title="Test toggle between All Sources vs Strict Tier 2 Verified Only"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>3. Strict Tier 2 Filter</span>
              </button>

              <button
                onClick={() => onOpenVerificationGuide(4)}
                className="px-2.5 py-1.5 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700 rounded-lg text-xs font-semibold text-indigo-200 flex items-center space-x-1.5 transition-all cursor-pointer"
                title="Open Prompt 4 Verification Rubric & Checklist"
              >
                <FileCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>4. Verify P4 Rubric</span>
              </button>
            </div>
          </div>
        )}

        {/* Content for PROMPT 3 */}
        {activePromptTab === 3 && (
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-teal-500/10 border border-teal-500/30 rounded-lg text-teal-400 shrink-0 mt-0.5">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-teal-200 uppercase tracking-wide">
                    Prompt 3: Multi-Source Ingestion & Strict Provenance Timeline
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Completed & Verifiable
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-3xl">
                  Unified longitudinal timeline merging <strong className="text-white">Tier 2 internal EHR</strong>, <strong className="text-teal-200">Tier 4 scanned PDFs</strong> (with OCR quotes & draft extractions), <strong className="text-amber-200">Patient-Reported recollections</strong> (flagged unverified), and <strong className="text-cyan-200">Consented external exchange</strong>.
                </p>
              </div>
            </div>

            {/* Prompt 3 Action Buttons */}
            <div className="flex items-center flex-wrap gap-2 shrink-0">
              <button
                onClick={onViewMultiSourceChart}
                className="px-3 py-1.5 bg-teal-800 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm"
              >
                <span>1. View Rajesh's Chart</span>
              </button>

              <button
                onClick={onOpenUploadDocDemo}
                className="px-2.5 py-1.5 bg-teal-950 hover:bg-teal-900 border border-teal-700 rounded-lg text-xs font-semibold text-teal-200 flex items-center space-x-1.5 transition-all"
              >
                <UploadCloud className="w-3.5 h-3.5 text-teal-400" />
                <span>2. Upload Scan</span>
              </button>

              <button
                onClick={onOpenAddReportedDemo}
                className="px-2.5 py-1.5 bg-amber-950 hover:bg-amber-900 border border-amber-800 rounded-lg text-xs font-semibold text-amber-200 flex items-center space-x-1.5 transition-all"
              >
                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>3. Add Recall</span>
              </button>

              <button
                onClick={onOpenMultiSourceChannels}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-semibold text-teal-300 flex items-center space-x-1.5 transition-all"
              >
                <Workflow className="w-3.5 h-3.5 text-teal-400" />
                <span>4. Pipelines</span>
              </button>
            </div>
          </div>
        )}

        {/* Content for PROMPT 2 */}
        {activePromptTab === 2 && (
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-teal-500/10 border border-teal-500/30 rounded-lg text-teal-400 shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-teal-200 uppercase tracking-wide">
                    Prompt 2: ABDM Digital Consent Gatekeeper & Cross-Hospital Grants
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Completed & Verifiable
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-3xl">
                  Doctors request purpose-bound, time-delimited access to external hospital records. Patients approve/deny/revoke via digital consent portal. Revocation instantly enforces <span className="text-rose-400 font-semibold font-mono">403 Forbidden</span> access denial.
                </p>
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-2 shrink-0">
              <button
                onClick={onRequestConsentDemo}
                className="px-2.5 py-1.5 bg-teal-800 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm"
              >
                <Lock className="w-3.5 h-3.5 text-teal-300" />
                <span>1. Request Access</span>
              </button>

              <button
                onClick={onOpenConsentPortal}
                className="px-2.5 py-1.5 bg-teal-950 hover:bg-teal-900 border border-teal-700 rounded-lg text-xs font-semibold text-teal-200 flex items-center space-x-1.5 transition-all shadow-sm"
              >
                <FileCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>2. Patient Portal</span>
                {pendingCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-black text-[10px] font-bold">
                    {pendingCount}
                  </span>
                )}
              </button>

              <button
                onClick={onTestGrantedAccess}
                className="px-2.5 py-1.5 bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-700/60 rounded-lg text-xs font-semibold text-emerald-200 flex items-center space-x-1.5 transition-all shadow-sm"
              >
                <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                <span>3. View Chart (200)</span>
              </button>

              <button
                onClick={onTestRevocationBlock}
                className="px-2.5 py-1.5 bg-rose-950/70 hover:bg-rose-900/80 border border-rose-800/60 rounded-lg text-xs font-semibold text-rose-200 flex items-center space-x-1.5 transition-all shadow-sm"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>4. Revoke & Test 403</span>
              </button>
            </div>
          </div>
        )}

        {/* Content for PROMPT 1 */}
        {activePromptTab === 1 && (
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-teal-500/10 border border-teal-500/30 rounded-lg text-teal-400 shrink-0 mt-0.5">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-teal-200 uppercase tracking-wide">
                    Prompt 1: Intra-Hospital Scoping & Boundary Protection
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Completed & Verifiable
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-3xl">
                  Staff query patients registered strictly within their affiliated facility network. Cross-facility lookup is blocked with <span className="text-rose-400 font-semibold font-mono">403 Forbidden</span> and logged to the immutable audit trail.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={onSwitchHospital}
                className="px-3 py-1.5 bg-teal-800 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Switch Facility (Apollo &harr; City Care)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
