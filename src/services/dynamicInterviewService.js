import { generateQuestionsFromResume } from '../data/mockQuestions';
import { evaluateAnswer, createSkippedEvaluation, getPerformanceTier, EVALUATION_WEIGHTS } from '../data/mockEvaluations';

export const dynamicInterviewService = {
  // Initialize interview context with current resume only
  startInterview: (resume, track = 'fresher') => {
    const baseQuestions = generateQuestionsFromResume(resume, track);
    return {
      interviewId: `INT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      resumeId: resume.id,
      candidate: {
        name: resume.name,
        email: resume.email,
        college: resume.college,
        degree: resume.degree,
        graduationYear: resume.graduationYear
      },
      track: track === 'experience' ? 'Real-Time Experience Track' : 'Fresher Track',
      difficulty: track === 'experience' ? 'Hard' : 'Simple',
      date: new Date().toISOString().split('T')[0],
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      baseQuestions,
      currentQuestionIndex: 0,
      totalQuestions: 5,
      questions: [baseQuestions[0]], // Starts with first dynamic question
      answers: [],
      evaluations: [],
      isFinished: false
    };
  },

  // Extract structured highlights from current resume
  analyzeResume: (resume) => {
    return {
      candidateName: resume.name,
      education: `${resume.degree}, ${resume.college} (${resume.graduationYear})`,
      skillsSummary: [
        ...(resume.skills?.languages || []),
        ...(resume.skills?.frameworks || []),
        ...(resume.skills?.tools || [])
      ],
      primaryProjects: (resume.projects || []).map(p => p.title),
      primaryExperience: (resume.workExperience || resume.internships || []).map(e => `${e.role} at ${e.company}`),
      certifications: resume.certifications || []
    };
  },

  // First question
  generateFirstQuestion: (resume, track) => {
    const questions = generateQuestionsFromResume(resume, track);
    return questions[0];
  },

  // Analyze candidate's spoken or typed answer
  analyzeCandidateAnswer: (question, answerText, responseTimeSec = 25) => {
    return evaluateAnswer(question, answerText, responseTimeSec);
  },

  // Create skipped question record
  createSkippedEvaluation: (question, responseTimeSec = 5) => {
    return createSkippedEvaluation(question, responseTimeSec);
  },

  // Generate dynamic follow-up strictly connected to candidate's answer and current resume
  generateFollowUpQuestion: (previousQuestion, evaluation, resume, track, questionIndex, baseQuestions) => {
    const isFresher = track === 'fresher' || track === 'Fresher Track';
    const isSkipped = evaluation?.isSkipped;
    const answerText = (evaluation?.answerText || "").toLowerCase();

    // If previous question was skipped, transition cleanly to the next core resume area
    if (isSkipped) {
      if (baseQuestions && baseQuestions[questionIndex]) {
        return {
          ...baseQuestions[questionIndex],
          id: `q_next_${questionIndex}`,
          difficulty: isFresher ? "Simple" : "Moderate",
          text: baseQuestions[questionIndex].text
        };
      }
    }

    // 1. If candidate specifically mentioned a technical term or project detail, craft a contextual follow-up
    if (answerText.includes('state') || answerText.includes('redux') || answerText.includes('context') || answerText.includes('hook')) {
      return {
        id: `q_followup_${questionIndex}`,
        category: "Dynamic Technical Follow-Up",
        topic: "State Synchronization & Re-renders",
        resumeSource: `Dynamic Follow-up grounded in your response about State Management`,
        text: isFresher 
          ? `How do you prevent unnecessary re-renders when passing state or callbacks down the component tree in React?`
          : `How did you architect distributed state synchronization or caching to guarantee consistency across browser tabs?`,
        difficulty: isFresher ? "Moderate" : "Hard",
        targetKeywords: ["usememo", "usecallback", "re-render", "memo", "props", "consistency", "performance"]
      };
    }

    if (answerText.includes('api') || answerText.includes('backend') || answerText.includes('fetch') || answerText.includes('endpoint')) {
      return {
        id: `q_followup_${questionIndex}`,
        category: "Dynamic API Architecture Follow-Up",
        topic: "Asynchronous Data & Error Boundaries",
        resumeSource: `Dynamic Follow-up grounded in your response about API integration`,
        text: isFresher
          ? `How do you handle loading states, network dropouts, and graceful error messages for end users when consuming REST APIs?`
          : `What strategies did you employ for circuit breaking, exponential backoff, and idempotent retry policies during downstream service degradation?`,
        difficulty: isFresher ? "Moderate" : "Hard",
        targetKeywords: ["loading", "error", "fallback", "try-catch", "timeout", "retry", "resilience"]
      };
    }

    if (answerText.includes('team') || answerText.includes('review') || answerText.includes('git') || answerText.includes('agile')) {
      return {
        id: `q_followup_${questionIndex}`,
        category: "Dynamic Collaboration Follow-Up",
        topic: "Engineering Standards & Code Reviews",
        resumeSource: `Dynamic Follow-up grounded in your response about Team Collaboration`,
        text: `Can you share an example of how you handle conflicting opinions during code reviews while upholding high engineering standards?`,
        difficulty: isFresher ? "Simple" : "Hard",
        targetKeywords: ["empathy", "standards", "discussion", "linting", "documentation", "consensus"]
      };
    }

    // 2. Next base question from resume list
    if (baseQuestions && baseQuestions[questionIndex]) {
      const nextBase = baseQuestions[questionIndex];
      const previousScore = evaluation?.scores?.overall || 75;

      return {
        ...nextBase,
        id: `q_adaptive_${questionIndex}`,
        difficulty: previousScore >= 85 ? "Hard" : isFresher ? "Simple" : "Moderate",
        text: nextBase.text
      };
    }

    // 3. Final concluding reflection from resume summary
    return {
      id: `q_concluding_${questionIndex}`,
      category: "Final Summary & Problem Solving",
      topic: "Engineering Impact",
      resumeSource: `Resume Overview`,
      text: `Reflecting on the projects and skills on your resume, what is the single most rewarding technical problem you solved, and what made it so impactful?`,
      difficulty: "Moderate",
      targetKeywords: ["impact", "challenge", "solution", "learning", "outcome"]
    };
  },

  // Final performance calculation summing question evaluations strictly by weightage and tracking answered vs skipped
  calculatePerformance: (evaluations, track, resume) => {
    if (!evaluations || evaluations.length === 0) {
      return {
        overallScore: 75,
        totalQuestions: 5,
        answeredQuestions: 5,
        skippedQuestions: 0,
        performanceLevel: "Good",
        scores: { technical: 75, communication: 75, confidence: 75, relevance: 75, completeness: 75, fluency: 75, problemSolving: 75 },
        strengths: ["Clear communication"],
        weaknesses: ["Add more quantifiable metrics"],
        skillGaps: [],
        recommendations: [],
        improvementPlan: []
      };
    }

    const totalQuestions = evaluations.length;
    const answeredEvaluations = evaluations.filter(e => !e.isSkipped);
    const answeredCount = answeredEvaluations.length;
    const skippedCount = evaluations.filter(e => e.isSkipped).length;

    // Averages on attempted/answered questions
    const evalSet = answeredEvaluations.length > 0 ? answeredEvaluations : evaluations;
    const n = evalSet.length;

    const totals = evalSet.reduce((acc, ev) => {
      const s = ev.scores;
      acc.technical += s.technical;
      acc.relevance += s.relevance;
      acc.communication += s.communication;
      acc.completeness += s.completeness;
      acc.problemSolving += s.problemSolving;
      acc.confidence += s.confidence;
      acc.fluency += s.fluency;
      return acc;
    }, { technical: 0, relevance: 0, communication: 0, completeness: 0, problemSolving: 0, confidence: 0, fluency: 0 });

    const avgScores = {
      technical: Math.round(totals.technical / n),
      relevance: Math.round(totals.relevance / n),
      communication: Math.round(totals.communication / n),
      completeness: Math.round(totals.completeness / n),
      problemSolving: Math.round(totals.problemSolving / n),
      confidence: Math.round(totals.confidence / n),
      fluency: Math.round(totals.fluency / n)
    };

    // Overall Score Weighted calculation (adjusted proportionally for answered vs total)
    const baseWeightedScore = Math.round(
      avgScores.technical * EVALUATION_WEIGHTS.technical +
      avgScores.relevance * EVALUATION_WEIGHTS.relevance +
      avgScores.communication * EVALUATION_WEIGHTS.communication +
      avgScores.completeness * EVALUATION_WEIGHTS.completeness +
      avgScores.problemSolving * EVALUATION_WEIGHTS.problemSolving +
      avgScores.confidence * EVALUATION_WEIGHTS.confidence +
      avgScores.fluency * EVALUATION_WEIGHTS.fluency
    );

    // Apply transparent penalty for skipped questions
    const completionFactor = answeredCount / totalQuestions;
    const overallScore = Math.round(baseWeightedScore * (0.5 + 0.5 * completionFactor));

    const tier = getPerformanceTier(overallScore);

    // Strengths only from genuinely answered questions
    const strengths = answeredEvaluations
      .filter(ev => ev.scores.overall >= 75)
      .map(ev => ev.strength)
      .slice(0, 3);
    
    if (strengths.length === 0) {
      strengths.push("Attempted core resume questions with willingness to structure thoughts.");
    }

    // Weaknesses including skipped questions note if applicable
    const weaknesses = answeredEvaluations
      .filter(ev => ev.scores.overall < 85)
      .map(ev => ev.weakness)
      .slice(0, 3);

    if (skippedCount > 0) {
      weaknesses.unshift(`${skippedCount} question(s) were skipped. Skipping questions reduced the overall interview performance score because responses were not provided for those topics.`);
    }

    if (weaknesses.length === 0) {
      weaknesses.push("Can incorporate more advanced distributed system trade-offs to reach senior engineering excellence.");
    }

    // Calculate actual skill gaps
    const skillGaps = [];
    if (avgScores.technical < 85) {
      skillGaps.push({
        skill: "Technical Depth & Architectural Precision",
        currentScore: avgScores.technical,
        targetScore: 88,
        gap: 88 - avgScores.technical,
        reason: "Answers demonstrated foundational familiarity but skipped underlying runtime mechanics.",
        recommendation: "Deep dive into framework internals, memory management, and asynchronous event loops."
      });
    }
    if (skippedCount > 0) {
      skillGaps.push({
        skill: "Topic Breadth & Preparation Coverage",
        currentScore: Math.round(completionFactor * 100),
        targetScore: 90,
        gap: 90 - Math.round(completionFactor * 100),
        reason: `${skippedCount} question(s) were skipped during the live session.`,
        recommendation: "Prepare quick talking points for all projects and tools listed on your resume to attempt every question."
      });
    }

    // Personalized Actionable Improvement Plan
    const improvementPlan = [
      {
        step: 1,
        title: "Master Project Architecture Walkthroughs",
        focus: `Practice articulating data flows for "${resume.projects?.[0]?.title || 'primary resume projects'}" in under 2 minutes.`,
        timeline: "Days 1 - 2"
      },
      {
        step: 2,
        title: "Quantify Technical Impact",
        focus: "Annotate resume bullet points with concrete metrics (% latency reduction, RPS handled, test coverage).",
        timeline: "Days 3 - 4"
      },
      {
        step: 3,
        title: "Dynamic Follow-Up Simulation",
        focus: "Retake the AI HR Mock Interview with Real-Time Experience track to drill unpredictable edge-case questions.",
        timeline: "Days 5 - 7"
      }
    ];

    let finalFeedback = `Overall, you demonstrated a ${tier.label.toLowerCase()} performance with a strong foundation in ${(resume.skills?.frameworks || ['modern web frameworks'])[0]}.`;
    if (skippedCount > 0) {
      finalFeedback += ` Note: ${skippedCount} question(s) were skipped, which affected your overall completion rating. Preparing talking points for all listed resume items will help you maximize your score.`;
    } else {
      finalFeedback += ` By incorporating quantifiable performance metrics and framing your responses using the STAR method, you will be well prepared to excel in competitive technical interviews.`;
    }

    return {
      overallScore,
      totalQuestions,
      answeredQuestions: answeredCount,
      skippedQuestions: skippedCount,
      performanceLevel: tier.label,
      scores: avgScores,
      strengths,
      weaknesses,
      skillGaps,
      improvementPlan,
      finalFeedback
    };
  }
};
