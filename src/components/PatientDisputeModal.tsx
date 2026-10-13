import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  FileText, 
  Send, 
  Lock,
  UserCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { MedicalRecord, PatientProfile, RecordDispute } from '../types/caretrail';

interface PatientDisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: MedicalRecord | null;
  patient: PatientProfile;
  onSubmitDispute: (
    recordId: string, 
    disputeData: {
      disputeType: RecordDispute['disputeType'];
      reason: string;
      requestedCorrection?: string;
    }
  ) => void;
}

export const PatientDisputeModal: React.FC<PatientDisputeModalProps> = ({
  isOpen,
  onClose,
  record,
  patient,
  onSubmitDispute
}) => {
  const [disputeType, setDisputeType] = useState<RecordDispute['disputeType']>('FACTUAL_ERROR');
  const [reason, setReason] = useState('');
  const [requestedCorrection, setRequestedCorrection] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !record) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setErrorMessage('Please specify the reason for disputing this record.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      onSubmitDispute(record.id, {
        disputeType,
        reason: reason.trim(),
        requestedCorrection: requestedCorrection.trim() || undefined
      });
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit dispute');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-amber-500/60 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-850">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">Report Record Dispute / Discrepancy</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">
                  Prompt 10: Patient Governance
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Flag an inaccurate event or note in your personal medical timeline.
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

        {/* Patient Identity Badge */}
        <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <UserCheck className="w-4 h-4 text-teal-400" />
            <span className="text-slate-400">Authenticated Patient:</span>
            <strong className="text-teal-200">{patient.name}</strong>
            <span className="font-mono text-slate-500 text-[11px]">({patient.mrn})</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Owner Verified</span>
        </div>

        {/* Record Overview Being Disputed */}
        <div className="mt-3 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold">Target Record:</span>
            <span className="font-mono text-slate-500 text-[10px]">ID: {record.id}</span>
          </div>
          <div className="font-bold text-slate-100 text-sm flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-teal-400 shrink-0" />
            <span>{record.title}</span>
          </div>
          <div className="text-slate-400 flex items-center gap-2 text-[11px]">
            <span>Facility: {record.hospitalName}</span>
            <span>•</span>
            <span>Date: {record.encounterDate}</span>
            <span>•</span>
            <span>Author: {record.authorStaffName}</span>
          </div>
          <div className="p-2 rounded bg-slate-900 border border-slate-850 text-slate-300 font-mono text-[11px] line-clamp-2">
            "{record.clinicalNotes}"
          </div>
        </div>

        {/* Integrity Notice */}
        <div className="mt-3 p-3 rounded-xl bg-blue-950/30 border border-blue-900/50 text-xs text-blue-200/90 flex items-start space-x-2.5">
          <Lock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px]">
            <strong>Clinical Record Integrity Safeguard:</strong> Patients cannot silently delete or alter clinician-authored medical data. Submitting this dispute flags the record as disputed and routes your feedback to the clinical team to append a formal correction/addendum.
          </p>
        </div>

        {/* Dispute Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Discrepancy Category <span className="text-rose-400">*</span>
            </label>
            <select
              value={disputeType}
              onChange={(e) => setDisputeType(e.target.value as RecordDispute['disputeType'])}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="FACTUAL_ERROR">Factual Clinical Error (wrong dosage, mistaken symptom, incorrect diagnosis)</option>
              <option value="MISMATCHED_RECORD">Mismatched Record (belongs to another patient or family member)</option>
              <option value="INCORRECT_ATTRIBUTION">Incorrect Attribution (did not attend this facility / physician)</option>
              <option value="UNAUTHORIZED_ENTRY">Unauthorized Entry / Omission</option>
              <option value="OTHER">Other Discrepancy</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Reason for Dispute <span className="text-rose-400">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain clearly what part of this document is incorrect (e.g. 'I was never prescribed 1000mg Metformin at Apollo; my dose was 500mg ER once daily')..."
              rows={3}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 text-xs focus:outline-none focus:border-amber-500 placeholder-slate-600 resize-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Requested Clinical Clarification / Correction <span className="text-slate-500 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={requestedCorrection}
              onChange={(e) => setRequestedCorrection(e.target.value)}
              placeholder="e.g. Please append an addendum noting true dose was 500mg"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-amber-500 placeholder-slate-600"
            />
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
              disabled={isSubmitting || !reason.trim()}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Dispute'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
