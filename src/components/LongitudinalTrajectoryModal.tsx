import React, { useState } from 'react';
import { 
  X, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  AlertTriangle, 
  CheckCircle2, 
  Building2, 
  Calendar,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { LabTrajectorySeries, ClinicalCitation } from '../types/caretrail';

interface LongitudinalTrajectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  trajectories: LabTrajectorySeries[];
  patientName: string;
  onSelectCitation?: (citation: ClinicalCitation) => void;
}

export const LongitudinalTrajectoryModal: React.FC<LongitudinalTrajectoryModalProps> = ({
  isOpen,
  onClose,
  trajectories,
  patientName,
  onSelectCitation
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  if (!isOpen) return null;

  const categories = ['ALL', 'GLYCEMIC', 'CARDIOVASCULAR', 'RENAL', 'LIPID'];
  const filteredTrajectories = selectedCategory === 'ALL'
    ? trajectories
    : trajectories.filter(t => t.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-teal-600/60 rounded-2xl max-w-4xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-white">Longitudinal Biomarker & Lab Trajectory Flowsheet</h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-teal-950 text-teal-300 border border-teal-800">
                  Multi-Source Grounded
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Longitudinal progression of vital signs, glycemic control, and organ parameters across healthcare facilities for <strong className="text-teal-200">{patientName}</strong>.
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

        {/* Category Filter Pills */}
        <div className="mt-4 flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 gap-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex-1 py-1.5 px-2 rounded-lg font-semibold transition-all capitalize ${
                selectedCategory === cat
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All Trajectories' : cat.toLowerCase()}
            </button>
          ))}
        </div>

        {/* Trajectory Series Cards */}
        <div className="mt-4 space-y-4">
          {filteredTrajectories.length === 0 ? (
            <div className="p-8 text-center bg-slate-950/60 rounded-xl border border-slate-800 text-slate-400 text-xs">
              No trajectory series found for selected category.
            </div>
          ) : (
            filteredTrajectories.map((series, idx) => {
              const isWorsening = series.trendDirection === 'WORSENING';
              const isImproving = series.trendDirection === 'IMPROVING';

              return (
                <div 
                  key={idx}
                  className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3 shadow-md"
                >
                  {/* Series Title & Trend Indicator */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-slate-100">{series.testName}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-slate-800 text-slate-300 border border-slate-700">
                          Target: {series.optimalRange}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {series.clinicalInterpretation}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${
                        isWorsening ? 'bg-amber-950/60 text-amber-300 border-amber-800' :
                        isImproving ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800' :
                        'bg-slate-800 text-slate-300 border-slate-700'
                      }`}>
                        {isWorsening && <TrendingUp className="w-3.5 h-3.5 mr-1 text-amber-400" />}
                        {isImproving && <TrendingDown className="w-3.5 h-3.5 mr-1 text-emerald-400" />}
                        {!isWorsening && !isImproving && <Minus className="w-3.5 h-3.5 mr-1 text-slate-400" />}
                        <span>{series.trendDirection} TREND</span>
                      </span>
                    </div>
                  </div>

                  {/* Flowsheet Points Table / Timeline */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
                    {series.points.map((pt, pIdx) => {
                      const isInstitutional = pt.sourceCategory === 'INSTITUTIONAL';

                      return (
                        <div 
                          key={pIdx}
                          className={`p-3 rounded-lg border flex flex-col justify-between ${
                            pt.isAbnormal
                              ? 'bg-amber-950/20 border-amber-800/60'
                              : 'bg-slate-900 border-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[11px] text-slate-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-500" />
                              {pt.date}
                            </span>
                            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-black/50 text-amber-300 border border-slate-700 font-bold">
                              {pt.citationLabel}
                            </span>
                          </div>

                          <div className="my-2 flex items-baseline justify-between">
                            <span className={`text-base font-bold font-mono ${
                              pt.isAbnormal ? 'text-amber-300' : 'text-slate-100'
                            }`}>
                              {pt.displayValue}
                            </span>
                            {pt.isAbnormal ? (
                              <span className="text-[10px] font-bold text-amber-400 bg-amber-950 px-1.5 py-0.5 rounded border border-amber-800">
                                Abnormal
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                                Normal
                              </span>
                            )}
                          </div>

                          <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                            <span className="truncate max-w-[130px]" title={pt.facilityName}>
                              {pt.facilityName}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {isInstitutional ? 'Tier 2 EHR' : 'Tier 4 Scan'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            Total of <strong className="text-teal-300">{trajectories.length}</strong> longitudinal trajectory dimensions analyzed across hospital admissions, lab tests, and uploaded scans.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Close Flowsheet
          </button>
        </div>
      </div>
    </div>
  );
};
