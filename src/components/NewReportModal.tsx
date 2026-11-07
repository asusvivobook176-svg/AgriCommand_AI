import React, { useState } from 'react';
import { X, Send, AlertTriangle, Sprout, Upload, Sparkles } from 'lucide-react';
import { SoilType, WaterAvailability, ProblemCategory, PriorityLevel, Farmer } from '../types';

interface NewReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => Promise<void>;
  farmers: Farmer[];
  initialFarmerId?: string;
}

export const NewReportModal: React.FC<NewReportModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  farmers,
  initialFarmerId
}) => {
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>(initialFarmerId || 'farmer-ravi-kumar');

  React.useEffect(() => {
    if (initialFarmerId) {
      handleSelectFarmer(initialFarmerId);
    }
  }, [initialFarmerId, isOpen]);
  const [farmerName, setFarmerName] = useState('Ravi Kumar');
  const [village, setVillage] = useState('Thalaivasal');
  const [district, setDistrict] = useState('Salem');
  const [landAreaAcres, setLandAreaAcres] = useState<number>(2.0);
  const [soilType, setSoilType] = useState<SoilType>('Red Soil');
  const [waterAvailability, setWaterAvailability] = useState<WaterAvailability>('Limited');
  const [previousCrop, setPreviousCrop] = useState('Groundnut');
  const [currentSeason, setCurrentSeason] = useState('Navarai / Summer 2026');
  const [preferredCrop, setPreferredCrop] = useState('High-return drought tolerant crop');
  const [category, setCategory] = useState<ProblemCategory>('Crop selection');
  const [priority, setPriority] = useState<PriorityLevel>('High');
  const [problemDescription, setProblemDescription] = useState(
    'Wants to select a suitable crop for the next season while considering water availability and market demand. Water table in borewell has dropped to 1.5 hrs/day yield. Groundnut incurred heavy seed loss previously.'
  );
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSelectFarmer = (id: string) => {
    setSelectedFarmerId(id);
    const found = farmers.find(f => f.id === id);
    if (found) {
      setFarmerName(found.name);
      setVillage(found.village);
      setDistrict(found.district);
      setLandAreaAcres(found.landAreaAcres);
      setSoilType(found.soilType);
      setWaterAvailability(found.waterAvailability);
      setPreviousCrop(found.previousCrop);
      if (found.preferredCrop) setPreferredCrop(found.preferredCrop);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({
        farmerId: selectedFarmerId,
        farmerName,
        village,
        district,
        landAreaAcres,
        soilType,
        waterAvailability,
        previousCrop,
        currentSeason,
        preferredCrop,
        category,
        priority,
        problemDescription,
        imageUrl: imageUrl || undefined
      });
      onClose();
    } catch (err) {
      console.error('Failed to submit report:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Submit Agricultural Problem</h2>
            <p className="text-xs text-slate-400">
              Triggers the 5-Agent Switch Collaboration Workflow across Agri-Triage, CropMind, MarketPulse, and WeatherGuard
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Quick Select Existing Farmer */}
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <label className="block font-semibold text-slate-300 mb-1.5">
              Select Farmer Profile (or edit fields manually)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {farmers.map(f => (
                <button
                  type="button"
                  key={f.id}
                  onClick={() => handleSelectFarmer(f.id)}
                  className={`text-left p-2 rounded-lg border text-[11px] transition ${
                    selectedFarmerId === f.id
                      ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold text-white truncate">{f.name}</div>
                  <div className="text-[10px] text-slate-400">{f.village}, {f.district}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Farmer Full Name *</label>
              <input
                type="text"
                value={farmerName}
                onChange={e => setFarmerName(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Village *</label>
              <input
                type="text"
                value={village}
                onChange={e => setVillage(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">District *</label>
              <input
                type="text"
                value={district}
                onChange={e => setDistrict(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Land Area (Acres) *</label>
              <input
                type="number"
                step="0.1"
                value={landAreaAcres}
                onChange={e => setLandAreaAcres(parseFloat(e.target.value) || 0)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Soil Type *</label>
              <select
                value={soilType}
                onChange={e => setSoilType(e.target.value as SoilType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Red Soil">Red Soil</option>
                <option value="Black Soil">Black Soil</option>
                <option value="Alluvial Soil">Alluvial Soil</option>
                <option value="Clay Loam">Clay Loam</option>
                <option value="Sandy Loam">Sandy Loam</option>
                <option value="Laterite Soil">Laterite Soil</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Water Availability *</label>
              <select
                value={waterAvailability}
                onChange={e => setWaterAvailability(e.target.value as WaterAvailability)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Abundant">Abundant (Perennial canal/well)</option>
                <option value="Moderate">Moderate (6-8 hrs power)</option>
                <option value="Limited">Limited (1-2 hrs intermittent)</option>
                <option value="Severely Stressed">Severely Stressed (Rainfed only)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Previous Crop</label>
              <input
                type="text"
                value={previousCrop}
                onChange={e => setPreviousCrop(e.target.value)}
                placeholder="e.g., Groundnut, Maize"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Current Season</label>
              <input
                type="text"
                value={currentSeason}
                onChange={e => setCurrentSeason(e.target.value)}
                placeholder="e.g., Summer / Navarai 2026"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Preferred Crop (Optional)</label>
              <input
                type="text"
                value={preferredCrop}
                onChange={e => setPreferredCrop(e.target.value)}
                placeholder="e.g., Millets, Pulses"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Problem Category *</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as ProblemCategory)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Crop selection">Crop selection</option>
                <option value="Soil problems">Soil problems</option>
                <option value="Water availability">Water availability</option>
                <option value="Weather risks">Weather risks</option>
                <option value="Market demand">Market demand</option>
                <option value="Price fluctuations">Price fluctuations</option>
                <option value="Pest and disease reports">Pest and disease reports</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Urgency Priority *</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as PriorityLevel)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="High">High (Immediate Planting Window / Loss Risk)</option>
                <option value="Medium">Medium (Upcoming Season Planning)</option>
                <option value="Low">Low (General Advisory)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Detailed Problem Description *</label>
            <textarea
              rows={3}
              value={problemDescription}
              onChange={e => setProblemDescription(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
              placeholder="Describe soil moisture conditions, irrigation schedule, prior crop challenges, and farmer goals..."
            />
          </div>

          {/* Optional Soil / Field Photo */}
          <div>
            <label className="block text-slate-400 mb-1">Field / Soil Image URL (Optional)</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                placeholder="https://example.com/soil-sample.jpg"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={() => setImageUrl('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80')}
                className="px-2.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 shrink-0"
                title="Use sample farmland image"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Sample Image</span>
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Creates Switch room & dispatches Triage, Crop, Market & Weather agents</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-2 transition shadow-md shadow-emerald-950/40 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Starting Switch Workflow...' : 'Submit & Start Collaboration'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
