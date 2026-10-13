import React from 'react';
import { 
  X, 
  History, 
  FileText, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  User,
  AlertTriangle,
  GitBranch
} from 'lucide-react';
import { MedicalRecord, RecordAddendum } from '../types/caretrail';

interface RecordHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: MedicalRecord | null;
}

export const RecordHistoryModal: React.FC<RecordHistoryModalProps> = ({
  isOpen,
  onClose,
  record
}) => {
  if (!isOpen || !record) return null;

  const originalSnapshot = record.originalSnapshot;
  const addenda = record.addenda || [];
  const totalVersions = (record.version || 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-teal-500/60 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-850">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/40">
              <History className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">Record Lineage & Historical Addenda Trail</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-950 text-teal-300 border border-teal-800">
                  {totalVersions} {totalVersions === 1 ? 'Version' : 'Versions'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Append-only clinical provenance: original baseline record with all subsequent clinician addenda.
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

        {/* Record Title Banner */}
        <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-teal-400" />
            <span className="text-slate-400">Record:</span>
            <strong className="text-slate-200">{record.title}</strong>
          </div>
          <span className="font-mono text-slate-500 text-[10px]">ID: {record.id}</span>
        </div>

        {/* Timeline of Versions */}
        <div className="mt-4 space-y-4">
          {/* VERSION 1: Original Record Snapshot */}
          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-850 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-850">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                  v1.0 (Original Baseline)
                </span>
                <span className="text-xs font-semibold text-slate-300">Authored by {record.authorStaffName}</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {record.encounterDate}
              </span>
            </div>

            <div className="text-xs space-y-1.5 pt-1">
              <div>
                <span className="text-slate-400 font-semibold">Diagnosis: </span>
                <span className="text-slate-200">{originalSnapshot ? (originalSnapshot.diagnosis || '(none)') : (record.diagnosis || '(none)')}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block mb-0.5">Clinical Notes (Baseline):</span>
                <div className="p-2.5 rounded bg-slate-900 border border-slate-850 text-slate-300 font-mono text-[11px] leading-relaxed">
                  {originalSnapshot ? originalSnapshot.clinicalNotes : record.clinicalNotes}
                </div>
              </div>
            </div>
          </div>

          {/* ADDENDA TRAIL */}
          {addenda.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-950/40 border border-dashed border-slate-800 text-center text-xs text-slate-500">
              No addenda or corrections have been filed on this record. Baseline version remains active.
            </div>
          ) : (
            addenda.map((addendum, idx) => (
              <div 
                key={addendum.id}
                className="p-4 rounded-xl bg-teal-950/30 border border-teal-800/60 space-y-2.5 relative"
              >
                <div className="flex items-center justify-between pb-2 border-b border-teal-900/60">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-teal-900 text-teal-200 border border-teal-700 flex items-center gap-1">
                      <GitBranch className="w-3 h-3 text-teal-400" />
                      <span>v{idx + 2}.0 Addendum</span>
                    </span>
                    <span className="text-xs font-semibold text-teal-300">
                      Signed by {addendum.authorStaffName} ({addendum.authorStaffRole})
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {new Date(addendum.timestamp).toLocaleDateString()} {new Date(addendum.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                <div className="text-xs space-y-2">
                  <div className="p-2 rounded bg-slate-950/80 border border-teal-950 text-slate-300">
                    <span className="text-teal-400 font-bold block mb-0.5">Clinical Reason:</span>
                    <p className="text-slate-200">{addendum.reason}</p>
                  </div>

                  <div>
                    <span className="text-teal-400 font-bold block mb-0.5">Addendum Text:</span>
                    <div className="p-2.5 rounded bg-slate-900 border border-teal-900/40 font-mono text-[11px] text-teal-100/90 leading-relaxed">
                      "{addendum.addendumNotes}"
                    </div>
                  </div>

                  {addendum.correctedFields && addendum.correctedFields.length > 0 && (
                    <div className="p-2 rounded bg-slate-950/80 border border-slate-800 text-[11px] space-y-1">
                      <span className="text-slate-400 font-bold">Field-Level Delta:</span>
                      {addendum.correctedFields.map((field, fIdx) => (
                        <div key={fIdx} className="flex items-center space-x-2 font-mono">
                          <span className="text-amber-400 font-semibold">{field.fieldName}:</span>
                          <span className="line-through text-slate-500">{field.previousValue}</span>
                          <ArrowRight className="w-3 h-3 text-teal-400" />
                          <span className="text-emerald-300 font-bold">{field.newValue}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 font-mono">
            Original record ID: {record.id} • Append-only audit integrity intact
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
