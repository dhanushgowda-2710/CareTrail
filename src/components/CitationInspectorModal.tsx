import React from 'react';
import { 
  X, 
  ExternalLink, 
  ShieldCheck, 
  Layers, 
  Calendar, 
  Building2, 
  User, 
  FileText, 
  ArrowRight,
  BookmarkCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ClinicalCitation, MedicalRecord } from '../types/caretrail';

interface CitationInspectorModalProps {
  citation: ClinicalCitation | null;
  record?: MedicalRecord | null;
  onClose: () => void;
  onJumpToTimelineRecord?: (recordId: string) => void;
}

export const CitationInspectorModal: React.FC<CitationInspectorModalProps> = ({
  citation,
  record,
  onClose,
  onJumpToTimelineRecord
}) => {
  if (!citation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-teal-500/60 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center justify-center font-mono font-bold text-sm">
              {citation.label}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base text-white">Source Grounding Inspector</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-950 text-teal-300 border border-teal-800">
                  {citation.recordId}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Exact provenance and primary source verification for this clinical insight.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Provenance Badge Strip */}
        <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-slate-400">Provenance Category:</span>
            <span className={`px-2 py-0.5 rounded font-bold font-mono text-[11px] ${
              citation.sourceCategory === 'INSTITUTIONAL'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                : citation.sourceCategory === 'PATIENT_UPLOADED'
                ? 'bg-teal-950 text-teal-300 border border-teal-700'
                : citation.sourceCategory === 'PATIENT_REPORTED'
                ? 'bg-amber-950 text-amber-300 border border-amber-700'
                : 'bg-cyan-950 text-cyan-300 border border-cyan-700'
            }`}>
              {citation.sourceCategory}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-slate-400">Verification:</span>
            <span className={`px-2 py-0.5 rounded font-bold text-[11px] flex items-center gap-1 ${
              citation.verificationStatus === 'VERIFIED'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                : 'bg-amber-950 text-amber-300 border border-amber-800'
            }`}>
              {citation.verificationStatus === 'VERIFIED' ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              ) : (
                <AlertCircle className="w-3 h-3 text-amber-400" />
              )}
              {citation.verificationStatus}
            </span>
          </div>
        </div>

        {/* Record Metadata Card */}
        <div className="mt-4 space-y-3">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-teal-400">
              Primary Encounter Document
            </div>
            <h4 className="text-sm font-bold text-white">{citation.recordTitle}</h4>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
              <div className="flex items-center space-x-2">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{citation.hospitalName}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Encounter Date: <strong className="text-white">{citation.encounterDate}</strong></span>
              </div>
            </div>

            {record && (
              <div className="text-xs text-slate-400 flex items-center space-x-2 pt-1 border-t border-slate-800">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Author: <strong className="text-slate-200">{record.authorStaffName}</strong> ({record.authorRole})</span>
              </div>
            )}
          </div>

          {/* Quoted Grounded Evidence / Snippet */}
          <div className="p-4 rounded-xl bg-slate-950 border border-teal-900/60 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-teal-300 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <BookmarkCheck className="w-4 h-4 text-teal-400" />
                Quoted Source Excerpt Grounding AI Synthesis
              </span>
            </div>

            <blockquote className="text-xs text-slate-200 leading-relaxed italic bg-slate-900/90 p-3 rounded-lg border-l-3 border-teal-400">
              "{record?.clinicalNotes || citation.quoteSnippet || 'Verified clinical observation on record.'}"
            </blockquote>

            {record?.extractedSnippet && (
              <div className="mt-2 text-xs text-teal-200 bg-teal-950/60 p-2.5 rounded-lg border border-teal-800 font-mono">
                <strong className="text-teal-400 font-sans block mb-1">OCR Extracted Text Snippet:</strong>
                "{record.extractedSnippet}"
              </div>
            )}

            {record?.patientReportedNotes && (
              <div className="mt-2 text-xs text-amber-200 bg-amber-950/60 p-2.5 rounded-lg border border-amber-800">
                <strong className="text-amber-400 block mb-1">Patient Memory Recollection Quote:</strong>
                "{record.patientReportedNotes}"
              </div>
            )}

            {record?.labResults && record.labResults.length > 0 && (
              <div className="mt-2 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Supporting Lab Values:</span>
                <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
                  {record.labResults.map((lr, i) => (
                    <div key={i} className="p-1.5 rounded bg-slate-900 border border-slate-800 flex justify-between">
                      <span className="text-slate-300">{lr.testName}:</span>
                      <span className={lr.isAbnormal ? 'text-amber-400 font-bold' : 'text-slate-200'}>
                        {lr.value} {lr.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {record?.prescriptions && record.prescriptions.length > 0 && (
              <div className="mt-2 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Documented Prescriptions:</span>
                <div className="space-y-1 text-xs">
                  {record.prescriptions.map((pr, i) => (
                    <div key={i} className="p-1.5 rounded bg-slate-900 border border-slate-800 flex justify-between">
                      <span className="font-semibold text-teal-300">{pr.medicineName} ({pr.dosage})</span>
                      <span className="text-slate-400">{pr.frequency}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors"
          >
            Close Inspector
          </button>

          {onJumpToTimelineRecord && (
            <button
              onClick={() => {
                onJumpToTimelineRecord(citation.recordId);
                onClose();
              }}
              className="px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-semibold rounded-xl shadow-lg flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <span>Scroll to Record in Timeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
