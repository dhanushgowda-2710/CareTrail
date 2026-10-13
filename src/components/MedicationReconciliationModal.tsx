import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Building2, 
  Calendar, 
  User, 
  FileText, 
  ShieldCheck,
  Pill,
  ArrowRight,
  Sparkles,
  AlertOctagon,
  Clock
} from 'lucide-react';
import { MedicationDiscrepancyAlert, StaffProfile, MedicationAction } from '../types/caretrail';

interface MedicationReconciliationModalProps {
  isOpen: boolean;
  onClose: () => void;
  discrepancy: MedicationDiscrepancyAlert | null;
  staff: StaffProfile;
  onResolveDiscrepancy: (
    discrepancyId: string,
    action: MedicationAction,
    targetDrugName: string,
    targetDosage: string,
    targetFrequency: string,
    justification: string
  ) => void;
}

export const MedicationReconciliationModal: React.FC<MedicationReconciliationModalProps> = ({
  isOpen,
  onClose,
  discrepancy,
  staff,
  onResolveDiscrepancy
}) => {
  if (!isOpen || !discrepancy) return null;

  // Pre-fill smart defaults based on the discrepancy
  const isStatin = discrepancy.id === 'disc-statin-dup-01';
  const isMetformin = discrepancy.id === 'disc-metformin-dose-02';

  const defaultDrugName = isStatin 
    ? 'Rosuvastatin Tablets IP 10mg' 
    : isMetformin 
      ? 'Metformin Hydrochloride Prolonged-Release 1000mg'
      : discrepancy.involvedMedications[0]?.prescribedDrug || '';

  const defaultDosage = isStatin 
    ? '10 mg' 
    : isMetformin 
      ? '1000 mg' 
      : discrepancy.involvedMedications[0]?.dosage || '';

  const defaultFrequency = isStatin 
    ? 'Once daily at bedtime' 
    : isMetformin 
      ? 'Twice daily with meals' 
      : 'Once daily';

  const defaultJustification = isStatin
    ? 'Deprescribe duplicate Apollo Atorvastatin 10mg. Standardize on Manipal Rosuvastatin 10mg daily for high-potency LDL-C target reduction (<70 mg/dL). Patient instructed to discard obsolete Atorvastatin supply.'
    : isMetformin
      ? 'Harmonize on Metformin 1000mg ER twice daily with meals to achieve ADA glycemic target (baseline HbA1c 7.8%). Stable renal function (eGFR 94 mL/min) allows safe titration.'
      : 'Clinically verified and reconciled across facilities.';

  const [selectedAction, setSelectedAction] = useState<MedicationAction>(
    isStatin ? 'DISCONTINUE_DEPRESCRIBE' : 'MODIFY_DOSE'
  );
  const [targetDrugName, setTargetDrugName] = useState<string>(defaultDrugName);
  const [targetDosage, setTargetDosage] = useState<string>(defaultDosage);
  const [targetFrequency, setTargetFrequency] = useState<string>(defaultFrequency);
  const [justification, setJustification] = useState<string>(defaultJustification);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!justification.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onResolveDiscrepancy(
        discrepancy.id,
        selectedAction,
        targetDrugName,
        targetDosage,
        targetFrequency,
        justification.trim()
      );
      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-teal-800/80 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-teal-900/60 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                  Prompt 7 • MedRec Discrepancy Workbench
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase">
                  {discrepancy.severity} Priority
                </span>
              </div>
              <h3 className="text-base font-semibold text-white mt-0.5">
                {discrepancy.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200 text-xs sm:text-sm">
          {/* Clinical Risk Banner */}
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 flex items-start space-x-3">
            <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-rose-300 text-xs">Identified Clinical Safety Risk:</div>
              <p className="text-xs text-rose-200/90 mt-1 leading-relaxed">
                {discrepancy.clinicalRisk}
              </p>
              <div className="mt-2 text-[11px] text-slate-300 bg-slate-950/60 p-2 rounded border border-rose-900/40">
                <strong className="text-amber-300">Recommended Harmonization:</strong> {discrepancy.recommendedAction}
              </div>
            </div>
          </div>

          {/* Side-by-Side Conflicting Prescriptions */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-teal-400" />
                Conflicting Multi-Source Prescriptions
              </span>
              <span className="text-[11px] text-slate-400">
                Cross-Hospital Verification
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {discrepancy.involvedMedications.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/10 text-teal-300 border border-teal-500/30 flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {item.facility}
                      </span>
                      <span className="font-mono text-[10px] text-amber-300 font-bold bg-amber-950/50 px-1.5 py-0.5 rounded border border-amber-800/50">
                        {item.citationLabel}
                      </span>
                    </div>

                    <div className="font-bold text-white text-sm">
                      {item.prescribedDrug}
                    </div>
                    <div className="text-xs text-slate-300 mt-1 flex items-center gap-2">
                      <span className="font-mono bg-slate-900 px-1.5 py-0.5 rounded text-teal-300 border border-slate-700">
                        {item.dosage}
                      </span>
                      <span className="text-slate-400">{item.frequency}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-500" />
                      {item.doctorName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {item.prescribedDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Clinician Reconciliation Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Reconciliation Action Strategy:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'DISCONTINUE_DEPRESCRIBE', label: 'Deprescribe & Stop', icon: '⛔', color: 'rose' },
                  { id: 'MODIFY_DOSE', label: 'Modify / Harmonize Dose', icon: '⚖️', color: 'amber' },
                  { id: 'CONTINUE', label: 'Continue Regimen', icon: '✅', color: 'emerald' },
                  { id: 'SUBSTITUTE', label: 'Substitute Alternative', icon: '🔄', color: 'indigo' }
                ].map((act) => (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => setSelectedAction(act.id as MedicationAction)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedAction === act.id
                        ? 'bg-teal-950/80 border-teal-500 text-white shadow-lg ring-1 ring-teal-500/50'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-sm">{act.icon}</div>
                    <div className="font-semibold text-xs mt-1">{act.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Target Formulation Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Prevailing Drug Name:
                </label>
                <input
                  type="text"
                  value={targetDrugName}
                  onChange={(e) => setTargetDrugName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Target Dosage:
                </label>
                <input
                  type="text"
                  value={targetDosage}
                  onChange={(e) => setTargetDosage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Daily Administration Frequency:
                </label>
                <input
                  type="text"
                  value={targetFrequency}
                  onChange={(e) => setTargetFrequency(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
                  required
                />
              </div>
            </div>

            {/* Mandatory Clinical Justification */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                  Mandatory Clinical Justification (ABDM Audit Ledger):
                </label>
                <span className="text-[10px] text-slate-400">Required for electronic signature</span>
              </div>
              <textarea
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors leading-relaxed"
                placeholder="State clinical reasoning for this medication action..."
                required
              />
            </div>

            {/* Attending Clinician Badge */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-full bg-teal-600/20 border border-teal-500/40 flex items-center justify-center text-teal-300 font-bold text-xs">
                  {staff.name.charAt(3) || 'D'}
                </div>
                <div>
                  <div className="font-semibold text-slate-200">
                    {staff.name} • {staff.designation}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Signing Clinician ID: <span className="font-mono text-teal-400">{staff.id}</span> ({staff.hospitalName})
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                <Clock className="w-3 h-3" />
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !justification.trim()}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold shadow-lg shadow-teal-500/20 transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span>Signing & Committing...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Sign & Reconcile Medication</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
