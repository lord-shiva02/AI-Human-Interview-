import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ArrowRight, 
  RotateCcw, 
  ShieldCheck, 
  FileCheck2, 
  AlertOctagon,
  Sparkles,
  BarChart3,
  ListOrdered,
  FileText
} from 'lucide-react';
import { ScoreRing } from '../common/ScoreRing';

export const ATSResult = ({ atsResult, onContinue, onReupload }) => {
  const isPassed = atsResult.passed;
  const score = atsResult.overallScore || 0;
  const breakdown = atsResult.breakdown || {};

  const improvementPoints = atsResult.improvements || [
    "Use standard section headings such as Education, Skills, Projects and Experience.",
    "Use a simple and consistent layout.",
    "Avoid unnecessary graphics, tables and text boxes.",
    "Use clear and readable fonts.",
    "Make sure important skills and technologies are clearly mentioned.",
    "Maintain consistent spacing and formatting.",
    "Make sure all important information can be extracted as normal text."
  ];

  const detectedIssues = atsResult.issues?.length > 0 ? atsResult.issues : [
    "Resume structure needs improvement.",
    "Section headings are not clearly defined.",
    "Formatting may not be ATS-readable.",
    "Important keywords may be missing.",
    "Excessive graphics or design elements may affect ATS parsing."
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Primary Banner Header */}
      <div className={`p-6 sm:p-8 rounded-3xl border backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl ${
        isPassed 
          ? 'bg-emerald-950/40 border-emerald-500/30 shadow-emerald-950/20' 
          : 'bg-rose-950/40 border-rose-500/30 shadow-rose-950/20'
      }`}>
        <div className="flex items-center gap-5">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border shadow-lg ${
            isPassed 
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-emerald-500/20' 
              : 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-rose-500/20'
          }`}>
            {isPassed ? <CheckCircle2 className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-md text-xs font-mono font-extrabold uppercase border ${
                isPassed 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
              }`}>
                {isPassed ? "✓ ATS FRIENDLY RESUME" : "✕ RESUME NOT ATS FRIENDLY"}
              </span>
              <span className="text-xs text-slate-400 font-mono">Passing Threshold: 70%</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
              {isPassed ? "✓ ATS FRIENDLY RESUME" : "Your resume is not ATS-friendly."}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              {isPassed 
                ? "Your resume has passed the ATS compatibility check. You can continue to the personalized interview." 
                : "Please improve your resume before starting the interview. The interview process is stopped until compatibility issues are resolved."}
            </p>
          </div>
        </div>

        {/* Circular Score Ring */}
        <div className="flex-shrink-0">
          <ScoreRing 
            score={score} 
            size={110} 
            strokeWidth={9} 
            label="ATS Score" 
            subLabel="/ 100" 
            showTier={false} 
          />
        </div>
      </div>

      {/* Breakdown Metrics Grid */}
      <div className="rounded-3xl bg-slate-900/70 border border-white/10 p-6 backdrop-blur-xl">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-cyan-400" />
          ATS Diagnostic Compatibility Breakdown
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { label: "Resume Structure", score: breakdown.structure || (isPassed ? 94 : 52) },
            { label: "Readability", score: breakdown.readability || (isPassed ? 92 : 58) },
            { label: "Keyword Compatibility", score: breakdown.keywordMatch || (isPassed ? 90 : 45) },
            { label: "Formatting", score: breakdown.formatting || (isPassed ? 90 : 50) },
            { label: "Skills", score: breakdown.skillsDensity || (isPassed ? 92 : 48) },
            { label: "Education", score: breakdown.educationRelevance || (isPassed ? 95 : 62) },
            { label: "Experience", score: breakdown.experienceImpact || (isPassed ? 90 : 46) }
          ].map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 text-center">
              <span className="text-[10px] font-semibold text-slate-400 block truncate">{item.label}</span>
              <span className={`text-lg font-black mt-1 block ${item.score >= 70 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {item.score}%
              </span>
              <div className="w-full bg-white/5 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${item.score >= 70 ? 'bg-emerald-400' : 'bg-rose-500'}`} 
                  style={{ width: `${item.score}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAIL SCREEN WITH EXACT IMPROVEMENT INSTRUCTIONS */}
      {!isPassed ? (
        <div className="space-y-6">
          
          {/* Issues Detected */}
          <div className="p-6 rounded-3xl bg-rose-950/25 border border-rose-500/30 space-y-3">
            <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
              <AlertOctagon className="w-4 h-4 text-rose-400" />
              <span>Issues Detected (ATS Compatibility Score: {score}%):</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs text-slate-300">
              {detectedIssues.map((issue, idx) => (
                <div key={idx} className="flex items-start gap-2 p-3 rounded-xl bg-slate-900/70 border border-white/5">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{issue}</span>
                </div>
              ))}
            </div>
          </div>

          {/* How to Improve Your Resume Guide */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <ListOrdered className="w-5 h-5 text-cyan-400" />
              <span>How to Improve Your Resume</span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              {improvementPoints.map((point, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-white/5">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-mono font-bold text-[11px] flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span className="pt-0.5 leading-relaxed">{point}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-rose-300">
                🔒 Process stopped: Camera Verification and Interview Session are locked until a passing resume (≥70%) is uploaded.
              </p>
              <button
                onClick={onReupload}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-rose-500/25 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Upload Improved Resume</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* PASS SCREEN */
        <div className="p-6 sm:p-8 rounded-3xl bg-emerald-950/30 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-emerald-950/20">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>✓ ATS FRIENDLY RESUME</span>
            </div>
            <div className="text-base sm:text-lg font-black text-white font-mono">
              ATS Compatibility Score: {score}%
            </div>
            <p className="text-xs sm:text-sm text-slate-200">
              "Your resume meets the minimum ATS compatibility requirement."
            </p>
          </div>

          <button
            onClick={onContinue}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 transition-all duration-200 hover:scale-105 whitespace-nowrap cursor-pointer"
          >
            <span>CONTINUE TO INTERVIEW</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
