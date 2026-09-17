import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Briefcase, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck,
  Zap,
  Target
} from 'lucide-react';
import { mockInterviewService } from '../services/mockInterviewService';

export const TrackSelection = () => {
  const navigate = useNavigate();

  const handleSelectTrack = (track) => {
    mockInterviewService.setActiveTrack(track);

    // Update currentInterview session
    try {
      const raw = localStorage.getItem("currentInterview");
      const current = raw ? JSON.parse(raw) : {};
      const updated = {
        ...current,
        track,
        difficulty: track === 'fresher' ? 'Simple' : 'Hard'
      };
      localStorage.setItem("currentInterview", JSON.stringify(updated));
    } catch (e) {
      console.error("Error updating track in currentInterview", e);
    }

    navigate('/interview/resume');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold font-mono">
          STEP 01 / 05 • TRACK SPECIFICATION
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Select Your Interview Track
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
          Choose the difficulty mode tailored to your career phase. All questions are dynamically generated from your uploaded resume.
        </p>
      </div>

      {/* Two Large Professional Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* CARD 1: FRESHER TRACK */}
        <div 
          onClick={() => handleSelectTrack('fresher')}
          className="group relative p-8 sm:p-10 rounded-3xl bg-slate-900/80 border border-white/10 hover:border-cyan-400/80 hover:bg-slate-800/80 backdrop-blur-2xl shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-8 hover:scale-[1.02] hover:shadow-cyan-500/10"
        >
          {/* Top Badge & Icon */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <GraduationCap className="w-8 h-8" />
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-mono font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                DIFFICULTY: SIMPLE
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white group-hover:text-cyan-300 transition-colors">
                FRESHER INTERVIEW TRACK
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                "Beginner-friendly interview using only your resume information."
              </p>
            </div>

            {/* Checklist */}
            <div className="space-y-2.5 pt-4 border-t border-white/10 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Focuses on projects, college coursework, and fundamental skills</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Step-by-step conceptual walkthroughs with helpful clarifications</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Ideal for new college graduates, interns, and junior engineers</span>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-6 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400 group-hover:underline flex items-center gap-1">
              Select Fresher Track
            </span>
            <div className="w-10 h-10 rounded-xl bg-cyan-500 text-slate-950 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* CARD 2: REAL-TIME EXPERIENCE TRACK */}
        <div 
          onClick={() => handleSelectTrack('experience')}
          className="group relative p-8 sm:p-10 rounded-3xl bg-slate-900/80 border border-white/10 hover:border-purple-400/80 hover:bg-slate-800/80 backdrop-blur-2xl shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-8 hover:scale-[1.02] hover:shadow-purple-500/10"
        >
          {/* Top Badge & Icon */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Briefcase className="w-8 h-8" />
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-mono font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                DIFFICULTY: HARD
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white group-hover:text-purple-300 transition-colors">
                REAL-TIME EXPERIENCE TRACK
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                "Professional HR-style interview with challenging resume-based questions."
              </p>
            </div>

            {/* Checklist */}
            <div className="space-y-2.5 pt-4 border-t border-white/10 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span>Deep dive on system architecture, trade-offs, and microservices</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span>Team leadership, incident management, and high-throughput scaling</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span>Ideal for experienced developers, tech leads, and senior candidates</span>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-6 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs font-bold text-purple-400 group-hover:underline flex items-center gap-1">
              Select Real-Time Track
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-500 text-slate-950 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
