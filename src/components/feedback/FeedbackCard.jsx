import React from 'react';
import { CheckCircle2, AlertTriangle, Lightbulb, MessageSquare, ChevronDown } from 'lucide-react';

export const FeedbackCard = ({ evaluation, index = 1 }) => {
  if (!evaluation) return null;

  const isSkipped = evaluation.isSkipped || evaluation.status === "Skipped";
  const score = evaluation.scores?.overall || 0;
  const isHigh = score >= 80;

  return (
    <div className={`p-5 sm:p-6 rounded-3xl border space-y-4 backdrop-blur-xl ${
      isSkipped 
        ? 'bg-slate-900/60 border-amber-500/20' 
        : 'bg-slate-900/80 border-white/10'
    }`}>
      
      {/* Top Question Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
              QUESTION {index} • {evaluation.category || "Evaluation"}
            </span>
            <span className={`px-2 py-0.2 rounded text-[9px] font-mono font-bold border ${
              isSkipped 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' 
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
            }`}>
              {isSkipped ? "SKIPPED" : "ANSWERED"}
            </span>
          </div>
          <p className="text-sm font-bold text-white mt-0.5">"{evaluation.questionText}"</p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border ${
            isSkipped
              ? 'bg-slate-800 text-amber-300 border-amber-500/30'
              : isHigh 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
          }`}>
            {isSkipped ? "Score: Not Attempted" : `Score: ${score}%`}
          </span>
        </div>
      </div>

      {/* Candidate Answer Transcript */}
      <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/5 text-xs text-slate-300">
        <span className="font-bold text-slate-400 block mb-1 text-[10px] uppercase">Candidate Response:</span>
        <p className="italic leading-relaxed">"{evaluation.answerText || 'Transcript unavailable'}"</p>
      </div>

      {/* 3-Part Evidence-Based Breakdown: Strength, Weakness, Actionable Suggestion */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        
        {/* Strength */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px] uppercase">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Strength Observed</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-snug">
            {evaluation.strength || "Clear grounding in resume project technologies."}
          </p>
        </div>

        {/* Weakness / Gap */}
        <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/20 space-y-1">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px] uppercase">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Improvement Area</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-snug">
            {evaluation.weakness || "Could include more concrete numerical benchmarks."}
          </p>
        </div>

        {/* How to Improve */}
        <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 space-y-1">
          <div className="flex items-center gap-1.5 text-indigo-300 font-bold text-[11px] uppercase">
            <Lightbulb className="w-3.5 h-3.5 text-indigo-400" />
            <span>Actionable Suggestion</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-snug">
            {evaluation.suggestion || "Use STAR framework to quantify engineering outcomes."}
          </p>
        </div>
      </div>
    </div>
  );
};
