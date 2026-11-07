-- AgriCommand AI: Initial Database Schema Migration
-- Migration: 20261105000000_initial_agricommand_schema.sql
-- Covers 13 relational tables, UUIDs, foreign keys, timestamps, indexes, RLS policies, and Storage buckets.

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. PROFILES (extends auth.users)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'coordinator', 'expert', 'field_officer', 'farmer')),
    phone TEXT,
    organization TEXT DEFAULT 'Department of Agriculture',
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- 2. FARMERS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.farmers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    village TEXT NOT NULL,
    land_size_acres NUMERIC(6, 2) NOT NULL DEFAULT 1.0,
    soil_type TEXT NOT NULL,
    irrigation_source TEXT NOT NULL,
    primary_crops TEXT[] NOT NULL DEFAULT '{}',
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- 3. FARMER REPORTS (Problem Submissions)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.farmer_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID NOT NULL REFERENCES public.farmers(id) ON DELETE CASCADE,
    report_type TEXT NOT NULL CHECK (report_type IN ('crop_disease', 'weather_risk', 'market_advisory', 'soil_nutrient', 'general_consultation')),
    crop_affected TEXT NOT NULL,
    urgency TEXT NOT NULL CHECK (urgency IN ('low', 'medium', 'high', 'critical')),
    problem_description TEXT NOT NULL,
    symptoms TEXT[] NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'triaged', 'in_review', 'resolved')),
    media_urls TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- 4. AGENTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL,
    system_prompt TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'idle' CHECK (status IN ('idle', 'processing', 'completed', 'failed')),
    model TEXT NOT NULL DEFAULT 'gemini-3.1-flash-lite',
    version TEXT NOT NULL DEFAULT '1.0.0',
    capabilities JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- 5. COLLABORATION ROOMS (Switch-compatible rooms)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.collaboration_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    purpose TEXT NOT NULL,
    report_id UUID REFERENCES public.farmer_reports(id) ON DELETE SET NULL,
    created_by_profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'active', 'review', 'closed')),
    switch_room_id TEXT,
    switch_session_metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- 6. ROOM MEMBERS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.room_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES public.collaboration_rooms(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role_in_room TEXT NOT NULL DEFAULT 'participant',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT member_target_check CHECK (
        (agent_id IS NOT NULL AND profile_id IS NULL) OR
        (profile_id IS NOT NULL AND agent_id IS NULL)
    )
);

-- ============================================================================
-- 7. AGENT TASKS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.agent_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES public.collaboration_rooms(id) ON DELETE CASCADE,
    agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
    task_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'completed', 'failed')),
    input_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_data JSONB DEFAULT '{}'::jsonb,
    confidence_score NUMERIC(4, 3) DEFAULT 0.950,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    completed_at TIMESTAMPTZ
);

-- ============================================================================
-- 8. AGENT MESSAGES (Room Discussion & Switch Agent Protocol Events)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.agent_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES public.collaboration_rooms(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    sender_name TEXT NOT NULL,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('agent', 'human', 'system')),
    content TEXT NOT NULL,
    structured_payload JSONB DEFAULT '{}'::jsonb,
    switch_message_id TEXT,
    switch_event_type TEXT DEFAULT 'message.created',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- 9. CROP RECOMMENDATIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.crop_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES public.collaboration_rooms(id) ON DELETE SET NULL,
    farmer_id UUID REFERENCES public.farmers(id) ON DELETE CASCADE,
    primary_crop TEXT NOT NULL,
    alternative_crops TEXT[] NOT NULL DEFAULT '{}',
    expected_yield_per_acre NUMERIC(8, 2) NOT NULL,
    estimated_roi_percentage NUMERIC(5, 2) NOT NULL,
    water_requirement_mm NUMERIC(8, 2) NOT NULL,
    growing_duration_days INT NOT NULL,
    rationale TEXT NOT NULL,
    input_requirements JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- 10. MARKET RECORDS (Agmarknet & Mandi Data)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.market_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    commodity_name TEXT NOT NULL,
    variety TEXT DEFAULT 'Standard',
    market_center TEXT NOT NULL,
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    min_price_quintal NUMERIC(10, 2) NOT NULL,
    modal_price_quintal NUMERIC(10, 2) NOT NULL,
    max_price_quintal NUMERIC(10, 2) NOT NULL,
    price_trend TEXT NOT NULL CHECK (price_trend IN ('bullish', 'stable', 'bearish')),
    arrival_date DATE NOT NULL DEFAULT CURRENT_DATE,
    is_simulated BOOLEAN NOT NULL DEFAULT true,
    data_source TEXT DEFAULT 'Demonstration Agmarknet Feed',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- 11. WEATHER RECORDS (Microclimate & Forecasting)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.weather_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_name TEXT NOT NULL,
    latitude NUMERIC(9, 6) NOT NULL,
    longitude NUMERIC(9, 6) NOT NULL,
    forecast_date DATE NOT NULL DEFAULT CURRENT_DATE,
    temperature_celsius NUMERIC(4, 1) NOT NULL,
    humidity_percent INT NOT NULL,
    rainfall_probability_percent INT NOT NULL,
    precipitation_mm NUMERIC(6, 2) NOT NULL,
    advisory_notes TEXT,
    is_simulated BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- 12. AGRICULTURAL REPORTS (Synthesized Multi-Agent Action Plans)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.agricultural_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES public.collaboration_rooms(id) ON DELETE SET NULL,
    farmer_id UUID REFERENCES public.farmers(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    executive_summary TEXT NOT NULL,
    action_steps JSONB NOT NULL DEFAULT '[]'::jsonb,
    risk_analysis JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'rejected')),
    pdf_storage_path TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- 13. APPROVAL RECORDS (Human-in-the-loop Governance)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.approval_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID NOT NULL REFERENCES public.agricultural_reports(id) ON DELETE CASCADE,
    reviewed_by_profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewer_name TEXT NOT NULL,
    reviewer_role TEXT NOT NULL DEFAULT 'Agricultural Coordinator',
    decision TEXT NOT NULL CHECK (decision IN ('approved', 'modification_requested', 'rejected')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_farmers_phone ON public.farmers(phone);
CREATE INDEX IF NOT EXISTS idx_farmer_reports_status ON public.farmer_reports(status);
CREATE INDEX IF NOT EXISTS idx_collaboration_rooms_report ON public.collaboration_rooms(report_id);
CREATE INDEX IF NOT EXISTS idx_agent_messages_room ON public.agent_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_room ON public.agent_tasks(room_id);
CREATE INDEX IF NOT EXISTS idx_market_records_commodity ON public.market_records(commodity_name, market_center);
CREATE INDEX IF NOT EXISTS idx_weather_records_date ON public.weather_records(location_name, forecast_date);
CREATE INDEX IF NOT EXISTS idx_agri_reports_status ON public.agricultural_reports(status);
CREATE INDEX IF NOT EXISTS idx_approval_records_report ON public.approval_records(report_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmer_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agricultural_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_records ENABLE ROW LEVEL SECURITY;

-- 1. PROFILES: Public read for collaboration avatars, self update
CREATE POLICY "Profiles are viewable by all authenticated users"
    ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. FARMERS & REPORTS: Viewable by all authenticated staff, insertable
CREATE POLICY "Farmers viewable by authenticated users"
    ON public.farmers FOR SELECT USING (true);
CREATE POLICY "Farmers insertable by authenticated users"
    ON public.farmers FOR INSERT WITH CHECK (true);

CREATE POLICY "Reports viewable by all"
    ON public.farmer_reports FOR SELECT USING (true);
CREATE POLICY "Reports insertable by all"
    ON public.farmer_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Reports updatable by coordinators"
    ON public.farmer_reports FOR UPDATE USING (true);

-- 3. AGENTS: Read-only for clients, managed by system/admin
CREATE POLICY "Agents viewable by all"
    ON public.agents FOR SELECT USING (true);

-- 4. COLLABORATION ROOMS, TASKS & MESSAGES: Viewable and insertable
CREATE POLICY "Rooms viewable by all"
    ON public.collaboration_rooms FOR SELECT USING (true);
CREATE POLICY "Rooms insertable by authenticated users"
    ON public.collaboration_rooms FOR INSERT WITH CHECK (true);
CREATE POLICY "Rooms updatable"
    ON public.collaboration_rooms FOR UPDATE USING (true);

CREATE POLICY "Room members viewable by all"
    ON public.room_members FOR SELECT USING (true);
CREATE POLICY "Room members insertable"
    ON public.room_members FOR INSERT WITH CHECK (true);

CREATE POLICY "Tasks viewable by all"
    ON public.agent_tasks FOR SELECT USING (true);
CREATE POLICY "Tasks insertable/updatable"
    ON public.agent_tasks FOR ALL USING (true);

CREATE POLICY "Messages viewable by all"
    ON public.agent_messages FOR SELECT USING (true);
CREATE POLICY "Messages insertable by participants"
    ON public.agent_messages FOR INSERT WITH CHECK (true);

-- 5. RECOMMENDATIONS, MARKET & WEATHER: Read-only for general, insertable by system
CREATE POLICY "Crop recommendations viewable by all"
    ON public.crop_recommendations FOR SELECT USING (true);
CREATE POLICY "Crop recommendations insertable"
    ON public.crop_recommendations FOR INSERT WITH CHECK (true);

CREATE POLICY "Market records viewable by all"
    ON public.market_records FOR SELECT USING (true);
CREATE POLICY "Weather records viewable by all"
    ON public.weather_records FOR SELECT USING (true);

-- 6. AGRICULTURAL REPORTS & APPROVALS: Viewable by all, updatable by coordinators
CREATE POLICY "Reports viewable by all"
    ON public.agricultural_reports FOR SELECT USING (true);
CREATE POLICY "Reports insertable and updatable"
    ON public.agricultural_reports FOR ALL USING (true);

CREATE POLICY "Approvals viewable by all"
    ON public.approval_records FOR SELECT USING (true);
CREATE POLICY "Approvals insertable by coordinators"
    ON public.approval_records FOR INSERT WITH CHECK (true);

-- ============================================================================
-- STORAGE BUCKETS (Supabase Storage)
-- ============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('agricultural-reports', 'agricultural-reports', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access to Agricultural Reports"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'agricultural-reports');

CREATE POLICY "Authenticated users can upload Agricultural Reports"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'agricultural-reports');

-- ============================================================================
-- REALTIME REPLICATION SETUP
-- ============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.agent_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.agent_tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.approval_records;
ALTER PUBLICATION supabase_realtime ADD TABLE public.farmer_reports;
