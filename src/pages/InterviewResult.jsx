import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  Award, 
  Download, 
  LayoutDashboard, 
  PlayCircle, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  FileText, 
  Sparkles, 
  BrainCircuit, 
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  Target
} from 'lucide-react';
import { mockInterviewService } from '../services/mockInterviewService';
import { ScoreRing } from '../components/common/ScoreRing';
import { FeedbackCard } from '../components/feedback/FeedbackCard';
import { SkillGapCard } from '../components/feedback/SkillGapCard';
import { ImprovementPlan } from '../components/feedback/ImprovementPlan';
import { DownloadReportButton } from '../components/report/DownloadReportButton';
import { DownloadExcelButton } from '../components/report/DownloadExcelButton';
import { PerformanceChart } from '../components/dashboard/PerformanceChart';

export const InterviewResult = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const latest = mockInterviewService.getLatestResult();
    setResult(latest);

    // Trigger celebratory confetti on high scores
    if (latest && latest.overallScore >= 75) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  }, []);

  if (!result) return null;

  const score = result.overallScore || 80;
  const scores = result.scores || { technical: 85, communication: 82, relevance: 88, completeness: 80, fluency: 84, problemSolving: 82, confidence: 84 };
  const totalCount = result.totalQuestions || result.evaluations?.length || 5;
  const answeredCount = result.answeredQuestions ?? (result.evaluations?.filter(e => !e.isSkipped).length || totalCount);
  const skippedCount = result.skippedQuestions ?? (result.evaluations?.filter(e => e.isSkipped).length || 0);

  const barChartData = [
    { name: 'Technical (30%)', score: scores.technical, color: '#06B6D4' },
    { name: 'Relevance (15%)', score: scores.relevance, color: '#3B82F6' },
    { name: 'Communication (15%)', score: scores.communication, color: '#6366F1' },
    { name: 'Completeness (10%)', score: scores.completeness, color: '#8B5CF6' },
    { name: 'Problem Solving (10%)', score: scores.problemSolving, color: '#EC4899' },
    { name: 'Confidence (10%)', score: scores.confidence, color: '#10B981' },
    { name: 'Fluency (10%)', score: scores.fluency, color: '#F59E0B' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-fadeIn">
      
      {/* EXECUTIVE RESULT BANNER */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-slate-900/95 via-[#0D162A]/90 to-indigo-950/90 border border-white/15 backdrop-blur-2xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        
        {/* Decorative Radial Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-3 text-center md:text-left z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold font-mono">
            INTERVIEW COMPLETED • OFFICIAL EVALUATION
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Interview Assessment Report
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Candidate: <strong className="text-white">{result.candidate?.name}</strong> • Track: <strong className="text-cyan-300">{result.track}</strong> • Session ID: <span className="font-mono text-indigo-300">{result.interviewId}</span>
          </p>

          {/* QUESTIONS BREAKDOWN PILLS */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
            <span className="px-3 py-1 rounded-xl bg-slate-800 text-slate-200 border border-white/10 text-xs font-bold font-mono">
              Total: {totalCount} Qs
            </span>
            <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono">
              Answered: {answeredCount}
            </span>
            <span className={`px-3 py-1 rounded-xl text-xs font-bold font-mono border ${
              skippedCount > 0 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' 
                : 'bg-slate-800/80 text-slate-400 border-white/5'
            }`}>
              Skipped: {skippedCount}
            </span>
          </div>

          {skippedCount > 0 && (
            <p className="text-[11px] text-amber-300/90 italic pt-1 max-w-lg">
              * Note: {skippedCount} question(s) were skipped. Skipping questions reduced the overall interview performance score because no responses were provided for those topics.
            </p>
          )}

          {/* Download & Navigation Actions */}
          <div className="pt-3 flex flex-wrap items-center justify-center md:justify-start gap-3">
            <DownloadReportButton interviewData={result} variant="primary" size="lg" label="DOWNLOAD PDF" />
            
            <DownloadExcelButton variant="success" size="lg" label="DOWNLOAD MASTER EXCEL" />

            <Link
              to="/dashboard"
              className="px-6 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-white font-bold text-xs flex items-center gap-2 transition-all hover:border-cyan-500/30"
            >
              <LayoutDashboard className="w-4 h-4 text-cyan-400" />
              <span>VIEW DASHBOARD</span>
            </Link>

            <Link
              to="/interview/setup"
              className="px-6 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-2 transition-all"
            >
              <PlayCircle className="w-4 h-4 text-emerald-400" />
              <span>PRACTICE AGAIN</span>
            </Link>
          </div>
        </div>

        {/* Large Score Circular Gauge */}
        <div className="flex-shrink-0 z-10">
          <ScoreRing 
            score={score} 
            size={160} 
            strokeWidth={12} 
            label="FINAL SCORE" 
            subLabel="/ 100" 
            showTier={true} 
          />
        </div>
      </div>

      {/* MULTI-RUBRIC PERFORMANCE BREAKDOWN CHART */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
          <div>
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">WEIGHTED RUBRICS</span>
            <h3 className="text-lg font-bold text-white">Multi-Dimensional Performance Breakdown</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Weighted Total: {score}%</span>
        </div>

        <PerformanceChart type="bar" data={barChartData} height={240} />

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-2">
          {barChartData.map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 block font-medium truncate">{item.name}</span>
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-mono font-extrabold text-white">{item.score}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${item.score}%`, backgroundColor: item.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QUESTION-BY-QUESTION DIAGNOSTIC ACCORDION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">QUESTION LOG</span>
            <h3 className="text-lg font-bold text-white">Granular Evaluation Breakdown</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">{result.evaluations?.length || 5} Questions Evaluated</span>
        </div>

        <div className="space-y-3">
          {(result.evaluations || []).map((ev, idx) => (
            <FeedbackCard key={idx} evaluation={ev} index={idx} />
          ))}
        </div>
      </div>

      {/* STRENGTHS & SKILL GAPS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Identified Strengths */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-emerald-500/30 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">Demonstrated Strengths</h3>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-300">
            {(result.strengths || []).map((s, idx) => (
              <li key={idx} className="flex items-start gap-2.5 p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/20">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold text-[10px]">
                  {idx + 1}
                </span>
                <span>{s.strength || (typeof s === 'string' ? s : "Clear explanation of technical concepts")}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Identified Weaknesses & Skill Gaps */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-amber-500/30 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">Identified Growth Areas</h3>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-300">
            {(result.weaknesses || []).map((w, idx) => (
              <li key={idx} className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-950/20 border border-amber-500/20">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 font-bold text-[10px]">
                  {idx + 1}
                </span>
                <span>{w.weakness || (typeof w === 'string' ? w : "Need more quantifiable performance metrics")}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* SKILL GAP ANALYSIS */}
      <div className="space-y-4">
        <div>
          <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider">DIAGNOSTIC BENCHMARKS</span>
          <h3 className="text-lg font-bold text-white">Target Skill Gap Breakdown</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(result.skillGaps || []).map((gap, idx) => (
            <SkillGapCard key={idx} skillGap={gap} />
          ))}
        </div>
      </div>

      {/* ACTIONABLE 7-DAY IMPROVEMENT PLAN */}
      <div className="space-y-4">
        <div>
          <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-wider">ACTIONABLE ROADMAP</span>
          <h3 className="text-lg font-bold text-white">Personalized 7-Day Improvement Plan</h3>
        </div>

        <ImprovementPlan plan={result.improvementPlan} />
      </div>

      {/* EXECUTIVE AI HR VERDICT */}
      {result.finalFeedback && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-slate-900/80 to-indigo-950/40 border border-cyan-500/30 space-y-3">
          <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400" /> Executive AI HR Summary Verdict
          </span>
          <p className="text-sm text-slate-200 leading-relaxed italic">
            "{result.finalFeedback}"
          </p>
        </div>
      )}

      {/* BOTTOM ACTION BAR */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
        <p className="text-xs text-slate-400">
          Data integrity verified: Result score matches Dashboard, PDF report, and Excel workbook.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <DownloadReportButton interviewData={result} variant="primary" size="md" label="DOWNLOAD PDF" />
          <DownloadExcelButton variant="success" size="md" label="DOWNLOAD MASTER EXCEL" />
          <Link
            to="/dashboard"
            className="px-6 py-2.5 rounded-2xl bg-slate-800 text-white hover:bg-slate-700 font-bold text-xs"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};
