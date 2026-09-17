// Mock evaluation engine and rubric calculations strictly honoring the weightage formula:
// Technical Knowledge 30%, Relevance 15%, Communication 15%, Completeness 10%, Problem Solving 10%, Confidence 10%, Fluency & Grammar 10%

export const EVALUATION_WEIGHTS = {
  technical: 0.30,
  relevance: 0.15,
  communication: 0.15,
  completeness: 0.10,
  problemSolving: 0.10,
  confidence: 0.10,
  fluency: 0.10
};

export const getPerformanceTier = (score) => {
  if (score >= 90) return { label: "Excellent", color: "text-emerald-400", badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" };
  if (score >= 80) return { label: "Very Good", color: "text-cyan-400", badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30" };
  if (score >= 70) return { label: "Good", color: "text-blue-400", badge: "bg-blue-500/20 text-blue-300 border-blue-500/30" };
  if (score >= 60) return { label: "Needs Improvement", color: "text-amber-400", badge: "bg-amber-500/20 text-amber-300 border-amber-500/30" };
  return { label: "Needs Significant Improvement", color: "text-rose-400", badge: "bg-rose-500/20 text-rose-300 border-rose-500/30" };
};

// Evaluates a candidate's actual answer text against the question and target resume keywords
export const evaluateAnswer = (question, answerText, responseTimeSec = 24) => {
  const words = answerText.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const answerLower = answerText.toLowerCase();

  // Keyword match analysis
  const matchedKeywords = (question.targetKeywords || []).filter(kw => answerLower.includes(kw.toLowerCase()));
  const keywordDensity = question.targetKeywords?.length ? matchedKeywords.length / question.targetKeywords.length : 0.6;

  // Base metrics based on answer length, structure and keywords
  let technical = Math.min(96, Math.max(50, Math.round(55 + keywordDensity * 35 + (wordCount > 40 ? 10 : 0))));
  let relevance = Math.min(98, Math.max(52, Math.round(60 + keywordDensity * 32 + (wordCount > 25 ? 8 : 0))));
  let communication = Math.min(95, Math.max(50, Math.round(58 + (wordCount > 50 ? 25 : wordCount > 25 ? 18 : 10))));
  let completeness = Math.min(95, Math.max(48, Math.round(52 + (wordCount > 60 ? 35 : wordCount > 30 ? 25 : 12))));
  let problemSolving = Math.min(94, Math.max(50, Math.round(56 + (answerLower.includes('because') || answerLower.includes('result') || answerLower.includes('how') ? 25 : 12))));
  let confidence = Math.min(92, Math.max(55, Math.round(65 + (responseTimeSec > 10 && responseTimeSec < 60 ? 20 : 10))));
  let fluency = Math.min(95, Math.max(55, Math.round(62 + (wordCount > 35 ? 24 : 15))));

  // Overall question weighted score
  const score = Math.round(
    technical * EVALUATION_WEIGHTS.technical +
    relevance * EVALUATION_WEIGHTS.relevance +
    communication * EVALUATION_WEIGHTS.communication +
    completeness * EVALUATION_WEIGHTS.completeness +
    problemSolving * EVALUATION_WEIGHTS.problemSolving +
    confidence * EVALUATION_WEIGHTS.confidence +
    fluency * EVALUATION_WEIGHTS.fluency
  );

  // Evidence-based feedback generation
  let strength = "";
  let weakness = "";
  let feedback = "";
  let suggestion = "";

  if (keywordDensity > 0.4 && wordCount >= 35) {
    strength = `Directly addressed ${question.topic} with accurate technical terminology (${matchedKeywords.slice(0, 3).join(', ') || 'domain concepts'}).`;
    weakness = wordCount < 60 ? "Could expand on quantifiable performance metrics and operational trade-offs." : "Minor pacing variations in complex technical explanations.";
    feedback = `Solid answer demonstrating practical familiarity with ${question.topic}. You explained your rationale cleanly.`;
    suggestion = `Use the STAR method (Situation, Task, Action, Result) to state specific percentage improvements or user impact metrics.`;
  } else if (wordCount < 25) {
    strength = "Concise response that stayed within the immediate question topic.";
    weakness = "Answer was too brief and missed key architectural details and implementation mechanics.";
    feedback = `Your answer was relevant, but you did not adequately elaborate on your specific technical contributions or problem-solving process.`;
    suggestion = `Practice expanding your explanations into 3 distinct sections: problem context, chosen technical solution, and resulting outcome.`;
  } else {
    strength = `Good conversational flow and natural confidence while discussing ${question.topic}.`;
    weakness = `Missed connecting the theoretical concepts directly to the concrete implementation in your resume project.`;
    feedback = `You communicated clearly, but grounding your answers in specific project files or system workflows will significantly boost technical credibility.`;
    suggestion = `Anchor your response by mentioning specific libraries, APIs, or data flows you personally engineered.`;
  }

  return {
    questionId: question.id,
    questionText: question.text,
    category: question.category,
    topic: question.topic,
    status: "Answered",
    isSkipped: false,
    answerText: answerText,
    wordCount,
    responseTimeSec,
    scores: {
      technical,
      relevance,
      communication,
      completeness,
      problemSolving,
      confidence,
      fluency,
      overall: score
    },
    matchedKeywords,
    strength,
    weakness,
    feedback,
    suggestion
  };
};

// Creates a structured skipped question record without positive scoring
export const createSkippedEvaluation = (question, responseTimeSec = 5) => {
  return {
    questionId: question.id,
    questionText: question.text,
    category: question.category,
    topic: question.topic,
    status: "Skipped",
    isSkipped: true,
    answerText: "No answer provided — candidate skipped the question.",
    wordCount: 0,
    responseTimeSec,
    scores: {
      technical: 0,
      relevance: 0,
      communication: 0,
      completeness: 0,
      problemSolving: 0,
      confidence: 0,
      fluency: 0,
      overall: 0
    },
    matchedKeywords: [],
    strength: "None recorded (Question Skipped)",
    weakness: "Candidate chose not to provide an answer for this resume topic.",
    feedback: "Question skipped by candidate (Not Attempted). No positive performance credit awarded.",
    suggestion: `Review ${question.topic || 'the technical concepts'} in your resume and prepare structured bullet points for future discussions.`
  };
};
