/**
 * Server-Side Supabase Admin Client
 * Uses SUPABASE_SERVICE_ROLE_KEY to perform privileged writes (agent outputs, system audit logs)
 * with graceful in-memory storage fallback when unconfigured.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env, hasSupabaseConfig } from '../config/env';

// In-memory server-side records for fallback
const serverStore = {
  tasks: [] as any[],
  messages: [] as any[],
  reports: [] as any[],
  approvals: [] as any[],
  farmers: [] as any[]
};

let client: any = null;

if (hasSupabaseConfig && env.SUPABASE_URL) {
  const key = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY || '';
  client = createClient(env.SUPABASE_URL, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  console.log('[AgriCommand Supabase] Connected to live Supabase project:', env.SUPABASE_URL);
} else {
  console.log('[AgriCommand Supabase] Running in resilient local mode with server memory store.');
  client = {
    from: (table: string) => {
      const storeTable = (serverStore as any)[table] || [];
      return {
        select: (cols: string = '*') => ({
          order: () => ({
            then: (resolve: any) => resolve({ data: storeTable, error: null })
          }),
          eq: (col: string, val: any) => ({
            then: (resolve: any) => resolve({ data: storeTable.filter((r: any) => r[col] === val), error: null })
          }),
          then: (resolve: any) => resolve({ data: storeTable, error: null })
        }),
        insert: (data: any | any[]) => {
          const items = Array.isArray(data) ? data : [data];
          const stamped = items.map(item => ({
            id: item.id || `srv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            created_at: item.created_at || new Date().toISOString(),
            ...item
          }));
          storeTable.push(...stamped);
          return {
            select: () => ({
              single: async () => ({ data: stamped[0], error: null }),
              then: (resolve: any) => resolve({ data: stamped, error: null })
            }),
            then: (resolve: any) => resolve({ data: stamped, error: null })
          };
        },
        update: (data: any) => ({
          eq: (col: string, val: any) => {
            storeTable.forEach((r: any) => {
              if (r[col] === val) {
                Object.assign(r, data, { updated_at: new Date().toISOString() });
              }
            });
            return {
              select: () => ({
                then: (resolve: any) => resolve({ data: storeTable.filter((r: any) => r[col] === val), error: null })
              }),
              then: (resolve: any) => resolve({ data: null, error: null })
            };
          }
        })
      };
    }
  };
}

export const supabaseAdmin = client;
export const isServerSupabaseConnected = hasSupabaseConfig;
