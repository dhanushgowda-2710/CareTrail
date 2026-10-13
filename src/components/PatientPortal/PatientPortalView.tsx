import React, { useState } from 'react';
import { 
  Activity, 
  FileText, 
  UploadCloud, 
  Lock, 
  User, 
  AlertTriangle 
} from 'lucide-react';
import { PatientProfile, MedicalRecord, AccessRequest, AccessGrant, AuditEvent } from '../../types/caretrail';
import { PatientDashboard } from './PatientDashboard';
import { PatientRecordsTimeline } from './PatientRecordsTimeline';
import { PatientDocumentsView } from './PatientDocumentsView';
import { PatientPrivacyView } from './PatientPrivacyView';
import { PatientProfileView } from './PatientProfileView';

interface PatientPortalViewProps {
  patient: PatientProfile;
  records: MedicalRecord[];
  accessRequests: AccessRequest[];
  accessGrants: AccessGrant[];
  auditLogs: AuditEvent[];
  onUploadDocument: (docData: any) => void;
  onOpenDisputeModal: (record: MedicalRecord) => void;
  onOpenRecordHistory?: (record: MedicalRecord) => void;
  onApproveRequest: (requestId: string, expiryDays: number) => void;
  onRejectRequest: (requestId: string, reason: string) => void;
  onRevokeGrant: (grantId: string, reason: string) => void;
}

export const PatientPortalView: React.FC<PatientPortalViewProps> = ({
  patient,
  records,
  accessRequests,
  accessGrants,
  auditLogs,
  onUploadDocument,
  onOpenDisputeModal,
  onOpenRecordHistory,
  onApproveRequest,
  onRejectRequest,
  onRevokeGrant
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'records' | 'documents' | 'privacy' | 'profile'>('overview');
  const [selectedRecordForDetail, setSelectedRecordForDetail] = useState<MedicalRecord | null>(null);

  const pendingRequestsCount = accessRequests.filter(r => r.patientId === patient.id && r.status === 'PENDING').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Patient Portal Secondary Navigation Bar */}
      <nav aria-label="Patient Portal Navigation" className="flex flex-wrap items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-2xl shadow-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-colors ${
            activeTab === 'overview'
              ? 'bg-teal-700 text-white shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Health Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('records')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-colors ${
            activeTab === 'records'
              ? 'bg-teal-700 text-white shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>My Medical Records</span>
          <span className={`text-[11px] px-1.5 py-0.2 rounded-md ${activeTab === 'records' ? 'bg-teal-800 text-white' : 'bg-slate-100 text-slate-600'}`}>
            {records.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('documents')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-colors ${
            activeTab === 'documents'
              ? 'bg-teal-700 text-white shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          <span>My Documents</span>
        </button>

        <button
          onClick={() => setActiveTab('privacy')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-colors relative ${
            activeTab === 'privacy'
              ? 'bg-teal-700 text-white shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Privacy & Access</span>
          {pendingRequestsCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
              {pendingRequestsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-colors ${
            activeTab === 'profile'
              ? 'bg-teal-700 text-white shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile & Corrections</span>
        </button>
      </nav>

      {/* Render Selected View */}
      {activeTab === 'overview' && (
        <PatientDashboard
          patient={patient}
          records={records}
          onNavigateTab={setActiveTab}
          onSelectRecordForDetail={(rec) => {
            setSelectedRecordForDetail(rec);
            setActiveTab('records');
          }}
        />
      )}

      {activeTab === 'records' && (
        <PatientRecordsTimeline
          patient={patient}
          records={records}
          onOpenDisputeModal={onOpenDisputeModal}
          onOpenRecordHistory={onOpenRecordHistory}
          selectedRecordForDetail={selectedRecordForDetail}
          onSelectRecordForDetail={setSelectedRecordForDetail}
        />
      )}

      {activeTab === 'documents' && (
        <PatientDocumentsView
          patient={patient}
          records={records}
          onUploadDocument={onUploadDocument}
          onSelectRecordForDetail={(rec) => {
            setSelectedRecordForDetail(rec);
            setActiveTab('records');
          }}
        />
      )}

      {activeTab === 'privacy' && (
        <PatientPrivacyView
          patient={patient}
          accessRequests={accessRequests}
          accessGrants={accessGrants}
          auditLogs={auditLogs}
          onApproveRequest={onApproveRequest}
          onRejectRequest={onRejectRequest}
          onRevokeGrant={onRevokeGrant}
        />
      )}

      {activeTab === 'profile' && (
        <PatientProfileView
          patient={patient}
          records={records}
          onOpenDisputeModal={onOpenDisputeModal}
        />
      )}
    </div>
  );
};
