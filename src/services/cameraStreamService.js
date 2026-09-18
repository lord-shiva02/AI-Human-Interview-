/**
 * cameraStreamService.js
 * 
 * Central Singleton MediaStream Service for AI Interview Assistant.
 * Ensures a single shared MediaStream across:
 * - Camera Verification (Step 05)
 * - Active Proctored Interview Session
 * 
 * Prevents multiple competing streams, hardware locking, or black screens.
 */

class CameraStreamService {
  constructor() {
    this.stream = null;
    this.isCameraActive = false;
    this.isMicActive = true;
    this.listeners = new Set();
    this.hasPermission = null;
    this.isInitializing = false;
  }

  // Subscribe to stream/device state changes
  subscribe(listener) {
    this.listeners.add(listener);
    // Initial emit
    listener({
      stream: this.stream,
      isCameraActive: this.isCameraActive,
      isMicActive: this.isMicActive,
      hasPermission: this.hasPermission,
      isInitializing: this.isInitializing
    });
    return () => this.listeners.delete(listener);
  }

  notify() {
    const payload = {
      stream: this.stream,
      isCameraActive: this.isCameraActive,
      isMicActive: this.isMicActive,
      hasPermission: this.hasPermission,
      isInitializing: this.isInitializing
    };
    this.listeners.forEach(cb => {
      try { cb(payload); } catch (e) { console.warn("Camera stream listener notice:", e); }
    });
  }

  // Request actual hardware webcam access or reuse existing live stream
  async startCamera() {
    // If stream is already active and healthy, reuse it immediately
    if (this.stream && this.isStreamLive()) {
      this.isCameraActive = true;
      this.notify();
      return this.stream;
    }

    this.isInitializing = true;
    this.notify();

    try {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        let mediaStream;
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 640, min: 320 },
              height: { ideal: 480, min: 240 },
              facingMode: "user",
              frameRate: { ideal: 30, min: 15 }
            },
            audio: true
          });
        } catch (audioErr) {
          // Fallback to video-only if audio track permission fails
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 640, min: 320 },
              height: { ideal: 480, min: 240 },
              facingMode: "user"
            }
          });
        }

        this.stream = mediaStream;
        this.isCameraActive = true;
        this.hasPermission = true;
        this.isInitializing = false;

        // Monitor track ended event
        mediaStream.getVideoTracks().forEach(track => {
          track.onended = () => {
            console.warn("Video track ended by browser/hardware");
            this.isCameraActive = false;
            this.notify();
          };
        });

        this.notify();
        return mediaStream;
      } else {
        // Fallback for environments without getUserMedia
        this.isCameraActive = true;
        this.hasPermission = true;
        this.isInitializing = false;
        this.notify();
        return null;
      }
    } catch (err) {
      console.warn("Camera hardware access denied or unavailable:", err);
      this.stream = null;
      this.isCameraActive = false;
      this.hasPermission = false;
      this.isInitializing = false;
      this.notify();
      return null;
    }
  }

  getStream() {
    if (this.stream && this.isStreamLive()) {
      return this.stream;
    }
    return this.stream;
  }

  // Check if live video tracks are currently transmitting frames
  isStreamLive() {
    if (!this.stream) return false;
    const tracks = this.stream.getVideoTracks();
    if (!tracks || tracks.length === 0) return false;
    return tracks.some(t => t.readyState === 'live' && t.enabled);
  }

  toggleCamera() {
    if (!this.stream) {
      this.isCameraActive = !this.isCameraActive;
      this.notify();
      return;
    }
    const tracks = this.stream.getVideoTracks();
    tracks.forEach(track => {
      track.enabled = !track.enabled;
    });
    this.isCameraActive = tracks.some(t => t.enabled);
    this.notify();
  }

  toggleMic() {
    if (!this.stream) {
      this.isMicActive = !this.isMicActive;
      this.notify();
      return;
    }
    const tracks = this.stream.getAudioTracks();
    tracks.forEach(track => {
      track.enabled = !track.enabled;
    });
    this.isMicActive = tracks.some(t => t.enabled);
    this.notify();
  }

  stopAllTracks() {
    if (this.stream) {
      this.stream.getTracks().forEach(t => {
        try { t.stop(); } catch (e) {}
      });
      this.stream = null;
    }
    this.isCameraActive = false;
    this.notify();
  }
}

export const cameraStreamService = new CameraStreamService();
export default cameraStreamService;
