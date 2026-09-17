import React from 'react';
import { ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';
import { PROCTOR_STATUSES } from '../../hooks/useProctoring';

export const ProctorStatus = ({ 
  status = PROCTOR_STATUSES.PROCTORING_OK,
  confidence = 100,
  size = "md" 
}) => {
  const isOk = status === PROCTOR_STATUSES.PROCTORING_OK;

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono font-bold transition-all duration-300 shadow-md border backdrop-blur-md ${
      size === "sm" ? 'text-[9px] px-2 py-0.5' : 'text-xs px-3 py-1'
    } ${
      isOk
        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-emerald-500/15'
        : 'bg-rose-500/30 text-rose-200 border-rose-500/60 shadow-rose-500/20 animate-pulse'
    }`}>
      {isOk ? (
        <>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>PROCTOR ON • FACE: {confidence}%</span>
        </>
      ) : (
        <>
          <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping"></span>
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          <span>INTERVIEW STOPPED • PROCTOR VIOLATION</span>
        </>
      )}
    </div>
  );
};

export default ProctorStatus;
