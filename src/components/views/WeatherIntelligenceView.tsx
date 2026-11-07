import React from 'react';
import { CloudSun, Droplets, Wind, Thermometer, AlertTriangle, ShieldCheck, MapPin, Calendar, Clock, Sparkles } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, AreaChart, Area } from 'recharts';
import { WEATHER_FORECAST_DATA, RAINFALL_TRENDS } from '../../data/mockData';

export const WeatherIntelligenceView: React.FC = () => {
  const wx = WEATHER_FORECAST_DATA;

  const tempTrendData = [
    { day: 'Day 1 (Today)', tempMax: 33.4, tempMin: 22.0, humidity: 48 },
    { day: 'Day 2', tempMax: 34.0, tempMin: 22.5, humidity: 45 },
    { day: 'Day 3', tempMax: 34.5, tempMin: 23.0, humidity: 42 },
    { day: 'Day 4', tempMax: 33.8, tempMin: 22.8, humidity: 46 },
    { day: 'Day 5', tempMax: 33.0, tempMin: 22.1, humidity: 50 },
    { day: 'Day 6', tempMax: 33.5, tempMin: 22.4, humidity: 48 },
    { day: 'Day 7', tempMax: 34.2, tempMin: 23.2, humidity: 44 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <CloudSun className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Weather & Agrometeorology Center</h2>
            <p className="text-xs text-slate-400">
              Precipitation deficit modeling, soil moisture stress, and climate impact warnings
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>Salem Agro-Climatic Zone (Lat 11.66° N)</span>
          </span>
        </div>
      </div>

      {/* Weather Highlights Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Metric 1: Temp */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Ambient Temperature</span>
            <Thermometer className="w-4 h-4 text-orange-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white">{wx.temperatureC}°C</div>
          <p className="text-[11px] text-orange-400 font-medium mt-1">Daytime high temperature stress</p>
        </div>

        {/* Metric 2: Rainfall Deficit */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Seasonal Rain Anomaly</span>
            <Droplets className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-red-400">{wx.rainfallAnomalyPercent}%</div>
          <p className="text-[11px] text-red-400 font-medium mt-1">Significant deficit vs normal</p>
        </div>

        {/* Metric 3: Soil Moisture */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Topsoil Moisture Index</span>
            <Droplets className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-300">{wx.soilMoistureIndex} / 100</div>
          <p className="text-[11px] text-amber-400 font-medium mt-1">Stressed in Thalaivasal red soil</p>
        </div>

        {/* Metric 4: Drought Risk */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Drought Risk Index</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-400">{wx.droughtRiskScore} / 100</div>
          <p className="text-[11px] text-amber-400 font-medium mt-1">Moderate to High Risk Level</p>
        </div>
      </div>

      {/* Charts: Normal vs Actual Rainfall & 7-Day Temperature Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rainfall Comparison Bar Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Monthly Precipitation Deficit (mm)</h3>
              <p className="text-xs text-slate-400">Normal 30-year average vs actual precipitation in Salem</p>
            </div>
            <span className="text-xs font-semibold text-red-400">-26% Deficit</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={RAINFALL_TRENDS}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="normal" name="Normal Rainfall (mm)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" name="Actual Recorded (mm)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 7-Day Temperature & Thermal Stress */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">7-Day Maximum Temperature Forecast (°C)</h3>
              <p className="text-xs text-slate-400">Daily high temperatures indicating high evapotranspiration</p>
            </div>
            <span className="text-xs font-semibold text-orange-400">Peak 34.5°C</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tempTrendData}>
                <defs>
                  <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[18, 38]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="tempMax" name="Max Temp (°C)" stroke="#f97316" fillOpacity={1} fill="url(#tempGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Weather Impact on Agricultural Decision Making */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Agrometeorological Specialist Advisory for Ravi Kumar (Salem Red Soil)
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          Because cumulative rainfall is <strong>26.4% below normal</strong> and daytime evapotranspiration exceeds <strong>5.2 mm/day</strong>, water-demanding crops like Groundnut (550 mm water requirement) face a severe risk of pod abortion during dry spells. In contrast, <strong>Finger Millet (Ragi)</strong> and <strong>Sesame</strong> have evolved rapid root penetration and cellular osmotic adjustment, thriving on only 300-350 mm of total moisture.
        </p>
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-emerald-400 font-medium">
          Recommended Field Practice: Form ridges and furrows at 30 cm intervals with 5 cm dry straw mulch to reduce evaporation loss by up to 28%.
        </div>
      </div>
    </div>
  );
};
