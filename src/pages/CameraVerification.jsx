import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  CameraOff, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RefreshCw, 
  UserCheck
} from 'lucide-react';
import { useResume } from '../hooks/useResume';
import { FaceBoundary } from '../components/proctor/FaceBoundary';
import { useInterviewSession, PROCTOR_STATUSES } from '../context/InterviewSessionContext';

/**
 * CameraVerification (Step 05 - Strict Camera & Face Gate)
 * 
 * Strict Gate Protocol:
 * 1. Request camera permission & open live candidate webcam stream (audio + video).
 * 2. Reuses the single interview MediaStream.
 * 3. Real-time candidate face check inside the green permitted boundary.
 * 4. Verification succeeds ONLY when:
 *    - cameraStreamActive === true
 *    - videoReady === true
 *    - videoWidth > 0 && videoHeight > 0
 *    - faceCount === 1
 *    - faceInsideBoundary === true
 *    - faceConfidence >= 80
 * 5. Navigates to /interview/session KEEPING the stream alive.
 */
export const CameraVerification = () => {
  const navigate = useNavigate();
  const { activeResume } = useResume();
  const {
    candidateStream,
    cameraStreamActive,
    cameraVerified,
    setCameraVerified,
    faceCount,
    faceDetected,
    faceInsideBoundary,
    faceConfidence,
    faceBox,
    boundaryBox,
    proctorStatus,
    startCameraSession,
    requestFullscreen,
    updateVideoHealth
  } = useInterviewSession();

  const videoRef = useRef(null);
  const [localVideoReady, setLocalVideoReady] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isRequestingCamera, setIsRequestingCamera] = useState(true);

  // 1. Initialize single candidate stream
  useEffect(() => {
    let isMounted = true;

    startCameraSession().then(() => {
      if (isMounted) {
        setIsRequestingCamera(false);
      }
    }).catch(() => {
      if (isMounted) {
        setIsRequestingCamera(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [startCameraSession]);

  // 2. Attach stream to video element & verify playback
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !candidateStream) return;

    let checkInterval = null;

    const handleVideoPlaying = () => {
      const w = video.videoWidth || 0;
      const h = video.videoHeight || 0;
      setDimensions({ width: w, height: h });
      if (w > 0 && h > 0 && video.readyState >= 2) {
        setLocalVideoReady(true);
        updateVideoHealth(w, h, true);
      }
    };

    if (video.srcObject !== candidateStream) {
      video.srcObject = candidateStream;
    }

    video.play().then(handleVideoPlaying).catch((e) => {
      console.log("Verification camera play error:", e);
    });

    video.addEventListener('loadedmetadata', handleVideoPlaying);
    video.addEventListener('playing', handleVideoPlaying);
    video.addEventListener('resize', handleVideoPlaying);

    // Fallback polling for dimensions in case loadedmetadata already fired
    checkInterval = setInterval(() => {
      if (video.videoWidth > 0 && video.videoHeight > 0 && video.readyState >= 2) {
        setDimensions({ width: video.videoWidth, height: video.videoHeight });
        setLocalVideoReady(true);
        updateVideoHealth(video.videoWidth, video.videoHeight, true);
        clearInterval(checkInterval);
      }
    }, 200);

    return () => {
      video.removeEventListener('loadedmetadata', handleVideoPlaying);
      video.removeEventListener('playing', handleVideoPlaying);
      video.removeEventListener('resize', handleVideoPlaying);
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [candidateStream, updateVideoHealth]);

  // Strict verification criteria
  const isVideoDimensionValid = dimensions.width > 0 && dimensions.height > 0;
  const isStreamFunctional = Boolean(
    candidateStream && 
    candidateStream.getVideoTracks()?.some(t => t.readyState === 'live' && t.enabled)
  );

  const canStartInterview = (
    !isRequestingCamera &&
    cameraStreamActive &&
    isStreamFunctional &&
    localVideoReady &&
    isVideoDimensionValid &&
    faceCount === 1 &&
    faceDetected &&
    faceInsideBoundary &&
    faceConfidence >= 80 &&
    proctorStatus === PROCTOR_STATUSES.PROCTORING_OK
  );

  // Dynamic Status Badge & Subtitle
  let statusBadge = "CHECKING CAMERA...";
  let statusTitle = "Positioning Your Face...";
  let statusMessage = "Initializing real-time face detection inside the permitted green boundary...";

  if (isRequestingCamera) {
    statusBadge = "STARTING CAMERA...";
    statusTitle = "Requesting Live Camera Access...";
    statusMessage = "Please allow browser webcam and microphone access when prompted.";
  } else if (!cameraStreamActive || !isStreamFunctional) {
    statusBadge = "CAMERA OFFLINE";
    statusTitle = "Live Camera Required";
    statusMessage = "Your live camera feed must be visible and transmitting frames to proceed.";
  } else if (!localVideoReady || !isVideoDimensionValid) {
    statusBadge = "CONNECTING FEED...";
    statusTitle = "Establishing Video Stream...";
    statusMessage = "Awaiting live camera video frames from your device...";
  } else if (faceCount === 0) {
    statusBadge = "FACE NOT DETECTED";
    statusTitle = "No Candidate Face Detected";
    statusMessage = "Please position your face directly inside the green permitted rectangle.";
  } else if (faceCount > 1) {
    statusBadge = "MULTIPLE FACES DETECTED";
    statusTitle = "Multiple Faces Detected";
    statusMessage = "Only one candidate is permitted in the camera frame.";
  } else if (!faceInsideBoundary) {
    statusBadge = "OUTSIDE PERMITTED ZONE";
    statusTitle = "Face Outside Green Boundary";
    statusMessage = "Please center your face completely inside the green permitted box.";
  } else if (canStartInterview) {
    statusBadge = "✓ ALL CHECKS PASSED";
    statusTitle = "✓ Candidate Camera Verified";
    statusMessage = "Live camera feed active, candidate face verified and aligned inside permitted zone.";
  }

  const handleStartHRInterview = async () => {
    if (!canStartInterview) return;

    // Mark camera as officially verified in shared context
    setCameraVerified(true);

    // Request fullscreen for proctored mode
    if (requestFullscreen) {
      await requestFullscreen();
    }

    // Navigate to active interview keeping candidateStream alive
    navigate('/interview/session');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold font-mono">
          STEP 05 / 05 • CAMERA-FIRST PROCTORING GATE
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Live Camera & Face Check
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
          Position your face inside the green permitted box. The AI HR Interview will unlock automatically once verification succeeds.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Live Camera Video Stream & Green Face Boundary */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-3 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl backdrop-blur-xl">
            
            <div className={`relative w-full aspect-[4/3] rounded-2xl overflow-hidden border bg-slate-950 transition-all duration-300 ${
              canStartInterview
                ? 'border-emerald-500/50 ring-2 ring-emerald-500/30'
                : 'border-rose-500/60 ring-2 ring-rose-500/30'
            }`}>
              {cameraStreamActive ? (
                <div className="relative w-full h-full bg-slate-950 flex items-center justify-center">
                  
                  {/* Live HTML5 Video element */}
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform -scale-x-100 z-0"
                  />

                  {/* Connecting indicator if stream not ready yet */}
                  {(!localVideoReady || !isVideoDimensionValid) && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 text-center p-4 space-y-3 z-10">
                      <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
                      <span className="text-xs font-bold text-slate-200">Connecting Live Camera...</span>
                      <p className="text-[11px] text-slate-400 max-w-xs">
                        Establishing camera connection and loading video frames...
                      </p>
                    </div>
                  )}

                  {/* Green Permitted Face Zone & Face Bounding Reticle */}
                  {localVideoReady && (
                    <FaceBoundary
                      boundaryBox={boundaryBox}
                      faceBox={faceBox}
                      isInside={faceInsideBoundary}
                      faceCount={faceCount}
                      confidence={faceConfidence}
                      showLabels={true}
                    />
                  )}
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-400 p-6 space-y-3">
                  <CameraOff className="w-12 h-12 text-rose-400" />
                  <span className="text-sm font-bold text-rose-300">Live Camera Feed Inactive</span>
                  <p className="text-xs text-slate-400 text-center max-w-sm">
                    Camera access is required for proctored interviews. Please enable camera permissions to proceed.
                  </p>
                  <button
                    onClick={startCameraSession}
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-black text-xs hover:bg-cyan-400 transition-all cursor-pointer shadow-lg shadow-cyan-500/25"
                  >
                    Enable Camera Access
                  </button>
                </div>
              )}

              {/* Top Security Indicators */}
              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-20">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/85 backdrop-blur-md text-[10px] font-bold text-white border border-white/10">
                  <span className={`w-1.5 h-1.5 rounded-full ${cameraStreamActive && localVideoReady ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></span>
                  <span>{cameraStreamActive && localVideoReady ? 'LIVE' : 'CONNECTING'}</span>
                </div>

                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md text-[10px] font-mono font-bold border ${
                  canStartInterview
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                    : 'bg-rose-950/85 text-rose-300 border-rose-500/60'
                }`}>
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{canStartInterview ? 'VERIFIED' : 'PROCTOR ON'}</span>
                </div>
              </div>

              {/* Bottom Tag */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 z-20">
                <div className="truncate">
                  <p className="text-xs font-bold text-white leading-none">{activeResume?.name || "Candidate"}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">Green Box: Permitted Face Zone</p>
                </div>

                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  faceInsideBoundary && faceCount === 1 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  FACE: {localVideoReady ? `${faceConfidence}%` : '--'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Gate Diagnostics & Locked Start Action */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className={`p-6 rounded-3xl border backdrop-blur-xl shadow-2xl space-y-4 transition-all ${
            canStartInterview 
              ? 'bg-emerald-950/30 border-emerald-500/40 shadow-emerald-950/30' 
              : 'bg-rose-950/30 border-rose-500/40 shadow-rose-950/30'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                canStartInterview 
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                  : isRequestingCamera
                    ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                    : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
              }`}>
                {canStartInterview ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : isRequestingCamera ? (
                  <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
                ) : (
                  <AlertTriangle className="w-6 h-6" />
                )}
              </div>

              <div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-extrabold uppercase border ${
                  canStartInterview 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                }`}>
                  {statusBadge}
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">
                  {statusTitle}
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {statusMessage}
            </p>

            {/* Strict Gate 4-Point Checklist */}
            <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
              
              <div className="flex items-center justify-between">
                <span className="text-slate-400">1. Live Camera Stream:</span>
                <span className={`font-mono font-bold flex items-center gap-1 ${cameraStreamActive && localVideoReady ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {cameraStreamActive && localVideoReady ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {cameraStreamActive && localVideoReady ? `Active (${dimensions.width}x${dimensions.height})` : 'Offline / Loading'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">2. Exactly 1 Candidate Face:</span>
                <span className={`font-mono font-bold flex items-center gap-1 ${faceCount === 1 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {faceCount === 1 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {faceCount === 1 ? '1 Face (Pass)' : `${faceCount} Detected`}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">3. Inside Permitted Zone:</span>
                <span className={`font-mono font-bold flex items-center gap-1 ${faceInsideBoundary ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {faceInsideBoundary ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {faceInsideBoundary ? 'Inside Green Zone (Pass)' : 'Outside Frame'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">4. Face Detection Quality:</span>
                <span className={`font-mono font-bold flex items-center gap-1 ${faceConfidence >= 80 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {faceConfidence >= 80 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {faceConfidence}% Confidence
                </span>
              </div>
            </div>
          </div>

          {/* Action Button Gate */}
          <div className="space-y-3">
            {canStartInterview ? (
              <button
                type="button"
                onClick={handleStartHRInterview}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 shadow-2xl shadow-emerald-500/30 transition-all duration-200 hover:scale-[1.02] cursor-pointer"
              >
                <span>START HR INTERVIEW</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <div className="space-y-2">
                <button
                  type="button"
                  disabled={true}
                  className="w-full py-4 rounded-2xl bg-slate-800 border border-white/10 text-slate-500 font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 cursor-not-allowed opacity-60"
                >
                  <span>LOCKED — COMPLETE CAMERA CHECK</span>
                </button>
                <p className="text-[11px] text-center text-rose-300 font-semibold">
                  Align your face inside the green rectangle above to unlock the interview.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraVerification;
