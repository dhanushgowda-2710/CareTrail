import React, { useState } from 'react';
import { 
  X, 
  Send, 
  ShieldCheck, 
  Building2, 
  Lock, 
  Calendar, 
  FileText, 
  CheckSquare, 
  Square, 
  Clock,
  AlertCircle
} from 'lucide-react';
import { PatientProfile, StaffProfile, RecordType } from '../types/caretrail';

interface CreateAccessRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientProfile;
  staff: StaffProfile;
  onSubmitRequest: (options: {
    purpose: string;
    scope: string[];
    dateRange: string;
    expiryDays: number;
  }) => void;
}

export const CreateAccessRequestModal: React.FC<CreateAccessRequestModalProps> = ({
  isOpen,
  onClose,
  patient,
  staff,
  onSubmitRequest
}) => {
  const [purpose, setPurpose] = useState('Pre-consultation clinical history review & CKD stage monitoring');
  const [dateRange, setDateRange] = useState('Past 12 months');
  const [expiryDays, setExpiryDays] = useState(30);

  const [scopeConsultation, setScopeConsultation] = useState(true);
  const [scopeLabs, setScopeLabs] = useState(true);
  const [scopePrescription, setScopePrescription] = useState(true);
  const [scopeVitals, setScopeVitals] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedScope: string[] = [];
    if (scopeConsultation) selectedScope.push('CONSULTATION');
    if (scopeLabs) selectedScope.push('LAB_REPORT');
    if (scopePrescription) selectedScope.push('PRESCRIPTION');
    if (scopeVitals) selectedScope.push('VITALS');

    if (selectedScope.length === 0) {
      selectedScope.push('CONSULTATION');
    }

    onSubmitRequest({
      purpose,
      scope: selectedScope,
      dateRange,
      expiryDays
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-teal-600/70 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative">
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-teal-950 text-teal-300 border border-teal-800">
                POST /api/access-requests
              </span>
              <span className="text-xs text-emerald-400 font-semibold">ABDM Consent Architecture</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">
              Request Cross-Hospital Access
            </h3>
            <p className="text-xs text-slate-400">
              Submit a formal digital consent request to <strong className="text-slate-200">{patient.name}</strong> ({patient.hospitalName})
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          {/* Requester and Target Hospital Summary */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Requesting Clinician</div>
              <div className="font-bold text-white mt-0.5">{staff.name}</div>
              <div className="text-teal-400 text-[11px] font-medium">{staff.hospitalName}</div>
              <div className="text-slate-500 text-[10px]">{staff.department}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Patient & Origin Facility</div>
              <div className="font-bold text-white mt-0.5">{patient.name}</div>
              <div className="text-amber-400 text-[11px] font-medium">{patient.hospitalName}</div>
              <div className="text-slate-500 text-[10px] font-mono">ABHA: {patient.abhaId}</div>
            </div>
          </div>

          {/* Clinical Purpose */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Clinical Purpose of Data Request *
            </label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="Pre-consultation clinical history review & CKD stage monitoring">
                Pre-consultation clinical history review & CKD stage monitoring
              </option>
              <option value="Evaluation for second surgical / therapeutic opinion">
                Evaluation for second surgical / therapeutic opinion
              </option>
              <option value="Acute emergency evaluation & drug allergy safety check">
                Acute emergency evaluation & drug allergy safety check
              </option>
              <option value="Longitudinal chronic disease management & medication reconciliation">
                Longitudinal chronic disease management & medication reconciliation
              </option>
            </select>
          </div>

          {/* Requested Record Types / Scope */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              Requested Data Scope (Select categories needed)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setScopeConsultation(!scopeConsultation)}
                className={`p-2.5 rounded-lg border flex items-center space-x-2 text-left transition-colors ${
                  scopeConsultation ? 'bg-teal-950/60 border-teal-600 text-teal-200' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                {scopeConsultation ? <CheckSquare className="w-4 h-4 text-teal-400" /> : <Square className="w-4 h-4" />}
                <div>
                  <div className="font-semibold">Consultations & OPD</div>
                  <div className="text-[10px] text-slate-400">Doctor notes & diagnoses</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setScopeLabs(!scopeLabs)}
                className={`p-2.5 rounded-lg border flex items-center space-x-2 text-left transition-colors ${
                  scopeLabs ? 'bg-teal-950/60 border-teal-600 text-teal-200' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                {scopeLabs ? <CheckSquare className="w-4 h-4 text-teal-400" /> : <Square className="w-4 h-4" />}
                <div>
                  <div className="font-semibold">Lab Investigation Reports</div>
                  <div className="text-[10px] text-slate-400">Blood, urine & pathology</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setScopePrescription(!scopePrescription)}
                className={`p-2.5 rounded-lg border flex items-center space-x-2 text-left transition-colors ${
                  scopePrescription ? 'bg-teal-950/60 border-teal-600 text-teal-200' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                {scopePrescription ? <CheckSquare className="w-4 h-4 text-teal-400" /> : <Square className="w-4 h-4" />}
                <div>
                  <div className="font-semibold">Prescriptions & Drugs</div>
                  <div className="text-[10px] text-slate-400">Active dosages & regimens</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setScopeVitals(!scopeVitals)}
                className={`p-2.5 rounded-lg border flex items-center space-x-2 text-left transition-colors ${
                  scopeVitals ? 'bg-teal-950/60 border-teal-600 text-teal-200' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                {scopeVitals ? <CheckSquare className="w-4 h-4 text-teal-400" /> : <Square className="w-4 h-4" />}
                <div>
                  <div className="font-semibold">Vital Signs & Triage</div>
                  <div className="text-[10px] text-slate-400">BP, pulse, SpO2 history</div>
                </div>
              </button>
            </div>
          </div>

          {/* Requested Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Requested Grant Duration
              </label>
              <select
                value={expiryDays}
                onChange={(e) => setExpiryDays(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value={7}>7 Days (Acute episode review)</option>
                <option value={30}>30 Days (Standard care episode)</option>
                <option value={90}>90 Days (Chronic care monitoring)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Historical Date Range
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="Past 3 months">Past 3 months</option>
                <option value="Past 6 months">Past 6 months</option>
                <option value="Past 12 months">Past 12 months</option>
                <option value="All historical records">All historical records</option>
              </select>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-teal-950/40 border border-teal-800/50 text-[11px] text-teal-300 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <div>
              <strong>ABDM Consent Gatekeeper:</strong> Submitting this request does not grant automatic access. The patient will review this request in their personal consent dashboard and can Approve or Deny. Access can also be revoked by the patient at any time.
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg font-bold bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white shadow-md flex items-center space-x-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Consent Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
