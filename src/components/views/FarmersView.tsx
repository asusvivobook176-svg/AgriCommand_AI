import React, { useState } from 'react';
import { Users, Search, Plus, MapPin, Droplets, Mountain, ArrowUpRight, CheckCircle2, Phone, Calendar } from 'lucide-react';
import { Farmer } from '../../types';

interface FarmersViewProps {
  farmers: Farmer[];
  onSelectFarmerForReport: (farmerId: string) => void;
  onAddFarmer: (farmerData: any) => Promise<void>;
}

export const FarmersView: React.FC<FarmersViewProps> = ({
  farmers,
  onSelectFarmerForReport,
  onAddFarmer
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSoil, setSelectedSoil] = useState<string>('all');
  const [isAddingFarmer, setIsAddingFarmer] = useState(false);

  // New farmer form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('Salem');
  const [landAreaAcres, setLandAreaAcres] = useState<number>(2.5);
  const [soilType, setSoilType] = useState('Red Soil');
  const [waterAvailability, setWaterAvailability] = useState('Limited');
  const [irrigationSource, setIrrigationSource] = useState('Borewell (intermittent)');
  const [previousCrop, setPreviousCrop] = useState('Groundnut');
  const [currentSeason, setCurrentSeason] = useState('Summer 2026');

  const filteredFarmers = farmers.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.district.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSoil = selectedSoil === 'all' || f.soilType === selectedSoil;
    return matchesSearch && matchesSoil;
  });

  const handleCreateFarmer = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddFarmer({
      name,
      phone,
      village,
      district,
      state: 'Tamil Nadu',
      landAreaAcres,
      soilType,
      waterAvailability,
      irrigationSource,
      previousCrop,
      currentSeason
    });
    setIsAddingFarmer(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Registered Farmers Directory</h2>
            <p className="text-xs text-slate-400">Manage agricultural beneficiaries, soil surveys, and irrigation profiles</p>
          </div>
        </div>

        <button
          onClick={() => setIsAddingFarmer(true)}
          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-emerald-950/40 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Farmer</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by farmer name, village, or district..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 shrink-0">Soil Filter:</span>
          <select
            value={selectedSoil}
            onChange={e => setSelectedSoil(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Soils</option>
            <option value="Red Soil">Red Soil</option>
            <option value="Black Soil">Black Soil</option>
            <option value="Clay Loam">Clay Loam</option>
            <option value="Alluvial Soil">Alluvial Soil</option>
          </select>
        </div>
      </div>

      {/* Farmers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {filteredFarmers.map((farmer) => (
          <div 
            key={farmer.id}
            className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 shadow-lg transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {farmer.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">{farmer.name}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      {farmer.village}, {farmer.district}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {farmer.landAreaAcres} Acres
                </span>
              </div>

              {/* Badges Grid */}
              <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Soil Type</span>
                  <div className="font-medium text-slate-200 flex items-center gap-1.5 mt-0.5">
                    <Mountain className="w-3.5 h-3.5 text-amber-400" />
                    <span>{farmer.soilType}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Water Status</span>
                  <div className="font-medium text-amber-300 flex items-center gap-1.5 mt-0.5">
                    <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{farmer.waterAvailability}</span>
                  </div>
                </div>
              </div>

              {/* Details list */}
              <div className="mt-3 space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Irrigation Asset:</span>
                  <span className="text-slate-200 text-right truncate max-w-[180px]">{farmer.irrigationSource}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Previous Harvest:</span>
                  <span className="text-slate-200">{farmer.previousCrop}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Phone:</span>
                  <span className="text-slate-400 font-mono">{farmer.phone}</span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">ID: {farmer.id}</span>
              <button
                onClick={() => onSelectFarmerForReport(farmer.id)}
                className="px-3 py-1.5 rounded-lg bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <span>Submit Problem</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Farmer Modal */}
      {isAddingFarmer && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">Register New Farmer</h3>
            <form onSubmit={handleCreateFarmer} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g., Senthil Nathan"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Phone *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Village *</label>
                  <input
                    type="text"
                    required
                    value={village}
                    onChange={e => setVillage(e.target.value)}
                    placeholder="e.g., Valapadi"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">District *</label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Land (Acres) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={landAreaAcres}
                    onChange={e => setLandAreaAcres(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Soil Type</label>
                  <select
                    value={soilType}
                    onChange={e => setSoilType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  >
                    <option value="Red Soil">Red Soil</option>
                    <option value="Black Soil">Black Soil</option>
                    <option value="Clay Loam">Clay Loam</option>
                    <option value="Alluvial Soil">Alluvial Soil</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Water Status</label>
                  <select
                    value={waterAvailability}
                    onChange={e => setWaterAvailability(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  >
                    <option value="Limited">Limited</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Abundant">Abundant</option>
                    <option value="Severely Stressed">Stressed</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddingFarmer(false)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                >
                  Save Farmer Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
