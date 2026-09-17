import { useState, useEffect, useRef, useCallback } from 'react';

export const useSpeech = (onSpeechCompleteCallback = null) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isCandidateSpeaking, setIsCandidateSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [hasSpeechRecognition, setHasSpeechRecognition] = useState(false);
  const [voices, setVoices] = useState([]);
  
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const candidateSpeakingTimerRef = useRef(null);
  const transcriptRef = useRef("");
  const onCompleteRef = useRef(onSpeechCompleteCallback);
  const activeUtteranceRef = useRef(null);
  const speechFallbackTimerRef = useRef(null);

  // Keep callback reference synchronized
  useEffect(() => {
    onCompleteRef.current = onSpeechCompleteCallback;
  }, [onSpeechCompleteCallback]);

  // Initialize Speech Synthesis and Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 1. TTS Voices
      const updateVoices = () => {
        const available = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
        setVoices(available);
      };
      
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = updateVoices;
        updateVoices();
      }

      // 2. STT Speech Recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setHasSpeechRecognition(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
          let current = "";
          for (let i = 0; i < event.results.length; i++) {
            current += event.results[i][0].transcript;
          }
          
          transcriptRef.current = current;
          setTranscript(current);

          if (current.trim().length > 0) {
            setIsCandidateSpeaking(true);
            if (candidateSpeakingTimerRef.current) {
              clearTimeout(candidateSpeakingTimerRef.current);
            }
            candidateSpeakingTimerRef.current = setTimeout(() => {
              setIsCandidateSpeaking(false);
            }, 1800);
          }

          // Clear any existing silence timer
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
          }

          // Automatic Silence Detection (2.2 seconds after candidate pauses speaking)
          const words = current.trim().split(/\s+/).filter(Boolean);
          if (words.length >= 2) {
            silenceTimerRef.current = setTimeout(() => {
              if (onCompleteRef.current && transcriptRef.current.trim().length > 0) {
                const captured = transcriptRef.current;
                transcriptRef.current = "";
                setTranscript("");
                setIsCandidateSpeaking(false);
                onCompleteRef.current(captured);
              }
            }, 2200);
          }
        };

        recognition.onerror = (err) => {
          console.warn("Speech recognition notice:", err.error);
        };

        recognition.onend = () => {
          // If still marked as listening, restart recognition seamlessly
          if (isListening && recognitionRef.current) {
            try {
              recognitionRef.current.start();
            } catch (e) {}
          }
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (speechFallbackTimerRef.current) {
        clearTimeout(speechFallbackTimerRef.current);
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      if (candidateSpeakingTimerRef.current) {
        clearTimeout(candidateSpeakingTimerRef.current);
      }
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
    };
  }, [isListening]);

  // Speak AI HR text as ONE continuous speech from start to finish
  const speakText = useCallback((text, onEndCallback) => {
    if (speechFallbackTimerRef.current) {
      clearTimeout(speechFallbackTimerRef.current);
    }

    const words = text ? text.split(/\s+/).length : 10;
    // Estimated speech duration based on natural HR cadence (~140 wpm)
    const estimatedDurationMs = Math.max(3500, Math.round(words * 380 + 1200));

    setIsSpeaking(true);

    let hasEnded = false;
    const handleEnd = () => {
      if (hasEnded) return;
      hasEnded = true;
      if (speechFallbackTimerRef.current) {
        clearTimeout(speechFallbackTimerRef.current);
      }
      setIsSpeaking(false);
      activeUtteranceRef.current = null;
      if (onEndCallback) {
        // Natural polite pause after AI finishes speaking before candidate answer turn starts
        setTimeout(onEndCallback, 350);
      }
    };

    // Watchdog fallback timer to ensure speaking duration is strictly maintained even if browser blocks audio
    speechFallbackTimerRef.current = setTimeout(handleEnd, estimatedDurationMs);

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel(); // Stop any previous speech immediately
        
        const cleanText = text.replace(/([.?!])\s+/g, "$1 ").replace(/,\s+/g, ", ");
        const utterance = new SpeechSynthesisUtterance(cleanText);
        activeUtteranceRef.current = utterance;
        
        // Choose natural professional English voice if available
        const naturalVoice = voices.find(v => (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Samantha") || v.name.includes("Jenny") || v.name.includes("Zira") || v.name.includes("Victoria") || v.name.includes("Female")) && v.lang.startsWith("en")) || voices.find(v => v.lang.startsWith("en"));
        if (naturalVoice) utterance.voice = naturalVoice;

        // Professional, steady HR speaking rate (0.88x pace)
        utterance.rate = 0.88;
        utterance.pitch = 1.0;

        utterance.onstart = () => {
          setIsSpeaking(true);
        };

        utterance.onend = handleEnd;
        utterance.onerror = (e) => {
          console.warn("Speech synthesis notice:", e);
          // Fallback timer will gracefully conclude
        };

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn("Speech synthesis execution notice:", err);
      }
    }
  }, [voices]);

  const stopSpeaking = useCallback(() => {
    if (speechFallbackTimerRef.current) {
      clearTimeout(speechFallbackTimerRef.current);
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      activeUtteranceRef.current = null;
    }
    setIsSpeaking(false);
  }, []);

  // Start candidate microphone listening
  const startListening = useCallback(() => {
    setTranscript("");
    transcriptRef.current = "";
    setIsCandidateSpeaking(false);
    setIsListening(true);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        // Already active
      }
    }
  }, []);

  // Stop candidate microphone listening
  const stopListening = useCallback(() => {
    setIsListening(false);
    setIsCandidateSpeaking(false);
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
    if (candidateSpeakingTimerRef.current) {
      clearTimeout(candidateSpeakingTimerRef.current);
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    transcriptRef.current = "";
    setIsCandidateSpeaking(false);
  }, []);

  return {
    isSpeaking,
    isListening,
    isCandidateSpeaking,
    transcript,
    setTranscript,
    hasSpeechRecognition,
    speakText,
    stopSpeaking,
    startListening,
    stopListening,
    resetTranscript
  };
};
