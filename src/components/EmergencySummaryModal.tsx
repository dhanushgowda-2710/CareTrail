import React, { useState } from 'react';
import { 
  X, 
  FileDown, 
  Printer, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Building2, 
  User, 
  Phone, 
  HeartPulse, 
  Pill, 
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { PatientProfile, MedicalRecord, StaffProfile, EmergencySummaryItem, EmergencySummaryExportPayload } from '../types/caretrail';
import { integrationAdapterService } from '../services/integrationAdapterService';

interface EmergencySummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientProfile;
  records: MedicalRecord[];
  staff: StaffProfile;
  onOpenAudit: () => void;
}

export const EmergencySummaryModal: React.FC<EmergencySummaryModalProps> = ({
  isOpen,
  onClose,
  patient,
  records,
  staff,
  onOpenAudit
}) => {
  const [candidates, setCandidates] = useState<EmergencySummaryItem[]>(() => 
    integrationAdapterService.getEmergencyExportCandidates(patient, records)
  );
  const [exportedPayload, setExportedPayload] = useState<EmergencySummaryExportPayload | null>(null);
  const [step, setStep] = useState<'SELECT' | 'PREVIEW' | 'COMPLETED'>('SELECT');

  if (!isOpen) return null;

  const handleToggleItem = (itemId: string) => {
    setCandidates(prev => 
      prev.map(item => item.id === itemId ? { ...item, isIncluded: !item.isIncluded } : item)
    );
  };

  const handleSelectAll = (select: boolean) => {
    setCandidates(prev => prev.map(item => ({ ...item, isIncluded: select })));
  };

  const handleProceedToPreview = () => {
    const payload = integrationAdapterService.generateEmergencySummary(patient, candidates, staff);
    setExportedPayload(payload);
    setStep('PREVIEW');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    if (!exportedPayload) return;
    const blob = new Blob([JSON.stringify(exportedPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CareTrail_Emergency_Summary_${patient.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setStep('COMPLETED');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-teal-600/60 rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <HeartPulse className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-white">Patient-Approved Emergency Summary Export</h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">
                  Minimal Essentials Only
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Explicit patient selection, source-linked provenance, freshness stamp, and non-revocation notice.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-Step Stepper */}
        <div className="flex items-center justify-between py-3 border-b border-slate-800 text-xs">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setStep('SELECT')}
              className={`flex items-center space-x-1.5 font-semibold transition-colors ${
                step === 'SELECT' ? 'text-teal-300' : 'text-slate-500'
              }`}
            >
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] bg-slate-800 border border-slate-700">1</span>
              <span>1. Item Selection</span>
            </button>
            <span className="text-slate-700">›</span>
            <button
              onClick={() => {
                if (candidates.some(c => c.isIncluded)) handleProceedToPreview();
              }}
              className={`flex items-center space-x-1.5 font-semibold transition-colors ${
                step === 'PREVIEW' || step === 'COMPLETED' ? 'text-teal-300' : 'text-slate-500'
              }`}
            >
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] bg-slate-800 border border-slate-700">2</span>
              <span>2. Verified Preview & Stamp</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400">
            Selected: <strong className="text-white">{candidates.filter(c => c.isIncluded).length}</strong> of {candidates.length} items
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {/* STEP 1: ITEM SELECTION */}
          {step === 'SELECT' && (
            <div className="space-y-4">
              {/* Product Constitution Warning */}
              <div className="p-3.5 bg-amber-950/40 border border-amber-800/60 rounded-xl text-xs text-amber-200 leading-relaxed flex items-start space-x-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-100">Minimal History Principle:</strong>
                  <p className="text-slate-300 mt-0.5">
                    To protect patient privacy, full longitudinal consultation notes are <strong className="text-white">excluded by default</strong>. Only life-critical items (blood group, emergency contact, verified drug allergies, major chronic conditions, essential medicines) can be exported.
                  </p>
                </div>
              </div>

              {/* Selection Controls */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Select which items to authorize for the offline emergency document:</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleSelectAll(true)}
                    className="text-teal-400 hover:text-teal-300 text-[11px] underline cursor-pointer"
                  >
                    Select All
                  </button>
                  <span className="text-slate-600">·</span>
                  <button
                    onClick={() => handleSelectAll(false)}
                    className="text-slate-400 hover:text-slate-300 text-[11px] underline cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                {candidates.map(item => (
                  <div
                    key={item.id}
                    onClick={() => handleToggleItem(item.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 text-xs ${
                      item.isIncluded
                        ? 'bg-slate-950/90 border-teal-600/80 text-white'
                        : 'bg-slate-950/40 border-slate-800 text-slate-500 opacity-60'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={item.isIncluded}
                      onChange={() => {}} // handled by parent div
                      className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-100">{item.title}</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                          item.criticality === 'CRITICAL' 
                            ? 'bg-rose-950 text-rose-300 border border-rose-800' 
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {item.criticality}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{item.details}</div>
                      <div className="flex items-center space-x-2 text-[10px] text-slate-500 mt-1.5 font-mono">
                        <span>Source: {item.sourceFacility}</span>
                        <span>·</span>
                        <span>Recorded: {item.sourceDate}</span>
                        <span>·</span>
                        <span className="text-teal-400">{item.provenance}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: VERIFIED PREVIEW & WATERMARK */}
          {(step === 'PREVIEW' || step === 'COMPLETED') && exportedPayload && (
            <div className="space-y-4">
              {/* Mandatory Non-Revocation Notice from Report */}
              <div className="p-3.5 bg-rose-950/50 border border-rose-800/80 rounded-xl text-xs text-rose-200 leading-relaxed flex items-start space-x-2.5">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-rose-100">Critical Revocation Boundary Notice:</strong>
                  <p className="text-slate-300 mt-0.5">
                    {exportedPayload.nonRevocableNotice}
                  </p>
                </div>
              </div>

              {/* Formatted Emergency Sheet Preview */}
              <div 
                id="emergency-sheet-printable" 
                className="p-6 bg-white text-slate-900 rounded-xl shadow-xl border border-slate-200 space-y-4 text-xs font-sans print:p-0 print:border-none print:shadow-none"
              >
                {/* Header Strip with Disclaimer */}
                <div className="border-b-2 border-rose-600 pb-3 flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-base tracking-tight text-slate-900 uppercase">
                        CareTrail Patient Emergency Summary
                      </span>
                    </div>
                    <div className="text-[11px] font-bold text-rose-700 uppercase tracking-wider mt-0.5">
                      ⚠️ {exportedPayload.disclaimer}
                    </div>
                  </div>

                  <div className="text-right text-[10px] font-mono text-slate-500">
                    <div>Export ID: {exportedPayload.exportId}</div>
                    <div>Generated: {new Date(exportedPayload.generatedAt).toLocaleString()}</div>
                    <div className="text-rose-600 font-semibold">May Be Outdated</div>
                  </div>
                </div>

                {/* Patient Demographics Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px]">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Patient Name</span>
                    <strong className="text-slate-900 text-sm">{patient.name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">ABHA ID / MRN</span>
                    <span className="font-mono text-slate-800 font-semibold">{patient.abhaId}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Age / Gender</span>
                    <span className="text-slate-800 font-semibold">{patient.age} yrs / {patient.gender}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Blood Group</span>
                    <span className="font-bold text-rose-700 text-sm">{patient.bloodGroup}</span>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-[11px] flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-rose-600" />
                    <span>
                      <strong className="text-slate-900">Emergency Contact:</strong> {patient.emergencyContact.name} ({patient.emergencyContact.relationship})
                    </span>
                  </div>
                  <span className="font-mono font-bold text-rose-800 text-xs">{patient.emergencyContact.phone}</span>
                </div>

                {/* Included Emergency Items */}
                <div className="space-y-3 pt-2">
                  <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-1">
                    Authorized Emergency Essentials ({exportedPayload.selectedItems.length} items)
                  </div>

                  <div className="divide-y divide-slate-200">
                    {exportedPayload.selectedItems.map((item, i) => (
                      <div key={item.id} className="py-2 flex items-start justify-between">
                        <div>
                          <div className="font-semibold text-slate-900 text-xs flex items-center gap-1.5">
                            <span>{item.title}</span>
                            <span className="text-[10px] text-slate-500 font-normal">({item.category})</span>
                          </div>
                          <div className="text-slate-600 text-[11px] mt-0.5">{item.details}</div>
                        </div>

                        <div className="text-right text-[10px] text-slate-500 font-mono shrink-0 ml-3">
                          <div>Recorded: {item.sourceDate}</div>
                          <div className="text-slate-700">{item.sourceFacility}</div>
                          <span className="text-[9px] px-1 py-0.2 bg-slate-100 rounded text-slate-600 border border-slate-200">
                            {item.provenance}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Legal & Governance Notice Footer */}
                <div className="pt-3 border-t border-slate-200 text-[10px] text-slate-500 leading-tight space-y-1">
                  <div>
                    <strong>Legal Boundary:</strong> {exportedPayload.completenessNotice} This offline summary does not represent a full medical record and must not be used as sole medical authority.
                  </div>
                  <div>
                    Export authorized by clinician <span className="font-semibold text-slate-700">{staff.name}</span> under active patient consent context.
                  </div>
                </div>
              </div>

              {step === 'COMPLETED' && (
                <div className="p-3 bg-emerald-950/50 border border-emerald-800 rounded-xl text-xs text-emerald-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Emergency brief successfully generated and audited.</span>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAudit();
                    }}
                    className="text-teal-300 hover:underline font-semibold"
                  >
                    View Audit Log
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
          {step === 'SELECT' ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleProceedToPreview}
                disabled={!candidates.some(c => c.isIncluded)}
                className={`px-4 py-2 rounded-xl font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                  candidates.some(c => c.isIncluded)
                    ? 'bg-teal-600 hover:bg-teal-500 text-white shadow-md shadow-teal-900/30'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span>Proceed to Verified Preview</span>
                <span>›</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep('SELECT')}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-colors cursor-pointer"
              >
                ‹ Modify Selection
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrint}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer"
                  title="Print or Save as PDF via browser print dialogue"
                >
                  <Printer className="w-3.5 h-3.5 text-teal-400" />
                  <span>Print / Save PDF</span>
                </button>

                <button
                  onClick={handleDownloadJson}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl flex items-center space-x-1.5 shadow-md shadow-teal-900/30 transition-colors cursor-pointer"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Download JSON Export</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
