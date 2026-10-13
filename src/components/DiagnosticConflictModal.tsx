import React, { useState } from 'react';
import { 
  AlertTriangle, 
  X, 
  CheckCircle2, 
  Building2, 
  Calendar, 
  User, 
  FileText, 
  Stethoscope,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { DiagnosticConflict, StaffProfile, ProblemClinicalStatus } from '../types/caretrail';

interface DiagnosticConflictModalProps {
  isOpen: boolean;
  onClose: () => void;
  conflict: DiagnosticConflict | null;
  staff: StaffProfile;
  onResolveConflict: (conflictId: string, chosenTerm: string, targetStatus: ProblemClinicalStatus, justification: string) => void;
}

export const DiagnosticConflictModal: React.FC<DiagnosticConflictModalProps> = ({
  isOpen,
  onClose,
  conflict,
  staff,
  onResolveConflict
}) => {
  if (!isOpen || !conflict) return null;

  const itemA = conflict.conflictingItems[0];
  const itemB = conflict.conflictingItems[1];

  const defaultTerm = itemA?.documentedTerm || '';
  const [selectedTerm, setSelectedTerm] = useState<string>(defaultTerm);
  const [customTerm, setCustomTerm] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [targetStatus, setTargetStatus] = useState<ProblemClinicalStatus>('CHRONIC_MAINTENANCE');
  const [justification, setJustification] = useState<string>(
    conflict.id === 'conflict-htn-001'
      ? 'Primary Essential Hypertension reconciled following normal renal Doppler and stable blood pressure response to Telmisartan monotherapy.'
      : 'Type 2 Diabetes Mellitus established based on documented HbA1c 7.8% and ongoing oral hypoglycemic pharmacotherapy.'
  );

  const handleResolve = () => {
    const finalTerm = isCustom ? (customTerm.trim() || selectedTerm) : selectedTerm;
    if (!justification.trim()) {
      alert('Clinical rationale is mandatory for ABDM conflict reconciliation.');
      return;
    }
    onResolveConflict(conflict.id, finalTerm, targetStatus, justification.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-amber-600/60 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                  Prompt 6: Diagnostic Conflict Resolution
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700 font-mono">
                  {conflict.discrepancyType}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">{conflict.title}</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs text-slate-300">
          <p className="text-slate-300 leading-relaxed bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            {conflict.description}
          </p>

          {/* Conflicting Evidence Side-by-Side */}
          <div>
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-teal-400" />
              <span>Multi-Facility Discrepancy Evidence</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {conflict.conflictingItems.map((item, idx) => (
                <div 
                  key={idx}
                  className={`p-3.5 rounded-xl border transition-all ${
                    (!isCustom && selectedTerm === item.documentedTerm)
                      ? 'bg-amber-950/40 border-amber-500/70 ring-1 ring-amber-500/50'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-2">
                    <span className="font-mono font-bold text-amber-400">Source {idx + 1} ({item.sourceCategory})</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-teal-300 font-mono text-[10px]">
                      {item.citationLabel}
                    </span>
                  </div>

                  <div className="font-bold text-white text-sm mb-1.5">{item.documentedTerm}</div>

                  <div className="space-y-1 text-[11px] text-slate-400 mb-2.5">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3 h-3 text-slate-500" />
                      <span className="truncate">{item.sourceFacility}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User className="w-3 h-3 text-slate-500" />
                      <span>{item.clinicianName}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span>{item.date}</span>
                    </div>
                  </div>

                  <div className="p-2 rounded bg-slate-900 border border-slate-800/80 text-slate-300 text-[11px] italic">
                    "{item.clinicalExcerpt}"
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTerm(item.documentedTerm);
                      setIsCustom(false);
                    }}
                    className={`mt-3 w-full py-1.5 px-2.5 rounded-lg font-semibold text-[11px] flex items-center justify-center space-x-1.5 transition-all ${
                      (!isCustom && selectedTerm === item.documentedTerm)
                        ? 'bg-amber-500 text-black shadow-md'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    <span>Adopt this Formulation</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Resolution Guideline */}
          <div className="p-3 bg-teal-950/40 border border-teal-800/60 rounded-xl text-teal-200 flex items-start space-x-2.5">
            <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-teal-300 uppercase tracking-wider text-[10px] block">
                Clinical Informatics Recommendation
              </span>
              <p className="mt-0.5 text-slate-300">{conflict.recommendedResolution}</p>
            </div>
          </div>

          {/* Clinician Decision Section */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-amber-400" />
              <span>Attending Clinician Reconciliation</span>
            </h4>

            {/* Custom formulation toggle */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="custom-toggle"
                checked={isCustom}
                onChange={e => setIsCustom(e.target.checked)}
                className="rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-slate-800"
              />
              <label htmlFor="custom-toggle" className="text-xs text-slate-300 cursor-pointer">
                Enter synthesized custom diagnostic nomenclature
              </label>
            </div>

            {isCustom && (
              <input
                type="text"
                value={customTerm}
                onChange={e => setCustomTerm(e.target.value)}
                placeholder="e.g. Essential Hypertension with secondary renovascular etiology ruled out"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            )}

            {/* Clinical Status Selection */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                Target Clinical Status:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'CHRONIC_MAINTENANCE', label: 'Chronic Maintenance' },
                  { id: 'ACTIVE', label: 'Active (Acute)' },
                  { id: 'UNDER_EVALUATION', label: 'Under Evaluation' },
                  { id: 'RESOLVED', label: 'Resolved' }
                ].map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setTargetStatus(s.id as ProblemClinicalStatus)}
                    className={`py-1.5 px-2.5 rounded-lg text-[11px] font-semibold border transition-all ${
                      targetStatus === s.id
                        ? 'bg-amber-600/30 border-amber-500 text-amber-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mandatory Rationale */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                Mandatory Clinical Justification (Logged to ABDM Audit Trail):
              </label>
              <textarea
                value={justification}
                onChange={e => setJustification(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                placeholder="Provide medical basis for prevailing diagnosis choice..."
              />
            </div>

            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>Authorizing Attending Clinician: <strong className="text-white">{staff.name}</strong> ({staff.hospitalName})</span>
              <span className="font-mono text-teal-400">ICD-10 Mapping Preserved</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleResolve}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-600 to-teal-600 hover:from-amber-500 hover:to-teal-500 text-white shadow-lg shadow-amber-900/30 flex items-center space-x-2 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Commit Problem Reconciliation</span>
          </button>
        </div>
      </div>
    </div>
  );
};
