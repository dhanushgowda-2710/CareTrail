import React, { useState } from 'react';
import { 
  X, 
  FlaskConical, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Building2, 
  Calendar, 
  User, 
  ArrowRight, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Info,
  FileCheck2,
  Tag,
  PenTool
} from 'lucide-react';
import { 
  StandardizedLabItem, 
  StaffProfile 
} from '../types/caretrail';

interface LabInvestigationInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  labItem: StandardizedLabItem | null;
  staff: StaffProfile;
  onSignOffInterpretation: (labItemId: string, assessment: string) => void;
  onSelectCitation?: (citation: {
    citationId: string;
    label: string;
    recordId: string;
    recordTitle: string;
    sourceCategory: any;
    hospitalName: string;
    encounterDate: string;
    quoteSnippet: string;
    verificationStatus: any;
  }) => void;
}

export const LabInvestigationInspectorModal: React.FC<LabInvestigationInspectorModalProps> = ({
  isOpen,
  onClose,
  labItem,
  staff,
  onSignOffInterpretation,
  onSelectCitation
}) => {
  if (!isOpen || !labItem) return null;

  const defaultAssessment = labItem.deltaAlert 
    ? `Verified longitudinal delta surge (+${labItem.deltaAlert.percentageChange}%). Clinical significance: ${labItem.deltaAlert.clinicalSignificance}. Recommended intervention: ${labItem.deltaAlert.recommendedAction}`
    : `Reviewed serial values for ${labItem.testName}. Result ${labItem.displayValue} ${labItem.unit} is consistent with documented clinical trajectory. Continue monitoring according to established protocol.`;

  const [assessmentText, setAssessmentText] = useState<string>(
    labItem.interpretationSignOff?.clinicalAssessment || defaultAssessment
  );

  const handleApplySignOff = () => {
    if (!assessmentText.trim()) return;
    onSignOffInterpretation(labItem.id, assessmentText.trim());
    onClose();
  };

  const isCritical = labItem.flag === 'CRITICAL_HIGH' || labItem.flag === 'CRITICAL_LOW';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <FlaskConical className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-white">{labItem.testName}</h2>
                <span className="px-2 py-0.5 rounded font-mono font-bold text-[11px] bg-cyan-950 text-cyan-300 border border-cyan-800">
                  LOINC: {labItem.loinc.code}
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                  isCritical 
                    ? 'bg-rose-950 text-rose-300 border border-rose-800' 
                    : labItem.flag !== 'NORMAL'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}>
                  {labItem.flag}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {labItem.canonicalName} • {labItem.loinc.name}
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-slate-300">
          {/* LOINC Ontology Details Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Standard LOINC</span>
              <div className="text-xs font-mono font-bold text-cyan-300 mt-0.5">{labItem.loinc.code}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Specimen Matrix</span>
              <div className="text-xs font-bold text-white mt-0.5">{labItem.specimenType}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Analytical Method</span>
              <div className="text-xs font-bold text-white mt-0.5 truncate">{labItem.methodology.split('(')[0]}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Organ Classification</span>
              <div className="text-xs font-bold text-teal-400 mt-0.5">{labItem.category}</div>
            </div>
          </div>

          {/* Delta Alert Banner (if present) */}
          {labItem.deltaAlert && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>{labItem.deltaAlert.title}</span>
                </span>
                <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-rose-900 text-rose-100 border border-rose-700">
                  {labItem.deltaAlert.percentageChange > 0 ? `+${labItem.deltaAlert.percentageChange}%` : `${labItem.deltaAlert.percentageChange}%`} Shift
                </span>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed">
                {labItem.deltaAlert.description}
              </p>

              <div className="p-2.5 rounded-lg bg-black/40 border border-rose-900/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400">Clinical Risk:</span>
                  <div className="text-rose-200 font-medium mt-0.5">{labItem.deltaAlert.clinicalSignificance}</div>
                </div>
                <div>
                  <span className="text-slate-400">Recommended Next Step:</span>
                  <div className="text-teal-200 font-medium mt-0.5">{labItem.deltaAlert.recommendedAction}</div>
                </div>
              </div>
            </div>
          )}

          {/* Multi-Facility Longitudinal Flowsheet Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>Multi-Facility Serial Test History ({labItem.historicalReadings.length} Chronological Observations)</span>
              </span>
              <span className="text-[10px] text-slate-400">Harmonized across in-network LIMS & external documents</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Result</th>
                    <th className="py-2.5 px-3">Interpretation</th>
                    <th className="py-2.5 px-3">Facility Reference Range</th>
                    <th className="py-2.5 px-3">Testing Facility & Source</th>
                    <th className="py-2.5 px-3 text-right">Citation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 bg-slate-900/60 font-sans">
                  {labItem.historicalReadings.map((reading, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-mono font-medium text-slate-300">
                        {reading.date}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-white">
                        <span className={`text-sm ${
                          reading.flag === 'CRITICAL_HIGH' || reading.flag === 'CRITICAL_LOW'
                            ? 'text-rose-400'
                            : reading.flag !== 'NORMAL'
                              ? 'text-amber-300'
                              : 'text-emerald-300'
                        }`}>
                          {reading.displayValue}
                        </span>{' '}
                        <span className="text-[10px] text-slate-400">{reading.unit}</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                          reading.flag === 'CRITICAL_HIGH' || reading.flag === 'CRITICAL_LOW'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : reading.flag !== 'NORMAL'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                        }`}>
                          {reading.flag}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-300">
                        {reading.referenceRange}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-200">{reading.facility}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {reading.sourceCategory} • {reading.methodology || labItem.methodology.split('(')[0]}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {onSelectCitation ? (
                          <button
                            onClick={() => onSelectCitation({
                              citationId: `cite-${reading.recordId}`,
                              label: reading.citationLabel,
                              recordId: reading.recordId,
                              recordTitle: `${labItem.testName} (${reading.date})`,
                              sourceCategory: reading.sourceCategory,
                              hospitalName: reading.facility,
                              encounterDate: reading.date,
                              quoteSnippet: `${labItem.testName}: ${reading.displayValue} ${reading.unit} at ${reading.facility}. Reference: ${reading.referenceRange}`,
                              verificationStatus: reading.sourceCategory === 'INSTITUTIONAL' ? 'VERIFIED' : 'AWAITING_REVIEW'
                            })}
                            className="font-mono text-cyan-300 hover:underline cursor-pointer"
                          >
                            {reading.citationLabel}
                          </button>
                        ) : (
                          <span className="font-mono text-cyan-300">{reading.citationLabel}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Clinician Diagnostic Interpretation Form */}
          <div className="p-4 rounded-xl bg-slate-950 border border-cyan-900/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <PenTool className="w-3.5 h-3.5 text-cyan-400" />
                <span>Attending Clinician Diagnostic Assessment & Sign-Off</span>
              </span>
              <span className="text-[10px] font-mono text-cyan-300">
                Signer: {staff.name} ({staff.designation})
              </span>
            </div>

            <textarea
              value={assessmentText}
              onChange={(e) => setAssessmentText(e.target.value)}
              rows={3}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans leading-relaxed"
              placeholder="Enter clinical assessment, therapeutic titration rationale, or follow-up schedule..."
            />

            {labItem.interpretationSignOff && (
              <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800 flex items-center justify-between text-xs text-emerald-300">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Electronically Signed by <strong>{labItem.interpretationSignOff.signedBy}</strong> on {new Date(labItem.interpretationSignOff.signedAt).toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            Immutable sign-off is logged into the national ABDM safety audit trail.
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleApplySignOff}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Sign Off Interpretation</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
