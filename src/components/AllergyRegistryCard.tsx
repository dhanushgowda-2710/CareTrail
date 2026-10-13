import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Tag, 
  ShieldCheck, 
  Calendar, 
  Building2, 
  User, 
  Filter, 
  ArrowUpRight, 
  Sparkles,
  AlertOctagon,
  ChevronDown,
  ChevronUp,
  Info,
  Layers,
  FileCheck2,
  XCircle,
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import { 
  AllergyAssessment, 
  AllergyItem, 
  AllergyDiscrepancy, 
  StaffProfile,
  AllergyReconciliationAction
} from '../types/caretrail';

interface AllergyRegistryCardProps {
  assessment: AllergyAssessment;
  staff: StaffProfile;
  onOpenAllergyDiscrepancyModal: (discrepancy: AllergyDiscrepancy) => void;
  onDirectAllergyAction?: (allergyId: string, action: AllergyReconciliationAction, rationale: string) => void;
}

export const AllergyRegistryCard: React.FC<AllergyRegistryCardProps> = ({
  assessment,
  staff,
  onOpenAllergyDiscrepancyModal,
  onDirectAllergyAction
}) => {
  const [activeTab, setActiveTab] = useState<'ACTIVE_HIGH_RISK' | 'DISCREPANCIES' | 'ALL' | 'CROSS_REACTIVITY' | 'DELABELED'>('ACTIVE_HIGH_RISK');
  const [expandedAllergyId, setExpandedAllergyId] = useState<string | null>('allg-rajesh-penicillin-01');

  const { allergies, discrepancies, metrics, snomedCodingRate, medDraCodingRate, uniiCodingRate } = assessment;
  const unresolvedDiscrepancies = discrepancies.filter(d => d.status === 'UNRESOLVED');

  const getFilteredAllergies = (): AllergyItem[] => {
    switch (activeTab) {
      case 'ACTIVE_HIGH_RISK':
        return allergies.filter(a => a.clinicalStatus === 'ACTIVE' && (a.severity === 'CRITICAL_ANAPHYLAXIS' || a.severity === 'HIGH'));
      case 'DELABELED':
        return allergies.filter(a => a.verificationStatus === 'REFUTED_DELABELED' || a.clinicalStatus === 'REFUTED');
      case 'ALL':
      default:
        return allergies;
    }
  };

  const filteredAllergies = getFilteredAllergies();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-white">Allergy & Adverse Drug Reaction (ADR) Registry</h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-800">
                PROMPT 8 / 14
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-facility immunological reconciliation, MedDRA / SNOMED CT / UNII ontology, and cross-reactivity boundaries.
            </p>
          </div>
        </div>

        {/* Coding Rate Badges */}
        <div className="flex items-center space-x-2 text-[11px]">
          <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 font-mono text-slate-300">
            SNOMED: <strong className="text-teal-400">{snomedCodingRate}</strong>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 font-mono text-slate-300">
            MedDRA: <strong className="text-emerald-400">{medDraCodingRate}</strong>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 font-mono text-slate-300">
            UNII: <strong className="text-indigo-400">{uniiCodingRate}</strong>
          </span>
        </div>
      </div>

      {/* Metric Counters Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 flex flex-col">
          <span className="text-slate-400 text-[11px]">Total Documented</span>
          <span className="text-lg font-bold text-white mt-0.5">{metrics.totalCount}</span>
          <span className="text-[10px] text-slate-400 mt-0.5">Across all facilities</span>
        </div>

        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 flex flex-col">
          <span className="text-slate-400 text-[11px]">Verified Confirmed</span>
          <span className="text-lg font-bold text-emerald-400 mt-0.5">{metrics.confirmedCount}</span>
          <span className="text-[10px] text-emerald-500/80 mt-0.5">Institutional Red Flags</span>
        </div>

        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 flex flex-col">
          <span className="text-slate-400 text-[11px]">Critical Anaphylaxis</span>
          <span className="text-lg font-bold text-rose-400 mt-0.5">{metrics.criticalCount}</span>
          <span className="text-[10px] text-rose-400/80 mt-0.5">Absolute Contraindication</span>
        </div>

        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 flex flex-col">
          <span className="text-slate-400 text-[11px]">De-labeled / Refuted</span>
          <span className="text-lg font-bold text-purple-400 mt-0.5">{metrics.delabeledCount}</span>
          <span className="text-[10px] text-purple-400/80 mt-0.5">Post-challenge clearance</span>
        </div>

        <div className={`p-3 rounded-xl border flex flex-col ${
          unresolvedDiscrepancies.length > 0
            ? 'bg-rose-950/40 border-rose-800 text-rose-300'
            : 'bg-slate-950/80 border-slate-800 text-slate-400'
        }`}>
          <span className="text-[11px]">Discrepancy Conflicts</span>
          <span className={`text-lg font-bold mt-0.5 ${unresolvedDiscrepancies.length > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
            {metrics.unresolvedDiscrepancies}
          </span>
          <span className="text-[10px] mt-0.5">
            {unresolvedDiscrepancies.length > 0 ? 'Action Required' : 'Harmonized'}
          </span>
        </div>
      </div>

      {/* Critical Discrepancy Callout Banner */}
      {unresolvedDiscrepancies.length > 0 && (
        <div className="bg-gradient-to-r from-rose-950/70 via-amber-950/50 to-slate-950 border border-rose-800/80 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white text-xs">
                  {unresolvedDiscrepancies.length} Cross-Facility Allergy Discrepancy Alert(s) Detected
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-900 text-rose-200">
                  Critical Safety Gate
                </span>
              </div>
              <p className="text-slate-300 text-xs mt-1">
                Discordance between hospital baseline records, emergency recall notes, and cross-reactivity safeguards. Launch workbench to resolve.
              </p>
            </div>
          </div>
          <button
            onClick={() => onOpenAllergyDiscrepancyModal(unresolvedDiscrepancies[0])}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors shrink-0 flex items-center space-x-1.5 shadow-md shadow-rose-950 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch Allergy Workbench ({unresolvedDiscrepancies[0].severity})</span>
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('ACTIVE_HIGH_RISK')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center space-x-1.5 shrink-0 ${
            activeTab === 'ACTIVE_HIGH_RISK'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Active High-Risk ({allergies.filter(a => a.clinicalStatus === 'ACTIVE' && (a.severity === 'CRITICAL_ANAPHYLAXIS' || a.severity === 'HIGH')).length})</span>
        </button>

        <button
          onClick={() => setActiveTab('DISCREPANCIES')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center space-x-1.5 shrink-0 ${
            activeTab === 'DISCREPANCIES'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <AlertOctagon className="w-3.5 h-3.5" />
          <span>Discrepancy Alerts ({discrepancies.length})</span>
          {unresolvedDiscrepancies.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('CROSS_REACTIVITY')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center space-x-1.5 shrink-0 ${
            activeTab === 'CROSS_REACTIVITY'
              ? 'bg-teal-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Cross-Reactivity Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center space-x-1.5 shrink-0 ${
            activeTab === 'ALL'
              ? 'bg-slate-700 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span>All Documented ({allergies.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('DELABELED')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center space-x-1.5 shrink-0 ${
            activeTab === 'DELABELED'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>De-labeled / Refuted ({metrics.delabeledCount})</span>
        </button>
      </div>

      {/* Tab 1 & Tab 4: Allergy Items Display */}
      {(activeTab === 'ACTIVE_HIGH_RISK' || activeTab === 'ALL' || activeTab === 'DELABELED') && (
        <div className="space-y-3">
          {filteredAllergies.length === 0 ? (
            <div className="p-8 text-center bg-slate-950/50 rounded-xl border border-slate-800 text-slate-400 text-xs">
              No allergies found under this filter view.
            </div>
          ) : (
            filteredAllergies.map((allergy) => {
              const isExpanded = expandedAllergyId === allergy.id;
              const isPenicillin = allergy.substance.toLowerCase().includes('penicillin');

              return (
                <div 
                  key={allergy.id}
                  className={`bg-slate-950 border rounded-xl overflow-hidden transition-all ${
                    allergy.severity === 'CRITICAL_ANAPHYLAXIS'
                      ? 'border-rose-900/80 shadow-md shadow-rose-950/20'
                      : allergy.verificationStatus === 'REFUTED_DELABELED'
                      ? 'border-purple-900/60 opacity-80'
                      : 'border-slate-800'
                  }`}
                >
                  {/* Card Header Row */}
                  <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-white text-sm">{allergy.substance}</span>
                        <span className="text-slate-400 text-xs">({allergy.genericName})</span>

                        {/* Severity Badge */}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          allergy.severity === 'CRITICAL_ANAPHYLAXIS'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : allergy.severity === 'HIGH'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}>
                          {allergy.severity.replace('_', ' ')}
                        </span>

                        {/* Reaction Type */}
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                          {allergy.reactionType.replace(/_/g, ' ')}
                        </span>

                        {/* Verification Status */}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center space-x-1 ${
                          allergy.verificationStatus === 'CONFIRMED_VERIFIED'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : allergy.verificationStatus === 'REFUTED_DELABELED'
                            ? 'bg-purple-950 text-purple-300 border border-purple-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}>
                          {allergy.verificationStatus === 'CONFIRMED_VERIFIED' ? (
                            <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Info className="w-3 h-3 text-purple-400" />
                          )}
                          <span>{allergy.verificationStatus.replace(/_/g, ' ')}</span>
                        </span>
                      </div>

                      {/* Manifestations Pills */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[11px] text-slate-400 font-medium">Manifestations:</span>
                        {allergy.manifestations.map((m, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-0.5 rounded-full text-[10px] bg-slate-900 border border-slate-700 text-rose-200"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right side controls */}
                    <div className="flex items-center space-x-2 shrink-0">
                      {allergy.crossReactivityRisk.length > 0 && (
                        <button
                          onClick={() => setExpandedAllergyId(isExpanded ? null : allergy.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-teal-300 text-xs font-medium border border-slate-800 flex items-center space-x-1 cursor-pointer"
                        >
                          <span>Cross-Reactivity ({allergy.crossReactivityRisk.length})</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Provenance & Ontological Footprint */}
                  <div className="px-4 py-2.5 bg-slate-900/60 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center space-x-1 text-slate-300">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{allergy.sourceFacility}</span>
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-teal-300 text-[10px]">
                        {allergy.citationLabel}
                      </span>
                      <span className="flex items-center space-x-1 text-slate-400">
                        <User className="w-3.5 h-3.5" />
                        <span>{allergy.documentedBy}</span>
                      </span>
                    </div>

                    {/* Standardized Codes */}
                    <div className="flex items-center space-x-2 font-mono text-[10px]">
                      <span className="text-slate-400">SNOMED: <strong className="text-teal-300">{allergy.snomedCode}</strong></span>
                      <span>•</span>
                      <span className="text-slate-400">MedDRA: <strong className="text-emerald-300">{allergy.medDraCode}</strong></span>
                      <span>•</span>
                      <span className="text-slate-400">UNII: <strong className="text-indigo-300">{allergy.uniiCode}</strong></span>
                    </div>
                  </div>

                  {/* Verification Notes / De-labeling Reason */}
                  {allergy.verificationNotes && (
                    <div className="px-4 py-2 bg-slate-950 border-t border-slate-900 text-[11px] text-slate-400 italic">
                      Clinical Note: {allergy.verificationNotes}
                    </div>
                  )}
                  {allergy.delabelReason && (
                    <div className="px-4 py-2 bg-purple-950/20 border-t border-purple-900/40 text-[11px] text-purple-300">
                      <strong>De-label Justification:</strong> {allergy.delabelReason}
                    </div>
                  )}

                  {/* Expanded Cross-Reactivity Risk Table */}
                  {isExpanded && allergy.crossReactivityRisk.length > 0 && (
                    <div className="p-4 bg-slate-950/90 border-t border-slate-800 space-y-3 animate-in fade-in duration-150">
                      <div className="flex items-center space-x-2 text-teal-300 font-bold text-xs uppercase tracking-wider">
                        <Sparkles className="w-4 h-4 text-teal-400" />
                        <span>Immunological Cross-Reactivity Risk & Safe Substitutions</span>
                      </div>

                      <div className="space-y-2 text-xs">
                        {allergy.crossReactivityRisk.map((cr, idx) => (
                          <div 
                            key={idx}
                            className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <span className="font-semibold text-white">{cr.drugClass}</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  cr.riskLevel === 'HIGH'
                                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                    : cr.riskLevel === 'MODERATE'
                                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                    : cr.riskLevel === 'LOW'
                                    ? 'bg-blue-950 text-blue-300 border border-blue-800'
                                    : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                }`}>
                                  {cr.crossReactivityRate}
                                </span>
                              </div>
                              <p className="text-slate-300 text-[11px]">{cr.clinicalGuidance}</p>
                            </div>

                            {/* Safe Alternatives */}
                            <div className="shrink-0 flex flex-wrap items-center gap-1">
                              <span className="text-[10px] text-emerald-400 font-semibold mr-1">Safe Alts:</span>
                              {cr.safeAlternatives.map((alt, aIdx) => (
                                <span 
                                  key={aIdx}
                                  className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 font-medium"
                                >
                                  {alt}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Discrepancy Alerts View */}
      {activeTab === 'DISCREPANCIES' && (
        <div className="space-y-3">
          {discrepancies.map((disc) => (
            <div 
              key={disc.id}
              className={`p-4 rounded-xl border space-y-3 ${
                disc.status === 'UNRESOLVED'
                  ? 'bg-slate-950 border-rose-800/80 shadow-md'
                  : 'bg-slate-950/60 border-slate-800 opacity-80'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    disc.severity === 'CRITICAL'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {disc.severity} DISCORDANCE
                  </span>
                  <span className="font-bold text-white text-xs">{disc.title}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    disc.status === 'UNRESOLVED'
                      ? 'bg-rose-900/60 text-rose-200'
                      : 'bg-emerald-900/60 text-emerald-200'
                  }`}>
                    {disc.status}
                  </span>
                  {disc.status === 'UNRESOLVED' && (
                    <button
                      onClick={() => onOpenAllergyDiscrepancyModal(disc)}
                      className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Resolve in Workbench</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-slate-300 text-xs leading-relaxed">{disc.description}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                {disc.involvedSources.map((s, idx) => (
                  <div key={idx} className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="font-semibold text-slate-300">{s.facility}</span>
                      <span className="font-mono text-teal-300">{s.citationLabel}</span>
                    </div>
                    <div className="text-slate-200 italic">"{s.reactionDescription}"</div>
                  </div>
                ))}
              </div>

              {disc.resolvedBy && (
                <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-[11px] text-emerald-300 flex items-center justify-between">
                  <span>Reconciled by <strong>{disc.resolvedBy}</strong>: "{disc.rationale}"</span>
                  <span className="font-mono text-slate-400">{disc.resolvedAt?.split('T')[0]}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Cross-Reactivity Matrix View */}
      {activeTab === 'CROSS_REACTIVITY' && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-white text-sm">Beta-Lactam & Antimicrobial Cross-Reactivity Guidance</h3>
              <p className="text-slate-400 text-xs mt-0.5">
                Automated clinical safety matrix based on molecular side-chain homology and IgE epitope recognition.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-teal-950 text-teal-300 border border-teal-800 font-mono text-[11px]">
              Active Patient: Beta-Lactam Sensitive
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-300 text-xs">Aminopenicillins & Penicillins</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-900 text-rose-200">100% CONTRAINDICATED</span>
              </div>
              <p className="text-slate-300 text-[11px]">
                Direct beta-lactam core ring and amino side chain sharing. Strict contraindication for Amoxicillin, Ampicillin, Augmentin, Penicillin V/G.
              </p>
              <div className="text-[11px] text-emerald-400 font-medium">
                Safe Substitutes: Azithromycin 500mg, Clarithromycin 500mg, Doxycycline 100mg.
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-300 text-xs">1st & 2nd Gen Cephalosporins</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-900 text-amber-200">5 - 10% CROSS-REACTIVITY</span>
              </div>
              <p className="text-slate-300 text-[11px]">
                Cephalexin, Cefaclor, Cefuroxime share R1 side chain homology with ampicillin. Avoid in severe anaphylaxis history.
              </p>
              <div className="text-[11px] text-emerald-400 font-medium">
                Safe Substitutes: Levofloxacin 500mg, Ciprofloxacin 500mg.
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-300 text-xs">3rd & 4th Gen Cephalosporins</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-900 text-blue-200">&lt; 2% CROSS-REACTIVITY</span>
              </div>
              <p className="text-slate-300 text-[11px]">
                Ceftriaxone, Cefotaxime, Cefepime possess distinct side chain structures. Permissible with caution or allergy consultation.
              </p>
              <div className="text-[11px] text-emerald-400 font-medium">
                Safe Substitutes: Vancomycin, Teicoplanin for MRSA coverage.
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-300 text-xs">Monobactams (Aztreonam)</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-900 text-emerald-200">NEGLIGIBLE (&lt; 0.1%)</span>
              </div>
              <p className="text-slate-300 text-[11px]">
                Aztreonam possesses a monocyclic beta-lactam ring with zero cross-reactivity to penicillins. Immunologically safe for Gram-negative sepsis.
              </p>
              <div className="text-[11px] text-emerald-400 font-medium">
                Safe Regimen: Aztreonam 1g to 2g IV every 8 hours.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
