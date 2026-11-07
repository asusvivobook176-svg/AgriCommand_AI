import React from 'react';
import { 
  Users, 
  FileText, 
  Bot, 
  ShieldCheck, 
  TrendingUp, 
  CloudRain, 
  ArrowRight, 
  Radio, 
  PlayCircle, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Sparkles,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { Farmer, FarmerReport, SwitchAgent, ActionPlan, SwitchCollaborationRoom } from '../../types';
import { NavTab } from '../Sidebar';

interface OverviewViewProps {
  farmers: Farmer[];
  reports: FarmerReport[];
  agents: SwitchAgent[];
  actionPlans: ActionPlan[];
  rooms: SwitchCollaborationRoom[];
  onNavigate: (tab: NavTab) => void;
  onRunWorkflow: (reportId: string) => Promise<void>;
  isRunningWorkflow: boolean;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  farmers,
  reports,
  agents,
  actionPlans,
  rooms,
  onNavigate,
  onRunWorkflow,
  isRunningWorkflow
}) => {
  const pendingApprovals = actionPlans.filter(p => p.humanReviewStatus === 'Pending');
  const activeReports = reports.filter(r => r.status !== 'Approved' && r.status !== 'Rejected');
  const onlineAgents = agents.filter(a => a.status === 'Online' || a.status === 'Working');

  // Featured report: Ravi Kumar's report
  const featuredReport = reports.find(r => r.farmerId === 'farmer-ravi-kumar') || reports[0];

  return (
    <div className="space-y-6">
      {/* Hero Banner: Hackathon Business Workflow Context */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/20 p-6 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold tracking-wide border border-emerald-500/30 flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-emerald-400" />
                Switch Multi-Agent Architecture
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-semibold border border-indigo-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                Gemini 3.8 Flash
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
              AgriCommand AI Operations Desk
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 leading-relaxed">
              Orchestrating 5 specialized agricultural AI agents and human coordinators via Switch shared collaboration rooms to solve farm water stress, crop selection, and mandi price volatility.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('rooms')}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition flex items-center gap-2 shadow-lg shadow-emerald-950/40 cursor-pointer"
            >
              <Radio className="w-4 h-4" />
              <span>Enter Switch Room</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('approvals')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs transition flex items-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Approval Center ({pendingApprovals.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div 
          onClick={() => onNavigate('farmers')} 
          className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 p-4 rounded-xl transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Registered Farmers</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{farmers.length}</span>
            <span className="text-[11px] text-emerald-400 font-medium">Salem District</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">12.3 acres total monitored</p>
        </div>

        {/* Metric 2 */}
        <div 
          onClick={() => onNavigate('reports')} 
          className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 p-4 rounded-xl transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Active Agri Reports</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-105 transition">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{activeReports.length}</span>
            <span className="text-[11px] text-blue-400 font-medium">In Pipeline</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{reports.length} total historical</p>
        </div>

        {/* Metric 3 */}
        <div 
          onClick={() => onNavigate('agents')} 
          className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 p-4 rounded-xl transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">AI Agents Online</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:scale-105 transition">
              <Bot className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{onlineAgents.length} / {agents.length}</span>
            <span className="text-[11px] text-emerald-400 font-medium">100% Ready</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Switch Protocol Synchronized</p>
        </div>

        {/* Metric 4 */}
        <div 
          onClick={() => onNavigate('approvals')} 
          className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 p-4 rounded-xl transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Pending Approvals</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-105 transition">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{pendingApprovals.length}</span>
            <span className="text-[11px] text-amber-400 font-medium">Requires Coordinator</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Human-in-the-loop guarantee</p>
        </div>
      </div>

      {/* Featured Demonstration Scenario Card */}
      {featuredReport && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  FEATURED WORKFLOW SCENARIO
                </span>
                <span className="text-xs text-slate-400 font-mono">Report ID: {featuredReport.id}</span>
              </div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>{featuredReport.farmerName}</span>
                <span className="text-xs font-normal text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  {featuredReport.village}, {featuredReport.district}
                </span>
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onRunWorkflow(featuredReport.id)}
                disabled={isRunningWorkflow}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs flex items-center gap-2 transition shadow-lg shadow-emerald-950/40 cursor-pointer disabled:opacity-50"
              >
                <PlayCircle className={`w-4 h-4 ${isRunningWorkflow ? 'animate-spin' : ''}`} />
                <span>{isRunningWorkflow ? 'Executing 5 Agents...' : 'Run Multi-Agent Collaboration'}</span>
              </button>

              <button
                onClick={() => onNavigate('rooms')}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition flex items-center gap-1.5"
              >
                <span>View Room</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 text-xs">
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400 font-medium block mb-1">Land & Soil</span>
              <p className="font-semibold text-white">{featuredReport.landAreaAcres} Acres • {featuredReport.soilType}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Moisture holding capacity: Low</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400 font-medium block mb-1">Water Constraint</span>
              <p className="font-semibold text-amber-400">{featuredReport.waterAvailability}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Borewell 1.5 - 2 hrs/day yield</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400 font-medium block mb-1">Previous Crop Challenge</span>
              <p className="font-semibold text-white">{featuredReport.previousCrop}</p>
              <p className="text-[11px] text-red-400 mt-0.5">Pod water starvation & seed loss</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400 font-medium block mb-1">Consensus Recommendation</span>
              <p className="font-semibold text-emerald-400">Finger Millet (Ragi - Paiyur 2)</p>
              <p className="text-[11px] text-slate-400 mt-0.5">92% score • ₹3,850/qtl mandi price</p>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
            <span className="font-semibold text-emerald-400 mr-2">Core Problem Description:</span>
            {featuredReport.problemDescription}
          </div>
        </div>
      )}

      {/* Two Column Layout: Agent Team Status & Real-Time Intelligence Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: 5 Specialized AI Agents Live Card */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Bot className="w-4 h-4 text-emerald-400" />
                Specialized AI Agents in Switch Room
              </h3>
              <p className="text-xs text-slate-400">Cooperating in real-time under Dr. Sundaram's coordination</p>
            </div>
            <button
              onClick={() => onNavigate('agents')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
            >
              <span>Inspect Workspace</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {agents.map((agent) => (
              <div 
                key={agent.id}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between hover:border-slate-700 transition"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg ${agent.avatarColor} flex items-center justify-center text-white font-bold text-xs shadow-md`}>
                    {agent.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white">{agent.name}</span>
                      <span className="text-[10px] text-slate-400">({agent.role})</span>
                      {agent.isMLPowered && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          ML Classifier
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate max-w-md mt-0.5">{agent.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{agent.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Quick Mandi & Weather Snapshot */}
        <div className="space-y-4">
          {/* Weather Snapshot */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <CloudRain className="w-4 h-4 text-cyan-400" />
                Salem Weather Alert
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-semibold">
                -26.4% Rain Deficit
              </span>
            </div>
            <div className="text-2xl font-bold text-white">33.4°C</div>
            <p className="text-[11px] text-slate-400 mt-1">High daytime temperature, severe soil moisture deficit in Thalaivasal block.</p>
            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Drought Risk Score:</span>
              <span className="font-bold text-amber-400">68 / 100 (Moderate-High)</span>
            </div>
          </div>

          {/* Mandi Price Snapshot */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                Salem APMC Mandi Spot
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                Bullish
              </span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-300">Finger Millet (Ragi)</span>
                <span className="font-bold text-emerald-400">₹3,850 / qtl</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-300">Sesame (Gingelly)</span>
                <span className="font-bold text-amber-400">₹12,400 / qtl</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-300">Groundnut</span>
                <span className="font-bold text-slate-400">₹6,900 / qtl</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 text-center">Verified Sample Mandi Adapter • Agmarknet</p>
          </div>
        </div>
      </div>
    </div>
  );
};
