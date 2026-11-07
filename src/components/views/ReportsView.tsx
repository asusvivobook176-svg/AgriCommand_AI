import React, { useState } from 'react';
import { FileText, Search, PlayCircle, MessagesSquare, ShieldCheck, MapPin, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { FarmerReport } from '../../types';
import { NavTab } from '../Sidebar';

interface ReportsViewProps {
  reports: FarmerReport[];
  onNavigate: (tab: NavTab) => void;
  onRunWorkflow: (reportId: string) => Promise<void>;
  isRunningWorkflow: boolean;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  reports,
  onNavigate,
  onRunWorkflow,
  isRunningWorkflow
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReports = reports.filter(r => {
    const matchesCategory = filterCategory === 'all' || r.category === filterCategory;
    const matchesPriority = filterPriority === 'all' || r.priority === filterPriority;
    const matchesSearch = r.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.problemDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesPriority && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Agricultural Problem Reports</h2>
            <p className="text-xs text-slate-400">
              Submitted farm challenges triaged and delegated across Switch collaboration rooms
            </p>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search reports by ID, farmer name, district, or problem..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 shrink-0">Category:</span>
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
            >
              <option value="all">All Categories</option>
              <option value="Crop selection">Crop selection</option>
              <option value="Soil problems">Soil problems</option>
              <option value="Water availability">Water availability</option>
              <option value="Weather risks">Weather risks</option>
              <option value="Market demand">Market demand</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 shrink-0">Priority:</span>
            <select
              value={filterPriority}
              onChange={e => setFilterPriority(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
            >
              <option value="all">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <div 
            key={report.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg transition"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-emerald-400">{report.id}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                    {report.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    report.priority === 'High' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                    report.priority === 'Medium' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {report.priority} Priority
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    report.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    report.status === 'Pending Human Approval' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}>
                    {report.status}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{report.farmerName}</span>
                  <span className="text-xs font-normal text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    {report.village}, {report.district} ({report.landAreaAcres} Acres, {report.soilType})
                  </span>
                </h3>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onRunWorkflow(report.id)}
                  disabled={isRunningWorkflow}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                  title="Run multi-agent AI pipeline for this report"
                >
                  <PlayCircle className="w-3.5 h-3.5" />
                  <span>Run Multi-Agent</span>
                </button>

                <button
                  onClick={() => onNavigate('rooms')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
                  title="Open Switch Collaboration Room"
                >
                  <MessagesSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Switch Room</span>
                </button>

                {report.actionPlanId && (
                  <button
                    onClick={() => onNavigate('approvals')}
                    className="px-3 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Action Plan</span>
                  </button>
                )}
              </div>
            </div>

            {/* Problem Text */}
            <p className="text-xs text-slate-300 mt-3 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              {report.problemDescription}
            </p>

            {/* Bottom Meta */}
            <div className="mt-3 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
              <div className="flex items-center gap-3">
                <span>Water Status: <strong className="text-amber-400">{report.waterAvailability}</strong></span>
                <span>Previous Crop: <strong className="text-slate-200">{report.previousCrop}</strong></span>
                <span>Season: <strong className="text-slate-200">{report.currentSeason}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-mono">Switch Room: {report.roomId}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
