import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../hooks/useResume';
import { ATSResult } from '../components/resume/ATSResult';
import { ShieldCheck, FileCheck2, AlertTriangle, ArrowRight } from 'lucide-react';

export const ATSValidation = () => {
  const navigate = useNavigate();
  const { activeResume, atsResult, clearResume } = useResume();

  if (!activeResume || !atsResult) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6 animate-fadeIn">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white">Resume Required</h2>
          <p className="text-sm text-slate-300">
            Please upload your resume before continuing with the ATS analysis.
          </p>
        </div>
        <button
          onClick={() => navigate('/interview/resume')}
          className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2"
        >
          <span>Upload Resume</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const handleContinue = () => {
    if (atsResult.passed) {
      navigate('/interview/instructions');
    }
  };

  const handleReupload = () => {
    clearResume();
    navigate('/interview/resume');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fadeIn">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold font-mono">
          STEP 03 / 05 • MANDATORY ATS VALIDATION GATE
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          ATS Compatibility Diagnostic
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
          Scanning resume formatting, keyword density, section taxonomy, and quantifiable impact metrics against enterprise recruiting filters.
        </p>
      </div>

      {/* Main Result & Gate Component */}
      <ATSResult 
        atsResult={atsResult}
        onContinue={handleContinue}
        onReupload={handleReupload}
      />
    </div>
  );
};
