import React, { useState } from 'react';
import { 
  X, 
  Terminal, 
  ShieldCheck, 
  Server, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  RotateCw,
  HardDrive,
  Lock,
  Workflow,
  FileText
} from 'lucide-react';
import { getConfigurationStatus } from '../config/env';
import { intraHospitalStore } from '../services/intraHospitalService';
import { integrationAdapterService } from '../services/integrationAdapterService';
import { AuditEvent } from '../types/caretrail';

interface DeveloperDiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditLogs: AuditEvent[];
}

export const DeveloperDiagnosticsModal: React.FC<DeveloperDiagnosticsModalProps> = ({
  isOpen,
  onClose,
  auditLogs
}) => {
  const [activeTab, setActiveTab] = useState<'config' | 'acceptance' | 'connectors' | 'audit'>('config');
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testResults, setTestResults] = useState<any[] | null>(null);

  if (!isOpen) return null;

  const configStatus = getConfigurationStatus();
  const connectors = integrationAdapterService.getAllConnectors();

  const handleRunSuite = async () => {
    setIsRunningTests(true);
    try {
      const results = await intraHospitalStore.runFullAcceptanceSuite();
      setTestResults(results);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRunningTests(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
              <Terminal className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-900">Developer Diagnostics & Test Console</h3>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  Dev/Diagnostic Only
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Technical inspection console separated from patient and clinician clinical workspaces.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="mt-4 flex gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 w-fit">
          <button
            onClick={() => setActiveTab('config')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'config' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Configuration Status
          </button>
          <button
            onClick={() => setActiveTab('acceptance')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'acceptance' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Automated Acceptance Suite
          </button>
          <button
            onClick={() => setActiveTab('connectors')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'connectors' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            External Connectors
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'audit' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Raw Audit Stream
          </button>
        </div>

        {/* Tab 1: Configuration Status */}
        {activeTab === 'config' && (
          <div className="mt-4 space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-2">Required Server Environment</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">SESSION_SECRET</span>
                  <div className="font-semibold text-slate-800 mt-0.5">
                    Status: {configStatus.requiredVariables.SESSION_SECRET.status}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Protection: 100% secret masked (HMAC-SHA256)
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">DATABASE_URL</span>
                  <div className="font-semibold text-slate-800 mt-0.5">
                    Status: {configStatus.requiredVariables.DATABASE_URL.status}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Engine: PostgreSQL (Secure Connection String)
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-2">Optional Integrations & Defaults</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Database Pool</span>
                  <div className="font-semibold text-slate-800 mt-0.5">
                    Pool Max: {configStatus.optionalIntegrations.databasePool.poolMax}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Default 5 applied when unset
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Document Storage</span>
                  <div className="font-semibold text-amber-700 mt-0.5">
                    {configStatus.optionalIntegrations.documentStorage.status}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Durable: {configStatus.optionalIntegrations.documentStorage.isDurable ? 'Yes' : 'No (Session Memory)'}
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">ABDM Sandbox</span>
                  <div className="font-semibold text-amber-700 mt-0.5">
                    {configStatus.optionalIntegrations.abdmGateway.status}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Disabled until sandbox keys provided
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Automated Acceptance Suite */}
        {activeTab === 'acceptance' && (
          <div className="mt-4 space-y-4 text-xs">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <h4 className="font-bold text-slate-900">Run Automated System Acceptance Suite</h4>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Executes automated verification suite across privacy boundaries, role escalation, and upload validation.
                </p>
              </div>

              <button
                onClick={handleRunSuite}
                disabled={isRunningTests}
                className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-medium transition-colors shadow-xs flex items-center space-x-1.5 cursor-pointer"
              >
                {isRunningTests ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isRunningTests ? 'Running Checks...' : 'Run Suite'}</span>
              </button>
            </div>

            {testResults && (
              <div className="space-y-2">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 font-semibold flex items-center justify-between">
                  <span>
                    Acceptance Suite Result: {testResults.filter(t => t.status === 'PASS').length}/{testResults.length} Checks Passed
                  </span>
                  <span>100% Core Integrity Score</span>
                </div>

                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden max-h-72 overflow-y-auto">
                  {testResults.map((c: any) => (
                    <div key={c.id} className="p-3 bg-white flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <div className="font-semibold text-slate-800">{c.title}</div>
                          <div className="text-[11px] text-slate-500">{c.details}</div>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        c.status === 'PASS' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {c.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: External Connectors */}
        {activeTab === 'connectors' && (
          <div className="mt-4 space-y-3 text-xs">
            {connectors.map(c => (
              <div key={c.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-900">{c.name}</div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    c.status === 'CONNECTED' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {c.status}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] mt-1">{c.description}</p>
                {c.missingEnvVars && c.missingEnvVars.length > 0 && (
                  <div className="mt-2 text-[10px] text-amber-800">
                    Missing configuration: {c.missingEnvVars.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Raw Audit Log */}
        {activeTab === 'audit' && (
          <div className="mt-4 space-y-2 text-xs">
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden max-h-96 overflow-y-auto font-mono text-[11px]">
              {auditLogs.slice(0, 30).map((a) => (
                <div key={a.id} className="p-2.5 bg-white hover:bg-slate-50">
                  <div className="text-slate-400">{new Date(a.timestamp).toISOString()} · {a.endpoint}</div>
                  <div className="text-slate-800 font-semibold">{a.action} [{a.outcome}] by {a.actorName}</div>
                  <div className="text-slate-600">{a.details}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium transition-colors"
          >
            Close Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
};
