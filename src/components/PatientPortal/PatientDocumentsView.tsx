import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  Eye, 
  HardDrive, 
  Info,
  Calendar,
  Building2,
  FileCheck,
  Sparkles,
  Loader2,
  X
} from 'lucide-react';
import { PatientProfile, MedicalRecord, RecordType } from '../../types/caretrail';
import { getStorageConfig } from '../../config/env';
import { aiDocumentSummarizerService, DocumentSummaryResult } from '../../services/aiDocumentSummarizerService';

interface PatientDocumentsViewProps {
  patient: PatientProfile;
  records: MedicalRecord[];
  onUploadDocument: (docData: {
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
  onSelectRecordForDetail: (record: MedicalRecord) => void;
}

export const PatientDocumentsView: React.FC<PatientDocumentsViewProps> = ({
  patient,
  records,
  onUploadDocument,
  onSelectRecordForDetail
}) => {
  const storageConfig = getStorageConfig();

  // Filter records that represent uploaded documents or clinical attachments
  const documentRecords = records.filter(
    r => r.sourceCategory === 'PATIENT_UPLOADED' || !!r.originalDocumentName
  );

  // Upload & AI Processing State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<DocumentSummaryResult | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [viewingAiSummaryDoc, setViewingAiSummaryDoc] = useState<MedicalRecord | null>(null);

  // File selection & automatic AI summarization
  const handleFileDropOrSelect = async (file: File) => {
    setUploadError(null);
    setUploadSuccess(null);
    setAiResult(null);

    // Check MIME & extensions: PDF, JPG, PNG, TXT
    const validMimes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'text/plain'];
    const validExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.txt'];
    const hasValidExt = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

    if (!validMimes.includes(file.type) && !hasValidExt) {
      setUploadError('Unsupported file format. Please upload a PDF, JPG, PNG image or text report.');
      setSelectedFile(null);
      return;
    }

    // Check size <= 15MB
    const maxSizeBytes = 15 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setUploadError(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is 15 MB.`);
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setIsAnalyzing(true);

    try {
      // AI automatically analyzes the file, detects what it is about and the hospital/facility
      const summary = await aiDocumentSummarizerService.analyzeAndSummarizeDocument(file, patient.name);
      setAiResult(summary);

      // Automatically store as a document in health records without asking tedious questions
      onUploadDocument({
        title: summary.title,
        fileName: file.name,
        encounterDate: summary.encounterDate,
        facilityName: summary.facilityName,
        type: summary.type,
        extractedSnippet: summary.summaryHighlights.join(' · '),
        clinicalNotes: summary.clinicalNotes,
        prescriptions: summary.prescriptions,
        labResults: summary.labResults
      });

      setUploadSuccess(`Document successfully analyzed and saved: "${summary.title}"`);
    } catch (err: any) {
      setUploadError(err.message || 'Error processing document with AI. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileDropOrSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileDropOrSelect(file);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-teal-800 uppercase tracking-wider mb-1">
            Health Documents & AI Summarizer
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            My Medical Documents
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Upload any medical report, prescription slip, or lab scan. Our AI automatically identifies the hospital, extracts key findings, and stores it in your records.
          </p>
        </div>

        {/* Real Storage Provider Indicator */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs self-start md:self-auto shrink-0">
          <div className="flex items-center space-x-2 mb-1">
            <HardDrive className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-semibold text-slate-700">Storage Provider</span>
          </div>
          {storageConfig.isConfigured ? (
            <div className="text-teal-700 font-medium flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3 text-teal-600" />
              <span>{storageConfig.provider.toUpperCase()} Bucket Active</span>
            </div>
          ) : (
            <div className="text-slate-600">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-1.5" />
              <span>Document storage is not configured</span>
            </div>
          )}
        </div>
      </div>

      {/* Honest Storage Notification when unconfigured */}
      {!storageConfig.isConfigured && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start space-x-3">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-amber-950">Notice: </span>
            Cloud storage is not configured. Uploaded documents are analyzed by AI and metadata is recorded in your local session. Files are not saved to a persistent cloud bucket.
          </div>
        </div>
      )}

      {/* Automatic AI Upload Box (No tedious questions required) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center space-x-2">
          <UploadCloud className="w-5 h-5 text-teal-700" />
          <span>Upload & Auto-Summarize Document</span>
        </h2>
        <p className="text-xs text-slate-600 mb-4">
          Simply drop your medical file here. You do not need to manually type what it is about or which hospital issued it—AI automatically detects and summarizes it.
        </p>

        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            isAnalyzing 
              ? 'border-teal-400 bg-teal-50/40' 
              : 'border-slate-300 hover:border-teal-600 bg-slate-50/60'
          }`}
        >
          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center py-4 space-y-3">
              <Loader2 className="w-8 h-8 text-teal-700 animate-spin" />
              <div className="text-sm font-semibold text-slate-900">
                AI is analyzing your document...
              </div>
              <div className="text-xs text-slate-600 max-w-md">
                Reading optical text, identifying issuing hospital or laboratory, and extracting clinical metrics.
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <label 
                  htmlFor="file-upload-input"
                  className="font-semibold text-teal-700 hover:text-teal-900 cursor-pointer text-sm underline decoration-teal-300 underline-offset-4"
                >
                  Click to select file
                </label>
                <span className="text-xs text-slate-600 ml-1">or drag and drop here</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Supports PDF, JPG, PNG, and TXT files up to 15 MB
              </p>
              <input
                id="file-upload-input"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.txt"
                onChange={handleInputChange}
                className="hidden"
              />
            </div>
          )}
        </div>

        {/* Feedback Alerts */}
        {uploadError && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {uploadSuccess && aiResult && (
          <div className="mt-4 p-4 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-950">
            <div className="flex items-center space-x-2 font-semibold text-teal-900 mb-2">
              <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
              <span>{uploadSuccess}</span>
            </div>
            <div className="bg-white border border-teal-100 rounded-lg p-3 space-y-1.5 mt-2">
              <div className="flex items-center justify-between text-slate-700">
                <span className="font-medium text-slate-900">{aiResult.title}</span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-medium">
                  {aiResult.type}
                </span>
              </div>
              <div className="text-[11px] text-slate-600 flex items-center space-x-1">
                <Building2 className="w-3 h-3 text-slate-500" />
                <span>Detected Facility: <strong>{aiResult.facilityName}</strong></span>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-700 space-y-1">
                <span className="font-semibold block text-slate-900">AI Key Findings:</span>
                {aiResult.summaryHighlights.map((hl, i) => (
                  <div key={i} className="flex items-start space-x-1.5">
                    <span className="text-teal-600 font-bold">•</span>
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Uploaded Documents List */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Stored Health Documents</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {documentRecords.length} documents archived in your CareTrail profile
            </p>
          </div>
        </div>

        <div className="mt-4 divide-y divide-slate-100">
          {documentRecords.length > 0 ? (
            documentRecords.map((doc) => (
              <div key={doc.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 p-2 rounded-xl transition-colors">
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0 mt-0.5">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900">{doc.title}</span>
                      <span className="text-xs px-2 py-0.5 rounded-md bg-teal-50 border border-teal-200 text-teal-800 font-medium inline-flex items-center space-x-1">
                        <Sparkles className="w-3 h-3 text-teal-600" />
                        <span>AI-Summarized Document</span>
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                      <span className="flex items-center space-x-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{doc.hospitalName}</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{doc.encounterDate}</span>
                      </span>
                      {doc.originalDocumentName && (
                        <>
                          <span>·</span>
                          <span className="text-slate-600 font-mono text-[11px]">{doc.originalDocumentName}</span>
                        </>
                      )}
                    </div>

                    {doc.clinicalNotes && (
                      <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 max-w-2xl bg-slate-50 p-2 rounded-lg border border-slate-100">
                        {doc.clinicalNotes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 sm:self-center shrink-0">
                  <button
                    onClick={() => setViewingAiSummaryDoc(doc)}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-medium transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    <span>View AI Summary</span>
                  </button>
                  <button
                    onClick={() => onSelectRecordForDetail(doc)}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>View Record</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mx-auto mb-3">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-800">No documents uploaded yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Upload your external prescriptions, lab reports, or discharge slips above to store them in your health records.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* AI Summary Detail Modal */}
      {viewingAiSummaryDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{viewingAiSummaryDoc.title}</h3>
                  <div className="text-xs text-slate-500">{viewingAiSummaryDoc.hospitalName} · {viewingAiSummaryDoc.encounterDate}</div>
                </div>
              </div>
              <button
                onClick={() => setViewingAiSummaryDoc(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div>
                <span className="font-semibold text-slate-800 block mb-1">AI Clinical Synthesis:</span>
                <p className="text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                  {viewingAiSummaryDoc.clinicalNotes}
                </p>
              </div>

              {viewingAiSummaryDoc.labResults && viewingAiSummaryDoc.labResults.length > 0 && (
                <div>
                  <span className="font-semibold text-slate-800 block mb-1">Extracted Diagnostic Values:</span>
                  <div className="space-y-1.5">
                    {viewingAiSummaryDoc.labResults.map((lr, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                        <span className="font-medium text-slate-800">{lr.testName}</span>
                        <div className="text-right">
                          <span className={`font-bold ${lr.isAbnormal ? 'text-amber-700' : 'text-slate-800'}`}>
                            {lr.value} {lr.unit}
                          </span>
                          <span className="block text-[10px] text-slate-500">Ref: {lr.referenceRange}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {viewingAiSummaryDoc.prescriptions && viewingAiSummaryDoc.prescriptions.length > 0 && (
                <div>
                  <span className="font-semibold text-slate-800 block mb-1">Extracted Prescriptions:</span>
                  <div className="space-y-1.5">
                    {viewingAiSummaryDoc.prescriptions.map((px, i) => (
                      <div key={i} className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                        <div className="font-semibold text-slate-900">{px.medicineName} ({px.dosage})</div>
                        <div className="text-slate-500 text-[11px]">{px.frequency} · {px.duration}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 flex items-center justify-between">
                <span>Verification State:</span>
                <span className="font-semibold">AI-Extracted & Stored in Health Profile</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setViewingAiSummaryDoc(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-medium text-xs hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
