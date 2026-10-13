import React, { useState } from 'react';
import { 
  User, 
  Stethoscope, 
  ShieldCheck, 
  FileText, 
  Lock, 
  ArrowRight, 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  UserPlus, 
  LogIn, 
  FlaskConical, 
  HeartHandshake, 
  Sparkles,
  Check
} from 'lucide-react';
import { PatientProfile, StaffProfile } from '../types/caretrail';
import { intraHospitalStore } from '../services/intraHospitalService';

interface LandingPageProps {
  onSelectPatientMode: (patientId?: string) => void;
  onSelectClinicianMode: (staffId?: string) => void;
  patients: PatientProfile[];
  staffMembers: StaffProfile[];
  onOpenDiagnostics: () => void;
  onPatientRegistered?: (newPatient: PatientProfile) => void;
  onStaffRegistered?: (newStaff: StaffProfile) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSelectPatientMode,
  onSelectClinicianMode,
  patients,
  staffMembers,
  onOpenDiagnostics,
  onPatientRegistered,
  onStaffRegistered
}) => {
  // Active Persona Tab on Landing Page: 'patient' | 'clinician'
  const [activeTab, setActiveTab] = useState<'patient' | 'clinician'>('patient');

  // Patient Sub-view: 'login' | 'register'
  const [patientView, setPatientView] = useState<'login' | 'register'>('login');
  // Patient Login Form state
  const [patientInputId, setPatientInputId] = useState('');
  const [patientInputPassword, setPatientInputPassword] = useState('');
  const [patientLoginError, setPatientLoginError] = useState<string | null>(null);

  // Patient Register Form state
  const [regName, setRegName] = useState('');
  const [regAge, setRegAge] = useState('');
  const [regGender, setRegGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regAbha, setRegAbha] = useState('');
  const [regBlood, setRegBlood] = useState('B+');
  const [regHospital, setRegHospital] = useState('hosp-apollo');
  const [regPassword, setRegPassword] = useState('');
  const [patientRegSuccess, setPatientRegSuccess] = useState<{ id: string; pass: string; name: string; patient: PatientProfile } | null>(null);

  // Clinician Sub-view: 'login' | 'register'
  const [clinicianView, setClinicianView] = useState<'login' | 'register'>('login');
  // Clinician Login Form state
  const [staffInputId, setStaffInputId] = useState('');
  const [staffInputPassword, setStaffInputPassword] = useState('');
  const [staffLoginError, setStaffLoginError] = useState<string | null>(null);

  // Clinician Register Form state (3 roles: doctor, lab_technician, nurse)
  const [staffRegName, setStaffRegName] = useState('');
  const [staffRegRole, setStaffRegRole] = useState<'doctor' | 'lab_technician' | 'nurse'>('doctor');
  const [staffRegDepartment, setStaffRegDepartment] = useState('Internal Medicine & OPD');
  const [staffRegHospital, setStaffRegHospital] = useState('hosp-apollo');
  const [staffRegRegNum, setStaffRegRegNum] = useState('');
  const [staffRegPassword, setStaffRegPassword] = useState('');
  const [staffRegSuccess, setStaffRegSuccess] = useState<{ id: string; pass: string; name: string; staff: StaffProfile } | null>(null);

  // 1. Handle Patient Login
  const handlePatientLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPatientLoginError(null);

    const res = intraHospitalStore.loginPatient(patientInputId, patientInputPassword);
    if (res.success && res.patient) {
      onSelectPatientMode(res.patient.id);
    } else {
      setPatientLoginError(res.message);
    }
  };

  // 2. Handle Patient Registration
  const handlePatientRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim()) return;

    const res = intraHospitalStore.registerPatient({
      name: regName.trim(),
      age: Number(regAge) || 30,
      gender: regGender,
      phone: regPhone.trim(),
      email: regEmail.trim() || undefined,
      abhaId: regAbha.trim() || undefined,
      bloodGroup: regBlood,
      hospitalId: regHospital,
      password: regPassword.trim() || 'patient123'
    });

    if (res.success) {
      setPatientRegSuccess({
        id: res.generatedId,
        pass: res.tempPass,
        name: res.patient.name,
        patient: res.patient
      });
      if (onPatientRegistered) onPatientRegistered(res.patient);
    }
  };

  // 3. Handle Clinician Login (No need to select role)
  const handleClinicianLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStaffLoginError(null);

    const res = intraHospitalStore.loginStaff(staffInputId, staffInputPassword);
    if (res.success && res.staff) {
      onSelectClinicianMode(res.staff.id);
    } else {
      setStaffLoginError(res.message);
    }
  };

  // 4. Handle Clinician Registration
  const handleClinicianRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffRegName.trim() || !staffRegDepartment.trim()) return;

    const res = intraHospitalStore.registerStaff({
      name: staffRegName.trim(),
      role: staffRegRole,
      department: staffRegDepartment.trim(),
      hospitalId: staffRegHospital,
      registrationNumber: staffRegRegNum.trim() || undefined,
      password: staffRegPassword.trim() || (staffRegRole === 'lab_technician' ? 'lab123' : staffRegRole === 'nurse' ? 'nurse123' : 'doctor123')
    });

    if (res.success) {
      setStaffRegSuccess({
        id: res.generatedId,
        pass: res.tempPass,
        name: res.staff.name,
        staff: res.staff
      });
      if (onStaffRegistered) onStaffRegistered(res.staff);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex flex-col justify-between">
      {/* Hero & Authentication Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        <div className="text-center max-w-3xl mx-auto">
          {/* Subtle Demonstration Banner */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-medium mb-5">
            <span className="w-2 h-2 rounded-full bg-teal-600 inline-block" />
            <span>CareTrail Unified Healthcare Records · Patient & Clinician Platform</span>
          </div>

          {/* Exact Required Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
            Your health records, organized in one place.
          </h1>

          {/* Exact Required Supporting Description */}
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            View your medical history, prescriptions, test results, and shared healthcare records with clear source information and privacy controls.
          </p>
        </div>

        {/* Portal Switcher Tabs */}
        <div className="mt-10 max-w-2xl mx-auto">
          <div className="flex rounded-2xl bg-white border border-slate-200 p-1.5 shadow-xs">
            <button
              onClick={() => {
                setActiveTab('patient');
                setPatientLoginError(null);
              }}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center space-x-2 ${
                activeTab === 'patient'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Patient Portal</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('clinician');
                setStaffLoginError(null);
              }}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center space-x-2 ${
                activeTab === 'clinician'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span>Clinician Portal</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Patient Portal Interactive Box */}
        {activeTab === 'patient' && (
          <div className="mt-6 max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between pb-5 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Patient Portal Access</h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Access your health records, view AI-summarized test reports, and manage privacy consent.
                </p>
              </div>

              {/* Sub-view toggle: Login vs Register */}
              <div className="flex items-center space-x-1 p-1 bg-slate-100 rounded-xl text-xs font-medium">
                <button
                  onClick={() => {
                    setPatientView('login');
                    setPatientLoginError(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    patientView === 'login' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setPatientView('register');
                    setPatientLoginError(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    patientView === 'register' ? 'bg-white text-teal-800 font-semibold shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Register New
                </button>
              </div>
            </div>

            {/* Sub-view: Patient Sign In */}
            {patientView === 'login' && (
              <div className="mt-6 space-y-6">
                <form onSubmit={handlePatientLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Patient ID / Medical Record Number (MRN) or Mobile
                    </label>
                    <input
                      type="text"
                      required
                      value={patientInputId}
                      onChange={(e) => setPatientInputId(e.target.value)}
                      placeholder="e.g. AP-2024-8841 or pat-rajesh-kumar or 9845012345"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={patientInputPassword}
                      onChange={(e) => setPatientInputPassword(e.target.value)}
                      placeholder="Enter your patient portal password"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900"
                    />
                  </div>

                  {patientLoginError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{patientLoginError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-medium text-sm transition-colors shadow-xs"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Log In to Patient Portal</span>
                  </button>
                </form>

                {/* Quick-Select Curated Patient Profiles */}
                <div className="pt-5 border-t border-slate-100">
                  <div className="text-xs font-semibold text-slate-800 mb-2.5">
                    Or explore with 1-click sample patient profiles:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {/* 1. Rajesh Kumar */}
                    <button
                      type="button"
                      onClick={() => onSelectPatientMode('pat-rajesh-kumar')}
                      className="p-3 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/40 text-left transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-semibold text-slate-900 group-hover:text-teal-900">Rajesh Kumar</div>
                        <div className="text-[11px] text-slate-500">Full Records (Diabetes, BP, Labs, Rx)</div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-700" />
                    </button>

                    {/* 2. Meera Sundaram */}
                    <button
                      type="button"
                      onClick={() => onSelectPatientMode('pat-meera-sundaram')}
                      className="p-3 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/40 text-left transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-semibold text-slate-900 group-hover:text-teal-900">Meera Sundaram</div>
                        <div className="text-[11px] text-slate-500">Moderate Records (Asthma, Allergy)</div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-700" />
                    </button>

                    {/* 3. Amit Patel */}
                    <button
                      type="button"
                      onClick={() => onSelectPatientMode('pat-amit-patel')}
                      className="p-3 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/40 text-left transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-semibold text-slate-900 group-hover:text-teal-900">Amit Patel</div>
                        <div className="text-[11px] text-slate-500">Minimal Records (1 Viral Fever OPD)</div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-700" />
                    </button>

                    {/* 4. Kavita Joshi */}
                    <button
                      type="button"
                      onClick={() => onSelectPatientMode('pat-kavita-joshi')}
                      className="p-3 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/40 text-left transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-semibold text-slate-900 group-hover:text-teal-900">Kavita Joshi</div>
                        <div className="text-[11px] text-slate-500">Fresh Blank Profile (0 records)</div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-700" />
                    </button>

                    {/* 5. Sunita Devi */}
                    <button
                      type="button"
                      onClick={() => onSelectPatientMode('pat-sunita-devi')}
                      className="p-3 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/40 text-left transition-colors flex items-center justify-between group sm:col-span-2"
                    >
                      <div>
                        <div className="font-semibold text-slate-900 group-hover:text-teal-900">Sunita Devi (Elder Patient)</div>
                        <div className="text-[11px] text-slate-500">Ayushman Bharat ABHA Card · Cross-Hospital Cardiac & Hypertension</div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-700" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-view: Patient Registration */}
            {patientView === 'register' && (
              <form onSubmit={handlePatientRegisterSubmit} className="mt-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Ramesh Chandra"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Age & Gender *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        required
                        value={regAge}
                        onChange={(e) => setRegAge(e.target.value)}
                        placeholder="Age"
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900"
                      />
                      <select
                        value={regGender}
                        onChange={(e: any) => setRegGender(e.target.value)}
                        className="w-full text-xs px-2 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900 bg-white"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+91 98450 00000"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="patient@example.com"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Ayushman Card / ABHA ID (Optional)
                    </label>
                    <input
                      type="text"
                      value={regAbha}
                      onChange={(e) => setRegAbha(e.target.value)}
                      placeholder="e.g. 91-4821-3948-2019"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Hospital Facility & Branch
                    </label>
                    <select
                      value={regHospital}
                      onChange={(e) => setRegHospital(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900 bg-white"
                    >
                      <option value="hosp-apollo">Apollo Multi-Specialty Hospital</option>
                      <option value="hosp-city">City Care General Hospital</option>
                      <option value="hosp-fortis">Fortis Healthcare Institute</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Create your portal password"
                    className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-medium text-sm transition-colors shadow-xs"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register Patient & Generate ID</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* Tab 2: Clinician Portal Interactive Box */}
        {activeTab === 'clinician' && (
          <div className="mt-6 max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between pb-5 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Clinician & Staff Portal</h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Sign in with your Staff ID and password. Role is determined automatically.
                </p>
              </div>

              {/* Sub-view toggle: Login vs Register */}
              <div className="flex items-center space-x-1 p-1 bg-slate-100 rounded-xl text-xs font-medium">
                <button
                  onClick={() => {
                    setClinicianView('login');
                    setStaffLoginError(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    clinicianView === 'login' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setClinicianView('register');
                    setStaffLoginError(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    clinicianView === 'register' ? 'bg-white text-teal-800 font-semibold shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Register Staff
                </button>
              </div>
            </div>

            {/* Clinician Sign In */}
            {clinicianView === 'login' && (
              <div className="mt-6 space-y-6">
                <form onSubmit={handleClinicianLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Staff ID or Registration / License Number
                    </label>
                    <input
                      type="text"
                      required
                      value={staffInputId}
                      onChange={(e) => setStaffInputId(e.target.value)}
                      placeholder="e.g. staff-anand or staff-ramesh-lab or KMC-54918-2008"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={staffInputPassword}
                      onChange={(e) => setStaffInputPassword(e.target.value)}
                      placeholder="Enter your clinician password"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900"
                    />
                  </div>

                  {staffLoginError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{staffLoginError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-medium text-sm transition-colors shadow-xs"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Log In to Clinician Portal</span>
                  </button>
                </form>

                {/* 1-Click Demo Clinicians */}
                <div className="pt-5 border-t border-slate-100">
                  <div className="text-xs font-semibold text-slate-800 mb-2.5">
                    Or select a verified clinical staff persona:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {/* Dr. Anand Sharma (Doctor) */}
                    <button
                      type="button"
                      onClick={() => onSelectClinicianMode('staff-anand')}
                      className="p-3 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/40 text-left transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-semibold text-slate-900 group-hover:text-teal-900 flex items-center space-x-1.5">
                          <Stethoscope className="w-3.5 h-3.5 text-teal-700" />
                          <span>Dr. Anand Sharma</span>
                        </div>
                        <div className="text-[11px] text-slate-500">Doctor · General & Internal Medicine</div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-700" />
                    </button>

                    {/* Ramesh Varma (Lab Technician) */}
                    <button
                      type="button"
                      onClick={() => onSelectClinicianMode('staff-ramesh-lab')}
                      className="p-3 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/40 text-left transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-semibold text-slate-900 group-hover:text-teal-900 flex items-center space-x-1.5">
                          <FlaskConical className="w-3.5 h-3.5 text-teal-700" />
                          <span>Ramesh Varma</span>
                        </div>
                        <div className="text-[11px] text-slate-500">Lab Technician · Diagnostic Pathology</div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-700" />
                    </button>

                    {/* Nurse Rekha Gowda */}
                    <button
                      type="button"
                      onClick={() => onSelectClinicianMode('staff-rekha')}
                      className="p-3 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/40 text-left transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-semibold text-slate-900 group-hover:text-teal-900 flex items-center space-x-1.5">
                          <HeartHandshake className="w-3.5 h-3.5 text-teal-700" />
                          <span>Nurse Rekha Gowda</span>
                        </div>
                        <div className="text-[11px] text-slate-500">Nurse · Triage & Emergency</div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-700" />
                    </button>

                    {/* Dr. Vikram Rao */}
                    <button
                      type="button"
                      onClick={() => onSelectClinicianMode('staff-vikram')}
                      className="p-3 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/40 text-left transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-semibold text-slate-900 group-hover:text-teal-900 flex items-center space-x-1.5">
                          <Stethoscope className="w-3.5 h-3.5 text-teal-700" />
                          <span>Dr. Vikram Rao</span>
                        </div>
                        <div className="text-[11px] text-slate-500">Doctor · Chief Medical Officer (City Care)</div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-700" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Clinician Registration (3 roles: Doctor, Lab Technician, Nurse) */}
            {clinicianView === 'register' && (
              <form onSubmit={handleClinicianRegisterSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Healthcare Role *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setStaffRegRole('doctor')}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-colors flex flex-col items-center space-y-1 ${
                        staffRegRole === 'doctor'
                          ? 'border-teal-700 bg-teal-50 text-teal-900'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Stethoscope className="w-4 h-4 text-teal-700" />
                      <span>Doctor</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStaffRegRole('lab_technician')}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-colors flex flex-col items-center space-y-1 ${
                        staffRegRole === 'lab_technician'
                          ? 'border-teal-700 bg-teal-50 text-teal-900'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <FlaskConical className="w-4 h-4 text-teal-700" />
                      <span>Lab Tech</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStaffRegRole('nurse')}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-colors flex flex-col items-center space-y-1 ${
                        staffRegRole === 'nurse'
                          ? 'border-teal-700 bg-teal-50 text-teal-900'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <HeartHandshake className="w-4 h-4 text-teal-700" />
                      <span>Nurse/Staff</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={staffRegName}
                      onChange={(e) => setStaffRegName(e.target.value)}
                      placeholder="e.g. Dr. Rajeshwari Rao"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Department / Specialization *
                    </label>
                    <input
                      type="text"
                      required
                      value={staffRegDepartment}
                      onChange={(e) => setStaffRegDepartment(e.target.value)}
                      placeholder="e.g. Clinical Pathology, General Medicine"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Hospital Facility
                    </label>
                    <select
                      value={staffRegHospital}
                      onChange={(e) => setStaffRegHospital(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900 bg-white"
                    >
                      <option value="hosp-apollo">Apollo Multi-Specialty Hospital</option>
                      <option value="hosp-city">City Care General Hospital</option>
                      <option value="hosp-fortis">Fortis Healthcare Institute</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Medical / License Reg. Number
                    </label>
                    <input
                      type="text"
                      value={staffRegRegNum}
                      onChange={(e) => setStaffRegRegNum(e.target.value)}
                      placeholder="e.g. KMC-77491-2018"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={staffRegPassword}
                    onChange={(e) => setStaffRegPassword(e.target.value)}
                    placeholder="Create your staff password"
                    className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-medium text-sm transition-colors shadow-xs"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register Staff Member & Generate ID</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* Patient Registration Confirmation Modal */}
        {patientRegSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl text-center">
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 mx-auto mb-3">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Patient Registration Successful</h3>
              <p className="text-xs text-slate-600 mt-1">
                Your patient account has been created in CareTrail. Save your credentials below to log in.
              </p>

              <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Patient ID / MRN</span>
                  <span className="font-mono font-bold text-teal-800 text-sm">{patientRegSuccess.id}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Registered Name</span>
                  <span className="font-semibold text-slate-800">{patientRegSuccess.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Your Password</span>
                  <span className="font-mono text-slate-700">{patientRegSuccess.pass}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onSelectPatientMode(patientRegSuccess.patient.id);
                  setPatientRegSuccess(null);
                }}
                className="mt-5 w-full inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-medium text-sm transition-colors shadow-xs cursor-pointer"
              >
                <span>Log In Directly as {patientRegSuccess.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Clinician Registration Confirmation Modal */}
        {staffRegSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl text-center">
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 mx-auto mb-3">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Clinician Registration Successful</h3>
              <p className="text-xs text-slate-600 mt-1">
                Your hospital staff account has been created. Use your generated Staff ID to log in.
              </p>

              <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Generated Staff ID</span>
                  <span className="font-mono font-bold text-teal-800 text-sm">{staffRegSuccess.id}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Staff Name & Role</span>
                  <span className="font-semibold text-slate-800">{staffRegSuccess.name} ({staffRegSuccess.staff.role})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Password</span>
                  <span className="font-mono text-slate-700">{staffRegSuccess.pass}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onSelectClinicianMode(staffRegSuccess.staff.id);
                  setStaffRegSuccess(null);
                }}
                className="mt-5 w-full inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-medium text-sm transition-colors shadow-xs cursor-pointer"
              >
                <span>Log In Directly as {staffRegSuccess.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Demonstration Architecture & Privacy Notice */}
        <div className="mt-12 max-w-2xl mx-auto bg-slate-100 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 flex items-start space-x-3">
          <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-slate-800">Demonstration Platform: </span>
            CareTrail demonstrates longitudinal patient record continuity, AI document extraction, and cross-hospital ABDM / FHIR exchange with immutable clinical audit logging.
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div>CareTrail Unified Healthcare Systems · Clinical Record Platform</div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenDiagnostics}
              className="hover:text-slate-800 transition-colors underline cursor-pointer"
            >
              Developer Diagnostics & Test Suite
            </button>
            <span>·</span>
            <span>Local Demonstration Mode</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
