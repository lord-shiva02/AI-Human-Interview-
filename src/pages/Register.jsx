import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bot, User, Mail, Lock, Code2, ArrowRight } from 'lucide-react';
import { mockInterviewService } from '../services/mockInterviewService';

export const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: 'Alex Chen',
    email: 'alex.chen@techmail.io',
    password: 'password123',
    confirmPassword: 'password123',
    skills: 'React.js, JavaScript, Python, Node.js, SQL'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mockInterviewService.updateUserProfile({
      name: formData.fullName,
      email: formData.email,
      skills: formData.skills.split(',').map(s => s.trim()),
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6 rounded-3xl bg-slate-900/80 border border-white/10 p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        
        {/* Glow Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500"></div>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mx-auto flex items-center justify-center shadow-lg shadow-cyan-500/10">
            <Bot className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white">Create Candidate Account</h2>
          <p className="text-xs text-slate-400">
            Join the platform to start resume-grounded AI mock interviews
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Alex Chen"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950/70 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="alex.chen@techmail.io"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950/70 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950/70 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950/70 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Primary Skills (Comma separated)</label>
            <div className="relative">
              <Code2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                placeholder="React, JavaScript, Python, SQL"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950/70 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-extrabold text-xs tracking-wider uppercase shadow-xl shadow-cyan-500/20 transition-all duration-200 hover:scale-[1.02] mt-2"
          >
            Create Account & Proceed
          </button>
        </form>

        <div className="text-center pt-2 border-t border-white/10 text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-cyan-400 font-bold hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};
