// Face detection verification service supporting simulated detection states and WebRTC camera binding

export const FACE_DETECTION_STATES = {
  DETECTED_SINGLE: {
    code: "SINGLE_FACE_PASS",
    faceCount: 1,
    passed: true,
    title: "Candidate Face Verified",
    message: "Candidate positioned perfectly inside the frame. Lighting and alignment verified.",
    badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    boundingBox: { x: 30, y: 20, width: 40, height: 55 }
  },
  NO_FACE: {
    code: "NO_FACE_FAIL",
    faceCount: 0,
    passed: false,
    title: "No Face Detected",
    message: "Please position your face inside the center frame and ensure adequate room lighting.",
    badgeClass: "bg-rose-500/20 text-rose-300 border-rose-500/40",
    boundingBox: null
  },
  MULTIPLE_FACES: {
    code: "MULTIPLE_FACES_FAIL",
    faceCount: 2,
    passed: false,
    title: "Multiple Faces Detected",
    message: "Security violation: Only the candidate must be visible in the camera frame.",
    badgeClass: "bg-rose-500/20 text-rose-300 border-rose-500/40",
    boundingBox: { x: 15, y: 20, width: 30, height: 50 }
  },
  CAMERA_OFF: {
    code: "CAMERA_OFF_FAIL",
    faceCount: 0,
    passed: false,
    title: "Camera Feed Inactive",
    message: "Please allow camera access in your browser or connect a functional webcam device.",
    badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    boundingBox: null
  }
};

export const mockFaceDetectionService = {
  // Simulate face detection algorithm scan
  verifyFace: async (mode = "SINGLE") => {
    // Artificial verification delay to simulate neural model inference
    await new Promise(r => setTimeout(r, 900));

    if (mode === "NO_FACE") return FACE_DETECTION_STATES.NO_FACE;
    if (mode === "MULTIPLE") return FACE_DETECTION_STATES.MULTIPLE_FACES;
    if (mode === "OFF") return FACE_DETECTION_STATES.CAMERA_OFF;
    return FACE_DETECTION_STATES.DETECTED_SINGLE;
  }
};
