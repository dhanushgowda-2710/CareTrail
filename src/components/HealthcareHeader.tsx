import React, { useState } from 'react';
import { 
  Activity, 
  User, 
  Stethoscope, 
  ChevronDown, 
  LogOut, 
  ShieldCheck, 
  Wifi, 
  WifiOff, 
  FileText, 
  SlidersHorizontal,
  Home
} from 'lucide-react';
import { StaffProfile, PatientProfile } from '../types/caretrail';

interface HealthcareHeaderProps {
  currentMode: 'landing' | 'patient' | 'clinician';
  onNavigateMode: (mode: 'landing' | 'patient' | 'clinician') => void;
  activePatient: PatientProfile;
  allPatients: PatientProfile[];
  onSelectPatient: (patientId: string) => void;
  activeStaff: StaffProfile;
  allStaff: StaffProfile[];
  onSelectStaff: (staffId: string) => void;
  isOffline?: boolean;
  onToggleOffline?: () => void;
  pendingOfflineCount?: number;
  onOpenDiagnostics: () => void;
  auditCount: number;
}

export const HealthcareHeader: React.FC<HealthcareHeaderProps> = ({
  currentMode,
  onNavigateMode,
  activePatient,
  allPatients,
  onSelectPatient,
  activeStaff,
  allStaff,
  onSelectStaff,
  isOffline = false,
  onToggleOffline,
  pendingOfflineCount = 0,
  onOpenDiagnostics,
  auditCount
}) => {
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Portal Tag */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => onNavigateMode('landing')}
              className="flex items-center space-x-2.5 text-left group focus:outline-hidden"
              title="Return to CareTrail Home"
            >
              <div className="w-9 h-9 rounded-lg bg-teal-700 flex items-center justify-center text-white shadow-xs group-hover:bg-teal-800 transition-colors">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-base tracking-tight text-slate-900 group-hover:text-teal-900 transition-colors">
                    CareTrail
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-md font-medium bg-slate-100 text-slate-700 border border-slate-200">
                    {currentMode === 'patient' ? 'Patient Portal' : currentMode === 'clinician' ? 'Clinician Portal' : 'Healthcare Records'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 hidden sm:block">
                  Unified Clinical Health Platform
                </div>
              </div>
            </button>
          </div>

          {/* Center Navigation Switcher */}
          <div className="hidden md:flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => onNavigateMode('patient')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                currentMode === 'patient'
                  ? 'bg-white text-teal-800 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5" />
                <span>Patient Portal</span>
              </span>
            </button>
            <button
              onClick={() => onNavigateMode('clinician')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                currentMode === 'clinician'
                  ? 'bg-white text-teal-800 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="flex items-center space-x-1.5">
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Clinician Portal</span>
              </span>
            </button>
          </div>

          {/* Right Controls: Persona Switcher & Options */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Network / Offline Status Indicator */}
            {onToggleOffline && (
              <button
                onClick={onToggleOffline}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  isOffline
                    ? 'bg-amber-50 border-amber-300 text-amber-800'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
                title={isOffline ? 'Offline mode active. Click to reconnect.' : 'Connected. Click to simulate network outage.'}
              >
                {isOffline ? <WifiOff className="w-3.5 h-3.5 text-amber-600" /> : <Wifi className="w-3.5 h-3.5 text-emerald-600" />}
                <span className="hidden sm:inline">{isOffline ? 'Offline Mode' : 'Online'}</span>
                {pendingOfflineCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold">
                    {pendingOfflineCount}
                  </span>
                )}
              </button>
            )}

            {/* Persona Switcher Dropdown */}
            {currentMode !== 'landing' && (
              <div className="relative">
                <button
                  onClick={() => setIsPersonaOpen(!isPersonaOpen)}
                  className="flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 transition-colors cursor-pointer text-left"
                >
                  <div className="w-7 h-7 rounded-full bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-800 font-semibold text-xs">
                    {currentMode === 'patient' 
                      ? activePatient.name.charAt(0) 
                      : <Stethoscope className="w-3.5 h-3.5 text-teal-800" />}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-semibold text-slate-900 leading-tight">
                      {currentMode === 'patient' ? activePatient.name : activeStaff.name}
                    </div>
                    <div className="text-[10px] text-slate-500 leading-tight">
                      {currentMode === 'patient' 
                        ? `MRN: ${activePatient.mrn}` 
                        : activeStaff.designation}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {isPersonaOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsPersonaOpen(false)} 
                    />
                    <div className="absolute right-0 mt-1.5 w-72 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50 text-left">
                      <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        {currentMode === 'patient' ? 'Switch Patient Profile' : 'Switch Clinician Profile'}
                      </div>

                      {currentMode === 'patient' ? (
                        <div className="max-h-64 overflow-y-auto py-1">
                          {allPatients.map(patient => (
                            <button
                              key={patient.id}
                              onClick={() => {
                                onSelectPatient(patient.id);
                                setIsPersonaOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                                patient.id === activePatient.id 
                                  ? 'bg-teal-50 text-teal-900 font-semibold border-l-2 border-teal-700' 
                                  : 'text-slate-700'
                              }`}
                            >
                              <div>
                                <div className="font-medium text-slate-900">{patient.name}</div>
                                <div className="text-[11px] text-slate-500">MRN: {patient.mrn} · {patient.age}y {patient.gender}</div>
                              </div>
                              {patient.id === activePatient.id && (
                                <ShieldCheck className="w-4 h-4 text-teal-700" />
                              )}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="max-h-64 overflow-y-auto py-1">
                          {allStaff.map(staff => (
                            <button
                              key={staff.id}
                              onClick={() => {
                                onSelectStaff(staff.id);
                                setIsPersonaOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 transition-colors ${
                                staff.id === activeStaff.id 
                                  ? 'bg-teal-50 text-teal-900 font-semibold border-l-2 border-teal-700' 
                                  : 'text-slate-700'
                              }`}
                            >
                              <div className="font-medium text-slate-900">{staff.name}</div>
                              <div className="text-[11px] text-slate-500">{staff.designation} · {staff.department}</div>
                              <div className="text-[10px] text-teal-700">{staff.hospitalName}</div>
                            </button>
                          ))}
                        </div>
                      )}

                      <div className="border-t border-slate-100 mt-1 pt-1 px-2">
                        <button
                          onClick={() => {
                            setIsPersonaOpen(false);
                            onNavigateMode('landing');
                          }}
                          className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-md text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                        >
                          <Home className="w-3.5 h-3.5" />
                          <span>Return to Welcome Screen</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Quiet Developer Diagnostics Trigger */}
            <button
              onClick={onOpenDiagnostics}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
              title="System Diagnostics & Integrity Verification"
              aria-label="Developer Diagnostics"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
