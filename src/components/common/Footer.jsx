import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bot, ShieldCheck, Cpu, Heart, Sparkles } from 'lucide-react';

export const Footer = () => {
  const location = useLocation();

  // Hide footer in immersive fullscreen interview session
  if (location.pathname === '/interview/session') {
    return null;
  }

  return (
    <footer className="w-full border-t border-white/[0.08] bg-[#070B14]/90 backdrop-blur-xl mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base text-white tracking-tight">
                AI Interview Preparation Assistant
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              An intelligent resume-grounded mock interview platform designed to build candidate confidence with realistic AI HR simulations and evidence-based performance feedback.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-400 font-mono font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>All AI Synthesis & Proctor Services Operational</span>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/" className="hover:text-cyan-300 transition-colors">Home Landing</Link></li>
              <li><Link to="/dashboard" className="hover:text-cyan-300 transition-colors">Candidate Dashboard</Link></li>
              <li><Link to="/interview/setup" className="hover:text-cyan-300 transition-colors">Start Interview Session</Link></li>
              <li><Link to="/history" className="hover:text-cyan-300 transition-colors">Session Audit History</Link></li>
              <li><Link to="/profile" className="hover:text-cyan-300 transition-colors">Candidate Profile</Link></li>
            </ul>
          </div>

          {/* Technical Specs */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Engine Specs</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-mono">
              <li>• ATS Compatibility Gate: v2.4</li>
              <li>• Multi-Rubric Rubric Weighting</li>
              <li>• Web Speech Audio Synthesis</li>
              <li>• A4 PDF Assessment Engine</li>
              <li>• Full Stack SPA Architecture</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} AI Interview Preparation Assistant. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Confidential Academic & Enterprise Assessment</span>
            <span>•</span>
            <span className="text-cyan-400 font-mono">Final Year Project Edition</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
