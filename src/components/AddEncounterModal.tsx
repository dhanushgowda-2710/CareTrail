import React, { useState } from 'react';
import { 
  X, 
  Stethoscope, 
  Pill, 
  Check, 
  Clock, 
  Building2, 
  User, 
  Calendar 
} from 'lucide-react';
import { PatientProfile, StaffProfile, MedicalRecord, RecordType } from '../types/caretrail';

interface AddEncounterModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientProfile;
  staff: StaffProfile;
  onAddEncounter: (encounterData: {
    type: RecordType;
    title: string;
    clinicalNotes: string;
    diagnosis?: string;
    vitals?: MedicalRecord['vitals'];
    prescriptions?: MedicalRecord['prescriptions'];
  }) => void;
}

export const AddEncounterModal: React.FC<AddEncounterModalProps> = ({
  isOpen,
  onClose,
  patient,
  staff,
  onAddEncounter
}) => {
  // Simple, clean consultation fields:
  // 1. Diagnosis / Chief Complaint
  // 2. Clinical Notes & Advice
  // 3. Medicine & Timing
  // 4. Follow-up Time
  const [diagnosis, setDiagnosis] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  
  // Medicine & Timing
  const [medicineName, setMedicineName] = useState('');
  const [dosageAndTiming, setDosageAndTiming] = useState('');
  const [followUpTime, setFollowUpTime] = useState('Follow up in 2 weeks');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clinicalNotes.trim()) return;

    const title = diagnosis.trim() 
      ? `Outpatient Consultation: ${diagnosis.trim()}`
      : `General Medical Consultation`;

    const prescriptions = medicineName.trim() ? [{
      medicineName: medicineName.trim(),
      dosage: dosageAndTiming.trim() || 'Standard Dose',
      frequency: dosageAndTiming.trim() || 'As directed',
      duration: followUpTime || '14 days',
      instructions: `Prescribed by ${staff.name}. ${followUpTime ? `Plan: ${followUpTime}` : ''}`
    }] : undefined;

    const fullNotes = followUpTime 
      ? `${clinicalNotes.trim()}\n\n[Follow-up Plan & Timing]: ${followUpTime}` 
      : clinicalNotes.trim();

    onAddEncounter({
      type: 'CONSULTATION',
      title,
      diagnosis: diagnosis.trim() || 'General Consultation Evaluation',
      clinicalNotes: fullNotes,
      prescriptions
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                New Consultation Record
              </h3>
              <p className="text-xs text-slate-500">
                Patient: <span className="font-semibold text-slate-700">{patient.name}</span> ({patient.mrn})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Doctor Attribution Info */}
        <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>Consultant: <strong>{staff.name}</strong></span>
          </div>
          <div className="flex items-center space-x-1.5 text-slate-500">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span>{staff.hospitalName}</span>
          </div>
        </div>

        {/* Streamlined Form (2-3 clean fields: diagnosis, notes, medicine & timing) */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* 1. Diagnosis / Chief Complaint */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Diagnosis / Chief Complaint
            </label>
            <input
              type="text"
              required
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="e.g. Type 2 Diabetes Routine Review, Acute Viral Pharyngitis"
              className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent text-slate-900 placeholder-slate-400"
            />
          </div>

          {/* 2. Clinical Notes & Advice */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Clinical Notes & Clinical Advice
            </label>
            <textarea
              required
              rows={4}
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              placeholder="Record symptoms, clinical examination findings, and advice given to the patient..."
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent text-slate-900 placeholder-slate-400 resize-none leading-relaxed"
            />
          </div>

          {/* 3. Prescribed Medicine & Timing */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-800">
              <Pill className="w-3.5 h-3.5 text-teal-700" />
              <span>Prescribed Medicine & Timing (Optional)</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={medicineName}
                onChange={(e) => setMedicineName(e.target.value)}
                placeholder="Medicine Name (e.g. Metformin 500mg)"
                className="text-xs px-2.5 py-2 rounded-lg bg-white border border-slate-300 focus:ring-2 focus:ring-teal-700 text-slate-900 placeholder-slate-400"
              />
              <input
                type="text"
                value={dosageAndTiming}
                onChange={(e) => setDosageAndTiming(e.target.value)}
                placeholder="Timing (e.g. 1-0-1 after food for 5 days)"
                className="text-xs px-2.5 py-2 rounded-lg bg-white border border-slate-300 focus:ring-2 focus:ring-teal-700 text-slate-900 placeholder-slate-400"
              />
            </div>
          </div>

          {/* 4. Follow-up Time */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1 flex items-center space-x-1">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>Follow-up Time & Plan</span>
            </label>
            <input
              type="text"
              value={followUpTime}
              onChange={(e) => setFollowUpTime(e.target.value)}
              placeholder="e.g. Review after 2 weeks with fasting blood sugar"
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900 placeholder-slate-400"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!clinicalNotes.trim()}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-medium transition-colors disabled:opacity-50 shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Consultation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
