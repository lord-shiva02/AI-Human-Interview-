import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  Cell
} from 'recharts';

export const PerformanceChart = ({ 
  type = "trend", 
  data, 
  height = 260 
}) => {
  // Area Performance Trend Chart
  if (type === "trend") {
    const trendData = (data && data.length > 0) ? data : [
      { session: 'Session 1', score: 72, technical: 75, communication: 70, confidence: 72 },
      { session: 'Session 2', score: 78, technical: 80, communication: 76, confidence: 78 },
      { session: 'Session 3', score: 84, technical: 86, communication: 82, confidence: 85 }
    ];

    return (
      <div className="w-full h-full min-h-[220px]">
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorScore" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorTech" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
            <XAxis dataKey="session" stroke="#64748B" fontSize={11} tickLine={false} />
            <YAxis domain={[50, 100]} stroke="#64748B" fontSize={11} tickLine={false} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0F172A', 
                borderColor: 'rgba(255, 255, 255, 0.1)', 
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                fontSize: '12px',
                color: '#F8FAFC'
              }} 
            />
            <Area 
              type="monotone" 
              dataKey="score" 
              name="Overall Score" 
              stroke="#06B6D4" 
              strokeWidth={2.5} 
              fillOpacity={1} 
              fill="url(#colorScore)" 
            />
            <Area 
              type="monotone" 
              dataKey="technical" 
              name="Technical" 
              stroke="#6366F1" 
              strokeWidth={1.5} 
              strokeDasharray="4 4"
              fillOpacity={1} 
              fill="url(#colorTech)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // Multi-Dimensional Radar Competency Chart
  if (type === "radar") {
    const radarData = data || [
      { subject: 'Technical', A: 85, fullMark: 100 },
      { subject: 'Relevance', A: 88, fullMark: 100 },
      { subject: 'Communication', A: 82, fullMark: 100 },
      { subject: 'Completeness', A: 80, fullMark: 100 },
      { subject: 'Problem Solving', A: 84, fullMark: 100 },
      { subject: 'Confidence', A: 86, fullMark: 100 },
      { subject: 'Fluency', A: 83, fullMark: 100 },
    ];

    return (
      <div className="w-full h-full flex items-center justify-center min-h-[220px]">
        <ResponsiveContainer width="100%" height={height}>
          <RadarChart cx="50%" cy="50%" outerRadius="72%" data={radarData}>
            <PolarGrid stroke="rgba(255, 255, 255, 0.08)" />
            <PolarAngleAxis dataKey="subject" stroke="#94A3B8" fontSize={10.5} tickLine={false} />
            <PolarRadiusAxis angle={30} domain={[40, 100]} stroke="#475569" fontSize={9} />
            <Radar
              name="Competency"
              dataKey="A"
              stroke="#06B6D4"
              fill="#06B6D4"
              fillOpacity={0.35}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0F172A', 
                borderColor: 'rgba(255, 255, 255, 0.1)', 
                borderRadius: '12px',
                fontSize: '11px' 
              }} 
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // Category Bar Breakdown Chart
  const barData = data || [
    { name: 'Technical', score: 85, color: '#06B6D4' },
    { name: 'Communication', score: 82, color: '#6366F1' },
    { name: 'Relevance', score: 88, color: '#10B981' },
    { name: 'Confidence', score: 84, color: '#8B5CF6' },
    { name: 'Completeness', score: 80, color: '#3B82F6' }
  ];

  return (
    <div className="w-full h-full min-h-[220px]">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
          <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
          <YAxis domain={[0, 100]} stroke="#64748B" fontSize={11} tickLine={false} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#0F172A', 
              borderColor: 'rgba(255, 255, 255, 0.1)', 
              borderRadius: '12px',
              fontSize: '12px' 
            }} 
          />
          <Bar dataKey="score" radius={[6, 6, 0, 0]}>
            {barData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || '#06B6D4'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
