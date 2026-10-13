import React from 'react';
import { X, Terminal, CheckCircle2, AlertOctagon, Send, Play, ShieldAlert, ArrowRight } from 'lucide-react';
import { StaffProfile, PatientProfile } from '../types/caretrail';

interface ApiInspectorProps {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffProfile;
  lastCall?: {
    method: string;
    endpoint: string;
    headers: Record<string, string>;
    status: number;
    boundaryRule?: string;
    response: any;
    timestamp: string;
  };
  onRunTestScenario: (scenario: 'apollo_valid' | 'request_consent' | 'approve_consent' | 'view_granted' | 'revoke_consent') => void;
}

export const ApiInspectorDrawer: React.FC<ApiInspectorProps> = ({
  isOpen,
  onClose,
  staff,
  lastCall,
  onRunTestScenario
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-slate-900 border-l border-slate-700 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>API & Security Boundary Inspector</span>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-teal-950 text-teal-300 border border-teal-800">
                Prompt 2 Engine
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Live inspection of HTTP requests, ABDM consent tokens, and 403 revocation enforcement.
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

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Quick Test Runners */}
        <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
          <div className="text-xs font-bold text-teal-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Play className="w-3.5 h-3.5 text-teal-400" />
            <span>Prompt 2 ABDM Consent Scenarios</span>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => onRunTestScenario('request_consent')}
              className="w-full text-left p-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-teal-900/60 text-xs flex items-center justify-between group transition-colors"
            >
              <div>
                <div className="font-semibold text-teal-300 flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-teal-400" />
                  <span>1. POST /api/access-requests</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Dr. Anand requests cross-hospital access to Arvind Swamy (City Care)
                </div>
              </div>
              <span className="font-mono text-[10px] px-1.5 py-0.5 bg-teal-950 text-teal-300 border border-teal-800 rounded">
                200 OK
              </span>
            </button>

            <button
              onClick={() => onRunTestScenario('approve_consent')}
              className="w-full text-left p-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-amber-900/60 text-xs flex items-center justify-between group transition-colors"
            >
              <div>
                <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>2. POST /api/access-requests/:id/approve</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Patient approves request &rarr; Generates active AccessGrant
                </div>
              </div>
              <span className="font-mono text-[10px] px-1.5 py-0.5 bg-amber-950 text-amber-300 border border-amber-800 rounded">
                Active Grant
              </span>
            </button>

            <button
              onClick={() => onRunTestScenario('view_granted')}
              className="w-full text-left p-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-emerald-900/60 text-xs flex items-center justify-between group transition-colors"
            >
              <div>
                <div className="font-semibold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>3. GET /api/patients/:id (With Grant)</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Doctor views Arvind Swamy's records under valid patient consent
                </div>
              </div>
              <span className="font-mono text-[10px] px-1.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded">
                200 OK
              </span>
            </button>

            <button
              onClick={() => onRunTestScenario('revoke_consent')}
              className="w-full text-left p-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-rose-900/60 text-xs flex items-center justify-between group transition-colors"
            >
              <div>
                <div className="font-semibold text-rose-300 flex items-center gap-1.5">
                  <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                  <span>4. POST /api/grants/:id/revoke &rarr; Re-query</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Patient revokes consent &rarr; Next doctor query yields 403 Forbidden!
                </div>
              </div>
              <span className="font-mono text-[10px] px-1.5 py-0.5 bg-rose-950 text-rose-400 border border-rose-800 rounded">
                403 Forbidden
              </span>
            </button>
          </div>
        </div>

        {/* Last Executed Request & Response View */}
        {lastCall ? (
          <div className="space-y-3">
            {/* Status & Method */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                    lastCall.method === 'GET' ? 'bg-blue-950 text-blue-300 border border-blue-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {lastCall.method}
                  </span>
                  <span className="font-mono text-xs text-white truncate max-w-xs sm:max-w-md">
                    {lastCall.endpoint}
                  </span>
                </div>

                <span className={`px-2 py-0.5 rounded font-mono text-xs font-bold ${
                  lastCall.status === 200
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-rose-950 text-rose-300 border border-rose-800'
                }`}>
                  HTTP {lastCall.status}
                </span>
              </div>

              {lastCall.boundaryRule && (
                <div className="mt-2 text-[11px] p-2 rounded bg-slate-900 text-teal-300 border border-slate-800 font-mono">
                  <strong className="text-slate-400 font-sans">Enforced Boundary:</strong> {lastCall.boundaryRule}
                </div>
              )}
            </div>

            {/* Request Headers */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Request Context & Headers
              </div>
              <div className="font-mono text-[11px] text-slate-300 space-y-1 bg-slate-900/90 p-2.5 rounded border border-slate-850">
                <div><span className="text-teal-400">x-staff-id:</span> {lastCall.headers['x-staff-id']}</div>
                <div><span className="text-teal-400">x-hospital-id:</span> {lastCall.headers['x-hospital-id']}</div>
                <div><span className="text-teal-400">x-role:</span> {lastCall.headers['x-role']}</div>
                <div><span className="text-teal-400">authorization-tier:</span> Tier 2 (Internal Hospital DB)</div>
              </div>
            </div>

            {/* Response Payload */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Response Payload JSON
                </span>
                <span className="text-[10px] text-slate-500 font-mono">{lastCall.timestamp}</span>
              </div>
              <pre className="font-mono text-[11px] text-teal-200 bg-slate-900/90 p-3 rounded-lg border border-slate-850 overflow-x-auto max-h-64 leading-tight">
                {JSON.stringify(lastCall.response, null, 2)}
              </pre>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500 text-xs bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
            No API requests made yet. Run one of the test scenarios above or click any patient in the directory.
          </div>
        )}
      </div>

      {/* Drawer Footer */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 text-right">
        <button
          onClick={onClose}
          className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200"
        >
          Close Inspector
        </button>
      </div>
    </div>
  );
};
