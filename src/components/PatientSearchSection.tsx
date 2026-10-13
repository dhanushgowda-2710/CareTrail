import React, { useState } from 'react';
import { 
  Search, 
  User, 
  FileText, 
  Lock, 
  ExternalLink, 
  ShieldCheck, 
  AlertTriangle, 
  ChevronRight,
  Filter,
  ArrowUpRight,
  Fingerprint
} from 'lucide-react';
import { PatientProfile, StaffProfile, AccessRequest, AccessGrant } from '../types/caretrail';

interface PatientSearchSectionProps {
  currentStaff: StaffProfile;
  patients: PatientProfile[];
  allPatients: PatientProfile[];
  accessRequests: AccessRequest[];
  accessGrants: AccessGrant[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectPatient: (patientId: string) => void;
  onRequestAccess: (patient: PatientProfile) => void;
  onOpenConsentPortal: () => void;
  selectedPatientId?: string;
}

export const PatientSearchSection: React.FC<PatientSearchSectionProps> = ({
  currentStaff,
  patients,
  allPatients,
  accessRequests,
  accessGrants,
  searchQuery,
  onSearchChange,
  onSelectPatient,
  onRequestAccess,
  onOpenConsentPortal,
  selectedPatientId
}) => {
  const [activeTab, setActiveTab] = useState<'in_network' | 'cross_hospital'>('in_network');

  // Filter cross hospital patients (patients registered elsewhere)
  const crossHospitalPatients = allPatients.filter(p => p.hospitalId !== currentStaff.hospitalId);

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-lg">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>Intra-Hospital Patient Lookup</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-teal-950 text-teal-300 border border-teal-800">
              GET /api/staff/patients?hospitalId={currentStaff.hospitalId}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Internal registry search scoped to {currentStaff.hospitalName}. Query by Name, MRN (e.g. AP-2024-8841), or ABHA ID.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('in_network')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              activeTab === 'in_network'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>In-Hospital Network ({patients.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('cross_hospital')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              activeTab === 'cross_hospital'
                ? 'bg-rose-900/80 text-rose-200 border border-rose-700/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Inspect external hospital patients to verify 403 Forbidden enforcement"
          >
            <Lock className="w-3.5 h-3.5 text-rose-400" />
            <span>Cross-Hospital Directory ({crossHospitalPatients.length})</span>
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="mt-4 relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={`Find patient in ${currentStaff.hospitalName} by Name, ABHA ID (e.g. 91-4821...), MRN, or condition...`}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all shadow-inner"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs text-slate-400 hover:text-slate-200"
          >
            Clear
          </button>
        )}
      </div>

      {/* Content depending on Active Tab */}
      {activeTab === 'in_network' ? (
        <div className="mt-4">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Scoped In-Hospital Results</span>
            <span className="text-teal-400 font-mono text-[10px]">where: hospitalId = {currentStaff.hospitalId}</span>
          </div>

          {patients.length === 0 ? (
            <div className="p-8 text-center bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
              <User className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-300">No matching patients found</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No patient matching "{searchQuery}" is registered under {currentStaff.hospitalName}.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {patients.map((pat) => {
                const isSelected = pat.id === selectedPatientId;
                const isExternal = pat.hospitalId !== currentStaff.hospitalId;
                const activeGrant = accessGrants.find(
                  g => g.doctorId === currentStaff.id && g.patientId === pat.id && g.status === 'ACTIVE'
                );

                return (
                  <div
                    key={pat.id}
                    onClick={() => onSelectPatient(pat.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all relative group ${
                      isSelected
                        ? 'bg-gradient-to-b from-teal-950/70 to-slate-900 border-teal-500 shadow-md shadow-teal-950'
                        : isExternal
                        ? 'bg-teal-950/30 border-teal-700/60 hover:border-teal-500'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-teal-700/70 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm text-white group-hover:text-teal-300 transition-colors">
                            {pat.name}
                          </span>
                          <span className="text-xs text-slate-400">
                            {pat.age}y / {pat.gender === 'Male' ? 'M' : 'F'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-teal-300 border border-slate-700">
                            MRN: {pat.mrn}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            Blood: {pat.bloodGroup}
                          </span>
                        </div>
                      </div>

                      <div className="p-1 rounded-full bg-teal-500/10 text-teal-400 group-hover:bg-teal-500/20">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>

                    {/* ABHA Identifier & Consent Badge */}
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-300 bg-slate-900/90 px-2 py-1 rounded border border-slate-800">
                      <div className="flex items-center space-x-1.5 truncate">
                        <Fingerprint className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                        <span className="font-mono text-[11px] text-teal-200 truncate">{pat.abhaId}</span>
                      </div>
                      {isExternal && activeGrant ? (
                        <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 shrink-0 ml-1">
                          ABDM Consent Active
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-400 font-medium shrink-0 ml-1">ABDM Linked</span>
                      )}
                    </div>

                    {/* Conditions */}
                    <div className="mt-2.5 flex flex-wrap gap-1">
                      {pat.chronicConditions.slice(0, 2).map((c, i) => (
                        <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60">
                          {c}
                        </span>
                      ))}
                      {pat.chronicConditions.length > 2 && (
                        <span className="text-[10px] px-1 py-0.5 text-slate-500">
                          +{pat.chronicConditions.length - 2} more
                        </span>
                      )}
                    </div>

                    {/* Footer Branch */}
                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="truncate max-w-[170px]">{pat.registeredBranchName}</span>
                      <span className="text-teal-400 font-semibold group-hover:underline flex items-center gap-0.5">
                        Open Chart <ArrowUpRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Cross-Hospital Directory (With Prompt 2 ABDM Consent request actions) */
        <div className="mt-4">
          <div className="p-3 bg-slate-950/80 border border-teal-800/50 rounded-xl mb-3 text-xs text-slate-300 flex items-start space-x-2">
            <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-teal-200">ABDM Cross-Hospital Data Sharing:</span> External records require an active patient consent grant. You can directly request access from a patient, or test the backend boundary enforcement.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {crossHospitalPatients.map((pat) => {
              const activeGrant = accessGrants.find(
                g => g.doctorId === currentStaff.id && g.patientId === pat.id && g.status === 'ACTIVE'
              );
              const pendingReq = accessRequests.find(
                r => r.doctorId === currentStaff.id && r.patientId === pat.id && r.status === 'PENDING'
              );
              const revokedGrant = accessGrants.find(
                g => g.doctorId === currentStaff.id && g.patientId === pat.id && g.status === 'REVOKED'
              );

              return (
                <div
                  key={pat.id}
                  className={`p-4 rounded-xl border transition-all ${
                    activeGrant
                      ? 'border-emerald-700/60 bg-emerald-950/20'
                      : pendingReq
                      ? 'border-amber-700/60 bg-amber-950/20'
                      : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-slate-200">
                          {pat.name}
                        </span>
                        <span className="text-xs text-slate-400">
                          {pat.age}y / {pat.gender === 'Male' ? 'M' : 'F'}
                        </span>
                      </div>
                      <div className="text-xs text-amber-300 font-medium mt-0.5">
                        {pat.hospitalName}
                      </div>
                    </div>

                    <div>
                      {activeGrant ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                          GRANTED
                        </span>
                      ) : pendingReq ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">
                          PENDING
                        </span>
                      ) : (
                        <span className="p-1 rounded-lg bg-rose-950 text-rose-400 border border-rose-800 inline-block">
                          <Lock className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center space-x-1.5 text-xs text-slate-400 bg-slate-900/90 px-2 py-1 rounded border border-slate-800 font-mono text-[11px]">
                    <span>MRN: {pat.mrn}</span>
                    <span className="text-slate-600">|</span>
                    <span className="truncate">{pat.registeredBranchName}</span>
                  </div>

                  {/* Actions according to consent state */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs">
                    {activeGrant ? (
                      <>
                        <span className="text-emerald-400 text-[11px] font-medium">Valid until {new Date(activeGrant.expiresAt).toLocaleDateString()}</span>
                        <button
                          onClick={() => onSelectPatient(pat.id)}
                          className="px-2.5 py-1 rounded-lg bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs flex items-center space-x-1"
                        >
                          <span>Open Chart</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      </>
                    ) : pendingReq ? (
                      <>
                        <button
                          onClick={onOpenConsentPortal}
                          className="text-[11px] text-amber-300 hover:underline flex items-center gap-1"
                        >
                          <span>Review in Patient Portal</span>
                        </button>
                        <button
                          onClick={() => onSelectPatient(pat.id)}
                          className="px-2 py-1 rounded bg-slate-800 text-slate-400 text-[11px]"
                        >
                          Check Status
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => onRequestAccess(pat)}
                          className="px-2.5 py-1 rounded-lg bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs"
                        >
                          Request Consent
                        </button>
                        <button
                          onClick={() => onSelectPatient(pat.id)}
                          className="px-2 py-1 rounded bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 text-[11px] font-medium"
                          title="Direct query triggers 403 Forbidden"
                        >
                          Test 403 Block
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
