import React, { useState } from 'react';
import { Sprout, CheckCircle2, AlertTriangle, Droplets, Mountain, Clock, DollarSign, Award, ArrowRight } from 'lucide-react';
import { CROP_SUITABILITY_CATALOG } from '../../data/mockData';
import { CropSuitability } from '../../types';

export const CropIntelligenceView: React.FC = () => {
  const [selectedSoilFilter, setSelectedSoilFilter] = useState<string>('Red Soil');
  const [selectedCrop, setSelectedCrop] = useState<CropSuitability>(CROP_SUITABILITY_CATALOG[0]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Crop Intelligence Center</h2>
            <p className="text-xs text-slate-400">
              Agronomic suitability scoring, soil moisture requirements, and crop comparison
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Soil Benchmark:</span>
          <select
            value={selectedSoilFilter}
            onChange={e => setSelectedSoilFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
          >
            <option value="Red Soil">Salem Red Soil (Thalaivasal)</option>
            <option value="Black Soil">Black Cotton Soil (Attur)</option>
            <option value="Clay Loam">Clay Loam (Omalur)</option>
          </select>
        </div>
      </div>

      {/* Featured Top Recommendation Alert */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-300">Top Crop for Salem Red Soil (Navarai / Summer 2026)</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-slate-950">92% Match</span>
            </div>
            <h3 className="text-sm font-bold text-white mt-0.5">Finger Millet (Ragi - Var. Paiyur 2 / GPU 28)</h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Reduces water demand by 45% vs Groundnut while maintaining ₹34,000 - ₹42,000 net profit per acre.
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-400 shrink-0">
          <span className="block text-slate-400 font-medium">RandomForest ML Model</span>
          <span className="text-emerald-400 font-semibold">Trained on Tamil Nadu TNAU Agronomy Dataset</span>
        </div>
      </div>

      {/* Recommended Crop Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {CROP_SUITABILITY_CATALOG.map((crop) => {
          const isSelected = selectedCrop.cropName === crop.cropName;
          return (
            <div
              key={crop.cropName}
              onClick={() => setSelectedCrop(crop)}
              className={`p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 border-emerald-500 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    crop.suitabilityScore >= 90 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    crop.suitabilityScore >= 75 ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                    'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}>
                    {crop.suitabilityScore}% Score
                  </span>
                  <span className={`text-[10px] font-semibold ${
                    crop.riskFactor === 'Low' ? 'text-emerald-400' :
                    crop.riskFactor === 'Moderate' ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {crop.riskFactor} Risk
                  </span>
                </div>

                <h3 className="font-bold text-xs text-white truncate">{crop.cropName}</h3>
                <p className="text-[10px] italic text-slate-400 truncate">{crop.scientificName}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 space-y-1 text-[11px]">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Water:</span>
                  <span className="text-slate-200 font-medium">{crop.waterRequirement}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Mandi:</span>
                  <span className="text-emerald-400 font-semibold">₹{crop.averageMarketPricePerQtl}/qtl</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Crop Deep Analysis */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">{selectedCrop.cropName}</h3>
              <span className="text-xs italic text-slate-400">({selectedCrop.scientificName})</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                {selectedCrop.suitabilityScore}% Suitability
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">{selectedCrop.recommendationReason}</p>
          </div>

          <div className="flex items-center gap-4 text-xs shrink-0">
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Expected Yield</span>
              <span className="font-bold text-white">{selectedCrop.estimatedYieldPerAcre}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Net Profit / Acre</span>
              <span className="font-bold text-emerald-400">{selectedCrop.expectedProfitPerAcre}</span>
            </div>
          </div>
        </div>

        {/* 4 Cards: Water, Duration, Soil, Market */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-2 text-cyan-400 mb-1">
              <Droplets className="w-4 h-4" />
              <span className="font-semibold text-slate-200">Water Consumption</span>
            </div>
            <span className="text-sm font-bold text-white">{selectedCrop.waterRequirement}</span>
            <p className="text-[10px] text-slate-400 mt-1">Resilience Index: {selectedCrop.waterResilienceIndex}/10</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-2 text-amber-400 mb-1">
              <Clock className="w-4 h-4" />
              <span className="font-semibold text-slate-200">Growing Duration</span>
            </div>
            <span className="text-sm font-bold text-white">{selectedCrop.expectedDurationDays}</span>
            <p className="text-[10px] text-slate-400 mt-1">Fits seasonal harvest window</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <Mountain className="w-4 h-4" />
              <span className="font-semibold text-slate-200">Soil Compatibility</span>
            </div>
            <span className="text-sm font-bold text-white">{selectedCrop.soilSuitability}</span>
            <p className="text-[10px] text-slate-400 mt-1">Red Soil Drainage Matched</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-2 text-indigo-400 mb-1">
              <DollarSign className="w-4 h-4" />
              <span className="font-semibold text-slate-200">Mandi Modal Price</span>
            </div>
            <span className="text-sm font-bold text-emerald-400">₹{selectedCrop.averageMarketPricePerQtl} / qtl</span>
            <p className="text-[10px] text-slate-400 mt-1">Salem APMC Regulated Yard</p>
          </div>
        </div>

        {/* Advantages & Challenges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <h4 className="font-bold text-emerald-400 mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Key Agronomic Advantages</span>
            </h4>
            <ul className="space-y-1.5 text-slate-300">
              {selectedCrop.keyAdvantages.map((adv, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{adv}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <h4 className="font-bold text-amber-400 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Cultivation Challenges & Mitigation</span>
            </h4>
            <ul className="space-y-1.5 text-slate-300">
              {selectedCrop.keyChallenges.map((chal, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{chal}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg overflow-x-auto">
        <h3 className="text-sm font-bold text-white mb-3">Multi-Crop Agronomic & Financial Comparison</h3>
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
            <tr>
              <th className="p-3">Crop Name</th>
              <th className="p-3">Suitability</th>
              <th className="p-3">Water Need</th>
              <th className="p-3">Duration</th>
              <th className="p-3">Yield / Acre</th>
              <th className="p-3">Mandi Price</th>
              <th className="p-3">Est. Profit / Acre</th>
              <th className="p-3">Risk Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {CROP_SUITABILITY_CATALOG.map((c) => (
              <tr key={c.cropName} className="hover:bg-slate-800/40">
                <td className="p-3 font-semibold text-white">{c.cropName}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    c.suitabilityScore >= 90 ? 'bg-emerald-500/20 text-emerald-300' :
                    c.suitabilityScore >= 75 ? 'bg-blue-500/20 text-blue-300' : 'bg-red-500/20 text-red-300'
                  }`}>
                    {c.suitabilityScore}%
                  </span>
                </td>
                <td className="p-3">{c.waterRequirement}</td>
                <td className="p-3">{c.expectedDurationDays}</td>
                <td className="p-3">{c.estimatedYieldPerAcre}</td>
                <td className="p-3 font-mono text-emerald-400">₹{c.averageMarketPricePerQtl}</td>
                <td className="p-3 font-semibold text-white">{c.expectedProfitPerAcre}</td>
                <td className="p-3">
                  <span className={c.riskFactor === 'Low' ? 'text-emerald-400' : c.riskFactor === 'Moderate' ? 'text-amber-400' : 'text-red-400'}>
                    {c.riskFactor}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
