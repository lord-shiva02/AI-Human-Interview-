import { useState, useEffect } from 'react';
import { mockResumeService } from '../services/mockResumeService';
import { SAMPLE_RESUMES } from '../data/mockResume';

export const useResume = () => {
  const [activeResume, setActiveResumeState] = useState(() => mockResumeService.getActiveResume());
  const [atsResult, setAtsResult] = useState(() => {
    const resume = mockResumeService.getActiveResume();
    return resume ? mockResumeService.calculateATS(resume) : null;
  });
  const [isParsing, setIsParsing] = useState(false);

  useEffect(() => {
    const handleContextChange = () => {
      const current = mockResumeService.getActiveResume();
      setActiveResumeState(current);
      setAtsResult(current ? mockResumeService.calculateATS(current) : null);
    };

    window.addEventListener('resumeContextChanged', handleContextChange);
    return () => window.removeEventListener('resumeContextChanged', handleContextChange);
  }, []);

  const selectResumePreset = (presetKey) => {
    const selected = SAMPLE_RESUMES[presetKey] || SAMPLE_RESUMES.fresher_dev;
    const enriched = mockResumeService.setActiveResume({
      ...selected,
      fileName: `${selected.name.replace(/\s+/g, '_')}_Resume.pdf`
    });
    setActiveResumeState(enriched);
    const ats = mockResumeService.calculateATS(enriched);
    setAtsResult(ats);
    return enriched;
  };

  const uploadResume = async (file, customText) => {
    setIsParsing(true);
    try {
      const parsed = await mockResumeService.parseUploadedFile(file, customText);
      const saved = mockResumeService.setActiveResume(parsed);
      setActiveResumeState(saved);
      const ats = mockResumeService.calculateATS(saved);
      setAtsResult(ats);
      setIsParsing(false);
      return { resume: saved, ats };
    } catch (e) {
      setIsParsing(false);
      throw e;
    }
  };

  const clearResume = () => {
    mockResumeService.clearResumeContext();
    setActiveResumeState(null);
    setAtsResult(null);
  };

  return {
    activeResume,
    resumeUploaded: Boolean(activeResume && activeResume.name),
    atsResult,
    isParsing,
    selectResumePreset,
    uploadResume,
    clearResume
  };
};
