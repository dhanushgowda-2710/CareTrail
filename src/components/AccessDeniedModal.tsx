import React from 'react';
import { ShieldAlert, Lock, X, ArrowRight, FileCheck, Terminal, AlertCircle } from 'lucide-react';
import { StaffProfile, PatientProfile } from '../types/caretrail';

interface AccessDeniedModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffProfile;
  deniedPatient: PatientProfile | null;
  denialMessage: string;
  hasPendingRequest?: boolean;
  hasRevokedGrant?: boolean;
  onRequestAccess: () => void;
  onOpenConsentPortal: () => void;
  onOpenAudit: () => void;
  onOpenInspector: () => void;
}

export const AccessDeniedModal: React.FC<AccessDeniedModalProps> = ({
  isOpen,
  onClose,
  staff,
  deniedPatient,
  denialMessage,
  hasPendingRequest,
  hasRevokedGrant,
  onRequestAccess,
  onOpenConsentPortal,
  onOpenAudit,
  onOpenInspector
}) => {
  if (!isOpen || !deniedPatient) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border-2 border-rose-600/70 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden">
        {/* Top Accent Strip */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-rose-600 via-amber-500 to-rose-600" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-rose-950 border border-rose-700/80 flex items-center justify-center text-rose-400 shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-rose-900 text-rose-200 border border-rose-700">
                HTTP 403 FORBIDDEN
              </span>
              <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
                Boundary Protection
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">
              Cross-Hospital Access Prohibited
            </h3>
          </div>
        </div>

        {/* Body */}
        <div className="mt-4 space-y-3.5">
          <div className="p-3.5 bg-rose-950/40 rounded-xl border border-rose-900/60 text-xs text-rose-200 leading-relaxed">
            <p className="font-semibold text-rose-100 mb-1 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              <span>Backend Access Rule:</span>
            </p>
            <p className="font-mono text-[11px] bg-black/40 p-2 rounded text-rose-300 mb-2">
              staff.hospitalId ('{staff.hospitalId}') !== patient.hospitalId ('{deniedPatient.hospitalId}')
            </p>
            <p>{denialMessage}</p>
          </div>

          {/* Breakdown of Facility Scopes */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Active Requester</div>
              <div className="font-semibold text-slate-200 mt-0.5">{staff.name}</div>
              <div className="text-teal-400 text-[11px] font-medium">{staff.hospitalName}</div>
              <div className="text-[10px] text-slate-500 font-mono mt-1">Facility: {staff.hospitalId}</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Target Patient</div>
              <div className="font-semibold text-slate-200 mt-0.5">{deniedPatient.name}</div>
              <div className="text-amber-400 text-[11px] font-medium">{deniedPatient.hospitalName}</div>
              <div className="text-[10px] text-slate-500 font-mono mt-1">Facility: {deniedPatient.hospitalId}</div>
            </div>
          </div>

          {/* ABDM Prompt 2 Solution Banner */}
          <div className="p-3 rounded-xl bg-teal-950/50 border border-teal-700/60 text-xs space-y-2">
            <div className="font-semibold text-teal-300 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>Prompt 2 Solution: ABDM Consent-Driven Share Request</span>
            </div>
            <p className="text-slate-300">
              Under ABDM guidelines, clinicians can request cross-hospital access by submitting a digital consent request. Once the patient approves in their portal, access is granted.
            </p>

            <div className="pt-1 flex items-center gap-2">
              {hasPendingRequest ? (
                <button
                  onClick={() => {
                    onClose();
                    onOpenConsentPortal();
                  }}
                  className="px-3 py-1.5 bg-amber-900/80 hover:bg-amber-800 text-amber-200 rounded-lg font-semibold text-xs flex items-center space-x-1"
                >
                  <span>Request Pending &rarr; Open Patient Portal to Approve</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    onClose();
                    onRequestAccess();
                  }}
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-bold text-xs flex items-center space-x-1 shadow-sm"
                >
                  <span>Request Access from {deniedPatient.name}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onClose();
                onOpenInspector();
              }}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center space-x-1"
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Inspect API</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenAudit();
              }}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center space-x-1"
            >
              <FileCheck className="w-3.5 h-3.5 text-rose-400" />
              <span>View Audit</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
