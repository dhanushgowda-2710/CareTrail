import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  ShieldCheck, 
  AlertOctagon, 
  Search, 
  PlusCircle, 
  LogIn, 
  Clock, 
  Filter,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { AuditEvent, AuditAction, AuditOutcome } from '../types/caretrail';

interface AuditLogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  auditLogs: AuditEvent[];
  onClearLogs?: () => void;
}

export const AuditLogDrawer: React.FC<AuditLogDrawerProps> = ({
  isOpen,
  onClose,
  auditLogs,
  onClearLogs
}) => {
  const [filterAction, setFilterAction] = useState<string>('ALL');

  if (!isOpen) return null;

  const filteredLogs = filterAction === 'ALL'
    ? auditLogs
    : auditLogs.filter(a => a.action === filterAction);

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-slate-900 border-l border-slate-700 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Immutable Audit Trail (AuditEvent)</span>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-teal-950 text-teal-300 border border-teal-800">
                {auditLogs.length} Events
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              ABDM & DPDP Act compliance requirement: records all chart lookups and boundary violations.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-3 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center space-x-1.5 text-xs">
          <span className="text-slate-400 text-[11px] font-semibold uppercase mr-1">Filter:</span>
          {[
            { id: 'ALL', label: 'All' },
            { id: 'RECORD_DISPUTED', label: 'Disputes' },
            { id: 'RECORD_AMENDED', label: 'Addenda / Corrections' },
            { id: 'CROSS_HOSPITAL_ATTEMPT_DENIED', label: '403 Denials' },
            { id: 'READ_PATIENT_CHART', label: 'Chart Reads' },
            { id: 'ADD_ENCOUNTER', label: 'New Records' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterAction(f.id)}
              className={`px-2 py-1 rounded text-[11px] font-medium whitespace-nowrap transition-colors ${
                filterAction === f.id
                  ? 'bg-teal-700 text-white font-semibold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table / List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
            No audit records matching filter.
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isDenial = log.outcome === 'FORBIDDEN_403';
            const isSuccess = log.outcome === 'SUCCESS_200';

            return (
              <div
                key={log.id}
                className={`p-3.5 rounded-xl border text-xs transition-all ${
                  isDenial
                    ? 'bg-rose-950/20 border-rose-900/60'
                    : 'bg-slate-950/70 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-850">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                      isDenial 
                        ? 'bg-rose-900 text-rose-200 border border-rose-700' 
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {log.outcome}
                    </span>

                    <span className="font-semibold text-slate-200 flex items-center gap-1">
                      {log.action}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500">Actor: </span>
                    <span className="text-slate-300 font-medium">{log.actorName}</span>
                    <span className="text-slate-500 ml-1">({log.actorRole})</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Facility: </span>
                    <span className="text-teal-400 font-medium">{log.hospitalName}</span>
                  </div>
                </div>

                {log.targetPatientName && (
                  <div className="mt-1 text-[11px]">
                    <span className="text-slate-500">Target Patient: </span>
                    <span className="text-slate-200 font-medium">{log.targetPatientName}</span>
                    <span className="text-slate-500 font-mono text-[10px] ml-1">({log.targetPatientId})</span>
                  </div>
                )}

                <div className="mt-2 text-[11px] text-slate-300 bg-slate-900/90 p-2 rounded border border-slate-850">
                  {log.details}
                </div>

                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span className="truncate max-w-xs">{log.endpoint}</span>
                  <span>ID: {log.id}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
        <span className="text-[11px] text-slate-400 font-medium">
          Append-only secure log • Never logs plaintext passwords or sensitive raw tokens
        </span>
        <button
          onClick={onClose}
          className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200"
        >
          Close
        </button>
      </div>
    </div>
  );
};
