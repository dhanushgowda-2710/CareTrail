import React, { useState } from 'react';
import { ShieldAlert, X, CheckCircle2, AlertTriangle, Stethoscope } from 'lucide-react';
import { CdsAlert, StaffProfile } from '../types/caretrail';

interface CdsOverrideModalProps {
  isOpen: boolean;
  onClose: () => void;
  alert: CdsAlert | null;
  staff: StaffProfile;
  onConfirmOverride: (alertId: string, justification: string) => void;
}

export const CdsOverrideModal: React.FC<CdsOverrideModalProps> = ({
  isOpen,
  onClose,
  alert,
  staff,
  onConfirmOverride
}) => {
  const [selectedReason, setSelectedReason] = useState<string>('Benefit outweighs identified risk with intensive clinical and laboratory monitoring');
  const [customNotes, setCustomNotes] = useState<string>('');

  if (!isOpen || !alert) return null;

  const standardReasons = [
    'Benefit outweighs identified risk with intensive clinical and laboratory monitoring',
    'Specialist allergy desensitization or step-up protocol initiated',
    'Dose and interval adjusted for documented renal clearance (eGFR)',
    'Prior patient tolerance verified under specialist supervision',
    'Acute short-duration therapy with informed patient consent'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalJustification = customNotes.trim() 
      ? `${selectedReason}. Note: ${customNotes.trim()}`
      : selectedReason;

    onConfirmOverride(alert.id, finalJustification);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-amber-600/60 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Override Clinical Decision Alert</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                NABH / ABDM Mandatory Clinician Justification & Audit Trail
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alert Overview */}
        <div className="mt-4 p-3.5 bg-amber-950/30 border border-amber-800/60 rounded-xl space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-200">{alert.title}</span>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700">
              {alert.severity}
            </span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            {alert.clinicalMechanism}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          {/* Authorizing Clinician Badge */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Stethoscope className="w-4 h-4 text-teal-400" />
              <div>
                <div className="font-semibold text-slate-200">{staff.name}</div>
                <div className="text-[11px] text-slate-400">{staff.designation} • {staff.hospitalName}</div>
              </div>
            </div>
            <span className="font-mono text-[10px] text-teal-300 bg-teal-950 px-2 py-0.5 rounded border border-teal-800">
              Reg #{staff.registrationNumber}
            </span>
          </div>

          {/* Justification Selector */}
          <div>
            <label className="block font-semibold text-slate-200 mb-2">
              Select Standard Clinical Rationale (Required):
            </label>
            <div className="space-y-2">
              {standardReasons.map((reason, idx) => (
                <label
                  key={idx}
                  className={`flex items-start space-x-2.5 p-2.5 rounded-lg border cursor-pointer transition-all ${
                    selectedReason === reason
                      ? 'bg-amber-950/40 border-amber-600 text-amber-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="overrideReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="mt-0.5 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-xs leading-snug">{reason}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block font-semibold text-slate-200 mb-1">
              Supplementary Clinical Documentation (Optional):
            </label>
            <textarea
              rows={2}
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="e.g. Consulted with clinical pharmacologist. Serial serum creatinine & potassium scheduled at 72 hours."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 text-xs"
            />
          </div>

          <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800 flex items-center space-x-2 text-[11px] text-slate-400">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              This override action and rationale will be permanently recorded in the immutable audit log under <code className="text-teal-300">CDS_OVERRIDE_RECORDED</code>.
            </span>
          </div>

          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-lg font-semibold transition-all shadow-md cursor-pointer flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Log Override</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
