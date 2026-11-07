/**
 * Server Environment Configuration & Zod Validation
 */
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('3000'),
  NODE_ENV: z.string().default('development'),
  GEMINI_API_KEY: z.string().optional(),
  SUPABASE_URL: z.string().url().optional().or(z.literal('')),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  VITE_SUPABASE_URL: z.string().optional(),
  VITE_SUPABASE_ANON_KEY: z.string().optional(),
  SWITCH_API_KEY: z.string().optional(),
  SWITCH_AGENT_TOKEN: z.string().optional(),
  SWITCH_SERVER_URL: z.string().default('https://api.switchagents.ai/v1')
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.warn('[AgriCommand Server] Environment validation warning:', parsed.error.format());
}

export const env = parsed.success ? parsed.data : {
  PORT: process.env.PORT || '3000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  SUPABASE_URL: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY,
  VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY,
  SWITCH_API_KEY: process.env.SWITCH_API_KEY,
  SWITCH_AGENT_TOKEN: process.env.SWITCH_AGENT_TOKEN,
  SWITCH_SERVER_URL: process.env.SWITCH_SERVER_URL || 'https://api.switchagents.ai/v1'
};

export const hasSupabaseConfig = Boolean(
  env.SUPABASE_URL &&
  env.SUPABASE_URL.startsWith('https://') &&
  !env.SUPABASE_URL.includes('your-project') &&
  (env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY)
);
