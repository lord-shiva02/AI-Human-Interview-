import React from 'react';
import { Calendar, CheckCircle2, ArrowRight, Zap, Target } from 'lucide-react';

export const ImprovementPlan = ({ plan = [] }) => {
  const steps = (plan && plan.length > 0) ? plan : [
    { step: 1, title: "Review Asynchronous Error Handling", focus: "Solidify error boundaries and loading fallbacks.", timeline: "Day 1-2" },
    { step: 2, title: "Practice STAR Framework", focus: "Structure answers into Situation → Task → Action → Metric Result.", timeline: "Day 3-4" },
    { step: 3, title: "Real-Time Scenario Drills", focus: "Take adaptive mock interviews on hard difficulty.", timeline: "Day 5-7" }
  ];

  return (
    <div className="space-y-4">
      {steps.map((item) => (
        <div 
          key={item.step}
          className="relative p-5 rounded-2xl bg-slate-900/80 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-indigo-500/40 transition-all duration-200"
        >
          <div className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-extrabold text-sm font-mono flex-shrink-0">
              0{item.step}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">{item.title}</h4>
              </div>
              <p className="text-xs text-slate-300 mt-1">{item.focus}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-slate-800 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 whitespace-nowrap">
              <Calendar className="w-3 h-3 text-cyan-400" />
              {item.timeline}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
