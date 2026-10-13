import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  User, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  Building2, 
  Lock, 
  Unlock, 
  ChevronRight,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { AccessRequest, AccessGrant, PatientProfile } from '../types/caretrail';

interface PatientConsentPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  patients: PatientProfile[];
  activePatientId: string;
  onSelectPatient: (patientId: string) => void;
  requests: AccessRequest[];
  grants: AccessGrant[];
  onApproveRequest: (requestId: string, expiryDays: number) => void;
  onRejectRequest: (requestId: string, reason: string) => void;
  onRevokeGrant: (grantId: string, reason: string) => void;
  onTestDoctorAccess: () => void;
}

export const PatientConsentPortalModal: React.FC<PatientConsentPortalModalProps> = ({
  isOpen,
  onClose,
  patients,
  activePatientId,
  onSelectPatient,
  requests,
  grants,
  onApproveRequest,
  onRejectRequest,
  onRevokeGrant,
  onTestDoctorAccess
}) => {
  const [activeTab, setActiveTab] = useState<'requests' | 'active_grants'>('requests');

  if (!isOpen) return null;

  const currentPatient = patients.find(p => p.id === activePatientId) || patients[0];
  const patientRequests = requests.filter(r => r.patientId === currentPatient.id);
  const pendingRequests = patientRequests.filter(r => r.status === 'PENDING');
  
  const patientGrants = grants.filter(g => g.patientId === currentPatient.id);
  const activeGrants = patientGrants.filter(g => g.status === 'ACTIVE');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-teal-600/60 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-start space-x-3">
            <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs px-2 py-0.5 rounded font-bold bg-teal-950 text-teal-300 border border-teal-800">
                  ABDM PHR CONSENT MANAGER
                </span>
                <span className="text-xs text-emerald-400 font-semibold">
                  Patient Gatekeeper Flow
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">
                Patient Consent & Data Sharing Portal
              </h3>
              <p className="text-xs text-slate-400">
                You control which hospitals and doctors can access your longitudinal health records.
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

        {/* Patient Switcher Bar */}
        <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-full bg-teal-800/60 border border-teal-600/50 flex items-center justify-center text-teal-200 font-bold text-xs">
              {currentPatient.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>{currentPatient.name}</span>
                <span className="text-[11px] font-mono text-teal-400">({currentPatient.abhaId})</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Registered Hospital: <strong className="text-slate-300">{currentPatient.hospitalName}</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-[11px] text-slate-400 font-medium">Switch Patient:</label>
            <select
              value={currentPatient.id}
              onChange={(e) => onSelectPatient(e.target.value)}
              className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs text-teal-300 font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.hospitalName.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-4 flex items-center space-x-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
              activeTab === 'requests'
                ? 'bg-teal-700 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Requests ({pendingRequests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('active_grants')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
              activeTab === 'active_grants'
                ? 'bg-teal-700 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Unlock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Active Consent Grants ({activeGrants.length})</span>
          </button>
        </div>

        {/* Tab 1: Pending Requests */}
        {activeTab === 'requests' && (
          <div className="mt-4 space-y-3">
            {pendingRequests.length === 0 ? (
              <div className="p-8 text-center bg-slate-950/60 rounded-xl border border-dashed border-slate-800">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-300">No pending consent requests</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  When an external clinician requests access to your medical history, it will appear here for your explicit authorization.
                </p>
              </div>
            ) : (
              pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-xl border border-teal-700/60 bg-slate-950/80 shadow-md space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-white">{req.doctorName}</span>
                        <span className="text-xs text-slate-400">({req.doctorDesignation})</span>
                      </div>
                      <div className="text-xs text-teal-400 font-medium mt-0.5 flex items-center space-x-1">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>{req.doctorHospitalName} • {req.doctorDepartment}</span>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">
                      PENDING CONSENT
                    </span>
                  </div>

                  {/* Purpose */}
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-850 text-xs">
                    <span className="text-slate-400 font-semibold">Clinical Purpose: </span>
                    <span className="text-slate-200">{req.purpose}</span>
                  </div>

                  {/* Scope & Duration */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                    <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-400 text-[10px] uppercase font-semibold block">Requested Scope:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {req.scope.map((s, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-teal-950 text-teal-300 border border-teal-800">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-400 text-[10px] uppercase font-semibold block">Duration & Period:</span>
                      <span className="font-semibold text-slate-200 mt-1 block">
                        30 Days ({req.dateRange})
                      </span>
                    </div>
                  </div>

                  {/* Approve / Deny Buttons */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onRejectRequest(req.id, 'Declined by patient')}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 flex items-center space-x-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Deny Request</span>
                    </button>

                    <button
                      onClick={() => onApproveRequest(req.id, 30)}
                      className="px-4 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white shadow-md flex items-center space-x-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve & Grant Access</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Active Grants */}
        {activeTab === 'active_grants' && (
          <div className="mt-4 space-y-3">
            {activeGrants.length === 0 ? (
              <div className="p-8 text-center bg-slate-950/60 rounded-xl border border-dashed border-slate-800">
                <Lock className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-300">No active external doctor grants</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  You currently have not granted cross-hospital access to any external clinicians.
                </p>
              </div>
            ) : (
              activeGrants.map((grant) => (
                <div
                  key={grant.id}
                  className="p-4 rounded-xl border border-emerald-700/60 bg-slate-950/80 shadow-md space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-white">{grant.doctorName}</span>
                        <span className="text-xs text-slate-400">({grant.doctorDesignation})</span>
                      </div>
                      <div className="text-xs text-emerald-400 font-medium mt-0.5 flex items-center space-x-1">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>{grant.doctorHospitalName}</span>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                      <Unlock className="w-3 h-3" />
                      ACTIVE GRANT
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-850 text-xs">
                    <span className="text-slate-400 font-semibold">Authorized Purpose: </span>
                    <span className="text-slate-200">{grant.purpose}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-900/60 p-2 rounded">
                    <div>
                      <span>Expires on: </span>
                      <strong className="text-slate-200">{new Date(grant.expiresAt).toLocaleDateString()}</strong>
                    </div>
                    <span className="font-mono text-[10px] text-slate-500">ID: {grant.id}</span>
                  </div>

                  {/* Immediate Revocation Button */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <button
                      onClick={onTestDoctorAccess}
                      className="text-xs text-teal-400 hover:underline flex items-center gap-1"
                    >
                      <span>Test Doctor View Now (200 OK)</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => onRevokeGrant(grant.id, 'Revoked by patient via ABDM portal')}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-800 flex items-center space-x-1.5 transition-colors"
                      title="Instantly blocks doctor from subsequent queries (403 Forbidden)"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                      <span>Revoke Access Immediately</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            Compliant with ABDM Consent Framework & DPDP Rules 2025.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200"
          >
            Close Portal
          </button>
        </div>
      </div>
    </div>
  );
};
