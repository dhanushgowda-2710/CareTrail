import React, { useState } from 'react';
import { 
  X, 
  FileEdit, 
  ShieldCheck, 
  History, 
  CheckCircle2, 
  AlertTriangle,
  Send,
  Lock,
  Clock,
  Layers,
  ArrowRight
} from 'lucide-react';
import { MedicalRecord, StaffProfile, RecordAddendum } from '../types/caretrail';

interface ClinicianAddendumModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: MedicalRecord | null;
  staff: StaffProfile;
  onSubmitAddendum: (
    recordId: string,
    addendumData: {
      reason: string;
      addendumNotes: string;
      correctedDiagnosis?: string;
      correctedNotes?: string;
      associatedDisputeId?: string;
    }
  ) => void;
}

export const ClinicianAddendumModal: React.FC<ClinicianAddendumModalProps> = ({
  isOpen,
  onClose,
  record,
  staff,
  onSubmitAddendum
}) => {
  const [reason, setReason] = useState(
    record?.activeDispute 
      ? `Resolving patient dispute [${record.activeDispute.disputeType}]: ${record.activeDispute.reason.slice(0, 80)}`
      : 'Clinical clarification following patient interview and updated diagnostic data.'
  );
  const [addendumNotes, setAddendumNotes] = useState('');
  const [correctedDiagnosis, setCorrectedDiagnosis] = useState(record?.diagnosis || '');
  const [correctedNotes, setCorrectedNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !record) return null;

  const isPhysician = staff.role === 'doctor' || staff.role === 'admin';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setErrorMessage('Please state the clinical justification/reason for this addendum.');
      return;
    }
    if (!addendumNotes.trim()) {
      setErrorMessage('Please enter the formal addendum clarification notes.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      onSubmitAddendum(record.id, {
        reason: reason.trim(),
        addendumNotes: addendumNotes.trim(),
        correctedDiagnosis: correctedDiagnosis.trim() !== (record.diagnosis || '') ? correctedDiagnosis.trim() : undefined,
        correctedNotes: correctedNotes.trim() ? correctedNotes.trim() : undefined,
        associatedDisputeId: record.activeDispute?.id
      });
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to attach addendum');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-teal-500/60 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-850">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/40">
              <FileEdit className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">Append Clinician Addendum & Correction</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-950 text-teal-300 border border-teal-800">
                  v{(record.version || 1) + 1} Draft
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Append-only clinical clarification. The original record and historical versions remain permanently preserved.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Clinician Authentication Credentials Badge */}
        <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400">Authenticated Clinician:</span>
            <strong className="text-teal-200">{staff.name}</strong>
            <span className="text-slate-400">({staff.designation})</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-slate-500 text-[11px] font-mono">{staff.hospitalName}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              isPhysician ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
            }`}>
              {isPhysician ? 'AUTHORIZED' : 'UNAUTHORIZED ROLE'}
            </span>
          </div>
        </div>

        {!isPhysician && (
          <div className="mt-3 p-3 rounded-xl bg-rose-950/40 border border-rose-900/60 text-xs text-rose-300 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Role Restriction: Only authenticated physicians or clinical administrators may submit permanent clinical addenda.</span>
          </div>
        )}

        {/* Dispute Resolution Alert if attached to an active dispute */}
        {record.activeDispute && (
          <div className="mt-3 p-3 rounded-xl bg-amber-950/40 border border-amber-900/60 text-xs text-amber-200 flex items-start space-x-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-amber-300">Addressing Active Patient Dispute:</strong>
              <p className="mt-0.5 text-slate-300">
                "{record.activeDispute.reason}" <span className="text-slate-400">({record.activeDispute.patientName})</span>
              </p>
              <div className="mt-1 text-[11px] text-amber-400 font-mono">
                Attaching this addendum will automatically resolve the dispute with status: RESOLVED_WITH_ADDENDUM.
              </div>
            </div>
          </div>
        )}

        {/* Target Original Record State */}
        <div className="mt-3 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold">Original Document Baseline:</span>
            <span className="font-mono text-slate-500 text-[10px]">ID: {record.id} • Current: v{record.version || 1}</span>
          </div>
          <div className="font-bold text-slate-100 flex items-center gap-1.5">
            <span>{record.title}</span>
            <span className="text-slate-400 font-normal">({record.encounterDate})</span>
          </div>
          <div className="p-2.5 rounded bg-slate-900 border border-slate-850 text-slate-300 font-mono text-[11px] space-y-1">
            <div><strong className="text-slate-400">Original Diagnosis:</strong> {record.diagnosis || '(none)'}</div>
            <div className="line-clamp-2"><strong className="text-slate-400">Original Notes:</strong> "{record.clinicalNotes}"</div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Addendum Reason & Justification <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Correcting dosage typographical error noted in outpatient consultation note"
              required
              disabled={!isPhysician}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-teal-500 placeholder-slate-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Formal Addendum Text / Clinical Correction <span className="text-rose-400">*</span>
            </label>
            <textarea
              value={addendumNotes}
              onChange={(e) => setAddendumNotes(e.target.value)}
              placeholder="State the clinical clarification clearly: e.g. 'Addendum: Upon reviewing pharmacy dispensing logs and patient follow-up, confirmed current regimen is Metformin ER 500mg once daily. Previous note indicating 1000mg was an entry discrepancy and is superseded hereby.'"
              rows={4}
              required
              disabled={!isPhysician}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 text-xs focus:outline-none focus:border-teal-500 placeholder-slate-600 resize-none font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Updated Diagnosis <span className="text-slate-500 font-normal">(Optional correction)</span>
              </label>
              <input
                type="text"
                value={correctedDiagnosis}
                onChange={(e) => setCorrectedDiagnosis(e.target.value)}
                placeholder="Leave unchanged or update diagnostic term"
                disabled={!isPhysician}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-teal-500 placeholder-slate-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Updated Addendum Annotation <span className="text-slate-500 font-normal">(Appended note)</span>
              </label>
              <input
                type="text"
                value={correctedNotes}
                onChange={(e) => setCorrectedNotes(e.target.value)}
                placeholder="Clarifying note to append to clinical trail"
                disabled={!isPhysician}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-teal-500 placeholder-slate-600"
              />
            </div>
          </div>

          {/* Non-destructive guarantee badge */}
          <div className="p-3 rounded-xl bg-slate-950 border border-teal-900/60 flex items-center justify-between text-[11px] text-teal-300">
            <div className="flex items-center space-x-2">
              <History className="w-4 h-4 text-teal-400" />
              <span>Immutable Snapshot: Original text and version v1 preserved permanently.</span>
            </div>
            <span className="font-mono text-slate-400">Non-destructive</span>
          </div>

          {errorMessage && (
            <div className="p-2.5 rounded-lg bg-rose-950 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isPhysician || !reason.trim() || !addendumNotes.trim()}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Attaching Addendum...' : 'Sign & Attach Addendum'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
