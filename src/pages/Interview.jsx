import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, 
  LogOut, 
  Sparkles, 
  ShieldCheck, 
  Volume2, 
  VolumeX,
  Maximize2,
  AlertCircle,
  Flag,
  Cpu,
  RotateCcw,
  Mic,
  MicOff,
  Edit3,
  Send,
  AlertTriangle,
  HelpCircle,
  FastForward,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech';
import { useAIInterviewer, HR_STATES } from '../hooks/useAIInterviewer';
import { useInterview } from '../hooks/useInterview';
import { useCamera } from '../hooks/useCamera';
import { useResume } from '../hooks/useResume';
import { useProctoring } from '../hooks/useProctoring';
import { HRAvatar } from '../components/interview/HRAvatar';
import { ProctorCamera } from '../components/proctor/ProctorCamera';
import { ProctorStatus } from '../components/proctor/ProctorStatus';
import { InterviewStopOverlay } from '../components/proctor/InterviewStopOverlay';
import { LiveIndicators } from '../components/interview/LiveIndicators';
import { Timer } from '../components/interview/Timer';
import { Modal } from '../components/common/Modal';

export const Interview = () => {
  const navigate = useNavigate();
  const { activeResume } = useResume();
  const aiInterviewerHook = useAIInterviewer();
  const cameraHook = useCamera();
  
  // Continuous strict proctoring hook
  const proctoringHook = useProctoring(cameraHook.stream, cameraHook.isCameraActive);

  // Create answer callback ref for useSpeech automatic silence completion
  const handleAnswerRef = useRef(null);

  const speechHook = useSpeech((transcriptText) => {
    if (handleAnswerRef.current) {
      handleAnswerRef.current(transcriptText);
    }
  });
  
  const {
    session,
    currentQuestion,
    questionIndex,
    totalQuestions,
    evaluations,
    isProcessingAnswer,
    timerSeconds,
    liveMetrics,
    isPausedForFace,
    initSession,
    handleCandidateAnswer,
    handleSkipQuestion,
    finishInterviewEarly,
    repeatQuestion,
    resumeInterview
  } = useInterview(speechHook, aiInterviewerHook, proctoringHook);

  useEffect(() => {
    handleAnswerRef.current = handleCandidateAnswer;
  }, [handleCandidateAnswer]);

  const [showExitModal, setShowExitModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [isTypingMode, setIsTypingMode] = useState(false);

  // Initialize camera and session on mount
  useEffect(() => {
    cameraHook.startCamera();
    initSession();

    return () => {
      cameraHook.stopCamera();
      speechHook.stopSpeaking();
      speechHook.stopListening();
    };
  }, []);

  const handleSubmitAnswer = () => {
    const answerToSubmit = (typedAnswer.trim() || speechHook.transcript.trim());
    if (answerToSubmit) {
      handleCandidateAnswer(answerToSubmit);
      setTypedAnswer("");
    }
  };

  const handleSkip = () => {
    handleSkipQuestion();
    setTypedAnswer("");
  };

  const progressPercent = Math.round(((questionIndex + 1) / totalQuestions) * 100);

  // STRICT PROCTORING GATE:
  // If face moved outside boundary, multiple faces, no face, or camera off:
  // Render ONLY the clean plain background InterviewStopOverlay
  if (!proctoringHook.isInterviewAllowed || isPausedForFace) {
    return (
      <InterviewStopOverlay
        proctoring={proctoringHook}
        stream={cameraHook.stream}
        videoRef={cameraHook.videoRef}
        isCameraActive={cameraHook.isCameraActive}
        candidateName={activeResume?.name}
        onResumeInterview={resumeInterview}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#070A12] text-slate-100 flex flex-col justify-between overflow-y-auto font-sans select-none">
      
      {/* HUD HEADER */}
      <header className="sticky top-0 z-40 w-full px-4 sm:px-8 py-3 bg-[#0B0F19]/90 backdrop-blur-xl border-b border-white/10 flex items-center justify-between">
        
        {/* Left: Brand Identity & Track */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 p-[1px]">
            <div className="w-full h-full bg-[#0B0F19] rounded-[11px] flex items-center justify-center">
              <Bot className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-xs sm:text-sm text-white">AI Interview Studio</h2>
              <ProctorStatus 
                status={proctoringHook.proctorStatus} 
                confidence={proctoringHook.faceConfidence}
                size="sm"
              />
            </div>
            <p className="text-[10px] text-slate-400 font-mono hidden sm:block">
              Candidate: <strong className="text-white">{activeResume?.name || "Candidate"}</strong> • Track: <strong className="text-cyan-300">{session?.track || 'Fresher Track'}</strong>
            </p>
          </div>
        </div>

        {/* Center: Live Indicators & Progress */}
        <div className="hidden md:flex items-center gap-4">
          <LiveIndicators metrics={liveMetrics} />
        </div>

        {/* Right: Question Number, Timer, Finish & Exit */}
        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-900 border border-white/10 text-cyan-300">
            Question {questionIndex + 1} / {totalQuestions}
          </span>

          <Timer seconds={timerSeconds} />

          {/* Finish Interview Button */}
          <button
            onClick={() => setShowFinishModal(true)}
            className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm shadow-emerald-500/10 cursor-pointer"
            title="Finish and generate final evaluation"
          >
            <Flag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Finish</span>
          </button>

          {/* Exit Session Button */}
          <button
            onClick={() => setShowExitModal(true)}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Exit Active Session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exit</span>
          </button>
        </div>
      </header>

      {/* TOP PROGRESS BAR */}
      <div className="w-full bg-slate-900 h-1.5 relative overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* MAIN IMMERSIVE FACE-TO-FACE INTERVIEW STAGE */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col justify-between gap-4">
        
        {/* Large AI HR Avatar Stage + Floating Candidate Camera */}
        <div className="relative w-full">
          
          {/* Main Large AI HR Avatar */}
          <HRAvatar 
            questionId={currentQuestion?.id || `question_${questionIndex}`}
            hrState={aiInterviewerHook.hrState}
            isBlinking={aiInterviewerHook.isBlinking}
            mouthOpen={aiInterviewerHook.mouthOpen}
            headTilt={aiInterviewerHook.headTilt}
            compact={false}
          />

          {/* Floating Live Candidate Camera with Strict Green Boundary (Bottom Right of the Avatar Stage) */}
          <div className="absolute bottom-16 right-4 z-30 hidden md:block">
            <ProctorCamera 
              stream={cameraHook.stream}
              videoRef={cameraHook.videoRef}
              isCameraActive={cameraHook.isCameraActive}
              isMicActive={cameraHook.isMicActive}
              candidateName={activeResume?.name}
              proctoring={proctoringHook}
              floating={true}
              onToggleMic={cameraHook.toggleMic}
              onToggleCamera={cameraHook.toggleCamera}
              showSimControls={true}
            />
          </div>
        </div>

        {/* Mobile Candidate Camera Preview */}
        <div className="md:hidden">
          <ProctorCamera 
            stream={cameraHook.stream}
            videoRef={cameraHook.videoRef}
            isCameraActive={cameraHook.isCameraActive}
            isMicActive={cameraHook.isMicActive}
            candidateName={activeResume?.name}
            proctoring={proctoringHook}
            floating={false}
            onToggleMic={cameraHook.toggleMic}
            onToggleCamera={cameraHook.toggleCamera}
            showSimControls={true}
          />
        </div>

        {/* PROMINENT QUESTION DISPLAY CARD */}
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-white/10 backdrop-blur-xl shadow-2xl space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                {currentQuestion?.category || "Resume Grounded Question"}
              </span>
              {currentQuestion?.topic && (
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                  • {currentQuestion.topic}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-semibold text-slate-400">
                Difficulty: <strong className="text-indigo-300">{currentQuestion?.difficulty || "Standard"}</strong>
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-cyan-400 font-mono tracking-wider uppercase">HR Interviewer:</span>
            <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
              "{currentQuestion?.text || "Initializing question from your uploaded resume..."}"
            </h3>
          </div>

          {currentQuestion?.resumeSource && (
            <p className="text-[11px] text-cyan-400/80 font-mono flex items-center gap-1.5 pt-1">
              <FileText className="w-3.5 h-3.5" />
              <span>Grounded in: {currentQuestion.resumeSource}</span>
            </p>
          )}
        </div>

        {/* INTERACTIVE ANSWER & VOICE CONTROLS BAR */}
        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-white/10 flex flex-col gap-3 backdrop-blur-xl shadow-2xl">
          
          {/* Top Status & Transcript */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-3 w-3 relative">
                {(speechHook.isListening || speechHook.isCandidateSpeaking) && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full h-3 w-3 ${speechHook.isSpeaking ? 'bg-cyan-400 animate-pulse' : speechHook.isListening ? 'bg-emerald-500' : 'bg-slate-600'}`}></span>
              </div>
              
              <div>
                <p className="text-xs sm:text-sm font-bold text-white">
                  {speechHook.isSpeaking 
                    ? "AI HR is speaking..." 
                    : isProcessingAnswer 
                      ? "Analyzing your response..." 
                      : speechHook.isCandidateSpeaking
                        ? "Listening..."
                        : "Your turn — please answer."}
                </p>
                <p className="text-[11px] text-slate-400">
                  {speechHook.isSpeaking
                    ? "Please listen carefully to the complete question..."
                    : speechHook.isListening 
                      ? (speechHook.transcript ? `"${speechHook.transcript.slice(0, 70)}..."` : "Speak into your microphone or type your answer below.") 
                      : "Speak with your microphone or type your response."}
                </p>
              </div>
            </div>

            {/* Action Buttons: Repeat & Type Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={repeatQuestion}
                disabled={isProcessingAnswer || speechHook.isSpeaking}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer"
                title="Repeat current question"
              >
                <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Repeat</span>
              </button>

              <button
                onClick={() => setIsTypingMode(!isTypingMode)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isTypingMode 
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' 
                    : 'bg-slate-800 text-slate-300 border-white/10 hover:text-white'
                }`}
                title="Toggle text answer input"
              >
                <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">{isTypingMode ? "Hide Text" : "Type Answer"}</span>
              </button>
            </div>
          </div>

          {/* Text Input Row (Always visible or toggled) */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
            <input
              type="text"
              value={typedAnswer}
              onChange={(e) => setTypedAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && typedAnswer.trim() && !speechHook.isSpeaking && !isProcessingAnswer) {
                  handleSubmitAnswer();
                }
              }}
              placeholder={speechHook.isSpeaking ? "AI HR is speaking..." : "Type your answer here..."}
              disabled={isProcessingAnswer || speechHook.isSpeaking}
              className="flex-1 w-full px-4 py-3 rounded-2xl bg-slate-950/80 border border-white/10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/25 transition-all disabled:opacity-50"
            />

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {/* Skip Button */}
              <button
                type="button"
                onClick={handleSkip}
                disabled={isProcessingAnswer || speechHook.isSpeaking}
                className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer whitespace-nowrap"
                title="Skip this question"
              >
                <FastForward className="w-3.5 h-3.5 text-amber-400" />
                <span>I DON'T KNOW / SKIP</span>
              </button>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmitAnswer}
                disabled={isProcessingAnswer || speechHook.isSpeaking || (!typedAnswer.trim() && !speechHook.transcript.trim())}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all disabled:opacity-40 cursor-pointer whitespace-nowrap"
              >
                <span>SUBMIT ANSWER</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* CONFIRMATION FINISH EARLY MODAL */}
      <Modal
        isOpen={showFinishModal}
        onClose={() => setShowFinishModal(false)}
        title="Complete Interview Session?"
      >
        <div className="space-y-4 text-xs text-slate-300">
          <p>
            You have evaluated {questionIndex} of {totalQuestions} questions. Are you ready to finalize your interview performance evaluation and view the diagnostic report?
          </p>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              onClick={() => setShowFinishModal(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
            >
              Continue Interview
            </button>
            <button
              onClick={() => {
                setShowFinishModal(false);
                finishInterviewEarly();
              }}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase tracking-wider cursor-pointer"
            >
              Generate Final Report
            </button>
          </div>
        </div>
      </Modal>

      {/* CONFIRMATION EXIT MODAL */}
      <Modal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        title="Exit Active Interview?"
      >
        <div className="space-y-4 text-xs text-slate-300">
          <p>
            Are you sure you want to exit? Your currently answered questions will be saved up to this point.
          </p>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              onClick={() => setShowExitModal(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
            >
              Resume
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold cursor-pointer"
            >
              Confirm Exit
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Interview;
