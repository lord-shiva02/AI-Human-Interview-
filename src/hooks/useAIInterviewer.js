import { useState, useEffect, useRef } from 'react';

export const HR_STATES = {
  CAMERA_CHECK: { key: "CAMERA_CHECK", label: "Checking Camera Alignment...", badge: "bg-slate-800/80 text-slate-300 border-slate-700" },
  FACE_VERIFIED: { key: "FACE_VERIFIED", label: "Face Verified & Aligned", badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" },
  READY: { key: "READY", label: "Ready to Begin", badge: "bg-slate-800/80 text-slate-300 border-slate-700" },
  HR_SPEAKING: { key: "HR_SPEAKING", label: "AI HR is speaking...", badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse" },
  CANDIDATE_LISTENING: { key: "CANDIDATE_LISTENING", label: "Your turn — please answer.", badge: "bg-emerald-500/25 text-emerald-200 border-emerald-400/50 shadow-emerald-500/25 ring-1 ring-emerald-400/30" },
  LISTENING: { key: "LISTENING", label: "Listening...", badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse" },
  CANDIDATE_ANSWERING: { key: "CANDIDATE_ANSWERING", label: "Listening...", badge: "bg-emerald-500/25 text-emerald-300 border-emerald-500/50 animate-pulse" },
  ANSWER_ANALYSIS: { key: "ANSWER_ANALYSIS", label: "Analyzing your response...", badge: "bg-purple-500/25 text-purple-200 border-purple-400/50 shadow-purple-500/25 ring-1 ring-purple-400/30" },
  THINKING: { key: "THINKING", label: "Analyzing your response...", badge: "bg-purple-500/20 text-purple-300 border-purple-500/40 animate-pulse" },
  ANALYZING: { key: "ANALYZING", label: "Analyzing your response...", badge: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40" },
  REPEATING: { key: "REPEATING", label: "AI HR is speaking...", badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse" },
  REPHRASING: { key: "REPHRASING", label: "AI HR is speaking...", badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse" },
  GENERATING_NEXT: { key: "GENERATING_NEXT", label: "Preparing next question...", badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40" },
  PAUSED_FACE_NOT_DETECTED: { key: "PAUSED_FACE_NOT_DETECTED", label: "Interview paused — Face not detected", badge: "bg-rose-500/25 text-rose-300 border-rose-500/40 animate-bounce" },
  INTERVIEW_COMPLETE: { key: "INTERVIEW_COMPLETE", label: "Interview Complete", badge: "bg-emerald-500/25 text-emerald-300 border-emerald-500/40" }
};

export const useAIInterviewer = () => {
  const [hrState, setHrState] = useState(HR_STATES.READY);
  const [isBlinking, setIsBlinking] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(0); // 0.0 when closed
  const [headTilt, setHeadTilt] = useState(0);

  const animFrameRef = useRef(null);
  const speechStartTimeRef = useRef(0);

  // Natural human blinking interval (every ~3.6 - 4.4 seconds)
  useEffect(() => {
    let blinkTimeout;
    const scheduleNextBlink = () => {
      const delay = 3400 + Math.random() * 1200;
      blinkTimeout = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          scheduleNextBlink();
        }, 150);
      }, delay);
    };

    scheduleNextBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);

  // Continuous fluid lip-sync animation during speaking without mid-sentence pauses
  useEffect(() => {
    const isSpeaking = hrState.key === "HR_SPEAKING" || hrState.key === "REPEATING" || hrState.key === "REPHRASING";
    
    if (isSpeaking) {
      speechStartTimeRef.current = performance.now();

      const animateSpeaking = (now) => {
        const elapsedSec = (now - speechStartTimeRef.current) / 1000;

        // Continuous cadence without closing mouth mid-sentence
        const primaryWave = Math.sin(elapsedSec * Math.PI * 4.2);
        const secondaryWave = Math.sin(elapsedSec * Math.PI * 8.4 + 0.4);
        const cadence = (primaryWave * 0.6 + secondaryWave * 0.4 + 1.0) / 2.0;

        // Target continuous mouth opening between 0.35 and 0.85
        const targetMouth = 0.35 + cadence * 0.50;
        setMouthOpen(targetMouth);

        const tilt = Math.sin(elapsedSec * 1.6) * 0.8 + Math.sin(elapsedSec * 3.4) * 0.3;
        setHeadTilt(tilt);

        animFrameRef.current = requestAnimationFrame(animateSpeaking);
      };

      animFrameRef.current = requestAnimationFrame(animateSpeaking);
    } else {
      // Non-speaking states: Mouth immediately closes and remains firmly closed (0)
      setMouthOpen(0);
      setHeadTilt(0);
    }

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [hrState.key]);

  return {
    hrState,
    setHrState,
    isBlinking,
    mouthOpen,
    headTilt
  };
};

export default useAIInterviewer;
