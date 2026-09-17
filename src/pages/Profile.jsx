import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  GraduationCap, 
  Award, 
  Code2, 
  FolderGit2, 
  Calendar, 
  Phone, 
  Sparkles, 
  Edit3, 
  CheckCircle2,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { mockInterviewService } from '../services/mockInterviewService';
import { useResume } from '../hooks/useResume';

export const Profile = () => {
  const { activeResume } = useResume();
  const [profile, setProfile] = useState(mockInterviewService.getUserProfile());
  const [isEditing, setIsEditing] = useState(false);
  const [skillsList, setSkillsList] = useState(profile.skills || []);
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !skillsList.includes(newSkill.trim())) {
      const updated = [...skillsList, newSkill.trim()];
      setSkillsList(updated);
      setNewSkill('');
      mockInterviewService.updateUserProfile({ ...profile, skills: updated });
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updated = skillsList.filter(s => s !== skillToRemove);
    setSkillsList(updated);
    mockInterviewService.updateUserProfile({ ...profile, skills: updated });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* PROFILE HERO HEADER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-2xl relative overflow-hidden">
        
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <img 
          src={profile.avatarUrl} 
          alt={profile.name}
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-2 ring-cyan-500/40 shadow-xl shadow-cyan-500/10 flex-shrink-0"
        />

        <div className="space-y-2 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white">{profile.name}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              VERIFIED CANDIDATE
            </span>
          </div>

          <p className="text-xs sm:text-sm text-cyan-300 font-semibold">
            {profile.headline || "Full Stack & AI Software Engineer"}
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400 pt-1">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              {profile.email}
            </span>
            <span className="flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
              {profile.college} ({profile.graduationYear || '2026'})
            </span>
          </div>
        </div>
      </div>

      {/* CREDENTIALS & EDUCATION GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Education Details */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <span>Academic Background</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-white">{profile.degree || activeResume?.degree || "B.S. in Computer Science"}</h4>
              <span className="text-xs font-mono text-cyan-400">Class of {profile.graduationYear || activeResume?.graduationYear || '2026'}</span>
            </div>
            <p className="text-xs text-slate-300">{profile.college || activeResume?.college || "Stanford University of Technology"}</p>
            <p className="text-[11px] text-slate-400 font-mono">GPA: {activeResume?.gpa || "3.85 / 4.0"}</p>
          </div>
        </div>

        {/* Certifications */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
            <Award className="w-4 h-4 text-cyan-400" />
            <span>Verified Certifications</span>
          </div>

          <div className="space-y-2">
            {(profile.certifications || activeResume?.certifications || ["AWS Certified Cloud Practitioner", "Meta Front-End Developer Professional"]).map((cert, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-slate-950/60 border border-white/5 flex items-center gap-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="font-medium">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODERN SKILL BADGES */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
            <Code2 className="w-4 h-4 text-cyan-400" />
            <span>Technical Skills & Framework Badges ({skillsList.length})</span>
          </div>
        </div>

        {/* Add Skill Form */}
        <form onSubmit={handleAddSkill} className="flex gap-2 max-w-md">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Add new skill (e.g. Next.js, Docker, GraphQL)..."
            className="flex-1 px-4 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </form>

        {/* Badges Container */}
        <div className="flex flex-wrap gap-2.5">
          {skillsList.map((skill, idx) => (
            <span
              key={idx}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-800/80 hover:bg-cyan-500/20 text-cyan-200 border border-cyan-500/30 flex items-center gap-2 transition-all group"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="opacity-40 group-hover:opacity-100 hover:text-rose-400 text-slate-400 text-[10px]"
                title="Remove Skill"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* LINKED RESUME PROJECTS */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-xl space-y-6">
        <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
          <FolderGit2 className="w-4 h-4 text-cyan-400" />
          <span>Ingested Project Portfolio (Grounded In Resume)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(activeResume?.projects || [
            {
              title: "AI Mock Interview Web Platform",
              duration: "2025 - 2026",
              description: "Engineered an interactive mock interview assistant featuring live AI speech recognition, face alignment proctoring, and automated rubric scoring.",
              techStack: ["React.js", "Node.js", "Tailwind CSS", "Web Speech API"]
            },
            {
              title: "Distributed Task Management System",
              duration: "2025",
              description: "Developed a real-time collaborative task board with drag-and-drop workflow stages and role-based permissions.",
              techStack: ["React.js", "Python", "PostgreSQL", "REST API"]
            }
          ]).map((proj, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-950/70 border border-white/5 space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-white">{proj.title}</h4>
                <span className="text-[10px] font-mono text-cyan-400">{proj.duration}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{proj.description}</p>
              <div className="flex flex-wrap gap-1 pt-1">
                {(proj.techStack || []).map((tech, tIdx) => (
                  <span key={tIdx} className="px-2 py-0.5 rounded-md text-[10px] bg-slate-900 text-slate-300 border border-white/5">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
