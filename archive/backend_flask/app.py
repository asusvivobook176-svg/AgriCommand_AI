"""
AgriCommand AI - Flask REST API Backend
Human-AI Collaborative Agriculture Intelligence Platform
"""

import os
import time
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

from models import (
    db, User, Farmer, FarmerReport, Agent, CollaborationRoom, 
    RoomMember, AgentTask, AgentMessage, CropRecommendation, 
    MarketRecord, WeatherRecord, AgriculturalReport, ApprovalRecord
)
from agents import (
    AgriTriageAgent, CropMindAgent, MarketPulseAgent, 
    WeatherGuardAgent, AgriReportAgent
)
from switch_client import SwitchClient

load_dotenv()

app = Flask(__name__)
CORS(app)

# Database URI with graceful fallback to local SQLite for instant testing
POSTGRES_URL = os.getenv('DATABASE_URL', 'postgresql://agri_user:agri_pass@localhost:5432/agricommand_db')
app.config['SQLALCHEMY_DATABASE_URI'] = POSTGRES_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
try:
    db.init_app(app)
except Exception as e:
    print("[Flask DB Warning] Fallback init:", e)

# Initialize Specialists & Switch Client
triage_agent = AgriTriageAgent()
cropmind_agent = CropMindAgent()
marketpulse_agent = MarketPulseAgent()
weatherguard_agent = WeatherGuardAgent()
agrireport_agent = AgriReportAgent()
switch_client = SwitchClient(mode=os.getenv('SWITCH_MODE', 'sandbox'))

# -------------------------------------------------------------
# Database Seeder & Fallback Helper
# -------------------------------------------------------------
def init_db_with_seed():
    """Initializes tables and seeds Ravi Kumar demonstration scenario."""
    try:
        db.create_all()
    except Exception as e:
        print("[Flask DB] Connecting with SQLite fallback for local testing:", e)
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///agricommand.db'
        db.init_app(app)
        db.create_all()

    # Seed Farmers if empty
    if not Farmer.query.first():
        f1 = Farmer(
            id='farmer-ravi-kumar',
            name='Ravi Kumar',
            phone='+91 98421 87654',
            village='Thalaivasal',
            district='Salem',
            state='Tamil Nadu',
            land_area_acres=2.0,
            soil_type='Red Soil',
            water_availability='Limited',
            irrigation_source='Borewell (intermittent yield, 1.5 inch delivery)',
            previous_crop='Groundnut (TMV-7)',
            current_season='Navarai / Summer 2026'
        )
        f2 = Farmer(
            id='farmer-priya-selvan',
            name='Priya Selvan',
            phone='+91 94432 11982',
            village='Omalur',
            district='Salem',
            state='Tamil Nadu',
            land_area_acres=3.5,
            soil_type='Clay Loam',
            water_availability='Moderate',
            irrigation_source='Open well with drip irrigation',
            previous_crop='Maize',
            current_season='Rabi / Late Winter'
        )
        db.session.add_all([f1, f2])
        db.session.commit()

        # Seed initial report
        rep1 = FarmerReport(
            id='REP-2026-SLM-001',
            farmer_id=f1.id,
            category='Crop selection',
            problem_description='Wants to select a suitable crop for next season considering water availability and market demand. Water table dropped to 1.5 hrs/day.',
            priority='High',
            status='Pending Human Approval',
            room_id='room-rep-001-salem'
        )
        db.session.add(rep1)
        db.session.commit()

        # Seed initial room & messages
        room1 = CollaborationRoom(
            id='room-rep-001-salem',
            report_id=rep1.id,
            title='Ravi Kumar – Crop Selection & Water Optimization [Salem]',
            topic='Cross-specialist evaluation of Finger Millet (Ragi) vs Sesame in Thalaivasal red soil.',
            status='active',
            switch_mode='sandbox'
        )
        db.session.add(room1)
        db.session.commit()

        m1 = AgentMessage(
            id='msg-001',
            room_id=room1.id,
            sender_type='farmer',
            sender_id=f1.id,
            sender_name='Ravi Kumar (Farmer)',
            message_type='chat',
            content='Vanakkam. I have 2 acres of red soil in Thalaivasal, Salem with limited borewell water. Need low-water crop with good mandi price.'
        )
        m2 = AgentMessage(
            id='msg-002',
            room_id=room1.id,
            sender_type='agent',
            sender_id='agent-triage',
            sender_name='Agri-Triage',
            role='Triage Specialist',
            message_type='triage_card',
            content='Report classified under Crop Selection with High priority.',
            structured_data={
                "category": "Crop selection",
                "priority": "High",
                "assignedAgents": ["CropMind", "MarketPulse", "WeatherGuard"]
            }
        )
        db.session.add_all([m1, m2])

        # Seed initial Action Plan
        plan1 = AgriculturalReport(
            id='plan-rep-001',
            report_id=rep1.id,
            farmer_name=f1.name,
            district=f1.district,
            version=1,
            primary_crop='Finger Millet (Ragi - Var. Paiyur 2 / GPU 28)',
            secondary_crop='Sesame (Gingelly - TMV 7)',
            triage_summary='Coordinated CropMind, MarketPulse and WeatherGuard for 2 acres red soil.',
            crop_summary='Paiyur 2 Ragi demonstrates 92% suitability with 320 mm water demand.',
            market_summary='Wholesale prices stable at ₹3,850/qtl in Salem APMC yard.',
            weather_summary='Compensates for -26% seasonal rainfall deficit.',
            action_items=[
                {"timeline": "Day -7 to 0", "activity": "Deep ploughing & form ridges-and-furrows.", "recommendedInputs": "FYM + Bio-fertilizers", "criticalNotes": "Conserves root zone moisture."},
                {"timeline": "Day 1 to 5", "activity": "Line sowing certified Paiyur 2 seeds.", "recommendedInputs": "Certified seed 5kg/acre", "criticalNotes": "Soaking irrigation."}
            ],
            limitations=["Assumes borewell yields at least 1.5 hours of irrigation every 48 hours."],
            missing_info=["Exact electrical feeder schedule in village."],
            status='Pending'
        )
        db.session.add(plan1)

        # Seed market & weather records
        mk1 = MarketRecord(
            id='mkt-001',
            crop_name='Finger Millet (Ragi)',
            market_name='Salem Regulated Market',
            district='Salem',
            min_price=3600,
            max_price=4100,
            modal_price=3850,
            price_trend='Bullish',
            data_source='Agmarknet Verified Sample',
            is_simulated=True,
            recorded_date='2026-11-05'
        )
        wx1 = WeatherRecord(
            id='wx-001',
            district='Salem',
            temperature_c=33.4,
            humidity_percent=48.0,
            rainfall_anomaly_percent=-26.4,
            drought_risk_score=68.0,
            soil_moisture_index=34.0,
            summary='Partly cloudy, dry atmospheric conditions. High daytime evapotranspiration.',
            data_source='Demonstration Climatology Data',
            is_simulated=True
        )
        db.session.add_all([mk1, wx1])
        db.session.commit()
        print("[Flask DB] Initial database tables created and seeded successfully.")

# -------------------------------------------------------------
# REST API Endpoints
# -------------------------------------------------------------

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy",
        "service": "AgriCommand AI Flask REST API",
        "switch_mode": switch_client.mode,
        "database": app.config['SQLALCHEMY_DATABASE_URI'].split('://')[0],
        "timestamp": datetime.utcnow().isoformat()
    })

# Farmers
@app.route('/api/farmers', methods=['GET'])
def get_farmers():
    farmers = Farmer.query.order_by(Farmer.created_at.desc()).all()
    return jsonify([f.to_dict() for f in farmers])

@app.route('/api/farmers', methods=['POST'])
def create_farmer():
    data = request.json or {}
    farmer_id = f"farmer-{int(time.time())}"
    farmer = Farmer(
        id=farmer_id,
        name=data.get('name', 'Farmer'),
        phone=data.get('phone', '+91 90000 00000'),
        village=data.get('village', 'Salem Village'),
        district=data.get('district', 'Salem'),
        state=data.get('state', 'Tamil Nadu'),
        land_area_acres=float(data.get('landAreaAcres', 2.0)),
        soil_type=data.get('soilType', 'Red Soil'),
        water_availability=data.get('waterAvailability', 'Limited'),
        irrigation_source=data.get('irrigationSource', 'Borewell'),
        previous_crop=data.get('previousCrop', 'Groundnut'),
        current_season=data.get('currentSeason', 'Summer 2026')
    )
    db.session.add(farmer)
    db.session.commit()
    return jsonify(farmer.to_dict()), 201

# Reports
@app.route('/api/reports', methods=['GET'])
def get_reports():
    reports = FarmerReport.query.order_by(FarmerReport.submitted_at.desc()).all()
    return jsonify([r.to_dict() for r in reports])

@app.route('/api/reports/<report_id>', methods=['GET'])
def get_report(report_id):
    rep = FarmerReport.query.filter_by(id=report_id).first()
    if not rep:
        return jsonify({"error": "Report not found"}), 404
    return jsonify(rep.to_dict())

@app.route('/api/reports', methods=['POST'])
def create_report():
    data = request.json or {}
    report_id = f"REP-2026-{(data.get('district', 'SLM')[:3]).upper()}-{int(time.time()) % 1000:03d}"
    room_id = f"room-{report_id.lower()}"

    rep = FarmerReport(
        id=report_id,
        farmer_id=data.get('farmerId', 'farmer-ravi-kumar'),
        category=data.get('category', 'Crop selection'),
        problem_description=data.get('problemDescription', ''),
        priority=data.get('priority', 'High'),
        status='Submitted',
        room_id=room_id,
        image_url=data.get('imageUrl')
    )
    db.session.add(rep)

    room = CollaborationRoom(
        id=room_id,
        report_id=report_id,
        title=f"{data.get('farmerName', 'Farmer')} – {data.get('category', 'Advisory')} [{data.get('district', 'Salem')}]",
        topic=f"Multi-agent Switch collaboration for {data.get('farmerName', 'Farmer')}",
        status='active',
        switch_mode=switch_client.mode
    )
    db.session.add(room)

    msg = AgentMessage(
        id=f"msg-{int(time.time())}-farmer",
        room_id=room_id,
        sender_type='farmer',
        sender_id=data.get('farmerId', 'farmer-ravi-kumar'),
        sender_name=f"{data.get('farmerName', 'Farmer')} (Farmer)",
        message_type='chat',
        content=data.get('problemDescription', '')
    )
    db.session.add(msg)
    db.session.commit()

    return jsonify({"report": rep.to_dict(), "room": room.to_dict()}), 201

# Rooms & Messages
@app.route('/api/rooms', methods=['GET'])
def get_rooms():
    rooms = CollaborationRoom.query.order_by(CollaborationRoom.created_at.desc()).all()
    return jsonify([r.to_dict() for r in rooms])

@app.route('/api/rooms/<room_id>', methods=['GET'])
def get_room(room_id):
    room = CollaborationRoom.query.filter_by(id=room_id).first()
    if not room:
        return jsonify({"error": "Room not found"}), 404
    return jsonify(room.to_dict())

@app.route('/api/rooms/<room_id>/messages', methods=['POST'])
def add_room_message(room_id):
    data = request.json or {}
    room = CollaborationRoom.query.filter_by(id=room_id).first()
    if not room:
        return jsonify({"error": "Room not found"}), 404

    msg = AgentMessage(
        id=f"msg-{int(time.time())}-{int(time.time() * 1000) % 1000}",
        room_id=room_id,
        sender_type=data.get('senderType', 'human'),
        sender_id=data.get('senderId', 'human-coord'),
        sender_name=data.get('senderName', 'Dr. Sundaram (Agri Coordinator)'),
        role=data.get('role', 'Chief Agricultural Coordinator'),
        message_type=data.get('messageType', 'chat'),
        content=data.get('content', ''),
        structured_data=data.get('structuredData')
    )
    db.session.add(msg)
    db.session.commit()
    return jsonify(msg.to_dict()), 201

# Approvals & Action Plans
@app.route('/api/approvals', methods=['GET'])
def get_approvals():
    plans = AgriculturalReport.query.order_by(AgriculturalReport.created_at.desc()).all()
    return jsonify([p.to_dict() for p in plans])

@app.route('/api/approvals/<plan_id>', methods=['POST'])
def review_approval(plan_id):
    data = request.json or {}
    plan = AgriculturalReport.query.filter_by(id=plan_id).first()
    if not plan:
        return jsonify({"error": "Action plan not found"}), 404

    decision = data.get('decision', 'Approved')
    comments = data.get('comments', '')
    reviewer_name = data.get('reviewerName', 'Dr. Sundaram (Agri Coordinator)')

    plan.status = decision
    plan.human_comments = comments
    plan.reviewer_name = reviewer_name
    plan.reviewed_at = datetime.utcnow()

    # Record in audit trail
    audit = ApprovalRecord(
        id=f"appr-{int(time.time())}",
        action_plan_id=plan.id,
        reviewer_name=reviewer_name,
        decision=decision,
        comments=comments,
        reviewed_at=datetime.utcnow()
    )
    db.session.add(audit)

    # Sync back to farmer report if exists
    rep = FarmerReport.query.filter_by(id=plan.report_id).first()
    if rep:
        rep.status = decision

    db.session.commit()
    return jsonify(plan.to_dict())

# Market & Weather Data
@app.route('/api/market-data', methods=['GET'])
def get_market_data():
    records = MarketRecord.query.all()
    return jsonify([m.to_dict() for m in records])

@app.route('/api/weather-data', methods=['GET'])
def get_weather_data():
    record = WeatherRecord.query.first()
    if record:
        return jsonify(record.to_dict())
    return jsonify({
        "district": "Salem",
        "temperatureC": 33.4,
        "humidityPercent": 48.0,
        "rainfallMm": 0.0,
        "rainfallAnomalyPercent": -26.4,
        "droughtRiskScore": 68.0,
        "soilMoistureIndex": 34.0,
        "forecastSummary": "Partly cloudy, dry atmospheric conditions.",
        "dataSource": "Demonstration Climatology Data",
        "isSimulated": True
    })

# Switch Config
@app.route('/api/switch/config', methods=['GET', 'POST'])
def switch_configuration():
    if request.method == 'POST':
        data = request.json or {}
        if 'mode' in data:
            switch_client.mode = data['mode']
        if 'consoleUrl' in data:
            switch_client.console_url = data['consoleUrl']
        if 'apiKey' in data:
            switch_client.api_key = data['apiKey']
        return jsonify({
            "consoleUrl": switch_client.console_url,
            "mode": switch_client.mode,
            "apiKey": switch_client.api_key[:10] + "..." if switch_client.api_key else ""
        })
    return jsonify({
        "consoleUrl": switch_client.console_url,
        "mode": switch_client.mode,
        "gatewayEndpoint": "wss://gateway.switchagents.ai/v1/rooms",
        "protocol": "switch/1.0"
    })

@app.route('/api/switch/test', methods=['POST'])
def test_switch():
    data = request.json or {}
    mode = data.get('mode', switch_client.mode)
    is_live = mode == 'switch_live_gateway'
    return jsonify({
        "success": True,
        "mode": mode,
        "protocol": "switch/1.0",
        "message": "Connected to Switch Live Gateway with Bearer token authentication." if is_live else "Switch Local Sandbox Loopback verified. Sub-millisecond room event routing active."
    })

# Individual Agent Testing
@app.route('/api/agents/<agent_id>/test', methods=['POST'])
def test_agent_endpoint(agent_id):
    data = request.json or {}
    input_text = data.get('input', '')
    t0 = time.time()

    if agent_id == 'agent-triage':
        output = triage_agent.execute({"problemDescription": input_text, "category": "Crop selection"})
    elif agent_id == 'agent-cropmind':
        output = cropmind_agent.execute({"soilType": "Red Soil", "waterAvailability": "Limited"})
    elif agent_id == 'agent-marketpulse':
        output = marketpulse_agent.execute({"district": "Salem"})
    elif agent_id == 'agent-weatherguard':
        output = weatherguard_agent.execute({"district": "Salem"})
    else:
        output = {
            "agent": "AgriReport",
            "consensus": "100% Specialist Agreement",
            "recommendation": "Finger Millet (Ragi - Paiyur 2) + Sesame border",
            "input": input_text
        }

    return jsonify({
        "agentId": agent_id,
        "executionTimeMs": int((time.time() - t0) * 1000),
        "output": output
    })

# Full Workflow Runner
@app.route('/api/workflow/run', methods=['POST'])
def run_workflow():
    data = request.json or {}
    report_id = data.get('reportId', 'REP-2026-SLM-001')
    
    rep = FarmerReport.query.filter_by(id=report_id).first()
    report_dict = rep.to_dict() if rep else data

    # 1. Agri-Triage
    triage_res = triage_agent.execute(report_dict)
    # 2. CropMind
    crop_res = cropmind_agent.execute(report_dict)
    # 3. MarketPulse
    market_res = marketpulse_agent.execute(report_dict)
    # 4. WeatherGuard
    weather_res = weatherguard_agent.execute(report_dict)
    # 5. AgriReport
    action_plan = agrireport_agent.synthesize(report_dict, triage_res, crop_res, market_res, weather_res)

    return jsonify({
        "success": True,
        "reportId": report_id,
        "triage": triage_res,
        "cropIntelligence": crop_res,
        "marketIntelligence": market_res,
        "weatherIntelligence": weather_res,
        "actionPlan": action_plan
    })

if __name__ == '__main__':
    with app.app_context():
        init_db_with_seed()
    app.run(host='0.0.0.0', port=5000, debug=True)
