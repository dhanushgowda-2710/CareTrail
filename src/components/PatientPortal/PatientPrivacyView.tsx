import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  UserCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  Building2, 
  Info,
  Stethoscope,
  ChevronRight,
  FileText
} from 'lucide-react';
import { AccessRequest, AccessGrant, PatientProfile, AuditEvent } from '../../types/caretrail';

interface PatientPrivacyViewProps {
  patient: PatientProfile;
  accessRequests: AccessRequest[];
  accessGrants: AccessGrant[];
  auditLogs: AuditEvent[];
  onApproveRequest: (requestId: string, expiryDays: number) => void;
  onRejectRequest: (requestId: string, reason: string) => void;
  onRevokeGrant: (grantId: string, reason: string) => void;
}

export const PatientPrivacyView: React.FC<PatientPrivacyViewProps> = ({
  patient,
  accessRequests,
  accessGrants,
  auditLogs,
  onApproveRequest,
  onRejectRequest,
  onRevokeGrant
}) => {
  const [activeTab, setActiveTab] = useState<'requests' | 'active_grants' | 'audit_history'>('requests');
  const [rejectReason, setRejectReason] = useState('Patient declined data sharing');
  const [revokeReason, setRevokeReason] = useState('Consultation completed; access no longer needed');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Filter requests & grants belonging to this patient
  const patientRequests = accessRequests.filter(r => r.patientId === patient.id);
  const pendingRequests = patientRequests.filter(r => r.status === 'PENDING');

  const patientGrants = accessGrants.filter(g => g.patientId === patient.id);
  const activeGrants = patientGrants.filter(g => g.status === 'ACTIVE');

  // Filter access audit events relating to this patient's chart
  const patientAudits = auditLogs.filter(
    a => a.targetPatientId === patient.id || (a.details && a.details.includes(patient.name))
  );

  const handleApprove = (reqId: string) => {
    onApproveRequest(reqId, 30);
    setActionMessage('Access request approved. The clinician can now view your records for 30 days.');
    setTimeout(() => setActionMessage(null), 4000);
  };

  const handleReject = (reqId: string) => {
    onRejectRequest(reqId, rejectReason);
    setActionMessage('Access request declined.');
    setTimeout(() => setActionMessage(null), 4000);
  };

  const handleRevoke = (grantId: string) => {
    onRevokeGrant(grantId, revokeReason);
    setActionMessage('Permission revoked immediately. The doctor is now blocked from viewing your records.');
    setTimeout(() => setActionMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Plain-Language Consent Education Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0 mt-0.5">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Your Privacy & Data Sharing Permissions
            </h2>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-3xl">
              You have full ownership of your healthcare records. Doctors outside your home hospital cannot view your medical history, test results, or prescriptions without your explicit consent. You can grant access for a limited time and revoke it whenever you choose.
            </p>

            <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 leading-normal flex items-start space-x-2">
              <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-800">Legal Notice on Revocation: </strong>
                Revoking access stops any future review of your chart. Please note that clinical records created during in-person visits you completed at a hospital are legally required to be retained in that hospital's local health archive.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Feedback Message */}
      {actionMessage && (
        <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 font-medium flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 self-start w-fit">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center space-x-2 ${
            activeTab === 'requests'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Pending Access Requests</span>
          {pendingRequests.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
              {pendingRequests.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('active_grants')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center space-x-2 ${
            activeTab === 'active_grants'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Active Permissions ({activeGrants.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('audit_history')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center space-x-2 ${
            activeTab === 'audit_history'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Access History ({patientAudits.length})</span>
        </button>
      </div>

      {/* Tab 1: Pending Access Requests */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {pendingRequests.length > 0 ? (
            pendingRequests.map(req => (
              <div
                key={req.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
                      <span>Requested on {new Date(req.createdAt).toLocaleDateString()}</span>
                      <span>·</span>
                      <span className="text-amber-700 font-medium">Awaiting Your Approval</span>
                    </div>

                    <h3 className="text-base font-semibold text-slate-900">
                      {req.doctorName} ({req.doctorDesignation})
                    </h3>

                    <div className="text-xs text-slate-600 mt-0.5">
                      {req.doctorHospitalName} · {req.doctorDepartment}
                    </div>

                    <div className="mt-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 max-w-xl text-slate-700">
                      <div><strong className="text-slate-900">Purpose: </strong>{req.purpose}</div>
                      <div className="mt-1"><strong className="text-slate-900">Requested Scope: </strong>{req.scope.join(', ')}</div>
                      <div className="mt-1 text-slate-500">Date Range: {req.dateRange}</div>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-row items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    onClick={() => handleReject(req.id)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors cursor-pointer"
                  >
                    Decline Request
                  </button>
                  <button
                    onClick={() => handleApprove(req.id)}
                    className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-medium text-xs transition-colors shadow-xs cursor-pointer flex items-center space-x-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Grant 30-Day Access</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
              <UserCheck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h4 className="text-sm font-semibold text-slate-700">No pending access requests</h4>
              <p className="text-xs text-slate-500 mt-1">
                When a doctor from another hospital requests access to your records, it will appear here for your approval.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Active Access Permissions */}
      {activeTab === 'active_grants' && (
        <div className="space-y-4">
          {activeGrants.length > 0 ? (
            activeGrants.map(grant => (
              <div
                key={grant.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
                      <span className="text-teal-800 font-medium">Active Permission</span>
                      <span>·</span>
                      <span>Granted {new Date(grant.grantedAt).toLocaleDateString()}</span>
                      <span>·</span>
                      <span>Expires {new Date(grant.expiresAt).toLocaleDateString()}</span>
                    </div>

                    <h3 className="text-base font-semibold text-slate-900">
                      {grant.doctorName}
                    </h3>
                    <div className="text-xs text-slate-600 mt-0.5">
                      {grant.doctorHospitalName} · {grant.doctorDesignation}
                    </div>

                    <div className="mt-2 text-xs text-slate-600">
                      <span><strong>Purpose:</strong> {grant.purpose}</span> · 
                      <span className="ml-1"><strong>Scope:</strong> {grant.scope.join(', ')}</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 self-end md:self-center">
                  <button
                    onClick={() => handleRevoke(grant.id)}
                    className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-medium text-xs transition-colors cursor-pointer flex items-center space-x-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Revoke Permission</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
              <Lock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h4 className="text-sm font-semibold text-slate-700">No active external permissions</h4>
              <p className="text-xs text-slate-500 mt-1">
                Your medical records are currently only accessible to your registered primary care hospital ({patient.hospitalName}).
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Access History Log */}
      {activeTab === 'audit_history' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Chart Access Log</h3>
          <p className="text-xs text-slate-500 mb-4">
            An immutable, timestamped record of every access attempt or data view for your health records.
          </p>

          {patientAudits.length > 0 ? (
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {patientAudits.slice(0, 10).map((audit) => (
                <div key={audit.id} className="p-3.5 text-xs bg-white hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-slate-500 mb-1 gap-1">
                    <span className="font-semibold text-slate-700">
                      {new Date(audit.timestamp).toLocaleString()}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Action: {audit.action}
                    </span>
                  </div>
                  <div className="text-slate-800 font-medium">
                    {audit.actorName} ({audit.actorRole}) · {audit.hospitalName}
                  </div>
                  <div className="text-slate-600 text-[11px] mt-1">
                    {audit.details}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">
              No access events recorded yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
