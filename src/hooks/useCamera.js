import { useState, useEffect, useRef, useCallback } from 'react';
import { cameraStreamService } from '../services/cameraStreamService';
import { mockFaceDetectionService, FACE_DETECTION_STATES } from '../services/mockFaceDetectionService';

/**
 * useCamera Hook
 * 
 * Manages live browser webcam stream using the singleton cameraStreamService.
 * Attaches real MediaStream to video elements and monitors track health.
 */
export const useCamera = () => {
  const [stream, setStream] = useState(cameraStreamService.stream);
  const [isCameraActive, setIsCameraActive] = useState(cameraStreamService.isCameraActive);
  const [isMicActive, setIsMicActive] = useState(cameraStreamService.isMicActive);
  const [hasPermission, setHasPermission] = useState(cameraStreamService.hasPermission);
  const [isInitializing, setIsInitializing] = useState(cameraStreamService.isInitializing);
  const [detectionState, setDetectionState] = useState(FACE_DETECTION_STATES.DETECTED_SINGLE);
  const [isVerifying, setIsVerifying] = useState(false);
  const videoRef = useRef(null);

  // Subscribe to central camera stream state
  useEffect(() => {
    const unsubscribe = cameraStreamService.subscribe((state) => {
      setStream(state.stream);
      setIsCameraActive(state.isCameraActive);
      setIsMicActive(state.isMicActive);
      setHasPermission(state.hasPermission);
      setIsInitializing(state.isInitializing);

      // Connect stream to video element when available
      if (videoRef.current && state.stream) {
        if (videoRef.current.srcObject !== state.stream) {
          videoRef.current.srcObject = state.stream;
        }
        videoRef.current.play().catch(e => {
          console.log("Video autoplay caught:", e);
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Request actual live webcam access
  const startCamera = useCallback(async () => {
    const s = await cameraStreamService.startCamera();
    if (videoRef.current && s) {
      videoRef.current.srcObject = s;
      videoRef.current.play().catch(() => {});
    }
    return s;
  }, []);

  const stopCamera = useCallback(() => {
    cameraStreamService.stopAllTracks();
  }, []);

  const toggleMic = useCallback(() => {
    cameraStreamService.toggleMic();
  }, []);

  const toggleCamera = useCallback(async () => {
    cameraStreamService.toggleCamera();
  }, []);

  // Run face verification
  const runVerification = useCallback(async (mode = "SINGLE") => {
    setIsVerifying(true);
    try {
      const res = await mockFaceDetectionService.verifyFace(mode);
      setDetectionState(res);
      setIsVerifying(false);
      return res;
    } catch (e) {
      setIsVerifying(false);
      return FACE_DETECTION_STATES.NO_FACE;
    }
  }, []);

  return {
    videoRef,
    stream,
    isCameraActive,
    isMicActive,
    hasPermission,
    isInitializing,
    detectionState,
    isVerifying,
    startCamera,
    stopCamera,
    toggleCamera,
    toggleMic,
    runVerification,
    setDetectionState
  };
};

export default useCamera;
