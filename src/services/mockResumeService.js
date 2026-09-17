import { SAMPLE_RESUMES } from '../data/mockResume';
import { STORAGE_KEY_CURRENT_RESUME } from '../data/mockInterviews';

export const mockResumeService = {
  // Check if candidate has uploaded a resume in current session
  hasResumeUploaded: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CURRENT_RESUME);
      return Boolean(stored && JSON.parse(stored)?.name);
    } catch (e) {
      return false;
    }
  },

  // Get active resume from localStorage or null if not yet uploaded
  getActiveResume: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CURRENT_RESUME);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.name) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Error reading active resume from storage", e);
    }
    // Strict Guard: Return null when no resume has been uploaded by the candidate
    return null;
  },

  // Set new active resume (completely clearing previous context and starting a fresh session)
  setActiveResume: (resume) => {
    try {
      const enrichedResume = {
        ...resume,
        resumeUploaded: true,
        resumeId: resume.id || `res_${Date.now()}`,
        resumeName: resume.fileName || `${resume.name?.replace(/\s+/g, '_')}_Resume.pdf`,
        resumeType: resume.fileType || "application/pdf",
        resumeUploadedAt: new Date().toISOString()
      };

      localStorage.setItem(STORAGE_KEY_CURRENT_RESUME, JSON.stringify(enrichedResume));
      
      // Compute and synchronize currentInterview
      const ats = mockResumeService.calculateATS(enrichedResume);
      const track = localStorage.getItem('ai_interview_active_track') || 'fresher';
      const currentInterview = {
        interviewId: `INT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        resumeId: enrichedResume.resumeId,
        resumeName: enrichedResume.resumeName,
        resumeText: enrichedResume.summary || "",
        resumeData: enrichedResume,
        track,
        difficulty: track === 'fresher' ? 'Simple' : 'Hard',
        ats: {
          checked: true,
          score: ats.score,
          passed: ats.passed,
          issues: ats.issues,
          suggestions: ats.suggestions || []
        },
        status: ats.passed ? "ats-passed" : "ats-failed"
      };
      localStorage.setItem("currentInterview", JSON.stringify(currentInterview));

      // Dispatch custom event for reactive UI updates across components
      window.dispatchEvent(new Event('resumeContextChanged'));
      return enrichedResume;
    } catch (e) {
      console.error("Error saving active resume to storage", e);
      return resume;
    }
  },

  // Clear previous context completely
  clearResumeContext: () => {
    localStorage.removeItem(STORAGE_KEY_CURRENT_RESUME);
    localStorage.removeItem("currentInterview");
    window.dispatchEvent(new Event('resumeContextChanged'));
  },

  // Analyze Resume and compute detailed ATS scoring metrics based on structure, headings, keywords, and formatting
  calculateATS: (resume, rawText = "") => {
    if (!resume) return null;

    // Explicit Fail profile or heavily deficient resume
    if (resume.atsStatus === 'FAIL' || resume.id === 'res_fail_sample' || resume.id === 'res_failing_sample') {
      const failScore = resume.atsScore || 58;
      const issues = [
        "Resume structure needs improvement.",
        "Section headings are not clearly defined.",
        "Formatting may not be ATS-readable.",
        "Important keywords may be missing.",
        "Excessive graphics or design elements may affect ATS parsing."
      ];
      const suggestions = [
        "Use standard section headings such as Education, Skills, Projects and Experience.",
        "Use a simple and consistent layout.",
        "Avoid unnecessary graphics, tables and text boxes.",
        "Use clear and readable fonts.",
        "Make sure important skills and technologies are clearly mentioned.",
        "Maintain consistent spacing and formatting.",
        "Make sure all important information can be extracted as normal text."
      ];
      return {
        score: failScore,
        overallScore: failScore,
        status: "FAIL",
        passed: false,
        threshold: 70,
        breakdown: {
          structure: 52,
          keywordMatch: 45,
          readability: 58,
          formatting: 50,
          skillsDensity: 48,
          educationRelevance: 62,
          experienceImpact: 46
        },
        issues,
        suggestions,
        improvements: suggestions
      };
    }

    // Dynamic Multi-Factor ATS Analysis for Valid Resumes
    const hasEducation = Boolean(resume.degree && resume.college);
    const hasSkills = Boolean(resume.skills?.languages?.length || resume.skills?.frameworks?.length);
    const hasProjects = Boolean(resume.projects?.length);
    const hasExperience = Boolean(resume.workExperience?.length || resume.internships?.length);
    const totalSkillsCount = Object.values(resume.skills || {}).flat().length;

    let structureScore = hasEducation && hasSkills && hasProjects ? 94 : 65;
    let keywordScore = Math.min(98, 70 + totalSkillsCount * 2);
    let readabilityScore = 92;
    let formattingScore = 90;
    let skillsScore = Math.min(96, 68 + totalSkillsCount * 2.5);
    let educationScore = hasEducation ? 95 : 60;
    let experienceScore = hasExperience ? 92 : 82;

    const baseScore = resume.atsScore || Math.round(
      (structureScore + keywordScore + readabilityScore + formattingScore + skillsScore + educationScore + experienceScore) / 7
    );

    const isPassed = baseScore >= 70;
    const issues = isPassed ? [] : [
      "Resume structure needs improvement.",
      "Section headings are not clearly defined.",
      "Formatting may not be ATS-readable.",
      "Important keywords may be missing."
    ];
    const suggestions = [
      "Use standard section headings such as Education, Skills, Projects and Experience.",
      "Use a simple and consistent layout.",
      "Avoid unnecessary graphics, tables and text boxes.",
      "Use clear and readable fonts.",
      "Make sure important skills and technologies are clearly mentioned.",
      "Maintain consistent spacing and formatting.",
      "Make sure all important information can be extracted as normal text."
    ];

    return {
      score: baseScore,
      overallScore: baseScore,
      status: isPassed ? "PASS" : "FAIL",
      passed: isPassed,
      threshold: 70,
      breakdown: {
        structure: structureScore,
        keywordMatch: keywordScore,
        readability: readabilityScore,
        formatting: formattingScore,
        skillsDensity: skillsScore,
        educationRelevance: educationScore,
        experienceImpact: experienceScore
      },
      issues,
      suggestions,
      improvements: suggestions,
      strengths: [
        "Standard section headings (Education, Skills, Projects, Experience) detected.",
        "High density of industry-standard technical keywords and framework tags.",
        "Clean single-column typography optimized for OCR parsing engines.",
        "Accredited degree and verifiable graduation metrics."
      ]
    };
  },

  // Parse simulated custom uploaded resume text/file
  parseUploadedFile: async (file, customText = "") => {
    // In frontend-only environment, simulate comprehensive parsing with delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    const fileName = file ? file.name : "Uploaded_Resume.pdf";
    const isAlex = fileName.toLowerCase().includes("alex") || customText.toLowerCase().includes("alex");
    const isSarah = fileName.toLowerCase().includes("sarah") || customText.toLowerCase().includes("sarah") || customText.toLowerCase().includes("nexus");
    const isRohan = fileName.toLowerCase().includes("rohan") || customText.toLowerCase().includes("data");
    const isFail = fileName.toLowerCase().includes("fail") || fileName.toLowerCase().includes("bad") || customText.toLowerCase().includes("notepad");

    if (isFail) {
      return {
        ...SAMPLE_RESUMES.failing_ats_sample,
        fileName,
        fileType: file?.type || "application/pdf"
      };
    }
    
    if (isSarah) {
      return {
        ...SAMPLE_RESUMES.experienced_lead,
        fileName,
        fileType: file?.type || "application/pdf"
      };
    }

    if (isRohan) {
      return {
        ...SAMPLE_RESUMES.data_analyst_fresher,
        fileName,
        fileType: file?.type || "application/pdf"
      };
    }
    
    // If user uploaded a custom PDF/DOC or provided text
    const cleanName = fileName.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
    return {
      id: `res_uploaded_${Date.now()}`,
      name: cleanName.length > 2 ? cleanName : "Candidate Profile",
      fileName,
      fileType: file?.type || "application/pdf",
      email: "candidate.applied@techhub.io",
      college: "State Institute of Science & Technology",
      degree: "B.S. in Computer Science & Engineering",
      graduationYear: "2026",
      atsScore: 86,
      atsStatus: "PASS",
      summary: customText ? customText.slice(0, 200) : "Passionate software developer skilled in building responsive frontend applications and RESTful backend microservices.",
      skills: {
        languages: ["JavaScript (ES6+)", "Python", "SQL", "HTML5/CSS3"],
        frameworks: ["React.js", "Node.js", "Express", "Tailwind CSS"],
        tools: ["Git", "GitHub", "VS Code", "Postman", "Docker"],
        concepts: ["Full Stack Development", "State Synchronization", "Responsive Web Design", "REST APIs"]
      },
      projects: [
        {
          title: "AI Mock Interview Web Platform",
          techStack: ["React.js", "Node.js", "Tailwind CSS", "Web Speech API"],
          duration: "2025 - 2026",
          description: "Engineered an interactive mock interview assistant featuring live AI speech recognition, face alignment proctoring, and automated rubric scoring.",
          responsibilities: [
            "Architected modular frontend client with dynamic question generator",
            "Implemented ATS compatibility scanner and comprehensive rubric score engine",
            "Designed real-time audio waveform visualizers and candidate camera HUD"
          ]
        },
        {
          title: "Distributed Task Management System",
          techStack: ["React.js", "Python", "PostgreSQL", "REST API"],
          duration: "2025",
          description: "Developed a real-time collaborative task board with drag-and-drop workflow stages and role-based permissions.",
          responsibilities: [
            "Constructed secure JWT user authentication and role authorization",
            "Reduced query latencies by indexing frequently queried board columns"
          ]
        }
      ],
      workExperience: [],
      internships: [
        {
          company: "Apex Innovations Lab",
          role: "Frontend Development Intern",
          duration: "June 2025 - Aug 2025",
          responsibilities: [
            "Built responsive UI components using modern React patterns",
            "Improved web performance Lighthouse score from 74 to 96"
          ]
        }
      ],
      certifications: ["Meta Front-End Developer Professional", "AWS Certified Cloud Practitioner"]
    };
  }
};
