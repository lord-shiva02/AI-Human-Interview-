import React, { useState } from 'react';
import { FileSpreadsheet, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { excelReportService } from '../../services/excelReportService';

export const DownloadExcelButton = ({ 
  variant = "success", 
  size = "md",
  label = "DOWNLOAD MASTER EXCEL",
  disabled = false
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadError, setDownloadError] = useState(false);

  const handleDownload = async () => {
    if (isGenerating || disabled) return;

    setIsGenerating(true);
    setDownloadError(false);

    // Brief delay to display responsive loading feedback
    await new Promise(r => setTimeout(r, 400));

    try {
      const ok = excelReportService.downloadMasterExcel();
      setIsGenerating(false);

      if (ok) {
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3000);
      } else {
        setDownloadError(true);
        setTimeout(() => setDownloadError(false), 4000);
      }
    } catch (err) {
      console.error("Master Excel download caught:", err);
      setIsGenerating(false);
      setDownloadError(true);
      setTimeout(() => setDownloadError(false), 4000);
    }
  };

  const isSuccessVariant = variant === "success";
  const isPrimary = variant === "primary";

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating || disabled}
      className={`relative inline-flex items-center justify-center gap-2 rounded-2xl font-extrabold tracking-wide transition-all duration-200 shadow-xl disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
        size === "lg" ? 'px-7 py-3.5 text-sm' : size === "sm" ? 'px-3 py-1.5 text-xs' : 'px-5 py-2.5 text-xs'
      } ${
        isSuccessVariant
          ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 shadow-emerald-500/25 hover:scale-[1.02]'
          : isPrimary
            ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 shadow-cyan-500/25 hover:scale-[1.02]'
            : 'bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-emerald-300 hover:border-emerald-500/40 hover:text-emerald-200'
      }`}
      title="Download AI_Interview_Master_Data.xlsx containing all accumulated interview records"
    >
      {isGenerating ? (
        <>
          <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
          <span>Generating Master Excel...</span>
        </>
      ) : downloadSuccess ? (
        <>
          <CheckCircle2 className="w-4 h-4 text-emerald-950" />
          <span>Master Excel Downloaded!</span>
        </>
      ) : downloadError ? (
        <>
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <span>Export Failed</span>
        </>
      ) : (
        <>
          <FileSpreadsheet className="w-4 h-4" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};

export default DownloadExcelButton;
