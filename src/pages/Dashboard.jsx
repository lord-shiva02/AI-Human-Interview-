import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  PlayCircle, 
  TrendingUp, 
  Award, 
  Target, 
  History, 
  BrainCircuit, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  Sparkles, 
  Calendar, 
  Layers, 
  ArrowUpRight, 
  ShieldCheck, 
  FileSpreadsheet, 
  FileText,
  User,
  PlusCircle,
  BarChart2
} from 'lucide-react';
import { mockInterviewService } from '../services/mockInterviewService';
import { calculateDashboardStats } from '../data/mockDashboard';
import { PerformanceChart } from '../components/dashboard/PerformanceChart';
import { ScoreRing } from '../components/common/ScoreRing';
import { DownloadReportButton } from '../components/report/DownloadReportButton';
import { DownloadExcelButton } from '../components/report/DownloadExcelButton';
import { LiveProctorCameraWidget } from '../components/dashboard/LiveProctorCameraWidget';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [userProfile, setUserProfile] = useState(mockInterviewService.getUserProfile());

  const loadData = () => {
    const list = mockInterviewService.getAllInterviews();
    setInterviews(list);
    const computed = calculateDashboardStats(list);
    setStats(computed);
    setUserProfile(mockInterviewService.getUserProfile());
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => loadData();
    window.addEventListener('interviewDataUpdated', handleUpdate);
    window.addEventListener('userProfileUpdated', handleUpdate);

    return () => {
      window.removeEventListener('interviewDataUpdated', handleUpdate);
      window.removeEventListener('userProfileUpdated', handleUpdate);
    };
  }, []);

  if (!stats) return null;

  const hasInterviews = interviews && interviews.length > 0;
  const latestInterview = interviews[0] || null;

  // 7 Rubric scores for skill performance breakdown
  const rubricList = [
    { name: 'Technical Knowledge', key: 'technical', weight: '30%', score: stats.categoryAverages.technical || 82, color: '#06B6D4' },
    { name: 'Relevance', key: 'relevance', weight: '15%', score: stats.categoryAverages.relevance || 84, color: '#3B82F6' },
    { name: 'Communication', key: 'communication', weight: '15%', score: stats.categoryAverages.communication || 80, color: '#6366F1' },
    { name: 'Completeness', key: 'completeness', weight: '10%', score: stats.categoryAverages.completeness || 78, color: '#8B5CF6' },
    { name: 'Problem Solving', key: 'problemSolving', weight: '10%', score: stats.categoryAverages.problemSolving || 80, color: '#EC4899' },
    { name: 'Confidence Indicators', key: 'confidence', weight: '10%', score: stats.categoryAverages.confidence || 82, color: '#10B981' },
    { name: 'Fluency & Grammar', key: 'fluency', weight: '10%', score: stats.categoryAverages.fluency || 84, color: '#F59E0B' }
  ];

  // Radar data computed strictly from category averages
  const radarData = [
    { subject: 'Technical', A: stats.categoryAverages.technical || 80, fullMark: 100 },
    { subject: 'Relevance', A: stats.categoryAverages.relevance || 80, fullMark: 100 },
    { subject: 'Communication', A: stats.categoryAverages.communication || 80, fullMark: 100 },
    { subject: 'Completeness', A: stats.categoryAverages.completeness || 80, fullMark: 100 },
    { subject: 'Problem Solving', A: stats.categoryAverages.problemSolving || 80, fullMark: 100 },
    { subject: 'Confidence', A: stats.categoryAverages.confidence || 80, fullMark: 100 },
    { subject: 'Fluency', A: stats.categoryAverages.fluency || 80, fullMark: 100 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* 1. DASHBOARD HEADER BANNER */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900/95 via-[#0A1124]/90 to-[#101A30]/90 border border-white/10 backdrop-blur-2xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden">
        
        {/* Glow Accent */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              PERFORMANCE ANALYTICS
            </span>
            <span className="text-xs text-slate-400 font-medium">Session Sync Active</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Welcome back, {userProfile.name || 'Candidate'} 👋
          </h1>
          
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Track your interview preparation and improve with every practice session. Readiness Status: <strong className="text-cyan-300">{stats.readiness || "Active Candidate"}</strong>.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto z-10">
          {/* Download Master Excel Button */}
          <DownloadExcelButton 
            variant="outline" 
            size="md" 
            label="DOWNLOAD MASTER EXCEL"
            disabled={!hasInterviews}
          />

          <button
            onClick={() => navigate('/interview/setup')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 transition-all duration-200 hover:scale-105 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-slate-950" />
            <span>+ START NEW INTERVIEW</span>
          </button>
        </div>
      </div>

      {/* 2. PERFORMANCE SUMMARY (4 CORE METRIC CARDS) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Interviews Completed */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Interviews Completed</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <History className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono">{stats.totalInterviews}</span>
            <span className="text-xs text-slate-400">Sessions</span>
          </div>
          <p className="text-[10px] text-cyan-300 font-medium">Stored Records</p>
        </div>

        {/* Metric 2: Average Score */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Average Score</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-2xl sm:text-3xl font-black text-indigo-300 font-mono">{stats.averageScore}%</span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <p className="text-[10px] text-indigo-300 font-medium">Weighted Score</p>
        </div>

        {/* Metric 3: Best Score */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Best Score</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">{stats.bestScore}%</span>
            <span className="text-xs text-slate-400">Top Mark</span>
          </div>
          <p className="text-[10px] text-emerald-300 font-medium">Top Benchmark</p>
        </div>

        {/* Metric 4: Latest Score */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Latest Score</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <BrainCircuit className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-2xl sm:text-3xl font-black text-purple-300 font-mono">{stats.latestScore}%</span>
            <span className="text-xs text-slate-400">Recent</span>
          </div>
          <p className="text-[10px] text-purple-300 font-medium">Last Performance</p>
        </div>
      </div>

      {/* 3. LIVE PROCTOR CAMERA & PERFORMANCE PROGRESSION CHART ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 5 Cols: Real-Time Live Candidate Camera & Proctor Zone */}
        <div className="lg:col-span-5">
          <LiveProctorCameraWidget candidateName={userProfile.name} />
        </div>

        {/* Right 7 Cols: Performance Trend Chart & Empty State */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">PERFORMANCE CHART</span>
                <h3 className="text-lg font-bold text-white">Interview Performance Trend</h3>
              </div>
              {hasInterviews && (
                <span className="text-xs text-slate-400 font-mono">Last {stats.performanceTrend?.length || 0} Sessions</span>
              )}
            </div>

            {hasInterviews ? (
              <PerformanceChart type="line" data={stats.performanceTrend || []} height={240} />
            ) : (
              <div className="p-8 rounded-2xl bg-slate-950/60 border border-white/5 text-center space-y-3">
                <BarChart2 className="w-8 h-8 text-slate-500 mx-auto" />
                <h4 className="text-sm font-bold text-white">No interviews completed yet.</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Start your first AI interview to see your performance here.
                </p>
                <button
                  onClick={() => navigate('/interview/setup')}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                >
                  Start Interview
                </button>
              </div>
            )}
          </div>

          {/* Competency Radar Map */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider">RUBRIC PROFILE</span>
                <h3 className="text-lg font-bold text-white">7-Dimensional Competency Map</h3>
              </div>
            </div>

            <PerformanceChart type="radar" data={radarData} height={230} />
          </div>
        </div>
      </div>

      {/* 4. SKILL PERFORMANCE (EVALUATION BREAKDOWN ACROSS 7 RUBRICS) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
          <div>
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">SKILL PERFORMANCE</span>
            <h3 className="text-lg font-bold text-white">Evaluation Dimensions from Stored Interviews</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Weighted Overall: {stats.averageScore}%</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {rubricList.map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-[11px] text-slate-300 font-medium block truncate">{item.name}</span>
                <span className="text-[9px] text-slate-500 font-mono">Weight: {item.weight}</span>
              </div>
              <div>
                <span className="text-xl font-mono font-black text-white">{item.score}%</span>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                  <div className="h-full rounded-full" style={{ width: `${item.score}%`, backgroundColor: item.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. RECENT INTERVIEWS TABLE */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">RECENT SESSIONS</span>
            <h3 className="text-lg font-bold text-white">Latest Interview Records</h3>
          </div>
          <Link
            to="/history"
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>View All Sessions</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {hasInterviews ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Track</th>
                  <th className="pb-3 font-semibold">Difficulty</th>
                  <th className="pb-3 font-semibold">Score</th>
                  <th className="pb-3 font-semibold">Performance Level</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {interviews.slice(0, 5).map((item) => (
                  <tr key={item.interviewId} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 text-slate-300 font-medium">{item.date}</td>
                    <td className="py-3.5">
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-white/5 font-semibold text-[11px]">
                        {item.track}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-400 capitalize">{item.difficulty || "Standard"}</td>
                    <td className="py-3.5 font-mono font-black text-cyan-400 text-sm">{item.overallScore}%</td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        item.overallScore >= 80 
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                          : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                      }`}>
                        {item.performanceLevel || (item.overallScore >= 80 ? "Very Good" : "Good")}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            localStorage.setItem("ai_interview_latest_result", JSON.stringify(item));
                            navigate('/interview/result');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-cyan-400" />
                          <span>View Report</span>
                        </button>
                        <DownloadReportButton interviewData={item} variant="secondary" size="sm" label="Download PDF" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 rounded-2xl bg-slate-950/40 border border-white/5 text-center space-y-2">
            <p className="text-sm font-semibold text-slate-300">Your interview journey starts here.</p>
            <p className="text-xs text-slate-400">Upload your resume and complete your first AI-powered mock interview.</p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/interview/setup')}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
              >
                Start Your First Interview
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 6. QUICK ACTIONS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => navigate('/interview/setup')}
          className="p-6 rounded-3xl bg-slate-900/80 hover:bg-slate-800/90 border border-cyan-500/30 hover:border-cyan-400 text-left transition-all duration-200 group cursor-pointer space-y-2 shadow-lg"
        >
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <PlayCircle className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">Start New Interview</h4>
          <p className="text-xs text-slate-400">Upload resume, select track, and enter AI HR studio.</p>
        </button>

        <button
          onClick={() => navigate('/history')}
          className="p-6 rounded-3xl bg-slate-900/80 hover:bg-slate-800/90 border border-indigo-500/30 hover:border-indigo-400 text-left transition-all duration-200 group cursor-pointer space-y-2 shadow-lg"
        >
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <History className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">Interview History</h4>
          <p className="text-xs text-slate-400">Access past reports, review rubrics, and download logs.</p>
        </button>

        <button
          onClick={() => navigate('/profile')}
          className="p-6 rounded-3xl bg-slate-900/80 hover:bg-slate-800/90 border border-purple-500/30 hover:border-purple-400 text-left transition-all duration-200 group cursor-pointer space-y-2 shadow-lg"
        >
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <User className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">View Profile</h4>
          <p className="text-xs text-slate-400">Manage candidate credentials, skills, and settings.</p>
        </button>
      </div>

    </div>
  );
};

export default Dashboard;

