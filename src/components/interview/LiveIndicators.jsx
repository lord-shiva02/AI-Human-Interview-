import React from 'react';
import { Activity, Radio, Cpu, MessageCircle } from 'lucide-react';

export const LiveIndicators = ({ metrics = { technical: 82, communication: 80, fluency: 84 } }) => {
  return (
    <div className="flex items-center gap-3 sm:gap-6 px-4 py-2 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md">
      <div className="flex items-center gap-1.5">
        <Cpu className="w-3.5 h-3.5 text-cyan-400" />
        <span className="text-[11px] text-slate-400 font-medium">Technical:</span>
        <span className="text-xs font-bold text-cyan-300">{metrics.technical}%</span>
      </div>

      <div className="hidden sm:block w-[1px] h-3 bg-white/10"></div>

      <div className="flex items-center gap-1.5">
        <MessageCircle className="w-3.5 h-3.5 text-indigo-400" />
        <span className="text-[11px] text-slate-400 font-medium">Communication:</span>
        <span className="text-xs font-bold text-indigo-300">{metrics.communication}%</span>
      </div>

      <div className="hidden sm:block w-[1px] h-3 bg-white/10"></div>

      <div className="flex items-center gap-1.5">
        <Activity className="w-3.5 h-3.5 text-emerald-400" />
        <span className="text-[11px] text-slate-400 font-medium">Fluency:</span>
        <span className="text-xs font-bold text-emerald-300">{metrics.fluency}%</span>
      </div>
    </div>
  );
};
