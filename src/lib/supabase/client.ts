import { createBrowserClient } from "@supabase/ssr";

import { getSupabasePublicConfig } from "@/lib/supabase/config";

export function createClient() {
  const { supabasePublishableKey, supabaseUrl } = getSupabasePublicConfig();

  return createBrowserClient(supabaseUrl, supabasePublishableKey);
}
