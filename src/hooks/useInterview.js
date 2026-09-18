import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { dynamicInterviewService } from '../services/dynamicInterviewService';
import { mockResumeService } from '../services/mockResumeService';
import { mockInterviewService } from '../services/mockInterviewService';
import { semanticIntentService, INTENTS } from '../services/semanticIntentService';
import { HR_STATES } from './useAIInterviewer';

export const useInterview = (speechHook, aiInterviewerHook, detectionState = null, onSessionEnd = null) => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [evaluations, setEvaluations] = useState([]);
  const [isProcessingAnswer, setIsProcessingAnswer] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [repeatAttempts, setRepeatAttempts] = useState(0);
  const [isPausedForFace, setIsPausedForFace] = useState(false);

  // Real-time live mini indicators
  const [liveMetrics, setLiveMetrics] = useState({
    technical: 82,
    communication: 80,
    fluency: 84
  });

  const timerRef = useRef(null);
  const previousStateRef = useRef(HR_STATES.LISTENING);
  const currentQuestionRef = useRef(null);
  const hasStartedSpeechRef = useRef(false);

  useEffect(() => {
    currentQuestionRef.current = currentQuestion;
  }, [currentQuestion]);

  // Start HR Interview speech explicitly once strict camera conditions are satisfied
  const startHRInterview = useCallback(() => {
    if (hasStartedSpeechRef.current) return;
    const q = currentQuestionRef.current;
    if (!q) return;

    hasStartedSpeechRef.current = true;
    setIsTimerRunning(true);

    if (aiInterviewerHook?.setHrState) {
      aiInterviewerHook.setHrState(HR_STATES.HR_SPEAKING);
    }

    if (speechHook?.speakText) {
      speechHook.speakText(q.text, () => {
        if (aiInterviewerHook?.setHrState) {
          aiInterviewerHook.setHrState(HR_STATES.CANDIDATE_LISTENING);
        }
        if (speechHook?.startListening) {
          speechHook.startListening();
        }
      });
    }
  }, [aiInterviewerHook, speechHook]);

  // Initialize interview session from active resume & selected track
  const initSession = useCallback((autoStartSpeech = false) => {
    const resume = mockResumeService.getActiveResume();
    if (!resume) {
      navigate('/interview/resume?error=resume_required');
      return;
    }

    const track = mockInterviewService.getActiveTrack();
    const newSession = dynamicInterviewService.startInterview(resume, track);
    
    // First resume-grounded question
    const firstQ = newSession.questions?.[0] || {
      id: "q_init_1",
      category: "Resume Project Grounding",
      topic: resume.projects?.[0]?.title || "Project Architecture",
      sourceResumeField: "Projects",
      sourceResumeValue: resume.projects?.[0]?.title || "Primary Project",
      text: track === 'fresher' 
        ? `Can you explain the ${resume.projects?.[0]?.title || 'primary project'} mentioned in your resume and what your specific responsibilities were?`
        : `Looking at your experience with ${resume.projects?.[0]?.title || 'production systems'}, what were the most critical architectural decisions and trade-offs you made?`,
      difficulty: track === 'fresher' ? 'Simple' : 'Hard'
    };

    setSession(newSession);
    setCurrentQuestion(firstQ);
    currentQuestionRef.current = firstQ;
    setQuestionIndex(0);
    setEvaluations([]);
    setRepeatAttempts(0);
    setTimerSeconds(0);

    if (autoStartSpeech) {
      hasStartedSpeechRef.current = true;
      setIsTimerRunning(true);
      if (aiInterviewerHook?.setHrState) {
        aiInterviewerHook.setHrState(HR_STATES.HR_SPEAKING);
      }
      if (speechHook?.speakText) {
        speechHook.speakText(firstQ.text, () => {
          if (aiInterviewerHook?.setHrState) {
            aiInterviewerHook.setHrState(HR_STATES.CANDIDATE_LISTENING);
          }
          if (speechHook.startListening) {
            speechHook.startListening();
          }
        });
      }
    } else {
      setIsTimerRunning(false);
    }
  }, [speechHook, aiInterviewerHook, navigate]);

  // Question Timer
  useEffect(() => {
    if (isTimerRunning && !isPausedForFace) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, isPausedForFace]);

  // Synchronize candidate speaking state with HR state
  useEffect(() => {
    if (speechHook?.isCandidateSpeaking && aiInterviewerHook?.hrState?.key === "CANDIDATE_LISTENING") {
      aiInterviewerHook.setHrState(HR_STATES.CANDIDATE_ANSWERING);
    }
  }, [speechHook?.isCandidateSpeaking, aiInterviewerHook]);

  // Face Proctoring Monitor (Pause/Resume interview on proctoring violation)
  useEffect(() => {
    if (detectionState) {
      const isAllowed = detectionState.isInterviewAllowed ?? (detectionState.passed !== false);
      if (!isAllowed) {
        if (!isPausedForFace) {
          setIsPausedForFace(true);
          setIsTimerRunning(false);
          previousStateRef.current = aiInterviewerHook?.hrState || HR_STATES.CANDIDATE_LISTENING;
          if (aiInterviewerHook?.setHrState) {
            aiInterviewerHook.setHrState(HR_STATES.PAUSED_FACE_NOT_DETECTED);
          }
          if (speechHook?.stopSpeaking) {
            speechHook.stopSpeaking();
          }
          if (speechHook?.stopListening) {
            speechHook.stopListening();
          }
        }
      }
    }
  }, [detectionState, isPausedForFace, aiInterviewerHook, speechHook]);

  // Resume Interview function when candidate re-aligns within green boundary
  const resumeInterview = useCallback(() => {
    setIsPausedForFace(false);
    setIsTimerRunning(true);

    if (aiInterviewerHook?.setHrState) {
      aiInterviewerHook.setHrState(HR_STATES.CANDIDATE_LISTENING);
    }
    if (speechHook?.startListening) {
      speechHook.startListening();
    }
  }, [aiInterviewerHook, speechHook]);

  // Handle Candidate Answer with Semantic Intent Classification
  const handleCandidateAnswer = useCallback(async (answerTextRaw = "") => {
    if (isProcessingAnswer || !currentQuestion || isPausedForFace) return;

    setIsProcessingAnswer(true);
    setIsTimerRunning(false);

    if (speechHook?.stopListening) {
      speechHook.stopListening();
    }

    const answerText = (answerTextRaw || speechHook?.transcript || "").trim();

    // 1. Classify candidate semantic intent
    const classification = semanticIntentService.classifyIntent(answerText);

    // CASE A: Candidate explicitly requests a Repeat ("Could you please repeat?")
    if (classification.intent === INTENTS.REPEAT_REQUEST) {
      if (aiInterviewerHook?.setHrState) {
        aiInterviewerHook.setHrState(HR_STATES.REPEATING);
      }
      
      const repeatSpeech = `${semanticIntentService.getRepeatPrefix(1)} ${currentQuestion.text}`;
      
      if (speechHook?.speakText) {
        speechHook.speakText(repeatSpeech, () => {
          setIsProcessingAnswer(false);
          setIsTimerRunning(true);
          if (aiInterviewerHook?.setHrState) {
            aiInterviewerHook.setHrState(HR_STATES.CANDIDATE_LISTENING);
          }
          if (speechHook.startListening) {
            speechHook.startListening();
          }
        });
      } else {
        setIsProcessingAnswer(false);
      }
      return;
    }

    // CASE B: Candidate requests a Rephrase ("Could you rephrase that in simpler terms?")
    if (classification.intent === INTENTS.REPHRASE_REQUEST) {
      if (aiInterviewerHook?.setHrState) {
        aiInterviewerHook.setHrState(HR_STATES.REPHRASING);
      }

      const rephrasedText = semanticIntentService.generateRephrase(currentQuestion);
      const rephraseSpeech = `${semanticIntentService.getRephrasePrefix()} ${rephrasedText}`;

      if (speechHook?.speakText) {
        speechHook.speakText(rephraseSpeech, () => {
          setIsProcessingAnswer(false);
          setIsTimerRunning(true);
          if (aiInterviewerHook?.setHrState) {
            aiInterviewerHook.setHrState(HR_STATES.CANDIDATE_LISTENING);
          }
          if (speechHook.startListening) {
            speechHook.startListening();
          }
        });
      } else {
        setIsProcessingAnswer(false);
      }
      return;
    }

    // CASE C: Candidate is Uncertain / Says "I don't know"
    if (classification.intent === INTENTS.UNCERTAIN_ANSWER) {
      if (repeatAttempts < 2) {
        // Repeat the same question to give candidate another chance without advancing
        setRepeatAttempts(prev => prev + 1);
        if (aiInterviewerHook?.setHrState) {
          aiInterviewerHook.setHrState(HR_STATES.REPEATING);
        }

        const uncertainSpeech = `${semanticIntentService.getUncertainTransitionPrefix()} ${currentQuestion.text}`;

        if (speechHook?.speakText) {
          speechHook.speakText(uncertainSpeech, () => {
            setIsProcessingAnswer(false);
            setIsTimerRunning(true);
            if (aiInterviewerHook?.setHrState) {
              aiInterviewerHook.setHrState(HR_STATES.CANDIDATE_LISTENING);
            }
            if (speechHook.startListening) {
              speechHook.startListening();
            }
          });
        } else {
          setIsProcessingAnswer(false);
        }
        return;
      }
      // If candidate is still unable to answer after 2 attempts, record as insufficient evidence and continue to next question
    }

    // CASE D: Valid Answer or Concluded Attempts -> Process & Evaluate
    if (aiInterviewerHook?.setHrState) {
      aiInterviewerHook.setHrState(HR_STATES.ANSWER_ANALYSIS);
    }

    // Internal evaluation think time
    await new Promise(r => setTimeout(r, 1200));

    // Evaluate answer against resume rubrics
    const finalAnswer = answerText || (classification.intent === INTENTS.UNCERTAIN_ANSWER ? "Candidate expressed unfamiliarity with this topic." : "In my experience, I worked on modular architecture and user interface engineering.");
    
    const evaluation = dynamicInterviewService.analyzeCandidateAnswer(
      currentQuestion, 
      finalAnswer, 
      Math.max(10, timerSeconds)
    );

    const updatedEvaluations = [...evaluations, evaluation];
    setEvaluations(updatedEvaluations);
    setRepeatAttempts(0);

    // Update live indicators dynamically based on real evaluation
    setLiveMetrics({
      technical: evaluation.scores.technical,
      communication: evaluation.scores.communication,
      fluency: evaluation.scores.fluency
    });

    const nextIndex = questionIndex + 1;
    const totalQuestions = session?.totalQuestions || 5;

    if (nextIndex < totalQuestions) {
      if (aiInterviewerHook?.setHrState) {
        aiInterviewerHook.setHrState(HR_STATES.GENERATING_NEXT);
      }

      await new Promise(r => setTimeout(r, 800));

      const resume = mockResumeService.getActiveResume();
      const track = mockInterviewService.getActiveTrack();
      const followUp = dynamicInterviewService.generateFollowUpQuestion(
        currentQuestion,
        evaluation,
        resume,
        track,
        nextIndex,
        session?.baseQuestions
      );

      setCurrentQuestion(followUp);
      setQuestionIndex(nextIndex);
      setTimerSeconds(0);
      setIsTimerRunning(true);
      setIsProcessingAnswer(false);
      
      if (speechHook?.resetTranscript) {
        speechHook.resetTranscript();
      }

      // Speak next question continuously from start to finish
      if (aiInterviewerHook?.setHrState) {
        aiInterviewerHook.setHrState(HR_STATES.HR_SPEAKING);
      }
      
      if (speechHook?.speakText) {
        speechHook.speakText(followUp.text, () => {
          if (aiInterviewerHook?.setHrState) {
            aiInterviewerHook.setHrState(HR_STATES.CANDIDATE_LISTENING);
          }
          if (speechHook.startListening) {
            speechHook.startListening();
          }
        });
      }
    } else {
      // INTERVIEW COMPLETE: Calculate and save final record
      const resume = mockResumeService.getActiveResume();
      const track = mockInterviewService.getActiveTrack();
      const performanceSummary = dynamicInterviewService.calculatePerformance(updatedEvaluations, track, resume);

      const finalRecord = {
        interviewId: session?.interviewId || `INT-${Date.now()}`,
        resumeId: resume.id,
        candidate: session?.candidate || { name: resume.name, email: resume.email, college: resume.college, degree: resume.degree },
        track: session?.track || track,
        difficulty: session?.difficulty || (track === 'fresher' ? 'Simple' : 'Hard'),
        date: session?.date || new Date().toISOString().split('T')[0],
        duration: `${Math.floor(timerSeconds / 60)}m ${timerSeconds % 60}s`,
        questionsCount: updatedEvaluations.length,
        evaluations: updatedEvaluations,
        ...performanceSummary
      };

      // Save to persistence layer
      mockInterviewService.saveInterviewResult(finalRecord);

      setIsProcessingAnswer(false);
      if (aiInterviewerHook?.setHrState) {
        aiInterviewerHook.setHrState(HR_STATES.INTERVIEW_COMPLETE);
      }

      if (onSessionEnd) {
        try { onSessionEnd(); } catch (e) {}
      }

      navigate('/interview/result');
    }
  }, [
    isProcessingAnswer,
    currentQuestion,
    evaluations,
    questionIndex,
    session,
    timerSeconds,
    repeatAttempts,
    isPausedForFace,
    speechHook,
    aiInterviewerHook,
    navigate,
    onSessionEnd
  ]);

  // Skip Question (candidate explicitly skips)
  const handleSkipQuestion = useCallback(async () => {
    if (isProcessingAnswer || !currentQuestion || isPausedForFace) return;

    setIsProcessingAnswer(true);
    setIsTimerRunning(false);

    if (speechHook?.stopListening) {
      speechHook.stopListening();
    }

    const skippedEvaluation = dynamicInterviewService.createSkippedEvaluation(
      currentQuestion,
      Math.max(5, timerSeconds)
    );

    const updatedEvaluations = [...evaluations, skippedEvaluation];
    setEvaluations(updatedEvaluations);
    setRepeatAttempts(0);

    const nextIndex = questionIndex + 1;
    const totalQuestions = session?.totalQuestions || 5;

    if (nextIndex < totalQuestions) {
      if (aiInterviewerHook?.setHrState) {
        aiInterviewerHook.setHrState(HR_STATES.GENERATING_NEXT);
      }

      await new Promise(r => setTimeout(r, 600));

      const resume = mockResumeService.getActiveResume();
      const track = mockInterviewService.getActiveTrack();
      const followUp = dynamicInterviewService.generateFollowUpQuestion(
        currentQuestion,
        skippedEvaluation,
        resume,
        track,
        nextIndex,
        session?.baseQuestions
      );

      setCurrentQuestion(followUp);
      setQuestionIndex(nextIndex);
      setTimerSeconds(0);
      setIsTimerRunning(true);
      setIsProcessingAnswer(false);

      if (speechHook?.resetTranscript) {
        speechHook.resetTranscript();
      }

      if (aiInterviewerHook?.setHrState) {
        aiInterviewerHook.setHrState(HR_STATES.HR_SPEAKING);
      }

      if (speechHook?.speakText) {
        speechHook.speakText(followUp.text, () => {
          if (aiInterviewerHook?.setHrState) {
            aiInterviewerHook.setHrState(HR_STATES.CANDIDATE_LISTENING);
          }
          if (speechHook?.startListening) {
            speechHook.startListening();
          }
        });
      }
    } else {
      // INTERVIEW COMPLETE
      const resume = mockResumeService.getActiveResume();
      const track = mockInterviewService.getActiveTrack();
      const performanceSummary = dynamicInterviewService.calculatePerformance(updatedEvaluations, track, resume);

      const finalRecord = {
        interviewId: session?.interviewId || `INT-${Date.now()}`,
        resumeId: resume?.id || "res_candidate",
        candidate: session?.candidate || { name: resume?.name || "Candidate", email: resume?.email || "", college: resume?.college || "", degree: resume?.degree || "" },
        track: session?.track || track,
        difficulty: session?.difficulty || (track === 'fresher' ? 'Simple' : 'Hard'),
        date: session?.date || new Date().toISOString().split('T')[0],
        duration: `${Math.floor(timerSeconds / 60)}m ${timerSeconds % 60}s`,
        questionsCount: updatedEvaluations.length,
        evaluations: updatedEvaluations,
        ...performanceSummary
      };

      mockInterviewService.saveInterviewResult(finalRecord);
      setIsProcessingAnswer(false);
      if (aiInterviewerHook?.setHrState) {
        aiInterviewerHook.setHrState(HR_STATES.INTERVIEW_COMPLETE);
      }

      if (onSessionEnd) {
        try { onSessionEnd(); } catch (e) {}
      }

      navigate('/interview/result');
    }
  }, [
    isProcessingAnswer,
    currentQuestion,
    isPausedForFace,
    timerSeconds,
    evaluations,
    questionIndex,
    session,
    speechHook,
    aiInterviewerHook,
    navigate,
    onSessionEnd
  ]);

  // Finish Interview on demand
  const finishInterviewEarly = useCallback(() => {
    setIsTimerRunning(false);
    if (speechHook?.stopSpeaking) speechHook.stopSpeaking();
    if (speechHook?.stopListening) speechHook.stopListening();

    const resume = mockResumeService.getActiveResume();
    const track = mockInterviewService.getActiveTrack();
    const performanceSummary = dynamicInterviewService.calculatePerformance(evaluations, track, resume);

    const finalRecord = {
      interviewId: session?.interviewId || `INT-${Date.now()}`,
      resumeId: resume?.id || "res_candidate",
      candidate: session?.candidate || { name: resume?.name || "Candidate", email: resume?.email || "", college: resume?.college || "", degree: resume?.degree || "" },
      track: session?.track || track,
      difficulty: session?.difficulty || (track === 'fresher' ? 'Simple' : 'Hard'),
      date: session?.date || new Date().toISOString().split('T')[0],
      duration: `${Math.floor(timerSeconds / 60)}m ${timerSeconds % 60}s`,
      questionsCount: evaluations.length || 1,
      evaluations: evaluations.length > 0 ? evaluations : [
        dynamicInterviewService.analyzeCandidateAnswer(currentQuestion, "Initial baseline evaluation.", 15)
      ],
      ...performanceSummary
    };

    mockInterviewService.saveInterviewResult(finalRecord);

    if (onSessionEnd) {
      try { onSessionEnd(); } catch (e) {}
    }

    navigate('/interview/result');
  }, [session, evaluations, currentQuestion, timerSeconds, speechHook, navigate, onSessionEnd]);

  const repeatQuestion = useCallback(() => {
    if (!currentQuestion) return;
    if (aiInterviewerHook?.setHrState) {
      aiInterviewerHook.setHrState(HR_STATES.REPEATING);
    }
    if (speechHook?.speakText) {
      speechHook.speakText(currentQuestion.text, () => {
        if (aiInterviewerHook?.setHrState) {
          aiInterviewerHook.setHrState(HR_STATES.CANDIDATE_LISTENING);
        }
        if (speechHook.startListening) {
          speechHook.startListening();
        }
      });
    }
  }, [currentQuestion, aiInterviewerHook, speechHook]);

  return {
    session,
    currentQuestion,
    questionIndex,
    totalQuestions: session?.totalQuestions || 5,
    evaluations,
    isProcessingAnswer,
    timerSeconds,
    liveMetrics,
    isPausedForFace,
    initSession,
    startHRInterview,
    handleCandidateAnswer,
    handleSkipQuestion,
    finishInterviewEarly,
    repeatQuestion,
    resumeInterview
  };
};
