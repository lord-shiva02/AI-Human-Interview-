import React from 'react';
import { Clock } from 'lucide-react';

export const Timer = ({ seconds = 0 }) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  return (
    <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-white/10 text-xs font-mono font-bold text-slate-200 shadow-md">
      <Clock className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
      <span>{formatted}</span>
    </div>
  );
};
