import React from 'react';
import { HRInterviewer, HR_STATES } from './HRInterviewer';

export { HR_STATES };

export const HRAvatar = (props) => {
  return <HRInterviewer {...props} />;
};

export default HRAvatar;
