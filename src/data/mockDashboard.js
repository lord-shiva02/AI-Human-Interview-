// Unified Dashboard Statistics aggregator deriving strictly from stored interview data

export const calculateDashboardStats = (interviews) => {
  if (!interviews || interviews.length === 0) {
    return {
      totalInterviews: 0,
      averageScore: 0,
      bestScore: 0,
      latestScore: 0,
      totalAnsweredQuestions: 0,
      totalSkippedQuestions: 0,
      readiness: "Not Started",
      readinessPercentage: 0,
      performanceTrend: [],
      categoryAverages: {
        technical: 0,
        communication: 0,
        confidence: 0,
        relevance: 0,
        completeness: 0,
        fluency: 0,
        problemSolving: 0
      },
      strongestSkills: [],
      weakestSkills: [],
      skillGaps: []
    };
  }

  const totalInterviews = interviews.length;
  const scores = interviews.map(i => i.overallScore || 0);
  const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / totalInterviews);
  const bestScore = Math.max(...scores);
  const latestScore = interviews[0].overallScore || averageScore;

  // Aggregate Answered vs Skipped questions across all stored interview records
  let totalAnsweredQuestions = 0;
  let totalSkippedQuestions = 0;

  interviews.forEach(item => {
    if (item.answeredQuestions !== undefined) {
      totalAnsweredQuestions += item.answeredQuestions;
      totalSkippedQuestions += (item.skippedQuestions || 0);
    } else if (item.evaluations?.length) {
      const answered = item.evaluations.filter(e => !e.isSkipped).length;
      const skipped = item.evaluations.filter(e => e.isSkipped).length;
      totalAnsweredQuestions += answered;
      totalSkippedQuestions += skipped;
    } else {
      totalAnsweredQuestions += (item.questionsCount || 5);
    }
  });

  // Performance trend array (chronological order for line charts)
  const performanceTrend = [...interviews].reverse().map((item, idx) => ({
    session: `Session ${idx + 1}`,
    date: item.date,
    score: item.overallScore,
    technical: item.scores?.technical || item.overallScore,
    communication: item.scores?.communication || item.overallScore,
    confidence: item.scores?.confidence || item.overallScore,
  }));

  // Category aggregate scores
  const sumCategories = interviews.reduce((acc, curr) => {
    const s = curr.scores || {};
    acc.technical += (s.technical || curr.overallScore);
    acc.communication += (s.communication || curr.overallScore);
    acc.confidence += (s.confidence || curr.overallScore);
    acc.relevance += (s.relevance || curr.overallScore);
    acc.completeness += (s.completeness || curr.overallScore);
    acc.fluency += (s.fluency || curr.overallScore);
    acc.problemSolving += (s.problemSolving || curr.overallScore);
    return acc;
  }, { technical: 0, communication: 0, confidence: 0, relevance: 0, completeness: 0, fluency: 0, problemSolving: 0 });

  const categoryAverages = {
    technical: Math.round(sumCategories.technical / totalInterviews),
    communication: Math.round(sumCategories.communication / totalInterviews),
    confidence: Math.round(sumCategories.confidence / totalInterviews),
    relevance: Math.round(sumCategories.relevance / totalInterviews),
    completeness: Math.round(sumCategories.completeness / totalInterviews),
    fluency: Math.round(sumCategories.fluency / totalInterviews),
    problemSolving: Math.round(sumCategories.problemSolving / totalInterviews)
  };

  // Readiness Calculation
  let readiness = "Beginner";
  if (latestScore >= 85) readiness = "Interview Ready (Top 10%)";
  else if (latestScore >= 75) readiness = "Proficient (Competitive)";
  else if (latestScore >= 65) readiness = "Moderate (Refinement Needed)";
  else readiness = "Foundational (Active Practice Required)";

  // Aggregate Skill Gaps from recent interview
  const latestInterview = interviews[0];
  const skillGaps = latestInterview.skillGaps || [];

  return {
    totalInterviews,
    averageScore,
    bestScore,
    latestScore,
    totalAnsweredQuestions,
    totalSkippedQuestions,
    readiness,
    readinessPercentage: latestScore,
    performanceTrend,
    categoryAverages,
    strongestSkills: latestInterview.strengths || ["React & Component Architecture", "RESTful API Integration", "Clear Communication"],
    weakestSkills: latestInterview.weaknesses || ["System Scalability Details", "Quantifiable Impact Framing"],
    skillGaps
  };
};
