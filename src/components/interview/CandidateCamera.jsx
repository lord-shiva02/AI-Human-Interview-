import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, Mic, MicOff, ShieldCheck, UserCheck } from 'lucide-react';

/**
 * CandidateCamera Component
 * 
 * Used across standard camera previews to guarantee live hardware/simulated webcam rendering.
 */
export const CandidateCamera = ({
  stream = null,
  videoRef: externalVideoRef = null,
  isCameraActive = true,
  isMicActive = true,
  candidateName = "Candidate",
  detectionState = null,
  floating = true,
  onToggleMic,
  onToggleCamera
}) => {
  const internalVideoRef = useRef(null);
  const videoRef = externalVideoRef || internalVideoRef;
  const [isVideoReady, setIsVideoReady] = useState(false);

  const isFaceVerified = detectionState?.passed ?? true;
  const hasLiveVideoTrack = Boolean(
    stream && 
    stream.getVideoTracks() && 
    stream.getVideoTracks().length > 0 && 
    stream.getVideoTracks()[0].readyState === 'live' &&
    stream.getVideoTracks()[0].enabled
  );

  // Synchronize stream with video element
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (stream && isCameraActive) {
      if (video.srcObject !== stream) {
        video.srcObject = stream;
      }
      video.play().then(() => setIsVideoReady(true)).catch(() => {});
    } else {
      setIsVideoReady(false);
    }
  }, [stream, isCameraActive, videoRef]);

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-white/15 bg-slate-950 shadow-2xl transition-all duration-300 ${
      floating 
        ? 'w-48 sm:w-64 aspect-[4/3] ring-1 ring-cyan-500/30' 
        : 'w-full aspect-video ring-1 ring-white/10'
    }`}>
      
      {/* Video stream feed */}
      {isCameraActive ? (
        <div className="relative w-full h-full bg-slate-950 flex items-center justify-center">
          
          {/* Live HTML5 Video element */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover transform -scale-x-100 z-0"
          />

          {/* Fallback silhouette only when physical webcam stream is unavailable */}
          {!hasLiveVideoTrack && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 text-center p-3 space-y-2 z-0">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-cyan-400/60 flex items-center justify-center text-cyan-400">
                <UserCheck className="w-6 h-6" />
              </div>
              <span className="text-[10px] text-slate-300 font-medium">Candidate Feed Active</span>
            </div>
          )}

          {/* Green Face Bounding Box Overlay */}
          {isFaceVerified && (
            <div className="absolute top-[18%] left-[24%] w-[52%] h-[64%] border-2 border-dashed border-emerald-400/80 rounded-xl pointer-events-none animate-pulse z-10">
              <span className="absolute -top-3 left-1 text-[8px] font-bold bg-emerald-500 text-slate-950 px-1 py-0.2 rounded font-mono uppercase tracking-wider">
                FACE: 100%
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900/90 text-slate-400 p-4">
          <CameraOff className="w-7 h-7 text-rose-400 mb-1" />
          <span className="text-[11px] font-semibold text-rose-300">Camera Paused</span>
        </div>
      )}

      {/* Top Overlay: Security & Status */}
      <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-20">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-bold text-white border border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>LIVE</span>
        </div>

        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md text-[9px] font-mono text-cyan-300 border border-cyan-500/30">
          <ShieldCheck className="w-3 h-3 text-cyan-400" />
          <span>PROCTOR ON</span>
        </div>
      </div>

      {/* Bottom Overlay: Candidate Name & Device Controls */}
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-black/80 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10 z-20">
        <div className="truncate pr-2">
          <p className="text-[11px] font-bold text-white truncate leading-none">{candidateName}</p>
          <p className="text-[9px] text-slate-400 leading-none mt-0.5">Candidate View</p>
        </div>

        <div className="flex items-center gap-1.5">
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

export default CandidateCamera;
