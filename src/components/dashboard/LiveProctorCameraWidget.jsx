import React, { useEffect, useState } from 'react';
import { Camera, CameraOff, Mic, MicOff, ShieldCheck, ShieldAlert, Sparkles, RefreshCw, UserCheck } from 'lucide-react';
import { useCamera } from '../../hooks/useCamera';
import { useProctoring, PROCTOR_STATUSES } from '../../hooks/useProctoring';
import { FaceBoundary } from '../proctor/FaceBoundary';

export const LiveProctorCameraWidget = ({ candidateName = "Candidate" }) => {
  const cameraHook = useCamera();
  const proctoring = useProctoring(cameraHook.stream, cameraHook.isCameraActive);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    cameraHook.startCamera().then(() => setHasStarted(true)).catch(() => {});
    return () => {
      cameraHook.stopCamera();
    };
  }, []);

  const proctorStatus = proctoring?.proctorStatus || PROCTOR_STATUSES.PROCTORING_OK;
  const isOk = proctorStatus === PROCTOR_STATUSES.PROCTORING_OK;
  const faceInside = proctoring?.faceInsideBoundary ?? true;
  const faceCount = proctoring?.faceCount ?? 1;
  const confidence = proctoring?.faceConfidence ?? 100;

  const hasLiveVideoTrack = Boolean(
    cameraHook.stream && 
    cameraHook.stream.getVideoTracks() && 
    cameraHook.stream.getVideoTracks().length > 0 && 
    cameraHook.stream.getVideoTracks()[0].readyState === 'live' &&
    cameraHook.stream.getVideoTracks()[0].enabled
  );

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-2xl space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              CANDIDATE PROCTOR FEED
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white">Live Proctoring Camera & Face Zone</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => cameraHook.startCamera()}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Refresh Camera"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Camera Video Frame with Real Green Zone */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 bg-[#060913] shadow-inner select-none">
        {cameraHook.isCameraActive ? (
          <div className="relative w-full h-full bg-[#060913] flex items-center justify-center overflow-hidden">
            <video
              ref={cameraHook.videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform -scale-x-100 z-0"
            />

            {!hasLiveVideoTrack && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 text-center p-3 space-y-2 z-0">
                <div className={`w-12 h-12 rounded-full border-2 border-dashed flex items-center justify-center ${
                  isOk ? 'border-cyan-400 text-cyan-400' : 'border-rose-400 text-rose-400'
                }`}>
                  <UserCheck className="w-6 h-6" />
                </div>
                <span className="text-xs text-slate-300 font-medium">Connecting Candidate Camera...</span>
              </div>
            )}

            {/* Green Boundary Zone Overlay */}
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
            <CameraOff className="w-8 h-8 text-rose-400 mb-2" />
            <span className="text-xs font-bold text-rose-300">Camera Feed Paused</span>
            <button
              onClick={() => cameraHook.toggleCamera()}
              className="mt-3 px-3 py-1.5 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 transition-colors cursor-pointer"
            >
              Resume Camera
            </button>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-20">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-bold text-white border border-white/10 shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>LIVE READY</span>
          </div>

          <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full backdrop-blur-md text-[9px] font-mono font-bold border shadow-lg ${
            isOk 
              ? 'bg-emerald-950/85 text-emerald-300 border-emerald-500/40' 
              : 'bg-rose-950/90 text-rose-200 border-rose-500/70 animate-bounce'
          }`}>
            {isOk ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> : <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />}
            <span>{isOk ? 'PROCTOR VERIFIED' : 'ALIGNMENT NEEDED'}</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 z-20">
          <div className="truncate pr-2">
            <p className="text-[11px] font-bold text-white truncate leading-none">{candidateName}</p>
            <p className="text-[9px] text-slate-400 font-mono leading-none mt-1">
              Confidence: <span className="text-emerald-400 font-bold">{confidence}%</span> • Status: <span className="text-cyan-300">{isOk ? "Active In-Bounds" : "Adjust Face"}</span>
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={cameraHook.toggleCamera}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${cameraHook.isCameraActive ? 'text-slate-300 hover:bg-white/10' : 'text-rose-400 bg-rose-500/20'}`}
              title={cameraHook.isCameraActive ? "Pause Camera" : "Start Camera"}
            >
              {cameraHook.isCameraActive ? <Camera className="w-3.5 h-3.5" /> : <CameraOff className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={cameraHook.toggleMic}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${cameraHook.isMicActive ? 'text-emerald-400 hover:bg-white/10' : 'text-rose-400 bg-rose-500/20'}`}
              title={cameraHook.isMicActive ? "Mute Mic" : "Unmute Mic"}
            >
              {cameraHook.isMicActive ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Info Pills */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5 text-center">
          <span className="text-[10px] text-slate-400 block">Single Face</span>
          <span className="text-xs font-mono font-bold text-emerald-400">{faceCount === 1 ? "✓ 1 Face" : `${faceCount} Faces`}</span>
        </div>
        <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5 text-center">
          <span className="text-[10px] text-slate-400 block">Zone Boundary</span>
          <span className={`text-xs font-mono font-bold ${faceInside ? "text-emerald-400" : "text-rose-400"}`}>
            {faceInside ? "✓ Inside Zone" : "Outside Zone"}
          </span>
        </div>
        <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5 text-center">
          <span className="text-[10px] text-slate-400 block">Stream Health</span>
          <span className="text-xs font-mono font-bold text-cyan-400">100% Active</span>
        </div>
      </div>
    </div>
  );
};

export default LiveProctorCameraWidget;
