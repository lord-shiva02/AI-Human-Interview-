import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, 
  Video, 
  Mic, 
  ShieldCheck, 
  BrainCircuit, 
  CheckCircle2, 
  ArrowRight, 
  HelpCircle,
  FileSpreadsheet,
  Cpu,
  Eye,
  Sun,
  ListChecks
} from 'lucide-react';
import { mockInterviewService } from '../services/mockInterviewService';
import { useResume } from '../hooks/useResume';

export const InterviewInstructions = () => {
  const navigate = useNavigate();
  const { activeResume } = useResume();
  const track = mockInterviewService.getActiveTrack();
  const isFresher = track === 'fresher';

  const instructionsList = [
    { text: "Keep your camera ON.", icon: Video },
    { text: "Make sure your face is clearly visible.", icon: Eye },
    { text: "Sit in a well-lit environment.", icon: Sun },
    { text: "Look toward the AI HR interviewer.", icon: ShieldCheck },
    { text: "Use your microphone to answer.", icon: Mic },
    { text: "Answer one question at a time.", icon: CheckCircle2 },
    { text: "Questions will be based only on your uploaded resume.", icon: BrainCircuit }
  ];

  const [checklist, setChecklist] = useState({
    cameraReady: true,
    quietRoom: true,
    microphoneWorking: true,
    resumeReviewed: true
  });

  const allChecked = Object.values(checklist).every(Boolean);

  const toggleCheck = (key) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn">
      
      {/* Step Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold font-mono">
          STEP 04 / 05 • SESSION PROTOCOL & GUIDELINES
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Before You Begin
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
          Please review the session ground rules carefully before entering the proctored AI HR studio.
        </p>
      </div>

      {/* Selected Session Metadata Header Card */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 flex flex-wrap items-center justify-between gap-4 backdrop-blur-xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              {isFresher ? "Fresher Track Simulation" : "Real-Time Experience Track Simulation"}
            </h3>
            <p className="text-xs text-slate-400">
              Candidate Profile: <strong className="text-cyan-300">{activeResume?.name}</strong> • 5 Dynamic Resume-Grounded Questions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
            isFresher 
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
              : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
          }`}>
            Difficulty: {isFresher ? "Simple (Resume-Grounded)" : "Hard (Scenario-Grounded)"}
          </span>
        </div>
      </div>

      {/* CORE INSTRUCTIONS LIST ("Before You Begin") */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-white/10 space-y-4 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center gap-2 text-white font-bold text-sm sm:text-base pb-2 border-b border-white/10">
          <ListChecks className="w-5 h-5 text-cyan-400" />
          <span>Session Guidelines & Instructions</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-200">
          {instructionsList.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-white/5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="font-medium text-slate-200">{item.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mandatory Readiness Checklist */}
      <div className="p-6 rounded-3xl bg-slate-900/70 border border-white/10 space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Pre-Session Readiness Verification
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {[
            { key: "cameraReady", label: "Webcam is positioned at eye-level with clear room lighting" },
            { key: "microphoneWorking", label: "Microphone is connected and authorized in browser" },
            { key: "quietRoom", label: "Quiet environment free from background conversations" },
            { key: "resumeReviewed", label: "Familiar with all projects and tech stacks listed in resume" }
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => toggleCheck(item.key)}
              className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                checklist[item.key] 
                  ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-200' 
                  : 'bg-slate-950/60 border-white/10 text-slate-400'
              }`}
            >
              <div className={`w-4 h-4 rounded-md border flex items-center justify-center mt-0.5 ${
                checklist[item.key] ? 'bg-cyan-400 border-cyan-400 text-slate-950' : 'border-white/20'
              }`}>
                {checklist[item.key] && <CheckCircle2 className="w-3.5 h-3.5" />}
              </div>
              <span className="font-medium leading-tight">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Proceed Button */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-400 text-center sm:text-left">
          Next step: Live Webcam Face Detection & Proctor Verification
        </p>

        <button
          onClick={() => navigate('/interview/verification')}
          disabled={!allChecked}
          className="w-full sm:w-auto px-9 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 transition-all duration-200 hover:scale-[1.02] disabled:opacity-40"
        >
          <span>Start Camera Verification</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
