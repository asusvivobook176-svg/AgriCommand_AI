from datetime import datetime, date
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.String(64), primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(128), unique=True, nullable=False)
    role = db.Column(db.String(64), default='coordinator') # coordinator, expert, analyst, admin
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "createdAt": self.created_at.isoformat() if self.created_at else None
        }

class Farmer(db.Model):
    __tablename__ = 'farmers'
    id = db.Column(db.String(64), primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    phone = db.Column(db.String(32), nullable=False)
    village = db.Column(db.String(128), nullable=False)
    district = db.Column(db.String(128), nullable=False)
    state = db.Column(db.String(64), default='Tamil Nadu')
    land_area_acres = db.Column(db.Float, nullable=False)
    soil_type = db.Column(db.String(64), nullable=False)
    water_availability = db.Column(db.String(64), nullable=False)
    irrigation_source = db.Column(db.String(128))
    previous_crop = db.Column(db.String(64))
    current_season = db.Column(db.String(64))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    reports = db.relationship('FarmerReport', backref='farmer', lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "phone": self.phone,
            "village": self.village,
            "district": self.district,
            "state": self.state,
            "landAreaAcres": self.land_area_acres,
            "soilType": self.soil_type,
            "waterAvailability": self.water_availability,
            "irrigationSource": self.irrigation_source,
            "previousCrop": self.previous_crop,
            "currentSeason": self.current_season,
            "createdAt": self.created_at.isoformat() if self.created_at else None
        }

class FarmerReport(db.Model):
    __tablename__ = 'farmer_reports'
    id = db.Column(db.String(64), primary_key=True)
    farmer_id = db.Column(db.String(64), db.ForeignKey('farmers.id'), nullable=False)
    category = db.Column(db.String(64), nullable=False)
    problem_description = db.Column(db.Text, nullable=False)
    priority = db.Column(db.String(32), default='High')
    status = db.Column(db.String(64), default='Submitted')
    room_id = db.Column(db.String(64), nullable=False)
    image_url = db.Column(db.String(256), nullable=True)
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "farmerId": self.farmer_id,
            "farmerName": self.farmer.name if self.farmer else "Unknown Farmer",
            "village": self.farmer.village if self.farmer else "Salem",
            "district": self.farmer.district if self.farmer else "Salem",
            "landAreaAcres": self.farmer.land_area_acres if self.farmer else 2.0,
            "soilType": self.farmer.soil_type if self.farmer else "Red Soil",
            "waterAvailability": self.farmer.water_availability if self.farmer else "Limited",
            "previousCrop": self.farmer.previous_crop if self.farmer else "Groundnut",
            "currentSeason": self.farmer.current_season if self.farmer else "Summer 2026",
            "category": self.category,
            "problemDescription": self.problem_description,
            "priority": self.priority,
            "status": self.status,
            "roomId": self.room_id,
            "imageUrl": self.image_url,
            "submittedAt": self.submitted_at.isoformat() if self.submitted_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None
        }

class Agent(db.Model):
    __tablename__ = 'agents'
    id = db.Column(db.String(64), primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(128), nullable=False)
    status = db.Column(db.String(32), default='Online')
    avatar_color = db.Column(db.String(32), default='bg-emerald-600')
    description = db.Column(db.Text)
    model = db.Column(db.String(64), default='gemini-3.1-flash-lite')
    capabilities = db.Column(db.JSON, default=list)
    is_ml_powered = db.Column(db.Boolean, default=False)
    last_heartbeat = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "role": self.role,
            "status": self.status,
            "avatarColor": self.avatar_color,
            "description": self.description,
            "model": self.model,
            "capabilities": self.capabilities or [],
            "isMLPowered": self.is_ml_powered,
            "lastHeartbeat": self.last_heartbeat.isoformat() if self.last_heartbeat else None
        }

class CollaborationRoom(db.Model):
    __tablename__ = 'collaboration_rooms'
    id = db.Column(db.String(64), primary_key=True)
    report_id = db.Column(db.String(64), db.ForeignKey('farmer_reports.id'), nullable=False)
    title = db.Column(db.String(256), nullable=False)
    topic = db.Column(db.Text)
    status = db.Column(db.String(32), default='active')
    switch_mode = db.Column(db.String(32), default='sandbox')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    messages = db.relationship('AgentMessage', backref='room', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            "id": self.id,
            "reportId": self.report_id,
            "title": self.title,
            "topic": self.topic,
            "status": self.status,
            "switchServerMode": self.switch_mode,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "members": [
                { "id": "human-coord", "name": "Dr. Sundaram (Agri Coordinator)", "type": "human", "role": "Chief Agricultural Coordinator", "status": "Online" },
                { "id": "agent-triage", "name": "Agri-Triage", "type": "agent", "role": "Triage Specialist", "status": "Online" },
                { "id": "agent-cropmind", "name": "CropMind", "type": "agent", "role": "Agronomist & ML Model", "status": "Online" },
                { "id": "agent-marketpulse", "name": "MarketPulse", "type": "agent", "role": "Market Analyst", "status": "Online" },
                { "id": "agent-weatherguard", "name": "WeatherGuard", "type": "agent", "role": "Meteorologist", "status": "Online" },
                { "id": "agent-agrireport", "name": "AgriReport", "type": "agent", "role": "Synthesis & Reporting", "status": "Online" }
            ],
            "messages": [m.to_dict() for m in self.messages]
        }

class RoomMember(db.Model):
    __tablename__ = 'room_members'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    room_id = db.Column(db.String(64), db.ForeignKey('collaboration_rooms.id'), nullable=False)
    member_id = db.Column(db.String(64), nullable=False)
    member_name = db.Column(db.String(128), nullable=False)
    member_type = db.Column(db.String(32), nullable=False) # 'agent' or 'human'
    role = db.Column(db.String(128))
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "roomId": self.room_id,
            "memberId": self.member_id,
            "memberName": self.member_name,
            "memberType": self.member_type,
            "role": self.role,
            "joinedAt": self.joined_at.isoformat() if self.joined_at else None
        }

class AgentTask(db.Model):
    __tablename__ = 'agent_tasks'
    id = db.Column(db.String(64), primary_key=True)
    report_id = db.Column(db.String(64), db.ForeignKey('farmer_reports.id'), nullable=False)
    room_id = db.Column(db.String(64), db.ForeignKey('collaboration_rooms.id'), nullable=False)
    assigned_agent_id = db.Column(db.String(64), db.ForeignKey('agents.id'), nullable=False)
    task_type = db.Column(db.String(64), nullable=False)
    status = db.Column(db.String(32), default='pending') # pending, in_progress, completed, failed
    task_payload = db.Column(db.JSON)
    result_payload = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "reportId": self.report_id,
            "roomId": self.room_id,
            "assignedAgentId": self.assigned_agent_id,
            "taskType": self.task_type,
            "status": self.status,
            "taskPayload": self.task_payload,
            "resultPayload": self.result_payload,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "completedAt": self.completed_at.isoformat() if self.completed_at else None
        }

class AgentMessage(db.Model):
    __tablename__ = 'agent_messages'
    id = db.Column(db.String(64), primary_key=True)
    room_id = db.Column(db.String(64), db.ForeignKey('collaboration_rooms.id'), nullable=False)
    sender_type = db.Column(db.String(32), nullable=False) # 'agent', 'human', 'farmer', 'system'
    sender_id = db.Column(db.String(64), nullable=False)
    sender_name = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(128), nullable=True)
    message_type = db.Column(db.String(64), default='chat')
    content = db.Column(db.Text, nullable=False)
    structured_data = db.Column(db.JSON, nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "roomId": self.room_id,
            "senderType": self.sender_type,
            "senderId": self.sender_id,
            "senderName": self.sender_name,
            "role": self.role,
            "messageType": self.message_type,
            "content": self.content,
            "structuredData": self.structured_data,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None
        }

class CropRecommendation(db.Model):
    __tablename__ = 'crop_recommendations'
    id = db.Column(db.String(64), primary_key=True)
    report_id = db.Column(db.String(64), db.ForeignKey('farmer_reports.id'), nullable=False)
    crop_name = db.Column(db.String(128), nullable=False)
    suitability_score = db.Column(db.Float, nullable=False)
    water_requirement = db.Column(db.String(32))
    duration_days = db.Column(db.String(64))
    soil_compatibility = db.Column(db.String(64))
    reasoning = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "reportId": self.report_id,
            "cropName": self.crop_name,
            "suitabilityScore": self.suitability_score,
            "waterRequirement": self.water_requirement,
            "durationDays": self.duration_days,
            "soilCompatibility": self.soil_compatibility,
            "reasoning": self.reasoning,
            "createdAt": self.created_at.isoformat() if self.created_at else None
        }

class MarketRecord(db.Model):
    __tablename__ = 'market_records'
    id = db.Column(db.String(64), primary_key=True)
    crop_name = db.Column(db.String(128), nullable=False)
    market_name = db.Column(db.String(128), nullable=False)
    district = db.Column(db.String(128), nullable=False)
    min_price = db.Column(db.Float)
    max_price = db.Column(db.Float)
    modal_price = db.Column(db.Float, nullable=False)
    arrival_quantity = db.Column(db.Float, default=100.0)
    price_trend = db.Column(db.String(32), default='Bullish')
    data_source = db.Column(db.String(64), default='Agmarknet Verified Sample')
    is_simulated = db.Column(db.Boolean, default=True)
    recorded_date = db.Column(db.String(32), default='2026-11-05')

    def to_dict(self):
        return {
            "id": self.id,
            "cropName": self.crop_name,
            "marketName": self.market_name,
            "district": self.district,
            "minPrice": self.min_price,
            "maxPrice": self.max_price,
            "modalPrice": self.modal_price,
            "arrivalQuantityQuintals": self.arrival_quantity,
            "priceTrend": self.price_trend,
            "dataSource": self.data_source,
            "isSimulated": self.is_simulated,
            "date": self.recorded_date
        }

class WeatherRecord(db.Model):
    __tablename__ = 'weather_records'
    id = db.Column(db.String(64), primary_key=True)
    district = db.Column(db.String(128), nullable=False)
    temperature_c = db.Column(db.Float, default=33.4)
    humidity_percent = db.Column(db.Float, default=48.0)
    rainfall_anomaly_percent = db.Column(db.Float, default=-26.4)
    drought_risk_score = db.Column(db.Float, default=68.0)
    soil_moisture_index = db.Column(db.Float, default=34.0)
    summary = db.Column(db.Text)
    data_source = db.Column(db.String(64), default='Demonstration Climatology Data')
    is_simulated = db.Column(db.Boolean, default=True)
    recorded_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "district": self.district,
            "temperatureC": self.temperature_c,
            "humidityPercent": self.humidity_percent,
            "rainfallMm": 0.0,
            "windSpeedKmh": 11.2,
            "rainfallAnomalyPercent": self.rainfall_anomaly_percent,
            "droughtRiskScore": self.drought_risk_score,
            "soilMoistureIndex": self.soil_moisture_index,
            "forecastSummary": self.summary,
            "dataSource": self.data_source,
            "isSimulated": self.is_simulated,
            "timestamp": self.recorded_at.isoformat() if self.recorded_at else None
        }

class AgriculturalReport(db.Model):
    __tablename__ = 'agricultural_reports'
    id = db.Column(db.String(64), primary_key=True)
    report_id = db.Column(db.String(64), db.ForeignKey('farmer_reports.id'), nullable=False)
    farmer_name = db.Column(db.String(128), nullable=False)
    district = db.Column(db.String(128), nullable=False)
    version = db.Column(db.Integer, default=1)
    primary_crop = db.Column(db.String(128), nullable=False)
    secondary_crop = db.Column(db.String(128))
    triage_summary = db.Column(db.Text)
    crop_summary = db.Column(db.Text)
    market_summary = db.Column(db.Text)
    weather_summary = db.Column(db.Text)
    action_items = db.Column(db.JSON)
    limitations = db.Column(db.JSON)
    missing_info = db.Column(db.JSON)
    status = db.Column(db.String(32), default='Pending') # Pending, Approved, Rejected, Revision Requested
    reviewer_name = db.Column(db.String(128))
    human_comments = db.Column(db.Text)
    reviewed_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "reportId": self.report_id,
            "farmerName": self.farmer_name,
            "district": self.district,
            "version": self.version,
            "primaryCropRecommended": self.primary_crop,
            "secondaryCropRecommended": self.secondary_crop,
            "triageSummary": self.triage_summary,
            "cropAnalysisSummary": self.crop_summary,
            "marketAnalysisSummary": self.market_summary,
            "weatherRiskSummary": self.weather_summary,
            "actionItems": self.action_items or [],
            "limitationsAndAssumptions": self.limitations or [],
            "missingInformationIdentified": self.missing_info or [],
            "humanReviewStatus": self.status,
            "reviewerName": self.reviewer_name,
            "humanComments": self.human_comments,
            "reviewedAt": self.reviewed_at.isoformat() if self.reviewed_at else None,
            "createdAt": self.created_at.isoformat() if self.created_at else None
        }

class ApprovalRecord(db.Model):
    __tablename__ = 'approval_records'
    id = db.Column(db.String(64), primary_key=True)
    action_plan_id = db.Column(db.String(64), db.ForeignKey('agricultural_reports.id'), nullable=False)
    reviewer_name = db.Column(db.String(128), nullable=False)
    decision = db.Column(db.String(32), nullable=False) # Approved, Rejected, Revision Requested
    comments = db.Column(db.Text)
    reviewed_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "actionPlanId": self.action_plan_id,
            "reviewerName": self.reviewer_name,
            "decision": self.decision,
            "comments": self.comments,
            "reviewedAt": self.reviewed_at.isoformat() if self.reviewed_at else None
        }
