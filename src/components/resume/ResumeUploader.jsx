import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle, 
  FileCheck2, 
  Layers, 
  ArrowRight,
  RefreshCw,
  FileCode,
  Calendar,
  CheckCircle,
  X
} from 'lucide-react';
import { SAMPLE_RESUMES } from '../../data/mockResume';

export const ResumeUploader = ({ 
  activeResume, 
  onSelectPreset, 
  onUploadFile, 
  onClearResume,
  isUploading = false 
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelected = (file) => {
    const validExtensions = ['pdf', 'doc', 'docx'];
    const ext = file.name.split('.').pop().toLowerCase();
    
    if (!validExtensions.includes(ext)) {
      alert("Please upload a supported file format: PDF, DOC, or DOCX");
      return;
    }

    setSelectedFileName(file.name);
    onUploadFile(file);
  };

  const presetOptions = [
    {
      key: "fresher_dev",
      name: "Alex Chen",
      role: "Fresher Software Engineer",
      details: "React, Python, AI Interview Assistant, B.S. CS 2026",
      atsScore: 88,
      status: "PASS"
    },
    {
      key: "experienced_lead",
      name: "Sarah Jenkins",
      role: "Senior Full Stack Tech Lead (4+ Yrs)",
      details: "TypeScript, Go, Microservices, Team Lead, M.S. SE 2021",
      atsScore: 94,
      status: "PASS"
    },
    {
      key: "data_analyst_fresher",
      name: "Rohan Verma",
      role: "Data Analyst & ML Specialist",
      details: "Python, SQL, Tableau, Churn ML Pipeline 2025",
      atsScore: 82,
      status: "PASS"
    },
    {
      key: "failing_ats_sample",
      name: "Jordan Sparks (Test ATS Gate FAIL)",
      role: "Unstructured / Incompatible Resume",
      details: "Missing metrics, bad layout, triggers mandatory ATS gate",
      atsScore: 48,
      status: "FAIL"
    }
  ];

  const hasActiveResume = Boolean(activeResume && activeResume.name);

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* SUCCESS BANNER IF RESUME IS UPLOADED */}
      {hasActiveResume ? (
        <div className="p-6 rounded-3xl bg-emerald-950/40 border border-emerald-500/40 backdrop-blur-xl shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shadow-lg shadow-emerald-500/10 flex-shrink-0">
                <FileCheck2 className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ✓ Resume Uploaded Successfully
                  </span>
                  <span className="text-xs text-slate-400 font-mono hidden sm:inline">Active Grounding Source</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white mt-1">
                  {activeResume.resumeName || activeResume.fileName || `${activeResume.name}_Resume.pdf`}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Candidate: <strong className="text-white">{activeResume.name}</strong> • {activeResume.degree || activeResume.college}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Upload className="w-3.5 h-3.5 text-cyan-400" />
                <span>Replace Resume</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* PROFESSIONAL EMPTY STATE DROPZONE */
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 ${
            dragActive 
              ? 'border-cyan-400 bg-cyan-500/10 scale-[1.01]' 
              : 'border-white/15 bg-slate-900/60 hover:border-cyan-500/40 hover:bg-slate-800/40'
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
              {isUploading ? (
                <RefreshCw className="w-8 h-8 animate-spin" />
              ) : (
                <FileText className="w-8 h-8" />
              )}
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-black text-white">
                {isUploading ? "Parsing Resume Metadata..." : "Upload Your Resume"}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Upload your latest resume to continue. We will first check whether your resume is ATS-friendly before starting your personalized interview.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 text-xs font-black tracking-wider uppercase shadow-lg shadow-cyan-500/25">
              <Upload className="w-3.5 h-3.5" />
              <span>Choose Resume</span>
            </div>

            <p className="text-xs text-slate-400 font-mono">
              Supported formats: <strong className="text-cyan-300">PDF, DOC, DOCX</strong>
            </p>

            <p className="text-[11px] text-slate-500 max-w-md">
              🔒 Mandatory Requirement: AI questions and ATS compatibility will be generated strictly from your uploaded resume.
            </p>
          </div>
        </div>
      )}

      {/* Hidden Real File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])}
        className="hidden"
      />

      {/* Preset Resumes Picker for Instant Assessment */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Or Choose a Verified Resume Profile (Demo Sandbox)
            </h4>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">Upload or pick a sample</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {presetOptions.map((preset) => {
            const isSelected = activeResume?.id === (SAMPLE_RESUMES[preset.key]?.id || preset.key);
            const isFail = preset.status === "FAIL";

            return (
              <button
                key={preset.key}
                type="button"
                onClick={() => onSelectPreset(preset.key)}
                className={`p-4 rounded-2xl text-left border transition-all duration-200 flex flex-col justify-between ${
                  isSelected 
                    ? 'bg-cyan-500/15 border-cyan-400 ring-1 ring-cyan-400/50 shadow-lg shadow-cyan-500/10' 
                    : isFail
                      ? 'bg-rose-500/5 border-rose-500/20 hover:border-rose-500/40 hover:bg-rose-500/10'
                      : 'bg-slate-900/60 border-white/10 hover:border-white/20 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-bold text-sm text-white flex items-center gap-2">
                      {preset.name}
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                    </span>
                    <p className="text-xs font-semibold text-cyan-300 mt-0.5">{preset.role}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    isFail 
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' 
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  }`}>
                    ATS: {preset.atsScore}% ({preset.status})
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 mt-2 font-mono line-clamp-1">
                  {preset.details}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
