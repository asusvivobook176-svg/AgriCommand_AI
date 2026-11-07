/**
 * Supabase Data Service Layer for AgriCommand AI
 * Provides strongly-typed database operations, Realtime subscriptions,
 * and Storage interactions for the 12 frontend workspaces.
 */

import { supabase } from '../lib/supabase';
import type { ApprovalDecision, ReportType, UrgencyLevel } from '../types/database.types';

export interface CreateFarmerInput {
  name: string;
  phone: string;
  state: string;
  district: string;
  village: string;
  land_size_acres: number;
  soil_type: string;
  irrigation_source: string;
  primary_crops?: string[];
}

export interface CreateReportInput {
  farmer_id: string;
  report_type: ReportType;
  crop_affected: string;
  urgency: UrgencyLevel;
  problem_description: string;
  symptoms?: string[];
}

export interface PostMessageInput {
  room_id: string;
  sender_name: string;
  sender_type: 'agent' | 'human' | 'system';
  content: string;
  structured_payload?: any;
  agent_id?: string | null;
  profile_id?: string | null;
  switch_message_id?: string;
}

const db = supabase as any;

export const supabaseService = {
  // --------------------------------------------------------------------------
  // Farmers
  // --------------------------------------------------------------------------
  async getFarmers() {
    const { data, error } = await db
      .from('farmers')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async createFarmer(input: CreateFarmerInput) {
    const { data, error } = await db
      .from('farmers')
      .insert({
        ...input,
        primary_crops: input.primary_crops || []
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // --------------------------------------------------------------------------
  // Farmer Reports
  // --------------------------------------------------------------------------
  async getFarmerReports() {
    const { data, error } = await db
      .from('farmer_reports')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async createFarmerReport(input: CreateReportInput) {
    const { data, error } = await db
      .from('farmer_reports')
      .insert({
        ...input,
        status: 'pending',
        symptoms: input.symptoms || [],
        media_urls: []
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateReportStatus(reportId: string, status: 'pending' | 'triaged' | 'in_review' | 'resolved') {
    const { data, error } = await db
      .from('farmer_reports')
      .update({ status })
      .eq('id', reportId)
      .select();
    if (error) throw error;
    return data;
  },

  // --------------------------------------------------------------------------
  // Collaboration Rooms & Messages
  // --------------------------------------------------------------------------
  async getCollaborationRooms() {
    const { data, error } = await db
      .from('collaboration_rooms')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getRoomMessages(roomId: string) {
    const { data, error } = await db
      .from('agent_messages')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async postMessage(input: PostMessageInput) {
    const { data, error } = await db
      .from('agent_messages')
      .insert({
        room_id: input.room_id,
        sender_name: input.sender_name,
        sender_type: input.sender_type,
        content: input.content,
        structured_payload: input.structured_payload || {},
        agent_id: input.agent_id || null,
        profile_id: input.profile_id || null,
        switch_message_id: input.switch_message_id || `msg-${Date.now()}`
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  subscribeToRoomMessages(roomId: string, onNewMessage: (msg: any) => void) {
    return db
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'agent_messages', filter: `room_id=eq.${roomId}` },
        (payload: any) => {
          onNewMessage(payload.new);
        }
      )
      .subscribe();
  },

  // --------------------------------------------------------------------------
  // Agricultural Reports & Human Approvals
  // --------------------------------------------------------------------------
  async getAgriculturalReports() {
    const { data, error } = await db
      .from('agricultural_reports')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getApprovalRecords(reportId?: string) {
    let query = db.from('approval_records').select('*').order('created_at', { ascending: false });
    if (reportId) {
      query = query.eq('report_id', reportId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async submitApproval(input: {
    report_id: string;
    reviewer_name: string;
    reviewer_role: string;
    decision: ApprovalDecision;
    notes?: string;
  }) {
    // 1. Insert audit log in approval_records
    const { data: approval, error: approvalErr } = await db
      .from('approval_records')
      .insert({
        report_id: input.report_id,
        reviewer_name: input.reviewer_name,
        reviewer_role: input.reviewer_role,
        decision: input.decision,
        notes: input.notes || null
      })
      .select()
      .single();
    if (approvalErr) throw approvalErr;

    // 2. Update agricultural_reports status
    const newStatus = input.decision === 'approved' ? 'approved' : 'rejected';
    await db
      .from('agricultural_reports')
      .update({ status: newStatus })
      .eq('id', input.report_id);

    return approval;
  },

  subscribeToApprovals(onNewApproval: (approval: any) => void) {
    return db
      .channel('public:approvals')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'approval_records' },
        (payload: any) => {
          onNewApproval(payload.new);
        }
      )
      .subscribe();
  },

  // --------------------------------------------------------------------------
  // Market & Weather Records
  // --------------------------------------------------------------------------
  async getMarketRecords() {
    const { data, error } = await db
      .from('market_records')
      .select('*')
      .order('commodity_name', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async getWeatherRecords(locationName?: string) {
    let query = db.from('weather_records').select('*').order('forecast_date', { ascending: true });
    if (locationName) {
      query = query.eq('location_name', locationName);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // --------------------------------------------------------------------------
  // Storage: Action Plan Report Download
  // --------------------------------------------------------------------------
  async downloadReportDocument(path: string) {
    const { data, error } = await db.storage.from('agricultural-reports').download(path);
    if (error) throw error;
    return data;
  },

  getReportPublicUrl(path: string) {
    return db.storage.from('agricultural-reports').getPublicUrl(path).data.publicUrl;
  }
};
