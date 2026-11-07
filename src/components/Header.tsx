import React, { useState } from 'react';
import { PlusCircle, Cpu, Radio, Sparkles, RefreshCw, User, ShieldCheck, Database } from 'lucide-react';
import { NavTab } from './Sidebar';
import { AuthModal, ActiveUserProfile } from './AuthModal';
import { isSupabaseConfigured } from '../lib/supabase';

interface HeaderProps {
  currentTab: NavTab;
  onOpenNewReport: () => void;
  onResetDemo: () => void;
  isResetting?: boolean;
  currentUser?: ActiveUserProfile;
  onUpdateUser?: (user: ActiveUserProfile) => void;
}

const TAB_TITLES: Record<NavTab, { title: string; subtitle: string }> = {
  overview: { title: 'Executive Intelligence Overview', subtitle: 'Real-time multi-agent agricultural operations and metrics' },
  farmers: { title: 'Registered Farmers Directory', subtitle: 'Farmer profiles, landholdings, soil characteristics and irrigation assets' },
  reports: { title: 'Agricultural Problem Reports', subtitle: 'Submitted farmer issues, triage status, and priority tracking' },
  agents: { title: 'Multi-Agent AI Workspace', subtitle: 'Monitor, inspect, and test the 5 specialized AI agents' },
  crop: { title: 'Crop Intelligence Center', subtitle: 'Agronomic suitability scoring, soil compatibility and water balance' },
  market: { title: 'Market Intelligence & Mandi APMC', subtitle: 'Agmarknet price trends, wholesale arrivals, and volatility indices' },
  weather: { title: 'Weather & Agrometeorology Center', subtitle: 'Rainfall deficits, heat stress analysis, and climate resilience' },
  rooms: { title: 'Switch Collaboration Rooms', subtitle: 'Real-time multi-agent and human collaborative workspace powered by Switch' },
  approvals: { title: 'Human Approval Workspace', subtitle: 'Review, comment, and sanction AI-generated agricultural action plans' },
  analytics: { title: 'Intelligence Analytics & Performance', subtitle: 'Platform-wide agricultural resolution and adoption metrics' },
  downloads: { title: 'Downloadable Agricultural Action Plans', subtitle: 'Export printable PDF and structured CSV farm action dossiers' },
  settings: { title: 'Platform & Integration Settings', subtitle: 'Switch console configuration, Gemini model telemetry, and external adapters' }
};

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenNewReport,
  onResetDemo,
  isResetting,
  currentUser = {
    id: 'demo-coord-01',
    name: 'Dr. Sundaram (Agri Coordinator)',
    email: 'sundaram.agri@tamilnadu.gov.in',
    role: 'coordinator',
    organization: 'Department of Agricultural Extension, Salem'
  },
  onUpdateUser = () => {}
}) => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const current = TAB_TITLES[currentTab] || { title: 'AgriCommand AI', subtitle: 'Agriculture Intelligence' };

  return (
    <>
      <header className="h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between shrink-0 z-10">
        <div>
          <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            {current.title}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">{current.subtitle}</p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Supabase Engine Indicator */}
          <button
            onClick={() => setIsAuthOpen(true)}
            className={`hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border cursor-pointer transition ${
              isSupabaseConfigured
                ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60'
                : 'bg-blue-950/70 border-blue-500/40 text-blue-300 hover:bg-blue-900/60'
            }`}
            title="Click to manage Supabase Authentication and Database"
          >
            <Database className="w-3.5 h-3.5" />
            <span>{isSupabaseConfigured ? 'Supabase Cloud' : 'Supabase (Local Sandbox)'}</span>
          </button>

          {/* Gemini Engine Indicator */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950/70 border border-indigo-500/30 text-indigo-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>Gemini 3.8 Flash</span>
          </div>

          {/* Switch Protocol Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950/70 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            <span>Switch Protocol</span>
          </div>

          {/* User Role Switcher Pill */}
          <button
            onClick={() => setIsAuthOpen(true)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs text-slate-200 transition cursor-pointer"
            title="Switch User Role or Sign In with Supabase"
          >
            <div className="w-5 h-5 rounded-full bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-300 font-bold text-[10px]">
              {currentUser.role.charAt(0).toUpperCase()}
            </div>
            <div className="hidden md:flex flex-col text-left leading-none">
              <span className="font-semibold text-[11px] text-white truncate max-w-[120px]">{currentUser.name.split(' ')[0]}</span>
              <span className="text-[9px] text-emerald-400 uppercase tracking-wider">{currentUser.role}</span>
            </div>
          </button>

          {/* Demo Scenario Loader */}
          <button
            onClick={onResetDemo}
            disabled={isResetting}
            title="Reload Ravi Kumar (Salem) demonstration scenario"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isResetting ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">Demo Scenario</span>
          </button>

          {/* Submit Report Action */}
          <button
            onClick={onOpenNewReport}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/30 transition border border-emerald-400/30 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit Problem</span>
          </button>
        </div>
      </header>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onUpdateUser={onUpdateUser}
      />
    </>
  );
};
