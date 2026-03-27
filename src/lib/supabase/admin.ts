import { createClient } from "@supabase/supabase-js";

import { getSupabaseAdminConfig, hasSupabaseAdminConfig } from "@/lib/supabase/config";

export const careersBucket = process.env.SUPABASE_CAREERS_BUCKET ?? "career-applications";

export function isSupabaseConfigured() {
  return hasSupabaseAdminConfig();
}

export function getSupabaseConfigError() {
  return "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY.";
}

export function createSupabaseAdminClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const { supabaseServiceRoleKey, supabaseUrl } = getSupabaseAdminConfig();

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
