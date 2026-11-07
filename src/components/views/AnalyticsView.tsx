import React from 'react';
import { BarChart3, TrendingUp, CheckCircle2, Clock, Bot, ShieldCheck } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';

export const AnalyticsView: React.FC = () => {
  const cropAdoptionData = [
    { name: 'Finger Millet (Ragi)', value: 45, color: '#10b981' },
    { name: 'Sesame (Gingelly)', value: 25, color: '#f59e0b' },
    { name: 'Black Gram', value: 15, color: '#6366f1' },
    { name: 'Fodder Sorghum', value: 10, color: '#06b6d4' },
    { name: 'Others', value: 5, color: '#94a3b8' }
  ];

  const resolutionTimeData = [
    { step: 'Triage Ingestion', seconds: 1.2 },
    { step: 'Agronomy Analysis', seconds: 2.4 },
    { step: 'Mandi Scan', seconds: 1.8 },
    { step: 'Weather Modeling', seconds: 1.5 },
    { step: 'Report Synthesis', seconds: 2.1 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
          <BarChart3 className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">Intelligence & Operational Analytics</h2>
          <p className="text-xs text-slate-400">
            Multi-agent resolution efficiency, crop recommendation adoption, and risk reduction metrics
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-slate-400 text-xs">Approval Agreement Rate</span>
          <div className="mt-2 text-2xl font-bold text-emerald-400">96.4%</div>
          <p className="text-[11px] text-slate-400 mt-0.5">High human-agent consensus</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-slate-400 text-xs">Avg. Agent Synthesis Latency</span>
          <div className="mt-2 text-2xl font-bold text-white">4.8s</div>
          <p className="text-[11px] text-emerald-400 mt-0.5">Gemini 3.8 Flash pipeline</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-slate-400 text-xs">Water Consumption Saved</span>
          <div className="mt-2 text-2xl font-bold text-cyan-400">45.2%</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Vs baseline groundnut cropping</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-slate-400 text-xs">Estimated Farm Profit Delta</span>
          <div className="mt-2 text-2xl font-bold text-amber-400">+₹14,500/ac</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Lower seed & power expenditure</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Adoption Distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <h3 className="text-sm font-bold text-white mb-1">Recommended Crop Distribution</h3>
          <p className="text-xs text-slate-400 mb-4">Share of crop recommendations in drought-affected red soils</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={cropAdoptionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {cropAdoptionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Multi-Agent Latency Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <h3 className="text-sm font-bold text-white mb-1">Agent Step Execution Latency (Seconds)</h3>
          <p className="text-xs text-slate-400 mb-4">Switch room message exchange and processing turnaround</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resolutionTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="step" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }} />
                <Bar dataKey="seconds" name="Latency (s)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
