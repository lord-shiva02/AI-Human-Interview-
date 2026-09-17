// Seed interview session history and persistent storage helper

export const INITIAL_INTERVIEWS = [
  {
    interviewId: "INT-2026-8941",
    resumeId: "res_fresher_alex",
    candidate: {
      name: "Alex Chen",
      email: "alex.chen@techmail.io",
      college: "Stanford University of Technology",
      degree: "B.S. in Computer Science",
      graduationYear: "2026"
    },
    track: "Fresher Track",
    difficulty: "Simple",
    date: "2026-08-22",
    timestamp: "10:30 AM",
    duration: "14m 20s",
    overallScore: 84,
    performanceLevel: "Very Good",
    scores: {
      technical: 86,
      communication: 82,
      confidence: 85,
      relevance: 88,
      completeness: 80,
      fluency: 84,
      problemSolving: 82
    },
    strengths: [
      "Clear explanation of React state management and asynchronous data fetching",
      "Grounded knowledge of the AI Interview Assistant architecture and speech synthesis pipeline",
      "Polite, structured communication with steady conversational cadence"
    ],
    weaknesses: [
      "Could elaborate more deeply on database query optimizations and caching strategies",
      "Did not fully quantify the performance improvements in the Weather Dashboard project"
    ],
    skillGaps: [
      { skill: "System Scalability & Caching", currentScore: 72, targetScore: 88, gap: 16, recommendation: "Study Redis distributed caching and query indexing mechanisms." },
      { skill: "Quantitative Impact Framing", currentScore: 75, targetScore: 90, gap: 15, recommendation: "Frame project outcomes using concrete latency and throughput benchmarks." }
    ],
    improvementPlan: [
      { step: 1, title: "Review Asynchronous Error Handling", focus: "Deepen understanding of error boundaries, try-catch in async hooks, and fallback states.", timeline: "Day 1-2" },
      { step: 2, title: "Practice STAR Storytelling", focus: "Structure every project answer with Context → Role → Action → Quantified Impact.", timeline: "Day 3-4" },
      { step: 3, title: "Simulate Follow-up Drills", focus: "Run 3 mock interviews answering unexpected architectural trade-off questions.", timeline: "Day 5-7" }
    ],
    questionsCount: 5
  },
  {
    interviewId: "INT-2026-7712",
    resumeId: "res_fresher_alex",
    candidate: {
      name: "Alex Chen",
      email: "alex.chen@techmail.io",
      college: "Stanford University of Technology",
      degree: "B.S. in Computer Science",
      graduationYear: "2026"
    },
    track: "Fresher Track",
    difficulty: "Simple",
    date: "2026-08-18",
    timestamp: "03:15 PM",
    duration: "12m 45s",
    overallScore: 78,
    performanceLevel: "Good",
    scores: {
      technical: 79,
      communication: 76,
      confidence: 78,
      relevance: 82,
      completeness: 75,
      fluency: 78,
      problemSolving: 76
    },
    strengths: [
      "Good foundational grasp of JavaScript ES6+ and modern web architecture",
      "Honest identification of technical trade-offs during project build phases"
    ],
    weaknesses: [
      "Hesitation when asked about state synchronization between components",
      "Answers occasionally drifted before arriving at the core technical point"
    ],
    skillGaps: [
      { skill: "Concise Technical Delivery", currentScore: 74, targetScore: 85, gap: 11, recommendation: "Practice opening answers with direct 1-sentence executive summaries." }
    ],
    improvementPlan: [
      { step: 1, title: "Component Lifecycle Mastery", focus: "Solidify React 18 concurrency, useEffect dependencies, and memoization hooks.", timeline: "Week 1" }
    ],
    questionsCount: 4
  }
];

export const STORAGE_KEY_INTERVIEWS = "ai_interview_history_records";
export const STORAGE_KEY_CURRENT_RESUME = "ai_interview_active_resume";
export const STORAGE_KEY_CURRENT_TRACK = "ai_interview_active_track";
export const STORAGE_KEY_LATEST_RESULT = "ai_interview_latest_result";
export const STORAGE_KEY_USER_PROFILE = "ai_interview_user_profile";
