# AgriCommand AI – API Documentation & Supabase Architecture

## Overview
AgriCommand AI is a Human-AI Collaborative Agriculture Intelligence Platform demonstrating multi-agent workflows connected via the **Switch Agent Collaboration Infrastructure** (https://docs.switchagents.ai/) and powered by **Supabase PostgreSQL & Auth**.

---

## 1. Supabase Architecture

### Dual-Engine Operation
- **Live Supabase Mode**: When `VITE_SUPABASE_URL` / `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` or `SUPABASE_ANON_KEY` are provided, all operations persist directly into Supabase PostgreSQL, trigger Supabase Realtime channels, and upload/download via Supabase Storage.
- **Resilient Local Mode**: When unconfigured in offline/development setups, the platform automatically activates an in-memory PostgreSQL emulator matching the exact Supabase query-builder API (`.from()`, `.select()`, `.insert()`, `.channel()`, `.storage`).

### Relational Schema (13 Tables)
1. `profiles`: Extended user accounts with role check (`admin`, `coordinator`, `expert`, `field_officer`, `farmer`).
2. `farmers`: Farmer demographic, landholding, soil chemistry, and irrigation attributes.
3. `farmer_reports`: Ingested agricultural problem records and symptom tags.
4. `agents`: Catalog of 5 specialized agents with prompts and capabilities.
5. `collaboration_rooms`: Switch-compatible multi-agent and human workspaces.
6. `room_members`: Agent and human participants bound to rooms.
7. `agent_tasks`: Granular task dispatching and execution logs.
8. `agent_messages`: Switch event messages, structured cards, and audit payloads.
9. `crop_recommendations`: Cultivar suitability evaluations, ROI, and water quotas.
10. `market_records`: APMC mandi wholesale records, modal prices, and trend indicators.
11. `weather_records`: Microclimate forecasts, rainfall anomalies, and drought risks.
12. `agricultural_reports`: Synthesized comprehensive action plans.
13. `approval_records`: Human-in-the-loop coordinator approval audit trail.

---

## 2. API Endpoints

### System & Health
- **`GET /api/health`**
  - Response: `{ status: "ok", geminiConfigured: boolean, supabaseConnected: boolean, supabaseMode: string, switchMode: string, timestamp: string }`
- **`GET /api/supabase/status`**
  - Returns backend Supabase connection status, URL, table list, and service role detection.

### Farmers
- **`GET /api/farmers`**
  - Returns list of registered farmers.
- **`POST /api/farmers`**
  - Registers a new farmer.
  - Body: `{ name, phone, village, district, state, landAreaAcres, soilType, waterAvailability, irrigationSource, previousCrop, currentSeason, preferredCrop }`

### Agricultural Problem Reports
- **`GET /api/reports`**
  - List submitted agricultural problems with triage status, priority, and assigned agents.
- **`POST /api/reports`**
  - Submit new farmer problem report. Automatically provisions a Switch Collaboration Room (`room-{reportId}`) and assigns `Agri-Triage`.

### Switch Collaboration Rooms
- **`GET /api/rooms`**
  - List active Switch collaboration rooms.
- **`GET /api/rooms/:id`**
  - Get room metadata, members (agents & human coordinator), and full message stream.
- **`POST /api/rooms/:id/messages`**
  - Post a message into the room from human coordinator or agent.

### Multi-Agent Workflow Runner (Gemini Powered)
- **`POST /api/workflow/run`**
  - Ingests `reportId`, runs multi-agent sequence across 5 specialized agents:
    1. **Agri-Triage**: Problem classification & agent dispatch.
    2. **CropMind**: Soil & water compatibility analysis with ML suitability score.
    3. **MarketPulse**: APMC mandi price scan & volatility risk.
    4. **WeatherGuard**: Rainfall anomaly & drought risk mitigations.
    5. **AgriReport**: Synthesizes draft Agricultural Action Plan.
  - Generates structured JSON cards in the Switch room, persists to Supabase `agent_messages`, `crop_recommendations`, and `agricultural_reports`.

### Human Approvals & Governance
- **`GET /api/approvals`**
  - List pending, approved, revised, and rejected action plans.
- **`POST /api/approvals/:id`**
  - Submit human review decision with Zod validation.
  - Body: `{ decision: "Approved" | "Rejected" | "Revision Requested", comments: string, reviewerName: string }`
  - Persists audit trail in `approval_records` and updates `agricultural_reports`.

### Storage & Dossier Exports
- **`GET /api/storage/agricultural-reports/:filename`**
  - Downloads official Agricultural Action Dossier from storage.

### Intelligence Data
- **`GET /api/market-data`**
  - Agmarknet mandi price records with min, max, modal prices, and trend indicators.
- **`GET /api/weather-data`**
  - Weather metrics (temperature, humidity, rainfall deficit, drought risk, soil moisture).

### Switch Adapter Config
- **`GET /api/switch/config`**
  - Retrieve Switch Console URL, Gateway endpoint, API key, and active mode (`sandbox` vs `switch_live_gateway`).
- **`POST /api/switch/config`**
  - Update Switch connection parameters.
