import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Play, 
  Camera, 
  Maximize2,
  LogOut
} from 'lucide-react';
import { FaceBoundary } from './FaceBoundary';
import { PROCTOR_STATUSES, PROCTOR_VIOLATION_MESSAGES } from '../../hooks/useProctoring';

/**
 * InterviewStopOverlay Component
 * 
 * Strict Exam Mode Lockdown:
 * Renders on a PLAIN and CLEAN dark background with ZERO unrelated content (no HR animation,
 * no questions, no scores, no charts).
 * Displays the exact proctor violation reason, live camera alignment feed with green boundary,
 * a 6-point security checklist, and the Resume Interview / Fullscreen actions.
 */
export const InterviewStopOverlay = ({
  proctoring,
  stream = null,
  videoRef: externalVideoRef = null,
  isCameraActive = true,
  candidateName = "Candidate",
  onResumeInterview
}) => {
  const navigate = useNavigate();
  const internalVideoRef = useRef(null);
  const videoRef = externalVideoRef || internalVideoRef;

  const proctorStatus = proctoring?.proctorStatus || PROCTOR_STATUSES.INTERVIEW_STOPPED;
  const violation = proctoring?.violationReason || PROCTOR_VIOLATION_MESSAGES[proctorStatus] || {
    title: "INTERVIEW STOPPED",
    subtitle: "A strict examination proctoring violation was detected.",
    action: "Please realign your face inside the green frame and maintain focus to continue."
  };

  const isOk = proctorStatus === PROCTOR_STATUSES.PROCTORING_OK;
  const faceCount = proctoring?.faceCount ?? 0;
  const faceInside = proctoring?.faceInsideBoundary ?? false;
  const canResume = proctoring?.canResume ?? false;
  const confidence = proctoring?.faceConfidence ?? 0;
  const isFullscreen = proctoring?.isFullscreen ?? true;
  const isWindowFocused = proctoring?.isWindowFocused ?? true;
  const isPageVisible = proctoring?.isPageVisible ?? true;

  // Synchronize stream with video element
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (stream && isCameraActive) {
      if (video.srcObject !== stream) {
        video.srcObject = stream;
      }
      video.play().catch(() => {});
    }
  }, [stream, isCameraActive, videoRef]);

  const handleResume = async () => {
    if (!isFullscreen && proctoring?.requestFullscreen) {
      await proctoring.requestFullscreen();
    }
    if (onResumeInterview) {
      onResumeInterview();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#060810] flex flex-col items-center justify-center p-4 sm:p-6 overflow-y-auto font-sans select-none animate-fadeIn">
      
      <div className="max-w-xl w-full space-y-6 text-center my-auto">
        
        {/* 1. Header Alert Banner */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/60 text-rose-300 text-xs font-mono font-bold tracking-wider animate-bounce shadow-xl shadow-rose-950/60">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>INTERVIEW STOPPED • PROCTOR VIOLATION</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
            {violation.title}
          </h1>

          <p className="text-sm sm:text-base text-rose-300 font-bold leading-relaxed">
            {violation.subtitle}
          </p>

          <p className="text-xs text-slate-300 max-w-md mx-auto">
            {violation.action}
          </p>
        </div>

        {/* 2. Live Camera Alignment Feed with Green Boundary */}
        <div className="relative mx-auto w-full max-w-sm aspect-[4/3] rounded-3xl overflow-hidden border-2 border-rose-500/70 bg-slate-950 shadow-2xl ring-2 ring-rose-500/30">
          
          {isCameraActive ? (
            <div className="relative w-full h-full bg-slate-950 flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100 z-0"
              />

              {/* Green Allowed Boundary and Live Detected Face Box */}
              <FaceBoundary
                boundaryBox={proctoring?.boundaryBox}
                faceBox={proctoring?.faceBox}
                isInside={faceInside}
                faceCount={faceCount}
                confidence={confidence}
                showLabels={true}
              />
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-400 p-4 space-y-2">
              <Camera className="w-8 h-8 text-rose-400" />
              <span className="text-xs font-bold text-rose-300">Camera Feed Off</span>
            </div>
          )}

          {/* Top Live Badge */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/85 backdrop-blur-md text-[10px] font-bold text-white border border-white/10 z-20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>LIVE RE-ALIGNMENT</span>
          </div>
        </div>

        {/* 3. 6-Point Real-time Strict Examination Security Checklist */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 space-y-2 text-xs text-left max-w-sm mx-auto backdrop-blur-md shadow-xl">
          
          {/* Check 1: Camera Active */}
          <div className="flex items-center justify-between">
            <span className="text-slate-400">1. Camera Feed Active:</span>
            <span className={`font-mono font-bold flex items-center gap-1 ${isCameraActive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isCameraActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
              {isCameraActive ? 'Active (Pass)' : 'Disabled'}
            </span>
          </div>

          {/* Check 2: Single Candidate */}
          <div className="flex items-center justify-between">
            <span className="text-slate-400">2. Exactly 1 Candidate Face:</span>
            <span className={`font-mono font-bold flex items-center gap-1 ${faceCount === 1 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {faceCount === 1 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
              {faceCount === 1 ? '1 Candidate (Pass)' : `${faceCount} Detected (Violation)`}
            </span>
          </div>

          {/* Check 3: Green Boundary Box */}
          <div className="flex items-center justify-between">
            <span className="text-slate-400">3. Inside Green Boundary:</span>
            <span className={`font-mono font-bold flex items-center gap-1 ${faceInside ? 'text-emerald-400' : 'text-rose-400'}`}>
              {faceInside ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
              {faceInside ? 'Inside Frame (Pass)' : 'Outside Frame (Violation)'}
            </span>
          </div>

          {/* Check 4: Fullscreen Mode */}
          <div className="flex items-center justify-between">
            <span className="text-slate-400">4. Fullscreen Mode:</span>
            <span className={`font-mono font-bold flex items-center gap-1 ${isFullscreen ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isFullscreen ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
              {isFullscreen ? 'Active (Pass)' : 'Exited (Violation)'}
            </span>
          </div>

          {/* Check 5: Page Visibility (Tab) */}
          <div className="flex items-center justify-between">
            <span className="text-slate-400">5. Page Visibility:</span>
            <span className={`font-mono font-bold flex items-center gap-1 ${isPageVisible ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isPageVisible ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
              {isPageVisible ? 'Visible (Pass)' : 'Tab Lost'}
            </span>
          </div>

          {/* Check 6: Window Focus */}
          <div className="flex items-center justify-between">
            <span className="text-slate-400">6. Window Focus:</span>
            <span className={`font-mono font-bold flex items-center gap-1 ${isWindowFocused ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isWindowFocused ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
              {isWindowFocused ? 'Focused (Pass)' : 'Window Blur'}
            </span>
          </div>
        </div>

        {/* 4. Action Controls: Resume Interview Gate & Fullscreen Re-entry */}
        <div className="space-y-3 max-w-sm mx-auto">
          {canResume ? (
            <button
              onClick={handleResume}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/30 transition-all duration-200 hover:scale-[1.02] cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Resume Interview</span>
            </button>
          ) : (
            <div className="space-y-2">
              {!isFullscreen && proctoring?.requestFullscreen && (
                <button
                  onClick={() => proctoring.requestFullscreen()}
                  className="w-full py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span>Enter Fullscreen Mode</span>
                </button>
              )}
              <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-semibold text-center">
                Please realign your face inside the green boundary to enable resumption.
              </div>
            </div>
          )}

          {/* Exit to Dashboard Link */}
          <div className="pt-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-xs text-slate-500 hover:text-slate-300 flex items-center justify-center gap-1 mx-auto transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cancel & Exit to Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewStopOverlay;
