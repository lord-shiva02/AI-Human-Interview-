import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, Mic, MicOff, ShieldCheck, ShieldAlert, UserCheck, Settings, RefreshCw } from 'lucide-react';
import { FaceBoundary } from './FaceBoundary';
import { PROCTOR_STATUSES } from '../../hooks/useProctoring';

/**
 * ProctorCamera Component
 * 
 * Renders the candidate's LIVE camera view with:
 * 1. Live video stream (underneath the overlay layers)
 * 2. Green permitted face boundary zone
 * 3. Real-time face detection reticle & status badges
 * 4. Anti-black screen verification (ensures video stream plays immediately)
 */
export const ProctorCamera = ({
  stream = null,
  videoRef: externalVideoRef = null,
  isCameraActive = true,
  isMicActive = true,
  candidateName = "Candidate",
  proctoring = null,
  floating = true,
  onToggleMic,
  onToggleCamera,
  showSimControls = true
}) => {
  const internalVideoRef = useRef(null);
  const videoRef = externalVideoRef || internalVideoRef;
  const [showSimMenu, setShowSimMenu] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);

  const hasLiveVideoTrack = Boolean(
    stream && 
    stream.getVideoTracks() && 
    stream.getVideoTracks().length > 0 && 
    stream.getVideoTracks()[0].readyState === 'live' &&
    stream.getVideoTracks()[0].enabled
  );

  // Synchronize stream with HTML5 video element directly
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (stream && isCameraActive) {
      if (video.srcObject !== stream) {
        video.srcObject = stream;
      }

      const handleLoadedMetadata = () => {
        setIsVideoReady(true);
        video.play().catch(err => console.log("Webcam play notification:", err));
      };

      const handlePlaying = () => {
        setIsVideoReady(true);
      };

      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('playing', handlePlaying);

      // Attempt immediate play
      video.play().then(() => {
        setIsVideoReady(true);
      }).catch(() => {});

      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('playing', handlePlaying);
      };
    } else {
      setIsVideoReady(false);
    }
  }, [stream, isCameraActive, videoRef]);

  const proctorStatus = proctoring?.proctorStatus || PROCTOR_STATUSES.PROCTORING_OK;
  const isOk = proctorStatus === PROCTOR_STATUSES.PROCTORING_OK;
  const faceInside = proctoring?.faceInsideBoundary ?? true;
  const faceCount = proctoring?.faceCount ?? 1;
  const confidence = proctoring?.faceConfidence ?? 100;

  return (
    <div className={`relative rounded-3xl overflow-hidden border bg-[#060913] shadow-2xl transition-all duration-300 select-none ${
      floating 
        ? 'w-56 sm:w-72 aspect-[4/3] ring-1' 
        : 'w-full aspect-video ring-1'
    } ${
      isOk 
        ? 'border-emerald-500/40 ring-emerald-500/30 shadow-emerald-950/40' 
        : 'border-rose-500/70 ring-rose-500/50 shadow-rose-950/60 animate-pulse'
    }`}>
      
      {/* 1. Base Layer: Real Live Camera HTML5 Video */}
      {isCameraActive ? (
        <div className="relative w-full h-full bg-[#060913] flex items-center justify-center overflow-hidden">
          
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover transform -scale-x-100 z-0"
          />

          {/* Fallback silhouette if webcam hardware is in preview or connecting */}
          {!hasLiveVideoTrack && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 text-center p-3 space-y-2 z-0">
              <div className={`w-12 h-12 rounded-full border-2 border-dashed flex items-center justify-center ${
                isOk ? 'border-cyan-400 text-cyan-400' : 'border-rose-400 text-rose-400'
              }`}>
                <UserCheck className="w-6 h-6" />
              </div>
              <span className="text-[10px] text-slate-300 font-medium">Candidate Stream Active</span>
            </div>
          )}

          {/* 2. Middle Layer: Green Face Boundary Box & Detection Reticle (Overlay z-10) */}
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
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-400 p-4">
          <CameraOff className="w-8 h-8 text-rose-400 mb-1" />
          <span className="text-[11px] font-bold text-rose-300">Camera Feed Inactive</span>
        </div>
      )}

      {/* 3. Top Layer: Live & Proctor Status Badges (z-20) */}
      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-20">
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-bold text-white border border-white/10 shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>LIVE</span>
        </div>

        <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full backdrop-blur-md text-[9px] font-mono font-bold border shadow-lg ${
          isOk 
            ? 'bg-emerald-950/85 text-emerald-300 border-emerald-500/40' 
            : 'bg-rose-950/90 text-rose-200 border-rose-500/70 animate-bounce'
        }`}>
          {isOk ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> : <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />}
          <span>{isOk ? 'PROCTOR ON' : 'VIOLATION'}</span>
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
          {onToggleCamera && (
            <button
              onClick={onToggleCamera}
              className={`p-1 rounded-lg transition-colors cursor-pointer ${isCameraActive ? 'text-slate-300 hover:bg-white/10' : 'text-rose-400 bg-rose-500/20'}`}
              title={isCameraActive ? "Pause Camera" : "Start Camera"}
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
    </div>
  );
};

export default ProctorCamera;
