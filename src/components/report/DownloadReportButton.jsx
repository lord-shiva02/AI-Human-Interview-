import React, { useState } from 'react';
import { Download, FileCheck, RefreshCw, CheckCircle2 } from 'lucide-react';
import { reportService } from '../../services/reportService';

export const DownloadReportButton = ({ 
  interviewData, 
  variant = "primary", 
  size = "md",
  label = "DOWNLOAD REPORT (PDF)" 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownload = async () => {
    if (!interviewData || isGenerating) return;

    setIsGenerating(true);
    // Brief delay to showcase generation state
    await new Promise(r => setTimeout(r, 600));

    const ok = reportService.downloadInterviewReport(interviewData);
    setIsGenerating(false);

    if (ok) {
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }
  };

  const isPrimary = variant === "primary";

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating || !interviewData}
      className={`relative inline-flex items-center justify-center gap-2 rounded-2xl font-extrabold tracking-wide transition-all duration-200 shadow-xl disabled:opacity-50 ${
        size === "lg" ? 'px-7 py-3.5 text-sm' : size === "sm" ? 'px-3 py-1.5 text-xs' : 'px-5 py-2.5 text-xs'
      } ${
        isPrimary 
          ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 shadow-cyan-500/25 hover:scale-[1.02]' 
          : 'bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-200 hover:border-cyan-500/40 hover:text-white'
      }`}
      title="Download Official A4 Performance PDF"
    >
      {isGenerating ? (
        <>
          <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
          <span>Generating A4 PDF...</span>
        </>
      ) : downloadSuccess ? (
        <>
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Report Downloaded!</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};
