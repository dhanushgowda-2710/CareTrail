import React, { useState } from 'react';
import { 
  Calendar, 
  Filter, 
  Stethoscope, 
  Pill, 
  FlaskConical, 
  FileText, 
  UploadCloud, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Building2, 
  ChevronRight,
  User,
  ShieldCheck,
  Eye,
  Flag,
  FileEdit,
  History
} from 'lucide-react';
import { MedicalRecord, PatientProfile } from '../../types/caretrail';

interface PatientRecordsTimelineProps {
  patient: PatientProfile;
  records: MedicalRecord[];
  onOpenDisputeModal: (record: MedicalRecord) => void;
  onOpenRecordHistory?: (record: MedicalRecord) => void;
  selectedRecordForDetail: MedicalRecord | null;
  onSelectRecordForDetail: (record: MedicalRecord | null) => void;
}

export const PatientRecordsTimeline: React.FC<PatientRecordsTimelineProps> = ({
  patient,
  records,
  onOpenDisputeModal,
  onOpenRecordHistory,
  selectedRecordForDetail,
  onSelectRecordForDetail
}) => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CONSULTATION' | 'PRESCRIPTION' | 'LAB_REPORT' | 'UPLOADED' | 'REPORTED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter records
  const filteredRecords = records.filter(r => {
    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTitle = r.title.toLowerCase().includes(q);
      const matchNotes = (r.clinicalNotes || '').toLowerCase().includes(q);
      const matchHospital = r.hospitalName.toLowerCase().includes(q);
      const matchDiagnosis = (r.diagnosis || '').toLowerCase().includes(q);
      if (!matchTitle && !matchNotes && !matchHospital && !matchDiagnosis) return false;
    }

    // Type filter
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'CONSULTATION') return r.type === 'CONSULTATION';
    if (activeFilter === 'PRESCRIPTION') return r.type === 'PRESCRIPTION';
    if (activeFilter === 'LAB_REPORT') return r.type === 'LAB_REPORT';
    if (activeFilter === 'UPLOADED') return r.sourceCategory === 'PATIENT_UPLOADED';
    if (activeFilter === 'REPORTED') return r.sourceCategory === 'PATIENT_REPORTED';
    return true;
  });

  const getRecordIcon = (r: MedicalRecord) => {
    if (r.type === 'CONSULTATION') return <Stethoscope className="w-4 h-4 text-teal-700" />;
    if (r.type === 'PRESCRIPTION') return <Pill className="w-4 h-4 text-teal-700" />;
    if (r.type === 'LAB_REPORT') return <FlaskConical className="w-4 h-4 text-teal-700" />;
    if (r.sourceCategory === 'PATIENT_UPLOADED') return <UploadCloud className="w-4 h-4 text-teal-700" />;
    return <FileText className="w-4 h-4 text-teal-700" />;
  };

  const getVerificationBadge = (r: MedicalRecord) => {
    if (r.isDisputed || r.verificationStatus === 'DISPUTED') {
      return (
        <span className="inline-flex items-center space-x-1 text-xs text-rose-700 font-medium">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
          <span>Disputed by Patient</span>
        </span>
      );
    }
    if (r.verificationStatus === 'VERIFIED') {
      return (
        <span className="inline-flex items-center space-x-1 text-xs text-teal-800 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
          <span>Clinician Verified</span>
        </span>
      );
    }
    if (r.sourceCategory === 'PATIENT_REPORTED') {
      return (
        <span className="inline-flex items-center space-x-1 text-xs text-slate-600">
          <User className="w-3.5 h-3.5 text-slate-500" />
          <span>Patient-Reported History</span>
        </span>
      );
    }
    if (r.sourceCategory === 'PATIENT_UPLOADED') {
      return (
        <span className="inline-flex items-center space-x-1 text-xs text-teal-800 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
          <span>AI-Summarized Document</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 text-xs text-teal-800 font-medium">
        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
        <span>Clinical Record</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Filter and Search Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Medical Records Timeline</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Chronological clinical history ordered by date of service with explicit provenance.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Search box */}
          <input
            type="text"
            placeholder="Search records, doctor, tests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-teal-700 focus:bg-white transition-colors"
          />

          {/* Record Count */}
          <span className="text-xs text-slate-500 self-center hidden sm:inline">
            Showing {filteredRecords.length} records
          </span>
        </div>
      </div>

      {/* Filter Tabs (Interactive Segmented Buttons) */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
        <button
          onClick={() => setActiveFilter('ALL')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            activeFilter === 'ALL'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Records ({records.length})
        </button>
        <button
          onClick={() => setActiveFilter('CONSULTATION')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            activeFilter === 'CONSULTATION'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Consultations
        </button>
        <button
          onClick={() => setActiveFilter('PRESCRIPTION')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            activeFilter === 'PRESCRIPTION'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Prescriptions
        </button>
        <button
          onClick={() => setActiveFilter('LAB_REPORT')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            activeFilter === 'LAB_REPORT'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Laboratory Reports
        </button>
        <button
          onClick={() => setActiveFilter('UPLOADED')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            activeFilter === 'UPLOADED'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Patient Uploads
        </button>
        <button
          onClick={() => setActiveFilter('REPORTED')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            activeFilter === 'REPORTED'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Self-Reported
        </button>
      </div>

      {/* Timeline List */}
      <div className="space-y-4">
        {filteredRecords.length > 0 ? (
          filteredRecords.map((record) => (
            <div
              key={record.id}
              className={`bg-white border rounded-xl p-5 shadow-xs transition-all ${
                record.isDisputed 
                  ? 'border-rose-200 bg-rose-50/20' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                {/* Left: Icon, Date, Title, Source */}
                <div className="flex items-start space-x-3.5">
                  <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-200/80 flex items-center justify-center shrink-0 mt-0.5">
                    {getRecordIcon(record)}
                  </div>

                  <div>
                    {/* Metadata line without pill enclosure */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-1">
                      <span className="font-semibold text-slate-700">{record.encounterDate}</span>
                      <span aria-hidden="true">·</span>
                      <span>{record.hospitalName}</span>
                      {record.branchName && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{record.branchName}</span>
                        </>
                      )}
                      <span aria-hidden="true">·</span>
                      <span>{record.type.replace('_', ' ')}</span>
                    </div>

                    <h3 className="text-base font-semibold text-slate-900 leading-snug">
                      {record.title}
                    </h3>

                    {/* Author Attribution */}
                    <div className="text-xs text-slate-600 mt-1 flex items-center space-x-2">
                      <span>Author: {record.authorStaffName} ({record.authorRole})</span>
                    </div>

                    {/* Diagnosis or snippet */}
                    {record.diagnosis && (
                      <div className="mt-2 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 inline-block">
                        <span className="font-semibold text-slate-900">Diagnosis: </span>
                        {record.diagnosis}
                      </div>
                    )}

                    {/* Verification and provenance status */}
                    <div className="mt-3 flex items-center space-x-3">
                      {getVerificationBadge(record)}
                    </div>

                    {/* Active Dispute Warning Notice */}
                    {record.isDisputed && (
                      <div className="mt-3 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-900">
                        <span className="font-semibold">Dispute on file: </span>
                        {record.activeDispute?.reason || record.disputeNotes}
                        <div className="text-[11px] text-rose-700 mt-0.5">
                          Status: {record.activeDispute?.status || 'UNDER CLINICAL REVIEW'} · Original record preserved.
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex sm:flex-col items-end gap-2 shrink-0 pt-2 sm:pt-0">
                  <button
                    onClick={() => onSelectRecordForDetail(record)}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>View Details</span>
                  </button>

                  {!record.isDisputed && (
                    <button
                      onClick={() => onOpenDisputeModal(record)}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                      title="Report factual inaccuracy or missing context"
                    >
                      <Flag className="w-3.5 h-3.5" />
                      <span>Flag as Incorrect</span>
                    </button>
                  )}

                  {record.addenda && record.addenda.length > 0 && onOpenRecordHistory && (
                    <button
                      onClick={() => onOpenRecordHistory(record)}
                      className="inline-flex items-center space-x-1 text-[11px] text-teal-700 hover:underline cursor-pointer"
                    >
                      <History className="w-3 h-3" />
                      <span>{record.addenda.length} Addenda Logged</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-semibold text-slate-700">No matching medical records found</h4>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search query or selected category filter.
            </p>
          </div>
        )}
      </div>

      {/* Record Detail Modal */}
      {selectedRecordForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <div className="text-xs text-slate-500 flex items-center space-x-2">
                  <span>{selectedRecordForDetail.encounterDate}</span>
                  <span>·</span>
                  <span>{selectedRecordForDetail.hospitalName}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {selectedRecordForDetail.title}
                </h3>
              </div>
              <button
                onClick={() => onSelectRecordForDetail(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 space-y-5 text-xs text-slate-700">
              {/* Provenance Banner */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 block text-[10px]">RECORD PROVENANCE</span>
                  <div className="font-medium text-slate-800 mt-0.5">
                    {selectedRecordForDetail.sourceSystemName}
                  </div>
                </div>
                <div>{getVerificationBadge(selectedRecordForDetail)}</div>
              </div>

              {/* Clinical Notes */}
              <div>
                <h4 className="font-semibold text-slate-900 text-xs mb-1.5">Clinical Notes & Observations</h4>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 leading-relaxed whitespace-pre-line">
                  {selectedRecordForDetail.clinicalNotes || 'No notes attached.'}
                </div>
              </div>

              {/* Prescriptions if available */}
              {selectedRecordForDetail.prescriptions && selectedRecordForDetail.prescriptions.length > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-900 text-xs mb-1.5">Prescribed Medications</h4>
                  <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
                    {selectedRecordForDetail.prescriptions.map((p, i) => (
                      <div key={i} className="p-3 bg-white flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-slate-900">{p.medicineName}</div>
                          <div className="text-slate-500 text-[11px]">{p.dosage} · {p.frequency} · {p.duration}</div>
                        </div>
                        {p.instructions && (
                          <div className="text-slate-600 text-[11px] italic">{p.instructions}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Lab Results if available */}
              {selectedRecordForDetail.labResults && selectedRecordForDetail.labResults.length > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-900 text-xs mb-1.5">Standardized Lab Values</h4>
                  <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
                    {selectedRecordForDetail.labResults.map((lr, i) => (
                      <div key={i} className="p-3 bg-white flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-slate-900">{lr.testName}</div>
                          <div className="text-slate-500 text-[11px]">Reference: {lr.referenceRange}</div>
                        </div>
                        <div className="text-right">
                          <span className={`font-bold ${lr.isAbnormal ? 'text-amber-700' : 'text-slate-900'}`}>
                            {lr.value} {lr.unit}
                          </span>
                          {lr.isAbnormal && (
                            <span className="block text-[10px] text-amber-700 uppercase">Attention</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Extraction Disclaimer if applicable */}
              {selectedRecordForDetail.sourceCategory === 'PATIENT_UPLOADED' && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] leading-relaxed">
                  <span className="font-bold">Medical Review Notice: </span>
                  This record was created from an uploaded document using optical text extraction. It has not yet been validated by a licensed physician and must not be interpreted as an official medical diagnosis.
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              {!selectedRecordForDetail.isDisputed ? (
                <button
                  onClick={() => {
                    const rec = selectedRecordForDetail;
                    onSelectRecordForDetail(null);
                    onOpenDisputeModal(rec);
                  }}
                  className="inline-flex items-center space-x-1.5 text-xs text-rose-700 hover:underline font-medium cursor-pointer"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>Report error in this record</span>
                </button>
              ) : (
                <span className="text-xs text-rose-700 font-medium">Record is marked disputed</span>
              )}

              <button
                onClick={() => onSelectRecordForDetail(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
