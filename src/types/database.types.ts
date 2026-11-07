/**
 * Supabase Database TypeScript Definitions for AgriCommand AI
 * Matches all 13 tables defined in /supabase/migrations/20261105000000_initial_agricommand_schema.sql
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'admin' | 'coordinator' | 'expert' | 'field_officer' | 'farmer';
export type ReportType = 'crop_disease' | 'weather_risk' | 'market_advisory' | 'soil_nutrient' | 'general_consultation';
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';
export type ReportStatus = 'pending' | 'triaged' | 'in_review' | 'resolved';
export type AgentStatus = 'idle' | 'processing' | 'completed' | 'failed';
export type RoomStatus = 'open' | 'active' | 'review' | 'closed';
export type TaskStatus = 'assigned' | 'in_progress' | 'completed' | 'failed';
export type SenderType = 'agent' | 'human' | 'system';
export type PriceTrend = 'bullish' | 'stable' | 'bearish';
export type AgriReportStatus = 'draft' | 'pending_approval' | 'approved' | 'rejected';
export type ApprovalDecision = 'approved' | 'modification_requested' | 'rejected';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: UserRole;
          phone: string | null;
          organization: string;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          role?: UserRole;
          phone?: string | null;
          organization?: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          role?: UserRole;
          phone?: string | null;
          organization?: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      farmers: {
        Row: {
          id: string;
          name: string;
          phone: string;
          state: string;
          district: string;
          village: string;
          land_size_acres: number;
          soil_type: string;
          irrigation_source: string;
          primary_crops: string[];
          profile_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone: string;
          state: string;
          district: string;
          village: string;
          land_size_acres?: number;
          soil_type: string;
          irrigation_source: string;
          primary_crops?: string[];
          profile_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string;
          state?: string;
          district?: string;
          village?: string;
          land_size_acres?: number;
          soil_type?: string;
          irrigation_source?: string;
          primary_crops?: string[];
          profile_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      farmer_reports: {
        Row: {
          id: string;
          farmer_id: string;
          report_type: ReportType;
          crop_affected: string;
          urgency: UrgencyLevel;
          problem_description: string;
          symptoms: string[];
          status: ReportStatus;
          media_urls: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          farmer_id: string;
          report_type: ReportType;
          crop_affected: string;
          urgency: UrgencyLevel;
          problem_description: string;
          symptoms?: string[];
          status?: ReportStatus;
          media_urls?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          farmer_id?: string;
          report_type?: ReportType;
          crop_affected?: string;
          urgency?: UrgencyLevel;
          problem_description?: string;
          symptoms?: string[];
          status?: ReportStatus;
          media_urls?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      agents: {
        Row: {
          id: string;
          name: string;
          role: string;
          system_prompt: string;
          status: AgentStatus;
          model: string;
          version: string;
          capabilities: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          role: string;
          system_prompt: string;
          status?: AgentStatus;
          model?: string;
          version?: string;
          capabilities?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          role?: string;
          system_prompt?: string;
          status?: AgentStatus;
          model?: string;
          version?: string;
          capabilities?: Json;
          created_at?: string;
        };
      };
      collaboration_rooms: {
        Row: {
          id: string;
          name: string;
          purpose: string;
          report_id: string | null;
          created_by_profile_id: string | null;
          status: RoomStatus;
          switch_room_id: string | null;
          switch_session_metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          purpose: string;
          report_id?: string | null;
          created_by_profile_id?: string | null;
          status?: RoomStatus;
          switch_room_id?: string | null;
          switch_session_metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          purpose?: string;
          report_id?: string | null;
          created_by_profile_id?: string | null;
          status?: RoomStatus;
          switch_room_id?: string | null;
          switch_session_metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      room_members: {
        Row: {
          id: string;
          room_id: string;
          agent_id: string | null;
          profile_id: string | null;
          role_in_room: string;
          joined_at: string;
        };
        Insert: {
          id?: string;
          room_id: string;
          agent_id?: string | null;
          profile_id?: string | null;
          role_in_room?: string;
          joined_at?: string;
        };
        Update: {
          id?: string;
          room_id?: string;
          agent_id?: string | null;
          profile_id?: string | null;
          role_in_room?: string;
          joined_at?: string;
        };
      };
      agent_tasks: {
        Row: {
          id: string;
          room_id: string;
          agent_id: string;
          task_name: string;
          status: TaskStatus;
          input_data: Json;
          output_data: Json;
          confidence_score: number | null;
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          room_id: string;
          agent_id: string;
          task_name: string;
          status?: TaskStatus;
          input_data?: Json;
          output_data?: Json;
          confidence_score?: number | null;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          room_id?: string;
          agent_id?: string;
          task_name?: string;
          status?: TaskStatus;
          input_data?: Json;
          output_data?: Json;
          confidence_score?: number | null;
          created_at?: string;
          completed_at?: string | null;
        };
      };
      agent_messages: {
        Row: {
          id: string;
          room_id: string;
          agent_id: string | null;
          profile_id: string | null;
          sender_name: string;
          sender_type: SenderType;
          content: string;
          structured_payload: Json;
          switch_message_id: string | null;
          switch_event_type: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          room_id: string;
          agent_id?: string | null;
          profile_id?: string | null;
          sender_name: string;
          sender_type: SenderType;
          content: string;
          structured_payload?: Json;
          switch_message_id?: string | null;
          switch_event_type?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          room_id?: string;
          agent_id?: string | null;
          profile_id?: string | null;
          sender_name?: string;
          sender_type?: SenderType;
          content?: string;
          structured_payload?: Json;
          switch_message_id?: string | null;
          switch_event_type?: string | null;
          created_at?: string;
        };
      };
      crop_recommendations: {
        Row: {
          id: string;
          room_id: string | null;
          farmer_id: string | null;
          primary_crop: string;
          alternative_crops: string[];
          expected_yield_per_acre: number;
          estimated_roi_percentage: number;
          water_requirement_mm: number;
          growing_duration_days: number;
          rationale: string;
          input_requirements: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          room_id?: string | null;
          farmer_id?: string | null;
          primary_crop: string;
          alternative_crops?: string[];
          expected_yield_per_acre: number;
          estimated_roi_percentage: number;
          water_requirement_mm: number;
          growing_duration_days: number;
          rationale: string;
          input_requirements?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          room_id?: string | null;
          farmer_id?: string | null;
          primary_crop?: string;
          alternative_crops?: string[];
          expected_yield_per_acre?: number;
          estimated_roi_percentage?: number;
          water_requirement_mm?: number;
          growing_duration_days?: number;
          rationale?: string;
          input_requirements?: Json;
          created_at?: string;
        };
      };
      market_records: {
        Row: {
          id: string;
          commodity_name: string;
          variety: string | null;
          market_center: string;
          state: string;
          district: string;
          min_price_quintal: number;
          modal_price_quintal: number;
          max_price_quintal: number;
          price_trend: PriceTrend;
          arrival_date: string;
          is_simulated: boolean;
          data_source: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          commodity_name: string;
          variety?: string | null;
          market_center: string;
          state: string;
          district: string;
          min_price_quintal: number;
          modal_price_quintal: number;
          max_price_quintal: number;
          price_trend: PriceTrend;
          arrival_date?: string;
          is_simulated?: boolean;
          data_source?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          commodity_name?: string;
          variety?: string | null;
          market_center?: string;
          state?: string;
          district?: string;
          min_price_quintal?: number;
          modal_price_quintal?: number;
          max_price_quintal?: number;
          price_trend?: PriceTrend;
          arrival_date?: string;
          is_simulated?: boolean;
          data_source?: string | null;
          created_at?: string;
        };
      };
      weather_records: {
        Row: {
          id: string;
          location_name: string;
          latitude: number;
          longitude: number;
          forecast_date: string;
          temperature_celsius: number;
          humidity_percent: number;
          rainfall_probability_percent: number;
          precipitation_mm: number;
          advisory_notes: string | null;
          is_simulated: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          location_name: string;
          latitude: number;
          longitude: number;
          forecast_date?: string;
          temperature_celsius: number;
          humidity_percent: number;
          rainfall_probability_percent: number;
          precipitation_mm: number;
          advisory_notes?: string | null;
          is_simulated?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          location_name?: string;
          latitude?: number;
          longitude?: number;
          forecast_date?: string;
          temperature_celsius?: number;
          humidity_percent?: number;
          rainfall_probability_percent?: number;
          precipitation_mm?: number;
          advisory_notes?: string | null;
          is_simulated?: boolean;
          created_at?: string;
        };
      };
      agricultural_reports: {
        Row: {
          id: string;
          room_id: string | null;
          farmer_id: string | null;
          title: string;
          executive_summary: string;
          action_steps: Json;
          risk_analysis: Json;
          status: AgriReportStatus;
          pdf_storage_path: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          room_id?: string | null;
          farmer_id?: string | null;
          title: string;
          executive_summary: string;
          action_steps?: Json;
          risk_analysis?: Json;
          status?: AgriReportStatus;
          pdf_storage_path?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          room_id?: string | null;
          farmer_id?: string | null;
          title?: string;
          executive_summary?: string;
          action_steps?: Json;
          risk_analysis?: Json;
          status?: AgriReportStatus;
          pdf_storage_path?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      approval_records: {
        Row: {
          id: string;
          report_id: string;
          reviewed_by_profile_id: string | null;
          reviewer_name: string;
          reviewer_role: string;
          decision: ApprovalDecision;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          report_id: string;
          reviewed_by_profile_id?: string | null;
          reviewer_name: string;
          reviewer_role?: string;
          decision: ApprovalDecision;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          report_id?: string;
          reviewed_by_profile_id?: string | null;
          reviewer_name?: string;
          reviewer_role?: string;
          decision?: ApprovalDecision;
          notes?: string | null;
          created_at?: string;
        };
      };
    };
  };
}
