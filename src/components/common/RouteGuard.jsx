import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { mockResumeService } from '../../services/mockResumeService';
import { mockInterviewService } from '../../services/mockInterviewService';

// Helper to get or reconcile currentInterview from storage
export const getCurrentInterviewSession = () => {
  try {
    const raw = localStorage.getItem("currentInterview");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.resumeId && parsed.track && parsed.ats) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error parsing currentInterview", e);
  }

  // Self-heal if activeResume exists in storage
  const activeResume = mockResumeService.getActiveResume();
  if (activeResume) {
    const track = mockInterviewService.getActiveTrack() || 'fresher';
    const ats = mockResumeService.calculateATS(activeResume);
    const healed = {
      interviewId: `INT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      resumeId: activeResume.id || activeResume.resumeId || `res_${Date.now()}`,
      resumeName: activeResume.fileName || `${activeResume.name}_Resume.pdf`,
      resumeText: activeResume.summary || "",
      resumeData: activeResume,
      track,
      difficulty: track === 'fresher' ? 'Simple' : 'Hard',
      ats: {
        checked: true,
        score: ats.score,
        passed: ats.passed,
        issues: ats.issues || [],
        suggestions: ats.suggestions || []
      },
      status: ats.passed ? "ats-passed" : "ats-failed"
    };
    localStorage.setItem("currentInterview", JSON.stringify(healed));
    return healed;
  }

  return null;
};

// Guard 1: Requires a valid uploaded resume
export const ResumeRequiredGuard = ({ children }) => {
  const current = getCurrentInterviewSession();
  const hasResume = Boolean(current?.resumeId) || mockResumeService.hasResumeUploaded();

  if (!hasResume) {
    return <Navigate to="/interview/resume?error=resume_required" replace />;
  }

  return children;
};

// Guard 2: Requires valid uploaded resume, track, and passed ATS (>= 70%)
export const ATSPassedGuard = ({ children }) => {
  const current = getCurrentInterviewSession();

  // If no resume uploaded
  if (!current || !current.resumeId) {
    return <Navigate to="/interview/resume?error=resume_required" replace />;
  }

  // If ATS check not passed
  if (!current.ats || current.ats.passed !== true) {
    return <Navigate to="/interview/ats" replace />;
  }

  // Allow access
  return children;
};

// Guard 3: Result page guard ensuring a completed interview session exists
export const ResultSessionGuard = ({ children }) => {
  const latestResult = mockInterviewService.getLatestResult();

  if (!latestResult) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
