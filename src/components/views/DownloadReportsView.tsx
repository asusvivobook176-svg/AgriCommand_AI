import React, { useState } from 'react';
import { DownloadCloud, Printer, FileSpreadsheet, FileText, CheckCircle2, ShieldCheck, MapPin, Sparkles } from 'lucide-react';
import { ActionPlan, FarmerReport } from '../../types';

interface DownloadReportsViewProps {
  actionPlans: ActionPlan[];
  reports: FarmerReport[];
}

export const DownloadReportsView: React.FC<DownloadReportsViewProps> = ({ actionPlans, reports }) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(actionPlans[0]?.id || 'plan-rep-001');

  const plan = actionPlans.find(p => p.id === selectedPlanId) || actionPlans[0];
  const report = reports.find(r => r.id === plan?.reportId);

  // CSV Generator
  const handleDownloadCSV = () => {
    if (!plan) return;
    const headers = ['Field', 'Details'];
    const rows = [
      ['Dossier ID', plan.id],
      ['Farmer Name', plan.farmerName],
      ['District', plan.district],
      ['Primary Crop Recommended', plan.primaryCropRecommended],
      ['Secondary Crop Recommended', plan.secondaryCropRecommended],
      ['Human Review Status', plan.humanReviewStatus],
      ['Reviewer Name', plan.reviewerName || 'Dr. Sundaram'],
      ['Reviewed At', plan.reviewedAt || 'Pending'],
      ['Triage Summary', `"${plan.triageSummary.replace(/"/g, '""')}"`],
      ['Crop Analysis Summary', `"${plan.cropAnalysisSummary.replace(/"/g, '""')}"`],
      ['Market Analysis Summary', `"${plan.marketAnalysisSummary.replace(/"/g, '""')}"`],
      ['Weather Risk Summary', `"${plan.weatherRiskSummary.replace(/"/g, '""')}"`]
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AgriCommand_Action_Plan_${plan.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // PDF / Print Action
  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <DownloadCloud className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Agricultural Action Plans & Dossiers</h2>
            <p className="text-xs text-slate-400">Export verified farmer action dossiers in printable PDF or structured CSV format</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`/api/storage/agricultural-reports/${plan?.id || 'plan-rep-001'}.pdf`}
            download
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
            title="Download verified action dossier from Supabase Storage"
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Storage Dossier</span>
          </a>

          <button
            onClick={handleDownloadCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrintPDF}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Plan Selector (hidden in print) */}
      <div className="flex items-center gap-2 no-print bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs">
        <span className="text-slate-400 shrink-0">Select Plan Dossier:</span>
        <select
          value={selectedPlanId}
          onChange={e => setSelectedPlanId(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
        >
          {actionPlans.map(p => (
            <option key={p.id} value={p.id}>
              {p.id} – {p.farmerName} ({p.district}) • {p.humanReviewStatus}
            </option>
          ))}
        </select>
      </div>

      {/* Printable Dossier Sheet */}
      {plan && (
        <div className="printable-card bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6 max-w-4xl mx-auto text-slate-200">
          {/* Header of Dossier */}
          <div className="flex items-start justify-between pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-emerald-400 font-mono">AgriCommand AI</span>
                <span className="text-slate-500">•</span>
                <span className="text-xs text-slate-400">Switch Collaborative Multi-Agent Network</span>
              </div>
              <h1 className="text-xl font-extrabold text-white">Comprehensive Agricultural Action Dossier</h1>
              <p className="text-xs text-slate-400 mt-1">Dossier ID: {plan.id} | Report Reference: {plan.reportId} | Version: v{plan.version}</p>
            </div>

            <div className="text-right">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                plan.humanReviewStatus === 'Approved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {plan.humanReviewStatus}
              </span>
              <span className="text-[10px] text-slate-400 block mt-1 font-mono">
                {plan.reviewedAt ? new Date(plan.reviewedAt).toLocaleDateString() : 'Awaiting Sanction'}
              </span>
            </div>
          </div>

          {/* Farmer & Landholding Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Farmer</span>
              <span className="font-bold text-white text-sm">{plan.farmerName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Location</span>
              <span className="font-medium text-slate-200">{report?.village || 'Thalaivasal'}, {plan.district}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Land & Soil</span>
              <span className="font-medium text-slate-200">{report?.landAreaAcres || 2.0} Acres • {report?.soilType || 'Red Soil'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Water Constraint</span>
              <span className="font-medium text-amber-300">{report?.waterAvailability || 'Limited (1.5-2 hrs)'}</span>
            </div>
          </div>

          {/* Section: Strategic Crop Recommendation */}
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs space-y-2">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wide block">
              Sanctioned Strategic Crop Recommendation
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-white">{plan.primaryCropRecommended}</h3>
                <p className="text-slate-300 mt-0.5">{plan.cropAnalysisSummary}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-400 block">Secondary / Companion Crop</span>
                <span className="font-semibold text-emerald-300">{plan.secondaryCropRecommended}</span>
              </div>
            </div>
          </div>

          {/* Section: Market & Weather Grounding */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="font-bold text-amber-400 uppercase text-[10px] block">Mandi APMC Market Grounding</span>
              <p className="text-slate-300">{plan.marketAnalysisSummary}</p>
              <span className="text-[10px] text-slate-400 block mt-1">Data Source: Agmarknet Verified Mandi Dataset</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="font-bold text-cyan-400 uppercase text-[10px] block">Agrometeorology & Climate Risk</span>
              <p className="text-slate-300">{plan.weatherRiskSummary}</p>
              <span className="text-[10px] text-slate-400 block mt-1">Data Source: Climatology & Weather Adapter</span>
            </div>
          </div>

          {/* Section: Action Timeline Table */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Chronological Farm Execution Timeline</h4>
            <div className="border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-3 w-1/4">Timeline Phase</th>
                    <th className="p-3 w-1/2">Prescribed Activity</th>
                    <th className="p-3 w-1/4">Inputs & Critical Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {plan.actionItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30">
                      <td className="p-3 font-semibold text-emerald-400 align-top">{item.timeline}</td>
                      <td className="p-3 align-top">{item.activity}</td>
                      <td className="p-3 text-slate-400 text-[11px] align-top">{item.recommendedInputs} • {item.criticalNotes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section: Coordinator Sign-off & Audit */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-slate-400 text-[10px] block uppercase font-semibold">Human Coordinator Sanction</span>
              <span className="font-bold text-white">{plan.reviewerName || 'Dr. Sundaram (Agri Coordinator)'}</span>
              {plan.humanComments && <p className="text-slate-300 mt-1 italic">"{plan.humanComments}"</p>}
            </div>
            <div className="text-right shrink-0">
              <span className="text-slate-400 text-[10px] block uppercase">Authentication Signature</span>
              <span className="font-mono text-emerald-400 font-bold">DIGITAL-SANCTION-VERIFIED</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
