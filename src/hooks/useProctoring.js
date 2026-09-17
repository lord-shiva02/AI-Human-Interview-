import { useState, useEffect, useRef, useCallback } from 'react';

export const PROCTOR_STATUSES = {
  PROCTORING_CHECKING: "PROCTORING_CHECKING",
  PROCTORING_OK: "PROCTORING_OK",
  NO_FACE: "NO_FACE",
  MULTIPLE_FACES: "MULTIPLE_FACES",
  FACE_OUTSIDE_BOUNDARY: "FACE_OUTSIDE_BOUNDARY",
  CAMERA_OFF: "CAMERA_OFF",
  TAB_SWITCH: "TAB_SWITCH",
  WINDOW_BLUR: "WINDOW_BLUR",
  FULLSCREEN_EXIT: "FULLSCREEN_EXIT",
  NAVIGATION_ATTEMPT: "NAVIGATION_ATTEMPT",
  BACK_BUTTON: "BACK_BUTTON",
  INTERVIEW_STOPPED: "INTERVIEW_STOPPED"
};

// Permitted Green Boundary Box in percentages of camera frame
export const DEFAULT_BOUNDARY_BOX = {
  x: 20, // 20% from left
  y: 15, // 15% from top
  width: 60, // 60% width
  height: 70 // 70% height
};

export const PROCTOR_VIOLATION_MESSAGES = {
  [PROCTOR_STATUSES.FULLSCREEN_EXIT]: {
    title: "INTERVIEW STOPPED",
    subtitle: "Fullscreen mode was exited.",
    action: "Please return to fullscreen mode to continue.",
    code: "ERR_FULLSCREEN_EXIT"
  },
  [PROCTOR_STATUSES.TAB_SWITCH]: {
    title: "INTERVIEW STOPPED",
    subtitle: "Tab switching or leaving the interview window is not allowed.",
    action: "Your interview session has been stopped because the interview page lost visibility.",
    code: "ERR_TAB_SWITCH"
  },
  [PROCTOR_STATUSES.WINDOW_BLUR]: {
    title: "INTERVIEW STOPPED",
    subtitle: "Leaving the interview window is not allowed.",
    action: "Please bring the interview window back into focus to continue.",
    code: "ERR_WINDOW_BLUR"
  },
  [PROCTOR_STATUSES.FACE_OUTSIDE_BOUNDARY]: {
    title: "INTERVIEW STOPPED",
    subtitle: "Your face moved outside the permitted camera boundary.",
    action: "Please return your face inside the green frame to continue.",
    code: "ERR_FACE_OUTSIDE_BOUNDARY"
  },
  [PROCTOR_STATUSES.MULTIPLE_FACES]: {
    title: "INTERVIEW STOPPED",
    subtitle: "Multiple faces detected.",
    action: "Only the registered candidate is allowed in the camera frame.",
    code: "ERR_MULTIPLE_FACES"
  },
  [PROCTOR_STATUSES.NO_FACE]: {
    title: "INTERVIEW STOPPED",
    subtitle: "No face detected.",
    action: "Please remain visible inside the camera frame.",
    code: "ERR_NO_FACE"
  },
  [PROCTOR_STATUSES.CAMERA_OFF]: {
    title: "INTERVIEW STOPPED",
    subtitle: "Camera access is required to continue this interview.",
    action: "Please enable camera access to continue your interview.",
    code: "ERR_CAMERA_OFF"
  },
  [PROCTOR_STATUSES.BACK_BUTTON]: {
    title: "INTERVIEW STOPPED",
    subtitle: "Leaving the interview session is not allowed.",
    action: "Browser back navigation is prohibited during proctored exams.",
    code: "ERR_BACK_BUTTON"
  },
  [PROCTOR_STATUSES.NAVIGATION_ATTEMPT]: {
    title: "INTERVIEW STOPPED",
    subtitle: "Unauthorized navigation detected.",
    action: "The interview route is locked. Please resume your proctored session.",
    code: "ERR_NAV_ATTEMPT"
  }
};

/**
 * Checks if face rectangle is completely inside the allowed boundary
 */
export const isFaceWithinBoundary = (face, boundary = DEFAULT_BOUNDARY_BOX) => {
  if (!face) return false;
  const faceRight = face.x + face.width;
  const faceBottom = face.y + face.height;
  const boundaryRight = boundary.x + boundary.width;
  const boundaryBottom = boundary.y + boundary.height;

  return (
    face.x >= boundary.x &&
    face.y >= boundary.y &&
    faceRight <= boundaryRight &&
    faceBottom <= boundaryBottom
  );
};

export const useProctoring = (stream = null, isCameraActive = true) => {
  // Scenario for simulation / demo testing: "OK", "OUTSIDE_BOUNDARY", "NO_FACE", "MULTIPLE", "OFF", "TAB_SWITCH", "FULLSCREEN_EXIT", "WINDOW_BLUR"
  const [scenario, setScenario] = useState("OK");
  
  const [faceCount, setFaceCount] = useState(1);
  const [faceDetected, setFaceDetected] = useState(true);
  const [faceInsideBoundary, setFaceInsideBoundary] = useState(true);
  const [faceConfidence, setFaceConfidence] = useState(100);
  const [proctorStatus, setProctorStatus] = useState(PROCTOR_STATUSES.PROCTORING_OK);
  
  // Environment security tracking
  const [isFullscreen, setIsFullscreen] = useState(Boolean(typeof document !== 'undefined' && (document.fullscreenElement || document.webkitFullscreenElement)));
  const [isWindowFocused, setIsWindowFocused] = useState(Boolean(typeof document !== 'undefined' && document.hasFocus()));
  const [isPageVisible, setIsPageVisible] = useState(Boolean(typeof document !== 'undefined' && document.visibilityState === 'visible'));

  // Bounding box coordinates in %
  const [faceBox, setFaceBox] = useState({ x: 30, y: 22, width: 40, height: 55 });
  const [boundaryBox] = useState(DEFAULT_BOUNDARY_BOX);
  
  // Stability timer for resuming
  const [canResume, setCanResume] = useState(true);
  const [violationsCount, setViolationsCount] = useState(0);

  // Request fullscreen utility
  const requestFullscreen = useCallback(async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        await document.documentElement.webkitRequestFullscreen();
      }
      setIsFullscreen(true);
      return true;
    } catch (err) {
      console.warn("Fullscreen request error/denied:", err);
      return false;
    }
  }, []);

  // Exit fullscreen utility
  const exitFullscreen = useCallback(async () => {
    try {
      if (document.exitFullscreen && document.fullscreenElement) {
        await document.exitFullscreen();
      }
      setIsFullscreen(false);
    } catch (e) {}
  }, []);

  // 1. Monitor Fullscreen, Tab Visibility, Window Focus, and Back Navigation
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Fullscreen listener
    const handleFullscreenChange = () => {
      const active = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
      setIsFullscreen(active);
    };

    // Tab Visibility listener
    const handleVisibilityChange = () => {
      const visible = document.visibilityState === 'visible' && !document.hidden;
      setIsPageVisible(visible);
    };

    // Window Focus / Blur listeners
    const handleFocus = () => {
      setIsWindowFocused(true);
    };

    const handleBlur = () => {
      setIsWindowFocused(false);
    };

    // Back button protection
    const handlePopState = (e) => {
      e.preventDefault();
      window.history.pushState(null, "", window.location.href);
      setScenario("BACK_BUTTON");
    };

    // Before unload protection
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "Strict Exam Mode: Leaving or reloading the interview session is not allowed.";
      return e.returnValue;
    };

    // Push state to prevent back navigation
    window.history.pushState(null, "", window.location.href);

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // 2. Continuous Comprehensive Evaluation Engine
  const evaluateProctoring = useCallback(() => {
    // Check Manual Simulated Overrides first (for testing and diagnostic review)
    if (scenario === "FULLSCREEN_EXIT") {
      setProctorStatus(PROCTOR_STATUSES.FULLSCREEN_EXIT);
      setCanResume(false);
      return;
    }

    if (scenario === "TAB_SWITCH") {
      setProctorStatus(PROCTOR_STATUSES.TAB_SWITCH);
      setCanResume(false);
      return;
    }

    if (scenario === "WINDOW_BLUR") {
      setProctorStatus(PROCTOR_STATUSES.WINDOW_BLUR);
      setCanResume(false);
      return;
    }

    if (scenario === "BACK_BUTTON") {
      setProctorStatus(PROCTOR_STATUSES.BACK_BUTTON);
      setCanResume(false);
      return;
    }

    // Live Environment Checks
    // A. Tab Visibility check
    if (!isPageVisible || (typeof document !== 'undefined' && document.visibilityState !== 'visible')) {
      setProctorStatus(PROCTOR_STATUSES.TAB_SWITCH);
      setCanResume(false);
      return;
    }

    // B. Window Focus check
    if (!isWindowFocused) {
      setProctorStatus(PROCTOR_STATUSES.WINDOW_BLUR);
      setCanResume(false);
      return;
    }

    // C. Camera Active check
    if (!isCameraActive || scenario === "OFF") {
      setFaceCount(0);
      setFaceDetected(false);
      setFaceInsideBoundary(false);
      setFaceConfidence(0);
      setProctorStatus(PROCTOR_STATUSES.CAMERA_OFF);
      setCanResume(false);
      return;
    }

    // D. Face Detection Scenarios
    if (scenario === "NO_FACE") {
      setFaceCount(0);
      setFaceDetected(false);
      setFaceInsideBoundary(false);
      setFaceConfidence(0);
      setFaceBox(null);
      setProctorStatus(PROCTOR_STATUSES.NO_FACE);
      setCanResume(false);
      return;
    }

    if (scenario === "MULTIPLE") {
      setFaceCount(2);
      setFaceDetected(true);
      setFaceInsideBoundary(false);
      setFaceConfidence(96);
      setFaceBox({ x: 10, y: 20, width: 35, height: 50 });
      setProctorStatus(PROCTOR_STATUSES.MULTIPLE_FACES);
      setCanResume(false);
      return;
    }

    if (scenario === "OUTSIDE_BOUNDARY") {
      const outsideBox = { x: 65, y: 20, width: 42, height: 56 };
      setFaceCount(1);
      setFaceDetected(true);
      setFaceInsideBoundary(false);
      setFaceConfidence(95);
      setFaceBox(outsideBox);
      setProctorStatus(PROCTOR_STATUSES.FACE_OUTSIDE_BOUNDARY);
      setCanResume(false);
      return;
    }

    // Valid Candidate Position
    const centeredBox = { x: 30, y: 22, width: 40, height: 54 };
    const inside = isFaceWithinBoundary(centeredBox, boundaryBox);

    setFaceCount(1);
    setFaceDetected(true);
    setFaceInsideBoundary(inside);
    setFaceConfidence(100);
    setFaceBox(centeredBox);

    if (inside) {
      setProctorStatus(PROCTOR_STATUSES.PROCTORING_OK);
      setCanResume(true);
    } else {
      setProctorStatus(PROCTOR_STATUSES.FACE_OUTSIDE_BOUNDARY);
      setCanResume(false);
    }
  }, [
    isCameraActive, 
    scenario, 
    boundaryBox, 
    isPageVisible, 
    isWindowFocused, 
    isFullscreen
  ]);

  // Run continuous monitoring loop every 150ms
  useEffect(() => {
    const interval = setInterval(evaluateProctoring, 150);
    evaluateProctoring();
    return () => clearInterval(interval);
  }, [evaluateProctoring]);

  // Trigger scenario switch for demonstration / proctoring testing
  const setTestScenario = useCallback((newScenario) => {
    setScenario(newScenario);
  }, []);

  // Central Guard Function: Returns true ONLY when all strict proctor conditions pass
  const canInterviewContinue = useCallback(() => {
    return (
      (isCameraActive && scenario !== "OFF") &&
      faceCount === 1 &&
      faceInsideBoundary === true &&
      isPageVisible === true &&
      isWindowFocused === true &&
      proctorStatus === PROCTOR_STATUSES.PROCTORING_OK
    );
  }, [
    isCameraActive,
    scenario,
    faceCount,
    faceInsideBoundary,
    isPageVisible,
    isWindowFocused,
    proctorStatus
  ]);

  const isInterviewAllowed = canInterviewContinue();
  const violationReason = PROCTOR_VIOLATION_MESSAGES[proctorStatus] || null;

  return {
    cameraEnabled: isCameraActive && scenario !== "OFF",
    faceCount,
    faceDetected,
    faceInsideBoundary,
    faceConfidence,
    faceBox,
    boundaryBox,
    proctorStatus,
    isInterviewAllowed,
    canInterviewContinue,
    violationReason,
    canResume,
    isFullscreen,
    isWindowFocused,
    isPageVisible,
    requestFullscreen,
    exitFullscreen,
    scenario,
    setTestScenario
  };
};

export default useProctoring;
