import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Building2, 
  Calendar, 
  User, 
  FileText, 
  ShieldCheck,
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Info,
  ShieldAlert
} from 'lucide-react';
import { 
  AllergyDiscrepancy, 
  StaffProfile, 
  AllergyReconciliationAction,
  AllergyVerificationStatus,
  AllergyReactionType
} from '../types/caretrail';

interface AllergyReconciliationModalProps {
  isOpen: boolean;
  onClose: () => void;
  discrepancy: AllergyDiscrepancy | null;
  staff: StaffProfile;
  onResolveDiscrepancy: (
    discrepancyId: string,
    action: AllergyReconciliationAction,
    targetSubstance: string,
    newStatus: AllergyVerificationStatus,
    newReactionType: AllergyReactionType,
    rationale: string
  ) => void;
}

export const AllergyReconciliationModal: React.FC<AllergyReconciliationModalProps> = ({
  isOpen,
  onClose,
  discrepancy,
  staff,
  onResolveDiscrepancy
}) => {
  if (!isOpen || !discrepancy) return null;

  const isPenicillin = discrepancy.substance.toLowerCase().includes('penicillin');

  const [selectedAction, setSelectedAction] = useState<AllergyReconciliationAction>(
    isPenicillin ? 'CONFIRM_INSTITUTIONAL' : 'DOWNGRADE_TO_INTOLERANCE'
  );
  const [selectedStatus, setSelectedStatus] = useState<AllergyVerificationStatus>('CONFIRMED_VERIFIED');
  const [selectedReactionType, setSelectedReactionType] = useState<AllergyReactionType>(
    isPenicillin ? 'IGE_MEDIATED_TYPE_1' : 'NON_ALLERGIC_INTOLERANCE'
  );
  const [rationale, setRationale] = useState<string>(
    isPenicillin
      ? 'Confirmed Type 1 IgE-Mediated Beta-Lactam allergy based on documented facial angioedema and emergency antihistamines. Cross-reactivity mapping activated for all cephalosporins.'
      : 'Patient history demonstrates isolated epigastric dyspepsia from COX-1 inhibition without cutaneous or respiratory signs. Downgraded to Non-Allergic GI Intolerance; Paracetamol and COX-2 selective agents permitted with PPI.'
  );

  const handleApplyResolution = () => {
    if (!rationale.trim()) return;
    onResolveDiscrepancy(
      discrepancy.id,
      selectedAction,
      discrepancy.substance,
      selectedStatus,
      selectedReactionType,
      rationale
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-white">Allergy & Hypersensitivity Reconciliation Workbench</h2>
                <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                  discrepancy.severity === 'CRITICAL'
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : 'bg-amber-950 text-amber-300 border border-amber-800'
                }`}>
                  {discrepancy.severity} PRIORITY
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Harmonize conflicting allergy records, differentiate IgE hypersensitivity vs intolerance, and activate cross-reactivity boundaries.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Discrepancy Summary Banner */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-rose-300 text-sm">{discrepancy.title}</span>
              <span className="text-[11px] text-slate-400 font-mono">ID: {discrepancy.id}</span>
            </div>
            <p className="text-slate-300 leading-relaxed">{discrepancy.description}</p>
            <div className="flex items-start space-x-2 text-rose-400/90 pt-1 border-t border-slate-900">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span><strong>Clinical Risk:</strong> {discrepancy.clinicalImplication}</span>
            </div>
          </div>

          {/* Side-by-Side Sources Comparison */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-teal-400" />
              <span>Cross-Facility Documentation Evidence (Side-by-Side)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {discrepancy.involvedSources.map((src, idx) => (
                <div 
                  key={idx}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-800 text-teal-300">
                      {src.citationLabel}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{src.date}</span>
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="font-semibold text-white text-sm flex items-center space-x-1.5">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      <span>{src.facility}</span>
                    </div>
                    <div className="text-[11px] text-teal-400 font-medium">
                      Status: {src.status}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 italic">
                    "{src.reactionDescription}"
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-900">
                    <span>Source Tier: {src.sourceCategory}</span>
                    <span className="font-mono text-slate-400">{src.recordId}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Standardized Coding Harmonization Preview */}
          <div className="bg-gradient-to-r from-teal-950/40 via-emerald-950/40 to-slate-950 border border-teal-800/50 rounded-xl p-4 space-y-2">
            <div className="flex items-center space-x-2 text-teal-300 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>Standardized Ontological Alignment (SNOMED CT / MedDRA / UNII)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase font-mono">SNOMED CT Concept ID</span>
                <span className="text-white font-mono font-bold text-xs">
                  {isPenicillin ? '91936005 (Allergy to penicillin)' : '300916003 (Adverse reaction to NSAID)'}
                </span>
              </div>
              <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase font-mono">MedDRA Preferred Term</span>
                <span className="text-white font-mono font-bold text-xs">
                  {isPenicillin ? '10034277 (Penicillin allergy)' : '10000049 (Drug intolerance)'}
                </span>
              </div>
              <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase font-mono">FDA UNII Substance</span>
                <span className="text-white font-mono font-bold text-xs">
                  {isPenicillin ? 'Q42T66VG0C (Penicillin G)' : 'WK2XYI10QM (Ibuprofen)'}
                </span>
              </div>
            </div>
          </div>

          {/* Clinical Action Selection */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Select Clinician Harmonization Strategy</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedAction('CONFIRM_INSTITUTIONAL');
                  setSelectedStatus('CONFIRMED_VERIFIED');
                  setSelectedReactionType('IGE_MEDIATED_TYPE_1');
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedAction === 'CONFIRM_INSTITUTIONAL'
                    ? 'bg-rose-950/50 border-rose-500 text-white shadow-lg'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-xs text-rose-300">Confirm IgE Allergy</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Promote to confirmed institutional red flag. Enforces cross-reactivity safeguards.
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedAction('DOWNGRADE_TO_INTOLERANCE');
                  setSelectedStatus('CONFIRMED_VERIFIED');
                  setSelectedReactionType('NON_ALLERGIC_INTOLERANCE');
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedAction === 'DOWNGRADE_TO_INTOLERANCE'
                    ? 'bg-amber-950/50 border-amber-500 text-white shadow-lg'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-xs text-amber-300">Downgrade to Intolerance</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Classify as non-allergic adverse effect (e.g. GI dyspepsia). Permits safe therapy.
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedAction('DELABEL_AFTER_CHALLENGE');
                  setSelectedStatus('REFUTED_DELABELED');
                  setSelectedReactionType('UNKNOWN');
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedAction === 'DELABEL_AFTER_CHALLENGE'
                    ? 'bg-emerald-950/50 border-emerald-500 text-white shadow-lg'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-xs text-emerald-300">De-label / Refute</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Formally remove allergy label following negative drug challenge or tolerance documentation.
                </div>
              </button>
            </div>
          </div>

          {/* Mandatory Clinical Rationale */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Mandatory Clinician Justification & Audit Trail Note
            </label>
            <textarea
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
              placeholder="Enter detailed clinical rationale for this allergy reconciliation action..."
            />
          </div>

          {/* Clinician Signature Line */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-teal-400" />
              <span className="text-slate-300">Attending Clinician: <strong className="text-white">{staff.name}</strong> ({staff.designation})</span>
            </div>
            <span className="text-slate-400 font-mono text-[11px]">Hospital: {staff.hospitalName}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-xs font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleApplyResolution}
            disabled={!rationale.trim()}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-600 via-emerald-600 to-blue-600 hover:from-teal-500 hover:to-blue-500 text-white font-semibold text-xs transition-all shadow-lg shadow-teal-900/30 flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Sign & Commit Allergy Reconciliation</span>
          </button>
        </div>
      </div>
    </div>
  );
};
