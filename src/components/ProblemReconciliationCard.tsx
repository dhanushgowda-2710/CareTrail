import React, { useState } from 'react';
import { 
  ClipboardList, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  Tag, 
  ShieldCheck, 
  Sparkles, 
  Activity, 
  Calendar, 
  Building2, 
  User, 
  Filter, 
  Clock, 
  ArrowUpRight,
  BookOpen,
  Check,
  Stethoscope
} from 'lucide-react';
import { 
  ProblemReconciliationAssessment, 
  ReconciledProblemItem, 
  DiagnosticConflict, 
  ClinicalCitation,
  StaffProfile,
  ProblemClinicalStatus
} from '../types/caretrail';

interface ProblemReconciliationCardProps {
  assessment: ProblemReconciliationAssessment;
  staff: StaffProfile;
  onOpenConflictModal: (conflict: DiagnosticConflict) => void;
  onSelectCitation: (citation: ClinicalCitation) => void;
  onQuickResolveHtnConflict?: () => void;
  onQuickResolveDmConflict?: () => void;
}

export const ProblemReconciliationCard: React.FC<ProblemReconciliationCardProps> = ({
  assessment,
  staff,
  onOpenConflictModal,
  onSelectCitation,
  onQuickResolveHtnConflict,
  onQuickResolveDmConflict
}) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'ACTIVE_CHRONIC' | 'CONFLICTS' | 'UNDER_EVALUATION' | 'RESOLVED'>('ALL');
  const [expandedProblemId, setExpandedProblemId] = useState<string | null>('prob-htn-01');

  // Filter problems
  const filteredProblems = assessment.problems.filter(p => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'ACTIVE_CHRONIC') return p.status === 'ACTIVE' || p.status === 'CHRONIC_MAINTENANCE';
    if (activeTab === 'CONFLICTS') return p.hasConflict;
    if (activeTab === 'UNDER_EVALUATION') return p.status === 'UNDER_EVALUATION' || p.status === 'RULE_OUT';
    if (activeTab === 'RESOLVED') return p.status === 'RESOLVED' || p.status === 'INACTIVE';
    return true;
  });

  const getStatusBadge = (status: ProblemClinicalStatus) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">Active</span>;
      case 'CHRONIC_MAINTENANCE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-950 text-teal-300 border border-teal-800">Chronic Maintenance</span>;
      case 'UNDER_EVALUATION':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">Under Evaluation</span>;
      case 'RESOLVED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">Resolved</span>;
      case 'RULE_OUT':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800">Rule-Out</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">{status}</span>;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-rose-900/60 text-rose-200">Critical</span>;
      case 'SEVERE':
        return <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-orange-900/60 text-orange-200">Severe</span>;
      case 'MODERATE':
        return <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-amber-900/60 text-amber-200">Moderate</span>;
      case 'MILD':
      default:
        return <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">Mild</span>;
    }
  };

  return (
    <div className="bg-slate-900 border border-amber-800/60 rounded-2xl p-5 shadow-xl space-y-5 animate-in fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-600 to-teal-600 text-white shadow-md shadow-amber-900/30">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                Prompt 6: Clinical Problem List & Reconciliation
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800 font-mono">
                ICD-10 & SNOMED CT
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">
              Multi-Facility Diagnostic Reconciliation & Problem Registry
            </h3>
          </div>
        </div>

        {/* Coding & Compliance Metrics */}
        <div className="flex items-center space-x-2 text-xs">
          <div className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>ICD-10 Mapped: <strong className="text-emerald-400 font-mono">{assessment.icd10CodingRate}</strong></span>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 flex items-center space-x-1.5">
            <Tag className="w-3.5 h-3.5 text-teal-400" />
            <span>SNOMED: <strong className="text-teal-400 font-mono">{assessment.snomedCodingRate}</strong></span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="text-[10px] text-slate-400">Total Canonical Problems</div>
          <div className="text-xl font-bold text-white font-mono mt-0.5">{assessment.totalProblemsCount}</div>
          <div className="text-[10px] text-teal-400 mt-0.5">Multi-Facility Reconciled</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/80 border border-teal-900/60">
          <div className="text-[10px] text-slate-400">Active & Chronic</div>
          <div className="text-xl font-bold text-teal-300 font-mono mt-0.5">{assessment.activeProblemsCount + assessment.chronicCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">{assessment.activeProblemsCount} Active, {assessment.chronicCount} Chronic</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/80 border border-amber-900/60">
          <div className="text-[10px] text-slate-400">Diagnostic Discrepancies</div>
          <div className="text-xl font-bold text-amber-300 font-mono mt-0.5">{assessment.conflicts.length}</div>
          <div className="text-[10px] text-amber-400 mt-0.5">{assessment.unresolvedConflictsCount} Pending Review</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/80 border border-purple-900/60">
          <div className="text-[10px] text-slate-400">Under Evaluation / Rule-Out</div>
          <div className="text-xl font-bold text-purple-300 font-mono mt-0.5">{assessment.underEvaluationCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Renal GFR Workup</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-900/60">
          <div className="text-[10px] text-slate-400">Resolved / Historical</div>
          <div className="text-xl font-bold text-emerald-300 font-mono mt-0.5">{assessment.resolvedCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Childhood Wheeze</div>
        </div>
      </div>

      {/* Cross-Facility Diagnostic Conflicts Banner */}
      {assessment.conflicts.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Cross-Hospital Diagnostic Discrepancies Detected ({assessment.conflicts.length})
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Disparate terminology & severity between hospitals requiring attending sign-off
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {assessment.conflicts.map(conflict => (
              <div 
                key={conflict.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  conflict.status === 'RESOLVED'
                    ? 'bg-emerald-950/20 border-emerald-800/60'
                    : 'bg-amber-950/30 border-amber-800/70 shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/40 text-amber-300 border border-amber-800">
                        {conflict.discrepancyType}
                      </span>
                      {conflict.status === 'RESOLVED' ? (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-900 text-emerald-200 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Resolved
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-900 text-amber-200 animate-pulse">
                          Requires Sign-off
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-white text-xs mt-1.5">{conflict.title}</h4>
                    <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                      {conflict.description}
                    </p>
                  </div>
                </div>

                {/* Conflicting Source Excerpts */}
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="truncate max-w-[180px]">{conflict.conflictingItems[0]?.sourceFacility.split(' ')[0]} EHR:</span>
                    <strong className="text-teal-300 font-mono text-[10px]">{conflict.conflictingItems[0]?.documentedTerm}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="truncate max-w-[180px]">{conflict.conflictingItems[1]?.sourceFacility.split(' ')[0]} EHR:</span>
                    <strong className="text-amber-300 font-mono text-[10px]">{conflict.conflictingItems[1]?.documentedTerm}</strong>
                  </div>
                </div>

                {/* Resolution Status or Action */}
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  {conflict.status === 'RESOLVED' ? (
                    <div className="text-[11px] text-emerald-300">
                      <span>Prevailing: <strong className="text-white font-semibold">{conflict.chosenTerm}</strong></span>
                      <div className="text-[10px] text-slate-400">Signed by {conflict.resolvedByStaffName}</div>
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-400">ABDM Guideline: Clinical reconciliation required</span>
                  )}

                  <button
                    onClick={() => onOpenConflictModal(conflict)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/60 text-amber-200 transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    <span>{conflict.status === 'RESOLVED' ? 'Re-examine Decision' : 'Resolve Conflict'}</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-slate-800">
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs gap-1">
          {[
            { id: 'ALL', label: `All Problems (${assessment.problems.length})` },
            { id: 'ACTIVE_CHRONIC', label: `Active & Chronic (${assessment.activeProblemsCount + assessment.chronicCount})` },
            { id: 'CONFLICTS', label: `With Conflicts (${assessment.conflicts.length})` },
            { id: 'UNDER_EVALUATION', label: `Under Evaluation (${assessment.underEvaluationCount})` },
            { id: 'RESOLVED', label: `Resolved (${assessment.resolvedCount})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-[11px] text-slate-400">
          Showing {filteredProblems.length} of {assessment.problems.length} canonical diagnoses
        </div>
      </div>

      {/* Problem Cards List */}
      <div className="space-y-3">
        {filteredProblems.map(problem => {
          const isExpanded = expandedProblemId === problem.id;

          return (
            <div 
              key={problem.id}
              className={`rounded-xl border transition-all ${
                problem.hasConflict && problem.conflictDetails?.status === 'UNRESOLVED'
                  ? 'bg-slate-950 border-amber-800/80 shadow-md'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Card Summary Header */}
              <div 
                onClick={() => setExpandedProblemId(isExpanded ? null : problem.id)}
                className="p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer"
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-teal-400 shrink-0 mt-0.5">
                    <Stethoscope className="w-4 h-4" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-white text-sm">{problem.canonicalCondition}</h4>
                      {getStatusBadge(problem.status)}
                      {getSeverityBadge(problem.severity)}
                      {problem.isUnverified && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                          Unverified Recall
                        </span>
                      )}
                    </div>

                    {/* Ontology Codes Pill Strip */}
                    <div className="mt-1.5 flex items-center gap-2 flex-wrap text-xs">
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800 flex items-center gap-1 font-semibold">
                        <Tag className="w-3 h-3 text-blue-400" />
                        <span>ICD-10: <strong>{problem.icd10.code}</strong> ({problem.icd10.display})</span>
                      </span>

                      <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-teal-950/80 text-teal-300 border border-teal-800 flex items-center gap-1 font-semibold">
                        <span>SNOMED: <strong>{problem.snomed.conceptId}</strong></span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Metadata */}
                <div className="flex items-center space-x-3 text-xs shrink-0 md:text-right">
                  <div>
                    <div className="text-slate-400 text-[11px] flex items-center gap-1 md:justify-end">
                      <Building2 className="w-3 h-3 text-slate-500" />
                      <span>{problem.originatingHospital.split(' ')[0]}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      Since {problem.firstDocumentedDate}
                    </div>
                  </div>

                  {/* Conflict indicator button */}
                  {problem.hasConflict && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (problem.conflictDetails) onOpenConflictModal(problem.conflictDetails);
                      }}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                        problem.conflictDetails?.status === 'RESOLVED'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border-amber-700 animate-pulse'
                      }`}
                    >
                      {problem.conflictDetails?.status === 'RESOLVED' ? 'Conflict Resolved' : 'Resolve Discrepancy'}
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded Details Section */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-slate-800/80 space-y-3.5 text-xs text-slate-300 bg-slate-900/40">
                  {/* Clinical Description & Synthesis Note */}
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Clinical Reconciliation Findings:
                    </div>
                    <p className="text-slate-200 leading-relaxed bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                      {problem.clinicalNotes}
                    </p>
                  </div>

                  {/* Grounded Citation Provenance Badges */}
                  {problem.citations.length > 0 && (
                    <div>
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-teal-400" />
                        <span>Source Grounding Citations ({problem.citations.length} primary records):</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {problem.citations.map(c => (
                          <button
                            key={c.citationId}
                            onClick={() => onSelectCitation(c)}
                            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-teal-800/70 text-teal-300 font-mono text-[11px] flex items-center space-x-1.5 transition-colors cursor-pointer"
                          >
                            <span className="font-bold">{c.label}</span>
                            <span className="text-slate-400 text-[10px]">({c.hospitalName.split(' ')[0]})</span>
                            <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Structured Treatment Goals */}
                  {problem.treatmentGoals.length > 0 && (
                    <div>
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                        Longitudinal Care Pathway & Management Goals:
                      </div>
                      <ul className="space-y-1">
                        {problem.treatmentGoals.map((goal, idx) => (
                          <li key={idx} className="flex items-start space-x-2 text-slate-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{goal}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Resolution History Banner if resolved */}
                  {problem.resolutionHistory && (
                    <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/60 text-emerald-200 flex items-start space-x-2.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-white text-xs">
                          Attending Clinician Resolution Recorded:
                        </div>
                        <div className="text-[11px] text-slate-300 mt-0.5">
                          "{problem.resolutionHistory.justification}"
                        </div>
                        <div className="text-[10px] text-emerald-400 mt-1 font-mono">
                          Reconciled by {problem.resolutionHistory.resolvedByStaffName} at {new Date(problem.resolutionHistory.resolvedAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
