import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  UserCheck, 
  FileText, 
  Activity, 
  Terminal, 
  ChevronDown,
  Lock,
  Stethoscope,
  Info,
  Workflow,
  Mic,
  Wifi,
  WifiOff,
  CheckCircle2,
  Award
} from 'lucide-react';
import { StaffProfile } from '../types/caretrail';

interface NavbarProps {
  currentStaff: StaffProfile;
  allStaff: StaffProfile[];
  onSelectStaff: (staffId: string) => void;
  auditCount: number;
  pendingRequestsCount?: number;
  onOpenAudit: () => void;
  onOpenInspector: () => void;
  onOpenConsentPortal: () => void;
  onOpenVerificationGuide: () => void;
  onOpenIntegrationStatus?: () => void;
  onOpenSecurityAcceptance?: () => void;
  onOpenVoiceIntake?: () => void;
  isOffline?: boolean;
  onToggleOffline?: () => void;
  pendingOfflineCount?: number;
  onOpenProductionReadiness?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentStaff,
  allStaff,
  onSelectStaff,
  auditCount,
  pendingRequestsCount = 0,
  onOpenAudit,
  onOpenInspector,
  onOpenConsentPortal,
  onOpenVerificationGuide,
  onOpenIntegrationStatus,
  onOpenSecurityAcceptance,
  onOpenVoiceIntake,
  isOffline = false,
  onToggleOffline,
  pendingOfflineCount = 0,
  onOpenProductionReadiness
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-teal-900/60 shadow-lg text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Project Info */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center shadow-md shadow-teal-500/20">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-lg tracking-tight text-white">CareTrail</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    Unified Patient View
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <span className="font-semibold text-emerald-400">PROMPT 14 / 14</span>
                  <span>•</span>
                  <span>Offline Survivability, Resilient Sync & Production Readiness (FINAL PASS)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center: Current Facility Context */}
          <div className="hidden md:flex items-center bg-slate-800/90 border border-slate-700/80 rounded-lg px-3 py-1.5 shadow-inner">
            <Building2 className="w-4 h-4 text-teal-400 mr-2 shrink-0" />
            <div className="text-left text-xs">
              <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                <span>{currentStaff.hospitalName}</span>
                <span className="px-1.5 py-0.2 bg-teal-950 text-teal-300 text-[10px] rounded border border-teal-700 font-mono">
                  {currentStaff.hospitalId}
                </span>
              </div>
              <div className="text-slate-400 text-[11px] truncate max-w-xs">
                {currentStaff.branchName}
              </div>
            </div>
            <div className="ml-3 pl-3 border-l border-slate-700 flex items-center text-emerald-400 text-[11px] font-medium">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              <span>Tier 2 Internal</span>
            </div>
          </div>

          {/* Right Actions: Persona Switcher & Tools */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Prompt 14: Network Status & Offline Simulation Pill */}
            {onToggleOffline && (
              <button
                onClick={onToggleOffline}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all cursor-pointer ${
                  isOffline
                    ? 'bg-amber-950/90 border-amber-500/80 text-amber-300 ring-1 ring-amber-500/40 animate-pulse'
                    : 'bg-slate-800/80 border-slate-700 text-emerald-400 hover:border-slate-600'
                }`}
                title={isOffline ? 'Offline survivability active. Click to reconnect.' : 'Connected to network. Click to simulate outage.'}
              >
                {isOffline ? <WifiOff className="w-3.5 h-3.5 text-amber-400" /> : <Wifi className="w-3.5 h-3.5 text-emerald-400" />}
                <span className="hidden sm:inline">{isOffline ? 'Offline Mode' : 'Online'}</span>
                {pendingOfflineCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-black text-[10px] font-bold">
                    {pendingOfflineCount}
                  </span>
                )}
              </button>
            )}

            {/* Persona Switcher Dropdown */}
            <div className="relative group">
              <div className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700/90 border border-slate-700 rounded-lg px-3 py-1.5 cursor-pointer transition-colors">
                <div className="w-7 h-7 rounded-full bg-teal-600/30 border border-teal-500/40 flex items-center justify-center text-teal-300 font-semibold text-xs">
                  {currentStaff.role === 'doctor' ? <Stethoscope className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-slate-200">{currentStaff.name}</div>
                  <div className="text-[10px] text-teal-400">{currentStaff.designation}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-1 w-72 bg-slate-850 border border-slate-700 rounded-xl shadow-2xl py-2 hidden group-hover:block z-50 bg-slate-900">
                <div className="px-3 py-1.5 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Active Clinician Persona
                </div>
                {allStaff.map(staff => (
                  <button
                    key={staff.id}
                    onClick={() => onSelectStaff(staff.id)}
                    className={`w-full text-left px-3 py-2 text-xs flex items-start space-x-2 hover:bg-slate-800 transition-colors ${
                      staff.id === currentStaff.id ? 'bg-teal-950/50 text-teal-200 border-l-2 border-teal-500' : 'text-slate-300'
                    }`}
                  >
                    <div className="mt-0.5">
                      {staff.hospitalId === 'hosp-apollo' ? (
                        <span className="w-2 h-2 rounded-full bg-teal-400 inline-block" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-100 flex items-center justify-between">
                        <span>{staff.name}</span>
                        <span className="text-[10px] text-slate-400 font-normal capitalize">({staff.role})</span>
                      </div>
                      <div className="text-[11px] text-teal-300 truncate">{staff.hospitalName}</div>
                      <div className="text-[10px] text-slate-400 truncate">{staff.department}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Patient Consent Portal Button */}
            <button
              onClick={onOpenConsentPortal}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-950/70 hover:bg-amber-900/80 border border-amber-800/80 text-amber-200 transition-colors relative"
              title="Open Patient ABDM Consent Manager (Gatekeeper)"
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Patient Consent</span>
              {pendingRequestsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-black text-[10px] font-bold">
                  {pendingRequestsCount}
                </span>
              )}
            </button>

            {/* Prompt 14: System Governance & Production Readiness Pass */}
            {onOpenProductionReadiness && (
              <button
                onClick={onOpenProductionReadiness}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-950 transition-colors cursor-pointer"
                title="Open 14-Prompt System Governance Matrix, Offline Sync Engine & Production Audit"
              >
                <Award className="w-3.5 h-3.5 text-white" />
                <span className="hidden md:inline">Governance (14/14)</span>
              </button>
            )}

            {/* Prompt 13: Multilingual Voice Intake (Kannada, Hindi, English) */}
            {onOpenVoiceIntake && (
              <button
                onClick={onOpenVoiceIntake}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-teal-900/80 to-emerald-900/80 hover:from-teal-800 hover:to-emerald-800 border border-teal-500/70 text-teal-200 transition-colors cursor-pointer"
                title="Low-effort voice intake in Kannada, Hindi, or English with clinical entity extraction"
              >
                <Mic className="w-3.5 h-3.5 text-teal-300 animate-pulse" />
                <span className="hidden md:inline">Voice Intake (P13)</span>
              </button>
            )}

            {/* Prompt 12: Security & Automated E2E Acceptance Suite */}
            {onOpenSecurityAcceptance && (
              <button
                onClick={onOpenSecurityAcceptance}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 transition-colors cursor-pointer"
                title="Open automated 10-Check Acceptance Suite, Privacy Scanner & Penetration Runner"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden md:inline">Security Suite (10/10)</span>
              </button>
            )}

            {/* Prompt 11: External Integration Status & FHIR Boundary */}
            {onOpenIntegrationStatus && (
              <button
                onClick={onOpenIntegrationStatus}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 border border-slate-700 text-teal-300 transition-colors cursor-pointer"
                title="Inspect external integration statuses, missing env keys, and synthetic FHIR R4 adapter"
              >
                <Workflow className="w-3.5 h-3.5 text-teal-400" />
                <span className="hidden md:inline">Integrations</span>
              </button>
            )}

            {/* API & Security Boundary Inspector */}
            <button
              onClick={onOpenInspector}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors cursor-pointer"
              title="Inspect API requests & boundary enforcement"
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden lg:inline">API Inspector</span>
            </button>

            {/* Audit Log Badge Button */}
            <button
              onClick={onOpenAudit}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors cursor-pointer"
              title="View immutable AuditEvent log"
            >
              <FileText className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden sm:inline">Audit Trail</span>
              <span className="px-1.5 py-0.2 bg-teal-500/20 text-teal-300 rounded-full text-[10px] font-mono font-bold">
                {auditCount}
              </span>
            </button>

            {/* Verification Checklist Guide */}
            <button
              onClick={onOpenVerificationGuide}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-rose-600 via-amber-600 to-teal-600 hover:from-rose-500 hover:to-teal-500 text-white shadow-md shadow-rose-900/30 transition-all cursor-pointer"
            >
              <Info className="w-3.5 h-3.5" />
              <span>Verification Rubric</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
