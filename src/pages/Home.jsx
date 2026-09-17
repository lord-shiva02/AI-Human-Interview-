import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bot, 
  PlayCircle, 
  LayoutDashboard, 
  ShieldCheck, 
  FileCheck2, 
  Sparkles, 
  BrainCircuit, 
  Video, 
  Mic, 
  FileSpreadsheet, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight,
  UserCheck,
  Zap,
  Target
} from 'lucide-react';
import { HRAvatar } from '../components/interview/HRAvatar';
import { HR_STATES } from '../hooks/useAIInterviewer';

export const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FileCheck2,
      title: "ATS Resume Validation",
      desc: "Mandatory 70% ATS compatibility gate analyzing keywords, structure, readability, and project metrics."
    },
    {
      icon: BrainCircuit,
      title: "Resume-Based Questions",
      desc: "Zero generic questions. Every question and technical deep-dive is strictly grounded in your uploaded resume."
    },
    {
      icon: Bot,
      title: "Dynamic AI HR Interview",
      desc: "Lifelike animated HR interviewer conducting adaptive conversations with speaking, listening, and thinking states."
    },
    {
      icon: UserCheck,
      title: "Face Verification Gate",
      desc: "Live webcam proctor verification ensuring single candidate presence and alignment before session begins."
    },
    {
      icon: Mic,
      title: "Voice Speech Interaction",
      desc: "Natural speech-to-text transcription and text-to-speech audio with animated lip-sync visemes."
    },
    {
      icon: TrendingUp,
      title: "Multi-Rubric Evaluation",
      desc: "Weighted scoring on technical knowledge (30%), relevance (15%), communication (15%), and problem solving (10%)."
    },
    {
      icon: Target,
      title: "Skill Gap Analysis",
      desc: "Precise current vs target score deltas with evidence-based diagnostics and actionable remediation."
    },
    {
      icon: FileSpreadsheet,
      title: "Downloadable PDF Reports",
      desc: "Executive multi-page A4 PDF assessment report with charts, question logs, and 7-day practice plans."
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden pt-6 pb-20">
      
      {/* Background Decorative Halos */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-cyan-500/15 via-indigo-500/10 to-purple-500/15 blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        
        {/* HERO SECTION */}
        <section className="text-center space-y-8 pt-6 sm:pt-12">
          
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold shadow-lg shadow-cyan-500/10 animate-pulse-slow">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Next-Gen Resume Grounded AI HR Simulation</span>
          </div>

          {/* Main Title & Tagline */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
              Practice Smarter. <br />
              <span className="gradient-text-cyan">Interview Better.</span> <br />
              Build Confidence.
            </h1>

            <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              An intelligent resume-based mock interview platform that conducts personalized AI interviews, analyzes candidate performance, and provides evidence-based improvement guidance.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/interview/setup"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-sm tracking-wide flex items-center justify-center gap-2.5 shadow-xl shadow-cyan-500/25 transition-all duration-200 hover:scale-[1.03] group"
            >
              <PlayCircle className="w-5 h-5 text-slate-950 group-hover:scale-110 transition-transform" />
              <span>START INTERVIEW</span>
            </Link>

            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2.5 hover:border-cyan-500/40 transition-all duration-200"
            >
              <LayoutDashboard className="w-4 h-4 text-cyan-400" />
              <span>VIEW DASHBOARD</span>
            </Link>
          </div>

          {/* HERO VISUAL MOCKUP */}
          <div className="relative max-w-5xl mx-auto mt-12 rounded-3xl p-2 sm:p-4 bg-gradient-to-b from-white/10 via-white/5 to-transparent border border-white/15 backdrop-blur-2xl shadow-2xl">
            
            {/* Mock Interview Studio Container */}
            <div className="relative rounded-2xl bg-[#090E1A] p-4 sm:p-6 border border-white/10 overflow-hidden">
              
              {/* Studio Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-xs font-bold text-slate-300 ml-2">Live AI HR Interview Session #4</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    RESUME GROUNDED
                  </span>
                  <span className="text-xs text-slate-400 font-mono">03:45</span>
                </div>
              </div>

              {/* Grid: AI HR Avatar + Floating Candidate Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                
                {/* AI HR Avatar */}
                <div className="lg:col-span-2">
                  <HRAvatar 
                    questionId="home_preview_intro"
                    hrState={HR_STATES.SPEAKING} 
                    isBlinking={false} 
                    mouthOpen={0.6}
                    compact={false}
                  />
                </div>

                {/* Candidate Camera Preview & Question Widget */}
                <div className="space-y-4">
                  {/* Candidate Feed Mockup */}
                  <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-slate-950 aspect-[4/3] flex items-center justify-center">
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80" 
                      alt="Candidate Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[9px] font-mono text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>FACE VERIFIED</span>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded bg-black/70 text-[10px] font-bold text-white flex items-center justify-between">
                      <span>Alex Chen (You)</span>
                      <Mic className="w-3 h-3 text-emerald-400" />
                    </div>
                  </div>

                  {/* Real-time Question Card */}
                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30 text-left">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold block mb-1">
                      CURRENT QUESTION (FROM RESUME):
                    </span>
                    <p className="text-xs font-semibold text-slate-100 line-clamp-3">
                      "Can you explain the state management architecture used in your AI Interview Assistant project?"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* COMPLETE APPLICATION JOURNEY (SECTION 2 FLOW) */}
        <section className="space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">End-to-End Workflow</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              The Complete Realistic AI Interview Journey
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl mx-auto">
              From resume parsing and ATS validation to live face verification, adaptive follow-ups, and executive report downloads.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { step: "01", title: "Track & Resume Upload", desc: "Select Fresher or Real-Time Experience track and upload your PDF/DOCX resume." },
              { step: "02", title: "Mandatory ATS Gate", desc: "Must score ≥70% on ATS formatting & keywords before proceeding." },
              { step: "03", title: "Face Verification", desc: "Single candidate webcam presence verified with live proctor bounds." },
              { step: "04", title: "Dynamic AI Interview", desc: "AI HR speaks resume-grounded questions, listens to your answers, and adapts follow-ups." },
              { step: "05", title: "Voice & Speech Analysis", desc: "Transcribes voice answers and evaluates technical depth, clarity, and relevance." },
              { step: "06", title: "Adaptive Follow-Ups", desc: "Next questions adapt based on candidate performance without fixed scripts." },
              { step: "07", title: "Skill Gap & Diagnostics", desc: "Identifies current vs target score gaps and 7-day personalized roadmaps." },
              { step: "08", title: "Download PDF Report", desc: "Generate professional A4 PDF assessment report with synchronized dashboard metrics." }
            ].map((item, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-cyan-500/40 transition-all duration-200 flex flex-col justify-between space-y-3"
              >
                <div>
                  <span className="text-2xl font-black font-mono text-cyan-400/80">{item.step}</span>
                  <h4 className="text-sm font-bold text-white mt-1">{item.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Platform Capabilities</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Engineered Like a Real Enterprise SaaS
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl mx-auto">
              Everything you need to master your technical interviews with realistic pressure and feedback.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 hover:border-cyan-500/40 hover:bg-slate-800/40 transition-all duration-300 group space-y-3"
                >
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* FINAL CALL TO ACTION */}
        <section className="p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-cyan-950/60 via-slate-900/90 to-indigo-950/60 border border-cyan-500/30 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none"></div>
          
          <h2 className="text-3xl sm:text-5xl font-black text-white max-w-2xl mx-auto">
            Ready to Ace Your Next Technical Interview?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Upload your resume, pass the ATS gate, and experience an adaptive, real-time AI HR simulation.
          </p>

          <div className="pt-2">
            <Link
              to="/interview/setup"
              className="inline-flex items-center gap-2 px-9 py-4 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-cyan-400/25 transition-all duration-200 hover:scale-105"
            >
              <span>LAUNCH AI INTERVIEW NOW</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};
