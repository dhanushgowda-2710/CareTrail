import React from 'react';
import { 
  Pill, 
  AlertTriangle, 
  Activity, 
  FlaskConical, 
  Stethoscope, 
  FileText, 
  Clock, 
  ShieldCheck, 
  ChevronRight, 
  Calendar,
  Building2,
  Info
} from 'lucide-react';
import { PatientProfile, MedicalRecord } from '../../types/caretrail';

interface PatientDashboardProps {
  patient: PatientProfile;
  records: MedicalRecord[];
  onNavigateTab: (tab: 'overview' | 'records' | 'documents' | 'privacy' | 'profile') => void;
  onSelectRecordForDetail: (record: MedicalRecord) => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  patient,
  records,
  onNavigateTab,
  onSelectRecordForDetail
}) => {
  // Extract active medications from records and chronic conditions
  const allPrescriptions = records.flatMap(r => r.prescriptions || []);
  const uniqueMedications = Array.from(
    new Map(allPrescriptions.map(p => [p.medicineName.toLowerCase(), p])).values()
  );

  // Most recent test results
  const labRecords = records.filter(r => r.type === 'LAB_REPORT' && r.labResults && r.labResults.length > 0);
  const recentLabResults = labRecords.flatMap(r => 
    (r.labResults || []).map(lr => ({
      ...lr,
      date: r.encounterDate,
      source: r.hospitalName,
      record: r
    }))
  ).slice(0, 4);

  // Most recent consultations
  const recentConsultations = records
    .filter(r => r.type === 'CONSULTATION')
    .slice(0, 3);

  // Recently added documents
  const recentDocuments = records
    .filter(r => r.sourceCategory === 'PATIENT_UPLOADED' || !!r.originalDocumentName)
    .slice(0, 3);

  // Last updated timestamp
  const lastUpdated = records.length > 0
    ? new Date(records[0].createdAt || records[0].encounterDate).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : 'Recently';

  return (
    <div className="space-y-6">
      {/* Top Greeting & Health Identity Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-medium text-teal-800 uppercase tracking-wider mb-1">
            Patient Health Summary
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {patient.name.split(' ')[0]}
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Registered at {patient.hospitalName} ({patient.registeredBranchName}) · Records last updated {lastUpdated}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl p-3">
          <div>
            <span className="text-slate-400 block text-[10px]">MEDICAL ID</span>
            <span className="font-semibold text-slate-800">{patient.mrn}</span>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div>
            <span className="text-slate-400 block text-[10px]">BLOOD GROUP</span>
            <span className="font-semibold text-slate-800">{patient.bloodGroup}</span>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div>
            <span className="text-slate-400 block text-[10px]">AGE & GENDER</span>
            <span className="font-semibold text-slate-800">{patient.age}y · {patient.gender}</span>
          </div>
        </div>
      </div>

      {/* Grid: 6 Real Clinical Overview Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* 1. Current Medications */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-slate-900 font-semibold text-sm">
                <Pill className="w-4 h-4 text-teal-700" />
                <span>Current Medications</span>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {uniqueMedications.length} Active
              </span>
            </div>

            <div className="mt-3 space-y-2.5">
              {uniqueMedications.length > 0 ? (
                uniqueMedications.slice(0, 4).map((med, idx) => (
                  <div key={idx} className="text-xs">
                    <div className="font-medium text-slate-900">{med.medicineName}</div>
                    <div className="text-slate-500 text-[11px]">
                      {med.dosage} · {med.frequency}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 py-3">No active medications recorded.</div>
              )}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('records')}
            className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-teal-700 font-medium hover:text-teal-900 transition-colors"
          >
            <span>View all in medical timeline</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 2. Known Allergies */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-slate-900 font-semibold text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Known Allergies</span>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {patient.allergies.length} Recorded
              </span>
            </div>

            <div className="mt-3 space-y-2">
              {patient.allergies.length > 0 ? (
                patient.allergies.map((allergy, idx) => (
                  <div key={idx} className="text-xs p-2 rounded-lg bg-amber-50/60 border border-amber-200/60 text-amber-950 font-medium">
                    {allergy}
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 py-3">No known allergies on file.</div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center space-x-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Always alert clinical staff before new procedures or prescriptions.</span>
          </div>
        </div>

        {/* 3. Active Health Conditions */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-slate-900 font-semibold text-sm">
                <Activity className="w-4 h-4 text-teal-700" />
                <span>Active Conditions</span>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {patient.chronicConditions.length} Diagnoses
              </span>
            </div>

            <div className="mt-3 space-y-2">
              {patient.chronicConditions.length > 0 ? (
                patient.chronicConditions.map((cond, idx) => (
                  <div key={idx} className="text-xs p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 font-medium">
                    {cond}
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 py-3">No active health conditions diagnosed.</div>
              )}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('records')}
            className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-teal-700 font-medium hover:text-teal-900 transition-colors"
          >
            <span>View diagnostic history</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4. Most Recent Test Results */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-slate-900 font-semibold text-sm">
                <FlaskConical className="w-4 h-4 text-teal-700" />
                <span>Recent Test Results</span>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Lab Reports
              </span>
            </div>

            <div className="mt-3 space-y-2.5">
              {recentLabResults.length > 0 ? (
                recentLabResults.map((test, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelectRecordForDetail(test.record)}
                    className="w-full text-left text-xs p-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-medium text-slate-900 group-hover:text-teal-800">
                        {test.testName}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {test.date} · Ref: {test.referenceRange}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${test.isAbnormal ? 'text-amber-700 font-bold' : 'text-slate-800'}`}>
                        {test.value} {test.unit}
                      </div>
                      {test.isAbnormal && (
                        <span className="text-[10px] text-amber-700 uppercase font-medium">Attention</span>
                      )}
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-xs text-slate-500 py-3">No recent laboratory tests found.</div>
              )}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('records')}
            className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-teal-700 font-medium hover:text-teal-900 transition-colors"
          >
            <span>View all laboratory reports</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 5. Recent Consultations */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-slate-900 font-semibold text-sm">
                <Stethoscope className="w-4 h-4 text-teal-700" />
                <span>Recent Consultations</span>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Clinical Visits
              </span>
            </div>

            <div className="mt-3 space-y-2.5">
              {recentConsultations.length > 0 ? (
                recentConsultations.map((enc, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelectRecordForDetail(enc)}
                    className="w-full text-left text-xs p-2 rounded-lg hover:bg-slate-50 transition-colors group"
                  >
                    <div className="font-medium text-slate-900 group-hover:text-teal-800">
                      {enc.title}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {enc.encounterDate} · {enc.authorStaffName} ({enc.hospitalName})
                    </div>
                    {enc.diagnosis && (
                      <div className="text-[11px] text-teal-800 font-medium mt-1">
                        Diagnosis: {enc.diagnosis}
                      </div>
                    )}
                  </button>
                ))
              ) : (
                <div className="text-xs text-slate-500 py-3">No consultation notes recorded.</div>
              )}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('records')}
            className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-teal-700 font-medium hover:text-teal-900 transition-colors"
          >
            <span>View clinical notes</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 6. Recently Added Documents */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-slate-900 font-semibold text-sm">
                <FileText className="w-4 h-4 text-teal-700" />
                <span>Uploaded Documents</span>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                PDF & Scans
              </span>
            </div>

            <div className="mt-3 space-y-2.5">
              {recentDocuments.length > 0 ? (
                recentDocuments.map((doc, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelectRecordForDetail(doc)}
                    className="w-full text-left text-xs p-2 rounded-lg hover:bg-slate-50 transition-colors group"
                  >
                    <div className="font-medium text-slate-900 group-hover:text-teal-800 truncate">
                      {doc.originalDocumentName || doc.title}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 flex items-center space-x-1.5">
                      <span>{doc.encounterDate}</span>
                      <span>·</span>
                      <span className={doc.verificationStatus === 'VERIFIED' ? 'text-emerald-700 font-medium' : 'text-amber-700'}>
                        {doc.verificationStatus === 'VERIFIED' ? 'Clinician Verified' : 'Awaiting Review'}
                      </span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-xs text-slate-500 py-3">No documents uploaded yet.</div>
              )}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('documents')}
            className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-teal-700 font-medium hover:text-teal-900 transition-colors"
          >
            <span>Upload or manage files</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
