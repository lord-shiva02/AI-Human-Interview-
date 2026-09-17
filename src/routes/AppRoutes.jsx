import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { Dashboard } from '../pages/Dashboard';
import { TrackSelection } from '../pages/TrackSelection';
import { ResumeUpload } from '../pages/ResumeUpload';
import { ATSValidation } from '../pages/ATSValidation';
import { InterviewInstructions } from '../pages/InterviewInstructions';
import { CameraVerification } from '../pages/CameraVerification';
import { Interview } from '../pages/Interview';
import { InterviewResult } from '../pages/InterviewResult';
import { InterviewHistory } from '../pages/InterviewHistory';
import { Profile } from '../pages/Profile';

// Route Guards
import { 
  ResumeRequiredGuard, 
  ATSPassedGuard, 
  ResultSessionGuard 
} from '../components/common/RouteGuard';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* Interview Funnel Routes with Strict Sequence Guards */}
      <Route path="/interview" element={<Navigate to="/interview/setup" replace />} />
      <Route path="/interview/setup" element={<TrackSelection />} />
      <Route path="/interview/resume" element={<ResumeUpload />} />
      
      {/* Requires Uploaded Resume */}
      <Route 
        path="/interview/ats" 
        element={
          <ResumeRequiredGuard>
            <ATSValidation />
          </ResumeRequiredGuard>
        } 
      />
      
      {/* Requires Both Resume and Passed ATS (>= 70%) */}
      <Route 
        path="/interview/instructions" 
        element={
          <ATSPassedGuard>
            <InterviewInstructions />
          </ATSPassedGuard>
        } 
      />
      <Route 
        path="/interview/verification" 
        element={
          <ATSPassedGuard>
            <CameraVerification />
          </ATSPassedGuard>
        } 
      />
      <Route 
        path="/interview/session" 
        element={
          <ATSPassedGuard>
            <Interview />
          </ATSPassedGuard>
        } 
      />
      <Route 
        path="/interview/result" 
        element={
          <ResultSessionGuard>
            <InterviewResult />
          </ResultSessionGuard>
        } 
      />

      {/* Auxiliary Pages */}
      <Route path="/history" element={<InterviewHistory />} />
      <Route path="/profile" element={<Profile />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
