import React, { useState } from 'react';
import { 
  Mic, 
  MicOff, 
  Send, 
  RotateCcw, 
  CheckCircle2, 
  Edit3, 
  BrainCircuit,
  SkipForward,
  HelpCircle
} from 'lucide-react';
import { Waveform } from '../common/Waveform';

export const InterviewControls = ({
  transcript = "",
  setTranscript,
  isListening = false,
  isSpeaking = false,
  isProcessing = false,
  onStartListening,
  onStopListening,
  onSubmitAnswer,
  onSkipQuestion,
  onRepeatQuestion,
  currentQuestion
}) => {
  const [manualText, setManualText] = useState("");
  const [isTypingMode, setIsTypingMode] = useState(false);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);

  const activeText = isTypingMode ? manualText : transcript;

  const handleSend = () => {
    onSubmitAnswer(activeText);
    setManualText("");
    setShowSkipConfirm(false);
  };

  const handleConfirmSkip = () => {
    setShowSkipConfirm(false);
    onSkipQuestion();
    setManualText("");
  };

  return (
    <div className="rounded-3xl bg-slate-900/90 border border-white/10 p-5 sm:p-6 backdrop-blur-xl shadow-2xl space-y-5">
      
      {/* Speech / Transcription Input Area */}
      <div className="relative space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              {isListening && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isListening ? 'bg-emerald-500' : 'bg-slate-500'}`}></span>
            </span>
            <span className="text-xs font-bold text-slate-300">
              {isListening ? "Listening to Your Live Answer..." : isTypingMode ? "Manual Text Input" : "Candidate Response Box"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTypingMode(!isTypingMode)}
              className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              <Edit3 className="w-3 h-3" />
              <span>{isTypingMode ? "Switch to Voice Mic" : "Type Response"}</span>
            </button>
          </div>
        </div>

        {/* Input Area */}
        {isTypingMode ? (
          <textarea
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            placeholder="Type your structured response here..."
            rows={4}
            className="w-full bg-slate-950/70 border border-white/10 rounded-2xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 resize-none font-sans leading-relaxed"
          />
        ) : (
          <div className="min-h-[100px] w-full bg-slate-950/70 border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
            <p className={`text-sm leading-relaxed ${transcript ? 'text-slate-100' : 'text-slate-500 italic'}`}>
              {transcript || (isListening ? "Listening... Speak clearly into your microphone." : "Click 'Start Speaking' or use 'Type Response' to provide your answer.")}
            </p>
            {isListening && (
              <div className="flex items-center justify-end pt-3">
                <Waveform isActive={true} count={12} color="emerald" height="h-4" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* SKIP QUESTION CONFIRMATION BANNER */}
      {showSkipConfirm && (
        <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs animate-fadeIn">
          <div className="flex items-center gap-2 text-amber-300">
            <HelpCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>Are you sure you want to skip this question? (No positive score awarded)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSkipConfirm(false)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-semibold"
            >
              Continue Answering
            </button>
            <button
              onClick={handleConfirmSkip}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
            >
              Confirm Skip
            </button>
          </div>
        </div>
      )}

      {/* Action Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/[0.08]">
        
        {/* Left: Repeat Question & Secondary Skip Question Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onRepeatQuestion}
            disabled={isProcessing || isSpeaking}
            className="px-3 py-2.5 rounded-xl bg-slate-800/80 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
            title="Listen to the question again"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Repeat</span>
          </button>

          {/* SKIP QUESTION BUTTON WITH TOOLTIP */}
          <div className="relative group">
            <button
              onClick={() => setShowSkipConfirm(true)}
              disabled={isProcessing || isSpeaking}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-amber-500/15 border border-white/10 hover:border-amber-500/30 text-slate-300 hover:text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-40"
            >
              <SkipForward className="w-3.5 h-3.5 text-amber-400" />
              <span>Skip Question</span>
            </button>

            {/* Hover Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 rounded-xl bg-slate-950 border border-white/10 text-[10px] text-slate-300 text-center shadow-xl pointer-events-none z-30">
              Don't know the answer? Skip this question and continue.
            </div>
          </div>
        </div>

        {/* Center & Right: Mic Toggle & Primary Submit */}
        <div className="flex items-center gap-2">
          {!isTypingMode && (
            <button
              onClick={isListening ? onStopListening : onStartListening}
              disabled={isProcessing || isSpeaking}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md ${
                isListening 
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30' 
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4 text-rose-400" />
                  <span className="hidden sm:inline">Stop Mic</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 text-emerald-400" />
                  <span>Start Speaking</span>
                </>
              )}
            </button>
          )}

          {/* Primary Action Button */}
          <button
            onClick={handleSend}
            disabled={isProcessing || (!activeText && !transcript)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100"
          >
            {isProcessing ? (
              <>
                <BrainCircuit className="w-4 h-4 animate-spin text-slate-950" />
                <span>Evaluating...</span>
              </>
            ) : (
              <>
                <span>Submit Answer</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
