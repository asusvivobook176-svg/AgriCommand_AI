-- AgriCommand AI: Initial Seed Data
-- Migration Seed: /supabase/seed.sql

-- 1. SEED AGENTS
INSERT INTO public.agents (id, name, role, system_prompt, status, model, version, capabilities)
VALUES
    (
        'a0000000-0000-0000-0000-000000000001',
        'Agri-Triage',
        'Ingestion & Triage Specialist',
        'You are Agri-Triage, an AI agronomist specialized in parsing unstructured farmer reports, identifying crop symptom clusters, assessing damage severity, and routing the mission to domain agents.',
        'idle',
        'gemini-3.1-flash-lite',
        '1.0.0',
        '["unstructured_intake", "severity_scoring", "agent_delegation"]'::jsonb
    ),
    (
        'a0000000-0000-0000-0000-000000000002',
        'CropMind',
        'Crop Selection & Soil Specialist',
        'You are CropMind, an agricultural scientist expert in soil chemistry, crop phenology, moisture retention, and high-yield cultivar recommendations tailored to Indian agro-climatic zones.',
        'idle',
        'gemini-3.1-flash-lite',
        '1.0.0',
        '["soil_matching", "yield_forecasting", "crop_diversification"]'::jsonb
    ),
    (
        'a0000000-0000-0000-0000-000000000003',
        'MarketPulse',
        'Agricultural Market & Mandi Analyst',
        'You are MarketPulse, a market intelligence analyst evaluating Agmarknet APMC mandi prices, price volatility, supply arrivals, and economic ROI for regional cash crops.',
        'idle',
        'gemini-3.1-flash-lite',
        '1.0.0',
        '["mandi_price_tracking", "roi_calculation", "buyer_arbitrage"]'::jsonb
    ),
    (
        'a0000000-0000-0000-0000-000000000004',
        'WeatherGuard',
        'Agro-Meteorological Risk Forecaster',
        'You are WeatherGuard, an agro-meteorological expert predicting seasonal monsoon patterns, heatwaves, drought indices, and frost risks to safeguard planting windows.',
        'idle',
        'gemini-3.1-flash-lite',
        '1.0.0',
        '["microclimate_risk", "precipitation_warning", "irrigation_advisory"]'::jsonb
    ),
    (
        'a0000000-0000-0000-0000-000000000005',
        'CoordinatorAgent',
        'Action Plan Synthesizer',
        'You are CoordinatorAgent, synthesizing cross-agent findings into an actionable 5-step agricultural roadmap ready for human coordinator review.',
        'idle',
        'gemini-3.1-flash-lite',
        '1.0.0',
        '["consensus_synthesis", "action_plan_generation", "human_review_packaging"]'::jsonb
    )
ON CONFLICT (name) DO NOTHING;

-- 2. SEED DEMO FARMER: Ravi Kumar
INSERT INTO public.farmers (id, name, phone, state, district, village, land_size_acres, soil_type, irrigation_source, primary_crops)
VALUES (
    'f0000000-0000-0000-0000-000000000001',
    'Ravi Kumar',
    '+91-9842104521',
    'Tamil Nadu',
    'Salem',
    'Attur Valley',
    4.50,
    'Red Sandy Loam (pH 6.8)',
    'Borewell with Drip Irrigation',
    ARRAY['Tapioca', 'Maize', 'Turmeric']
)
ON CONFLICT (id) DO NOTHING;

-- 3. SEED MARKET RECORDS (Salem APMC Mandi, Tamil Nadu)
INSERT INTO public.market_records (commodity_name, variety, market_center, state, district, min_price_quintal, modal_price_quintal, max_price_quintal, price_trend, arrival_date, is_simulated, data_source)
VALUES
    ('Tapioca', 'Local Starch White', 'Attur APMC', 'Tamil Nadu', 'Salem', 1450.00, 1680.00, 1850.00, 'stable', CURRENT_DATE, false, 'Salem Regulated Market Committee'),
    ('Turmeric', 'Salem Local Finger', 'Salem Mandi', 'Tamil Nadu', 'Salem', 12800.00, 14200.00, 15500.00, 'bullish', CURRENT_DATE, false, 'TN Agmarknet APMC Feed'),
    ('Maize', 'Hybrid Yellow', 'Namakkal APMC', 'Tamil Nadu', 'Namakkal', 2150.00, 2300.00, 2450.00, 'bullish', CURRENT_DATE, false, 'TN Agmarknet APMC Feed'),
    ('Pearl Millet (Bajra)', 'Desi Cumbu', 'Dharmapuri APMC', 'Tamil Nadu', 'Dharmapuri', 2400.00, 2650.00, 2800.00, 'bullish', CURRENT_DATE, false, 'TN Agmarknet APMC Feed'),
    ('Cotton', 'MCU-5 Medium', 'Erode APMC', 'Tamil Nadu', 'Erode', 6800.00, 7250.00, 7600.00, 'bearish', CURRENT_DATE, false, 'TN Agmarknet APMC Feed'),
    ('Groundnut', 'TMV-7 Pods', 'Salem Mandi', 'Tamil Nadu', 'Salem', 6400.00, 6850.00, 7200.00, 'stable', CURRENT_DATE, false, 'Salem Regulated Market Committee');

-- 4. SEED WEATHER RECORDS (Salem Microclimate)
INSERT INTO public.weather_records (location_name, latitude, longitude, forecast_date, temperature_celsius, humidity_percent, rainfall_probability_percent, precipitation_mm, advisory_notes, is_simulated)
VALUES
    ('Attur, Salem', 11.5976, 78.5991, CURRENT_DATE, 33.5, 62, 15, 0.0, 'Moderate afternoon heat, stable morning conditions. Ideal for land preparation and micro-irrigation checks.', false),
    ('Attur, Salem', 11.5976, 78.5991, CURRENT_DATE + INTERVAL '1 day', 34.0, 58, 20, 0.5, 'Slight cloud buildup in evening. Favorable for seedling transplanting.', false),
    ('Attur, Salem', 11.5976, 78.5991, CURRENT_DATE + INTERVAL '2 day', 32.8, 68, 45, 4.2, 'Light convective shower expected. Postpone foliar nutrient spraying until clear.', false),
    ('Attur, Salem', 11.5976, 78.5991, CURRENT_DATE + INTERVAL '3 day', 31.5, 75, 60, 12.0, 'Substantial pre-monsoon precipitation expected. Ensure drainage around tubers.', false);
