import { 
  interviewStorageService,
  normalizeInterview 
} from './interviewStorageService';
import { 
  STORAGE_KEY_CURRENT_TRACK,
  STORAGE_KEY_USER_PROFILE 
} from '../data/mockInterviews';

export const mockInterviewService = {
  // Get all stored interviews (Single Source of Truth)
  getAllInterviews: () => {
    return interviewStorageService.getAllInterviews();
  },

  // Get single interview by ID
  getInterviewById: (id) => {
    return interviewStorageService.getInterviewById(id);
  },

  // Save newly completed interview session
  saveInterviewResult: (sessionData) => {
    return interviewStorageService.saveInterview(sessionData);
  },

  // Get the most recent completed interview result
  getLatestResult: () => {
    return interviewStorageService.getLatestInterview();
  },

  // Delete interview
  deleteInterview: (id) => {
    return interviewStorageService.deleteInterview(id);
  },

  // Clear all
  clearInterviewHistory: () => {
    return interviewStorageService.clearInterviewHistory();
  },

  // Dashboard Stats
  getDashboardStats: () => {
    return interviewStorageService.getDashboardStats();
  },

  // Track selection getter/setter
  getActiveTrack: () => {
    return localStorage.getItem(STORAGE_KEY_CURRENT_TRACK) || 'fresher';
  },

  setActiveTrack: (track) => {
    localStorage.setItem(STORAGE_KEY_CURRENT_TRACK, track);
  },

  // User Profile
  getUserProfile: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USER_PROFILE);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to read profile", e);
    }
    return {
      name: "Alex Chen",
      email: "alex.chen@techmail.io",
      phone: "+1 (555) 234-5678",
      college: "Stanford University of Technology",
      degree: "B.S. in Computer Science",
      graduationYear: "2026",
      headline: "Aspiring Full Stack Engineer & AI Enthusiast",
      skills: ["React.js", "JavaScript (ES6+)", "Python", "Node.js", "Tailwind CSS", "SQL", "Git", "REST APIs"],
      certifications: ["AWS Certified Cloud Practitioner", "Meta Front-End Developer Professional"],
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
    };
  },

  updateUserProfile: (profile) => {
    localStorage.setItem(STORAGE_KEY_USER_PROFILE, JSON.stringify(profile));
    window.dispatchEvent(new Event('userProfileUpdated'));
  }
};

export default mockInterviewService;
