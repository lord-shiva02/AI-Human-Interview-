import React from 'react';
import { 
  GraduationCap, 
  Code, 
  Briefcase, 
  Award, 
  FolderGit2, 
  Sparkles, 
  UserCheck, 
  Layers 
} from 'lucide-react';

export const ResumeAnalysis = ({ resume }) => {
  if (!resume) return null;

  return (
    <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              ACTIVE INTERVIEW CONTEXT
            </span>
            <span className="text-xs text-slate-400 font-mono">ID: {resume.id}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-1">{resume.name}</h3>
          <p className="text-xs sm:text-sm text-cyan-300 font-semibold mt-0.5">{resume.title || resume.degree}</p>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-xs text-slate-400">{resume.email}</p>
          <p className="text-xs text-slate-400">{resume.college}</p>
          <span className="inline-block mt-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Graduation: {resume.graduationYear} (GPA {resume.gpa})
          </span>
        </div>
      </div>

      {/* Summary */}
      {resume.summary && (
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 text-xs text-slate-300 leading-relaxed">
          <span className="font-bold text-white block mb-1 text-[11px] uppercase tracking-wider">Executive Summary:</span>
          {resume.summary}
        </div>
      )}

      {/* Extracted Metadata Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Skills Tag Cloud */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
            <Code className="w-4 h-4 text-cyan-400" />
            <span>Extracted Technical Skills ({Object.values(resume.skills || {}).flat().length})</span>
          </div>

          <div className="space-y-2">
            {resume.skills?.languages && (
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block mb-1">Languages:</span>
                <div className="flex flex-wrap gap-1.5">
                  {resume.skills.languages.map((s, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-500/15 text-cyan-200 border border-cyan-500/30">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {resume.skills?.frameworks && (
              <div className="pt-1">
                <span className="text-[10px] text-slate-400 font-semibold block mb-1">Frameworks & Libraries:</span>
                <div className="flex flex-wrap gap-1.5">
                  {resume.skills.frameworks.map((s, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-500/15 text-indigo-200 border border-indigo-500/30">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {resume.skills?.tools && (
              <div className="pt-1">
                <span className="text-[10px] text-slate-400 font-semibold block mb-1">Tools & Platforms:</span>
                <div className="flex flex-wrap gap-1.5">
                  {resume.skills.tools.map((s, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-500/15 text-purple-200 border border-purple-500/30">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Extracted Projects */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
            <FolderGit2 className="w-4 h-4 text-cyan-400" />
            <span>Extracted Projects ({resume.projects?.length || 0})</span>
          </div>

          <div className="space-y-2.5">
            {(resume.projects || []).map((proj, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">{proj.title}</span>
                  <span className="text-[10px] font-mono text-cyan-400">{proj.duration}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{proj.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {proj.techStack.map((tech, tIdx) => (
                    <span key={tIdx} className="px-1.5 py-0.5 rounded text-[9px] bg-white/5 text-slate-300">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Certifications & Experience */}
      {(resume.certifications?.length > 0 || resume.workExperience?.length > 0 || resume.internships?.length > 0) && (
        <div className="pt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {resume.certifications && resume.certifications.length > 0 && (
            <div>
              <span className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5 mb-2">
                <Award className="w-3.5 h-3.5 text-cyan-400" /> Certifications:
              </span>
              <ul className="space-y-1 text-slate-300">
                {resume.certifications.map((cert, cIdx) => (
                  <li key={cIdx} className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-cyan-400"></span>
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(resume.workExperience || resume.internships) && (
            <div>
              <span className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5 mb-2">
                <Briefcase className="w-3.5 h-3.5 text-cyan-400" /> Work / Internship Experience:
              </span>
              <ul className="space-y-1 text-slate-300">
                {(resume.workExperience || resume.internships || []).map((exp, eIdx) => (
                  <li key={eIdx} className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                    <span><strong>{exp.role}</strong> at {exp.company} ({exp.duration})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
