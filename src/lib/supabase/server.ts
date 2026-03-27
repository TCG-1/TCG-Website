import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getSupabasePublicConfig } from "@/lib/supabase/config";

export async function createClient() {
  const cookieStore = await cookies();
  const { supabasePublishableKey, supabaseUrl } = getSupabasePublicConfig();

  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, options, value }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot always write cookies directly.
          // The root proxy refreshes and persists session cookies for those requests.
        }
      },
    },
  });
}
