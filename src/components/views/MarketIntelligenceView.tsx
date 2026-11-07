import React, { useState } from 'react';
import { TrendingUp, BarChart2, Filter, Info, ShieldCheck, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Legend } from 'recharts';
import { MARKET_DATA_RECORDS, HISTORICAL_PRICE_TRENDS } from '../../data/mockData';
import { MarketPriceRecord } from '../../types';

export const MarketIntelligenceView: React.FC = () => {
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>('all');
  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState<string>('all');

  const filteredRecords = MARKET_DATA_RECORDS.filter(r => {
    const matchesCrop = selectedCropFilter === 'all' || r.cropName.includes(selectedCropFilter);
    const matchesDistrict = selectedDistrictFilter === 'all' || r.district === selectedDistrictFilter;
    return matchesCrop && matchesDistrict;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Market Intelligence & APMC Mandis</h2>
            <p className="text-xs text-slate-400">
              Wholesale modal prices, arrivals volume, and volatility analytics from Agmarknet
            </p>
          </div>
        </div>

        {/* Live vs Verified Sample Data Badge */}
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span>Agmarknet Verified Sample Dataset</span>
          </span>
        </div>
      </div>

      {/* Mandi Filters */}
      <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Filter Crop:</span>
          <select
            value={selectedCropFilter}
            onChange={e => setSelectedCropFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
          >
            <option value="all">All Crops</option>
            <option value="Ragi">Finger Millet (Ragi)</option>
            <option value="Sesame">Sesame (Gingelly)</option>
            <option value="Groundnut">Groundnut</option>
            <option value="Black Gram">Black Gram</option>
            <option value="Maize">Maize</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">APMC District:</span>
          <select
            value={selectedDistrictFilter}
            onChange={e => setSelectedDistrictFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
          >
            <option value="all">All Districts</option>
            <option value="Salem">Salem APMCs</option>
            <option value="Namakkal">Namakkal Mandi</option>
          </select>
        </div>

        <div className="text-[11px] text-slate-400">
          Last Updated: <strong className="text-slate-200">2026-11-04 (Today's Mandi Session)</strong>
        </div>
      </div>

      {/* Charts Section: 6-Month Mandi Price Trend & Demand Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Trend Line Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">6-Month Mandi Price Trends (₹ / Quintal)</h3>
              <p className="text-xs text-slate-400">Historical wholesale modal price movement in Salem cluster</p>
            </div>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Ragi +14.9%</span>
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={HISTORICAL_PRICE_TRENDS}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="ragi" name="Finger Millet (Ragi)" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="groundnut" name="Groundnut" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="blackGram" name="Black Gram" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* High-Value Sesame & Oilseed Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">High-Value Sesame Price Trajectory (₹ / Quintal)</h3>
              <p className="text-xs text-slate-400">Strong premium driven by Tamil Nadu cold-press oil mills</p>
            </div>
            <span className="text-xs font-semibold text-amber-400">₹12,400 Modal</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={HISTORICAL_PRICE_TRENDS}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[8000, 14000]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
                />
                <Bar dataKey="sesame" name="Sesame (Gingelly)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* APMC Mandi Records Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Today's Verified Mandi Yard Quotations</h3>
            <p className="text-xs text-slate-400">Regulated markets in Salem, Attur, and neighboring clusters</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">Records: {filteredRecords.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Commodity</th>
                <th className="p-3">Market Yard</th>
                <th className="p-3">District</th>
                <th className="p-3">Min Price</th>
                <th className="p-3">Max Price</th>
                <th className="p-3">Modal Price</th>
                <th className="p-3">Arrivals (Qtl)</th>
                <th className="p-3">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRecords.map((m) => (
                <tr key={m.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-semibold text-white">{m.cropName}</td>
                  <td className="p-3">{m.marketName}</td>
                  <td className="p-3">{m.district}</td>
                  <td className="p-3 font-mono">₹{m.minPrice}</td>
                  <td className="p-3 font-mono">₹{m.maxPrice}</td>
                  <td className="p-3 font-mono font-bold text-emerald-400">₹{m.modalPrice}</td>
                  <td className="p-3 font-mono">{m.arrivalQuantityQuintals} qtl</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      m.priceTrend === 'Bullish' ? 'bg-emerald-500/20 text-emerald-300' :
                      m.priceTrend === 'Stable' ? 'bg-blue-500/20 text-blue-300' : 'bg-red-500/20 text-red-300'
                    }`}>
                      {m.priceTrend}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
