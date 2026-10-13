import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Copy, 
  CheckCircle2, 
  XCircle, 
  Activity, 
  Pill, 
  BookmarkCheck, 
  ChevronRight, 
  Sparkles, 
  RotateCw, 
  FileText,
  Sliders,
  Send,
  HelpCircle,
  Eye,
  Check
} from 'lucide-react';
import { 
  PatientProfile, 
  MedicalRecord, 
  StaffProfile, 
  CdsAlert, 
  CdsSimulationInput, 
  CdsSimulationResult, 
  ClinicalCitation,
  PatientCdsAssessment
} from '../types/caretrail';

interface CdsSafetyGuardianCardProps {
  patient: PatientProfile;
  assessment: PatientCdsAssessment;
  staff: StaffProfile;
  onSelectCitation: (citation: ClinicalCitation) => void;
  onOpenOverrideModal: (alert: CdsAlert) => void;
  onOpenTrajectoryModal: () => void;
  onSimulateOrder: (input: CdsSimulationInput) => CdsSimulationResult;
  lastSimulationResult: CdsSimulationResult | null;
}

export const CdsSafetyGuardianCard: React.FC<CdsSafetyGuardianCardProps> = ({
  patient,
  assessment,
  staff,
  onSelectCitation,
  onOpenOverrideModal,
  onOpenTrajectoryModal,
  onSimulateOrder,
  lastSimulationResult
}) => {
  const [activeTab, setActiveTab] = useState<'ALERTS' | 'SIMULATOR'>('ALERTS');
  const [simMedName, setSimMedName] = useState<string>('Amoxicillin Tablets IP');
  const [simDosage, setSimDosage] = useState<string>('500 mg');
  const [simFrequency, setSimFrequency] = useState<string>('Three times daily');
  const [currentSimResult, setCurrentSimResult] = useState<CdsSimulationResult | null>(lastSimulationResult);

  const activeAlerts = assessment.activeAlerts;
  const criticalCount = assessment.metrics.criticalCount;
  const duplicationCount = assessment.metrics.duplicationCount;

  const handleRunSimulation = (medName?: string, dosage?: string) => {
    const name = medName || simMedName;
    const dose = dosage || simDosage;
    const res = onSimulateOrder({
      medicineName: name,
      dosage: dose,
      frequency: simFrequency
    });
    setCurrentSimResult(res);
    setActiveTab('SIMULATOR');
  };

  return (
    <div className="bg-slate-900 border border-teal-600/60 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Top Banner & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-start space-x-3">
          <div className="p-2.5 bg-gradient-to-br from-rose-500/20 via-amber-500/20 to-teal-500/20 border border-rose-500/40 rounded-xl text-rose-300 shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5 text-rose-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2 flex-wrap">
              <span className="font-bold text-sm text-white uppercase tracking-wider">
                Prompt 5: Clinical Decision Support & Drug Safety Guardian
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-800">
                Rule Engine + AI Verification
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-950 text-teal-300 border border-teal-800">
                Grounded CDS
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Real-time cross-facility contraindication detection, allergy cross-reactivity screening, multi-institutional duplication alerts, and pre-order prescription simulation.
            </p>
          </div>
        </div>

        {/* Action Buttons: Tab Switcher & Flowsheet */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setActiveTab('ALERTS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1 ${
              activeTab === 'ALERTS'
                ? 'bg-rose-900/80 text-white border border-rose-700 shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Active Alerts ({activeAlerts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('SIMULATOR')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1 ${
              activeTab === 'SIMULATOR'
                ? 'bg-gradient-to-r from-teal-600 to-indigo-600 text-white shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Pill className="w-3.5 h-3.5 text-teal-400" />
            <span>Order Safety Simulator</span>
          </button>

          <button
            onClick={onOpenTrajectoryModal}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 transition-colors cursor-pointer flex items-center space-x-1"
            title="Inspect longitudinal lab and vital trends across healthcare facilities"
          >
            <Activity className="w-3.5 h-3.5 text-teal-400" />
            <span>Lab Trajectories</span>
          </button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-400">Critical Contraindications</div>
            <div className="font-bold text-rose-300 font-mono">{criticalCount} Identified</div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-400">Therapeutic Duplications</div>
            <div className="font-bold text-amber-300 font-mono">{duplicationCount} Multi-Facility</div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-400">Organ Monitoring Gaps</div>
            <div className="font-bold text-indigo-300 font-mono">1 Hepatic Review</div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-400">Audit Attribution</div>
            <div className="font-bold text-emerald-300 font-mono">Enforced (NABH)</div>
          </div>
        </div>
      </div>

      {/* TAB 1: ACTIVE CDS ALERTS */}
      {activeTab === 'ALERTS' && (
        <div className="space-y-3">
          {activeAlerts.length === 0 ? (
            <div className="p-6 text-center bg-slate-950/60 rounded-xl border border-slate-800 text-slate-400 text-xs">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1.5" />
              <span>No active contraindications or critical drug interactions identified for this patient.</span>
            </div>
          ) : (
            activeAlerts.map((alert) => {
              const isCritical = alert.severity === 'CRITICAL_CONTRAINDICATION';
              const isDuplication = alert.severity === 'THERAPEUTIC_DUPLICATION';

              return (
                <div
                  key={alert.id}
                  className={`p-4 rounded-xl border transition-all ${
                    alert.isOverridden
                      ? 'bg-slate-950/50 border-slate-800 opacity-75'
                      : isCritical
                      ? 'bg-rose-950/30 border-rose-800/80 shadow-rose-950/40 shadow-sm'
                      : isDuplication
                      ? 'bg-amber-950/30 border-amber-800/80'
                      : 'bg-slate-950/80 border-slate-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                          alert.isOverridden
                            ? 'bg-slate-800 text-slate-400 border-slate-700'
                            : isCritical
                            ? 'bg-rose-950 text-rose-300 border-rose-800'
                            : isDuplication
                            ? 'bg-amber-950 text-amber-300 border-amber-800'
                            : 'bg-indigo-950 text-indigo-300 border-indigo-800'
                        }`}>
                          {alert.isOverridden ? 'OVERRIDDEN BY CLINICIAN' : alert.severity.replace(/_/g, ' ')}
                        </span>

                        <span className="font-bold text-sm text-slate-100">
                          {alert.title}
                        </span>
                      </div>

                      {/* Mechanism explanation */}
                      <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                        {alert.clinicalMechanism}
                      </p>

                      {/* Conflict details */}
                      <div className="flex items-center space-x-3 text-xs text-slate-400 flex-wrap pt-1">
                        <div>
                          <span className="font-semibold text-slate-300">Offending Agent: </span>
                          <span className="text-rose-300 font-mono">{alert.offendingAgent}</span>
                        </div>
                        <div>•</div>
                        <div>
                          <span className="font-semibold text-slate-300">Conflicting Evidence: </span>
                          <button
                            onClick={() => onSelectCitation(alert.evidenceCitation)}
                            className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-mono text-[11px] font-bold hover:bg-amber-900 transition-colors cursor-pointer ml-1"
                            title="Click to inspect primary clinical proof in chart"
                          >
                            <BookmarkCheck className="w-3 h-3 text-amber-400" />
                            <span>{alert.evidenceCitation.label}</span>
                          </button>
                        </div>
                      </div>

                      {/* Suggested Clinical Alternative */}
                      <div className="mt-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-emerald-300">Recommended Alternative: </span>
                          <span className="text-slate-300">{alert.suggestedAlternative}</span>
                        </div>
                      </div>

                      {/* Overridden Documentation */}
                      {alert.isOverridden && (
                        <div className="mt-2 p-2.5 rounded-lg bg-amber-950/40 border border-amber-800 text-xs text-amber-200">
                          <span className="font-bold">Clinician Override Active: </span>
                          <span>{alert.overrideReason}</span>
                          <div className="text-[11px] text-amber-400 mt-0.5 font-mono">
                            Authorized by {alert.overrideStaffName} at {new Date(alert.overrideTimestamp || '').toLocaleTimeString()}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Override Button */}
                    <div className="shrink-0 pt-1">
                      {!alert.isOverridden ? (
                        <button
                          onClick={() => onOpenOverrideModal(alert)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Override Alert
                        </button>
                      ) : (
                        <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-400 text-xs font-mono">
                          Overridden
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: PRE-ORDER PRESCRIPTION SIMULATOR */}
      {activeTab === 'SIMULATOR' && (
        <div className="space-y-4">
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-teal-400" />
                <span className="font-bold text-xs text-white uppercase tracking-wider">
                  Pre-Order Prescription Safety Sandbox
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Tests proposed drug orders against all multi-source records
              </span>
            </div>

            {/* Quick 1-Click Simulation Scenario Presets */}
            <div className="flex items-center flex-wrap gap-1.5 text-xs">
              <span className="text-slate-400 text-[11px] mr-1">1-Click Test Scenarios:</span>
              <button
                onClick={() => {
                  setSimMedName('Amoxicillin Tablets IP');
                  setSimDosage('500 mg');
                  handleRunSimulation('Amoxicillin Tablets IP', '500 mg');
                }}
                className="px-2.5 py-1 rounded bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-200 font-mono text-[11px] font-semibold transition-colors cursor-pointer"
                title="Test ordering Penicillin/Amoxicillin for Rajesh (Triggers Critical Allergy Block)"
              >
                1. Test Amoxicillin 500mg (Allergy Block)
              </button>

              <button
                onClick={() => {
                  setSimMedName('Rosuvastatin IP');
                  setSimDosage('10 mg');
                  handleRunSimulation('Rosuvastatin IP', '10 mg');
                }}
                className="px-2.5 py-1 rounded bg-amber-950/80 hover:bg-amber-900 border border-amber-800 text-amber-200 font-mono text-[11px] font-semibold transition-colors cursor-pointer"
                title="Test ordering Rosuvastatin (Triggers Statin Duplication with Apollo Atorvastatin)"
              >
                2. Test Rosuvastatin 10mg (Duplication)
              </button>

              <button
                onClick={() => {
                  setSimMedName('Diclofenac Sodium');
                  setSimDosage('50 mg');
                  handleRunSimulation('Diclofenac Sodium', '50 mg');
                }}
                className="px-2.5 py-1 rounded bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-800 text-indigo-200 font-mono text-[11px] font-semibold transition-colors cursor-pointer"
                title="Test ordering NSAID on renal patient (Triggers CKD Contraindication)"
              >
                3. Test Diclofenac (Nephrotoxicity)
              </button>

              <button
                onClick={() => {
                  setSimMedName('Azithromycin Tablets IP');
                  setSimDosage('500 mg');
                  handleRunSimulation('Azithromycin Tablets IP', '500 mg');
                }}
                className="px-2.5 py-1 rounded bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-emerald-200 font-mono text-[11px] font-semibold transition-colors cursor-pointer"
                title="Test ordering safe macrolide alternative"
              >
                4. Test Azithromycin (Safe)
              </button>
            </div>

            {/* Custom Input Form */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800/80">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Candidate Medication Name</label>
                <input
                  type="text"
                  value={simMedName}
                  onChange={(e) => setSimMedName(e.target.value)}
                  placeholder="e.g. Augmentin 625mg"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Target Dosage</label>
                <input
                  type="text"
                  value={simDosage}
                  onChange={(e) => setSimDosage(e.target.value)}
                  placeholder="e.g. 500 mg"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => handleRunSimulation()}
                  className="w-full py-2 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Run Live Safety Screening</span>
                </button>
              </div>
            </div>
          </div>

          {/* Simulation Output Card */}
          {currentSimResult && (
            <div className={`p-4 rounded-xl border animate-in fade-in space-y-3 ${
              currentSimResult.safetyScore === 'CONTRAINDICATED'
                ? 'bg-rose-950/40 border-rose-700/80'
                : currentSimResult.safetyScore === 'CAUTION'
                ? 'bg-amber-950/40 border-amber-700/80'
                : 'bg-emerald-950/40 border-emerald-700/80'
            }`}>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm text-white">
                    Screening Result: {currentSimResult.proposedMedication} ({currentSimResult.dosage})
                  </span>
                </div>

                <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold border ${
                  currentSimResult.safetyScore === 'CONTRAINDICATED'
                    ? 'bg-rose-950 text-rose-300 border-rose-800'
                    : currentSimResult.safetyScore === 'CAUTION'
                    ? 'bg-amber-950 text-amber-300 border-amber-800'
                    : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                }`}>
                  {currentSimResult.safetyScore === 'CONTRAINDICATED' && '❌ ORDER BLOCKED'}
                  {currentSimResult.safetyScore === 'CAUTION' && '⚠️ CAUTION ADVISED'}
                  {currentSimResult.safetyScore === 'SAFE' && '✅ SAFE FOR ORDER ENTRY'}
                </span>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed">
                {currentSimResult.summary}
              </p>

              {/* Specific Simulation Alerts with Citations */}
              {currentSimResult.alerts.length > 0 && (
                <div className="space-y-2 pt-1">
                  {currentSimResult.alerts.map((al, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-rose-300">{al.title}</span>
                        <button
                          onClick={() => onSelectCitation(al.evidenceCitation)}
                          className="text-[11px] font-mono text-amber-300 hover:underline flex items-center gap-1 cursor-pointer font-bold"
                        >
                          <BookmarkCheck className="w-3 h-3 text-amber-400" />
                          <span>{al.evidenceCitation.label}</span>
                        </button>
                      </div>
                      <p className="text-slate-300 text-[11px]">{al.clinicalMechanism}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Recommended Safe Alternatives */}
              {currentSimResult.recommendedAlternatives.length > 0 && (
                <div className="pt-2 border-t border-slate-800/80">
                  <div className="text-[11px] font-bold text-teal-300 uppercase tracking-wider mb-2">
                    Evidence-Based Clinical Alternatives:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {currentSimResult.recommendedAlternatives.map((alt, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                        <div className="font-bold text-white">{alt.medicineName}</div>
                        <div className="text-teal-300 font-mono text-[11px]">{alt.dosage}</div>
                        <div className="text-slate-400 text-[11px] mt-1">{alt.rationale}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
