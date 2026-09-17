// Semantic Intent Classification Service for Natural Face-to-Face AI HR Interview

export const INTENTS = {
  VALID_ANSWER: "VALID_ANSWER",
  UNCERTAIN_ANSWER: "UNCERTAIN_ANSWER",
  REPEAT_REQUEST: "REPEAT_REQUEST",
  REPHRASE_REQUEST: "REPHRASE_REQUEST",
  INCOMPLETE_ANSWER: "INCOMPLETE_ANSWER",
  OFF_TOPIC: "OFF_TOPIC"
};

// Patterns and keywords for uncertainty / "I don't know"
const UNCERTAIN_PATTERNS = [
  /i('?m| am) not sure/i,
  /i don('?t| t) know/i,
  /i have no idea/i,
  /i don('?t| t) have (enough|much) knowledge/i,
  /not familiar with this/i,
  /not familiar with that/i,
  /unable to recall/i,
  /i can('?t| not) remember/i,
  /i don('?t| t) remember/i,
  /haven('?t| t) learned this/i,
  /haven('?t| t) worked (with|on) this/i,
  /no hands[- ]on experience/i,
  /don('?t| t) know how to answer/i,
  /not completely sure/i,
  /not entirely sure/i,
  /haven('?t| t) encountered this/i,
  /willing to learn it/i,
  /skip this/i,
  /pass on this/i,
  /no clue/i
];

// Patterns for repeat requests
const REPEAT_PATTERNS = [
  /repeat the question/i,
  /repeat that/i,
  /say that again/i,
  /ask (the question|it) again/i,
  /could you repeat/i,
  /can you repeat/i,
  /one more time/i,
  /didn('?t| t) hear/i,
  /pardon/i,
  /come again/i
];

// Patterns for rephrase / clarification requests
const REPHRASE_PATTERNS = [
  /rephrase the question/i,
  /rephrase that/i,
  /clarify what you mean/i,
  /explain what you mean/i,
  /didn('?t| t) understand the question/i,
  /didn('?t| t) get the question/i,
  /what do you mean/i,
  /can you explain the question/i,
  /could you simplify/i,
  /in simpler terms/i
];

export const semanticIntentService = {
  // Classifies candidate speech transcript into structured semantic intent
  classifyIntent: (transcript = "") => {
    const text = transcript.trim().toLowerCase();

    if (!text || text.length < 3) {
      return {
        intent: INTENTS.INCOMPLETE_ANSWER,
        confidence: 0.9,
        reason: "Empty or extremely short response."
      };
    }

    // 1. Check for Rephrase Request
    for (const pattern of REPHRASE_PATTERNS) {
      if (pattern.test(text)) {
        return {
          intent: INTENTS.REPHRASE_REQUEST,
          confidence: 0.95,
          reason: "Candidate explicitly requested the question to be rephrased or clarified."
        };
      }
    }

    // 2. Check for Repeat Request
    for (const pattern of REPEAT_PATTERNS) {
      if (pattern.test(text)) {
        return {
          intent: INTENTS.REPEAT_REQUEST,
          confidence: 0.95,
          reason: "Candidate explicitly requested the HR to repeat the question."
        };
      }
    }

    // 3. Check for Uncertainty / "I don't know"
    for (const pattern of UNCERTAIN_PATTERNS) {
      if (pattern.test(text)) {
        return {
          intent: INTENTS.UNCERTAIN_ANSWER,
          confidence: 0.92,
          reason: "Candidate indicated unfamiliarity or uncertainty regarding this topic."
        };
      }
    }

    // 4. Check for very brief incomplete utterances (< 5 words)
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    if (wordCount < 4) {
      return {
        intent: INTENTS.INCOMPLETE_ANSWER,
        confidence: 0.8,
        reason: "Answer is too brief to evaluate technical understanding."
      };
    }

    // 5. Default: Valid Technical Answer
    return {
      intent: INTENTS.VALID_ANSWER,
      confidence: 0.9,
      reason: "Candidate provided a structured technical response."
    };
  },

  // Generates a conversational, simplified rephrase of the current question
  generateRephrase: (question) => {
    const topic = question.topic || "this topic";
    const text = question.text || "";

    if (text.toLowerCase().includes("project") || question.category?.includes("Project")) {
      return `Sure. I mean, what specific features or modules did you personally architect and implement in ${topic}?`;
    }

    if (text.toLowerCase().includes("state") || text.toLowerCase().includes("async")) {
      return `Certainly. To put it simply: how do you manage data and updates across your components in ${topic}?`;
    }

    if (text.toLowerCase().includes("api") || text.toLowerCase().includes("backend")) {
      return `Of course. In simple terms: how do you connect your application to backend APIs and handle errors?`;
    }

    if (text.toLowerCase().includes("team") || text.toLowerCase().includes("leadership")) {
      return `Sure. I'm asking how you work with team members when reviewing code and making engineering decisions.`;
    }

    return `Certainly. Let me simplify: can you explain how you worked with ${topic} in your practical experience?`;
  },

  // Generates polite HR voice transitions when repeating or clarifying
  getRepeatPrefix: (attemptNumber = 1) => {
    if (attemptNumber === 1) {
      return "No problem, let me ask you once again:";
    }
    return "Let's revisit this question one more time:";
  },

  getRephrasePrefix: () => {
    return "Sure, let me rephrase that in simpler terms:";
  },

  getUncertainTransitionPrefix: () => {
    return "That is completely fine. Let me repeat the question so you can take another moment:";
  }
};
