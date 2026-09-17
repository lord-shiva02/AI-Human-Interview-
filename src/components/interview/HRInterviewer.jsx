import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Bot, Sparkles, Volume2, Mic, Brain, Cpu, MessageSquare, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Waveform } from '../common/Waveform';

export const HR_STATES = {
  IDLE: "idle",
  SPEAKING: "speaking",
  LISTENING: "listening",
  THINKING: "thinking",
  GENERATING: "generating",
  PAUSED: "paused",
  STOPPED: "stopped"
};

/**
 * HRInterviewer Component
 * 
 * Uses the uploaded real HR interviewer video (/hr-video.mp4) as the exact visual reference.
 * 
 * Strict Continuous Speaking Behavior:
 * 1. ONE continuous speaking session per generated question.
 * 2. The mouth stays continuously active for the ENTIRE duration of TTS audio.
 * 3. Never closes mouth, pauses, or resets in the middle of words, phrases, or sentences.
 * 4. Loops seamlessly within the natural speaking portion (0.5s - 8.5s) without black frames or visible jumping.
 * 5. Mouth closes ONCE only after the complete question audio ends (switches to LISTENING at currentTime 0.05s).
 * 6. Mouth remains strictly closed in IDLE, LISTENING, THINKING, GENERATING, and STOPPED states.
 */
export const HRInterviewer = ({
  question,
  isSpeaking = false,
  isListening = false,
  isThinking = false,
  speechDuration = 0,
  onSpeechComplete,
  hrState,
  compact = false
}) => {
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const animationFrameRef = useRef(null);

  // Normalize active states
  const rawKey = hrState?.key || (typeof hrState === 'string' ? hrState : "");
  const activeSpeaking = Boolean(
    isSpeaking || 
    rawKey === "HR_SPEAKING" || 
    rawKey === "REPEATING" || 
    rawKey === "REPHRASING" || 
    rawKey === "SPEAKING" || 
    rawKey === HR_STATES.SPEAKING
  );
  
  const activeListening = Boolean(
    isListening || 
    rawKey === "LISTENING" || 
    rawKey === "CANDIDATE_LISTENING" || 
    rawKey === "CANDIDATE_ANSWERING" || 
    rawKey === HR_STATES.LISTENING
  );
  
  const activeThinking = Boolean(
    isThinking || 
    rawKey === "THINKING" || 
    rawKey === "ANALYZING" || 
    rawKey === "ANSWER_ANALYSIS" || 
    rawKey === HR_STATES.THINKING || 
    rawKey === HR_STATES.GENERATING || 
    rawKey === "GENERATING_NEXT"
  );
  
  const activePaused = Boolean(
    rawKey === "PAUSED_FACE_NOT_DETECTED" || 
    rawKey === HR_STATES.PAUSED || 
    rawKey === HR_STATES.STOPPED
  );

  const stateLabel = hrState?.label || (
    activeSpeaking 
      ? "AI HR is speaking..." 
      : activeListening 
        ? "Listening..." 
        : activeThinking 
          ? "Analyzing response..." 
          : activePaused
            ? "Interview stopped / paused"
            : "AI HR Ready"
  );

  // Natural continuous speaking section timestamps in seconds
  const SPEAKING_LOOP_START = 0.5;
  const SPEAKING_LOOP_END = 8.5;
  const CLOSED_MOUTH_REST_TIME = 0.05;

  // Real-time animation frame loop for seamless speaking without any stutter
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (activeSpeaking) {
      video.playbackRate = 1.0;
      if (video.currentTime < SPEAKING_LOOP_START || video.currentTime >= SPEAKING_LOOP_END) {
        try { video.currentTime = SPEAKING_LOOP_START; } catch (e) {}
      }

      video.play().catch(() => {});

      const checkLoop = () => {
        if (videoRef.current && activeSpeaking) {
          if (videoRef.current.currentTime >= SPEAKING_LOOP_END || videoRef.current.ended) {
            videoRef.current.currentTime = SPEAKING_LOOP_START;
            videoRef.current.play().catch(() => {});
          }
          animationFrameRef.current = requestAnimationFrame(checkLoop);
        }
      };

      animationFrameRef.current = requestAnimationFrame(checkLoop);
    } else {
      // Non-speaking states: pause and set to closed-mouth rest frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      video.pause();
      try {
        video.currentTime = CLOSED_MOUTH_REST_TIME;
      } catch (e) {}
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [activeSpeaking, activePaused, activeListening, activeThinking]);

  return (
    <div className={`relative w-full ${compact ? 'h-64' : 'h-[440px] sm:h-[520px]'} flex flex-col items-center justify-center rounded-3xl bg-[#060913] border border-white/10 shadow-2xl shadow-cyan-950/40 overflow-hidden select-none`}>
      
      {/* 1. Main Visual: Real Continuous HR Interviewer Video */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden bg-slate-950">
        <video
          ref={videoRef}
          src="/hr-video.mp4"
          poster="/realistic_ai_hr.jpg"
          playsInline
          muted
          loop={false}
          autoPlay={false}
          preload="auto"
          onLoadedData={() => setVideoLoaded(true)}
          onError={() => setVideoError(true)}
          className={`w-full h-full object-cover transition-all duration-300 ${
            activeSpeaking 
              ? 'brightness-105 contrast-105 scale-[1.01]' 
              : activeThinking 
                ? 'brightness-95 contrast-100 scale-100' 
                : 'scale-100 brightness-100'
          }`}
        />

        {/* Fallback image if video is not yet ready or failed */}
        {(!videoLoaded || videoError) && (
          <img 
            src="/realistic_ai_hr.jpg" 
            alt="AI HR Interviewer" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </div>

      {/* Cinematic Vignette / Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#060913] via-transparent to-[#060913]/70 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
      
      {/* Dynamic Ambient Glow based on HR State */}
      <div className={`absolute w-96 h-96 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
        activeSpeaking 
          ? 'bg-cyan-500/25 scale-125' 
          : activeListening 
            ? 'bg-emerald-500/20 scale-110' 
            : activeThinking 
              ? 'bg-purple-500/25 scale-125 animate-pulse' 
              : activePaused
                ? 'bg-rose-500/25 scale-110'
                : 'bg-indigo-500/15'
      }`} />

      {/* Top Header Badge: AI Model & Avatar Identity */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/85 border border-white/15 backdrop-blur-md shadow-xl">
          <div className={`w-2 h-2 rounded-full ${activePaused ? 'bg-rose-400' : 'bg-cyan-400'} animate-ping`}></div>
          <span className="text-[11px] font-bold text-slate-100 tracking-wider flex items-center gap-1.5 font-mono">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            AI HR INTERVIEWER • EXPERT
          </span>
        </div>

        {/* Dynamic Status Badge */}
        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border backdrop-blur-md text-xs font-bold transition-all duration-300 shadow-xl ${
          activeSpeaking 
            ? 'bg-cyan-500/25 text-cyan-200 border-cyan-400/50 shadow-cyan-500/25 ring-1 ring-cyan-400/30' 
            : activeListening 
              ? 'bg-emerald-500/25 text-emerald-200 border-emerald-400/50 shadow-emerald-500/25 ring-1 ring-emerald-400/30' 
              : activeThinking 
                ? 'bg-purple-500/25 text-purple-200 border-purple-400/50 shadow-purple-500/25 ring-1 ring-purple-400/30' 
                : activePaused
                  ? 'bg-rose-500/35 text-rose-200 border-rose-400/60 shadow-rose-500/25 animate-pulse'
                  : 'bg-slate-900/85 text-slate-200 border-slate-700'
        }`}>
          {activeSpeaking && <Volume2 className="w-3.5 h-3.5 animate-bounce text-cyan-300" />}
          {activeListening && <Mic className="w-3.5 h-3.5 animate-pulse text-emerald-300" />}
          {activeThinking && <Brain className="w-3.5 h-3.5 animate-spin text-purple-300" />}
          {activePaused && <AlertTriangle className="w-3.5 h-3.5 text-rose-300" />}
          {!activeSpeaking && !activeListening && !activeThinking && !activePaused && <Sparkles className="w-3.5 h-3.5 text-slate-300" />}
          <span>{stateLabel}</span>
        </div>
      </div>

      {/* Center Speaking Subtle Sound Pulse Waves */}
      {activeSpeaking && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-72 h-72 rounded-full border border-cyan-500/25 animate-ping opacity-20" />
          <div className="w-96 h-96 rounded-full border border-dashed border-indigo-400/20 animate-spin opacity-15" style={{ animationDuration: '20s' }} />
        </div>
      )}

      {/* Bottom Live Waveform / Voice Activity Track */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-20 px-4 py-2.5 rounded-2xl bg-slate-950/85 border border-white/15 backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-200">
            {activeSpeaking 
              ? "AI HR is speaking..." 
              : activeListening 
                ? "Your turn — please answer." 
                : activeThinking 
                  ? "Analyzing your response..." 
                  : activePaused
                    ? "Interview stopped / paused"
                    : "Ready"}
          </span>
        </div>

        {/* Live Audio Waves */}
        <Waveform 
          isActive={activeSpeaking || activeListening} 
          count={14} 
          color={activeSpeaking ? "cyan" : activeListening ? "emerald" : "purple"} 
          height="h-5" 
        />
      </div>
    </div>
  );
};

export default HRInterviewer;
