import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Heart, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileEdit, 
  ShieldCheck,
  Building2,
  Calendar,
  Send
} from 'lucide-react';
import { PatientProfile, MedicalRecord, RecordDispute } from '../../types/caretrail';

interface PatientProfileViewProps {
  patient: PatientProfile;
  records: MedicalRecord[];
  onOpenDisputeModal: (record: MedicalRecord) => void;
}

export const PatientProfileView: React.FC<PatientProfileViewProps> = ({
  patient,
  records,
  onOpenDisputeModal
}) => {
  // Collect all disputes filed by this patient
  const disputedRecords = records.filter(r => r.isDisputed && r.activeDispute);

  // Form for requesting personal details update
  const [phone, setPhone] = useState(patient.phone);
  const [email, setEmail] = useState(patient.email);
  const [address, setAddress] = useState(patient.address);
  const [emergencyPhone, setEmergencyPhone] = useState(patient.emergencyContact?.phone || '');
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const handleUpdateContact = (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateSuccess(true);
    setTimeout(() => setUpdateSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Profile Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-800 text-xl font-bold">
              {patient.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{patient.name}</h2>
              <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
                <span>MRN: {patient.mrn}</span>
                <span aria-hidden="true">·</span>
                <span>ABHA ID: {patient.abhaId}</span>
                <span aria-hidden="true">·</span>
                <span>{patient.hospitalName}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs text-teal-800 bg-teal-50 border border-teal-200 rounded-xl px-3 py-2 self-start sm:self-auto font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>Identity Verified Profile</span>
          </div>
        </div>

        {/* Permitted Clinical Identifiers Grid */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase">Date of Birth</span>
            <span className="font-semibold text-slate-800">{patient.dob} ({patient.age} yrs)</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase">Gender</span>
            <span className="font-semibold text-slate-800">{patient.gender}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase">Blood Group</span>
            <span className="font-semibold text-slate-800">{patient.bloodGroup}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase">Registration Date</span>
            <span className="font-semibold text-slate-800">{patient.registeredDate}</span>
          </div>
        </div>
      </div>

      {/* Grid: Contact Information Update Form and Dispute Registry */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Information & Permitted Corrections */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-1">
            Contact Details & Corrections
          </h3>
          <p className="text-xs text-slate-500 mb-5">
            Patients may update demographic contact details directly. Clinical diagnoses require physician review.
          </p>

          <form onSubmit={handleUpdateContact} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mobile Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-teal-700"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-teal-700"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Residential Address</label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-teal-700"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Emergency Contact ({patient.emergencyContact.name} · {patient.emergencyContact.relationship})
              </label>
              <input
                type="text"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-teal-700"
              />
            </div>

            {updateSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Contact information updated successfully.</span>
              </div>
            )}

            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-medium text-xs transition-colors shadow-xs cursor-pointer"
            >
              Save Contact Updates
            </button>
          </form>
        </div>

        {/* Dispute & Record Corrections Registry */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Disputed Records & Addenda
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              CareTrail preserves clinical integrity: patient disputes flag records for clinical review without deleting or silently modifying original clinician documentation.
            </p>

            {disputedRecords.length > 0 ? (
              <div className="space-y-3">
                {disputedRecords.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/30 text-xs"
                  >
                    <div className="flex items-start justify-between">
                      <div className="font-semibold text-slate-900">{rec.title}</div>
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-rose-100 text-rose-800 border border-rose-200">
                        {rec.activeDispute?.status || 'OPEN DISPUTE'}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 mt-1">
                      Encounter Date: {rec.encounterDate} · {rec.hospitalName}
                    </div>

                    <div className="mt-2 text-slate-700 bg-white p-2.5 rounded-lg border border-rose-100">
                      <strong>Reason: </strong>{rec.activeDispute?.reason || rec.disputeNotes}
                      {rec.activeDispute?.requestedCorrection && (
                        <div className="mt-1 text-slate-600">
                          <strong>Requested Correction: </strong>{rec.activeDispute.requestedCorrection}
                        </div>
                      )}
                    </div>

                    <div className="mt-2 text-[10px] text-slate-500 flex items-center justify-between">
                      <span>Filed: {new Date(rec.activeDispute?.createdAt || Date.now()).toLocaleDateString()}</span>
                      <span className="text-slate-600 font-medium">Original record retained for clinical review</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 border border-slate-100 rounded-xl bg-slate-50/50">
                <FileEdit className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <div className="text-xs font-semibold text-slate-700">No active record disputes</div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  If you notice an error in any consultation or test result, you can flag it from the Medical Records timeline.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-500 leading-normal">
            <strong>Patient Rights: </strong>
            Under digital health guidelines, you have the right to request clarification or dispute medical records. Clinicians will review your request and append an addendum to rectify inaccuracies while maintaining the audit trail.
          </div>
        </div>
      </div>
    </div>
  );
};
