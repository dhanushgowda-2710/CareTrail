import React, { useState } from 'react';
import { 
  Sparkles, 
  RotateCw, 
  ShieldCheck, 
  AlertTriangle, 
  Layers, 
  FileText, 
  ExternalLink, 
  Pill, 
  Activity, 
  HeartPulse, 
  Info, 
  CheckCircle2, 
  Eye, 
  ChevronDown, 
  ChevronUp,
  Cpu,
  Bookmark
} from 'lucide-react';
import { 
  ClinicalSynthesisResult, 
  SynthesisFocus, 
  ClinicalCitation, 
  SynthesizedProblem, 
  ReconciledMedication, 
  ClinicalRedFlag,
  PatientProfile
} from '../types/caretrail';

interface AiClinicalSynthesisCardProps {
  patient: PatientProfile;
  synthesis: ClinicalSynthesisResult | null;
  isLoading: boolean;
  onRegenerate: (focus: SynthesisFocus, includeUnverified: boolean) => void;
  onSelectCitation: (citation: ClinicalCitation) => void;
  activeCitationId?: string | null;
}

export const AiClinicalSynthesisCard: React.FC<AiClinicalSynthesisCardProps> = ({
  patient,
  synthesis,
  isLoading,
  onRegenerate,
  onSelectCitation,
  activeCitationId
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'SUMMARY' | 'PROBLEMS' | 'MEDS' | 'REDFLAGS'>('SUMMARY');
  const [currentFocus, setCurrentFocus] = useState<SynthesisFocus>(synthesis?.focus || 'COMPREHENSIVE');
  const [includeUnverified, setIncludeUnverified] = useState<boolean>(
    synthesis ? synthesis.includeUnverified : true
  );

  const handleFocusChange = (focus: SynthesisFocus) => {
    setCurrentFocus(focus);
    onRegenerate(focus, includeUnverified);
  };

  const handleToggleUnverified = () => {
    const nextState = !includeUnverified;
    setIncludeUnverified(nextState);
    onRegenerate(currentFocus, nextState);
  };

  // Helper to render text with interactive citation badges
  const renderTextWithCitations = (text: string, citations: ClinicalCitation[]) => {
    // Matches patterns like [Amsh-001], [Amsh-Labs], [Scan-USG], [Recall-Allergy], etc.
    const parts = text.split(/(\[[A-Za-z0-9_-]+\])/g);

    return parts.map((part, index) => {
      const match = part.match(/^\[([A-Za-z0-9_-]+)\]$/);
      if (match) {
        const label = part;
        const found = citations.find(c => c.label.toLowerCase() === label.toLowerCase());
        const isSelected = found && activeCitationId === found.citationId;

        return (
          <button
            key={index}
            onClick={() => found && onSelectCitation(found)}
            className={`inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded text-[11px] font-mono font-bold tracking-tight transition-all cursor-pointer ${
              isSelected
                ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 scale-105 shadow-md'
                : 'bg-teal-900/80 text-teal-200 border border-teal-500/50 hover:bg-teal-700 hover:text-white'
            }`}
            title={found ? `Source: ${found.recordTitle} (${found.encounterDate} - ${found.hospitalName})` : 'Source Citation'}
          >
            <span>{part}</span>
          </button>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-teal-500/40 rounded-2xl shadow-2xl overflow-hidden mb-6 transition-all">
      {/* Top Bar with AI Copilot Brand & Quick Actions */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-teal-950/90 via-slate-900 to-indigo-950/80 border-b border-teal-800/40 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 p-0.5 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-teal-300 animate-pulse" />
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm text-white tracking-wide flex items-center gap-1.5">
                AI Longitudinal Clinical Synthesis
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center gap-1">
                <Cpu className="w-3 h-3" />
                Prompt 4
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-200 border border-indigo-500/30">
                Grounding & Citations
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Source-linked evidence synthesis across all EHR encounters, scans, and memory recalls.
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-2">
          {/* Strict Verified Only Toggle */}
          <button
            onClick={handleToggleUnverified}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center space-x-1.5 ${
              includeUnverified
                ? 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600'
                : 'bg-emerald-950 text-emerald-200 border-emerald-600 ring-1 ring-emerald-500'
            }`}
            title={includeUnverified ? 'Currently including Tier 4 scans and patient memory recalls' : 'Filtering strictly to verified Tier 2 EHR records'}
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${includeUnverified ? 'text-slate-400' : 'text-emerald-400'}`} />
            <span>{includeUnverified ? 'All Sources (Incl. Recalls)' : 'Strict Tier 2 Verified Only'}</span>
          </button>

          {/* Regenerate Button */}
          <button
            onClick={() => onRegenerate(currentFocus, includeUnverified)}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white shadow-md flex items-center space-x-1.5 disabled:opacity-50 transition-all cursor-pointer"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Synthesizing...' : 'Regenerate'}</span>
          </button>

          {/* Collapse/Expand Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800/60 border border-slate-700 transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Focus Sub-Navigation & Metadata Bar */}
          <div className="px-5 py-2.5 bg-slate-950/60 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            {/* Focus Filter Pills */}
            <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 px-2">Clinical Focus:</span>
              {[
                { id: 'COMPREHENSIVE' as SynthesisFocus, label: 'Full Longitudinal' },
                { id: 'CHRONIC_CARE' as SynthesisFocus, label: 'Cardio-Metabolic' },
                { id: 'MEDICATION_RECONCILIATION' as SynthesisFocus, label: 'Rx Reconciliation' },
                { id: 'RECENT_TRAJECTORY' as SynthesisFocus, label: 'Recent 6 Months' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => handleFocusChange(f.id)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                    currentFocus === f.id
                      ? 'bg-teal-700 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Synthesis Metadata */}
            {synthesis && (
              <div className="flex items-center space-x-3 text-[11px] text-slate-400 font-mono">
                <span>Model: <strong className="text-teal-300 font-sans">{synthesis.modelUsed.split('(')[0].trim()}</strong></span>
                <span>•</span>
                <span>Synthesized: <strong className="text-white">{synthesis.recordsSynthesizedCount} records</strong></span>
                <span>•</span>
                <span>Citations: <strong className="text-amber-300">{synthesis.citations.length} grounded links</strong></span>
              </div>
            )}
          </div>

          {/* Section Navigation Tabs */}
          <div className="px-5 pt-3 border-b border-slate-800 flex items-center space-x-2 text-xs">
            <button
              onClick={() => setActiveTab('SUMMARY')}
              className={`pb-2.5 px-3 font-semibold border-b-2 transition-all flex items-center space-x-1.5 ${
                activeTab === 'SUMMARY'
                  ? 'border-teal-400 text-teal-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Executive Summary & Trajectory</span>
            </button>

            <button
              onClick={() => setActiveTab('PROBLEMS')}
              className={`pb-2.5 px-3 font-semibold border-b-2 transition-all flex items-center space-x-1.5 ${
                activeTab === 'PROBLEMS'
                  ? 'border-teal-400 text-teal-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Synthesized Problem List ({synthesis?.problems.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('MEDS')}
              className={`pb-2.5 px-3 font-semibold border-b-2 transition-all flex items-center space-x-1.5 ${
                activeTab === 'MEDS'
                  ? 'border-teal-400 text-teal-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Pill className="w-3.5 h-3.5" />
              <span>Reconciled Medications ({synthesis?.medications.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('REDFLAGS')}
              className={`pb-2.5 px-3 font-semibold border-b-2 transition-all flex items-center space-x-1.5 ${
                activeTab === 'REDFLAGS'
                  ? 'border-rose-400 text-rose-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Safety Alerts & Red Flags ({synthesis?.redFlags.length || 0})</span>
            </button>
          </div>

          {/* Body Content */}
          <div className="p-5">
            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <div className="w-10 h-10 border-3 border-teal-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-semibold text-slate-200">
                  Synthesizing longitudinal clinical records with source grounding...
                </p>
                <p className="text-xs text-slate-400 font-mono">
                  Cross-referencing Tier 2 EHR, Tier 4 OCR scans, and patient recalls
                </p>
              </div>
            ) : !synthesis ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No clinical synthesis generated yet. Click "Regenerate" above to analyze patient records.
              </div>
            ) : (
              <>
                {/* TAB 1: EXECUTIVE SUMMARY & TRAJECTORY */}
                {activeTab === 'SUMMARY' && (
                  <div className="space-y-4">
                    {/* Executive Summary Card */}
                    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 text-xs leading-relaxed space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-teal-300 uppercase tracking-wider mb-1">
                        <span className="flex items-center gap-1.5">
                          <Bookmark className="w-3.5 h-3.5" />
                          Executive Clinical Synthesis (Grounding Verified)
                        </span>
                        <span className="text-slate-400 font-mono lowercase">
                          Click any [Citation] to inspect original record
                        </span>
                      </div>
                      <p className="text-slate-200 text-xs sm:text-[13px] leading-relaxed">
                        {renderTextWithCitations(synthesis.executiveSummary, synthesis.citations)}
                      </p>
                    </div>

                    {/* Timeline Narrative Milestones */}
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <HeartPulse className="w-3.5 h-3.5 text-teal-400" />
                        Longitudinal Clinical Journey Milestones
                      </div>

                      <div className="grid grid-cols-1 gap-2.5">
                        {synthesis.timelineNarrative.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start space-x-2.5"
                          >
                            <span className="w-5 h-5 rounded-full bg-teal-900/60 text-teal-300 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 border border-teal-700/60">
                              {idx + 1}
                            </span>
                            <div className="flex-1">
                              {renderTextWithCitations(item, synthesis.citations)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: SYNTHESIZED PROBLEM LIST */}
                {activeTab === 'PROBLEMS' && (
                  <div className="space-y-3">
                    <div className="text-xs text-slate-400 flex items-center justify-between">
                      <span>Problem list synthesized across all clinical episodes:</span>
                      <span className="text-[11px] text-teal-400">All conditions mapped to primary encounters</span>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {synthesis.problems.map(prob => (
                        <div
                          key={prob.id}
                          className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all space-y-2"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-bold text-sm text-white">{prob.condition}</h4>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                prob.severity === 'SEVERE'
                                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                  : prob.severity === 'MODERATE'
                                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                  : 'bg-teal-950 text-teal-300 border border-teal-800'
                              }`}>
                                {prob.severity}
                              </span>

                              {prob.isUnverified && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-900/40 text-amber-300 border border-amber-700">
                                  Unverified / Recall
                                </span>
                              )}
                            </div>

                            <div className="text-xs text-slate-400 flex items-center space-x-2">
                              <span>First: <strong className="text-slate-300">{prob.firstDocumentedDate}</strong></span>
                              <span>•</span>
                              <span>Last: <strong className="text-slate-300">{prob.lastUpdatedDate}</strong></span>
                            </div>
                          </div>

                          <p className="text-xs text-slate-300 leading-relaxed">
                            {renderTextWithCitations(prob.clinicalNotes, prob.citations)}
                          </p>

                          {/* Grounded Citation Badges */}
                          <div className="pt-2 border-t border-slate-850 flex items-center flex-wrap gap-1.5">
                            <span className="text-[10px] text-slate-400 uppercase font-semibold">Supporting Evidence:</span>
                            {prob.citations.map((cite, cIdx) => (
                              <button
                                key={cIdx}
                                onClick={() => onSelectCitation(cite)}
                                className="px-2 py-0.5 rounded bg-teal-950 hover:bg-teal-800 text-teal-200 border border-teal-700 text-[11px] font-mono font-semibold transition-colors flex items-center space-x-1 cursor-pointer"
                                title={`Click to view: ${cite.recordTitle}`}
                              >
                                <span>{cite.label}</span>
                                <span className="text-[10px] text-slate-400 font-sans">({cite.hospitalName})</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 3: RECONCILED MEDICATIONS */}
                {activeTab === 'MEDS' && (
                  <div className="space-y-3">
                    <div className="text-xs text-slate-400">
                      Active drug regimens reconciled across institution encounters and self-reports:
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {synthesis.medications.map(med => (
                        <div
                          key={med.id}
                          className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center space-x-2">
                              <Pill className="w-4 h-4 text-teal-400 shrink-0" />
                              <span className="font-bold text-sm text-white">{med.medicineName}</span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-teal-300 border border-slate-700">
                                {med.dosage}
                              </span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-900 text-slate-300 border border-slate-800">
                                {med.frequency}
                              </span>
                            </div>

                            <span className="text-[11px] font-mono text-slate-400">
                              Last Rx: {med.lastPrescribedDate}
                            </span>
                          </div>

                          <div className="text-xs text-slate-300 flex items-center gap-2">
                            <span>Prescribed by:</span>
                            <strong className="text-teal-200">{med.prescribingDoctor}</strong>
                            <span>at</span>
                            <span className="text-slate-200">{med.prescribingHospital}</span>
                          </div>

                          {med.discrepancyNote && (
                            <div className="text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                              {renderTextWithCitations(med.discrepancyNote, med.citations)}
                            </div>
                          )}

                          {/* Citations */}
                          <div className="pt-2 border-t border-slate-850 flex items-center flex-wrap gap-1.5">
                            <span className="text-[10px] text-slate-400 uppercase font-semibold">Evidence Links:</span>
                            {med.citations.map((cite, cIdx) => (
                              <button
                                key={cIdx}
                                onClick={() => onSelectCitation(cite)}
                                className="px-2 py-0.5 rounded bg-teal-950 hover:bg-teal-800 text-teal-200 border border-teal-700 text-[11px] font-mono font-semibold transition-colors flex items-center space-x-1 cursor-pointer"
                              >
                                <span>{cite.label}</span>
                                <span className="text-[10px] text-slate-400 font-sans">({cite.encounterDate})</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 4: SAFETY ALERTS & RED FLAGS */}
                {activeTab === 'REDFLAGS' && (
                  <div className="space-y-3">
                    <div className="text-xs text-slate-400">
                      Clinical red flags and safety gaps synthesized by AI inference engine:
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {synthesis.redFlags.map(rf => (
                        <div
                          key={rf.id}
                          className={`p-4 rounded-xl border space-y-2 ${
                            rf.severity === 'ALERT'
                              ? 'bg-rose-950/40 border-rose-900/80'
                              : rf.severity === 'WARNING'
                              ? 'bg-amber-950/40 border-amber-900/80'
                              : 'bg-cyan-950/40 border-cyan-900/80'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className={`w-4 h-4 shrink-0 ${
                              rf.severity === 'ALERT' ? 'text-rose-400' : rf.severity === 'WARNING' ? 'text-amber-400' : 'text-cyan-400'
                            }`} />
                            <h4 className={`font-bold text-sm ${
                              rf.severity === 'ALERT' ? 'text-rose-200' : rf.severity === 'WARNING' ? 'text-amber-200' : 'text-cyan-200'
                            }`}>
                              {rf.title}
                            </h4>
                          </div>

                          <p className="text-xs text-slate-200 leading-relaxed">
                            {renderTextWithCitations(rf.description, rf.citations)}
                          </p>

                          <div className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 flex items-start space-x-2">
                            <span className="font-bold text-amber-300 text-[11px] uppercase tracking-wider shrink-0 mt-0.5">
                              Recommended Action:
                            </span>
                            <span>{rf.suggestedAction}</span>
                          </div>

                          {/* Citations */}
                          <div className="pt-2 border-t border-slate-850/60 flex items-center flex-wrap gap-1.5">
                            <span className="text-[10px] text-slate-400 uppercase font-semibold">Supporting Evidence:</span>
                            {rf.citations.map((cite, cIdx) => (
                              <button
                                key={cIdx}
                                onClick={() => onSelectCitation(cite)}
                                className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-teal-200 border border-teal-700 text-[11px] font-mono font-semibold transition-colors flex items-center space-x-1 cursor-pointer"
                              >
                                <span>{cite.label}</span>
                                <span className="text-[10px] text-slate-400 font-sans">({cite.hospitalName})</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};
