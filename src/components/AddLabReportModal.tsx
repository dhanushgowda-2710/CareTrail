import React, { useState } from 'react';
import { 
  X, 
  FlaskConical, 
  Check, 
  AlertTriangle, 
  Building2, 
  User, 
  UploadCloud,
  FileText,
  Sparkles,
  Loader2,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { PatientProfile, StaffProfile, LabResultItem } from '../types/caretrail';
import { aiDocumentSummarizerService } from '../services/aiDocumentSummarizerService';

interface AddLabReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientProfile;
  staff: StaffProfile;
  onAddLabReport: (labData: {
    testName: string;
    category?: string;
    value: string;
    unit: string;
    referenceRange: string;
    isAbnormal?: boolean;
    clinicalNotes?: string;
    specimen?: string;
    originalDocumentName?: string;
    aiLabSummary?: string;
    pdfContentText?: string;
    pdfDataUrl?: string;
    labResults?: Array<{
      testName: string;
      value: string;
      unit: string;
      referenceRange: string;
      isAbnormal: boolean;
      flag?: 'HIGH' | 'LOW' | 'NORMAL' | 'CRITICAL';
    }>;
  }) => void;
}

export const AddLabReportModal: React.FC<AddLabReportModalProps> = ({
  isOpen,
  onClose,
  patient,
  staff,
  onAddLabReport
}) => {
  // Mode: 'upload_pdf' (default requested by user) or 'manual_entry'
  const [entryMode, setEntryMode] = useState<'upload_pdf' | 'manual_entry'>('upload_pdf');

  // File Upload & AI Summarization State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<{
    testName: string;
    category: string;
    specimen: string;
    encounterDate: string;
    facilityName: string;
    originalDocumentName: string;
    aiLabSummary: string;
    pdfContentText: string;
    labResults: Array<{
      testName: string;
      value: string;
      unit: string;
      referenceRange: string;
      isAbnormal: boolean;
      flag: 'HIGH' | 'LOW' | 'NORMAL' | 'CRITICAL';
    }>;
  } | null>(null);

  // Manual Form State
  const [testName, setTestName] = useState('Fasting Blood Glucose (FBG)');
  const [category, setCategory] = useState('Biochemistry');
  const [value, setValue] = useState('142');
  const [unit, setUnit] = useState('mg/dL');
  const [referenceRange, setReferenceRange] = useState('70 - 100 mg/dL');
  const [isAbnormal, setIsAbnormal] = useState(true);
  const [specimen, setSpecimen] = useState('Venous Blood (Fluoride / EDTA)');
  const [clinicalNotes, setClinicalNotes] = useState('Automated analyzer report verified.');

  if (!isOpen) return null;

  const handleFileUpload = async (file: File) => {
    setUploadError(null);

    // Validate type: PDF, Images, Text
    const validMimes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'text/plain'];
    const validExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.txt'];
    const hasValidExt = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

    if (!validMimes.includes(file.type) && !hasValidExt) {
      setUploadError('Unsupported file format. Please upload a lab report PDF, image, or text file.');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setUploadError('File exceeds 15 MB maximum size.');
      return;
    }

    setSelectedFile(file);
    setIsAiAnalyzing(true);

    try {
      // AI extracts high / low values, clinical findings, and prepares original PDF summary
      const analysis = await aiDocumentSummarizerService.summarizeLabReportPdf(
        file,
        patient.name,
        staff.hospitalName
      );
      setAiAnalysisResult(analysis);
    } catch (err: any) {
      setUploadError(err.message || 'Error analyzing lab report PDF.');
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  // Submit AI-extracted PDF lab report
  const handleSaveAiLabReport = () => {
    if (!aiAnalysisResult) return;

    const primaryResult = aiAnalysisResult.labResults[0];

    onAddLabReport({
      testName: aiAnalysisResult.testName,
      category: aiAnalysisResult.category,
      value: primaryResult ? primaryResult.value : 'Results Included',
      unit: primaryResult ? primaryResult.unit : '',
      referenceRange: primaryResult ? primaryResult.referenceRange : 'Panel Interval',
      isAbnormal: aiAnalysisResult.labResults.some(r => r.isAbnormal || r.flag === 'HIGH' || r.flag === 'LOW'),
      specimen: aiAnalysisResult.specimen,
      clinicalNotes: aiAnalysisResult.aiLabSummary,
      originalDocumentName: aiAnalysisResult.originalDocumentName,
      aiLabSummary: aiAnalysisResult.aiLabSummary,
      pdfContentText: aiAnalysisResult.pdfContentText,
      labResults: aiAnalysisResult.labResults
    });

    onClose();
  };

  // Submit manual form entry
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testName.trim() || !value.trim()) return;

    onAddLabReport({
      testName: testName.trim(),
      category,
      value: value.trim(),
      unit: unit.trim(),
      referenceRange: referenceRange.trim(),
      isAbnormal,
      specimen,
      clinicalNotes: clinicalNotes.trim(),
      originalDocumentName: `${testName.toLowerCase().replace(/\s+/g, '_')}_lims_certified.pdf`,
      aiLabSummary: isAbnormal 
        ? `Diagnostic Analysis: ${testName} value (${value} ${unit}) is flagged out of standard reference range (${referenceRange}).`
        : `Diagnostic Analysis: ${testName} value (${value} ${unit}) is within normal physiological range (${referenceRange}).`,
      pdfContentText: `${staff.hospitalName.toUpperCase()} LABORATORY SERVICES\nTest: ${testName}\nResult: ${value} ${unit} (Ref: ${referenceRange})\nVerified by: ${staff.name} (${staff.designation})`
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Add Laboratory Investigation Report
              </h3>
              <p className="text-xs text-slate-500">
                Patient: <span className="font-semibold text-slate-700">{patient.name}</span> ({patient.mrn}) · {patient.age}y {patient.gender}
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

        {/* Technician Badge */}
        <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>Operator: <strong>{staff.name}</strong> ({staff.role === 'lab_technician' ? 'Lab Technician' : staff.designation})</span>
          </div>
          <div className="flex items-center space-x-1.5 text-slate-500">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span>{staff.department}</span>
          </div>
        </div>

        {/* Mode Selector (PDF Upload vs Manual) */}
        <div className="mt-4 flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setEntryMode('upload_pdf')}
            className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-1.5 ${
              entryMode === 'upload_pdf'
                ? 'bg-white text-teal-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UploadCloud className="w-4 h-4 text-teal-700" />
            <span>Upload PDF (AI Auto-Summarizes High / Low Values)</span>
          </button>
          <button
            type="button"
            onClick={() => setEntryMode('manual_entry')}
            className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-1.5 ${
              entryMode === 'manual_entry'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FlaskConical className="w-4 h-4 text-slate-500" />
            <span>Manual Test Entry</span>
          </button>
        </div>

        {/* WORKFLOW 1: Upload PDF Report with AI Summarization */}
        {entryMode === 'upload_pdf' && (
          <div className="mt-5 space-y-4">
            {/* Upload Area */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                isAiAnalyzing
                  ? 'border-teal-400 bg-teal-50/40'
                  : 'border-slate-300 hover:border-teal-600 bg-slate-50/60'
              }`}
            >
              {isAiAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-4 space-y-2">
                  <Loader2 className="w-7 h-7 text-teal-700 animate-spin" />
                  <div className="text-sm font-semibold text-slate-900">
                    AI is analyzing lab report PDF...
                  </div>
                  <div className="text-xs text-slate-600">
                    Detecting test parameters, reference intervals, and flagging High / Low values.
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-2.5">
                  <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <label 
                      htmlFor="lab-pdf-upload"
                      className="font-semibold text-teal-700 hover:text-teal-900 cursor-pointer text-xs underline decoration-teal-300 underline-offset-4"
                    >
                      Click to upload lab report PDF
                    </label>
                    <span className="text-xs text-slate-600 ml-1">or drag & drop</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Supports Pathology & Diagnostic PDFs up to 15 MB
                  </p>
                  <input
                    id="lab-pdf-upload"
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.txt"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            {uploadError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* AI Analysis Preview if loaded */}
            {aiAnalysisResult && (
              <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-200 text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-teal-100 pb-2">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-teal-700" />
                    <span className="font-bold text-slate-900 text-sm">{aiAnalysisResult.testName}</span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-mono">
                    {aiAnalysisResult.originalDocumentName}
                  </span>
                </div>

                {/* AI Summary Banner */}
                <div className="bg-white rounded-lg p-3 border border-teal-100 space-y-1.5">
                  <div className="font-semibold text-teal-900 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />
                    <span>AI Diagnostic Summary:</span>
                  </div>
                  <p className="text-slate-700 whitespace-pre-line leading-relaxed text-xs">
                    {aiAnalysisResult.aiLabSummary}
                  </p>
                </div>

                {/* Detected Parameters with High / Low Badges */}
                <div>
                  <div className="font-semibold text-slate-800 mb-1.5">
                    Extracted Test Parameters & Flags:
                  </div>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {aiAnalysisResult.labResults.map((item, idx) => {
                      const isHigh = item.flag === 'HIGH';
                      const isLow = item.flag === 'LOW';
                      const isAbnormal = isHigh || isLow || item.isAbnormal;

                      return (
                        <div
                          key={idx}
                          className={`flex items-center justify-between p-2 rounded-lg border text-xs ${
                            isHigh
                              ? 'bg-rose-50/60 border-rose-200 text-rose-900'
                              : isLow
                              ? 'bg-amber-50/60 border-amber-200 text-amber-900'
                              : 'bg-white border-slate-200 text-slate-800'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{item.testName}</span>
                            <span className="text-[11px] text-slate-500">
                              (Ref: {item.referenceRange})
                            </span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className="font-bold font-mono">
                              {item.value} {item.unit}
                            </span>
                            {isHigh && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white">
                                HIGH
                              </span>
                            )}
                            {isLow && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white">
                                LOW
                              </span>
                            )}
                            {!isAbnormal && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-800">
                                NORMAL
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Confirmation Button */}
                <div className="pt-2 flex items-center justify-end space-x-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveAiLabReport}
                    className="inline-flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-medium transition-colors shadow-xs"
                  >
                    <Check className="w-4 h-4" />
                    <span>Store Lab Report & Summary</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* WORKFLOW 2: Manual Form Entry */}
        {entryMode === 'manual_entry' && (
          <form onSubmit={handleManualSubmit} className="mt-5 space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Investigation / Test Name
                </label>
                <input
                  type="text"
                  required
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  placeholder="e.g. Fasting Blood Glucose"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Diagnostic Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900 bg-white"
                >
                  <option value="Biochemistry">Biochemistry</option>
                  <option value="Hematology">Hematology</option>
                  <option value="Pathology">Pathology</option>
                  <option value="Microbiology">Microbiology</option>
                  <option value="Serology">Serology</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Test Result
                </label>
                <input
                  type="text"
                  required
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="e.g. 142"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900 font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Unit
                </label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="mg/dL"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Ref. Range
                </label>
                <input
                  type="text"
                  value={referenceRange}
                  onChange={(e) => setReferenceRange(e.target.value)}
                  placeholder="70 - 100"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="manual-is-abnormal-chk"
                checked={isAbnormal}
                onChange={(e) => setIsAbnormal(e.target.checked)}
                className="w-4 h-4 rounded text-teal-700 focus:ring-teal-700 border-slate-300"
              />
              <label htmlFor="manual-is-abnormal-chk" className="text-xs text-slate-700 font-medium cursor-pointer flex items-center space-x-1">
                <span>Flag as Abnormal / Out-of-Range finding (High / Low)</span>
                {isAbnormal && <AlertTriangle className="w-3.5 h-3.5 text-amber-600 inline" />}
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Specimen & Analyzer Notes (Optional)
              </label>
              <input
                type="text"
                value={specimen}
                onChange={(e) => setSpecimen(e.target.value)}
                placeholder="e.g. Venous Blood Sample"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900 mb-2"
              />
              <textarea
                rows={2}
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                placeholder="Add technician observations, analyzer quality control status, or flags..."
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900 resize-none"
              />
            </div>

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
                disabled={!testName.trim() || !value.trim()}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-medium transition-colors disabled:opacity-50 shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Record & Sign Lab Report</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
