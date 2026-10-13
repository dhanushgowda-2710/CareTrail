import React from 'react';
import { 
  X, 
  Layers, 
  Database, 
  FileText, 
  UserCheck, 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Workflow,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { MultiSourceChannel, PatientProfile } from '../types/caretrail';

interface MultiSourceAggregationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  channels: MultiSourceChannel[];
  patient: PatientProfile | null;
  onOpenUploadDoc: () => void;
  onOpenAddReported: () => void;
}

export const MultiSourceAggregationDrawer: React.FC<MultiSourceAggregationDrawerProps> = ({
  isOpen,
  onClose,
  channels,
  patient,
  onOpenUploadDoc,
  onOpenAddReported
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-slate-900 border-l border-slate-700 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Multi-Source Ingestion Pipeline</span>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-teal-950 text-teal-300 border border-teal-800">
                Prompt 3 Engine
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              ABDM Tier 2, Tier 4 document OCR, patient recollections, and honest gateway fallbacks.
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
        {/* Core Architecture Principle from PDF */}
        <div className="p-3.5 bg-teal-950/40 border border-teal-800/60 rounded-xl text-xs text-slate-300 leading-relaxed">
          <div className="font-bold text-teal-200 flex items-center gap-1.5 mb-1">
            <Workflow className="w-4 h-4 text-teal-400" />
            <span>ABDM Multi-Tier Aggregation Architecture:</span>
          </div>
          <p>
            CareTrail merges clinical evidence from four distinct tiers into a unified chronological view while strictly maintaining <strong className="text-white">provenance by default</strong>. Rather than faking live ABDM network connectivity, external endpoints return an honest, documented status.
          </p>
        </div>

        {/* Quick Ingestion Action Buttons */}
        {patient && (
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Ingest Additional Sources for {patient.name}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenUploadDoc();
                }}
                className="p-2.5 rounded-lg bg-teal-950/60 hover:bg-teal-900/80 border border-teal-700/60 text-xs font-semibold text-teal-200 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-teal-400" />
                  <span>Upload Tier 4 Scan / PDF</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenAddReported();
                }}
                className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-700/80 text-xs font-semibold text-slate-200 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-4 h-4 text-amber-400" />
                  <span>Add Patient Recall Event</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Channels List */}
        <div className="space-y-3">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Connected & Configured Ingestion Channels ({channels.length})
          </div>

          {channels.map((chan) => {
            const isHonestFallback = chan.status === 'NOT_CONFIGURED_HONEST_FALLBACK';
            const isActive = chan.status === 'ACTIVE';
            const isReady = chan.status === 'READY';

            return (
              <div
                key={chan.id}
                className={`p-4 rounded-xl border transition-all ${
                  isHonestFallback
                    ? 'bg-slate-950/70 border-amber-900/50'
                    : isActive
                    ? 'bg-slate-950/80 border-slate-800 hover:border-teal-700/60'
                    : 'bg-slate-950/80 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-white">{chan.name}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-slate-800 text-teal-300 border border-slate-700">
                        {chan.code}
                      </span>
                    </div>
                    <div className="text-xs text-teal-400 font-medium mt-0.5">
                      {chan.tier}
                    </div>
                  </div>

                  <div>
                    {isActive ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        ACTIVE
                      </span>
                    ) : isReady ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                        CONSENT GATED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-amber-400" />
                        HONEST FALLBACK
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {chan.description}
                </p>

                <div className="mt-3 p-2.5 rounded-lg bg-slate-900/90 border border-slate-850 text-[11px] space-y-1">
                  <div className="text-slate-400">
                    <strong className="text-slate-300">Protocol: </strong>
                    <span className="font-mono text-teal-300">{chan.protocol}</span>
                  </div>
                  {chan.endpoint && (
                    <div className="text-slate-400">
                      <strong className="text-slate-300">Endpoint: </strong>
                      <span className="font-mono text-slate-300">{chan.endpoint}</span>
                    </div>
                  )}
                  <div className="text-slate-400 mt-1">
                    <strong className="text-slate-300">Policy: </strong>
                    {chan.details}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Category: <strong className="text-slate-200">{chan.sourceCategory}</strong></span>
                  <span className="font-mono text-teal-300 font-semibold">{chan.recordsCount} Loaded Records</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Drawer Footer */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">
          Prompt 3: Multi-Source Record Aggregation & Provenance Tracking
        </span>
        <button
          onClick={onClose}
          className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200"
        >
          Close Drawer
        </button>
      </div>
    </div>
  );
};
