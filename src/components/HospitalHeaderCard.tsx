import React from 'react';
import { Building2, MapPin, Phone, Award, Shield, Users, Database } from 'lucide-react';
import { StaffProfile, Organization } from '../types/caretrail';

interface HospitalHeaderCardProps {
  currentStaff: StaffProfile;
  organization?: Organization;
  patientCount: number;
}

export const HospitalHeaderCard: React.FC<HospitalHeaderCardProps> = ({
  currentStaff,
  organization,
  patientCount
}) => {
  const currentBranch = organization?.branches.find(b => b.id === currentStaff.branchId) || organization?.branches[0];

  return (
    <div className="bg-slate-850/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg relative overflow-hidden backdrop-blur-sm bg-slate-900/60">
      {/* Background Accent glow */}
      <div className="absolute top-0 right-0 w-80 h-32 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
        {/* Left: Organization & Branch Details */}
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-700 to-teal-900 border border-teal-500/30 flex items-center justify-center text-teal-200 shrink-0 shadow-inner">
            <Building2 className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl font-bold text-white tracking-tight">
                {currentStaff.hospitalName}
              </h1>
              <span className="px-2 py-0.5 text-xs font-mono font-medium rounded-md bg-teal-950 text-teal-300 border border-teal-700/60">
                Facility Code: {organization?.code || currentStaff.hospitalId}
              </span>
              <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-emerald-950 text-emerald-300 border border-emerald-700/60 flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-400" />
                Verified Institutional Authority
              </span>
            </div>

            <div className="mt-2 flex items-center flex-wrap gap-y-1 gap-x-4 text-xs text-slate-300">
              <div className="flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-400" />
                <span>{currentBranch?.name} — {currentBranch?.address || 'Bengaluru, Karnataka'}</span>
              </div>
              {currentBranch?.phone && (
                <div className="flex items-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{currentBranch.phone}</span>
                </div>
              )}
            </div>

            <div className="mt-2 text-xs text-slate-400 flex items-center gap-2">
              <span className="font-semibold text-slate-300">Logged-in Practitioner:</span>
              <span className="text-teal-300 font-medium">{currentStaff.name} ({currentStaff.designation})</span>
              <span>•</span>
              <span className="font-mono text-slate-400">Reg: {currentStaff.registrationNumber}</span>
            </div>
          </div>
        </div>

        {/* Right: Quick Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
          <div className="bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-center">
            <div className="flex items-center justify-center space-x-1 text-slate-400 text-[11px] font-medium mb-0.5">
              <Users className="w-3.5 h-3.5 text-teal-400" />
              <span>In-Network Patients</span>
            </div>
            <div className="text-lg font-bold text-white font-mono">{patientCount}</div>
            <div className="text-[10px] text-teal-400">Direct Care Access</div>
          </div>

          <div className="bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-center">
            <div className="flex items-center justify-center space-x-1 text-slate-400 text-[11px] font-medium mb-0.5">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Record Store</span>
            </div>
            <div className="text-sm font-bold text-slate-200 mt-1">Tier 2 EHR</div>
            <div className="text-[10px] text-slate-400">Local DB Read-Only</div>
          </div>

          <div className="bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-center col-span-2 sm:col-span-1">
            <div className="flex items-center justify-center space-x-1 text-slate-400 text-[11px] font-medium mb-0.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Consent Rule</span>
            </div>
            <div className="text-xs font-bold text-emerald-400 mt-1">Bypassed</div>
            <div className="text-[10px] text-slate-400">Internal Care Exemption</div>
          </div>
        </div>
      </div>
    </div>
  );
};
