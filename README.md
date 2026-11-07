# AgriCommand AI
## Human-AI Collaborative Agriculture Intelligence Platform
### Flip the Switch Hackathon – Best Business Workflow

AgriCommand AI is an enterprise-grade agricultural intelligence platform demonstrating how farmers, human agricultural coordinators, and specialized AI agents collaborate through **Switch agent collaboration infrastructure** (https://docs.switchagents.ai/) and a unified **Supabase Cloud / PostgreSQL** backend to solve critical farm decisions.

---

## 🌟 Key Capabilities

1. **Supabase Cloud Backend & Resilient Local Fallback**:
   - **13 Relational Tables**: `profiles`, `farmers`, `farmer_reports`, `agents`, `collaboration_rooms`, `room_members`, `agent_tasks`, `agent_messages`, `crop_recommendations`, `market_records`, `weather_records`, `agricultural_reports`, and `approval_records`.
   - **Row Level Security (RLS)**: Enforced across all tables with role-based policies.
   - **Supabase Realtime**: Live updates for agent messages and approvals.
   - **Supabase Storage**: Action Plan report documents stored in the `agricultural-reports` bucket.
   - **Dual-Engine Graceful Fallback**: Automatically activates a local in-memory PostgreSQL emulator when Supabase environment variables are unconfigured, ensuring 100% offline uptime.

2. **Supabase Auth & Role-Based Access Control (RBAC)**:
   - Header-integrated Auth Modal & Role Switcher.
   - Preset agricultural personas for immediate demo access:
     - `Administrator`
     - `Agricultural Coordinator` (Dr. Sundaram)
     - `Agricultural Expert` (Dr. Meenakshi Raman)
     - `Field Officer` (K. Vignesh)
     - `Farmer` (Ravi Kumar)
   - Real email/password signup and login with Supabase Auth.

3. **Switch Agent Collaboration Rooms**:
   - Shared multi-agent & human workspace powered by Switch Agent Protocol 1.0.
   - Real-time agent status tracking (`Online`, `Working`, `Waiting`, `Completed`, `Error`).
   - Agent handoffs, message history, structured intelligence cards, and human intervention threads.
   - Dual-mode support: **Switch Live Gateway** and **Local Switch Sandbox**.

4. **5 Specialized AI Agents (Gemini-Powered)**:
   - **Agri-Triage**: Classifies agricultural issues, sets priority, and delegates specialist tasks.
   - **CropMind**: Evaluates soil types, water constraints, and predicts crop suitability via ML models.
   - **MarketPulse**: Analyzes Agmarknet APMC market arrivals, wholesale prices, and volatility risks.
   - **WeatherGuard**: Monitors rainfall deficits, drought risk, and provides climate-adapted advisories.
   - **AgriReport**: Synthesizes specialist findings into actionable agricultural action plans.

5. **Human Approval Workspace**:
   - High-impact agricultural recommendations require human validation.
   - Coordinators review findings, evaluate limitations, and provide real decisions (**Approve**, **Reject**, **Request Revision**).
   - Audited digitally into Supabase `approval_records`.

6. **Demonstration Scenario**:
   - **Farmer**: Ravi Kumar
   - **Location**: Thalaivasal, Salem District, Tamil Nadu
   - **Land**: 2.0 acres, Red Sandy Loam, Limited borewell water (1.5-2 hrs/day)
   - **Problem**: Incurred high losses with groundnut due to water deficit at pod filling.
   - **Outcome**: 100% agent consensus on Finger Millet (Ragi - Var. Paiyur 2) + Sesame border crop, reducing water consumption by 45% while stabilizing net farm income.

---

## 🚀 Quick Start

### Development
```bash
npm run dev
# Starts unified fullstack dev server on port 3000
```

### Environment Variables
Configure `.env` or set keys via UI:
```env
GEMINI_API_KEY="your-gemini-key"
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

### Postman API Testing
Import `agricommand_postman_collection.json` into Postman to test all endpoints.

### Legacy Flask Backend
The legacy Python Flask implementation has been safely archived in `/archive/backend_flask/`.
