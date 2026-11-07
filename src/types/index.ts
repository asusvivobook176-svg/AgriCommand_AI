export type SoilType = 'Red Soil' | 'Black Soil' | 'Alluvial Soil' | 'Clay Loam' | 'Sandy Loam' | 'Laterite Soil';

export type WaterAvailability = 'Abundant' | 'Moderate' | 'Limited' | 'Severely Stressed';

export type ProblemCategory = 
  | 'Crop selection'
  | 'Soil problems'
  | 'Water availability'
  | 'Weather risks'
  | 'Market demand'
  | 'Price fluctuations'
  | 'Pest and disease reports';

export type PriorityLevel = 'High' | 'Medium' | 'Low';

export type AgentStatusType = 'Online' | 'Working' | 'Waiting' | 'Completed' | 'Error';

export interface Farmer {
  id: string;
  name: string;
  phone: string;
  village: string;
  district: string;
  state: string;
  landAreaAcres: number;
  soilType: SoilType;
  waterAvailability: WaterAvailability;
  irrigationSource: string;
  previousCrop: string;
  currentSeason: string;
  preferredCrop?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface FarmerReport {
  id: string;
  farmerId: string;
  farmerName: string;
  village: string;
  district: string;
  landAreaAcres: number;
  soilType: SoilType;
  waterAvailability: WaterAvailability;
  previousCrop: string;
  currentSeason: string;
  preferredCrop?: string;
  category: ProblemCategory;
  problemDescription: string;
  priority: PriorityLevel;
  imageUrl?: string;
  status: 'Submitted' | 'Triage In Progress' | 'Specialists Analyzing' | 'Pending Human Approval' | 'Approved' | 'Revision Requested' | 'Rejected';
  assignedAgents: string[];
  roomId: string;
  submittedAt: string;
  updatedAt: string;
  actionPlanId?: string;
}

export interface SwitchAgent {
  id: string;
  name: string;
  role: string;
  status: AgentStatusType;
  avatarColor: string;
  currentTask?: string;
  description: string;
  capabilities: string[];
  lastHeartbeat: string;
  model: string;
  isMLPowered?: boolean;
}

export interface SwitchRoomMessage {
  id: string;
  roomId: string;
  senderType: 'human' | 'agent' | 'system' | 'farmer';
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  role?: string;
  content: string;
  structuredData?: any;
  messageType: 'chat' | 'triage_card' | 'crop_recommendation_card' | 'market_card' | 'weather_card' | 'action_plan_draft' | 'approval_card' | 'system_log';
  timestamp: string;
  metadata?: {
    confidenceScore?: number;
    agentPhase?: string;
    targetAgents?: string[];
    taskStatus?: 'pending' | 'in_progress' | 'completed' | 'failed';
  };
}

export interface SwitchCollaborationRoom {
  id: string;
  reportId: string;
  title: string;
  topic: string;
  createdAt: string;
  status: 'active' | 'archived' | 'pending_approval' | 'resolved';
  members: {
    id: string;
    name: string;
    type: 'agent' | 'human';
    role: string;
    status: AgentStatusType;
  }[];
  messages: SwitchRoomMessage[];
  switchServerMode: 'sandbox' | 'switch_live_gateway';
}

export interface CropSuitability {
  cropName: string;
  scientificName: string;
  suitabilityScore: number; // 0 - 100
  waterRequirement: 'Very Low' | 'Low' | 'Medium' | 'High';
  waterResilienceIndex: number; // 1-10
  expectedDurationDays: string;
  estimatedYieldPerAcre: string;
  averageMarketPricePerQtl: number;
  expectedProfitPerAcre: string;
  soilSuitability: 'Excellent' | 'Good' | 'Moderate' | 'Poor';
  riskFactor: 'Low' | 'Moderate' | 'High';
  keyAdvantages: string[];
  keyChallenges: string[];
  recommendationReason: string;
}

export interface MarketPriceRecord {
  id: string;
  cropName: string;
  marketName: string;
  district: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  unit: string;
  arrivalQuantityQuintals: number;
  priceTrend: 'Bullish' | 'Stable' | 'Bearish';
  date: string;
  dataSource: 'Agmarknet Live API' | 'Agmarknet Verified Sample';
  isSimulated: boolean;
}

export interface WeatherRecord {
  id: string;
  district: string;
  temperatureC: number;
  humidityPercent: number;
  rainfallMm: number;
  windSpeedKmh: number;
  forecastSummary: string;
  soilMoistureIndex: number; // 0 - 100
  droughtRiskScore: number; // 0 - 100
  rainfallAnomalyPercent: number; // e.g., -28%
  timestamp: string;
  dataSource: 'IMD / OpenWeather API' | 'Demonstration Climatology Data';
  isSimulated: boolean;
}

export interface ActionPlan {
  id: string;
  reportId: string;
  farmerName: string;
  district: string;
  createdAt: string;
  version: number;
  triageSummary: string;
  primaryCropRecommended: string;
  secondaryCropRecommended: string;
  cropAnalysisSummary: string;
  marketAnalysisSummary: string;
  weatherRiskSummary: string;
  actionItems: {
    timeline: string;
    activity: string;
    recommendedInputs: string;
    criticalNotes: string;
  }[];
  limitationsAndAssumptions: string[];
  missingInformationIdentified: string[];
  humanReviewStatus: 'Pending' | 'Approved' | 'Revision Requested' | 'Rejected';
  reviewerName?: string;
  reviewedAt?: string;
  humanComments?: string;
}
