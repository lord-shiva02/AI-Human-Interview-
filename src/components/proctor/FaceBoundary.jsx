import React from 'react';

/**
 * FaceBoundary Component
 * 
 * Renders the permitted green rectangular boundary box and the detected face bounding box.
 * Highlights green when inside the permitted zone, or red/dashed warning when outside.
 */
export const FaceBoundary = ({
  boundaryBox = { x: 20, y: 15, width: 60, height: 70 },
  faceBox = null,
  isInside = true,
  faceCount = 1,
  confidence = 100,
  showLabels = true
}) => {
  const isViolation = !isInside || faceCount !== 1;

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      
      {/* 1. Allowed Green Boundary Box */}
      <div 
        className={`absolute rounded-2xl transition-all duration-300 ${
          isViolation 
            ? 'border-2 border-dashed border-rose-500/80 bg-rose-500/5 shadow-lg shadow-rose-950/40' 
            : 'border-2 border-emerald-400 bg-emerald-400/5 shadow-lg shadow-emerald-950/30'
        }`}
        style={{
          left: `${boundaryBox.x}%`,
          top: `${boundaryBox.y}%`,
          width: `${boundaryBox.width}%`,
          height: `${boundaryBox.height}%`
        }}
      >
        {/* Corner Target Reticles */}
        <div className={`absolute -top-1.5 -left-1.5 w-3.5 h-3.5 border-t-2 border-l-2 rounded-tl ${isViolation ? 'border-rose-400' : 'border-emerald-400'}`} />
        <div className={`absolute -top-1.5 -right-1.5 w-3.5 h-3.5 border-t-2 border-r-2 rounded-tr ${isViolation ? 'border-rose-400' : 'border-emerald-400'}`} />
        <div className={`absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 border-b-2 border-l-2 rounded-bl ${isViolation ? 'border-rose-400' : 'border-emerald-400'}`} />
        <div className={`absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 border-b-2 border-r-2 rounded-br ${isViolation ? 'border-rose-400' : 'border-emerald-400'}`} />

        {/* Boundary Top Badge */}
        {showLabels && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[8px] font-black font-mono uppercase tracking-wider flex items-center gap-1 shadow-md bg-slate-950/90 border border-white/20">
            <span className={`w-1.5 h-1.5 rounded-full ${isViolation ? 'bg-rose-400 animate-ping' : 'bg-emerald-400'}`}></span>
            <span className={isViolation ? 'text-rose-300' : 'text-emerald-300'}>
              {isViolation ? 'OUTSIDE PERMITTED ZONE' : 'PERMITTED FACE ZONE'}
            </span>
          </div>
        )}
      </div>

      {/* 2. Detected Candidate Face Box */}
      {faceBox && (
        <div
          className={`absolute rounded-xl transition-all duration-200 ${
            isViolation 
              ? 'border-2 border-rose-400 shadow-rose-500/30' 
              : 'border-2 border-emerald-400/90 shadow-emerald-500/25'
          }`}
          style={{
            left: `${faceBox.x}%`,
            top: `${faceBox.y}%`,
            width: `${faceBox.width}%`,
            height: `${faceBox.height}%`
          }}
        >
          {/* Confidence Tag */}
          <span className={`absolute -bottom-3 left-1/2 -translate-x-1/2 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded shadow ${
            isViolation 
              ? 'bg-rose-600 text-white' 
              : 'bg-emerald-500 text-slate-950'
          }`}>
            {isViolation ? 'BOUNDARY VIOLATION' : `FACE: ${confidence}%`}
          </span>
        </div>
      )}

      {/* 3. Multiple Faces Extra Warning Box */}
      {faceCount > 1 && (
        <div 
          className="absolute rounded-xl border-2 border-rose-500 animate-pulse bg-rose-500/20"
          style={{ left: '55%', top: '25%', width: '35%', height: '48%' }}
        >
          <span className="absolute -top-3 left-2 text-[8px] font-bold bg-rose-600 text-white px-1.5 py-0.5 rounded font-mono">
            EXTRA PERSON DETECTED
          </span>
        </div>
      )}
    </div>
  );
};

export default FaceBoundary;
