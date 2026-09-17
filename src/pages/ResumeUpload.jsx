import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  FileText, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  RefreshCw, 
  Trash2, 
  Layers,
  AlertTriangle,
  Lock
} from 'lucide-react';
import { useResume } from '../hooks/useResume';
import { ResumeUploader } from '../components/resume/ResumeUploader';
import { ResumeAnalysis } from '../components/resume/ResumeAnalysis';

export const ResumeUpload = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hasResumeRequiredError = searchParams.get('error') === 'resume_required';

  const { 
    activeResume, 
    resumeUploaded, 
    isParsing, 
    selectResumePreset, 
    uploadResume, 
    clearResume 
  } = useResume();

  const [analyzingProgress, setAnalyzingProgress] = useState(false);

  const handlePreset = (key) => {
    selectResumePreset(key);
  };

  const handleUpload = async (file, customText) => {
    await uploadResume(file, customText);
  };

  const handleProceedToATS = () => {
    if (!resumeUploaded || !activeResume) return;

    setAnalyzingProgress(true);
    setTimeout(() => {
      setAnalyzingProgress(false);
      navigate('/interview/ats');
    }, 600);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fadeIn">
      
      {/* Route Guard Redirect Alert */}
      {hasResumeRequiredError && !resumeUploaded && (
        <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-3 animate-bounce">
          <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
          <span>
            <strong>Resume Required:</strong> Please upload your resume before continuing with the interview.
          </span>
        </div>
      )}

      {/* Step Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold font-mono">
          STEP 02 / 05 • RESUME GROUNDING INGESTION
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Upload Your Resume
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
          Please upload your resume to continue. Your resume is required for ATS validation and personalized interview questions.
        </p>
      </div>

      {/* Uploader Card / Dropzone */}
      <ResumeUploader 
        activeResume={activeResume}
        onSelectPreset={handlePreset}
        onUploadFile={handleUpload}
        onClearResume={clearResume}
        isUploading={isParsing}
      />

      {/* Active Extracted Metadata Preview (Only shown after resume is uploaded) */}
      {activeResume && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Extracted Resume Context & Metadata
            </h3>
            <button
              onClick={clearResume}
              className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
              title="Clear and reset resume context"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Resume</span>
            </button>
          </div>

          <ResumeAnalysis resume={activeResume} />
        </div>
      )}

      {/* Bottom Action Footer with Hard Gate Protection */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-xl">
        <div>
          <span className="text-xs font-bold text-white block">
            {resumeUploaded ? "Resume Attached & Ready for ATS Diagnostic" : "Resume Upload is Mandatory"}
          </span>
          <p className="text-xs text-slate-400 mt-0.5">
            {resumeUploaded ? (
              <>Active Profile: <strong className="text-cyan-300">{activeResume.name}</strong> ({activeResume.title || activeResume.degree})</>
            ) : (
              "Upload a PDF, DOC, or DOCX file to enable ATS analysis and continue."
            )}
          </p>
        </div>

        <button
          onClick={handleProceedToATS}
          disabled={!resumeUploaded || analyzingProgress || isParsing}
          className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-xl transition-all duration-200 ${
            resumeUploaded 
              ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 shadow-cyan-500/25 hover:scale-[1.02] cursor-pointer' 
              : 'bg-slate-800 text-slate-500 border border-white/5 cursor-not-allowed opacity-60'
          }`}
        >
          {analyzingProgress ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
              <span>Analyzing Resume & ATS...</span>
            </>
          ) : !resumeUploaded ? (
            <>
              <Lock className="w-4 h-4 text-slate-500" />
              <span>Analyze Resume (Upload Required)</span>
            </>
          ) : (
            <>
              <span>Analyze Resume & Continue</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
