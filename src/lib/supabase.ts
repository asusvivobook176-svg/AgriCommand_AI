/**
 * Supabase Client for AgriCommand AI
 * Provides a production-grade Supabase client when configured,
 * with an automatic, seamless local state fallback for offline/development environments.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database, UserRole } from '../types/database.types';
import {
  INITIAL_AGENTS,
  INITIAL_FARMERS,
  INITIAL_REPORTS,
  INITIAL_ROOMS,
  INITIAL_ACTION_PLANS,
  MARKET_DATA_RECORDS,
  WEATHER_FORECAST_DATA
} from '../data/mockData';

const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL as string | undefined;
const envAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(
  envUrl &&
  envAnonKey &&
  envUrl.startsWith('https://') &&
  !envUrl.includes('your-project') &&
  envAnonKey.length > 20
);

export const SUPABASE_URL = isSupabaseConfigured ? envUrl! : 'https://local-sandbox.agricommand.internal';
export const SUPABASE_ANON_KEY = isSupabaseConfigured ? envAnonKey! : 'local-sandbox-anon-key';

// In-Memory state store for resilient local fallback
class InMemoryDatabaseStore {
  public profiles: any[] = [
    {
      id: 'demo-coord-01',
      email: 'sundaram.agri@tamilnadu.gov.in',
      full_name: 'Dr. Sundaram (Agri Coordinator)',
      role: 'coordinator' as UserRole,
      phone: '+91 94432 55432',
      organization: 'Department of Agricultural Extension, Salem',
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  public farmers: any[] = INITIAL_FARMERS.map(f => ({
    id: f.id,
    name: f.name,
    phone: f.phone,
    state: f.state,
    district: f.district,
    village: f.village,
    land_size_acres: f.landAreaAcres,
    soil_type: f.soilType,
    irrigation_source: f.irrigationSource,
    primary_crops: [f.previousCrop, f.preferredCrop].filter(Boolean),
    profile_id: null,
    created_at: f.createdAt,
    updated_at: f.createdAt
  }));

  public farmer_reports: any[] = INITIAL_REPORTS.map(r => ({
    id: r.id,
    farmer_id: r.farmerId,
    report_type: 'crop_selection',
    crop_affected: r.previousCrop || 'Groundnut',
    urgency: r.priority.toLowerCase(),
    problem_description: r.problemDescription,
    symptoms: [],
    status: r.status === 'Approved' ? 'resolved' : r.status === 'Pending Human Approval' ? 'in_review' : 'pending',
    media_urls: [],
    created_at: r.submittedAt,
    updated_at: r.updatedAt
  }));

  public agents: any[] = INITIAL_AGENTS.map(a => ({
    id: a.id,
    name: a.name,
    role: a.role,
    system_prompt: a.description,
    status: 'idle',
    model: a.model,
    version: '1.0.0',
    capabilities: a.capabilities,
    created_at: new Date().toISOString()
  }));

  public collaboration_rooms: any[] = INITIAL_ROOMS.map(rm => ({
    id: rm.id,
    name: rm.title,
    purpose: rm.topic,
    report_id: rm.reportId,
    created_by_profile_id: 'demo-coord-01',
    status: rm.status === 'resolved' ? 'closed' : 'active',
    switch_room_id: `switch-room-${rm.id}`,
    switch_session_metadata: { mode: rm.switchServerMode },
    created_at: rm.createdAt,
    updated_at: rm.createdAt
  }));

  public room_members: any[] = INITIAL_ROOMS.flatMap(rm =>
    rm.members.map(m => ({
      id: `mem-${rm.id}-${m.id}`,
      room_id: rm.id,
      agent_id: m.type === 'agent' ? m.id : null,
      profile_id: m.type === 'human' ? m.id : null,
      role_in_room: m.role,
      joined_at: rm.createdAt
    }))
  );

  public agent_tasks: any[] = [];

  public agent_messages: any[] = INITIAL_ROOMS.flatMap(rm =>
    rm.messages.map(m => ({
      id: m.id,
      room_id: rm.id,
      agent_id: m.senderType === 'agent' ? m.senderId : null,
      profile_id: m.senderType === 'human' ? m.senderId : null,
      sender_name: m.senderName,
      sender_type: m.senderType === 'farmer' ? 'human' : m.senderType,
      content: m.content,
      structured_payload: m.structuredData || {},
      switch_message_id: `switch-evt-${m.id}`,
      switch_event_type: 'message.created',
      created_at: m.timestamp
    }))
  );

  public crop_recommendations: any[] = [
    {
      id: 'rec-001',
      room_id: 'room-rep-001-salem',
      farmer_id: 'farmer-ravi-kumar',
      primary_crop: 'Finger Millet (Ragi - Paiyur 2)',
      alternative_crops: ['Sesame (TMV 7)', 'Fodder Sorghum'],
      expected_yield_per_acre: 16.5,
      estimated_roi_percentage: 42.5,
      water_requirement_mm: 320,
      growing_duration_days: 105,
      rationale: 'Very low water requirement, thrives in Salem red soil, bullish APMC mandi price.',
      input_requirements: [{ item: 'Certified Paiyur 2 Seeds', quantity: '5 kg/acre' }],
      created_at: new Date().toISOString()
    }
  ];

  public market_records: any[] = MARKET_DATA_RECORDS.map(m => ({
    id: m.id,
    commodity_name: m.cropName,
    variety: 'Standard',
    market_center: m.marketName,
    state: 'Tamil Nadu',
    district: m.district,
    min_price_quintal: m.minPrice,
    modal_price_quintal: m.modalPrice,
    max_price_quintal: m.maxPrice,
    price_trend: m.priceTrend.toLowerCase(),
    arrival_date: m.date,
    is_simulated: m.isSimulated,
    data_source: m.dataSource,
    created_at: new Date().toISOString()
  }));

  public weather_records: any[] = [
    {
      id: WEATHER_FORECAST_DATA.id,
      location_name: WEATHER_FORECAST_DATA.district,
      latitude: 11.6643,
      longitude: 78.146,
      forecast_date: new Date().toISOString().split('T')[0],
      temperature_celsius: WEATHER_FORECAST_DATA.temperatureC,
      humidity_percent: WEATHER_FORECAST_DATA.humidityPercent,
      rainfall_probability_percent: 15,
      precipitation_mm: WEATHER_FORECAST_DATA.rainfallMm,
      advisory_notes: WEATHER_FORECAST_DATA.forecastSummary,
      is_simulated: WEATHER_FORECAST_DATA.isSimulated,
      created_at: new Date().toISOString()
    }
  ];

  public agricultural_reports: any[] = INITIAL_ACTION_PLANS.map(p => ({
    id: p.id,
    room_id: p.reportId === 'REP-2026-SLM-001' ? 'room-rep-001-salem' : null,
    farmer_id: 'farmer-ravi-kumar',
    title: `Agricultural Action Plan: ${p.farmerName} (${p.district})`,
    executive_summary: p.triageSummary,
    action_steps: p.actionItems,
    risk_analysis: {
      limitations: p.limitationsAndAssumptions,
      missingInfo: p.missingInformationIdentified,
      weatherRisk: p.weatherRiskSummary
    },
    status: p.humanReviewStatus === 'Approved' ? 'approved' : 'pending_approval',
    pdf_storage_path: `reports/${p.id}.pdf`,
    created_at: p.createdAt,
    updated_at: p.createdAt
  }));

  public approval_records: any[] = [];
}

export const localStore = new InMemoryDatabaseStore();

// Fallback Mock Client providing the exact query builder pattern
function createLocalFallbackClient() {
  const listeners: Record<string, Function[]> = {};

  return {
    from: (tableName: string) => {
      const getTable = () => (localStore as any)[tableName] || [];

      return {
        select: (columns: string = '*') => {
          let rows = [...getTable()];
          const queryBuilder: any = {
            order: (col: string, { ascending = true }: { ascending?: boolean } = {}) => {
              rows.sort((a, b) => {
                const valA = a[col];
                const valB = b[col];
                if (valA < valB) return ascending ? -1 : 1;
                if (valA > valB) return ascending ? 1 : -1;
                return 0;
              });
              return queryBuilder;
            },
            eq: (col: string, val: any) => {
              rows = rows.filter(r => r[col] === val);
              return queryBuilder;
            },
            limit: (count: number) => {
              rows = rows.slice(0, count);
              return queryBuilder;
            },
            single: async () => {
              return { data: rows[0] || null, error: rows[0] ? null : { message: 'Row not found' } };
            },
            then: (resolve: any) => {
              resolve({ data: rows, error: null });
            }
          };
          return queryBuilder;
        },
        insert: (data: any | any[]) => {
          const table = (localStore as any)[tableName];
          const newItems = Array.isArray(data) ? data : [data];
          const withIds = newItems.map(item => ({
            id: item.id || `local-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            created_at: item.created_at || new Date().toISOString(),
            ...item
          }));
          if (table) {
            table.push(...withIds);
          }
          // Notify any channel subscribers
          if (listeners[tableName]) {
            listeners[tableName].forEach(cb => withIds.forEach(item => cb({ eventType: 'INSERT', new: item })));
          }
          return {
            select: () => ({
              single: async () => ({ data: withIds[0], error: null }),
              then: (resolve: any) => resolve({ data: withIds, error: null })
            }),
            then: (resolve: any) => resolve({ data: withIds, error: null })
          };
        },
        update: (data: any) => {
          return {
            eq: (col: string, val: any) => {
              const table = (localStore as any)[tableName];
              let updatedCount = 0;
              if (table) {
                table.forEach((row: any) => {
                  if (row[col] === val) {
                    Object.assign(row, data, { updated_at: new Date().toISOString() });
                    updatedCount++;
                  }
                });
              }
              return {
                select: () => ({
                  then: (resolve: any) => resolve({ data: table ? table.filter((r: any) => r[col] === val) : [], error: null })
                }),
                then: (resolve: any) => resolve({ data: null, error: null })
              };
            }
          };
        },
        delete: () => {
          return {
            eq: (col: string, val: any) => {
              const table = (localStore as any)[tableName];
              if (table) {
                (localStore as any)[tableName] = table.filter((r: any) => r[col] !== val);
              }
              return { then: (resolve: any) => resolve({ data: null, error: null }) };
            }
          };
        }
      };
    },
    auth: {
      getSession: async () => {
        const stored = localStorage.getItem('agricommand_active_user');
        const user = stored ? JSON.parse(stored) : {
          id: 'demo-coord-01',
          email: 'sundaram.agri@tamilnadu.gov.in',
          user_metadata: { full_name: 'Dr. Sundaram (Agri Coordinator)', role: 'coordinator' }
        };
        return { data: { session: { user, access_token: 'local-demo-token' } }, error: null };
      },
      getUser: async () => {
        const stored = localStorage.getItem('agricommand_active_user');
        const user = stored ? JSON.parse(stored) : {
          id: 'demo-coord-01',
          email: 'sundaram.agri@tamilnadu.gov.in',
          user_metadata: { full_name: 'Dr. Sundaram (Agri Coordinator)', role: 'coordinator' }
        };
        return { data: { user }, error: null };
      },
      signInWithPassword: async ({ email }: { email: string }) => {
        const user = {
          id: `usr-${Date.now()}`,
          email,
          user_metadata: { full_name: email.split('@')[0], role: 'coordinator' }
        };
        localStorage.setItem('agricommand_active_user', JSON.stringify(user));
        return { data: { user, session: { user, access_token: 'local-token' } }, error: null };
      },
      signUp: async ({ email }: { email: string }) => {
        const user = {
          id: `usr-${Date.now()}`,
          email,
          user_metadata: { full_name: email.split('@')[0], role: 'farmer' }
        };
        localStorage.setItem('agricommand_active_user', JSON.stringify(user));
        return { data: { user, session: { user, access_token: 'local-token' } }, error: null };
      },
      signOut: async () => {
        localStorage.removeItem('agricommand_active_user');
        return { error: null };
      },
      onAuthStateChange: (callback: any) => {
        return {
          data: {
            subscription: {
              unsubscribe: () => {}
            }
          }
        };
      }
    },
    storage: {
      from: (bucketId: string) => ({
        getPublicUrl: (path: string) => ({
          data: { publicUrl: `/api/storage/${bucketId}/${path}` }
        }),
        download: async (path: string) => {
          const blob = new Blob([`AgriCommand Action Plan Content for ${path}`], { type: 'application/pdf' });
          return { data: blob, error: null };
        },
        upload: async (path: string, file: any) => {
          return { data: { path }, error: null };
        }
      })
    },
    channel: (channelName: string) => ({
      on: (event: string, schema: any, callback: Function) => {
        const table = schema?.table;
        if (table) {
          listeners[table] = listeners[table] || [];
          listeners[table].push(callback);
        }
        return {
          subscribe: () => ({
            unsubscribe: () => {
              if (table && listeners[table]) {
                listeners[table] = listeners[table].filter(cb => cb !== callback);
              }
            }
          })
        };
      }
    })
  } as unknown as SupabaseClient<Database>;
}

// Export singleton instance
export const supabase: SupabaseClient<Database> = isSupabaseConfigured
  ? createClient<Database>(envUrl!, envAnonKey!)
  : createLocalFallbackClient();
