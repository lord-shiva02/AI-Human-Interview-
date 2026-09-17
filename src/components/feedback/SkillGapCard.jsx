import React from 'react';
import { Target, TrendingUp, AlertCircle, ArrowUpRight, CheckCircle } from 'lucide-react';

export const SkillGapCard = ({ skillGaps = [] }) => {
  if (!skillGaps || skillGaps.length === 0) {
    return (
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 text-center text-slate-400 text-xs">
        <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
        <p className="font-bold text-white text-sm">No Significant Skill Gaps Detected</p>
        <p className="mt-1">Candidate met target competency benchmarks across all evaluated rubrics.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {skillGaps.map((gapItem, index) => (
        <div 
          key={index}
          className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-cyan-500/30 transition-all duration-200"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
            <div>
              <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider">
                COMPETENCY GAP #{index + 1}
              </span>
              <h4 className="text-sm font-bold text-white mt-0.5">{gapItem.skill}</h4>
            </div>

            {/* Score Comparison Badge */}
            <div className="flex items-center gap-3">
              <div className="text-left sm:text-right">
                <span className="text-[10px] text-slate-400 block">Current vs Target</span>
                <span className="text-xs font-mono font-bold text-amber-400">
                  {gapItem.currentScore}% <span className="text-slate-500">→</span> <span className="text-emerald-400">{gapItem.targetScore}%</span>
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-rose-500/15 text-rose-300 border border-rose-500/30 font-mono">
                +{gapItem.gap}% Gap
              </span>
            </div>
          </div>

          {/* Reason & Actionable Recommendation */}
          <div className="pt-3 space-y-2 text-xs">
            {gapItem.reason && (
              <p className="text-slate-400">
                <strong className="text-slate-300">Observation:</strong> {gapItem.reason}
              </p>
            )}
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 flex items-start gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span><strong className="text-white">Actionable Fix:</strong> {gapItem.recommendation}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
