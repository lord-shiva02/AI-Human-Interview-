import React from 'react';
import { HelpCircle, FileText, Sparkles, Tag, CheckCircle } from 'lucide-react';

export const QuestionCard = ({ 
  question, 
  questionNumber = 1, 
  totalQuestions = 5,
  track = "Fresher Track" 
}) => {
  if (!question) return null;

  return (
    <div className="relative rounded-3xl bg-slate-900/80 border border-white/10 p-5 sm:p-7 backdrop-blur-xl shadow-xl shadow-cyan-950/30 overflow-hidden">
      
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
            QUESTION {questionNumber} / {totalQuestions}
          </span>
          <span className="text-xs font-semibold text-slate-400">
            • {question.category || "Resume Deep Dive"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
            question.difficulty === 'Hard' 
              ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' 
              : question.difficulty === 'Moderate'
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
          }`}>
            {question.difficulty || "Standard"} Difficulty
          </span>
        </div>
      </div>

      {/* Grounded Resume Source Tag (Mandatory Proof of Resume Grounding) */}
      <div className="flex items-center gap-2 mb-3.5 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-white/5 text-[11px] text-cyan-300">
        <FileText className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
        <span className="font-semibold text-slate-400">Grounded Source:</span>
        <span className="font-medium text-slate-200 truncate">{question.resumeSource || `Extracted from uploaded resume`}</span>
      </div>

      {/* Main Question Text */}
      <div className="relative">
        <p className="text-base sm:text-xl font-bold text-white leading-relaxed tracking-tight">
          "{question.text}"
        </p>
      </div>

      {/* Target Focus Keywords */}
      {question.targetKeywords && question.targetKeywords.length > 0 && (
        <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
            <Tag className="w-3 h-3 text-slate-400" /> Focus Keywords:
          </span>
          {question.targetKeywords.slice(0, 4).map((kw, i) => (
            <span key={i} className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] font-medium text-slate-300 border border-white/5">
              {kw}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
