import React from 'react';

export const ScoreRing = ({ 
  score = 80, 
  size = 120, 
  strokeWidth = 10, 
  label = "Score", 
  subLabel = "/100",
  showTier = true 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const clampedScore = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  let colorClass = "from-cyan-400 to-indigo-500";
  let strokeColor = "#06B6D4"; // Cyan
  let textColor = "text-cyan-400";
  let tierLabel = "Good";

  if (clampedScore >= 90) {
    colorClass = "from-emerald-400 to-teal-500";
    strokeColor = "#10B981";
    textColor = "text-emerald-400";
    tierLabel = "Excellent";
  } else if (clampedScore >= 80) {
    colorClass = "from-cyan-400 to-blue-500";
    strokeColor = "#06B6D4";
    textColor = "text-cyan-400";
    tierLabel = "Very Good";
  } else if (clampedScore >= 70) {
    colorClass = "from-blue-400 to-indigo-500";
    strokeColor = "#3B82F6";
    textColor = "text-blue-400";
    tierLabel = "Good";
  } else if (clampedScore >= 60) {
    colorClass = "from-amber-400 to-orange-500";
    strokeColor = "#F59E0B";
    textColor = "text-amber-400";
    tierLabel = "Needs Improvement";
  } else {
    colorClass = "from-rose-500 to-pink-600";
    strokeColor = "#F43F5E";
    textColor = "text-rose-400";
    tierLabel = "Needs Significant Improvement";
  }

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        
        {/* Glowing Background Radial Halo */}
        <div 
          className="absolute inset-0 rounded-full blur-xl opacity-25"
          style={{ backgroundColor: strokeColor }}
        />

        <svg 
          width={size} 
          height={size} 
          className="transform -rotate-90 origin-center transition-all duration-700"
        >
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Dynamic Progress Stroke */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Numerical Score Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-black tracking-tight leading-none ${size > 140 ? 'text-4xl' : size > 90 ? 'text-2xl' : 'text-lg'} text-white`}>
            {clampedScore}
          </span>
          {subLabel && (
            <span className="text-[10px] font-semibold text-slate-400 tracking-wider">
              {subLabel}
            </span>
          )}
        </div>
      </div>

      {label && (
        <span className="mt-2 text-xs font-semibold text-slate-300 tracking-wide uppercase">
          {label}
        </span>
      )}

      {showTier && (
        <span className={`mt-0.5 text-[11px] font-bold ${textColor}`}>
          {tierLabel}
        </span>
      )}
    </div>
  );
};
