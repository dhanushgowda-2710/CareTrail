import React, { useState } from 'react';
import { 
  Pill, 
  AlertTriangle, 
  CheckCircle2, 
  Tag, 
  ShieldCheck, 
  Clock, 
  Calendar, 
  Building2, 
  User, 
  Filter, 
  ArrowUpRight, 
  Sparkles,
  AlertOctagon,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  Utensils,
  Ban,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { 
  MedicationReconciliationAssessment, 
  ReconciledMedicationItem, 
  MedicationDiscrepancyAlert,
  StaffProfile, 
  PatientProfile, 
  ClinicalCitation 
} from '../types/caretrail';

interface MedicationReconciliationCardProps {
  patient: PatientProfile;
  assessment: MedicationReconciliationAssessment;
  staff: StaffProfile;
  onSelectCitation: (citation: ClinicalCitation) => void;
  onOpenDiscrepancyModal: (discrepancy: MedicationDiscrepancyAlert) => void;
  onDirectDeprescribe?: (medicationId: string, drugName: string) => void;
}

export const MedicationReconciliationCard: React.FC<MedicationReconciliationCardProps> = ({
  patient,
  assessment,
  staff,
  onSelectCitation,
  onOpenDiscrepancyModal,
  onDirectDeprescribe
}) => {
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'DISCREPANCIES' | 'DEPRESCRIBED' | 'SCHEDULE' | 'ALL'>('ACTIVE');

  const filteredMeds = assessment.activeRegimen.filter(med => {
    if (activeTab === 'ACTIVE') return med.status === 'ACTIVE' || med.status === 'MODIFIED';
    if (activeTab === 'DEPRESCRIBED') return med.status === 'DISCONTINUED';
    if (activeTab === 'ALL') return true;
    return true;
  });

  const unresolvedDiscrepancies = assessment.discrepancies.filter(d => d.status === 'UNRESOLVED');

  return (
    <div className="bg-slate-900 border border-teal-900/80 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-500/10 text-teal-300 border border-teal-500/30 flex items-center gap-1.5 uppercase tracking-wide">
              <Pill className="w-3.5 h-3.5 text-teal-400" />
              Prompt 7 of 14 • Active Regimen
            </span>
            <span className="text-xs text-slate-400 font-mono">
              RxNorm & ATC Harmonization
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-1 flex items-center gap-2">
            <span>Cross-Facility Medication Reconciliation (MedRec)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-3xl">
            Harmonizes multi-source prescriptions across Apollo, Manipal ABDM exchanges, City Health reports, and patient recall. Enforces therapeutic duplication checks, dosage standardization, and clinician-signed deprescribing.
          </p>
        </div>

        {/* Metric Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Active Regimen</div>
            <div className="text-base font-bold text-teal-400 font-mono">
              {assessment.metrics.activeCount}
            </div>
          </div>

          <div className={`px-3 py-1.5 rounded-xl border text-center ${
            assessment.metrics.unresolvedDiscrepancyCount > 0 
              ? 'bg-rose-950/40 border-rose-800 text-rose-300 ring-1 ring-rose-500/30' 
              : 'bg-slate-950 border-slate-800 text-emerald-400'
          }`}>
            <div className="text-[10px] uppercase font-mono">Discrepancies</div>
            <div className="text-base font-bold font-mono">
              {assessment.metrics.unresolvedDiscrepancyCount}
            </div>
          </div>

          <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Deprescribed</div>
            <div className="text-base font-bold text-slate-300 font-mono">
              {assessment.metrics.deprescribedCount}
            </div>
          </div>

          <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 uppercase font-mono">RxNorm / ATC</div>
            <div className="text-base font-bold text-emerald-400 font-mono">
              {assessment.rxNormCodingRate}
            </div>
          </div>
        </div>
      </div>

      {/* Critical Discrepancy Alerts Banner */}
      {unresolvedDiscrepancies.length > 0 && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-rose-950/70 via-slate-950 to-amber-950/60 border border-rose-700/80 shadow-lg space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <AlertOctagon className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-2">
                  <span>{unresolvedDiscrepancies.length} Medication Discrepancies Requiring Reconciliation</span>
                  <span className="px-1.5 py-0.2 bg-rose-900/60 text-rose-200 text-[10px] rounded border border-rose-700">
                    High Clinical Risk
                  </span>
                </div>
                <div className="text-xs text-slate-300 mt-0.5 font-medium">
                  Conflicting prescriptions identified across Apollo EHR and external ABDM records.
                </div>
              </div>
            </div>

            <button
              onClick={() => onOpenDiscrepancyModal(unresolvedDiscrepancies[0])}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/30 transition-all flex items-center justify-center space-x-1.5 cursor-pointer shrink-0"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Launch MedRec Workbench</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
            {unresolvedDiscrepancies.map(disc => (
              <div 
                key={disc.id}
                className="p-3 rounded-lg bg-slate-900/90 border border-rose-900/50 flex flex-col justify-between hover:border-rose-600/80 transition-colors cursor-pointer group"
                onClick={() => onOpenDiscrepancyModal(disc)}
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold text-rose-300 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                      {disc.title}
                    </span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800">
                      {disc.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
                    {disc.description}
                  </p>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-teal-400 font-semibold group-hover:text-teal-300">
                  <span>Reconcile Conflicting Drugs</span>
                  <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-2">
        <div className="flex items-center space-x-1.5 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('ACTIVE')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'ACTIVE'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
            <span>Active Harmonized Regimen ({assessment.metrics.activeCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('SCHEDULE')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'SCHEDULE'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            <span>Daily Schedule View</span>
          </button>

          <button
            onClick={() => setActiveTab('DISCREPANCIES')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'DISCREPANCIES'
                ? 'bg-rose-700 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-300" />
            <span>Discrepancy Alerts ({assessment.metrics.unresolvedDiscrepancyCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('DEPRESCRIBED')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'DEPRESCRIBED'
                ? 'bg-slate-700 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Ban className="w-3.5 h-3.5 text-slate-400" />
            <span>Deprescribed ({assessment.metrics.deprescribedCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'ALL'
                ? 'bg-indigo-700 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span>All Evaluated ({assessment.metrics.totalEvaluated})</span>
          </button>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <Filter className="w-3.5 h-3.5 text-teal-400" />
          <span>Patient: <strong className="text-white">{patient.name}</strong></span>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'SCHEDULE' ? (
        /* DAILY MEDICATION ADMINISTRATION TIMELINE */
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-400" />
              <span><strong>Patient Care Transition Schedule:</strong> Generated for nurse intake, outpatient dispensing, and patient adherence instructions.</span>
            </span>
            <span className="font-mono text-emerald-400 text-[11px] font-bold">Standard 24-Hour Regimen</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Morning 08:00 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-amber-800/40 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <Sunrise className="w-4 h-4" />
                  <span>Morning (08:00)</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Breakfast</span>
              </div>

              <div className="space-y-2">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                  <div className="font-bold text-white">Telmisartan IP 40mg</div>
                  <div className="text-[11px] text-teal-300 mt-0.5">1 Tab • 30m Before Food</div>
                  <div className="text-[10px] text-slate-400 mt-1">Primary BP control</div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                  <div className="font-bold text-white">Ecosprin (Aspirin) 75mg</div>
                  <div className="text-[11px] text-teal-300 mt-0.5">1 Tab • Immediately After Breakfast</div>
                  <div className="text-[10px] text-slate-400 mt-1">Vascular protection</div>
                </div>
              </div>
            </div>

            {/* Afternoon 13:00 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center space-x-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                  <Sun className="w-4 h-4" />
                  <span>Afternoon (13:00)</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Lunch</span>
              </div>

              <div className="p-4 rounded-lg bg-slate-900/40 border border-dashed border-slate-800 text-center text-xs text-slate-500 py-6">
                No midday oral medications scheduled.
              </div>
            </div>

            {/* Evening 19:30 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-indigo-800/40 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center space-x-2 text-indigo-300 font-bold text-xs uppercase tracking-wider">
                  <Sunset className="w-4 h-4" />
                  <span>Evening (19:30)</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Dinner</span>
              </div>

              <div className="space-y-2">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                  <div className="font-bold text-white">Metformin ER 1000mg</div>
                  <div className="text-[11px] text-indigo-300 mt-0.5">1 Tab • With Main Evening Meal</div>
                  <div className="text-[10px] text-slate-400 mt-1">Glycemic control (HbA1c target)</div>
                </div>
              </div>
            </div>

            {/* Bedtime 22:00 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-teal-800/40 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center space-x-2 text-teal-300 font-bold text-xs uppercase tracking-wider">
                  <Moon className="w-4 h-4" />
                  <span>Bedtime (22:00)</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Sleep</span>
              </div>

              <div className="space-y-2">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                  <div className="font-bold text-white">Rosuvastatin IP 10mg</div>
                  <div className="text-[11px] text-teal-300 mt-0.5">1 Tab • At Bedtime</div>
                  <div className="text-[10px] text-slate-400 mt-1">Lipid lowering (LDL &lt; 70 mg/dL)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'DISCREPANCIES' ? (
        /* DISCREPANCY CARDS LIST */
        <div className="space-y-3">
          {assessment.discrepancies.map(disc => (
            <div
              key={disc.id}
              className={`p-4 rounded-xl border transition-all ${
                disc.status === 'UNRESOLVED'
                  ? 'bg-slate-950 border-rose-800/80'
                  : 'bg-slate-950/60 border-slate-800 opacity-80'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white">{disc.title}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                      disc.status === 'UNRESOLVED'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {disc.status}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Type: {disc.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                    {disc.description}
                  </p>
                  <div className="text-xs text-amber-300/90 pt-1">
                    <strong>Action:</strong> {disc.recommendedAction}
                  </div>
                  {disc.justification && (
                    <div className="mt-2 text-[11px] text-emerald-300 bg-emerald-950/30 p-2 rounded border border-emerald-800/40">
                      <strong>Resolved by {disc.resolvedBy}:</strong> {disc.justification}
                    </div>
                  )}
                </div>

                {disc.status === 'UNRESOLVED' && (
                  <button
                    onClick={() => onOpenDiscrepancyModal(disc)}
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shrink-0 cursor-pointer shadow-md"
                  >
                    Resolve Discrepancy
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* MEDICATION CARDS GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredMeds.map(med => {
            const isDiscontinued = med.status === 'DISCONTINUED';
            const isModified = med.status === 'MODIFIED';

            return (
              <div
                key={med.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isDiscontinued
                    ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                    : isModified
                      ? 'bg-slate-950 border-teal-700/80 ring-1 ring-teal-500/30'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Top Bar: RxNorm, ATC, Status */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center space-x-1.5 flex-wrap">
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-bold">
                        RxNorm: {med.rxNormCode}
                      </span>
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-bold">
                        ATC: {med.atcCode}
                      </span>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                      isDiscontinued
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : isModified
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {med.status}
                    </span>
                  </div>

                  {/* Drug Name & Indication */}
                  <div className="font-bold text-white text-sm flex items-center justify-between">
                    <span className={isDiscontinued ? 'line-through text-slate-400' : ''}>
                      {med.name}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-medium">
                    {med.genericName} • <span className="text-slate-300">{med.therapeuticClass}</span>
                  </div>

                  {/* Dosage & Frequency highlight */}
                  <div className="mt-2.5 p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-teal-300 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-700">
                        {med.dosage}
                      </span>
                      <span className="text-slate-200 font-medium">{med.frequency}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">{med.route}</span>
                  </div>

                  {/* Administration Instructions */}
                  <div className="mt-2 text-[11px] text-slate-300 flex items-start gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{med.timing.instructions}</span>
                  </div>

                  {/* Clinician Rationale if present */}
                  {med.clinicianRationale && (
                    <div className="mt-2 text-[11px] text-emerald-300 bg-emerald-950/40 p-2 rounded border border-emerald-800/40">
                      <strong>Reconciliation Note:</strong> {med.clinicianRationale}
                    </div>
                  )}

                  {/* Discrepancy Note if present */}
                  {med.discrepancyNote && !isDiscontinued && (
                    <div className="mt-2 text-[11px] text-rose-300 bg-rose-950/40 p-2 rounded border border-rose-900/40 flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                      <span>{med.discrepancyNote}</span>
                    </div>
                  )}
                </div>

                {/* Footer: Provenance Citation & Actions */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                    <button
                      onClick={() => onSelectCitation({
                        citationId: `cite-${med.id}`,
                        label: med.citationLabel,
                        recordId: med.recordId,
                        recordTitle: med.name,
                        sourceCategory: med.sourceCategory,
                        hospitalName: med.sourceFacility,
                        encounterDate: med.prescribedDate,
                        quoteSnippet: `${med.name} prescribed by ${med.prescribedBy}. Dosage: ${med.dosage}. Indication: ${med.indication}`,
                        verificationStatus: med.sourceCategory === 'INSTITUTIONAL' ? 'VERIFIED' : 'AWAITING_REVIEW'
                      })}
                      className="font-mono text-amber-300 font-bold bg-amber-950/60 hover:bg-amber-900 px-1.5 py-0.5 rounded border border-amber-800/60 transition-colors cursor-pointer flex items-center gap-1"
                      title="Inspect source record"
                    >
                      <span>{med.citationLabel}</span>
                      <ArrowUpRight className="w-2.5 h-2.5" />
                    </button>
                    <span className="truncate max-w-[140px]">{med.sourceFacility}</span>
                  </div>

                  {!isDiscontinued && (
                    <div className="flex items-center space-x-2 shrink-0">
                      {onDirectDeprescribe && (
                        <button
                          onClick={() => onDirectDeprescribe(med.id, med.name)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-950 hover:text-rose-300 hover:border-rose-800 border border-slate-700 text-[11px] text-slate-300 font-medium transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Ban className="w-3 h-3 text-rose-400" />
                          <span>Deprescribe</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Audit info */}
      <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-teal-400" />
          <span>ABDM Digital Health Record Ledger • MedRec Protocol Version 2024.7</span>
        </div>
        <div className="flex items-center space-x-2 text-slate-400">
          <span>Reconciled by: <strong className="text-slate-200">{staff.name}</strong></span>
          <span>•</span>
          <span className="font-mono text-teal-300">{new Date(assessment.reconciledAt).toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};
