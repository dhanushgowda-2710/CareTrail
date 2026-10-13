import React, { useState } from 'react';
import { 
  X, 
  UserCheck, 
  Calendar, 
  Building2, 
  AlertTriangle, 
  Save, 
  HelpCircle,
  FileQuestion
} from 'lucide-react';
import { PatientProfile, RecordType } from '../types/caretrail';

interface AddPatientReportedModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientProfile;
  onSaveReportedEvent: (eventData: {
    title: string;
    encounterDate: string;
    facilityName?: string;
    clinicalNotes: string;
    type?: RecordType;
  }) => void;
}

export const AddPatientReportedModal: React.FC<AddPatientReportedModalProps> = ({
  isOpen,
  onClose,
  patient,
  onSaveReportedEvent
}) => {
  const [title, setTitle] = useState('');
  const [encounterDate, setEncounterDate] = useState('2019-07-15');
  const [facilityName, setFacilityName] = useState('');
  const [type, setType] = useState<RecordType>('CONSULTATION');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [isApproximate, setIsApproximate] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !clinicalNotes.trim()) return;

    onSaveReportedEvent({
      title: title.trim(),
      encounterDate,
      facilityName: facilityName.trim() || undefined,
      clinicalNotes: `${clinicalNotes.trim()}${isApproximate ? ' (Date is approximate per patient recollection).' : ''}`,
      type
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-teal-700/60 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative">
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">
                TIER 4 PATIENT RECALL
              </span>
              <span className="text-xs text-slate-400">Longitudinal History Capture</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">
              Add Patient-Reported Medical History
            </h3>
            <p className="text-xs text-slate-400">
              Record remembered illness, surgery, or treatment for <strong className="text-slate-200">{patient.name}</strong>
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
          {/* Integrity Notice from PDF */}
          <div className="p-3 bg-amber-950/30 border border-amber-900/60 rounded-xl text-amber-200 text-[11px] flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-100">Clinical Integrity Notice:</strong> Self-narrated events are saved with the permanent provenance tag <strong className="text-white">[Patient-Reported • Awaiting Review]</strong>. They provide valuable diagnostic context without being misrepresented as doctor-verified records.
            </div>
          </div>

          {/* Title / Description */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Event Title / Condition Remembered *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Typhoid hospitalization in 2018 or Childhood Appendectomy"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* Date & Approximate checkbox */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Event Date / Year *
              </label>
              <input
                type="date"
                required
                value={encounterDate}
                onChange={(e) => setEncounterDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div className="flex flex-col justify-end pb-2">
              <label className="flex items-center space-x-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={isApproximate}
                  onChange={(e) => setIsApproximate(e.target.checked)}
                  className="rounded border-slate-700 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-[11px]">Date is Approximate / Estimated</span>
              </label>
            </div>
          </div>

          {/* Recalled Facility */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Remembered Hospital / Clinic Name (Optional)
            </label>
            <input
              type="text"
              value={facilityName}
              onChange={(e) => setFacilityName(e.target.value)}
              placeholder="e.g. St. Martha's Hospital, Mysore Mission Hospital"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* Details / Treatment */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Recollection Details, Symptoms, or Remembered Treatment *
            </label>
            <textarea
              required
              rows={3}
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              placeholder="Describe symptoms, duration of stay, known medications given, or surgical details..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* Footer Actions */}
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
              className="px-4 py-2 rounded-lg font-bold bg-gradient-to-r from-amber-600 to-teal-600 hover:from-amber-500 hover:to-teal-500 text-white shadow-md flex items-center space-x-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Patient History Entry</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
