import { Farmer, FarmerReport, SwitchAgent, MarketPriceRecord, WeatherRecord, ActionPlan, CropSuitability, SwitchCollaborationRoom } from '../types';

export const INITIAL_AGENTS: SwitchAgent[] = [
  {
    id: 'agent-triage',
    name: 'Agri-Triage',
    role: 'Triage & Orchestration Agent',
    status: 'Online',
    avatarColor: 'bg-emerald-600',
    description: 'Receives farmer reports, parses problem categories, determines priority, and delegates tasks to specialized agents across Switch rooms.',
    capabilities: ['Problem Classification', 'Priority Scoring', 'Switch Room Orchestration', 'Task Delegation'],
    lastHeartbeat: new Date().toISOString(),
    model: 'gemini-3.8-flash'
  },
  {
    id: 'agent-cropmind',
    name: 'CropMind',
    role: 'Crop Intelligence Specialist',
    status: 'Online',
    avatarColor: 'bg-green-700',
    description: 'Evaluates soil chemical suitability, water constraints, seasonal agronomy, and computes ML crop suitability scores.',
    capabilities: ['Soil Chemistry Analysis', 'ML Suitability Scoring', 'Crop Water Balance', 'Varietal Recommendation'],
    lastHeartbeat: new Date().toISOString(),
    model: 'gemini-3.8-flash',
    isMLPowered: true
  },
  {
    id: 'agent-marketpulse',
    name: 'MarketPulse',
    role: 'Market Intelligence Specialist',
    status: 'Online',
    avatarColor: 'bg-amber-600',
    description: 'Tracks Agmarknet mandi arrivals, wholesale modal price trends, seasonal demand surges, and price volatility risks.',
    capabilities: ['APMC Price Forecasting', 'Demand-Supply Barometer', 'Market Arrival Analysis', 'Volatility Risk Scoring'],
    lastHeartbeat: new Date().toISOString(),
    model: 'gemini-3.8-flash'
  },
  {
    id: 'agent-weatherguard',
    name: 'WeatherGuard',
    role: 'Weather & Agrometeorology Specialist',
    status: 'Online',
    avatarColor: 'bg-cyan-600',
    description: 'Assesses rainfall deficit, dry spell duration, soil moisture evaporation, and climate risks for rainfed/semi-arid farming.',
    capabilities: ['Rainfall Anomaly Tracking', 'Drought Index Modeling', 'Dry Spell Forecast', 'Irrigation Scheduling Warnings'],
    lastHeartbeat: new Date().toISOString(),
    model: 'gemini-3.8-flash'
  },
  {
    id: 'agent-agrireport',
    name: 'AgriReport',
    role: 'Synthesis & Action Plan Agent',
    status: 'Online',
    avatarColor: 'bg-indigo-600',
    description: 'Synthesizes specialist findings, checks for trade-offs/conflicts, drafts actionable agricultural plans, and prepares human review packages.',
    capabilities: ['Multi-Agent Synthesis', 'Conflict Resolution', 'Action Plan Structuring', 'Human Approval Packet Generation'],
    lastHeartbeat: new Date().toISOString(),
    model: 'gemini-3.8-flash'
  }
];

export const INITIAL_FARMERS: Farmer[] = [
  {
    id: 'farmer-ravi-kumar',
    name: 'Ravi Kumar',
    phone: '+91 98421 87654',
    village: 'Thalaivasal',
    district: 'Salem',
    state: 'Tamil Nadu',
    landAreaAcres: 2.0,
    soilType: 'Red Soil',
    waterAvailability: 'Limited',
    irrigationSource: 'Borewell (intermittent yield, 1.5 inch delivery)',
    previousCrop: 'Groundnut (TMV-7)',
    currentSeason: 'Navarai / Summer 2026',
    preferredCrop: 'Open to high-return drought-tolerant crops',
    createdAt: '2026-10-15T09:30:00Z'
  },
  {
    id: 'farmer-priya-selvan',
    name: 'Priya Selvan',
    phone: '+91 94432 11982',
    village: 'Omalur',
    district: 'Salem',
    state: 'Tamil Nadu',
    landAreaAcres: 3.5,
    soilType: 'Clay Loam',
    waterAvailability: 'Moderate',
    irrigationSource: 'Open well with drip irrigation',
    previousCrop: 'Maize',
    currentSeason: 'Rabi / Late Winter',
    preferredCrop: 'Vegetables / Pulses',
    createdAt: '2026-10-18T14:15:00Z'
  },
  {
    id: 'farmer-ramesh-patel',
    name: 'Ramesh Patel',
    phone: '+91 97230 45890',
    village: 'Attur',
    district: 'Salem',
    state: 'Tamil Nadu',
    landAreaAcres: 5.0,
    soilType: 'Black Soil',
    waterAvailability: 'Limited',
    irrigationSource: 'Farm pond & dryland rainfed',
    previousCrop: 'Cotton',
    currentSeason: 'Summer 2026',
    preferredCrop: 'Sorghum / Millets',
    createdAt: '2026-10-22T11:00:00Z'
  },
  {
    id: 'farmer-ananya-devi',
    name: 'Ananya Devi',
    phone: '+91 98840 92314',
    village: 'Mecheri',
    district: 'Salem',
    state: 'Tamil Nadu',
    landAreaAcres: 1.8,
    soilType: 'Red Soil',
    waterAvailability: 'Severely Stressed',
    irrigationSource: 'Rainfed seasonal recharge',
    previousCrop: 'Finger Millet (Ragi)',
    currentSeason: 'Summer 2026',
    preferredCrop: 'Sesame or Pulses',
    createdAt: '2026-10-28T08:45:00Z'
  }
];

export const INITIAL_REPORTS: FarmerReport[] = [
  {
    id: 'REP-2026-SLM-001',
    farmerId: 'farmer-ravi-kumar',
    farmerName: 'Ravi Kumar',
    village: 'Thalaivasal',
    district: 'Salem',
    landAreaAcres: 2.0,
    soilType: 'Red Soil',
    waterAvailability: 'Limited',
    previousCrop: 'Groundnut',
    currentSeason: 'Navarai / Summer 2026',
    preferredCrop: 'Open to recommendations (considering water vs profit)',
    category: 'Crop selection',
    problemDescription: 'Wants to select a suitable crop for the next season while considering water availability and market demand. Water table in the Thalaivasal borewell has dropped. Red soil retains low moisture during dry spell. Groundnut incurred high seed cost previously. Needs high-yield low-water crop with stable mandi prices.',
    priority: 'High',
    status: 'Pending Human Approval',
    assignedAgents: ['Agri-Triage', 'CropMind', 'MarketPulse', 'WeatherGuard', 'AgriReport'],
    roomId: 'room-rep-001-salem',
    submittedAt: '2026-11-04T10:00:00Z',
    updatedAt: '2026-11-04T10:05:30Z',
    actionPlanId: 'plan-rep-001'
  },
  {
    id: 'REP-2026-SLM-002',
    farmerId: 'farmer-priya-selvan',
    farmerName: 'Priya Selvan',
    village: 'Omalur',
    district: 'Salem',
    landAreaAcres: 3.5,
    soilType: 'Clay Loam',
    waterAvailability: 'Moderate',
    previousCrop: 'Maize',
    currentSeason: 'Summer 2026',
    preferredCrop: 'Black Gram / Green Gram',
    category: 'Soil problems',
    problemDescription: 'Post-maize soil compaction and moderate salt accumulation noticed near furrow ends. Seeking crop rotation strategy that restores soil nitrogen while yielding marketable pulses.',
    priority: 'Medium',
    status: 'Specialists Analyzing',
    assignedAgents: ['Agri-Triage', 'CropMind', 'MarketPulse'],
    roomId: 'room-rep-002-salem',
    submittedAt: '2026-11-04T14:20:00Z',
    updatedAt: '2026-11-04T14:22:15Z'
  },
  {
    id: 'REP-2026-SLM-003',
    farmerId: 'farmer-ramesh-patel',
    farmerName: 'Ramesh Patel',
    village: 'Attur',
    district: 'Salem',
    landAreaAcres: 5.0,
    soilType: 'Black Soil',
    waterAvailability: 'Limited',
    previousCrop: 'Cotton',
    currentSeason: 'Summer 2026',
    preferredCrop: 'Sorghum',
    category: 'Market demand',
    problemDescription: 'Cotton harvest had lower yield due to bollworm and high pesticide costs. Looking to shift to fodder sorghum or grain sorghum, but concerned about Salem vs Attur mandi prices.',
    priority: 'Medium',
    status: 'Submitted',
    assignedAgents: ['Agri-Triage'],
    roomId: 'room-rep-003-salem',
    submittedAt: '2026-11-04T18:10:00Z',
    updatedAt: '2026-11-04T18:10:00Z'
  }
];

export const INITIAL_ROOMS: SwitchCollaborationRoom[] = [
  {
    id: 'room-rep-001-salem',
    reportId: 'REP-2026-SLM-001',
    title: 'Ravi Kumar – Crop Selection & Water Optimization [Salem]',
    topic: 'Cross-specialist evaluation of Finger Millet (Ragi) vs Sesame vs Groundnut under limited irrigation in Thalaivasal red soil.',
    createdAt: '2026-11-04T10:00:05Z',
    status: 'pending_approval',
    switchServerMode: 'sandbox',
    members: [
      { id: 'human-coord', name: 'Dr. Sundaram (Agri Coordinator)', type: 'human', role: 'Chief Agricultural Coordinator', status: 'Online' },
      { id: 'agent-triage', name: 'Agri-Triage', type: 'agent', role: 'Triage Specialist', status: 'Completed' },
      { id: 'agent-cropmind', name: 'CropMind', type: 'agent', role: 'Agronomist & ML Model', status: 'Completed' },
      { id: 'agent-marketpulse', name: 'MarketPulse', type: 'agent', role: 'Market Analyst', status: 'Completed' },
      { id: 'agent-weatherguard', name: 'WeatherGuard', type: 'agent', role: 'Meteorologist', status: 'Completed' },
      { id: 'agent-agrireport', name: 'AgriReport', type: 'agent', role: 'Synthesis & Reporting', status: 'Completed' }
    ],
    messages: [
      {
        id: 'msg-001',
        roomId: 'room-rep-001-salem',
        senderType: 'farmer',
        senderId: 'farmer-ravi-kumar',
        senderName: 'Ravi Kumar (Farmer)',
        messageType: 'chat',
        content: 'Vanakkam. I have 2 acres of red soil in Thalaivasal, Salem. Water in my borewell is very limited (runs only 1.5 to 2 hours per day). Last season I cultivated groundnut but seed cost was high and water ran out at pod development. Please advise which crop will give good profit with minimal water for the coming season.',
        timestamp: '2026-11-04T10:00:10Z'
      },
      {
        id: 'msg-002',
        roomId: 'room-rep-001-salem',
        senderType: 'agent',
        senderId: 'agent-triage',
        senderName: 'Agri-Triage',
        role: 'Triage & Orchestration',
        messageType: 'triage_card',
        content: 'Report REP-2026-SLM-001 successfully ingested and classified. Problem category identified as [Crop selection] with secondary constraints in [Water availability] and [Market demand]. Priority set to HIGH due to immediate planting window.',
        structuredData: {
          category: 'Crop selection',
          priority: 'High',
          constraints: ['Limited borewell water (1.5-2 hrs/day)', 'Red soil moisture deficit', 'High previous groundnut input cost'],
          assignedSpecialists: ['CropMind (Agronomy)', 'MarketPulse (APMC Mandi)', 'WeatherGuard (Agrometeorology)'],
          dispatchPlan: 'Initiating parallel specialist analysis in Switch room #room-rep-001-salem.'
        },
        timestamp: '2026-11-04T10:00:25Z'
      },
      {
        id: 'msg-003',
        roomId: 'room-rep-001-salem',
        senderType: 'agent',
        senderId: 'agent-cropmind',
        senderName: 'CropMind',
        role: 'Crop Intelligence Specialist',
        messageType: 'crop_recommendation_card',
        content: 'Crop suitability evaluation complete based on Salem red soil (pH 6.4, low water retention, moderate potassium). Running Random Forest Crop Suitability Classifier (v2.4). Primary recommendation: Finger Millet (Ragi - GPU 28 / Paiyur 2) with 92% suitability score. Secondary recommendation: Sesame (TMV 7 / VRI 3) with 86% suitability score.',
        structuredData: {
          primaryCrop: 'Finger Millet (Ragi)',
          suitabilityScore: 92,
          waterRequirement: 'Very Low (300-350 mm total)',
          soilCompatibility: 'Excellent in red sandy loam',
          durationDays: '100-110 days',
          secondaryCrop: 'Sesame (Gingelly)',
          secondaryScore: 86,
          caution: 'Groundnut cultivation should be avoided this cycle due to 550+ mm water need during pod maturation.'
        },
        timestamp: '2026-11-04T10:01:05Z'
      },
      {
        id: 'msg-004',
        roomId: 'room-rep-001-salem',
        senderType: 'agent',
        senderId: 'agent-marketpulse',
        senderName: 'MarketPulse',
        role: 'Market Intelligence Specialist',
        messageType: 'market_card',
        content: 'Agmarknet APMC market scan completed for Salem, Attur, and Dharmapuri mandis. Finger Millet (Ragi) wholesale price is currently trading at ₹3,850/quintal (Bullish, +14% YoY driven by government millet procurement and urban bakery demand). Sesame is trading at ₹12,400/quintal with strong oil mill demand. Both show low price volatility risk.',
        structuredData: {
          ragiModalPrice: '₹3,850 / Quintal',
          ragiTrend: 'Bullish (+14% YoY)',
          sesameModalPrice: '₹12,400 / Quintal',
          sesameTrend: 'Stable to Bullish',
          groundnutModalPrice: '₹6,900 / Quintal (High price volatility)',
          bestMandi: 'Salem Regulated Market (7.8 km from Thalaivasal cluster)',
          dataSource: 'Agmarknet Verified Mandi Dataset (Verified Sample Adapter)'
        },
        timestamp: '2026-11-04T10:01:45Z'
      },
      {
        id: 'msg-005',
        roomId: 'room-rep-001-salem',
        senderType: 'agent',
        senderId: 'agent-weatherguard',
        senderName: 'WeatherGuard',
        role: 'Weather & Agrometeorology Specialist',
        messageType: 'weather_card',
        content: 'Agrometeorological analysis for Salem District (Lat 11.66° N, Long 78.14° E). Cumulative rainfall anomaly is -26% below normal. Evapotranspiration is peaking at 5.2 mm/day. High heat stress expected across weeks 4-7 of the cultivation window. A drought-resilient crop like Ragi or Sesame is strongly favored over water-demanding pulses or groundnut.',
        structuredData: {
          rainfallDeficit: '-26% (Moderate Drought Risk)',
          soilMoistureIndex: '34/100 (Stressed)',
          evapotranspiration: '5.2 mm/day',
          heatStressPeriod: 'March - April high temperatures',
          mitigationAdvice: 'Recommend ridge-and-furrow method with dry mulch (straw or leaf litter) to preserve root zone moisture.'
        },
        timestamp: '2026-11-04T10:02:30Z'
      },
      {
        id: 'msg-006',
        roomId: 'room-rep-001-salem',
        senderType: 'agent',
        senderId: 'agent-agrireport',
        senderName: 'AgriReport',
        role: 'Synthesis & Action Plan Agent',
        messageType: 'action_plan_draft',
        content: 'Synthesized findings from CropMind, MarketPulse, and WeatherGuard into draft Agricultural Action Plan #plan-rep-001. All three agents show high convergence: Finger Millet (Ragi) is the optimal primary crop with Sesame as a high-value border/intercrop. Plan submitted to Human Coordinator for final approval.',
        structuredData: {
          planId: 'plan-rep-001',
          consensusLevel: 'High (3/3 Specialists Convergent)',
          keyTradeoff: 'Sesame yields higher per-quintal return but has slight shattering risk during sudden pre-monsoon showers; Ragi provides guaranteed yield resilience and stable mandi price.',
          humanApprovalRequired: true
        },
        timestamp: '2026-11-04T10:03:15Z'
      },
      {
        id: 'msg-007',
        roomId: 'room-rep-001-salem',
        senderType: 'human',
        senderId: 'human-coord',
        senderName: 'Dr. Sundaram (Agri Coordinator)',
        role: 'Chief Agricultural Coordinator',
        messageType: 'chat',
        content: 'Great collaborative synthesis from the agents. I am reviewing the draft in the Human Approval Workspace now. I will add specific advice on using bio-fertilizers (Azospirillum & Phosphobacteria) to maximize root establishment in Thalaivasal red soil.',
        timestamp: '2026-11-04T10:04:00Z'
      }
    ]
  }
];

export const INITIAL_ACTION_PLANS: ActionPlan[] = [
  {
    id: 'plan-rep-001',
    reportId: 'REP-2026-SLM-001',
    farmerName: 'Ravi Kumar',
    district: 'Salem',
    createdAt: '2026-11-04T10:03:15Z',
    version: 1,
    triageSummary: 'Farmer operates 2 acres of red soil in Thalaivasal with borewell discharge constrained to 1.5-2 hrs/day. Previously faced groundnut water starvation at pod filling. Requires low-water, stable-income crop portfolio.',
    primaryCropRecommended: 'Finger Millet (Ragi - Var. Paiyur 2 / GPU 28)',
    secondaryCropRecommended: 'Sesame (Gingelly - Var. TMV 7 / VRI 3) as border crop',
    cropAnalysisSummary: 'Paiyur 2 Ragi demonstrates 92% suitability in Salem red soil with 320 mm total water requirement across 105 days. Superior tolerance to intermittent dry spells compared to groundnut. Low initial seed expenditure (₹450/acre vs ₹4,200/acre for groundnut).',
    marketAnalysisSummary: 'Salem APMC reports consistent wholesale arrivals at ₹3,700 - ₹3,950/quintal with steady demand from millet processing units and government welfare procurement schemes. Zero storage spoilage risk if dried to 12% moisture.',
    weatherRiskSummary: 'Salem currently exhibits a -26% seasonal rainfall anomaly. Ragi can survive up to 14 days of soil moisture stress during vegetative stage without irreversible yield loss.',
    actionItems: [
      {
        timeline: 'Day -7 to Day 0 (Land Prep)',
        activity: 'Deep summer ploughing followed by fine tilth. Apply 5 tons FYM/acre along with 2 kg Azospirillum.',
        recommendedInputs: 'Farmyard Manure, Bio-fertilizer pack',
        criticalNotes: 'Form ridges and furrows at 30 cm interval to conserve irrigation water.'
      },
      {
        timeline: 'Day 1 to 5 (Sowing / Direct Nursery)',
        activity: 'Line sowing or transplanting 18-20 day old seedlings at 30x10 cm spacing. Seed treatment with Trichoderma viride.',
        recommendedInputs: 'Certified Paiyur 2 seed (5 kg/acre), Trichoderma (4g/kg seed)',
        criticalNotes: 'Ensure light soaking irrigation immediately after transplanting.'
      },
      {
        timeline: 'Day 20 to 25 (Weeding & Top Dressing)',
        activity: 'Hand weeding or conoweeder operation followed by top dressing with 20 kg Nitrogen per acre.',
        recommendedInputs: 'Urea / Neem coated urea',
        criticalNotes: 'Irrigate immediately during the 2-hour borewell window.'
      },
      {
        timeline: 'Day 60 to 75 (Flowering & Grain Filling)',
        activity: 'Critical moisture stage. Direct entire borewell discharge to crop during panicle emergence.',
        recommendedInputs: 'Foliar spray of 1% Potassium chloride for drought tolerance',
        criticalNotes: 'Do not allow severe soil cracking during grain milk stage.'
      },
      {
        timeline: 'Day 100 to 110 (Harvesting & Mandi Dispatch)',
        activity: 'Harvest earheads when 90% turn brown. Sun dry on threshing floor to 12% moisture. Package in clean gunny bags.',
        recommendedInputs: 'Gunny bags (50 kg standard)',
        criticalNotes: 'Transport directly to Salem Regulated Market yard for minimum commission.'
      }
    ],
    limitationsAndAssumptions: [
      'Assumes borewell continues to yield at least 1.5 hours of continuous water every 48 hours.',
      'Market price projection is based on prevailing APMC trends and may vary ±8% at harvest time.',
      'Soil test report is based on Thalaivasal cluster benchmark; on-site NPK test is encouraged before chemical fertilization.'
    ],
    missingInformationIdentified: [
      'Exact electrical power supply hours (3-phase agricultural feeder timing in Thalaivasal).',
      'Presence of drip irrigation line or furrow irrigation only.'
    ],
    humanReviewStatus: 'Pending',
    reviewerName: 'Dr. Sundaram (Agri Coordinator)'
  }
];

export const CROP_SUITABILITY_CATALOG: CropSuitability[] = [
  {
    cropName: 'Finger Millet (Ragi)',
    scientificName: 'Eleusine coracana',
    suitabilityScore: 92,
    waterRequirement: 'Very Low',
    waterResilienceIndex: 9.4,
    expectedDurationDays: '100 - 110 days',
    estimatedYieldPerAcre: '14 - 18 Quintals',
    averageMarketPricePerQtl: 3850,
    expectedProfitPerAcre: '₹34,000 - ₹42,000',
    soilSuitability: 'Excellent',
    riskFactor: 'Low',
    keyAdvantages: [
      'Requires only 300-350 mm water (50% less than groundnut)',
      'Highly resistant to Salem red soil drought episodes',
      'Minimal seed cost (₹450/acre)',
      'High demand from government millet missions & urban health brands'
    ],
    keyChallenges: [
      'Requires timely bird scaring during earhead maturation',
      'Labor requirement for manual transplanting or weeding'
    ],
    recommendationReason: 'Ideal for Ravi Kumar due to limited borewell discharge, low capital risk, and resilient yield in Thalaivasal red soil.'
  },
  {
    cropName: 'Sesame (Gingelly)',
    scientificName: 'Sesamum indicum',
    suitabilityScore: 86,
    waterRequirement: 'Very Low',
    waterResilienceIndex: 8.8,
    expectedDurationDays: '80 - 90 days',
    estimatedYieldPerAcre: '4 - 5.5 Quintals',
    averageMarketPricePerQtl: 12400,
    expectedProfitPerAcre: '₹36,000 - ₹46,000',
    soilSuitability: 'Good',
    riskFactor: 'Moderate',
    keyAdvantages: [
      'Very short duration (85 days)',
      'Extremely high market value (₹12,000+/qtl)',
      'Deep taproot taps subsoil moisture',
      'Can be harvested before peak summer heat'
    ],
    keyChallenges: [
      'Sensitive to water stagnation (even 1 day)',
      'Pod shattering risk if harvest is delayed'
    ],
    recommendationReason: 'High revenue potential as a border crop or companion crop; excellent complement to drought-resilient farming.'
  },
  {
    cropName: 'Black Gram (Urad)',
    scientificName: 'Vigna mungo',
    suitabilityScore: 78,
    waterRequirement: 'Low',
    waterResilienceIndex: 7.9,
    expectedDurationDays: '70 - 75 days',
    estimatedYieldPerAcre: '5 - 6.5 Quintals',
    averageMarketPricePerQtl: 7800,
    expectedProfitPerAcre: '₹28,000 - ₹35,000',
    soilSuitability: 'Good',
    riskFactor: 'Moderate',
    keyAdvantages: [
      'Nitrogen fixing legume rejuvenates soil after groundnut',
      'Short duration leaves field ready early',
      'Good domestic demand in Tamil Nadu'
    ],
    keyChallenges: [
      'Yellow Mosaic Virus susceptibility during summer',
      'Pod borer infestation requires watchful monitoring'
    ],
    recommendationReason: 'Good soil restorative option, but higher pest management vigilance required.'
  },
  {
    cropName: 'Groundnut',
    scientificName: 'Arachis hypogaea',
    suitabilityScore: 54,
    waterRequirement: 'Medium',
    waterResilienceIndex: 4.8,
    expectedDurationDays: '115 - 125 days',
    estimatedYieldPerAcre: '10 - 12 Quintals (Stressed)',
    averageMarketPricePerQtl: 6900,
    expectedProfitPerAcre: '₹18,000 - ₹24,000 (High Risk)',
    soilSuitability: 'Moderate',
    riskFactor: 'High',
    keyAdvantages: [
      'Familiarity to the farmer',
      'Ready local oil mill demand'
    ],
    keyChallenges: [
      'Requires 550-600 mm water with heavy irrigation at pod forming',
      'Extremely high seed cost (₹4,200 - ₹5,000/acre)',
      'High risk of ill-filled pods under borewell discharge constraints'
    ],
    recommendationReason: 'NOT recommended for the current season due to water deficit and severe loss risk reported previously.'
  },
  {
    cropName: 'Fodder Sorghum (Cholam)',
    scientificName: 'Sorghum bicolor',
    suitabilityScore: 82,
    waterRequirement: 'Very Low',
    waterResilienceIndex: 9.1,
    expectedDurationDays: '60 - 65 days (green fodder)',
    estimatedYieldPerAcre: '12 - 15 Tons',
    averageMarketPricePerQtl: 2200,
    expectedProfitPerAcre: '₹22,000 - ₹28,000',
    soilSuitability: 'Good',
    riskFactor: 'Low',
    keyAdvantages: [
      'Immense local dairy cattle demand in Salem district',
      'Extremely quick cash turnaround',
      'Tolerates harsh temperatures'
    ],
    keyChallenges: [
      'Perishable green fodder requires pre-arranged dairy farmer buyer'
    ],
    recommendationReason: 'Strong alternative if immediate cash flow is required within 60 days.'
  }
];

export const MARKET_DATA_RECORDS: MarketPriceRecord[] = [
  {
    id: 'mkt-001',
    cropName: 'Finger Millet (Ragi)',
    marketName: 'Salem Regulated Market',
    district: 'Salem',
    minPrice: 3600,
    maxPrice: 4100,
    modalPrice: 3850,
    unit: '₹ / Quintal',
    arrivalQuantityQuintals: 240,
    priceTrend: 'Bullish',
    date: '2026-11-04',
    dataSource: 'Agmarknet Verified Sample',
    isSimulated: true
  },
  {
    id: 'mkt-002',
    cropName: 'Finger Millet (Ragi)',
    marketName: 'Attur APMC',
    district: 'Salem',
    minPrice: 3550,
    maxPrice: 4000,
    modalPrice: 3780,
    unit: '₹ / Quintal',
    arrivalQuantityQuintals: 180,
    priceTrend: 'Bullish',
    date: '2026-11-04',
    dataSource: 'Agmarknet Verified Sample',
    isSimulated: true
  },
  {
    id: 'mkt-003',
    cropName: 'Sesame (White/Brown)',
    marketName: 'Salem Regulated Market',
    district: 'Salem',
    minPrice: 11800,
    maxPrice: 12900,
    modalPrice: 12400,
    unit: '₹ / Quintal',
    arrivalQuantityQuintals: 95,
    priceTrend: 'Bullish',
    date: '2026-11-04',
    dataSource: 'Agmarknet Verified Sample',
    isSimulated: true
  },
  {
    id: 'mkt-004',
    cropName: 'Black Gram (Urad)',
    marketName: 'Salem Regulated Market',
    district: 'Salem',
    minPrice: 7400,
    maxPrice: 8200,
    modalPrice: 7800,
    unit: '₹ / Quintal',
    arrivalQuantityQuintals: 140,
    priceTrend: 'Stable',
    date: '2026-11-04',
    dataSource: 'Agmarknet Verified Sample',
    isSimulated: true
  },
  {
    id: 'mkt-005',
    cropName: 'Groundnut (Pods)',
    marketName: 'Attur APMC',
    district: 'Salem',
    minPrice: 6300,
    maxPrice: 7200,
    modalPrice: 6900,
    unit: '₹ / Quintal',
    arrivalQuantityQuintals: 310,
    priceTrend: 'Bearish',
    date: '2026-11-04',
    dataSource: 'Agmarknet Verified Sample',
    isSimulated: true
  },
  {
    id: 'mkt-006',
    cropName: 'Maize (Yellow)',
    marketName: 'Namakkal Mandi',
    district: 'Namakkal',
    minPrice: 2200,
    maxPrice: 2450,
    modalPrice: 2350,
    unit: '₹ / Quintal',
    arrivalQuantityQuintals: 620,
    priceTrend: 'Stable',
    date: '2026-11-04',
    dataSource: 'Agmarknet Verified Sample',
    isSimulated: true
  }
];

export const WEATHER_FORECAST_DATA: WeatherRecord = {
  id: 'wx-salem-001',
  district: 'Salem (Thalaivasal block)',
  temperatureC: 33.4,
  humidityPercent: 48,
  rainfallMm: 0.0,
  windSpeedKmh: 11.2,
  forecastSummary: 'Partly cloudy, dry atmospheric conditions. Sustained daytime high temperatures with low overnight dew formation.',
  soilMoistureIndex: 34,
  droughtRiskScore: 68,
  rainfallAnomalyPercent: -26.4,
  timestamp: new Date().toISOString(),
  dataSource: 'Demonstration Climatology Data',
  isSimulated: true
};

export const HISTORICAL_PRICE_TRENDS = [
  { month: 'Jun', ragi: 3350, sesame: 10800, groundnut: 6400, blackGram: 7100 },
  { month: 'Jul', ragi: 3420, sesame: 11200, groundnut: 6600, blackGram: 7250 },
  { month: 'Aug', ragi: 3500, sesame: 11500, groundnut: 6800, blackGram: 7400 },
  { month: 'Sep', ragi: 3620, sesame: 11900, groundnut: 6750, blackGram: 7550 },
  { month: 'Oct', ragi: 3740, sesame: 12100, groundnut: 6850, blackGram: 7700 },
  { month: 'Nov', ragi: 3850, sesame: 12400, groundnut: 6900, blackGram: 7800 }
];

export const RAINFALL_TRENDS = [
  { month: 'Jun', normal: 68, actual: 52 },
  { month: 'Jul', normal: 94, actual: 78 },
  { month: 'Aug', normal: 122, actual: 88 },
  { month: 'Sep', normal: 165, actual: 114 },
  { month: 'Oct', normal: 172, actual: 130 },
  { month: 'Nov', normal: 98, actual: 66 }
];
