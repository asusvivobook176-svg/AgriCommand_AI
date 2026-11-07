# Implementation Plan: AgriCommand AI – Supabase Backend Migration & Architecture

## Executive Summary
This implementation plan outlines the migration of **AgriCommand AI** (Human-AI Collaborative Agriculture Intelligence Platform) from its mixed SQLite/Flask/in-memory setup to an enterprise-grade, unified **Supabase backend**. The architecture preserves all 12 frontend workspaces, the 5 specialized Gemini AI agents, the Switch Protocol collaboration engine, and the Ravi Kumar (Salem, Tamil Nadu) flagship workflow.

Based on clarified user preferences:
1. **Zero-Configuration Resilient Fallback**: The client and server will operate seamlessly with a local memory/sandbox fallback if `SUPABASE_URL` / `SUPABASE_ANON_KEY` are unset, while activating full Supabase PostgreSQL, Auth, and Storage when configured.
2. **Auth & RBAC Experience**: An intuitive Auth Modal and Role Switcher (`Administrator`, `Agricultural Coordinator`, `Agricultural Expert`, `Field Officer`, `Farmer`) will be integrated into the navigation header while maintaining instant demo access for hackathon judges and evaluators.
3. **Legacy Cleanup**: Python Flask files will be cleanly archived under `/archive/backend_flask/` once Node/Express endpoints, Supabase schemas, and data pipelines are verified.

---

## Architecture Diagram & Data Flow

```
                      +---------------------------------------+
                      |       AgriCommand AI Frontend         |
                      |   React 19 + TypeScript + Tailwind    |
                      |   12 Workspaces (Field to Room)       |
                      +-------------------+-------------------+
                                          |
                +-------------------------+-------------------------+
                |                                                   |
      [Supabase Browser Client]                             [Express Server]
      - Auth state & Role switcher                          (server.ts / port 3000)
      - Direct reads via RLS                                - Gemini AI 5-Agent Pipeline
      - Realtime room event feeds                           - Privileged writes via
      - Storage bucket document download                      Supabase Service Role
      - Resilient fallback engine                           - Switch Protocol Orchestration
                |                                                   |
                +-------------------------+-------------------------+
                                          |
                                          v
                      +---------------------------------------+
                      |         Supabase Cloud Backend        |
                      |  * PostgreSQL (13 Relational Tables)  |
                      |  * Row-Level Security (RBAC Policies) |
                      |  * Supabase Realtime Channels         |
                      |  * Supabase Storage ('reports', ...)  |
                      +---------------------------------------+
```

---

## Phase 1: Dependencies & Environment Setup
- **NPM Packages**:
  - Install `@supabase/supabase-js` (production Supabase client for browser & Node.js).
  - Install `zod` (runtime schema validation for API inputs and agent payloads).
- **Environment Configuration**:
  - Update `.env.example` with documented Supabase variables:
    ```env
    VITE_SUPABASE_URL="https://your-project.supabase.co"
    VITE_SUPABASE_ANON_KEY="your-anon-key"
    SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
    SUPABASE_URL="https://your-project.supabase.co"
    GEMINI_API_KEY="your-gemini-api-key"
    SWITCH_AGENT_TOKEN="optional-switch-token"
    ```
  - Create `server/config/env.ts` with strict Zod parsing and fallback detection.

---

## Phase 2: PostgreSQL Schema, Migrations, RLS & Storage

### 1. Migrations Directory: `/supabase/migrations/20261105000000_initial_agricommand_schema.sql`
Implement all 13 required relational tables with UUID primary keys, foreign key constraints, timestamps, and indexes:
1. `profiles`: `id` (FK `auth.users`), `email`, `full_name`, `role` (`admin`, `coordinator`, `expert`, `field_officer`, `farmer`), `phone`, `organization`, `created_at`, `updated_at`.
2. `farmers`: `id`, `name`, `phone`, `state`, `district`, `village`, `land_size_acres`, `soil_type`, `irrigation_source`, `primary_crops`, `created_at`, `updated_at`.
3. `farmer_reports`: `id`, `farmer_id` (FK `farmers`), `report_type`, `crop_affected`, `urgency`, `problem_description`, `symptoms`, `status` (`pending`, `triaged`, `in_review`, `resolved`), `media_urls`, `created_at`, `updated_at`.
4. `agents`: `id`, `name`, `system_prompt`, `role`, `status` (`idle`, `processing`, `completed`), `model`, `version`, `capabilities`, `created_at`.
5. `collaboration_rooms`: `id`, `name`, `purpose`, `created_by_profile_id`, `status` (`open`, `active`, `review`, `closed`), `report_id` (FK `farmer_reports`), `switch_room_id`, `created_at`, `updated_at`.
6. `room_members`: `id`, `room_id` (FK `collaboration_rooms`), `agent_id` (nullable, FK `agents`), `profile_id` (nullable, FK `profiles`), `joined_at`, `role_in_room`.
7. `agent_tasks`: `id`, `room_id` (FK `collaboration_rooms`), `agent_id` (FK `agents`), `task_name`, `status` (`assigned`, `in_progress`, `completed`, `failed`), `input_data`, `output_data`, `created_at`, `completed_at`.
8. `agent_messages`: `id`, `room_id` (FK `collaboration_rooms`), `agent_id` (nullable, FK `agents`), `profile_id` (nullable, FK `profiles`), `sender_name`, `sender_type` (`agent`, `human`), `content`, `structured_payload`, `switch_message_id`, `created_at`.
9. `crop_recommendations`: `id`, `room_id`, `farmer_id`, `primary_crop`, `alternative_crops`, `expected_yield_per_acre`, `estimated_roi_percentage`, `water_requirement_mm`, `growing_duration_days`, `rationale`, `created_at`.
10. `market_records`: `id`, `commodity_name`, `variety`, `market_center`, `state`, `district`, `min_price_quintal`, `modal_price_quintal`, `max_price_quintal`, `price_trend` (`bullish`, `stable`, `bearish`), `arrival_date`, `is_simulated`, `created_at`.
11. `weather_records`: `id`, `location_name`, `latitude`, `longitude`, `forecast_date`, `temperature_celsius`, `humidity_percent`, `rainfall_probability_percent`, `precipitation_mm`, `advisory_notes`, `is_simulated`, `created_at`.
12. `agricultural_reports`: `id`, `room_id`, `farmer_id`, `title`, `executive_summary`, `action_steps`, `risk_analysis`, `status` (`draft`, `pending_approval`, `approved`, `rejected`), `pdf_storage_path`, `created_at`, `updated_at`.
13. `approval_records`: `id`, `report_id` (FK `agricultural_reports`), `reviewed_by_profile_id`, `reviewer_name`, `reviewer_role`, `decision` (`approved`, `modification_requested`, `rejected`), `notes`, `created_at`.

### 2. Row Level Security (RLS) & Policies
- Enable RLS on all 13 tables.
- Public read access for demo datasets (`market_records`, `weather_records`, `agents`).
- Authenticated read/write with role-based policies (e.g., Coordinator/Admin can approve; Farmers can read/submit own reports).
- Service Role bypass for backend Express orchestration and automated agent logging.

### 3. Storage Buckets
- Migration definition for `agricultural-reports` storage bucket with public/authenticated read policies and PDF download support.

### 4. Seed Data: `/supabase/seed.sql`
- Pre-populate all 5 specialized agents:
  1. `Agri-Triage` (Ingestion & Classification)
  2. `CropMind` (Agronomy & Soil Matching)
  3. `MarketPulse` (Price Trends & Market Dynamics)
  4. `WeatherGuard` (Microclimate & Risk Forecasting)
  5. `CoordinatorAgent` (Synthesis & Action Planning)
- Pre-populate Ravi Kumar farmer profile (Salem, Tamil Nadu, 4.5 acres, Red loamy, borewell, Tapioca & Maize).
- Pre-populate market records (Salem, Erode, Dharmapuri) and weather advisories.

---

## Phase 3: Client SDK, Types & Service Layer
- **Database Types**: `src/types/database.types.ts` representing the exact Supabase TypeScript schema.
- **Client Factory**: `src/lib/supabase.ts`
  - Detects if valid Supabase URL & Anon Key are provided.
  - If configured: exports real `createClient(...)`.
  - If unconfigured: exports an identical mock client interface backed by `src/data/mockData.ts` and in-memory stores so the UI never crashes and remains 100% interactive.
- **Data Service**: `src/services/supabaseService.ts`
  - Encapsulates database queries (`fetchFarmers`, `fetchFarmerReports`, `createFarmerReport`, `fetchRooms`, `fetchRoomMessages`, `postRoomMessage`, `fetchAgriculturalReports`, `submitApproval`).
  - Supports Realtime event hooks (`subscribeToRoomMessages`, `subscribeToApprovals`).
  - Supports Storage bucket downloads.

---

## Phase 4: Node.js / Express Server Migration & Agent Pipeline
- **Admin Client**: `server/services/supabaseAdmin.ts` with `createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)` for high-integrity database operations.
- **Zod Validation Middleware**: `server/middleware/validation.ts` validating payload schemas before invoking expensive workflows.
- **Endpoints in `server.ts`**:
  - `POST /api/farmers` & `GET /api/farmers`: Fetch and create farmer profiles.
  - `POST /api/reports/submit`: Ingest farmer problem report.
  - `POST /api/workflow/run`: Execute the 5-agent Gemini orchestration pipeline. Persists tasks, messages, and synthesized agricultural action reports directly into Supabase tables via `supabaseAdmin`.
  - `GET /api/workflow/status/:reportId`: Retrieve live progress and generated recommendations.
  - `POST /api/approvals`: Coordinator sign-off with audit logging into `approval_records`.
  - `GET /api/market`: Market intelligence data.
  - `GET /api/weather`: Weather risk advisories.
  - `GET /api/switch/status`: Switch agent protocol status and room binding.

---

## Phase 5: UI Enhancements – Supabase Auth & Role Switcher
- **Header Auth Component**: `src/components/AuthModal.tsx` & `src/components/Header.tsx`
  - Role Switcher dropdown: Quick switch between `Agricultural Coordinator`, `Agricultural Expert`, `Field Officer`, `Farmer`, and `Administrator`.
  - Auth Modal: Email/password Sign In / Sign Up, and one-click "Demo Coordinator Login".
  - Shows current active user profile, badge, and live Supabase connection status indicator (Live Supabase vs Resilient Local Engine).
- **Workspace Updates**:
  - `FarmerSubmissionView.tsx`: Submits directly to Supabase with real-time feedback.
  - `CollaborationRoomsView.tsx`: Realtime chat subscription with agent messages and Switch protocol badges.
  - `HumanApprovalsView.tsx`: Connected to `approval_records` with coordinator verification.
  - `DownloadReportsView.tsx`: Downloads synthesized reports and generated PDF assets.

---

## Phase 6: Flask Backend Archival
- Create `/archive/backend_flask/` directory.
- Move `backend_flask/` files into archive for safe keeping and traceability.
- Update `package.json` and Docker configs to center strictly on the Node.js/TypeScript + Supabase fullstack environment.

---

## Phase 7: Verification & Testing
1. **Compilation & Linting**: Run `compile_applet` and `lint_applet` together to verify zero TypeScript errors.
2. **API Verification**: Test end-to-end flow with Ravi Kumar's problem submission, multi-agent evaluation, message generation, and approval.
3. **Artifacts & Documentation**: Update `README.md`, `API_DOCUMENTATION.md`, and create Postman collection `agricommand_postman_collection.json`.

---

## User Review Request
Please review the proposed migration plan above. Click **Proceed** to begin implementation.
