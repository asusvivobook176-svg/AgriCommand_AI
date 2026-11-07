import React, { useState } from 'react';
import { X, ShieldCheck, UserCheck, KeyRound, Database, CheckCircle2, AlertCircle, LogIn, UserPlus } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { UserRole } from '../types/database.types';

export interface ActiveUserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: ActiveUserProfile;
  onUpdateUser: (user: ActiveUserProfile) => void;
}

const PRESET_ROLES: { role: UserRole; label: string; name: string; org: string; color: string }[] = [
  {
    role: 'coordinator',
    label: 'Agricultural Coordinator',
    name: 'Dr. Sundaram (Agri Coordinator)',
    org: 'Department of Agricultural Extension, Salem',
    color: 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
  },
  {
    role: 'expert',
    label: 'Agricultural Expert / Agronomist',
    name: 'Dr. Meenakshi Raman (Soil Scientist)',
    org: 'Tamil Nadu Agricultural University (TNAU)',
    color: 'border-blue-500 bg-blue-950/40 text-blue-300'
  },
  {
    role: 'field_officer',
    label: 'Field Officer',
    name: 'K. Vignesh (Salem Agri Block)',
    org: 'Salem District Agro-Extension Center',
    color: 'border-amber-500 bg-amber-950/40 text-amber-300'
  },
  {
    role: 'farmer',
    label: 'Farmer',
    name: 'Ravi Kumar (Farmer)',
    org: 'Thalaivasal Farmers Producer Group',
    color: 'border-teal-500 bg-teal-950/40 text-teal-300'
  },
  {
    role: 'admin',
    label: 'System Administrator',
    name: 'AgriCommand Admin',
    org: 'Switch Agriculture Platform Operations',
    color: 'border-purple-500 bg-purple-950/40 text-purple-300'
  }
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser
}) => {
  const [authMode, setAuthMode] = useState<'switch_role' | 'supabase_login'>('switch_role');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: typeof PRESET_ROLES[0]) => {
    const updated: ActiveUserProfile = {
      id: `usr-${preset.role}-01`,
      name: preset.name,
      email: `${preset.role}.demo@agricommand.ai`,
      role: preset.role,
      organization: preset.org
    };
    localStorage.setItem('agricommand_active_user', JSON.stringify(updated));
    onUpdateUser(updated);
    setMessage({ type: 'success', text: `Switched active role to: ${preset.label}` });
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const handleSupabaseAuth = async (isSignUp: boolean) => {
    if (!email || !password) {
      setMessage({ type: 'error', text: 'Please enter both email and password.' });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password
        });
        if (error) throw error;
        const user = data.user;
        const profile: ActiveUserProfile = {
          id: user?.id || `usr-${Date.now()}`,
          name: email.split('@')[0],
          email,
          role: 'coordinator',
          organization: 'AgriCommand Verified Organization'
        };
        onUpdateUser(profile);
        setMessage({ type: 'success', text: 'Supabase account created successfully!' });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        const user = data.user;
        const profile: ActiveUserProfile = {
          id: user?.id || `usr-${Date.now()}`,
          name: email.split('@')[0],
          email,
          role: 'coordinator',
          organization: 'AgriCommand Verified Organization'
        };
        onUpdateUser(profile);
        setMessage({ type: 'success', text: 'Signed in successfully via Supabase Auth!' });
      }
      setTimeout(() => onClose(), 800);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Authentication failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Supabase Auth & RBAC Governance</h2>
            <p className="text-xs text-slate-400">Select an agricultural persona or authenticate via Supabase</p>
          </div>
        </div>

        {/* Database Backend Mode Badge */}
        <div className="mb-4 p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300 font-medium">Backend Engine:</span>
          </div>
          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${isSupabaseConfigured ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50' : 'bg-blue-900/40 text-blue-300 border border-blue-700/50'}`}>
            {isSupabaseConfigured ? 'Live Supabase Cloud' : 'Resilient In-Memory PostgreSQL'}
          </span>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-800 mb-4">
          <button
            onClick={() => setAuthMode('switch_role')}
            className={`pb-2.5 px-3 text-xs font-semibold cursor-pointer border-b-2 transition ${authMode === 'switch_role' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            Instant Role Switcher
          </button>
          <button
            onClick={() => setAuthMode('supabase_login')}
            className={`pb-2.5 px-3 text-xs font-semibold cursor-pointer border-b-2 transition ${authMode === 'supabase_login' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            Supabase Credentials
          </button>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-lg text-xs flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300' : 'bg-red-950/60 border border-red-800 text-red-300'}`}>
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        {authMode === 'switch_role' ? (
          <div className="space-y-2.5">
            <p className="text-xs text-slate-400 mb-1">
              Test multi-agent approvals, farmer reports, or triage routing under different organizational privileges:
            </p>
            {PRESET_ROLES.map((preset) => {
              const isSelected = currentUser.role === preset.role;
              return (
                <button
                  key={preset.role}
                  onClick={() => handleSelectPreset(preset)}
                  className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between cursor-pointer ${isSelected ? preset.color : 'border-slate-800 bg-slate-950/40 hover:bg-slate-800/60 text-slate-300'}`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-white">{preset.label}</span>
                      {isSelected && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/40">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">{preset.name} • {preset.org}</div>
                  </div>
                  <UserCheck className={`w-4 h-4 ${isSelected ? 'opacity-100' : 'opacity-40'}`} />
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="officer@agricommand.gov.in"
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleSupabaseAuth(false)}
                disabled={loading}
                className="flex-1 py-2 px-3 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              </button>
              <button
                onClick={() => handleSupabaseAuth(true)}
                disabled={loading}
                className="flex-1 py-2 px-3 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </button>
            </div>
          </div>
        )}

        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>Row Level Security (RLS) Active</span>
          <span>Switch Agent Protocol v1.0</span>
        </div>
      </div>
    </div>
  );
};
