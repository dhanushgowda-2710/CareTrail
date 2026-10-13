import React, { useState } from 'react';
import { 
  FlaskConical, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  CheckCircle2, 
  Building2, 
  Tag, 
  ShieldAlert, 
  Calendar, 
  ArrowUpRight, 
  Sparkles, 
  Activity, 
  FileCheck2, 
  ChevronRight, 
  Clock, 
  Layers, 
  Info,
  Check
} from 'lucide-react';
import { 
  LabInvestigationAssessment, 
  StandardizedLabItem, 
  LabDeltaAlert, 
  StaffProfile, 
  LabCategory 
} from '../types/caretrail';

interface LabInvestigationsCardProps {
  assessment: LabInvestigationAssessment;
  staff: StaffProfile;
  onOpenLabInspector: (labItem: StandardizedLabItem) => void;
  onAcknowledgeDelta?: (deltaId: string, note: string) => void;
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

export const LabInvestigationsCard: React.FC<LabInvestigationsCardProps> = ({
  assessment,
  staff,
  onOpenLabInspector,
  onAcknowledgeDelta,
  onSelectCitation
}) => {
  const [selectedCategory, setSelectedCategory] = useState<LabCategory | 'ALL'>('ALL');
  const [filterAbnormalOnly, setFilterAbnormalOnly] = useState<boolean>(false);

  const { panels, deltaAlerts, metrics, loincCodingRate } = assessment;

  const filteredPanels = panels.filter(item => {
    const categoryMatch = selectedCategory === 'ALL' || item.category === selectedCategory;
    const abnormalMatch = !filterAbnormalOnly || item.flag !== 'NORMAL';
    return categoryMatch && abnormalMatch;
  });

  const unacknowledgedDeltas = deltaAlerts.filter(d => d.status === 'UNACKNOWLEDGED');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <FlaskConical className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-white">Longitudinal Laboratory & Diagnostic Investigations Hub</h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                PROMPT 9 / 14
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              LOINC standardized multi-facility lab aggregation, reference range harmonization, and automated delta-check alerts.
            </p>
          </div>
        </div>

        {/* LOINC Coding Rate & Accreditation Strip */}
        <div className="flex items-center space-x-2 text-[11px]">
          <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 font-mono text-slate-300">
            LOINC Alignment: <strong className="text-cyan-400">{loincCodingRate}</strong>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 font-mono text-slate-300">
            Harmonized Panels: <strong className="text-teal-400">{metrics.totalTestsCount} Analytes</strong>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 font-mono text-slate-300">
            Delta Checks: <strong className="text-rose-400">{deltaAlerts.length} Flagged</strong>
          </span>
        </div>
      </div>

      {/* Metrics Counter Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Standardized Analytes</div>
            <div className="text-lg font-bold text-white font-mono mt-0.5">{metrics.totalTestsCount}</div>
          </div>
          <Activity className="w-5 h-5 text-cyan-400/60" />
        </div>

        <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/40 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-amber-300/80 uppercase font-semibold">Abnormal Values</div>
            <div className="text-lg font-bold text-amber-300 font-mono mt-0.5">{metrics.abnormalCount}</div>
          </div>
          <AlertTriangle className="w-5 h-5 text-amber-400/60" />
        </div>

        <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-900/50 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-rose-300/80 uppercase font-semibold">Critical Thresholds</div>
            <div className="text-lg font-bold text-rose-300 font-mono mt-0.5">{metrics.criticalCount}</div>
          </div>
          <ShieldAlert className="w-5 h-5 text-rose-400/70" />
        </div>

        <div className="p-3 rounded-xl bg-teal-950/30 border border-teal-900/50 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-teal-300/80 uppercase font-semibold">Categories Evaluated</div>
            <div className="text-lg font-bold text-teal-300 font-mono mt-0.5">{metrics.categoriesEvaluatedCount} Organ Panels</div>
          </div>
          <Layers className="w-5 h-5 text-teal-400/70" />
        </div>
      </div>

      {/* Critical Delta Alerts Strip */}
      {unacknowledgedDeltas.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Cross-Facility Critical Delta-Check Alerts ({unacknowledgedDeltas.length})</span>
            </span>
            <span className="text-[10px] text-slate-400">Automated trajectory comparison between sequential hospital labs</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {unacknowledgedDeltas.map(alert => (
              <div 
                key={alert.id}
                className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 space-y-2 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold text-xs text-rose-200 leading-snug">
                    {alert.title}
                  </div>
                  <span className="px-1.5 py-0.5 rounded font-mono font-bold text-[10px] bg-rose-900/80 text-rose-100 border border-rose-700 shrink-0">
                    {alert.percentageChange > 0 ? `+${alert.percentageChange}%` : `${alert.percentageChange}%`}
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-3">
                  {alert.description}
                </p>

                <div className="pt-2 border-t border-rose-900/60 flex items-center justify-between text-[11px]">
                  <span className="text-rose-300 font-mono text-[10px]">
                    LOINC: {alert.loincCode}
                  </span>
                  <div className="flex items-center space-x-2">
                    {onAcknowledgeDelta && (
                      <button
                        onClick={() => onAcknowledgeDelta(alert.id, `Acknowledged by ${staff.name} (${staff.designation})`)}
                        className="px-2 py-1 bg-rose-900/70 hover:bg-rose-800 text-rose-100 rounded text-[10px] font-semibold transition-colors cursor-pointer flex items-center space-x-1"
                        title="Mark delta alert as reviewed by clinician"
                      >
                        <Check className="w-3 h-3" />
                        <span>Acknowledge</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        const targetItem = panels.find(p => p.loinc.code === alert.loincCode);
                        if (targetItem) onOpenLabInspector(targetItem);
                      }}
                      className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-800/60 rounded text-[10px] font-semibold transition-colors cursor-pointer flex items-center space-x-1"
                    >
                      <span>Analyze</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Tabs & Filter Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-slate-800">
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 gap-1 text-xs overflow-x-auto">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-cyan-700 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Panels ({panels.length})
          </button>
          <button
            onClick={() => setSelectedCategory('GLYCEMIC')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              selectedCategory === 'GLYCEMIC'
                ? 'bg-cyan-700 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Glycemic / Diabetes
          </button>
          <button
            onClick={() => setSelectedCategory('RENAL_ELECTROLYTES')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              selectedCategory === 'RENAL_ELECTROLYTES'
                ? 'bg-cyan-700 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Renal & Electrolytes
          </button>
          <button
            onClick={() => setSelectedCategory('LIPID')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              selectedCategory === 'LIPID'
                ? 'bg-cyan-700 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Lipid Profile
          </button>
          <button
            onClick={() => setSelectedCategory('HEPATIC_LFT')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              selectedCategory === 'HEPATIC_LFT'
                ? 'bg-cyan-700 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Hepatic / LFT
          </button>
          <button
            onClick={() => setSelectedCategory('HEMATOLOGY')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              selectedCategory === 'HEMATOLOGY'
                ? 'bg-cyan-700 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Hematology
          </button>
        </div>

        <button
          onClick={() => setFilterAbnormalOnly(!filterAbnormalOnly)}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors flex items-center space-x-1.5 cursor-pointer ${
            filterAbnormalOnly
              ? 'bg-amber-950/80 text-amber-200 border-amber-700'
              : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>Show Abnormal Only ({metrics.abnormalCount})</span>
        </button>
      </div>

      {/* Standardized Lab Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/90 text-slate-400 font-semibold border-b border-slate-800">
            <tr>
              <th className="py-3 px-3">Analyte & Standard LOINC</th>
              <th className="py-3 px-3">Latest Result</th>
              <th className="py-3 px-3">Reference Interval</th>
              <th className="py-3 px-3">Trajectory Trend</th>
              <th className="py-3 px-3">Performing Facility & Provenance</th>
              <th className="py-3 px-3 text-right">Clinical Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 bg-slate-900/60 font-sans">
            {filteredPanels.map(item => {
              const isCritical = item.flag === 'CRITICAL_HIGH' || item.flag === 'CRITICAL_LOW';
              const isHigh = item.flag === 'HIGH';
              const isLow = item.flag === 'LOW';

              return (
                <tr 
                  key={item.id}
                  className="hover:bg-slate-800/40 transition-colors"
                >
                  {/* Analyte & LOINC */}
                  <td className="py-3 px-3">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span>{item.testName}</span>
                      {item.deltaAlert && (
                        <span className="p-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[9px] font-mono font-bold" title="Delta check triggered">
                          DELTA
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-1.5 text-[11px] text-cyan-300/90 font-mono mt-0.5">
                      <span>LOINC: {item.loinc.code}</span>
                      <span>•</span>
                      <span className="text-slate-400 text-[10px]">{item.specimenType}</span>
                    </div>
                  </td>

                  {/* Latest Result */}
                  <td className="py-3 px-3 font-mono">
                    <div className="flex items-center space-x-1.5">
                      <span className={`text-sm font-extrabold ${
                        isCritical 
                          ? 'text-rose-400' 
                          : isHigh 
                            ? 'text-amber-300' 
                            : isLow 
                              ? 'text-blue-300' 
                              : 'text-emerald-300'
                      }`}>
                        {item.displayValue}
                      </span>
                      <span className="text-[11px] text-slate-400">{item.unit}</span>
                    </div>
                    <div className="mt-0.5">
                      {isCritical && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                          CRITICAL {item.flag === 'CRITICAL_HIGH' ? 'HIGH' : 'LOW'}
                        </span>
                      )}
                      {!isCritical && (isHigh || isLow) && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                          {item.flag}
                        </span>
                      )}
                      {item.flag === 'NORMAL' && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-800">
                          NORMAL
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Reference Interval */}
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-300">
                    <div>{item.referenceRange}</div>
                    <div className="text-[10px] text-slate-500 font-sans mt-0.5">{item.methodology.split('(')[0].trim()}</div>
                  </td>

                  {/* Trajectory Trend */}
                  <td className="py-3 px-3">
                    <div className="flex items-center space-x-1 text-xs font-mono">
                      {item.trendDirection === 'UP' && (
                        <span className="flex items-center text-rose-400 font-bold">
                          <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                          <span>Worsening</span>
                        </span>
                      )}
                      {item.trendDirection === 'DOWN' && item.category === 'RENAL_ELECTROLYTES' && (
                        <span className="flex items-center text-rose-400 font-bold">
                          <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                          <span>Declining eGFR</span>
                        </span>
                      )}
                      {item.trendDirection === 'DOWN' && item.category === 'LIPID' && (
                        <span className="flex items-center text-emerald-400 font-bold">
                          <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                          <span>Improving</span>
                        </span>
                      )}
                      {item.trendDirection === 'STABLE' && (
                        <span className="flex items-center text-slate-400">
                          <Minus className="w-3.5 h-3.5 mr-0.5" />
                          <span>Stable</span>
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {item.historicalReadings.length} serial checkpoints
                    </div>
                  </td>

                  {/* Performing Facility & Provenance */}
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-200 text-xs flex items-center space-x-1">
                      <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[150px]">{item.latestFacility}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-[10px] mt-0.5">
                      <span className="text-slate-400">{item.latestDate}</span>
                      <span>•</span>
                      {onSelectCitation ? (
                        <button
                          onClick={() => onSelectCitation({
                            citationId: `cite-${item.recordId}`,
                            label: item.citationLabel,
                            recordId: item.recordId,
                            recordTitle: item.testName,
                            sourceCategory: item.sourceCategory,
                            hospitalName: item.latestFacility,
                            encounterDate: item.latestDate,
                            quoteSnippet: `${item.testName}: ${item.displayValue} ${item.unit} (${item.referenceRange}). ${item.methodology}`,
                            verificationStatus: item.sourceCategory === 'INSTITUTIONAL' ? 'VERIFIED' : 'AWAITING_REVIEW'
                          })}
                          className="font-mono text-cyan-300 hover:underline cursor-pointer"
                        >
                          {item.citationLabel}
                        </button>
                      ) : (
                        <span className="font-mono text-cyan-300">{item.citationLabel}</span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {item.interpretationSignOff ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Signed</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => onOpenLabInspector(item)}
                          className="px-2.5 py-1 bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-800 text-cyan-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center space-x-1"
                        >
                          <span>Inspect</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Info Strip */}
      <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center space-x-2">
          <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>Cross-facility delta analysis flags significant biological variations across separate laboratory information systems (LIMS).</span>
        </div>
        <div className="flex items-center space-x-2 font-mono text-[11px] text-slate-300">
          <span>Attending Physician: <strong className="text-white">{staff.name}</strong></span>
        </div>
      </div>
    </div>
  );
};
