import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Bot, 
  Sprout, 
  TrendingUp, 
  CloudSun, 
  MessagesSquare, 
  ShieldCheck, 
  BarChart3, 
  DownloadCloud, 
  Settings,
  Radio,
  Sparkles
} from 'lucide-react';

export type NavTab = 
  | 'overview' 
  | 'farmers' 
  | 'reports' 
  | 'agents' 
  | 'crop' 
  | 'market' 
  | 'weather' 
  | 'rooms' 
  | 'approvals' 
  | 'analytics' 
  | 'downloads' 
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  pendingApprovalsCount: number;
  activeRoomsCount: number;
  switchMode: 'sandbox' | 'switch_live_gateway';
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  pendingApprovalsCount,
  activeRoomsCount,
  switchMode
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: number | string; badgeColor?: string }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'farmers', label: 'Farmers', icon: <Users className="w-4 h-4" /> },
    { id: 'reports', label: 'Agri Reports', icon: <FileText className="w-4 h-4" /> },
    { id: 'agents', label: 'AI Agent Workspace', icon: <Bot className="w-4 h-4" />, badge: '5 Online', badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' },
    { id: 'crop', label: 'Crop Intelligence', icon: <Sprout className="w-4 h-4" /> },
    { id: 'market', label: 'Market Intelligence', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'weather', label: 'Weather Intelligence', icon: <CloudSun className="w-4 h-4" /> },
    { id: 'rooms', label: 'Collaboration Rooms', icon: <MessagesSquare className="w-4 h-4" />, badge: activeRoomsCount, badgeColor: 'bg-emerald-500 text-slate-950 font-bold' },
    { id: 'approvals', label: 'Human Approvals', icon: <ShieldCheck className="w-4 h-4" />, badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined, badgeColor: 'bg-amber-500 text-slate-950 font-bold' },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'downloads', label: 'Reports & Export', icon: <DownloadCloud className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 select-none z-20">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-950/40 border border-emerald-400/30">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-white">AgriCommand</span>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">AI</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-none mt-0.5">Collaborative Farm Intel</p>
          </div>
        </div>
      </div>

      {/* Switch Protocol Badge */}
      <div className="mx-3 my-3 p-2.5 rounded-lg bg-slate-950/70 border border-emerald-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="absolute w-4 h-4 rounded-full bg-emerald-500/30 animate-ping"></span>
          </div>
          <div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-200">
              <Radio className="w-3 h-3 text-emerald-400" />
              <span>Switch Infra</span>
            </div>
            <p className="text-[10px] text-emerald-400/90 font-mono capitalize">
              {switchMode === 'sandbox' ? 'Sandbox Active' : 'Live Gateway'}
            </p>
          </div>
        </div>
        <div className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
          v1.0
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-1 space-y-1">
        <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold px-3 py-1">
          Navigation
        </div>
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-emerald-600/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isActive ? 'text-emerald-400' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User / Coordinator Profile Card */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900 border border-slate-800">
          <div className="w-8 h-8 rounded-full bg-emerald-800/60 border border-emerald-600/40 flex items-center justify-center text-xs font-bold text-emerald-300">
            DS
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-slate-200 truncate">Dr. Sundaram</div>
            <div className="text-[10px] text-slate-400 truncate">Agri Coordinator (Salem)</div>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-400" title="Online" />
        </div>
      </div>
    </aside>
  );
};
