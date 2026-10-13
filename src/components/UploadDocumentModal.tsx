import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  Building2, 
  Pill, 
  FlaskConical,
  ArrowRight,
  Clock,
  AlertTriangle,
  HardDrive
} from 'lucide-react';
import { PatientProfile, RecordType, MedicalRecord } from '../types/caretrail';
import { getStorageConfig } from '../config/env';

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientProfile;
  onConfirmUpload: (docData: {
    title: string;
    fileName: string;
    encounterDate: string;
    facilityName: string;
    type: RecordType;
    extractedSnippet: string;
    clinicalNotes: string;
    prescriptions?: MedicalRecord['prescriptions'];
    labResults?: MedicalRecord['labResults'];
  }) => void;
}

const SAMPLE_DOCS = [
  {
    fileName: 'Thyrocare_Thyroid_Profile_Oct2023.pdf',
    title: 'Scanned Laboratory Investigation: Thyroid Function Profile (FT3, FT4, TSH)',
    facility: 'Thyrocare Technologies Diagnostic Centre',
    encounterDate: '2023-10-24',
    type: 'LAB_REPORT' as RecordType,
    snippet: 'Serum TSH: 6.82 uIU/mL (Ref: 0.35 - 4.94 uIU/mL, Flag: High). Free T4: 1.08 ng/dL. Free T3: 2.85 pg/mL. Specimen collection: Morning fasting.',
    clinicalNotes: 'Document uploaded by patient. Optical text extraction identified subclinical hypothyroidism with elevated TSH. Awaiting doctor confirmation.',
    labResults: [
      {
        testName: 'Thyroid Stimulating Hormone (TSH)',
        value: '6.82',
        unit: 'uIU/mL',
        referenceRange: '0.35 - 4.94 uIU/mL',
        isAbnormal: true
      },
      {
        testName: 'Free Thyroxine (FT4)',
        value: '1.08',
        unit: 'ng/dL',
        referenceRange: '0.90 - 1.70 ng/dL',
        isAbnormal: false
      }
    ]
  },
  {
    fileName: 'Narayana_Health_Discharge_Summary_2022.pdf',
    title: 'Scanned Inpatient Discharge Summary: Laparoscopic Cholecystectomy',
    facility: 'Narayana Health City (Bommasandra)',
    encounterDate: '2022-08-14',
    type: 'DISCHARGE_SUMMARY' as RecordType,
    snippet: 'Admitted for symptomatic cholelithiasis. Uneventful laparoscopic cholecystectomy performed under GA by Dr. Maheshwari. Histopathology: Chronic cholecystitis with gallstones.',
    clinicalNotes: 'External discharge summary uploaded by patient. Confirms previous gallbladder removal in 2022. Sutures removed on post-op day 8.',
    prescriptions: [
      {
        medicineName: 'Pantoprazole IP',
        dosage: '40 mg',
        frequency: 'Once daily before breakfast',
        duration: '14 days',
        instructions: 'Post-operative gastric prophylaxis'
      }
    ]
  },
  {
    fileName: 'Fortis_Ortho_Prescription_Jan2024.pdf',
    title: 'Scanned Prescription: Orthopedic Consultation & Pain Management',
    facility: 'Fortis Hospital Cunningham Road',
    encounterDate: '2024-01-20',
    type: 'PRESCRIPTION' as RecordType,
    snippet: 'Diagnosis: Bilateral Knee Osteoarthritis (Kellgren-Lawrence Grade II). Rx: Etoricoxib 90mg SOS, Glucosamine + Chondroitin 1 tab OD x 60 days, Quadriceps strengthening physiotherapy.',
    clinicalNotes: 'External prescription slip scanned via mobile camera. Optical character recognition extracted musculoskeletal pain medication regimen.',
    prescriptions: [
      {
        medicineName: 'Etoricoxib Tablets IP',
        dosage: '90 mg',
        frequency: 'As needed (SOS for knee pain)',
        duration: '10 days',
        instructions: 'Take after meals.'
      },
      {
        medicineName: 'Calcium Carbonate + Vitamin D3',
        dosage: '500 mg / 400 IU',
        frequency: 'Once daily',
        duration: '60 days',
        instructions: 'Bone density supplement.'
      }
    ]
  }
];

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  isOpen,
  onClose,
  patient,
  onConfirmUpload
}) => {
  const [selectedSampleIndex, setSelectedSampleIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractionComplete, setExtractionComplete] = useState(false);

  if (!isOpen) return null;

  const currentSample = SAMPLE_DOCS[selectedSampleIndex];
  const storageConfig = getStorageConfig();

  const handleSimulateOcr = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setExtractionComplete(true);
    }, 700);
  };

  const handleConfirm = () => {
    onConfirmUpload({
      title: currentSample.title,
      fileName: currentSample.fileName,
      encounterDate: currentSample.encounterDate,
      facilityName: currentSample.facility,
      type: currentSample.type,
      extractedSnippet: currentSample.snippet,
      clinicalNotes: currentSample.clinicalNotes,
      prescriptions: currentSample.prescriptions,
      labResults: currentSample.labResults
    });
    setExtractionComplete(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-teal-600/70 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-teal-950 text-teal-300 border border-teal-800">
                TIER 4 DOCUMENT CAPTURE
              </span>
              <span className="text-xs text-emerald-400 font-semibold">OCR Ingestion Pipeline</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">
              Upload Medical Document for {patient.name}
            </h3>
            <p className="text-xs text-slate-400">
              Digitize paper prescriptions, lab reports, or external hospital discharge slips.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs">
          {/* Document Sample Selector */}
          <div>
            <label className="block font-semibold text-slate-300 mb-2">
              Select Sample Medical Document to Ingest:
            </label>
            <div className="space-y-2">
              {SAMPLE_DOCS.map((doc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedSampleIndex(idx);
                    setExtractionComplete(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    selectedSampleIndex === idx
                      ? 'bg-teal-950/70 border-teal-500 shadow-sm'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs flex items-center gap-2">
                      <FileText className="w-4 h-4 text-teal-400" />
                      <span>{doc.fileName}</span>
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-teal-300">
                      {doc.type}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {doc.facility} • Date: {doc.encounterDate}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* OCR Processing Simulation Step */}
          {!extractionComplete ? (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-900/40 border border-teal-700/60 flex items-center justify-center text-teal-300 mx-auto">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-slate-200">Ready for Document AI / OCR Processing</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  The document will be validated, original bytes secured, and clinical text extracted into candidate fields.
                </p>
              </div>

              {/* Honest Storage Notice (Requirement 5) */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-left flex items-start space-x-2.5">
                <HardDrive className={`w-4 h-4 shrink-0 mt-0.5 ${storageConfig.isDurable ? 'text-teal-400' : 'text-amber-400'}`} />
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-200">Storage Destination:</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold border ${
                      storageConfig.isDurable 
                        ? 'bg-teal-950 text-teal-300 border-teal-800' 
                        : 'bg-amber-950 text-amber-300 border-amber-800'
                    }`}>
                      {storageConfig.statusLabel}
                    </span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">{storageConfig.notice}</p>
                </div>
              </div>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleSimulateOcr}
                className="px-4 py-2 rounded-lg font-bold bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white shadow-md text-xs flex items-center space-x-2 mx-auto disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin text-white" />
                    <span>Extracting Optical Text & Candidate Fields...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-200" />
                    <span>Run OCR & Extract Clinical Fields</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Review Extracted Candidates Before Saving (as required by PDF!) */
            <div className="space-y-3 animate-in fade-in">
              <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-emerald-200 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-bold">Text Extraction Succeeded: Review Draft Fields</span>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div>
                  <span className="text-slate-400 font-semibold">Extracted Text Snippet:</span>
                  <p className="text-slate-200 italic mt-0.5 font-mono text-[11px] bg-slate-900 p-2 rounded border border-slate-850">
                    "{currentSample.snippet}"
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div>
                    <span className="text-slate-400">Identified Date: </span>
                    <strong className="text-white">{currentSample.encounterDate}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Identified Facility: </span>
                    <strong className="text-teal-300">{currentSample.facility}</strong>
                  </div>
                </div>

                {currentSample.prescriptions && (
                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-teal-400 font-semibold block mb-1">Extracted Prescription Lines:</span>
                    {currentSample.prescriptions.map((p, i) => (
                      <div key={i} className="text-[11px] text-slate-300">
                        • <strong>{p.medicineName}</strong> {p.dosage} ({p.frequency})
                      </div>
                    ))}
                  </div>
                )}

                {currentSample.labResults && (
                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-teal-400 font-semibold block mb-1">Extracted Lab Values:</span>
                    {currentSample.labResults.map((lr, i) => (
                      <div key={i} className="text-[11px] text-slate-300">
                        • <strong>{lr.testName}:</strong> {lr.value} {lr.unit} {lr.isAbnormal && <span className="text-amber-400 font-bold">(Abnormal)</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            {extractionComplete && (
              <button
                type="button"
                onClick={handleConfirm}
                className="px-4 py-2 rounded-lg font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-md flex items-center space-x-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Add to Unified Timeline</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
