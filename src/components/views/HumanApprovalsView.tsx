import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, RefreshCw, AlertTriangle, User, Calendar, FileText, ArrowRight, Sparkles, MessageSquare } from 'lucide-react';
import { ActionPlan, FarmerReport } from '../../types';
import { NavTab } from '../Sidebar';

interface HumanApprovalsViewProps {
  actionPlans: ActionPlan[];
  reports: FarmerReport[];
  onReviewDecision: (planId: string, decision: 'Approved' | 'Rejected' | 'Revision Requested', comments: string) => Promise<void>;
  onNavigate: (tab: NavTab) => void;
}

export const HumanApprovalsView: React.FC<HumanApprovalsViewProps> = ({
  actionPlans,
  reports,
  onReviewDecision,
  onNavigate
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(actionPlans[0]?.id || 'plan-rep-001');
  const [reviewerComments, setReviewerComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentPlan = actionPlans.find(p => p.id === selectedPlanId) || actionPlans[0];
  const associatedReport = reports.find(r => r.id === currentPlan?.reportId);

  const handleDecision = async (decision: 'Approved' | 'Rejected' | 'Revision Requested') => {
    if (!currentPlan) return;
    setIsSubmitting(true);
    try {
      await onReviewDecision(currentPlan.id, decision, reviewerComments);
      setReviewerComments('');
    } catch (err) {
      console.error('Failed to submit approval decision:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Human Approval Workspace</h2>
            <p className="text-xs text-slate-400">
              High-impact agricultural plans require mandatory review by human agricultural coordinators
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Human-in-the-Loop Enforced</span>
          </span>
        </div>
      </div>

      {/* Plan Selector Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {actionPlans.map(plan => {
          const isSelected = plan.id === currentPlan?.id;
          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlanId(plan.id)}
              className={`p-3.5 rounded-xl border transition cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 border-amber-500 shadow-lg ring-1 ring-amber-500/50'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-bold text-white">{plan.id}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  plan.humanReviewStatus === 'Approved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  plan.humanReviewStatus === 'Rejected' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                  plan.humanReviewStatus === 'Revision Requested' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                  'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {plan.humanReviewStatus}
                </span>
              </div>
              <h4 className="font-semibold text-xs text-slate-200">{plan.farmerName} • {plan.district}</h4>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">{plan.primaryCropRecommended}</p>
            </div>
          );
        })}
      </div>

      {/* Deep Approval Review Dossier */}
      {currentPlan && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-emerald-400">Plan Dossier: {currentPlan.id}</span>
                <span className="text-slate-500">•</span>
                <span className="text-xs text-slate-400">Report: {currentPlan.reportId}</span>
                <span className="text-slate-500">•</span>
                <span className="text-xs text-slate-400">Version: v{currentPlan.version}</span>
              </div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>{currentPlan.farmerName} – Comprehensive Farm Action Dossier</span>
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('rooms')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition"
              >
                Inspect Switch Room Discussion
              </button>
            </div>
          </div>

          {/* Section 1: Original Problem & Triage Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400 font-semibold uppercase text-[10px] block mb-1">Original Farmer Submission</span>
              <p className="text-slate-300 leading-relaxed">{associatedReport?.problemDescription || 'Farmer problem record'}</p>
              <div className="mt-2 text-[11px] text-slate-400">
                Land: <strong className="text-slate-200">{associatedReport?.landAreaAcres} Acres</strong> • Soil: <strong className="text-slate-200">{associatedReport?.soilType}</strong> • Water: <strong className="text-amber-400">{associatedReport?.waterAvailability}</strong>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-emerald-400 font-semibold uppercase text-[10px] block mb-1">Agri-Triage Synthesis</span>
              <p className="text-slate-300 leading-relaxed">{currentPlan.triageSummary}</p>
              <div className="mt-2 text-[11px] text-emerald-400 font-medium">
                Consensus Status: 100% Agreement across CropMind, MarketPulse & WeatherGuard
              </div>
            </div>
          </div>

          {/* Section 2: 3 Specialist Agent Findings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-green-400 font-bold block mb-1">CropMind (Agronomy)</span>
              <p className="text-slate-300">{currentPlan.cropAnalysisSummary}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-amber-400 font-bold block mb-1">MarketPulse (APMC Mandi)</span>
              <p className="text-slate-300">{currentPlan.marketAnalysisSummary}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-cyan-400 font-bold block mb-1">WeatherGuard (Meteorology)</span>
              <p className="text-slate-300">{currentPlan.weatherRiskSummary}</p>
            </div>
          </div>

          {/* Section 3: Action Timeline Table */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
            <h4 className="font-bold text-white mb-2">Prescribed Agricultural Action Plan Timeline</h4>
            <div className="space-y-2">
              {currentPlan.actionItems.map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="sm:w-1/4 font-semibold text-emerald-400">{item.timeline}</div>
                  <div className="sm:w-1/2 text-slate-200">{item.activity}</div>
                  <div className="sm:w-1/4 text-slate-400 text-right text-[11px] italic">{item.criticalNotes}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Limitations & Missing Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-amber-400 font-semibold block mb-1">Limitations & Modeling Assumptions</span>
              <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                {currentPlan.limitationsAndAssumptions.map((lim, i) => (
                  <li key={i}>{lim}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-indigo-400 font-semibold block mb-1">Identified Missing Field Information</span>
              <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                {currentPlan.missingInformationIdentified.map((info, i) => (
                  <li key={i}>{info}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Existing Review Audit Record if already reviewed */}
          {currentPlan.reviewedAt && (
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[10px]">Decision Recorded</span>
                <span className="font-bold text-white">{currentPlan.humanReviewStatus} by {currentPlan.reviewerName}</span>
                {currentPlan.humanComments && <p className="text-slate-400 mt-0.5">"{currentPlan.humanComments}"</p>}
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {new Date(currentPlan.reviewedAt).toLocaleString()}
              </span>
            </div>
          )}

          {/* Coordinator Decision Box */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <label className="block text-xs font-semibold text-white">
              Coordinator Review Notes / Guidance for Farmer
            </label>
            <textarea
              rows={2}
              value={reviewerComments}
              onChange={e => setReviewerComments(e.target.value)}
              placeholder="e.g., Sanctioned. Recommend adding Azospirillum bio-fertilizer pack and coordinating with Salem Horticulture office for drip subsidy..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
            />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <span className="text-[11px] text-slate-400">
                Action will be audited and broadcast directly to Switch Room #{associatedReport?.roomId}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleDecision('Rejected')}
                  className="px-3.5 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Reject Recommendation</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleDecision('Revision Requested')}
                  className="px-3.5 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Request Specialist Revision</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleDecision('Approved')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition shadow-lg shadow-emerald-950/40 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve Action Plan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
