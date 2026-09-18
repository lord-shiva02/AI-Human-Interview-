import React, { useEffect, useRef, useState } from 'react';
import { 
  Camera, 
  CameraOff, 
  Mic, 
  MicOff, 
  ShieldCheck, 
  ShieldAlert, 
  RefreshCw, 
  Settings,
  UserCheck,
  AlertTriangle
} from 'lucide-react';
import { FaceBoundary } from './FaceBoundary';
import { useInterviewSession, PROCTOR_STATUSES } from '../../context/InterviewSessionContext';

/**
 * ProctorCamera Component
 * 
 * Renders the candidate's REAL LIVE camera view:
 * 1. Base Layer: Real live MediaStream HTML5 video (no black box, no fake camera)
 * 2. Middle Layer: Green permitted face boundary zone and detection reticle
 * 3. Top Layer: LIVE and PROCTOR ON badges
 * 4. Bottom Layer: Candidate name, FACE: XX% status, device toggles
 * 
 * Strict Anti-Black Camera Protocol:
 * - If stream exists, immediately sets srcObject and calls play()
 * - If video is initializing frames, shows a short "Connecting Live Camera..." state
 * - Never renders a permanent black box or placeholder over an active feed
 */
export const ProctorCamera = ({
  stream: propStream = null,
  videoRef: externalVideoRef = null,
  isCameraActive: propCameraActive = null,
  isMicActive: propMicActive = null,
  candidateName = "Candidate",
  proctoring: propProctoring = null,
  floating = true,
  onToggleMic: propToggleMic = null,
  onToggleCamera: propToggleCamera = null,
  showSimControls = false
}) => {
  // Access shared interview session context as default fallback
  let sessionContext = null;
  try {
    sessionContext = useInterviewSession();
  } catch (e) {}

  const stream = propStream || sessionContext?.candidateStream || null;
  const isCameraActive = propCameraActive !== null 
    ? propCameraActive 
    : (sessionContext?.cameraStreamActive ?? true);
  const isMicActive = propMicActive !== null 
    ? propMicActive 
    : (sessionContext?.isMicActive ?? true);
  const proctoring = propProctoring || sessionContext;
  const onToggleCamera = propToggleCamera || sessionContext?.toggleCamera;
  const onToggleMic = propToggleMic || sessionContext?.toggleMic;

  const internalVideoRef = useRef(null);
  const videoRef = externalVideoRef || internalVideoRef;

  const [isVideoReady, setIsVideoReady] = useState(false);
  const [videoDimensions, setVideoDimensions] = useState({ width: 0, height: 0 });
  const [showSimMenu, setShowSimMenu] = useState(false);

  // Synchronize candidateStream with the video element
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let pollInterval = null;

    if (stream && isCameraActive) {
      if (video.srcObject !== stream) {
        video.srcObject = stream;
      }

      const handleReady = () => {
        const w = video.videoWidth || 0;
        const h = video.videoHeight || 0;
        setVideoDimensions({ width: w, height: h });
        if (w > 0 && h > 0 && video.readyState >= 2) {
          setIsVideoReady(true);
        }
      };

      video.play().then(handleReady).catch((err) => {
        console.log("Candidate camera playback note:", err);
      });

      video.addEventListener('loadedmetadata', handleReady);
      video.addEventListener('playing', handleReady);
      video.addEventListener('canplay', handleReady);

      // Check readyState in polling loop to catch fast start
      pollInterval = setInterval(() => {
        if (video.videoWidth > 0 && video.videoHeight > 0 && video.readyState >= 2) {
          setVideoDimensions({ width: video.videoWidth, height: video.videoHeight });
          setIsVideoReady(true);
          clearInterval(pollInterval);
        }
      }, 150);

      return () => {
        video.removeEventListener('loadedmetadata', handleReady);
        video.removeEventListener('playing', handleReady);
        video.removeEventListener('canplay', handleReady);
        if (pollInterval) clearInterval(pollInterval);
      };
    } else {
      setIsVideoReady(false);
      setVideoDimensions({ width: 0, height: 0 });
    }
  }, [stream, isCameraActive, videoRef]);

  const proctorStatus = proctoring?.proctorStatus || PROCTOR_STATUSES.PROCTORING_OK;
  const isOk = proctorStatus === PROCTOR_STATUSES.PROCTORING_OK;
  const faceInside = proctoring?.faceInsideBoundary ?? true;
  const faceCount = proctoring?.faceCount ?? 1;
  const confidence = proctoring?.faceConfidence ?? 94;
  const boundaryBox = proctoring?.boundaryBox;
  const faceBox = proctoring?.faceBox;

  const hasLiveVideoTrack = Boolean(
    stream && 
    stream.getVideoTracks() && 
    stream.getVideoTracks().length > 0 && 
    stream.getVideoTracks()[0].readyState === 'live' &&
    stream.getVideoTracks()[0].enabled
  );

  return (
    <div className={`relative rounded-3xl overflow-hidden border bg-[#060913] shadow-2xl transition-all duration-300 select-none ${
      floating 
        ? 'w-60 sm:w-72 aspect-[4/3] ring-1' 
        : 'w-full aspect-video ring-1'
    } ${
      isOk 
        ? 'border-emerald-500/40 ring-emerald-500/30 shadow-emerald-950/40' 
        : 'border-rose-500/70 ring-rose-500/50 shadow-rose-950/60'
    }`}>
      
      {/* 1. Base Layer: Real Live Candidate HTML5 Video (Background Layer) */}
      {isCameraActive ? (
        <div className="relative w-full h-full bg-[#060913] flex items-center justify-center overflow-hidden">
          
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover transform -scale-x-100 z-0"
          />

          {/* Short Loading state while connecting (Requirement 6: "Connecting Live Camera...") */}
          {(!isVideoReady || !hasLiveVideoTrack) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 text-center p-3 space-y-2 z-0">
              <RefreshCw className="w-7 h-7 text-cyan-400 animate-spin" />
              <span className="text-xs font-bold text-slate-200">Connecting Live Camera...</span>
              <span className="text-[10px] text-slate-400">Loading candidate camera stream</span>
            </div>
          )}

          {/* 2. Middle Layer: Green Permitted Face Zone & Face Bounding Reticle (Overlay z-10) */}
          {isVideoReady && (
            <FaceBoundary
              boundaryBox={boundaryBox}
              faceBox={faceBox}
              isInside={faceInside}
              faceCount={faceCount}
              confidence={confidence}
              showLabels={true}
            />
          )}
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-400 p-4 space-y-1">
          <CameraOff className="w-8 h-8 text-rose-400 mb-1" />
          <span className="text-[11px] font-bold text-rose-300">Camera Feed Inactive</span>
          <span className="text-[9px] text-slate-500">Camera permission is disabled</span>
        </div>
      )}

      {/* 3. Top Layer: Live & Proctor Status Badges (z-20) */}
      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-20">
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/85 backdrop-blur-md text-[10px] font-bold text-white border border-white/10 shadow-lg">
          <span className={`w-1.5 h-1.5 rounded-full ${isCameraActive && isVideoReady ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></span>
          <span>{isCameraActive && isVideoReady ? 'LIVE' : 'CONNECTING'}</span>
        </div>

        <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full backdrop-blur-md text-[9px] font-mono font-bold border shadow-lg ${
          isOk 
            ? 'bg-emerald-950/85 text-emerald-300 border-emerald-500/40' 
            : 'bg-rose-950/90 text-rose-200 border-rose-500/70'
        }`}>
          {isOk ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> : <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />}
          <span>{isOk ? 'PROCTOR ON' : 'STOPPED'}</span>
        </div>
      </div>

      {/* 4. Bottom Layer: Candidate Name & Device Controls (z-20) */}
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10 z-20">
        <div className="truncate pr-2">
          <p className="text-[11px] font-bold text-white truncate leading-none">{candidateName}</p>
          <p className={`text-[9px] font-mono font-medium leading-none mt-1 ${isOk ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isOk ? `FACE: ${confidence}%` : 'PROCTOR STOP'}
          </p>
        </div>

        <div className="flex items-center gap-1">
          {/* Optional Diagnostic Menu Trigger */}
          {showSimControls && sessionContext?.setTestScenario && (
            <button
              onClick={() => setShowSimMenu(!showSimMenu)}
              className="p-1 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-white/10 transition-colors cursor-pointer"
              title="Proctoring test scenarios"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          )}

          {onToggleCamera && (
            <button
              onClick={onToggleCamera}
              className={`p-1 rounded-lg transition-colors cursor-pointer ${isCameraActive ? 'text-slate-300 hover:bg-white/10' : 'text-rose-400 bg-rose-500/20'}`}
              title={isCameraActive ? "Pause Camera" : "Resume Camera"}
            >
              {isCameraActive ? <Camera className="w-3.5 h-3.5" /> : <CameraOff className="w-3.5 h-3.5" />}
            </button>
          )}

          {onToggleMic && (
            <button
              onClick={onToggleMic}
              className={`p-1 rounded-lg transition-colors cursor-pointer ${isMicActive ? 'text-emerald-400 hover:bg-white/10' : 'text-rose-400 bg-rose-500/20'}`}
              title={isMicActive ? "Mute Microphone" : "Unmute Microphone"}
            >
              {isMicActive ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* 5. Diagnostic / Test Scenarios Popover (if triggered) */}
      {showSimMenu && sessionContext?.setTestScenario && (
        <div className="absolute inset-x-2 bottom-12 p-3 bg-slate-950/95 border border-white/20 rounded-2xl backdrop-blur-xl shadow-2xl z-30 space-y-2 text-xs">
          <div className="flex items-center justify-between border-b border-white/10 pb-1">
            <span className="font-bold text-cyan-300 text-[10px] font-mono">PROCTOR DIAGNOSTIC TEST</span>
            <button 
              onClick={() => setShowSimMenu(false)}
              className="text-[10px] text-slate-400 hover:text-white"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => { sessionContext.setTestScenario("OK"); setShowSimMenu(false); }}
              className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold hover:bg-emerald-500/30 text-left cursor-pointer"
            >
              ✓ OK (Center Face)
            </button>
            <button
              onClick={() => { sessionContext.setTestScenario("OUTSIDE_BOUNDARY"); setShowSimMenu(false); }}
              className="px-2 py-1 rounded bg-amber-500/20 text-amber-300 text-[10px] font-semibold hover:bg-amber-500/30 text-left cursor-pointer"
            >
              ⚠ Leave Green Zone
            </button>
            <button
              onClick={() => { sessionContext.setTestScenario("MULTIPLE"); setShowSimMenu(false); }}
              className="px-2 py-1 rounded bg-rose-500/20 text-rose-300 text-[10px] font-semibold hover:bg-rose-500/30 text-left cursor-pointer"
            >
              ⚠ Multiple Faces
            </button>
            <button
              onClick={() => { sessionContext.setTestScenario("NO_FACE"); setShowSimMenu(false); }}
              className="px-2 py-1 rounded bg-rose-500/20 text-rose-300 text-[10px] font-semibold hover:bg-rose-500/30 text-left cursor-pointer"
            >
              ⚠ No Face
            </button>
            <button
              onClick={() => { sessionContext.setTestScenario("OFF"); setShowSimMenu(false); }}
              className="px-2 py-1 rounded bg-rose-500/20 text-rose-300 text-[10px] font-semibold hover:bg-rose-500/30 text-left cursor-pointer col-span-2"
            >
              ⚠ Camera Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProctorCamera;
