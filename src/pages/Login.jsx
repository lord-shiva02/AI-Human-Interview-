import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bot, Mail, Lock, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { mockInterviewService } from '../services/mockInterviewService';

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('alex.chen@techmail.io');
  const [password, setPassword] = useState('password123');

  const handleLogin = (e) => {
    e.preventDefault();
    // In frontend-only app, authenticate candidate session & navigate to dashboard
    navigate('/dashboard');
  };

  const handleDemoLogin = () => {
    setEmail('alex.chen@techmail.io');
    setPassword('demoPass2026');
    setTimeout(() => {
      navigate('/dashboard');
    }, 400);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-3xl bg-slate-900/80 border border-white/10 p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        
        {/* Top Glow Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500"></div>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mx-auto flex items-center justify-center shadow-lg shadow-cyan-500/10">
            <Bot className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white">Welcome Back</h2>
          <p className="text-xs text-slate-400">
            Sign in to access your AI interview history and performance analytics
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950/70 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <span className="text-[11px] text-cyan-400 cursor-pointer hover:underline">Forgot?</span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950/70 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30"
              />
            </div>
          </div>

          <div className="pt-2 space-y-3">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs tracking-wider uppercase shadow-xl shadow-cyan-500/20 transition-all duration-200 hover:scale-[1.02]"
            >
              Sign In to Account
            </button>

            {/* 1-Click Demo Login Button */}
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-3 rounded-2xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 font-bold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>1-Click Candidate Demo Login</span>
            </button>
          </div>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2 border-t border-white/10 text-xs text-slate-400">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-cyan-400 font-bold hover:underline">
            Register Account
          </Link>
        </div>
      </div>
    </div>
  );
};
