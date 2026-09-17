import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  History, 
  PlayCircle, 
  Download, 
  FileText, 
  Calendar, 
  Award, 
  Clock, 
  ChevronRight, 
  Sparkles,
  Search,
  Filter,
  FileSpreadsheet
} from 'lucide-react';
import { mockInterviewService } from '../services/mockInterviewService';
import { DownloadReportButton } from '../components/report/DownloadReportButton';
import { DownloadExcelButton } from '../components/report/DownloadExcelButton';

export const InterviewHistory = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [trackFilter, setTrackFilter] = useState('ALL');

  const loadData = () => {
    const list = mockInterviewService.getAllInterviews();
    setInterviews(list);
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => loadData();
    window.addEventListener('interviewDataUpdated', handleUpdate);
    return () => window.removeEventListener('interviewDataUpdated', handleUpdate);
  }, []);

  const filteredInterviews = interviews.filter(item => {
    const matchSearch = item.interviewId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.candidate?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.track?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (trackFilter === 'ALL') return matchSearch;
    if (trackFilter === 'FRESHER') return matchSearch && item.track?.toLowerCase().includes('fresher');
    if (trackFilter === 'EXPERIENCE') return matchSearch && item.track?.toLowerCase().includes('experience');
    return matchSearch;
  });

  const handleViewReport = (interview) => {
    // Set this session as the active result and navigate to results page
    localStorage.setItem("ai_interview_latest_result", JSON.stringify(interview));
    navigate('/interview/result');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              AUDIT TRAIL & DATA VAULT
            </span>
            <span className="text-xs text-slate-400 font-mono">{interviews.length} Total Sessions</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Interview Session History
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Review past interview assessments, inspect question-by-question rubrics, and download official PDF or Excel records.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Master Excel Export Button */}
          <DownloadExcelButton 
            variant="success" 
            size="md" 
            label="DOWNLOAD MASTER EXCEL"
            disabled={interviews.length === 0}
          />

          <Link
            to="/interview/setup"
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-xs tracking-wider uppercase flex items-center gap-2 shadow-xl shadow-cyan-500/25 transition-all hover:scale-105"
          >
            <PlayCircle className="w-4 h-4 text-slate-950" />
            <span>START NEW SESSION</span>
          </Link>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-white/10">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, candidate, or track..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/70 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          {['ALL', 'FRESHER', 'EXPERIENCE'].map((tab) => (
            <button
              key={tab}
              onClick={() => setTrackFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                trackFilter === tab 
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {tab === 'ALL' ? 'All Tracks' : tab === 'FRESHER' ? 'Fresher' : 'Real-Time'}
            </button>
          ))}
        </div>
      </div>

      {/* History Cards / Table */}
      <div className="space-y-4">
        {filteredInterviews.length === 0 ? (
          <div className="p-12 rounded-3xl bg-slate-900/40 border border-white/10 text-center space-y-3">
            <History className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="text-sm font-bold text-white">No Interview Records Found</h3>
            <p className="text-xs text-slate-400">Complete an interview session to generate and export your first assessment report.</p>
          </div>
        ) : (
          filteredInterviews.map((item) => {
            const isHigh = item.overallScore >= 80;
            return (
              <div
                key={item.interviewId}
                className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 hover:border-cyan-500/30 backdrop-blur-xl transition-all duration-200 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
              >
                {/* Session Meta */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-extrabold text-sm text-white">{item.interviewId}</span>
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-800 text-slate-300 border border-white/5">
                      {item.track}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      • {item.date} {item.timestamp ? `(${item.timestamp})` : ''}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">
                    Candidate: <strong className="text-white">{item.candidate?.name}</strong> • Questions: <span className="font-mono text-emerald-400">{item.answeredQuestions ?? (item.evaluations?.filter(e => !e.isSkipped).length || item.questionsCount || 5)} Answered</span> • Skipped: <span className="font-mono text-amber-400">{item.skippedQuestions ?? (item.evaluations?.filter(e => e.isSkipped).length || 0)}</span> • Duration: <span className="font-mono text-slate-400">{item.duration || '12m 30s'}</span>
                  </p>
                </div>

                {/* Score & Actions */}
                <div className="flex flex-wrap items-center gap-4 self-stretch lg:self-auto justify-between lg:justify-end border-t lg:border-t-0 pt-4 lg:pt-0 border-white/5">
                  
                  {/* Score Badge */}
                  <div className="text-left lg:text-right pr-2">
                    <span className="text-[10px] text-slate-400 block font-semibold">FINAL SCORE</span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-cyan-400 font-mono leading-none">
                        {item.overallScore}%
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        isHigh ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                      }`}>
                        {item.performanceLevel || (isHigh ? "Very Good" : "Good")}
                      </span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleViewReport(item)}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-cyan-400" />
                      <span>View</span>
                    </button>

                    <DownloadReportButton interviewData={item} variant="primary" size="sm" label="PDF" />

                    <DownloadExcelButton interviewData={item} variant="outline" size="sm" label="Excel" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
