// Question taxonomy strictly grounded in resume metadata

export const generateQuestionsFromResume = (resume, track = 'fresher') => {
  const isFresher = track === 'fresher' || track === 'Fresher Track';
  const questions = [];

  // 1. Ice-breaker & Background grounded in degree/college
  if (isFresher) {
    questions.push({
      id: "q_intro",
      category: "Introduction & Background",
      topic: `${resume.degree} from ${resume.college}`,
      sourceResumeField: "Education",
      sourceResumeValue: `${resume.degree}, ${resume.college}`,
      resumeSource: `Education: ${resume.degree}, ${resume.college}`,
      text: `Hello ${resume.name.split(' ')[0]}, welcome to your interview. To begin, please introduce yourself and share the core takeaways from completing your ${resume.degree} at ${resume.college}.`,
      difficulty: "Simple",
      targetKeywords: ["fundamentals", "curiosity", "projects", "learning", "growth", resume.degree?.toLowerCase() || "cs"]
    });
  } else {
    const leadRole = resume.workExperience?.[0]?.role || "Senior Developer";
    const leadCompany = resume.workExperience?.[0]?.company || "your recent company";
    questions.push({
      id: "q_intro_exp",
      category: "Professional Background & Experience",
      topic: `${leadRole} at ${leadCompany}`,
      sourceResumeField: "Experience",
      sourceResumeValue: `${leadRole} at ${leadCompany}`,
      resumeSource: `Work Experience: ${leadRole} at ${leadCompany}`,
      text: `Welcome ${resume.name.split(' ')[0]}. In your resume, you highlighted your role as ${leadRole} at ${leadCompany}. Could you summarize the core architectural responsibilities you owned and how you shaped the engineering culture?`,
      difficulty: "Hard",
      targetKeywords: ["architecture", "scale", "team", "mentorship", "deliverables", "leadership"]
    });
  }

  // 2. Deep Dive on Project 1
  if (resume.projects && resume.projects.length > 0) {
    const p1 = resume.projects[0];
    const techStr = (p1.techStack || []).join(', ');
    if (isFresher) {
      questions.push({
        id: "q_proj_1",
        category: "Project Deep Dive",
        topic: p1.title,
        sourceResumeField: "Projects",
        sourceResumeValue: p1.title,
        resumeSource: `Project: ${p1.title} (${techStr})`,
        text: `I noticed your project titled "${p1.title}" built using ${techStr}. Can you walk me through the overall problem it solves and what specific technical challenges you encountered during development?`,
        difficulty: "Moderate",
        targetKeywords: [...(p1.techStack || []).map(t => t.toLowerCase()), "architecture", "state", "user", "api", "solved"]
      });
    } else {
      questions.push({
        id: "q_proj_1_exp",
        category: "System Architecture & Resilience",
        topic: p1.title,
        sourceResumeField: "Projects",
        sourceResumeValue: p1.title,
        resumeSource: `Project: ${p1.title} (${techStr})`,
        text: `Regarding your project "${p1.title}", which utilized ${techStr}: how did you architect the system for high availability, fault tolerance, and data consistency under high concurrent load?`,
        difficulty: "Hard",
        targetKeywords: [...(p1.techStack || []).map(t => t.toLowerCase()), "concurrency", "latency", "failure", "idempotency", "throughput"]
      });
    }
  }

  // 3. Technical Skill & Framework specific question
  const primarySkills = resume.skills?.frameworks || resume.skills?.languages || [];
  const primarySkill = primarySkills[0] || "JavaScript";
  const secondarySkill = primarySkills[1] || "React";

  if (isFresher) {
    questions.push({
      id: "q_tech_skill",
      category: "Technical Stack Proficiency",
      topic: `${primarySkill} and ${secondarySkill}`,
      sourceResumeField: "Skills",
      sourceResumeValue: `${primarySkill}, ${secondarySkill}`,
      resumeSource: `Skills: ${primarySkill}, ${secondarySkill}`,
      text: `Your resume lists proficiency in ${primarySkill} and ${secondarySkill}. Can you explain how you structure state management and handle asynchronous side-effects when building modern web applications?`,
      difficulty: "Simple",
      targetKeywords: [primarySkill.toLowerCase(), "async", "state", "hooks", "lifecycle", "optimization"]
    });
  } else {
    const primaryTool = resume.skills?.tools?.[0] || "Docker";
    questions.push({
      id: "q_tech_skill_exp",
      category: "Distributed Systems & Tooling",
      topic: `${primarySkill} with ${primaryTool}`,
      sourceResumeField: "Skills",
      sourceResumeValue: `${primarySkill}, ${primaryTool}`,
      resumeSource: `Skills: ${primarySkill}, Tools: ${primaryTool}`,
      text: `Given your extensive work with ${primarySkill} alongside tools like ${primaryTool}, how do you evaluate technical debt versus delivery velocity when refactoring mission-critical services?`,
      difficulty: "Hard",
      targetKeywords: ["technical debt", "refactoring", "trade-offs", "monitoring", "cicd", "observability"]
    });
  }

  // 4. Practical Experience / Internship / Leadership question
  if (resume.workExperience && resume.workExperience.length > 0) {
    const exp = resume.workExperience[0];
    questions.push({
      id: "q_exp_leadership",
      category: "Leadership & Incident Handling",
      topic: `${exp.role} Responsibilities`,
      sourceResumeField: "Experience",
      sourceResumeValue: `${exp.role} at ${exp.company}`,
      resumeSource: `Experience: ${exp.role} at ${exp.company}`,
      text: `In your role as ${exp.role}, you mentioned managing critical deliverables. Can you describe a real incident where a production deployment caused a disruption, and how you led your team to diagnose and resolve it?`,
      difficulty: "Hard",
      targetKeywords: ["incident", "rollback", "post-mortem", "metrics", "resolution", "communication"]
    });
  } else if (resume.internships && resume.internships.length > 0) {
    const intern = resume.internships[0];
    questions.push({
      id: "q_internship",
      category: "Practical Application & Teamwork",
      topic: `Internship at ${intern.company}`,
      sourceResumeField: "Experience",
      sourceResumeValue: `Internship at ${intern.company}`,
      resumeSource: `Internship: ${intern.role} at ${intern.company}`,
      text: `During your internship at ${intern.company} as a ${intern.role}, you collaborated within an engineering team. How did you incorporate feedback from code reviews to improve code quality and maintainability?`,
      difficulty: "Simple",
      targetKeywords: ["code review", "feedback", "git", "collaboration", "testing", "best practices"]
    });
  } else if (resume.projects && resume.projects.length > 1) {
    const p2 = resume.projects[1];
    questions.push({
      id: "q_proj_2",
      category: "Secondary Project Implementation",
      topic: p2.title,
      sourceResumeField: "Projects",
      sourceResumeValue: p2.title,
      resumeSource: `Project: ${p2.title}`,
      text: `Looking at your secondary project "${p2.title}", what was your decision-making process behind choosing the specific technology stack over alternatives?`,
      difficulty: "Moderate",
      targetKeywords: ["trade-offs", "stack", "performance", "scalability", "maintainability"]
    });
  }

  // 5. Certifications & Continuous Learning
  if (resume.certifications && resume.certifications.length > 0) {
    const cert = resume.certifications[0];
    questions.push({
      id: "q_cert",
      category: "Continuous Growth & Certification",
      topic: cert,
      sourceResumeField: "Certifications",
      sourceResumeValue: cert,
      resumeSource: `Certification: ${cert}`,
      text: `You hold the certification for "${cert}". How have the architectural or operational principles learned from this certification directly influenced how you write software?`,
      difficulty: isFresher ? "Moderate" : "Hard",
      targetKeywords: ["best practices", "principles", "security", "design", "cloud", "reliability"]
    });
  } else {
    questions.push({
      id: "q_career_goals",
      category: "Engineering Philosophy & Impact",
      topic: "Career Growth",
      sourceResumeField: "Summary",
      sourceResumeValue: "Technical Profile",
      resumeSource: `Resume Summary & Technical Profile`,
      text: `Reflecting on the projects and skills on your resume, where do you see your technical focus expanding in the next 12 to 18 months, and what complex domain challenges are you most eager to tackle?`,
      difficulty: "Moderate",
      targetKeywords: ["growth", "scalability", "impact", "architecture", "mentorship", "learning"]
    });
  }

  return questions;
};
